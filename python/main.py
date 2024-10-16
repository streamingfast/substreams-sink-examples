import grpc
import sys
import os
import requests

import sf.substreams.v1.package_pb2 as package_pb2
import sf.substreams.rpc.v2.service_pb2 as service_pb2
import sf.substreams.rpc.v2.service_pb2_grpc as service_pb2_grpc
import sf.solana.spl.token.v1.spl_token_pb2 as spl_token_pb2


def read_spkg_file(file_path):
    package = package_pb2.Package()

    with open(file_path, "rb") as file:
        package.ParseFromString(file.read())

    return package


def read_spkg_from_url(url):
    response = requests.get(url)
    response.raise_for_status()  # Raise an error for bad status codes
    package = package_pb2.Package()
    package.ParseFromString(response.content)
    return package


def main():
    sf_api_token = os.getenv("SF_API_TOKEN")
    if not sf_api_token:
        print("Error: SF_API_TOKEN environment variable is not defined.")
        sys.exit(1)

    input = "https://github.com/streamingfast/substreams-solana-spl-token/raw/refs/heads/master/tokens/solana-spl-token-v0.1.0.spkg"
    module = "map_block"

    if input.startswith("http"):
        package = read_spkg_from_url(input)
    else:
        package = read_spkg_file(input)

    # Create a Blocks request
    request = service_pb2.Request(
        start_block_num=200010000,
        stop_block_num=200015000,
        modules=package.modules,
        output_module=module,
        production_mode=True,
    )

    # Create a credentials object
    creds = grpc.ssl_channel_credentials()

    print("Create a secure channel using the credentials")
    with grpc.secure_channel("mainnet.sol.streamingfast.io:443", creds) as channel:
        stub = service_pb2_grpc.StreamStub(channel)
        metadata = [("authorization", f"Bearer {sf_api_token}")]
        stream = stub.Blocks(request, metadata=metadata)

        print("Waiting for stream to start...")
        for response in stream:
            if response.WhichOneof("message") == "block_scoped_data":
                data = response.block_scoped_data
                if data.output.name == module:
                    output = data.output.map_output
                    events = spl_token_pb2.Events()
                    succeed = output.Unpack(events)
                    if succeed != True:
                        raise Exception(
                            "Invalid target type, field to unpack is of type {} but tried to unpack it into type {}".format(
                                output.TypeName(), output.DESCRIPTOR.full_name
                            )
                        )

                    print("Solana Token Events:")
                    for event in events.data:
                        print(event)


if __name__ == "__main__":
    main()
