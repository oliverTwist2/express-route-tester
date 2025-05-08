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
  .option("--ci", "Run in CI/CD mode and output JSON results")
  .action(async (file, options) => {
    try {
      const resolvedFilePath = path.resolve(file);
      const fileUrl = pathToFileURL(resolvedFilePath).href;

      const results = await scanRoutes(resolvedFilePath);
      const conflicts = detectConflicts(results.routes);

      // Handle CI/CD mode
      if (options.ci) {
        const ciResults = {
          globalMiddleware: results.globalMiddleware,
          routes: results.routes,
          warnings: results.warnings,
          conflicts,
        };

        console.log(JSON.stringify(ciResults, null, 2));

        // Exit with a non-zero status code if there are issues
        if (conflicts.length > 0 || results.warnings.length > 0) {
          process.exit(1);
        } else {
          process.exit(0);
        }
      }

      // Normal CLI behavior
      printRoutes(results);

      if (conflicts.length > 0) {
        console.log("\n⚠️ Route Conflicts Detected:");
        conflicts.forEach((conflict) => console.log(`- ${conflict}`));
      } else {
        console.log("\n✅ No route conflicts detected.");
      }

      if (results.warnings.length > 0) {
        console.log("\n⚠️ Security Warnings:");
        results.warnings.forEach((warning) => console.log(`- ${warning}`));
      }

      if (options.dryRun) {
        const app = (await import(fileUrl)).default;
        const routesForDryRun = results.routes
          .map(({ methods, path }) =>
            methods.map((method) => ({ method, path }))
          )
          .flat();
        await dryRunRoutes(app, routesForDryRun);
      }

      if (options.output) {
        await exportToFile(results, conflicts, options.output);
        console.log(`\n📁 Results exported to ${options.output}`);
      }

      printHelp();
      printVersion();
    } catch (err) {
      printError(err);
      process.exit(1); // Ensure non-zero exit code on error
    }
  });

program.parse();
