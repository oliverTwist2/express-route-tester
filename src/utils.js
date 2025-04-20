import fs from "fs/promises";
import path from "path";

export async function exportToFile(results, conflicts, outputFile) {
  const ext = path.extname(outputFile).toLowerCase();

  let content;
  if (ext === ".json") {
    content = JSON.stringify({ results, conflicts }, null, 2);
  } else if (ext === ".md") {
    content = generateMarkdown(results, conflicts);
  } else {
    throw new Error("Unsupported file format. Use .json or .md");
  }

  await fs.writeFile(outputFile, content, "utf-8");
}

function generateMarkdown(results, conflicts) {
  let markdown = `# Express Route Tester Results\n\n`;

  markdown += `## 🌐 Global Middleware\n`;
  if (results.globalMiddleware.length === 0) {
    markdown += `No global middleware found.\n\n`;
  } else {
    results.globalMiddleware.forEach((middleware, i) => {
      markdown += `${i + 1}. ${middleware}\n`;
    });
    markdown += `\n`;
  }

  markdown += `## 📦 Routes\n`;
  if (results.routes.length === 0) {
    markdown += `No routes found.\n\n`;
  } else {
    results.routes.forEach((route) => {
      const methods = route.methods.join(", ");
      const handlers = route.handlers.join(" → ");
      markdown += `- **${methods}** ${route.path} → ${handlers}\n`;
    });
    markdown += `\n`;
  }

  markdown += `## ⚠️ Conflicts\n`;
  if (conflicts.length === 0) {
    markdown += `No conflicts detected.\n`;
  } else {
    conflicts.forEach((conflict) => {
      markdown += `- ${conflict}\n`;
    });
  }

  return markdown;
}