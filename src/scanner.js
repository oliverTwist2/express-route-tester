import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

export async function scanRoutes(filePath) {
  const fullPath = path.resolve(filePath);
  const app = (await import(pathToFileURL(fullPath))).default;

  const globalMiddleware = [];
  const routes = [];

  app._router.stack.forEach((layer) => {
    if (layer.name === "router") {
      // Nested routers, optional handling
      return;
    }

    if (!layer.route) {
      // This is a global middleware
      globalMiddleware.push(layer.name || "anonymous");
    } else {
      const path = layer.route.path;
      const methods = Object.keys(layer.route.methods).map((m) =>
        m.toUpperCase()
      );
      const handlers = layer.route.stack.map((l) => l.name || "anonymous");
      routes.push({ path, methods, handlers });
    }
  });


  return { globalMiddleware, routes };
}

// Export detectConflicts
export function detectConflicts(routes) {
    const seen = new Map();
    const conflicts = [];
  
    routes.forEach(({ path, methods }) => {
      methods.forEach((method) => {
        const key = `${method}:${path}`;
        if (seen.has(key)) {
          conflicts.push(key);
        } else {
          seen.set(key, true);
        }
      });
    });
  
    return conflicts;
  }


