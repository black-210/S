export interface RustCrateInfo {
  name: string;
  category: string;
  modules: string[];
  description: string;
  commonUsage: string;
}

export const RUST_STANDARD_MODULES = [
  {
    path: 'std::collections',
    symbols: ['HashMap', 'HashSet', 'VecDeque', 'BTreeMap', 'BTreeSet', 'BinaryHeap'],
    desc: 'Efficient collection types for hash maps, sets, queues, and sorted maps.'
  },
  {
    path: 'std::sync',
    symbols: ['Arc', 'Mutex', 'RwLock', 'Barrier', 'Once', 'atomic::AtomicBool', 'atomic::AtomicUsize'],
    desc: 'Thread synchronization primitives for thread-safe shared ownership and locking.'
  },
  {
    path: 'std::rc',
    symbols: ['Rc', 'Weak'],
    desc: 'Single-threaded reference-counting pointer.'
  },
  {
    path: 'std::cell',
    symbols: ['Cell', 'RefCell', 'OnceCell'],
    desc: 'Shareable mutable containers providing interior mutability.'
  },
  {
    path: 'std::fs',
    symbols: ['File', 'read_to_string', 'write', 'create_dir_all', 'read_dir'],
    desc: 'Filesystem manipulation operations and file stream handles.'
  },
  {
    path: 'std::io',
    symbols: ['Read', 'Write', 'BufReader', 'BufWriter', 'stdin', 'stdout', 'Result'],
    desc: 'Input/output traits, buffered readers, and standard stream handles.'
  },
  {
    path: 'std::net',
    symbols: ['TcpListener', 'TcpStream', 'UdpSocket', 'IpAddr', 'SocketAddr'],
    desc: 'Networking primitives for TCP/UDP communication.'
  },
  {
    path: 'std::thread',
    symbols: ['spawn', 'sleep', 'current', 'park'],
    desc: 'Thread management and execution concurrency.'
  }
];

export const POPULAR_RUST_CRATES: RustCrateInfo[] = [
  {
    name: 'tokio',
    category: 'Async Runtime',
    modules: ['tokio::main', 'tokio::spawn', 'tokio::sync::Mutex', 'tokio::time::sleep', 'tokio::net::TcpListener'],
    description: 'Event-driven, non-blocking I/O platform for writing asynchronous applications.',
    commonUsage: '#[tokio::main]\nasync fn main() -> Result<(), Box<dyn std::error::Error>> {\n    println!("Tokio runtime active!");\n    Ok(())\n}'
  },
  {
    name: 'serde',
    category: 'Serialization',
    modules: ['serde::Serialize', 'serde::Deserialize', 'serde_json::to_string', 'serde_json::from_str'],
    description: 'Generic serialization and deserialization framework for JSON, YAML, TOML, Bson, and Postcard.',
    commonUsage: 'use serde::{Serialize, Deserialize};\n\n#[derive(Serialize, Deserialize, Debug)]\nstruct User {\n    name: String,\n    age: u32,\n}'
  },
  {
    name: 'reqwest',
    category: 'HTTP Client',
    modules: ['reqwest::get', 'reqwest::Client'],
    description: 'Ergonomic, full-featured HTTP Client for Rust supporting async/await and streaming.',
    commonUsage: 'let body = reqwest::get("https://httpbin.org/ip").await?.text().await?;'
  },
  {
    name: 'anyhow',
    category: 'Error Handling',
    modules: ['anyhow::Result', 'anyhow::bail!', 'anyhow::Context'],
    description: 'Flexible trait object based error handling for application code.',
    commonUsage: 'use anyhow::{Context, Result};\n\nfn read_config() -> Result<String> {\n    std::fs::read_to_string("config.toml").context("Failed to open config file")\n}'
  },
  {
    name: 'thiserror',
    category: 'Error Handling',
    modules: ['thiserror::Error'],
    description: 'Convenient derive macro for standard library std::error::Error trait.',
    commonUsage: 'use thiserror::Error;\n\n#[derive(Error, Debug)]\nenum AppError {\n    #[error("IO error occurred")]\n    Io(#[from] std::io::Error),\n}'
  },
  {
    name: 'tracing',
    category: 'Logging & Metrics',
    modules: ['tracing::info!', 'tracing::error!', 'tracing::instrument'],
    description: 'Scoped, structured, and async-aware diagnostics tracking framework.',
    commonUsage: 'use tracing::info;\n\ninfo!(user = "Alice", "User logged in successfully");'
  },
  {
    name: 'clap',
    category: 'CLI Arguments',
    modules: ['clap::Parser'],
    description: 'Command Line Argument Parser for Rust with derive macro support.',
    commonUsage: 'use clap::Parser;\n\n#[derive(Parser, Debug)]\n#[command(version, about)]\nstruct Args {\n    #[arg(short, long)]\n    name: String,\n}'
  },
  {
    name: 'actix-web',
    category: 'Web Framework',
    modules: ['actix_web::HttpServer', 'actix_web::App', 'actix_web::get', 'actix_web::web'],
    description: 'Extremely fast, actor-based web framework for Rust.',
    commonUsage: '#[actix_web::main]\nasync fn main() -> std::io::Result<()> {\n    HttpServer::new(|| App::new()).bind(("127.0.0.1", 8080))?.run().await\n}'
  }
];
