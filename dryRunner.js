import request from 'supertest';

export async function dryRunRoutes(app, routes) {
  console.log(`\n🔍 Starting dry-run test on ${routes.length} routes...\n`);

  for (const { method, path } of routes) {
    try {
      const response = await request(app)[method.toLowerCase()](path);

      const status = response.status;
      const ok = status >= 200 && status < 400;

      console.log(`${ok ? '✅' : '❌'} [${method}] ${path} → Status: ${status}`);
    } catch (err) {
      console.log(`❌ [${method}] ${path} → Error: ${err.message}`);
    }
  }

  console.log(`\n✅ Dry-run complete.`);
}
