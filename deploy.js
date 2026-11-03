#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { spawnSync } = require("node:child_process");

const PROJECT_DIR = path.resolve(process.env.PROJECT_DIR || "/var/www/beanance-frontend");
const DEPLOY_DIR = __dirname;
const RELEASES_DIR = path.join(PROJECT_DIR, "releases");
const CURRENT_LINK = path.join(PROJECT_DIR, "current");
const APP_PORT = Number(process.env.APP_PORT || 3099);
const APP_HOST = process.env.APP_HOST || "127.0.0.1";
const PM2_TARGET = process.env.PM2_TARGET || "beanance-frontend";
const LOG_DIR = process.env.DEPLOY_LOG_DIR || "/var/log/beanance-deploy";
const APP_LOG_DIR = process.env.APP_LOG_DIR || "/var/log/beanance-frontend";
const LOCK_FILE = process.env.DEPLOY_LOCK_FILE || "/var/lock/beanance-frontend-deploy.lock";
const KEEP_RELEASES = Math.max(2, Number(process.env.KEEP_RELEASES || 3));
const HEALTH_ATTEMPTS = 15;
const HEALTH_TIMEOUT_MS = 2000;

let lockFd = null;
let logFile = null;

function writeLog(message, error = false) {
  const line = "[" + new Date().toISOString() + "] " + message + os.EOL;
  if (logFile) fs.appendFileSync(logFile, line);
  (error ? process.stderr : process.stdout).write(line);
}

function processIsAlive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error.code === "EPERM";
  }
}

function acquireLock() {
  fs.mkdirSync(path.dirname(LOCK_FILE), { recursive: true });
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      lockFd = fs.openSync(LOCK_FILE, "wx", 0o600);
      fs.writeFileSync(lockFd, JSON.stringify({ pid: process.pid, startedAt: Date.now() }));
      return;
    } catch (error) {
      if (error.code !== "EEXIST") throw error;
      let lock = null;
      try { lock = JSON.parse(fs.readFileSync(LOCK_FILE, "utf8")); } catch {}
      const age = Date.now() - fs.statSync(LOCK_FILE).mtimeMs;
      if (lock && processIsAlive(Number(lock.pid))) {
        throw new Error("Another deployment is already running (PID " + lock.pid + ").");
      }
      if (age < 5 * 60 * 1000) {
        throw new Error("Deployment lock exists and is not old enough to be considered stale.");
      }
      fs.unlinkSync(LOCK_FILE);
    }
  }
  throw new Error("Unable to acquire deployment lock.");
}

function releaseLock() {
  if (lockFd !== null) {
    fs.closeSync(lockFd);
    lockFd = null;
  }
  try {
    const lock = JSON.parse(fs.readFileSync(LOCK_FILE, "utf8"));
    if (Number(lock.pid) === process.pid) fs.unlinkSync(LOCK_FILE);
  } catch {}
}

function run(command, args, options = {}) {
  writeLog("RUN: " + command + " " + args.join(" "));
  const result = spawnSync(command, args, {
    cwd: options.cwd || PROJECT_DIR,
    stdio: "inherit",
    env: { ...process.env, PROJECT_DIR, APP_PORT: String(APP_PORT) },
    timeout: options.timeout || 10 * 60 * 1000,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(command + " exited with status " + result.status);
}

function currentTarget() {
  try { return fs.realpathSync(CURRENT_LINK); } catch { return null; }
}

function switchRelease(target) {
  const temporaryLink = CURRENT_LINK + ".next-" + process.pid;
  try { fs.unlinkSync(temporaryLink); } catch {}
  fs.symlinkSync(target, temporaryLink, "dir");
  fs.renameSync(temporaryLink, CURRENT_LINK);
}

function createLegacyRelease() {
  const legacyDir = path.join(RELEASES_DIR, "legacy-" + Date.now());
  fs.mkdirSync(legacyDir, { recursive: true });
  const server = `"use strict";
const http = require("node:http");
const path = require("node:path");
const appRoot = process.env.LEGACY_APP_DIR || ${JSON.stringify(PROJECT_DIR)};
const next = require(path.join(appRoot, "node_modules", "next"));
const app = next({ dev: false, dir: appRoot });
const handle = app.getRequestHandler();
const port = Number(process.env.PORT || ${APP_PORT});
const host = process.env.HOSTNAME || ${JSON.stringify(APP_HOST)};
app.prepare().then(() => {
  http.createServer((request, response) => {
  if (request.url === "/api/health") {
    response.writeHead(200, { "content-type": "application/json", "cache-control": "no-store" });
    response.end(JSON.stringify({ success: true, service: "beanance-frontend", status: "ok" }));
    return;
  }
  handle(request, response);
}).listen(port, host, () => {
    process.stdout.write("Legacy Beanance server listening on " + host + ":" + port + "\\n");
  });
}).catch((error) => {
  process.stderr.write(String(error.stack || error) + "\\n");
  process.exit(1);
});
`;
  fs.writeFileSync(path.join(legacyDir, "server.js"), server);
  return legacyDir;
}

async function waitForHealth() {
  const url = "http://" + APP_HOST + ":" + APP_PORT + "/api/health";
  for (let attempt = 1; attempt <= HEALTH_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(HEALTH_TIMEOUT_MS), cache: "no-store" });
      if (response.ok) {
        const payload = await response.json();
        if (payload?.success && payload?.service === "beanance-frontend") {
          writeLog("HEALTH CHECK OK: " + url);
          return;
        }
      }
      writeLog("Health check " + attempt + "/" + HEALTH_ATTEMPTS + " returned HTTP " + response.status);
    } catch (error) {
      writeLog("Health check " + attempt + "/" + HEALTH_ATTEMPTS + ": " + error.message);
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error("New release did not pass the bounded health check.");
}

function rotateDeploymentLogs() {
  if (!fs.existsSync(LOG_DIR)) return;
  const files = fs.readdirSync(LOG_DIR)
    .filter((name) => name.endsWith(".log"))
    .map((name) => ({ name, time: fs.statSync(path.join(LOG_DIR, name)).mtimeMs }))
    .sort((a, b) => b.time - a.time);
  for (const file of files.slice(7)) fs.rmSync(path.join(LOG_DIR, file.name), { force: true });
}

function pruneReleases(current, previous) {
  const releases = fs.readdirSync(RELEASES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const fullPath = path.join(RELEASES_DIR, entry.name);
      return { fullPath, time: fs.statSync(fullPath).mtimeMs };
    })
    .sort((a, b) => b.time - a.time);
  const keep = new Set([current, previous, ...releases.slice(0, KEEP_RELEASES).map((item) => item.fullPath)]);
  for (const release of releases) {
    if (!keep.has(release.fullPath)) fs.rmSync(release.fullPath, { recursive: true, force: true });
  }
}

async function main() {
  const archive = process.argv[2] || process.env.RELEASE_ARCHIVE;
  if (!archive) throw new Error("Usage: node deploy.js /path/to/beanance-release.tar.gz");
  if (!fs.existsSync(archive)) throw new Error("Release archive not found: " + archive);

  acquireLock();
  fs.mkdirSync(LOG_DIR, { recursive: true });
  fs.mkdirSync(APP_LOG_DIR, { recursive: true });
  fs.mkdirSync(RELEASES_DIR, { recursive: true });
  logFile = path.join(LOG_DIR, "deploy-" + new Date().toISOString().replace(/[:.]/g, "-") + ".log");
  const startedAt = Date.now();
  let previous = currentTarget();
  let nextRelease = null;

  try {
    writeLog("Deployment started. Host=" + os.hostname() + ", PID=" + process.pid);
    writeLog("Project=" + PROJECT_DIR + ", Port=" + APP_PORT + ", PM2=" + PM2_TARGET);
    if (!previous) {
      previous = createLegacyRelease();
      switchRelease(previous);
      writeLog("Created first-deployment rollback target: " + previous);
    }

    const releaseName = new Date().toISOString().replace(/[:.]/g, "-") + "-" + process.pid;
    nextRelease = path.join(RELEASES_DIR, releaseName);
    fs.mkdirSync(nextRelease, { recursive: true });
    run("tar", ["-xzf", path.resolve(archive), "-C", nextRelease]);
    if (!fs.existsSync(path.join(nextRelease, "server.js")) || !fs.existsSync(path.join(nextRelease, ".next", "BUILD_ID"))) {
      throw new Error("Release archive is incomplete: standalone server.js or .next/BUILD_ID is missing.");
    }
    if (!fs.existsSync(path.join(nextRelease, "node_modules", "next"))) {
      throw new Error("Standalone release is missing its traced Next.js runtime.");
    }

    writeLog("Prepared release: " + nextRelease);
    switchRelease(nextRelease);
    run("pm2", ["startOrReload", path.join(DEPLOY_DIR, "ecosystem.config.cjs"), "--update-env"]);
    await waitForHealth();
    run("pm2", ["save"]);
    pruneReleases(nextRelease, previous);
    rotateDeploymentLogs();
    try { fs.rmSync(archive, { force: true }); } catch {}
    writeLog("DEPLOYMENT SUCCESS in " + ((Date.now() - startedAt) / 1000).toFixed(1) + " seconds");
  } catch (error) {
    writeLog("DEPLOYMENT FAILED: " + (error.stack || error.message), true);
    if (previous && fs.existsSync(previous)) {
      try {
        writeLog("Rolling back to " + previous);
        switchRelease(previous);
        run("pm2", ["startOrReload", path.join(DEPLOY_DIR, "ecosystem.config.cjs"), "--update-env"]);
        await waitForHealth();
        run("pm2", ["save"]);
        writeLog("ROLLBACK SUCCESS");
      } catch (rollbackError) {
        writeLog("ROLLBACK FAILED: " + (rollbackError.stack || rollbackError.message), true);
      }
    }
    if (nextRelease && nextRelease !== previous) {
      try { fs.rmSync(nextRelease, { recursive: true, force: true }); } catch {}
    }
    process.exitCode = 1;
  } finally {
    rotateDeploymentLogs();
    releaseLock();
  }
}

main().catch((error) => {
  writeLog("FATAL: " + (error.stack || error.message), true);
  releaseLock();
  process.exitCode = 1;
});
