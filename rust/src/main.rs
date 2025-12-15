use anyhow::{anyhow, format_err, Context, Error};
use chrono::DateTime;
use futures03::StreamExt;
use lazy_static::lazy_static;
use pb::sf::substreams::rpc::v2::{BlockScopedData, BlockUndoSignal};
use pb::sf::substreams::v1::Package;
use regex::Regex;
use semver::Version;

use crate::pb::sf::substreams::v1::module::input::{Input, Params};
use prost::Message;
use std::{env, process::exit, sync::Arc};
use substreams::SubstreamsEndpoint;
use substreams_stream::{BlockResponse, SubstreamsStream};

mod pb;
mod substreams;
mod substreams_stream;

lazy_static! {
    static ref MODULE_NAME_REGEXP: Regex = Regex::new(r"^([a-zA-Z][a-zA-Z0-9_-]{0,63})$").unwrap();
}

const REGISTRY_URL: &str = "https://spkg.io";

#[tokio::main]
async fn main() -> Result<(), Error> {
    // Reversed as we are going to pop each arguments later
    let mut args: Vec<_> = env::args()
        .skip(1)
        .filter(|arg| !arg.starts_with("--"))
        .rev()
        .collect();

    if args.len() <= 2 || args.len() >= 5 {
        println!("usage: <endpoint> <spkg> <module> [<start>:<stop>] [--params=<params>]");
        println!();
        println!("<spkg> can either be the full spkg.io link or `spkg_package@version`");
        println!();
        println!("(Optional) Flag <params> is a comma separated list of module name to filter expression");
        println!("that should be passed to the module. Each entry should be in the form of");
        println!("<module_name>:<filter_expr>, like map_block:(type:transfer). Multiple parameters can be");
        println!("passed by separating them with a comma --params=\"module_one:(type:transfer && attr:action),module_two:(type:transfer)\".");
        println!();
        println!("Examples");
        println!(" # From genesis and and onwards forever");
        println!(" cargo run -- mainnet.eth.streamingfast.io:443 common@v0.1.0 map_clocks 0:");
        println!("");
        println!(" # From current head block (-1) and onwards forever");
        println!(" cargo run -- mainnet.eth.streamingfast.io:443 common@v0.1.0 map_clocks -1:");
        println!("");
        println!(" # With module parameters for filtering");
        println!(" cargo run -- mainnet.eth.streamingfast.io:443 ethereum-common@v0.3.1 filtered_transactions --params=\"filtered_transactions:(call_method:0xa9059cbb)\" 21000000:+1");
        println!();
        println!("The environment variable SUBSTREAMS_API_TOKEN must be set also");
        println!("and should contain a valid Substream API token.");
        exit(1);
    }

    let params = env::args()
        .find(|arg| arg.starts_with("--params"))
        .map(|input| read_params_flag(&input))
        .unwrap_or_else(|| Ok(Vec::new()))?;

    let mut endpoint_url = args.pop().unwrap();
    let package_file = args.pop().unwrap();
    let module_name = args.pop().unwrap();
    let block_range = args.pop();

    if !endpoint_url.starts_with("http") {
        endpoint_url = format!("{}://{}", "https", &endpoint_url);
    }

    let token_env = env::var("SUBSTREAMS_API_TOKEN").unwrap_or("".to_string());

    let mut token: Option<String> = None;
    if token_env.len() > 0 {
        token = Some(token_env);
    }

    let package = read_package(&package_file, params).await?;
    let block_range = read_block_range(&package, &module_name, block_range)?;
    let endpoint = Arc::new(SubstreamsEndpoint::new(&endpoint_url, token).await?);

    let cursor: Option<String> = load_persisted_cursor()?;

    let mut stream = SubstreamsStream::new(
        endpoint,
        cursor,
        Some(package),
        module_name.to_string(),
        block_range.0,
        block_range.1,
    );

    loop {
        match stream.next().await {
            None => {
                println!("Stream consumed");
                break;
            }
            Some(Ok(BlockResponse::New(data))) => {
                process_block_scoped_data(&data)?;
                persist_cursor(data.cursor)?;
            }
            Some(Ok(BlockResponse::Undo(undo_signal))) => {
                process_block_undo_signal(&undo_signal)?;
                persist_cursor(undo_signal.last_valid_cursor)?;
            }
            Some(Err(err)) => {
                println!();
                println!("Stream terminated with error");
                println!("{:?}", err);
                exit(1);
            }
        }
    }

    Ok(())
}

fn process_block_scoped_data(data: &BlockScopedData) -> Result<(), Error> {
    let output = data.output.as_ref().unwrap().map_output.as_ref().unwrap();

    // You can decode the actual Any type received using this code:
    //
    //     let value = GeneratedStructName::decode(output.value.as_slice())?;
    //
    // Where GeneratedStructName is the Rust code generated for the Protobuf representing
    // your type, so you will need generate it using `substreams protogen` and import it from the
    // `src/pb` folder.

    let clock = data.clock.as_ref().unwrap();
    let timestamp = clock.timestamp.as_ref().unwrap();
    let date = DateTime::from_timestamp(timestamp.seconds, timestamp.nanos as u32)
        .expect("received timestamp should always be valid");

    println!(
        "Block #{} - Payload {} ({} bytes) - Drift {}s",
        clock.number,
        output.type_url.replace("type.googleapis.com/", ""),
        output.value.len(),
        date.signed_duration_since(chrono::offset::Utc::now())
            .num_seconds()
            * -1
    );

    Ok(())
}

fn process_block_undo_signal(_undo_signal: &BlockUndoSignal) -> Result<(), anyhow::Error> {
    // `BlockUndoSignal` must be treated as "delete every data that has been recorded after
    // block height specified by block in BlockUndoSignal". In the example above, this means
    // you must delete changes done by `Block #7b` and `Block #6b`. The exact details depends
    // on your own logic. If for example all your added record contain a block number, a
    // simple way is to do `delete all records where block_num > 5` which is the block num
    // received in the `BlockUndoSignal` (this is true for append only records, so when only `INSERT` are allowed).
    unimplemented!("you must implement some kind of block undo handling, or request only final blocks (tweak substreams_stream.rs)")
}

fn persist_cursor(_cursor: String) -> Result<(), anyhow::Error> {
    // FIXME: Handling of the cursor is missing here. It should be saved each time
    // a full block has been correctly processed/persisted. The saving location
    // is your responsibility.
    //
    // By making it persistent, we ensure that if we crash, on startup we are
    // going to read it back from database and start back our SubstreamsStream
    // with it ensuring we are continuously streaming without ever losing a single
    // element.
    Ok(())
}

fn load_persisted_cursor() -> Result<Option<String>, anyhow::Error> {
    // FIXME: Handling of the cursor is missing here. It should be loaded from
    // somewhere (local file, database, cloud storage) and then `SubstreamStream` will
    // be able correctly resume from the right block.
    Ok(None)
}

fn read_block_range(
    pkg: &Package,
    module_name: &str,
    block_range: Option<String>,
) -> Result<(i64, u64), anyhow::Error> {
    let module = pkg
        .modules
        .as_ref()
        .unwrap()
        .modules
        .iter()
        .find(|m| m.name == module_name)
        .ok_or_else(|| format_err!("module '{}' not found in package", module_name))?;

    let mut input: String = "".to_string();
    if let Some(range) = block_range {
        input = range;
    };

    let (prefix, suffix) = match input.split_once(":") {
        Some((prefix, suffix)) => (prefix.to_string(), suffix.to_string()),
        None => ("".to_string(), input),
    };

    let start: i64 = match prefix.as_str() {
        "" => module.initial_block as i64,
        x if x.starts_with("+") => {
            let block_count = x
                .trim_start_matches("+")
                .parse::<u64>()
                .context("argument <stop> is not a valid integer")?;

            (module.initial_block + block_count) as i64
        }
        x => x
            .parse::<i64>()
            .context("argument <start> is not a valid integer")?,
    };

    let stop: u64 = match suffix.as_str() {
        "" => 0,
        "-" => 0,
        x if x.starts_with("+") => {
            let block_count = x
                .trim_start_matches("+")
                .parse::<u64>()
                .context("argument <stop> is not a valid integer")?;

            start as u64 + block_count
        }
        x => x
            .parse::<u64>()
            .context("argument <stop> is not a valid integer")?,
    };

    return Ok((start, stop));
}

async fn read_package(input: &str, params: Vec<Param>) -> Result<Package, Error> {
    let mut mutable_input = input.to_string();

    let val = parse_standard_package_and_version(input);
    if val.is_ok() {
        let package_and_version = val?;
        mutable_input = format!(
            "{}/v1/packages/{}/{}",
            REGISTRY_URL, package_and_version.0, package_and_version.1
        );
    }

    let mut package = if mutable_input.starts_with("http") {
        read_http_package(&mutable_input).await
    } else {
        // Assume it's a local file
        let content = std::fs::read(&mutable_input)
            .context(format_err!("read package from file '{}'", mutable_input))?;
        Package::decode(content.as_ref()).context("decode command")
    }?;

    if params.len() > 0 {
        // Find the module by name and apply the block filter
        if let Some(modules) = &mut package.modules {
            for param in params {
                if let Some(module) = modules
                    .modules
                    .iter_mut()
                    .find(|m| m.name == param.module_name)
                {
                    module.inputs[0].input = Some(Input::Params(Params {
                        value: param.expression,
                    }));
                }
            }
        }
        Ok(package)
    } else {
        Ok(package)
    }
}

/// Reads the module name and filter from the input string.
///
/// Example input would be `filtered_events:(type:transfer)`
fn read_params_flag(input: &str) -> anyhow::Result<Vec<Param>> {
    let mut params = vec![];

    let value = input
        .trim_start_matches("--params")
        .trim()
        .trim_start_matches("=")
        .trim();
    if value.is_empty() {
        return Err(anyhow!(
            "wrong --params input value '{}': empty string",
            value
        ));
    }

    for param in value.split(",") {
        match param.split_once(":") {
            Some((module_name, expression)) => params.push(Param {
                module_name: module_name.trim().to_string(),
                expression: expression.trim().to_string(),
            }),
            None => {
                return Err(anyhow!(
                    "wrong --params value for '{}': missing ':' delimiter",
                    param
                ))
            }
        }
    }

    Ok(params)
}

async fn read_http_package(input: &str) -> Result<Package, anyhow::Error> {
    let body = reqwest::get(input).await?.bytes().await?;

    Package::decode(body).context("decode command")
}

fn parse_standard_package_and_version(input: &str) -> Result<(String, String), Error> {
    let parts: Vec<&str> = input.split('@').collect();
    if parts.len() > 2 {
        return Err(format_err!(
            "package name: {} does not follow the convention of <package>@<version>",
            input
        ));
    }

    let package_name = parts[0].to_string();
    if !MODULE_NAME_REGEXP.is_match(&package_name) {
        return Err(format_err!(
            "package name {} does not match regexp {}",
            package_name,
            MODULE_NAME_REGEXP.as_str()
        ));
    }

    if parts.len() == 1
        || parts
            .get(1)
            .map_or(true, |v| v.is_empty() || *v == "latest")
    {
        return Ok((package_name, "latest".to_string()));
    }

    let version = parts[1];
    if !is_valid_version(&version.replace("v", "")) {
        return Err(format_err!(
            "version '{}' is not valid Semver format",
            version
        ));
    }

    Ok((package_name, version.to_string()))
}

fn is_valid_version(version: &str) -> bool {
    Version::parse(version).is_ok()
}

struct Param {
    pub module_name: String,
    pub expression: String,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn read_module_and_filter_with_valid_module_and_filter() {
        let params =
            read_params_flag("--params= filtered_events:(type:transfer)").expect("no error");

        assert_eq!(params.len(), 1);
        assert_eq!(params[0].module_name, "filtered_events");
        assert_eq!(params[0].expression, "(type:transfer)");
    }

    #[test]
    fn read_module_and_filter_with_valid_multiples() {
        let params = read_params_flag("--params= first:(type:transfer), second:(type:action)")
            .expect("no error");

        assert_eq!(params.len(), 2);

        assert_eq!(params[0].module_name, "first");
        assert_eq!(params[0].expression, "(type:transfer)");

        assert_eq!(params[1].module_name, "second");
        assert_eq!(params[1].expression, "(type:action)");
    }

    #[test]
    fn read_module_and_filter_with_only_module() {
        let error = read_params_flag("--params=filtered_events")
            .err()
            .expect("error expected")
            .to_string();

        assert_eq!(
            error,
            "wrong --params value for 'filtered_events': missing ':' delimiter"
        );
    }

    #[test]
    fn read_module_and_filter_with_empty_string() {
        let error = read_params_flag("")
            .err()
            .expect("error expected")
            .to_string();

        assert_eq!(error, "wrong --params input value '': empty string");
    }

    #[test]
    fn read_module_and_filter_with_colon_but_no_filter() {
        let params = read_params_flag("--params=filtered_events:").expect("no error");

        assert_eq!(params.len(), 1);
        assert_eq!(params[0].module_name, "filtered_events");
        assert_eq!(params[0].expression, "");
    }

    #[test]
    fn read_module_and_filter_with_colon_only() {
        let params = read_params_flag("--params=:").expect("no error");

        assert_eq!(params.len(), 1);
        assert_eq!(params[0].module_name, "");
        assert_eq!(params[0].expression, "");
    }
}
