package io.streamingfast.sink;

import io.grpc.ConnectivityState;
import io.grpc.ManagedChannel;
import io.grpc.Metadata;
import io.grpc.netty.NettyChannelBuilder;
import io.grpc.stub.MetadataUtils;
import java.net.URI;
import java.util.concurrent.TimeUnit;

/**
 * Builds Netty-transport gRPC channels towards a Substreams endpoint.
 *
 * <p>A fresh channel is built on every (re)connection attempt: after a silent connection death the old channel's
 * HTTP/2 transport can still be considered healthy by grpc-java, so reusing it would just hang again.
 */
final class SubstreamsEndpoint {

    private static final Metadata.Key<String> X_API_KEY = Metadata.Key.of("x-api-key", Metadata.ASCII_STRING_MARSHALLER);

    private final Config config;
    private final String host;
    private final int port;
    private final boolean plaintext;

    SubstreamsEndpoint(Config config) {
        this.config = config;

        String endpoint = config.endpoint();
        if (!endpoint.contains("://")) {
            endpoint = "https://" + endpoint;
        }

        URI uri = URI.create(endpoint);
        this.plaintext = uri.getScheme().equals("http");
        this.host = uri.getHost();
        this.port = uri.getPort() > 0 ? uri.getPort() : (plaintext ? 80 : 443);
    }

    @Override
    public String toString() {
        return (plaintext ? "http://" : "https://") + host + ":" + port;
    }

    ManagedChannel newChannel() {
        NettyChannelBuilder builder = NettyChannelBuilder.forAddress(host, port);
        if (plaintext) {
            builder.usePlaintext();
        } else {
            builder.useTransportSecurity();
        }

        if (config.authority() != null) {
            builder.overrideAuthority(config.authority());
        }

        // Only touched when explicitly configured; otherwise grpc-java defaults apply (keepalive disabled).
        config.keepAliveTime().ifPresent(d -> builder.keepAliveTime(d.toNanos(), TimeUnit.NANOSECONDS));
        config.keepAliveTimeout().ifPresent(d -> builder.keepAliveTimeout(d.toNanos(), TimeUnit.NANOSECONDS));
        config.keepAliveWithoutCalls().ifPresent(builder::keepAliveWithoutCalls);

        Metadata headers = new Metadata();
        if (config.apiKey() != null) {
            headers.put(X_API_KEY, config.apiKey());
        }
        builder.intercept(MetadataUtils.newAttachHeadersInterceptor(headers));

        ManagedChannel channel = builder.build();
        watchState(channel, channel.getState(false));
        return channel;
    }

    /** Logs every connectivity transition (CONNECTING, READY, TRANSIENT_FAILURE, IDLE, SHUTDOWN). */
    private static void watchState(ManagedChannel channel, ConnectivityState last) {
        if (last == ConnectivityState.SHUTDOWN) {
            return;
        }

        channel.notifyWhenStateChanged(last, () -> {
            ConnectivityState now = channel.getState(false);
            Log.info("CHANNEL state %s -> %s", last, now);
            watchState(channel, now);
        });
    }
}
