## Substreams Go Sink Example

The following example shows how to consume a Substreams package using the Go programming language in a production environment. This means dealing with disconnections and persisting the cursor to avoid reading the data twice, or missing information.

> [!NOTE]
> We highly recommend to use this example for any serious sink implementation!

To run the example:

```bash
# We assume you are in ./substreams-sink-examples/go

# Or use short notation for packages in the registry
go run . sink substreams_template@v0.1.0


# Endpoint is inferred from the manifest
go run . sink https://spkg.io/streamingfast/substreams-eth-block-meta-v0.4.3.spkg db_out


# Or override the endpoint explicitly
go run . sink https://spkg.io/streamingfast/substreams-eth-block-meta-v0.4.3.spkg db_out --endpoint mainnet.eth.streamingfast.io:443
```

Note also the availability of `go run . sink --help` which gives you most configuration option for free:

```bash
$ go run . sink --help
Run the sinker code

Usage:
  sinker sink [<manifest> [<output_module>]] [flags]

Flags:
      --api-key-envvar string            Name of variable containing Substreams Api Key (default "SUBSTREAMS_API_KEY")
      --api-token-envvar string          name of variable containing Substreams Authentication token (default "SUBSTREAMS_API_TOKEN")
      --development-mode                 Enable development mode, use it for testing purpose only, should not be used for production workload
  -e, --endpoint network_name            Substreams gRPC endpoint (supports http:// or https:// prefix). If empty, will be replaced by the SUBSTREAMS_ENDPOINT_{network_name} environment variable, where network_name is determined from the substreams manifest. Defaults to SSL unless prefixed with `http://` or if `--plaintext` flag is used.
      --final-blocks-only                Only process blocks that have pass finality, to prevent any reorg and undo signal by staying further away from the chain HEAD
      --force-protocol-version int       Force the use of a specific protocol version (0=unset: v3 with fallback, 2=v2, 3=v3)
  -H, --header strings                   Additional headers to be sent in the substreams request
  -h, --help                             help for sink
      --insecure                         Skip certificate validation on GRPC connection
      --live-block-time-delta duration   Consider chain live if block time is within this number of seconds of current time. If disabled, liveness is based on the cursor being 'finalized' or not
      --max-retries int                  Maximum number of retries for substreams calls (0 disables retries, -1 for infinite retries) -- Counter is reset when we receive actual data (default 3)
      --network string                   Specify the network to use for params and initialBlocks, overriding the 'network' field in the substreams package
      --noop-mode                        Sends the request to the server with 'noop-mode', which will not send actual data, only populate the cache
  -p, --params stringArray               Set a params for parameterizable modules. Can be specified multiple times. Ex: -p module1=valA -p module2=valX&valY
      --plaintext                        Use plaintext connection as default for endpoints without an http:// or https:// prefix
      --skip-package-validation          Do not perform any validation when reading substreams package
  -s, --start-block string               Start block to stream from. If empty, will be replaced by initialBlock of the first module you are streaming. If negative, will be resolved by the server relative to the chain head
  -t, --stop-block string                Stop block to end stream at, exclusively. If the start-block is positive, a '+' prefix can indicate 'relative to start-block' (default "0")
      --undo-buffer-size int             Number of blocks to keep buffered to handle fork reorganizations
```