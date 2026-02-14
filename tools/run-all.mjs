import { spawn } from "node:child_process";

const procs = [];

const start = (name, command, args) => {
  const child = spawn(command, args, {
    stdio: ["inherit", "pipe", "pipe"],
    shell: process.platform === "win32"
  });

  child.stdout.on("data", (buf) => process.stdout.write(`[${name}] ${buf}`));
  child.stderr.on("data", (buf) => process.stderr.write(`[${name}] ${buf}`));

  child.on("exit", (code) => {
    process.stdout.write(`\n[${name}] exited with code ${code}\n`);
    shutdown();
  });

  procs.push(child);
};

const shutdown = () => {
  while (procs.length) {
    const p = procs.pop();
    if (!p.killed) p.kill("SIGTERM");
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

start("server", "npm", ["run", "server"]);
start("frontend", "npm", ["run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]);

process.stdout.write("\nStarted backend + frontend together.\n");
process.stdout.write("Website: http://localhost:5173\nAdmin:   http://localhost:5173/admin\nAPI:     http://localhost:5001\n\n");
