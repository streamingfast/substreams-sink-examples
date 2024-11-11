import grpc
import sys
import os
import requests
import time
from collections import deque
from abc import ABC, abstractmethod

import sf.substreams.v1.package_pb2 as package_pb2
import sf.substreams.rpc.v2.service_pb2 as service_pb2
import sf.substreams.rpc.v2.service_pb2_grpc as service_pb2_grpc
import sf.solana.spl.token.v1.spl_token_pb2 as spl_token_pb2
import sf.solana.type.v1.account_pb2 as account_pb2

CURSOR_FILE = "cursor.txt"
BLOCK_HISTORY_SIZE = 20


def read_spkg_from_url(url):
    response = requests.get(url)
    response.raise_for_status()
    package = package_pb2.Package()
    package.ParseFromString(response.content)
    return package


def save_cursor_to_file(cursor):
    """Save the cursor to a file for resuming later."""
    with open(CURSOR_FILE, "w") as file:
        file.write(cursor)
    print(f"Cursor saved: {cursor}")


def get_cursor_from_file():
    """Get the cursor from the saved file if it exists."""
    if os.path.exists(CURSOR_FILE):
        with open(CURSOR_FILE, "r") as file:
            cursor = file.read().strip()
            print(f"Loaded cursor from file: {cursor}")
            return cursor
    return None


class EventProcessor(ABC):
    """Abstract base class for processing events."""

    @abstractmethod
    def process_event(self, event):
        pass


class DefaultEventProcessor(EventProcessor):
    """Default implementation of EventProcessor."""

    def process_event(self, event):
        print(f"Processing event: {event}")


def handle_block_scoped_data(data, module, event_processor):
    """Handle block-scoped data and yield events."""
    output = data.output.map_output
    import ipdb; ipdb.set_trace()
    events = account_pb2.AccountBlock()

    # Attempt to unpack the events
    if not output.Unpack(events):
        print(f"Failed to unpack events for block {data.clock.number}")
        return

    block_number = data.clock.number
    cursor = data.cursor

    print(f"Processing block {block_number}, Cursor: {cursor}")

    # If no events are found, log and continue
    if not events.data:
        print(f"No events found in block {block_number}")

    # Yield events for processing
    for event in events.accounts:
        event_processor.process_event(event)

    # Save cursor to file after processing each block
    save_cursor_to_file(cursor)
    time.sleep(0.05)


def start_stream(package, module, start_block_num, stop_block_num, cursor, event_processor):
    """Start the gRPC stream and handle the connection."""
    sf_api_token = os.getenv("SUBSTREAMS_API_TOKEN")
    creds = grpc.ssl_channel_credentials()
    metadata = [("authorization", f"Bearer {sf_api_token}")]

    while True:
        try:
            with grpc.secure_channel("accounts.mainnet.sol.streamingfast.io:443", creds) as channel:
                stub = service_pb2_grpc.StreamStub(channel)
                import ipdb; ipdb.set_trace()
                request = service_pb2.Request(
                    start_block_num=start_block_num,
                    stop_block_num=stop_block_num,
                    modules=package.modules,
                    output_module=module,
                    production_mode=True,
                    start_cursor=cursor if cursor else None,
                )

                print("Waiting for stream to start...")
                stream = stub.Blocks(request, metadata=metadata)

                for response in stream:
                    message_type = response.WhichOneof("message")
                    if message_type == "block_scoped_data":
                        handle_block_scoped_data(response.block_scoped_data, module, event_processor)

        except grpc.RpcError as e:
            print(f"gRPC error: {e}. Reconnecting in 5 seconds...")
            time.sleep(5)
            if stop_block_num is None:
                cursor = get_cursor_from_file()


def main():
    if len(sys.argv) < 3:
        print("Usage: python main.py <package_url> <module_name> [start_block] [stop_block]")
        sys.exit(1)

    package_url = sys.argv[1]
    module = sys.argv[2]
    start_block_num = int(sys.argv[3]) if len(sys.argv) > 3 else -1
    stop_block_num = int(sys.argv[4]) if len(sys.argv) > 4 else None

    package = read_spkg_from_url(package_url)

    # Load saved cursor if no stop_block is provided
    cursor = None
    if stop_block_num is None:
        cursor = get_cursor_from_file()

    # Create an instance of the event processor
    event_processor = DefaultEventProcessor()

    # Start the gRPC stream
    start_stream(package, module, start_block_num, stop_block_num, cursor, event_processor)


if __name__ == "__main__":
    main()
