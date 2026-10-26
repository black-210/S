export interface CppHeaderInfo {
  header: string;
  category: string;
  symbols: string[];
  description: string;
  commonUsage: string;
}

export const CPP_STANDARD_HEADERS: CppHeaderInfo[] = [
  {
    header: '<vector>',
    category: 'Containers',
    symbols: ['std::vector'],
    description: 'Dynamic contiguous array container with automatic resizing.',
    commonUsage: '#include <vector>\n\nstd::vector<int> numbers = {1, 2, 3, 4, 5};\nnumbers.push_back(6);'
  },
  {
    header: '<string>',
    category: 'Strings',
    symbols: ['std::string', 'std::wstring', 'std::u8string', 'std::string_view', 'std::to_string'],
    description: 'String manipulation classes and string literal views.',
    commonUsage: '#include <string>\n\nstd::string greeting = "Hello, RIPOSTE C++!";\nstd::string_view view = greeting;'
  },
  {
    header: '<unordered_map>',
    category: 'Containers',
    symbols: ['std::unordered_map', 'std::unordered_multimap'],
    description: 'Hash-table based associative key-value container.',
    commonUsage: '#include <unordered_map>\n\nstd::unordered_map<std::string, int> ages;\nages["Alice"] = 30;'
  },
  {
    header: '<map>',
    category: 'Containers',
    symbols: ['std::map', 'std::multimap'],
    description: 'Red-black tree ordered associative key-value container.',
    commonUsage: '#include <map>\n\nstd::map<std::string, int> scores;\nscores["Bob"] = 95;'
  },
  {
    header: '<memory>',
    category: 'Memory Management',
    symbols: ['std::unique_ptr', 'std::shared_ptr', 'std::weak_ptr', 'std::make_unique', 'std::make_shared'],
    description: 'Smart pointers for RAII memory management without manual delete.',
    commonUsage: '#include <memory>\n\nauto ptr = std::make_unique<std::string>("RAII Memory");'
  },
  {
    header: '<algorithm>',
    category: 'Algorithms',
    symbols: ['std::sort', 'std::find', 'std::transform', 'std::accumulate', 'std::for_each', 'std::all_of'],
    description: 'Sequence manipulation algorithms, searching, sorting, and transforming.',
    commonUsage: '#include <algorithm>\n#include <vector>\n\nstd::vector<int> v = {3, 1, 4, 1, 5};\nstd::sort(v.begin(), v.end());'
  },
  {
    header: '<thread>',
    category: 'Concurrency',
    symbols: ['std::thread', 'std::jthread', 'std::this_thread::sleep_for'],
    description: 'Multithreading and execution thread control.',
    commonUsage: '#include <thread>\n\nstd::jthread t([]{ std::cout << "Thread running\\n"; });'
  },
  {
    header: '<mutex>',
    category: 'Concurrency',
    symbols: ['std::mutex', 'std::lock_guard', 'std::unique_lock', 'std::scoped_lock'],
    description: 'Thread synchronization primitives and RAII lock guards.',
    commonUsage: '#include <mutex>\n\nstd::mutex mtx;\nstd::lock_guard<std::mutex> lock(mtx);'
  },
  {
    header: '<future>',
    category: 'Concurrency',
    symbols: ['std::async', 'std::future', 'std::promise', 'std::packaged_task'],
    description: 'Asynchronous function execution and future results.',
    commonUsage: '#include <future>\n\nauto fut = std::async(std::launch::async, []{ return 42; });'
  },
  {
    header: '<format>',
    category: 'Formatting (C++20)',
    symbols: ['std::format', 'std::format_to', 'std::print'],
    description: 'Type-safe fast text formatting library similar to Python format.',
    commonUsage: '#include <format>\n#include <iostream>\n\nstd::cout << std::format("User {}, score: {}\\n", "Alice", 100);'
  },
  {
    header: '<ranges>',
    category: 'Ranges & Views (C++20)',
    symbols: ['std::ranges::views::filter', 'std::ranges::views::transform', 'std::ranges::sort'],
    description: 'Composable range algorithms and non-owning views.',
    commonUsage: '#include <ranges>\n#include <vector>\n\nstd::vector<int> nums = {1, 2, 3, 4, 5};\nauto evens = nums | std::ranges::views::filter([](int n){ return n % 2 == 0; });'
  },
  {
    header: '<filesystem>',
    category: 'Filesystem (C++17)',
    symbols: ['std::filesystem::path', 'std::filesystem::exists', 'std::filesystem::create_directories'],
    description: 'Cross-platform file path manipulation and directory traversal.',
    commonUsage: '#include <filesystem>\nnamespace fs = std::filesystem;\n\nif (fs::exists("src")) { /* ... */ }'
  },
  {
    header: '<iostream>',
    category: 'I/O Streams',
    symbols: ['std::cout', 'std::cin', 'std::endl', 'std::cerr'],
    description: 'Standard stream I/O for text input/output.',
    commonUsage: '#include <iostream>\n\nstd::cout << "Hello C++" << std::endl;'
  },
  {
    header: '<fstream>',
    category: 'I/O Streams',
    symbols: ['std::ifstream', 'std::ofstream', 'std::fstream'],
    description: 'File input and output streams.',
    commonUsage: '#include <fstream>\n\nstd::ofstream file("output.txt");\nfile << "Data line\\n";'
  }
];

export const POPULAR_CPP_LIBRARIES = [
  {
    name: 'Boost',
    headers: ['<boost/asio.hpp>', '<boost/beast.hpp>', '<boost/filesystem.hpp>', '<boost/program_options.hpp>'],
    desc: 'Peer-reviewed portable C++ source libraries for networking, async I/O, regex, filesystem, and data structures.'
  },
  {
    name: 'nlohmann/json',
    headers: ['<nlohmann/json.hpp>'],
    desc: 'JSON for Modern C++ with intuitive syntax and seamless STL integration.'
  },
  {
    name: 'fmt',
    headers: ['<fmt/core.h>', '<fmt/format.h>', '<fmt/ranges.h>'],
    desc: 'Modern open-source formatting library offering a fast and safe alternative to C stdio and C++ iostreams.'
  },
  {
    name: 'Eigen',
    headers: ['<Eigen/Dense>', '<Eigen/Sparse>'],
    desc: 'High-performance C++ template library for linear algebra, matrices, vectors, and numerical solvers.'
  },
  {
    name: 'OpenCV',
    headers: ['<opencv2/opencv.hpp>', '<opencv2/imgproc.hpp>', '<opencv2/highgui.hpp>'],
    desc: 'Computer vision and machine learning library for image processing, real-time object detection, and video analysis.'
  },
  {
    name: 'Raylib',
    headers: ['"raylib.h"'],
    desc: 'Simple and easy-to-use C/C++ library to enjoy videogames programming.'
  },
  {
    name: 'SFML',
    headers: ['<SFML/Graphics.hpp>', '<SFML/Audio.hpp>', '<SFML/Network.hpp>'],
    desc: 'Simple and Fast Multimedia Library for C++ providing graphics, windowing, audio, and networking.'
  },
  {
    name: 'cURL (libcurl)',
    headers: ['<curl/curl.h>'],
    desc: 'Multiprotocol file transfer library for HTTP, HTTPS, FTP, TLS, and WebSockets.'
  },
  {
    name: 'SQLite3',
    headers: ['<sqlite3.h>'],
    desc: 'Self-contained, serverless, zero-configuration SQL database engine in C/C++.'
  }
];
