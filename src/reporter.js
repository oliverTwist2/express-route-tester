import chalk from "chalk";

export function printRoutes({ routes, globalMiddleware }) {
  console.log(chalk.bold.underline("\n🌐 Global Middleware:\n"));

  if (!globalMiddleware.length) {
    console.log(chalk.gray("No global middleware found.\n"));
  } else {
    globalMiddleware.forEach((fn, i) => {
      console.log(`${i + 1}. ${chalk.green(fn)}`);
    });
    console.log("");
  }

  console.log(chalk.bold.underline("📦 Express Routes:\n"));

  if (!routes.length) {
    console.log(chalk.yellow("No routes found."));
    return;
  }

  routes.forEach((route) => {
    const methodList = route.methods
      .map((m) => chalk.cyanBright(`[${m}]`))
      .join(" ");
    const handlerList = route.handlers.map((h) => chalk.green(h)).join(" → ");
    console.log(`${methodList} ${chalk.white(route.path)} → ${handlerList}`);
  });

  console.log("");
}

/// Error handling
export function printError(error) {
  console.error(chalk.red("Error:"), error.message);
  console.log(
    chalk.yellow(
      "Please check the file path and ensure it exports an Express app."
    )
  );
}

/// Help and version info
export function printHelp() {
  console.log(chalk.bold.underline("Usage:"));
  console.log(chalk.cyan("express-route-tester <file>"));
  console.log(
    chalk.yellow("Where <file> is the path to your Express app entry file.")
  );
  console.log(chalk.green("Example:"));
  console.log(chalk.cyan("express-route-tester ./examples/app.js"));
  console.log("\n");
}

/// Version info
/// This is a placeholder. In a real-world scenario, you would retrieve this from package.json or similar.
export function printVersion() {
  console.log(chalk.bold.underline("Version:"));
  console.log(chalk.cyan("1.0.0"));
  console.log("\n");
}
