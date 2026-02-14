import { spawn } from "node:child_process";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const requestJson = async (url, init = {}) => {
  const res = await fetch(url, init);
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  return { ok: res.ok, status: res.status, data };
};

const waitForApi = async (retries = 20) => {
  for (let i = 0; i < retries; i += 1) {
    try {
      const res = await fetch("http://127.0.0.1:5001/api/health");
      if (res.ok) return true;
    } catch {
      // ignore while waiting
    }
    await sleep(500);
  }
  return false;
};

const server = spawn("node", ["server/index.js"], {
  stdio: ["ignore", "pipe", "pipe"]
});

server.stdout.on("data", (b) => process.stdout.write(`[server] ${b}`));
server.stderr.on("data", (b) => process.stderr.write(`[server] ${b}`));

try {
  const apiReady = await waitForApi();
  if (!apiReady) {
    console.error("❌ API did not start in time.");
    process.exitCode = 1;
  } else {
    const health = await requestJson("http://127.0.0.1:5001/api/health");
    if (!health.ok || !health.data?.ok) {
      console.error(`❌ API health check failed (${health.status}).`);
      process.exitCode = 1;
    } else {
      const login = await requestJson("http://127.0.0.1:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "admin@econirva.com", password: "admin123" })
      });

      if (!login.ok || !login.data?.token) {
        console.error(`❌ Admin login failed (${login.status}).`);
        process.exitCode = 1;
      } else {
        const products = await requestJson("http://127.0.0.1:5001/api/admin/products", {
          headers: { Authorization: `Bearer ${login.data.token}` }
        });

        if (!products.ok || !Array.isArray(products.data)) {
          console.error(`❌ Admin products fetch failed (${products.status}).`);
          process.exitCode = 1;
        } else {
          console.log(`✅ API checks passed. Products loaded: ${products.data.length}`);
        }
      }
    }
  }
} finally {
  server.kill("SIGTERM");
}
