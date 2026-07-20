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
use std::collections::VecDeque;
use std::time::{Duration, Instant};
use std::{env, process::exit, sync::Arc};
use substreams::SubstreamsEndpoint;
use substreams_stream::{BlockResponse, SubstreamsStream};

/// Rolling window size for recent averages (inter-next delay, process time, wait).
const STATS_WINDOW: usize = 1000;
/// Print a compact stats line every N block-scoped data messages.
const STATS_REPORT_EVERY: u64 = 100;

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
    let api_key_env = env::var("SUBSTREAMS_API_KEY").unwrap_or("".to_string());

    let token: Option<String> = if !token_env.is_empty() {
        Some(token_env)
    } else {
        None
    };

    let api_key: Option<String> = if !api_key_env.is_empty() {
        Some(api_key_env)
    } else {
        None
    };

    let package = read_package(&package_file, params).await?;
    let block_range = read_block_range(&package, &module_name, block_range)?;
    let endpoint = Arc::new(SubstreamsEndpoint::new(&endpoint_url, token, api_key).await?);

    let cursor: Option<String> = load_persisted_cursor()?;

    let mut stream = SubstreamsStream::new(
        endpoint,
        cursor,
        Some(package),
        module_name.to_string(),
        block_range.0,
        block_range.1,
    );

    let mut stats = StreamStats::new();
    // Start of the wait for the *next* stream.next().await. Reset after each
    // block/undo is fully handled so wait_next excludes client processing time.
    let mut wait_start = Instant::now();

    loop {
        // Time spent waiting inside next().await: near-zero means block-scoped
        // data was already available (client is the bottleneck); large values mean
        // the server/network is pacing delivery.
        match stream.next().await {
            None => {
                println!("Stream consumed");
                stats.report("final");
                break;
            }
            Some(Ok(BlockResponse::New(data))) => {
                let received_at = Instant::now();
                let wait = wait_start.elapsed();

                let process_start = Instant::now();
                process_block_scoped_data(&data)?;
                persist_cursor(data.cursor)?;
                let process = process_start.elapsed();

                stats.on_block(received_at, wait, process);
                if stats.should_report() {
                    stats.report("periodic");
                }

                wait_start = Instant::now();
            }
            Some(Ok(BlockResponse::Undo(undo_signal))) => {
                process_block_undo_signal(&undo_signal)?;
                persist_cursor(undo_signal.last_valid_cursor)?;
                stats.on_undo();

                wait_start = Instant::now();
            }
            Some(Err(err)) => {
                println!();
                println!("Stream terminated with error");
                println!("{:?}", err);
                stats.report("error");
                exit(1);
            }
        }
    }

    Ok(())
}

/// Accumulates stream-consumption metrics so you can tell whether the client is
/// keeping up with block-scoped data as it becomes available.
///
/// - **inter_next**: time between successive `stream.next()` returns (cycle time).
/// - **wait_next**: time spent blocked in `stream.next().await` (server/network readiness).
/// - **process**: time in `process_block_scoped_data` + `persist_cursor` (client work).
///
/// If recent `wait_next` is ~0 while `process` dominates, the client is behind.
/// If `wait_next` >> `process`, the server (or live head) is pacing you.
struct StreamStats {
    started_at: Instant,
    /// Instant when the previous `stream.next()` returned a block (for inter-next).
    last_received_at: Option<Instant>,
    total_blocks: u64,
    total_undos: u64,
    /// Samples that contribute to inter-next averages (skips the first block).
    inter_samples: u64,
    total_inter_us: u128,
    total_wait_us: u128,
    total_process_us: u128,
    window_inter_us: VecDeque<u128>,
    window_wait_us: VecDeque<u128>,
    window_process_us: VecDeque<u128>,
}

impl StreamStats {
    fn new() -> Self {
        Self {
            started_at: Instant::now(),
            last_received_at: None,
            total_blocks: 0,
            total_undos: 0,
            inter_samples: 0,
            total_inter_us: 0,
            total_wait_us: 0,
            total_process_us: 0,
            window_inter_us: VecDeque::with_capacity(STATS_WINDOW),
            window_wait_us: VecDeque::with_capacity(STATS_WINDOW),
            window_process_us: VecDeque::with_capacity(STATS_WINDOW),
        }
    }

    fn on_block(&mut self, received_at: Instant, wait: Duration, process: Duration) {
        self.total_blocks += 1;

        // Delay between successive next() returns ≈ previous process time + this wait.
        if let Some(prev) = self.last_received_at {
            let inter_us = received_at.duration_since(prev).as_micros();
            self.total_inter_us += inter_us;
            self.inter_samples += 1;
            push_window(&mut self.window_inter_us, inter_us);
        }
        self.last_received_at = Some(received_at);

        let wait_us = wait.as_micros();
        let process_us = process.as_micros();
        self.total_wait_us += wait_us;
        self.total_process_us += process_us;
        push_window(&mut self.window_wait_us, wait_us);
        push_window(&mut self.window_process_us, process_us);
    }

    fn on_undo(&mut self) {
        self.total_undos += 1;
    }

    fn should_report(&self) -> bool {
        self.total_blocks > 0 && self.total_blocks % STATS_REPORT_EVERY == 0
    }

    fn report(&self, label: &str) {
        if self.total_blocks == 0 {
            println!("stats[{label}]: no block-scoped data received yet");
            return;
        }

        let elapsed = self.started_at.elapsed().as_secs_f64().max(1e-9);
        let rate = self.total_blocks as f64 / elapsed;

        let inter_overall = avg_us(self.total_inter_us, self.inter_samples);
        let inter_window = window_avg_us(&self.window_inter_us);
        let process_overall = avg_us(self.total_process_us, self.total_blocks);
        let process_window = window_avg_us(&self.window_process_us);
        let wait_overall = avg_us(self.total_wait_us, self.total_blocks);
        let wait_window = window_avg_us(&self.window_wait_us);

        let keep_up = consumer_status(wait_window, process_window);

        println!(
            "stats[{label}]: blocks={} undos={} rate={:.1}/s | \
             inter_next avg={} last{}={} | \
             process avg={} last{}={} | \
             wait_next avg={} last{}={} | \
             consumer={}",
            self.total_blocks,
            self.total_undos,
            rate,
            fmt_us(inter_overall),
            self.window_inter_us.len(),
            fmt_us(inter_window),
            fmt_us(process_overall),
            self.window_process_us.len(),
            fmt_us(process_window),
            fmt_us(wait_overall),
            self.window_wait_us.len(),
            fmt_us(wait_window),
            keep_up,
        );
    }
}

fn push_window(window: &mut VecDeque<u128>, value: u128) {
    if window.len() == STATS_WINDOW {
        window.pop_front();
    }
    window.push_back(value);
}

fn avg_us(sum: u128, count: u64) -> f64 {
    if count == 0 {
        0.0
    } else {
        sum as f64 / count as f64
    }
}

fn window_avg_us(window: &VecDeque<u128>) -> f64 {
    if window.is_empty() {
        0.0
    } else {
        let sum: u128 = window.iter().sum();
        sum as f64 / window.len() as f64
    }
}

fn fmt_us(us: f64) -> String {
    if us >= 1_000_000.0 {
        format!("{:.2}s", us / 1_000_000.0)
    } else if us >= 1_000.0 {
        format!("{:.2}ms", us / 1_000.0)
    } else {
        format!("{:.0}µs", us)
    }
}

/// Heuristic from the recent window: near-zero wait with non-trivial process
/// work means data was ready when polled (client-bound). Large wait relative
/// to process means the server or live head is pacing delivery.
fn consumer_status(wait_avg_us: f64, process_avg_us: f64) -> &'static str {
    const NEAR_ZERO_WAIT_US: f64 = 1_000.0; // 1ms

    if wait_avg_us < NEAR_ZERO_WAIT_US && process_avg_us > wait_avg_us * 5.0 {
        "client-bound (data ready when polled)"
    } else if wait_avg_us > process_avg_us * 5.0 && wait_avg_us >= NEAR_ZERO_WAIT_US {
        "server-paced (waiting on stream)"
    } else {
        "balanced"
    }
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
