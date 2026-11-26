use std::{fmt::Display, sync::Arc};

use anyhow::{anyhow, Context};
use connectrpc::client::{
    CallOptions, ClientConfig, Http2Connection, ServerStream, SharedHttp2Connection,
};
use connectrpc::Protocol;
use http::{uri::Scheme, Uri};

use crate::pb::sf::substreams::rpc::v3::Request;
use crate::pb::sf::substreams::rpc::v4::ResponseView;
use crate::pb_connect::sf::substreams::rpc::v4::StreamClient;

/// Same limit as the previous tonic based implementation.
const MAX_DECODING_MESSAGE_SIZE: usize = 10 * 1024 * 1024;

/// Stream of `Response` messages (as zero-copy views) returned by the `Blocks` RPC.
pub type ResponseStream = ServerStream<
    <SharedHttp2Connection as connectrpc::client::ClientTransport>::ResponseBody,
    ResponseView<'static>,
>;

#[derive(Clone)]
pub struct SubstreamsEndpoint {
    pub uri: String,
    client: StreamClient<SharedHttp2Connection>,
}

impl Display for SubstreamsEndpoint {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        Display::fmt(self.uri.as_str(), f)
    }
}

impl SubstreamsEndpoint {
    pub async fn new<S: AsRef<str>>(url: S, api_key: Option<String>) -> Result<Self, anyhow::Error> {
        let uri = url
            .as_ref()
            .parse::<Uri>()
            .context("the url should be a valid Uri")?;

        // The connection is established lazily on first use and re-established on its own
        // if it drops, so a failing endpoint surfaces as an error on the first request.
        let connection = match uri.scheme().unwrap_or(&Scheme::HTTP).as_str() {
            "http" => Http2Connection::lazy_plaintext(uri.clone()),
            "https" => Http2Connection::lazy_tls(uri.clone(), Arc::new(tls_config()?)),
            scheme => return Err(anyhow!("invalid uri scheme '{}' for substreams endpoint", scheme)),
        };

        // Substreams endpoints speak gRPC, the Connect protocol is not served on the same port.
        let mut config = ClientConfig::new(uri.clone())
            .with_protocol(Protocol::Grpc)
            .with_default_max_message_size(MAX_DECODING_MESSAGE_SIZE);

        if let Some(api_key) = &api_key {
            config = config.with_default_header("x-api-key", api_key.as_str());
        }

        Ok(SubstreamsEndpoint {
            uri: uri.to_string(),
            client: StreamClient::new(connection.shared(1024), config),
        })
    }

    pub async fn substreams(
        self: Arc<Self>,
        request: Request,
    ) -> Result<ResponseStream, connectrpc::ConnectError> {
        self.client
            .blocks_with_options(request, CallOptions::default())
            .await
    }
}

/// TLS configuration trusting the platform's native root certificates (ALPN `h2`
/// is negotiated by the connection itself).
fn tls_config() -> Result<rustls::ClientConfig, anyhow::Error> {
    let mut roots = rustls::RootCertStore::empty();
    let native = rustls_native_certs::load_native_certs();
    for cert in native.certs {
        // Ignore certificates the platform ships that rustls cannot parse.
        let _ = roots.add(cert);
    }

    if roots.is_empty() {
        return Err(anyhow!("no native root certificates could be loaded"));
    }

    Ok(rustls::ClientConfig::builder()
        .with_root_certificates(roots)
        .with_no_client_auth())
}
