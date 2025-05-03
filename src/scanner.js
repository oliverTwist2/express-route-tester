import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const SENSITIVE_ROUTES = ["/admin", "/delete"]; // Define sensitive routes
const AUTH_MIDDLEWARE_NAMES = ["authenticate", "isAuthenticated", "auth"]; // Common auth middleware names

export async function scanRoutes(filePath) {
  const fullPath = path.resolve(filePath);
  const app = (await import(pathToFileURL(fullPath))).default;

  const globalMiddleware = [];
  const routes = [];
  const warnings = []; // Collect warnings for missing auth middleware

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

      // Check for missing auth middleware on sensitive routes
      if (SENSITIVE_ROUTES.includes(path)) {
        const hasAuthMiddleware = handlers.some((handler) =>
          AUTH_MIDDLEWARE_NAMES.includes(handler)
        );
        if (!hasAuthMiddleware) {
          warnings.push(
            `Sensitive route "${path}" lacks authentication middleware.`
          );
        }
      }

      routes.push({ path, methods, handlers });
    }
  });

  return { globalMiddleware, routes, warnings };
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
