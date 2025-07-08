import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const SENSITIVE_ROUTES = ["/admin", "/delete"];
const AUTH_MIDDLEWARE_NAMES = ["authenticate", "isAuthenticated", "auth"];

export async function scanRoutes(filePath) {
  const fullPath = path.resolve(filePath);
  const mod = await import(pathToFileURL(fullPath));
  const app = mod.default;

  if (!app) {
    throw new Error(
      `Could not import Express app from "${filePath}". Make sure it exports the app as default.`
    );
  }

  // Express 4: app._router
  // Express 5: app._router may not exist, but app.stack may
  let router = app._router;
  if (!router && Array.isArray(app.stack)) {
    // Express 5: app itself is the router
    router = app;
  }
  if (!router || !Array.isArray(router.stack)) {
    throw new Error(
      `The imported app does not have a recognizable router stack. Is this an Express app?`
    );
  }

  const globalMiddleware = [];
  const routes = [];
  const warnings = [];
  const middlewareUsage = new Set();

  router.stack.forEach((layer) => {
    if (layer.name === "router") {
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

      // Track middleware usage for coverage
      handlers.forEach((h) => middlewareUsage.add(h));

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

  // Detect unused middleware
  const unusedMiddleware = globalMiddleware.filter(
    (mw) => !middlewareUsage.has(mw)
  );

  // Detect routes without middleware (only one handler)
  const routesWithoutMiddleware = routes
    .filter((route) => route.handlers.length <= 1)
    .map((route) => `${route.methods.join(", ")} ${route.path}`);

  return {
    globalMiddleware,
    routes,
    warnings,
    coverage: {
      unusedMiddleware,
      routesWithoutMiddleware,
    },
  };
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


