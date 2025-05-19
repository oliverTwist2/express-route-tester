# Express Route Tester - Route-Pilot

A powerful CLI tool for testing and analyzing Express.js routes in your Node.js applications. This tool helps developers inspect, test, and validate their Express.js route configurations with ease.

## Features

- 🔍 **Route Analysis**: Automatically detects and lists all Express.js routes in your application
- ⚠️ **Conflict Detection**: Identifies route conflicts (same path and method combinations)
- 🧪 **Dry Run Testing**: Test routes without actually running the server
- 📊 **Export Capabilities**: Export results to JSON or Markdown format
- 🔄 **Middleware Analysis**: Shows middleware attached to each route
- 📝 **Detailed Reporting**: Comprehensive information about routes, methods, and middleware
- 🔐 **Security/auth checks**: Warns if sensitive routes (e.g., `/admin`, `/delete`) lack authentication middleware.

## Installation

Install the package globally using npm:

```bash
npm install -g route-pilot
```

## Usage

### Basic Usage
Run the CLI tool with the path to your Express app:

```bash
route-pilot <path-to-your-express-app>
```

Example:

```bash
route-pilot app.js
```

### Command Line Options

The tool supports the following command-line options:

- `-o, --output <file>`: Export results to a file (supports .json or .md format)
- `--dry-run`: Perform a dry-run test on all routes
- `--ci`: Run in CI/CD mode. Outputs results in JSON format and exits with a non-zero status code if issues are detected.
- `-h, --help`: Display help information
- `-v, --version`: Display version information
- `-openapi <file>`: Export OpenAPI (Swagger) spec to .json or .yaml

### Example Output

When you run the tool, it will:

1. Scan your Express application for routes
2. Display all detected routes with their methods and middleware
3. Check for route conflicts
4. Perform dry-run testing if requested
5. Export results if specified

## Project Structure

```
express-route-tester/
├── bin/
│   └── cli.js           # CLI entry point and command handling
├── src/
│   ├── scanner.js       # Route scanning and conflict detection
│   ├── reporter.js      # Output formatting and display
│   └── utils.js         # Utility functions and file operations
├── examples/
│   └── app.js           # Example Express application
├── dryRunner.js         # Route testing utilities
└── package.json         # Project dependencies and scripts
```

### Key Components

- `bin/cli.js`: Main CLI interface using Commander.js
- `src/scanner.js`: Core route scanning and conflict detection logic
- `src/reporter.js`: Handles output formatting and display
- `src/utils.js`: Utility functions for file operations
- `dryRunner.js`: Implements dry-run testing functionality

## Example Application

The project includes an example Express application (`examples/app.js`) that demonstrates:

- Basic route definitions
- Middleware usage
- Route conflicts (for testing conflict detection)
- Request body validation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Setup

1. Fork the repository [Github Repo](https://github.com/oliverTwist2/express-route-tester)
2. Clone your fork:

```bash
git clone https://github.com/your-username/express-route-tester.git
```

3. Install dependencies:

```bash
npm install
```

4. Create a new branch for your feature:

```bash
git checkout -b feature/your-feature-name
```

### Roadmap

Check out our [todo.md](todo.md) file for planned features and enhancements, including:

- Security/auth checks
- CI/CD mode
- Tag-based filtering
- Interactive CLI
- Route coverage detection
- OpenAPI export
- And more!

## Author

- **Oliver Ikegah** - [oliverikegah@gmail.com](mailto:oliverikegah@gmail.com)

## Acknowledgments

- Express.js team for their excellent framework

## Support

If you encounter any issues or have questions, please:

1. Check the [Issues](https://github.com/oliverikegah/express-route-tester/issues) page on github
2. Create a new issue if your problem isn't already listed
3. Contact the author directly for urgent matters
