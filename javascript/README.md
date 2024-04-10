## Substreams Sink Examples - JS

The [Substreams JS library](https://github.com/substreams-js/substreams-js) allows you to consume Substreams packages using the JavaScript programming language. The library works on both NodeJS and the Browser, but with some differences.

### Persisting the Cursor

Consuming a Substreams package involves opening a stream long-live gRPC connection. Disconnections will happen and it is necessary to create a reconnection mechanism that starts reading exactly where the stream was interrupted. The **cursor** provided by Substream must be persisted and, in the case of a disconnection, the latest committed cursor must be used.

You can read more about this topic in the [Substreams docs](https://substreams.streamingfast.io/documentation/consume/reliability-guarantees).

### NodeJS vs Browser

- **Libraries:** running Substreams JS on NodeJS requires using the `@connectrpc/connect-node` library, while consuming packages on the browser requires using `@connectrpc/connect-web`.
- **Persisting the cursor:** when using NodeJS, you can persist the cursor in a file or a database. When using the browser, you can use the local storage, cookies or an external API. 