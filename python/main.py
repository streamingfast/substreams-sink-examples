import grpc
import os
import requests
import time
import yaml
from collections import deque
from abc import ABC, abstractmethod
import sys

import sf.substreams.v1.package_pb2 as package_pb2
import sf.substreams.rpc.v2.service_pb2 as service_pb2
import sf.substreams.rpc.v2.service_pb2_grpc as service_pb2_grpc
import sf.substreams.solana.type.v1.account_pb2 as account_pb2

CURSOR_FILE = "cursor.yml"
BLOCK_HISTORY_SIZE = 20
INACTIVITY_TIMEOUT = 2  # seconds


class EventProcessor(ABC):
    """Abstract base class for processing events."""
    @abstractmethod
    def process_event(self, event):
        pass


class DefaultEventProcessor(EventProcessor):
    """Default implementation of EventProcessor."""
    def process_event(self, event):
        import base58
        print(f"Processing event:", base58.b58encode(event.address).decode('utf-8'))


class SubstreamsClient:
    def __init__(self, package_url, module, start_block_num=-1, stop_block_num=None):
        self.package_url = package_url
        self.module = module
        self.start_block_num = start_block_num
        self.stop_block_num = stop_block_num
        self.package = self.read_spkg_from_url_or_path(package_url)
        self.cursor_data = None if start_block_num != -1 else self.load_cursor()
        self.block_history = deque(maxlen=BLOCK_HISTORY_SIZE)
        self.last_data_time = time.time()

    def read_spkg_from_url_or_path(self, spkg_path):
        """Reads a Substreams package from either a URL or a local file path."""
        package = package_pb2.Package()
        if spkg_path.startswith("http://") or spkg_path.startswith("https://"):
            print(f"Downloading package from URL: {spkg_path}")
            response = requests.get(spkg_path)
            response.raise_for_status()
            package.ParseFromString(response.content)
        else:
            with open(spkg_path, "rb") as f:
                package.ParseFromString(f.read())
        return package

    def save_cursor(self, cursor, block_number):
        """Save the cursor and block number to a YAML file."""
        with open(CURSOR_FILE, "w") as file:
            yaml.dump({"cursor": cursor, "block": {"number": block_number}}, file)
        print(f"Saved cursor: {cursor}, Block: {block_number}")

    def load_cursor(self):
        """Load the cursor and block number from a YAML file."""
        if os.path.exists(CURSOR_FILE):
            with open(CURSOR_FILE, "r") as file:
                cursor_data = yaml.safe_load(file)
                print(f"Loaded cursor from file: {cursor_data}")
                return cursor_data
        return None

    def handle_block_scoped_data(self, data, event_processor):
        """Handle block-scoped data and process events using the given event processor."""
        output = data.output.map_output
        events = account_pb2.FilteredAccounts()

        if not output.Unpack(events):
            print(f"Failed to unpack events for block {data.clock.number}")
            return

        block_number = data.clock.number
        cursor = data.cursor
        self.last_data_time = time.time()  # Reset the inactivity timer

        # Process events if any
        if not events.accounts:
            print(f"No events found in block {block_number}")

        for event in events.accounts:
            event_processor.process_event(event)

        # Save cursor and block number
        self.save_cursor(cursor, block_number)

        # Terminate if stop block number is reached
        if self.stop_block_num is not None and block_number >= self.stop_block_num:
            print(f"Reached stop block {self.stop_block_num}. Terminating...")
            sys.exit(0)

        time.sleep(0.05)

    def handle_block_undo_signal(self, undo_data):
        """Handle block undo signals by removing affected blocks."""
        last_valid_block = undo_data.last_valid_block
        print(f"Received block undo signal for block: {last_valid_block}")

        while self.block_history and self.block_history[-1]["block_number"] > last_valid_block:
            removed_block = self.block_history.pop()
            print(f"Removed block {removed_block['block_number']} due to undo signal")


    def start_stream(self, event_processor):
        """Start the gRPC stream and handle the connection."""
        sf_api_token = os.getenv("SUBSTREAMS_API_TOKEN")
        creds = grpc.ssl_channel_credentials()
        metadata = [("authorization", f"Bearer {sf_api_token}")]

        # Store the initial start block to differentiate between provided and cursor-based streaming
        initial_start_block = self.start_block_num

        while True:
            try:
                with grpc.secure_channel("accounts.mainnet.sol.streamingfast.io:443", creds) as channel:
                    stub = service_pb2_grpc.StreamStub(channel)

                    # Determine the starting point for streaming
                    if initial_start_block != -1:
                        # If a specific start block was provided, ignore the cursor
                        print(f"Starting from block {initial_start_block} (ignoring saved cursor)")
                        start_block = initial_start_block
                        cursor = None
                    else:
                        # If no start block was provided, use the saved cursor if available
                        if self.cursor_data:
                            print(f"Resuming from saved cursor at block {self.cursor_data['block']['number']}")
                            start_block = self.cursor_data["block"]["number"]
                            cursor = self.cursor_data.get("cursor")
                        else:
                            print("No cursor found, starting from the earliest available block")
                            start_block = -1
                            cursor = None

                    # Create the gRPC request
                    request = service_pb2.Request(
                        start_block_num=start_block,
                        stop_block_num=self.stop_block_num,
                        modules=self.package.modules,
                        output_module=self.module,
                        production_mode=True,
                        start_cursor=cursor
                    )

                    print(f"Starting stream from block {start_block} with cursor: {cursor}")
                    stream = stub.Blocks(request, metadata=metadata)

                    for response in stream:
                        message_type = response.WhichOneof("message")
                        if message_type == "block_scoped_data":
                            self.handle_block_scoped_data(response.block_scoped_data, event_processor)
                        elif message_type == "block_undo_signal":
                            self.handle_block_undo_signal(response.block_undo_signal)

                        # Reset inactivity timer
                        self.last_data_time = time.time()

                        # Check if stop block is reached and terminate if so
                        if self.stop_block_num is not None and self.block_history[-1][
                            "block_number"] >= self.stop_block_num:
                            print(f"Reached stop block {self.stop_block_num}. Terminating...")
                            sys.exit(0)

                    # Check for inactivity timeout
                    if time.time() - self.last_data_time > INACTIVITY_TIMEOUT:
                        print("Inactivity detected.")

                        if initial_start_block == -1:
                            # Restart using the last processed block if no specific start block was provided
                            last_processed_block = self.block_history[-1]["block_number"] if self.block_history else -1
                            print(f"Restarting stream from last processed block: {last_processed_block}")
                            self.start_block_num = last_processed_block
                            self.cursor_data = None  # Clear cursor to restart from last processed block
                        else:
                            # Restart using the original start block if provided
                            print(f"Restarting stream from initial block {initial_start_block}")
                            self.start_block_num = initial_start_block

                        break  # Restart the stream

            except grpc.RpcError as e:
                print(f"gRPC error: {e}. Reconnecting in 5 seconds...")
                time.sleep(5)

                # Reload cursor only if no explicit start block is given
                if initial_start_block == -1:
                    self.cursor_data = self.load_cursor()


def main():
    if len(sys.argv) < 3:
        print("Usage: python main.py <package_url_or_path> <module_name> [start_block] [stop_block]")
        sys.exit(1)

    package_url = sys.argv[1]
    module = sys.argv[2]
    start_block_num = int(sys.argv[3]) if len(sys.argv) > 3 else -1
    stop_block_num = int(sys.argv[4]) if len(sys.argv) > 4 else None

    client = SubstreamsClient(package_url, module, start_block_num, stop_block_num)
    event_processor = DefaultEventProcessor()
    client.start_stream(event_processor)


if __name__ == "__main__":
    main()
