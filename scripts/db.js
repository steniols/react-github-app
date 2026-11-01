// Runs a local PostgreSQL server (no Docker or system install needed).
// Data is kept in ./.pgdata between runs. Stop it with Ctrl+C.
require("dotenv").config({ quiet: true });
const fs = require("fs");
const net = require("net");
const path = require("path");
const EmbeddedPostgres = require("embedded-postgres").default;

const databaseDir = path.join(__dirname, "../.pgdata");
const databases = [process.env.PG_DATABASE, process.env.PG_DATABASE_TEST].filter(Boolean);

// Keep the last PostgreSQL log lines to explain a failed start
const logs = [];
const keepLog = (message) => {
  logs.push(String(message).trim());
  if (logs.length > 20) logs.shift();
};

const port = Number(process.env.PG_PORT) || 5432;
const pg = new EmbeddedPostgres({
  databaseDir,
  user: process.env.PG_USER || "postgres",
  password: process.env.PG_PASSWORD || "password",
  port,
  persistent: true,
  onLog: keepLog,
  onError: keepLog,
});

function isPortInUse() {
  return new Promise((resolve) => {
    const socket = net.connect(port, "127.0.0.1");
    socket.once("connect", () => socket.end(() => resolve(true)));
    socket.once("error", () => resolve(false));
  });
}

async function main() {
  if (await isPortInUse()) {
    console.error(
      `Port ${port} is already in use. PostgreSQL may already be running ` +
        `(e.g. from another terminal), or set another PG_PORT in .env.`
    );
    process.exitCode = 1;
    return;
  }

  if (!fs.existsSync(path.join(databaseDir, "PG_VERSION"))) {
    await pg.initialise();
  }
  await pg.start();

  const client = pg.getPgClient();
  await client.connect();
  for (const name of databases) {
    const { rowCount } = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [name]);
    if (!rowCount) {
      await pg.createDatabase(name);
      console.log(`Database "${name}" created`);
    }
  }
  await client.end();

  console.log(`PostgreSQL running on port ${port} (Ctrl+C to stop)`);
}

async function stop() {
  await pg.stop();
  process.exit(0);
}

process.on("SIGINT", stop);
process.on("SIGTERM", stop);

main().catch(async (error) => {
  console.error("Could not start PostgreSQL.", error?.message || "");
  console.error(logs.filter(Boolean).join("\n"));
  await pg.stop().catch(() => null);
  process.exitCode = 1;
});
