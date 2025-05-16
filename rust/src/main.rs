use anyhow::{format_err, Context, Error};
use chrono::DateTime;
use futures03::StreamExt;
use lazy_static::lazy_static;
use pb::sf::substreams::rpc::v2::{BlockScopedData, BlockUndoSignal};
use pb::sf::substreams::v1::Package;
use regex::Regex;
use semver::Version;

use prost::Message;
use std::{env, process::exit, sync::Arc};
use substreams::SubstreamsEndpoint;
use substreams_stream::{BlockResponse, SubstreamsStream};
use crate::pb::sf::substreams::v1::module::input::{Input, Params};

mod pb;
mod substreams;
mod substreams_stream;

lazy_static! {
    static ref MODULE_NAME_REGEXP: Regex = Regex::new(r"^([a-zA-Z][a-zA-Z0-9_-]{0,63})$").unwrap();
}

const REGISTRY_URL: &str = "https://spkg.io";

#[tokio::main]
async fn main() -> Result<(), Error> {
    let args = env::args();
    if args.len() < 4 || args.len() > 5 {
        println!("usage: <endpoint> <spkg> <module>:<query_string> [<start>:<stop>]");
        println!();
        println!("<spkg> can either be the full spkg.io link or `spkg_package@version`");
        println!();
        println!("(Optional) <query_string> is the query string in blockFilter");
        println!();
        println!("Examples");
        println!(" cargo run -- mainnet.injective.streamingfast.io:443 injective-common@v0.2.3 filtered_events:(type:message && attr:action) 1:10");
        println!();
        println!("The environment variable SUBSTREAMS_API_TOKEN must be set also");
        println!("and should contain a valid Substream API token.");
        exit(1);
    }

    let mut endpoint_url = env::args().nth(1).unwrap();
    let package_file = env::args().nth(2).unwrap();
    let (module_name, filter_query) = read_module_and_filter(env::args().nth(3).unwrap());

    if !endpoint_url.starts_with("http") {
        endpoint_url = format!("{}://{}", "https", endpoint_url);
    }

    let token_env = env::var("SUBSTREAMS_API_TOKEN").unwrap_or("".to_string());
    let mut token: Option<String> = None;
    if token_env.len() > 0 {
        token = Some(token_env);
    }

    let package = read_package(&package_file, &module_name, filter_query).await?;
    let block_range = read_block_range(&package, &module_name)?;
    let endpoint = Arc::new(SubstreamsEndpoint::new(&endpoint_url, token).await?);

    let cursor: Option<String> = load_persisted_cursor()?;

    let mut stream = SubstreamsStream::new(
        endpoint,
        cursor,
        package.modules,
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

fn read_block_range(pkg: &Package, module_name: &str) -> Result<(i64, u64), anyhow::Error> {
    let module = pkg
        .modules
        .as_ref()
        .unwrap()
        .modules
        .iter()
        .find(|m| m.name == module_name)
        .ok_or_else(|| format_err!("module '{}' not found in package", module_name))?;

    let mut input: String = "".to_string();
    if let Some(range) = env::args().nth(4) {
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

async fn read_package(
    input: &str, 
    module_name: &str, 
    filter_query: Option<String>,
) -> Result<Package, Error> {
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
    
    if let Some(filter_query) = filter_query {
        println!("Adding block filter '{}'", filter_query);

        // Find the module by name and apply the block filter
        if let Some(modules) = &mut package.modules {
            if let Some(module) = modules.modules.iter_mut().find(|m| m.name == module_name) {
                module.inputs[0].input = Some(Input::Params(Params {
                    value: filter_query.to_string(),
                }));
            }
        }
        Ok(package)
    } else {
        Ok(package)
    }
}

fn read_module_and_filter(third_arg: String) -> (String, Option<String>) {
    if third_arg.contains(":") {
        // Example: filtered_events:"(type:transfer)"
        (
            third_arg.split_once(":").unwrap().0.to_string(),
            Some(third_arg.split_once(":").unwrap().1.to_string()),
        )
    } else {
        (third_arg, None)
    }
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
