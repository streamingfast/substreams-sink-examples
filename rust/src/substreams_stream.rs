use anyhow::{anyhow, Error};
use async_stream::try_stream;
use futures03::{Stream, StreamExt};
use std::{
    collections::VecDeque,
    pin::Pin,
    sync::Arc,
    task::{Context, Poll},
    time::{Duration, Instant},
};
use tokio::time::sleep;
use tokio_retry::strategy::ExponentialBackoff;

use crate::pb::sf::substreams::rpc::v2::{
    response::Message, BlockScopedData, BlockUndoSignal, Response,
};
use crate::pb::sf::substreams::rpc::v3::Request;
use crate::pb::sf::substreams::v1::Package;

use crate::substreams::SubstreamsEndpoint;

/// Rolling window size for recent averages (inter-next delay, process time, wait).
const STATS_WINDOW: usize = 1000;
/// Print a compact stats line every N block-scoped data messages.
const STATS_REPORT_EVERY: u64 = 100;

pub enum BlockResponse {
    New(BlockScopedData),
    Undo(BlockUndoSignal),
}

pub struct SubstreamsStream {
    stream: Pin<Box<dyn Stream<Item = Result<BlockResponse, Error>> + Send>>,
    stats: StreamStats,
}

impl SubstreamsStream {
    pub fn new(
        endpoint: Arc<SubstreamsEndpoint>,
        cursor: Option<String>,
        package: Option<Package>,
        output_module_name: String,
        start_block: i64,
        end_block: u64,
    ) -> Self {
        SubstreamsStream {
            stream: Box::pin(stream_blocks(
                endpoint,
                cursor,
                package,
                output_module_name,
                start_block,
                end_block,
            )),
            stats: StreamStats::new(),
        }
    }

    /// Finalize process time for the previous block-scoped item (if any) and
    /// start measuring wait-on-next from `now`.
    fn begin_wait_cycle(&mut self, now: Instant) {
        if self.stats.wait_start.is_some() {
            return;
        }

        if let Some(pending) = self.stats.pending.take() {
            let process = now.duration_since(pending.received_at);
            self.stats
                .on_block(pending.received_at, pending.wait, process);
            if self.stats.should_report() {
                self.stats.report("periodic");
            }
        }

        self.stats.wait_start = Some(now);
    }

    fn take_wait(&mut self, received_at: Instant) -> Duration {
        self.stats
            .wait_start
            .take()
            .map(|start| received_at.duration_since(start))
            .unwrap_or_default()
    }

    fn finalize_pending_on_end(&mut self, now: Instant) {
        if let Some(pending) = self.stats.pending.take() {
            let process = now.duration_since(pending.received_at);
            self.stats
                .on_block(pending.received_at, pending.wait, process);
        }
        self.stats.wait_start = None;
    }
}

// Create the Stream implementation that streams blocks with auto-reconnection.
fn stream_blocks(
    endpoint: Arc<SubstreamsEndpoint>,
    cursor: Option<String>,
    package: Option<Package>,
    output_module_name: String,
    start_block_num: i64,
    stop_block_num: u64,
) -> impl Stream<Item = Result<BlockResponse, Error>> {
    let mut latest_cursor = cursor.unwrap_or_else(|| "".to_string());
    let mut backoff = ExponentialBackoff::from_millis(500).max_delay(Duration::from_secs(45));
    let mut last_progress_report = Instant::now();

    try_stream! {
        loop {
            println!("Blockstreams disconnected, connecting (endpoint {}, start block {}, stop block {}, cursor {})",
                &endpoint,
                start_block_num,
                stop_block_num,
                &latest_cursor
            );

            let result = endpoint.clone().substreams(Request {
                start_block_num,
                start_cursor: latest_cursor.clone(),
                stop_block_num,
                final_blocks_only: false,
                package: package.clone(),
                params: Default::default(),
                network: String::new(),
                output_module: output_module_name.clone(),
                // There is usually no good reason for you to consume the stream development mode (so switching `true`
                // to `false`). If you do switch it, be aware that more than one output module will be send back to you,
                // and the current code in `process_block_scoped_data` (within your 'main.rs' file) expects a single
                // module.
                production_mode: true,
                debug_initial_store_snapshot_for_modules: vec![],
                dev_output_modules: vec![],
                limit_processed_blocks: u64::MAX,
                progress_messages_interval_ms: 30 * 1000,
                partial_blocks: false,
                noop_mode: false,
            }).await;

            match result {
                Ok(stream) => {
                    println!("Blockstreams connected");

                    let mut encountered_error = false;
                    for await response in stream{
                        match process_substreams_response(response, &mut last_progress_report).await {
                            BlockProcessedResult::BlockScopedData(block_scoped_data) => {
                                // Reset backoff because we got a good value from the stream
                                backoff = ExponentialBackoff::from_millis(500).max_delay(Duration::from_secs(45));

                                let cursor = block_scoped_data.cursor.clone();
                                yield BlockResponse::New(block_scoped_data);

                                latest_cursor = cursor;
                            },
                            BlockProcessedResult::BlockUndoSignal(block_undo_signal) => {
                                // Reset backoff because we got a good value from the stream
                                backoff = ExponentialBackoff::from_millis(500).max_delay(Duration::from_secs(45));

                                let cursor = block_undo_signal.last_valid_cursor.clone();
                                yield BlockResponse::Undo(block_undo_signal);

                                latest_cursor = cursor;
                            },
                            BlockProcessedResult::Skip() => {},
                            BlockProcessedResult::TonicError(status) => {
                                // Unauthenticated errors are not retried, we forward the error back to the
                                // stream consumer which handles it
                                if status.code() == tonic::Code::Unauthenticated {
                                    return Err(anyhow::Error::new(status.clone()))?;
                                }

                                println!("Received tonic error {:#}", status);
                                encountered_error = true;
                                break;
                            },
                        }
                    }

                    if !encountered_error {
                        println!("Stream completed, reached end block");
                        return
                    }
                },
                Err(e) => {
                    // We failed to connect and will try again; this is another
                    // case where we actually _want_ to back off in case we keep
                    // having connection errors.

                    println!("Unable to connect to endpoint: {:#}", e);
                }
            }

            // If we reach this point, we must wait a bit before retrying
            if let Some(duration) = backoff.next() {
                sleep(duration).await
            } else {
                return Err(anyhow!("backoff requested to stop retrying, quitting"))?;
            }
        }
    }
}

enum BlockProcessedResult {
    Skip(),
    BlockScopedData(BlockScopedData),
    BlockUndoSignal(BlockUndoSignal),
    TonicError(tonic::Status),
}

async fn process_substreams_response(
    result: Result<Response, tonic::Status>,
    last_progress_report: &mut Instant,
) -> BlockProcessedResult {
    let response = match result {
        Ok(v) => v,
        Err(e) => return BlockProcessedResult::TonicError(e),
    };

    match response.message {
        Some(Message::Session(session)) => {
            println!(
                "Received session message (Workers {}, Trace ID {})",
                session.max_parallel_workers, &session.trace_id
            );
            BlockProcessedResult::Skip()
        }
        Some(Message::BlockScopedData(block_scoped_data)) => {
            BlockProcessedResult::BlockScopedData(block_scoped_data)
        }
        Some(Message::BlockUndoSignal(block_undo_signal)) => {
            BlockProcessedResult::BlockUndoSignal(block_undo_signal)
        }
        Some(Message::Progress(progress)) => {
            if last_progress_report.elapsed() > Duration::from_secs(30) {
                let processed_bytes = progress.processed_bytes.unwrap_or_default();

                println!(
                    "Latest progress message received (Stages: {}, Jobs: {}, Processed Bytes: [Read: {}, Written: {}])",
                    progress.stages.len(),
                    progress.running_jobs.len(),
                    processed_bytes.total_bytes_read,
                    processed_bytes.total_bytes_written,
                );
                *last_progress_report = Instant::now();
            }

            // The `ModulesProgress` messages goal is to report active parallel processing happening
            // either to fill up backward (relative to your request's start block) some missing state
            // or pre-process forward blocks (again relative).
            //
            // You could log that in trace or accumulate to push as metrics. Here a snippet of code
            // that prints progress to standard out. If your `BlockScopedData` messages seems to never
            // arrive in production mode, it's because progresses is happening but not yet for the output
            // module you requested.
            //
            // let progresses: Vec<_> = progress
            //     .modules
            //     .iter()
            //     .filter_map(|module| {
            //         use crate::pb::sf::substreams::rpc::v2::module_progress::Type;

            //         if let Type::ProcessedRanges(range) = module.r#type.as_ref().unwrap() {
            //             Some(format!(
            //                 "{} @ [{}]",
            //                 module.name,
            //                 range
            //                     .processed_ranges
            //                     .iter()
            //                     .map(|x| x.to_string())
            //                     .collect::<Vec<_>>()
            //                     .join(", ")
            //             ))
            //         } else {
            //             None
            //         }
            //     })
            //     .collect();

            // println!("Progess {}", progresses.join(", "));

            BlockProcessedResult::Skip()
        }
        None => {
            println!("Got None on substream message");
            BlockProcessedResult::Skip()
        }
        _ => BlockProcessedResult::Skip(),
    }
}

impl Stream for SubstreamsStream {
    type Item = Result<BlockResponse, Error>;

    fn poll_next(mut self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Option<Self::Item>> {
        // First poll after a previous Ready item: client process time ends and
        // wait-on-next begins. Process is the gap between yield and re-poll, so
        // every consumer of this stream gets keep-up metrics for free.
        let now = Instant::now();
        self.begin_wait_cycle(now);

        match self.stream.as_mut().poll_next_unpin(cx) {
            Poll::Ready(Some(Ok(BlockResponse::New(data)))) => {
                let received_at = Instant::now();
                let wait = self.take_wait(received_at);
                // Process time is finalized on the next poll (or stream end).
                self.stats.pending = Some(PendingBlockTiming {
                    received_at,
                    wait,
                });
                Poll::Ready(Some(Ok(BlockResponse::New(data))))
            }
            Poll::Ready(Some(Ok(BlockResponse::Undo(signal)))) => {
                // Undo is not part of the block timing samples; reset wait so the
                // next New item starts a clean wait window.
                self.stats.wait_start = None;
                self.stats.on_undo();
                Poll::Ready(Some(Ok(BlockResponse::Undo(signal))))
            }
            Poll::Ready(Some(Err(err))) => {
                self.finalize_pending_on_end(Instant::now());
                self.stats.report("error");
                Poll::Ready(Some(Err(err)))
            }
            Poll::Ready(None) => {
                self.finalize_pending_on_end(Instant::now());
                self.stats.report("final");
                Poll::Ready(None)
            }
            Poll::Pending => Poll::Pending,
        }
    }
}

/// Timing for a block-scoped item whose process duration is not known until the
/// consumer asks for the next item (or the stream ends).
struct PendingBlockTiming {
    received_at: Instant,
    wait: Duration,
}

/// Accumulates stream-consumption metrics so you can tell whether the client is
/// keeping up with block-scoped data as it becomes available.
///
/// Instrumented automatically inside [`SubstreamsStream`]'s `poll_next`:
/// - **inter_next**: time between successive block-scoped yields (cycle time).
/// - **wait_next**: time spent blocked waiting for the next stream item
///   (server/network readiness).
/// - **process**: time from a Ready yield until the consumer polls again
///   (client work between items).
///
/// If recent `wait_next` is ~0 while `process` dominates, the client is behind.
/// If `wait_next` >> `process`, the server (or live head) is pacing you.
struct StreamStats {
    started_at: Instant,
    /// Instant when the previous block-scoped item was received (for inter-next).
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
    /// When the consumer started waiting for the next item.
    wait_start: Option<Instant>,
    /// Last New item awaiting process-time finalization on the next poll.
    pending: Option<PendingBlockTiming>,
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
            wait_start: None,
            pending: None,
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
