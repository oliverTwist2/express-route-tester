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
import { exportToFile, exportOpenAPI } from "../src/utils.js";
import { dryRunRoutes } from "../dryRunner.js";

const program = new Command();
program
  .name("express-route-tester")
  .description("CLI to inspect Express app routes")
  .argument("<file>", "Path to Express app entry file")
  .option("-o, --output <file>", "Output file path (JSON or Markdown)")
  .option("--dry-run", "Perform a dry-run test on all routes")
  .option("--ci", "Run in CI/CD mode and output JSON results")
  .option("--openapi <file>", "Export OpenAPI (Swagger) spec to .json or .yaml")
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

      // Route coverage detection output
      if (results.coverage) {
        if (results.coverage.unusedMiddleware.length > 0) {
          console.log("\n🟠 Unused Global Middleware:");
          results.coverage.unusedMiddleware.forEach((mw) =>
            console.log(`- ${mw}`)
          );
        } else {
          console.log("\n✅ All global middleware is used by at least one route.");
        }

        if (results.coverage.routesWithoutMiddleware.length > 0) {
          console.log("\n🟡 Routes Without Middleware:");
          results.coverage.routesWithoutMiddleware.forEach((route) =>
            console.log(`- ${route}`)
          );
        } else {
          console.log("\n✅ All routes have middleware coverage.");
        }
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

      if (options.openapi) {
        await exportOpenAPI(results, options.openapi);
        console.log(`\n📄 OpenAPI spec exported to ${options.openapi}`);
      }

      printHelp();
      printVersion();
    } catch (err) {
      printError(err);
      process.exit(1); // Ensure non-zero exit code on error
    }
  });

program.parse();
