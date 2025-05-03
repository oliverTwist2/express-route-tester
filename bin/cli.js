#!/usr/bin/env node
import { Command } from "commander";
import path from "path";
import { pathToFileURL } from "url";
import { scanRoutes, detectConflicts } from "../src/scanner.js";
import {
  printRoutes,
  printError,
  printHelp,
  printVersion,
} from "../src/reporter.js";
import { exportToFile } from "../src/utils.js";
import { dryRunRoutes } from "../dryRunner.js";

const program = new Command();
program
  .name("express-route-tester")
  .description("CLI to inspect Express app routes")
  .argument("<file>", "Path to Express app entry file")
  .option("-o, --output <file>", "Output file path (JSON or Markdown)")
  .option("--dry-run", "Perform a dry-run test on all routes")
  .action(async (file, options) => {
    try {
      const resolvedFilePath = path.resolve(file);
      const fileUrl = pathToFileURL(resolvedFilePath).href;

      const results = await scanRoutes(resolvedFilePath);
      printRoutes(results);

      // Detect and print conflicts
      const conflicts = detectConflicts(results.routes);
      if (conflicts.length > 0) {
        console.log("\n⚠️ Route Conflicts Detected:");
        conflicts.forEach((conflict) => console.log(`- ${conflict}`));
      } else {
        console.log("\n✅ No route conflicts detected.");
      }

      // Display warnings for missing auth middleware
      if (results.warnings.length > 0) {
        console.log("\n⚠️ Security Warnings:");
        results.warnings.forEach((warning) => console.log(`- ${warning}`));
      }

      // Perform dry-run testing if the --dry-run option is provided
      if (options.dryRun) {
        const app = (await import(fileUrl)).default;
        const routesForDryRun = results.routes
          .map(({ methods, path }) =>
            methods.map((method) => ({ method, path }))
          )
          .flat();
        await dryRunRoutes(app, routesForDryRun);
      }

      // Export results to a file if the output option is provided
      if (options.output) {
        await exportToFile(results, conflicts, options.output);
        console.log(`\n📁 Results exported to ${options.output}`);
      }

      printHelp();
      printVersion();
    } catch (err) {
      printError(err);
    }
  });

program.parse();
