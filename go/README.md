## Substreams Go Sink Example

The following example shows how to consume a Substreams package using the Go programming language in a production environment. This means dealing with disconnections and persisting the cursor to avoid reading the data twice, or missing information.

The example uses our `github.com/streamingfast/cli` command definition which is just a thin wrapper around `cobra` and `viper`. Any `cobra` command should work with the library, but there is no need to follow the CLI pattern.

> [!NOTE]
> We highly recommend to use this example for any serious sink implementation!

To run the example:

```bash
# We assume you are in ./substreams-sink-examples/go
go run . sink mainnet.eth.streamingfast.io:443 https://spkg.io/streamingfast/ethereum-explorer-v0.1.2.spkg db_out
```

Note also the availability of `go run . sink --help` which gives you most configuration option for free:

```bash
$ go run . sink --help
Run the sinker code

Usage:
  sinker sink <endpoint> <manifest> [<output_module>] [flags]

Flags:
      --development-mode                 Enable development mode, use it for testing purpose only, should not be used for production workload
      --final-blocks-only                Get only final blocks
  -H, --header stringArray               Additional headers to be sent in the substreams request
  -h, --help                             help for sink
      --infinite-retry                   Default behavior is to retry 15 times spanning approximatively 5m before exiting with an error, activating this flag will retry forever
  -k, --insecure                         Skip certificate validation on gRPC connection
      --irreversible-only                Get only irreversible blocks (DEPRECATED: Renamed to --final-blocks-only)
      --live-block-time-delta duration   Consider chain live if block time is within this number of seconds of current time (default 5m0s)
  -n, --network string                   Specify network, overriding the default one in the manifest or .spkg
  -p, --params -p <module>=<value>       Set a params for parameterizable modules of the from -p <module>=<value>, can be specified multiple times (e.g. -p module1=valA -p module2=valX&valY)
      --plaintext                        Establish gRPC connection in plaintext
      --skip-package-validation          Skip .spkg file validation, allowing the use of a partial spkg (without metadata and protobuf definitons)
      --undo-buffer-size int             Number of blocks to keep buffered to handle fork reorganizations (default 12)
```