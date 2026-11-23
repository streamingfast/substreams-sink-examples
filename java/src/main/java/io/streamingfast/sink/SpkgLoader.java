package io.streamingfast.sink;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.regex.Pattern;
import sf.substreams.v1.ModulesOuterClass.Module;
import sf.substreams.v1.PackageOuterClass.Package;

/** Loads an {@code .spkg} from the registry ({@code name@version}), an HTTP(S) URL or a local file. */
final class SpkgLoader {

    static final String REGISTRY_URL = "https://spkg.io";

    private static final Pattern PACKAGE_NAME = Pattern.compile("^([a-zA-Z][a-zA-Z0-9_-]{0,63})$");
    private static final Pattern VERSION = Pattern.compile("^v?\\d+\\.\\d+\\.\\d+(-[0-9A-Za-z.-]+)?(\\+[0-9A-Za-z.-]+)?$");

    private SpkgLoader() {}

    static Package load(String input, List<Config.Param> params) throws IOException, InterruptedException {
        String location = input;
        String registryRef = registryReference(input);
        if (registryRef != null) {
            location = REGISTRY_URL + "/v1/packages/" + registryRef;
        }

        Package pkg;
        if (location.startsWith("http")) {
            pkg = Package.parseFrom(fetch(location));
        } else {
            pkg = Package.parseFrom(Files.readAllBytes(Path.of(location)));
        }

        return applyParams(pkg, params);
    }

    /** Replaces the params input (always the first input of a module) of each module named in {@code params}. */
    static Package applyParams(Package pkg, List<Config.Param> params) {
        if (params.isEmpty()) {
            return pkg;
        }

        Package.Builder builder = pkg.toBuilder();
        for (Config.Param param : params) {
            var modules = builder.getModulesBuilder();
            for (int i = 0; i < modules.getModulesCount(); i++) {
                Module.Builder module = modules.getModulesBuilder(i);
                if (module.getName().equals(param.moduleName()) && module.getInputsCount() > 0) {
                    module.getInputsBuilder(0)
                            .setParams(Module.Input.Params.newBuilder().setValue(param.expression()));
                }
            }
        }

        return builder.build();
    }

    /** Returns {@code <name>/<version>} when the input is a {@code name[@version]} registry reference, else null. */
    static String registryReference(String input) {
        String[] parts = input.split("@", -1);
        if (parts.length > 2 || !PACKAGE_NAME.matcher(parts[0]).matches()) {
            return null;
        }

        if (parts.length == 1 || parts[1].isEmpty() || parts[1].equals("latest")) {
            return parts[0] + "/latest";
        }

        if (!VERSION.matcher(parts[1]).matches()) {
            throw new IllegalArgumentException("version '" + parts[1] + "' is not valid Semver format");
        }

        return parts[0] + "/" + parts[1];
    }

    private static byte[] fetch(String url) throws IOException, InterruptedException {
        HttpClient client = HttpClient.newBuilder().followRedirects(HttpClient.Redirect.ALWAYS).build();
        HttpResponse<byte[]> response = client.send(
                HttpRequest.newBuilder(URI.create(url)).GET().build(), HttpResponse.BodyHandlers.ofByteArray());
        if (response.statusCode() != 200) {
            throw new IOException("fetch package '" + url + "' failed with HTTP status " + response.statusCode());
        }

        return response.body();
    }

    static Module findModule(Package pkg, String name) {
        return pkg.getModules().getModulesList().stream()
                .filter(m -> m.getName().equals(name))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("module '" + name + "' not found in package"));
    }
}
