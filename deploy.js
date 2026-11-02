// [ADDED] Beanance production webhook deployment service.
// Run this file with PM2 as a separate, long-lived process.

"use strict";

// [ADDED] Load the private deployment secret from a server-only env file.
try {
  process.loadEnvFile(process.env.DEPLOY_ENV_FILE || "/etc/beanance-deploy.env");
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const http = require("node:http");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");

const APP_DIR = process.env.APP_DIR || "/var/www/beanance-frontend";
const PORT = Number(process.env.DEPLOY_PORT || 3100);
const BRANCH = process.env.DEPLOY_BRANCH || "main";
const APP_PROCESS_NAME = process.env.APP_PROCESS_NAME || "beanance-frontend";
const APP_PORT = Number(process.env.APP_PORT || 3099);
const WEBHOOK_SECRET = process.env.DEPLOY_WEBHOOK_SECRET;
const LOG_DIR = process.env.DEPLOY_LOG_DIR || "/var/log/beanance-deploy";
const MAX_BODY_BYTES = 2 * 1024 * 1024;

let deploymentRunning = false;
let lastDeployment = null;

function timestamp() {
  return new Date().toISOString();
}

function writeLog(file, message) {
  const line = "[" + timestamp() + "] " + message + "\n";
  fs.appendFileSync(file, line, "utf8");
  process.stdout.write(line);
}

function runCommand(command, args, options, logFile, stage) {
  return new Promise((resolve, reject) => {
    writeLog(logFile, "STAGE " + stage + ": START");
    const child = spawn(command, args, {
      cwd: APP_DIR,
      env: options && options.env ? options.env : process.env,
      stdio: ["ignore", "pipe", "pipe"],
    });

    child.stdout.on("data", (chunk) => {
      fs.appendFileSync(logFile, chunk);
      process.stdout.write(chunk);
    });

    child.stderr.on("data", (chunk) => {
      fs.appendFileSync(logFile, chunk);
      process.stderr.write(chunk);
    });

    child.on("error", (error) => {
      writeLog(logFile, "STAGE " + stage + ": ERROR " + error.message);
      reject(error);
    });

    child.on("close", (code, signal) => {
      if (code === 0) {
        writeLog(logFile, "STAGE " + stage + ": SUCCESS");
        resolve();
      } else {
        const error = new Error(
          stage + " failed (exit code " + code + ", signal " + (signal || "none") + ")"
        );
        writeLog(logFile, "STAGE " + stage + ": FAILED " + error.message);
        reject(error);
      }
    });
  });
}

async function waitForHealth(logFile) {
  const url = "http://127.0.0.1:" + APP_PORT;
  const attempts = 30;

  writeLog(logFile, "STAGE HEALTH_CHECK: START " + url);

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(3000),
        headers: { "cache-control": "no-cache" },
      });

      if (response.status >= 200 && response.status < 500) {
        writeLog(logFile, "STAGE HEALTH_CHECK: SUCCESS HTTP " + response.status);
        return;
      }

      writeLog(logFile, "STAGE HEALTH_CHECK: attempt " + attempt + " HTTP " + response.status);
    } catch (error) {
      writeLog(logFile, "STAGE HEALTH_CHECK: attempt " + attempt + " " + error.message);
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  throw new Error("Health check failed after " + attempts + " attempts");
}

async function deploy(payload) {
  if (deploymentRunning) {
    writeLog(lastDeployment.logFile, "DEPLOY SKIPPED: another deployment is already running");
    return;
  }

  deploymentRunning = true;
  const runId = new Date().toISOString().replace(/[:.]/g, "-");
  const logFile = path.join(LOG_DIR, "deploy-" + runId + ".log");
  lastDeployment = { runId, logFile, status: "running", startedAt: timestamp() };

  fs.mkdirSync(LOG_DIR, { recursive: true });
  writeLog(logFile, "DEPLOY START");
  writeLog(logFile, "Repository: " + (payload.repository && payload.repository.full_name || "unknown"));
  writeLog(logFile, "Branch: " + BRANCH);
  writeLog(logFile, "Commit: " + (payload.after || "unknown"));

  try {
    await runCommand("git", ["pull", "--ff-only", "origin", BRANCH], {}, logFile, "GIT_PULL");
    await runCommand("npm", ["install", "--no-package-lock"], {}, logFile, "NPM_INSTALL");
    await runCommand("npm", ["run", "build"], {}, logFile, "BUILD");

    const buildIdPath = path.join(APP_DIR, ".next", "BUILD_ID");
    if (!fs.existsSync(buildIdPath) || fs.statSync(buildIdPath).size === 0) {
      throw new Error("Build validation failed: .next/BUILD_ID is missing or empty");
    }
    writeLog(logFile, "STAGE BUILD_VALIDATION: SUCCESS");

    const pm2Env = { ...process.env, PORT: String(APP_PORT) };
    await runCommand(
      "pm2",
      ["restart", APP_PROCESS_NAME, "--update-env"],
      { env: pm2Env },
      logFile,
      "PM2_RESTART"
    );

    await waitForHealth(logFile);
    lastDeployment.status = "success";
    lastDeployment.finishedAt = timestamp();
    writeLog(logFile, "DEPLOY SUCCESS");
  } catch (error) {
    lastDeployment.status = "failed";
    lastDeployment.finishedAt = timestamp();
    lastDeployment.error = error.message;
    writeLog(logFile, "DEPLOY FAILED at/after stage: " + error.message);
    writeLog(logFile, "PM2 restart is not attempted after a failed pull, install, or build.");
  } finally {
    deploymentRunning = false;
  }
}

function verifySignature(rawBody, signatureHeader) {
  if (!signatureHeader || !signatureHeader.startsWith("sha256=")) return false;

  const received = Buffer.from(signatureHeader.slice(7), "hex");
  const expected = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(rawBody)
    .digest();

  return received.length === expected.length && crypto.timingSafeEqual(received, expected);
}

if (!WEBHOOK_SECRET) {
  process.stderr.write("FATAL: DEPLOY_WEBHOOK_SECRET environment variable is required.\n");
  process.exit(1);
}

const server = http.createServer((request, response) => {
  if (request.method === "GET" && request.url === "/health") {
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify({
      status: "ok",
      service: "beanance-deploy",
      deployment: lastDeployment,
      deploymentRunning,
    }));
    return;
  }

  if (request.method !== "POST" || request.url !== "/github-webhook") {
    response.writeHead(404, { "content-type": "application/json" });
    response.end(JSON.stringify({ error: "Not found" }));
    return;
  }

  const chunks = [];
  let bodyBytes = 0;

  request.on("data", (chunk) => {
    bodyBytes += chunk.length;
    if (bodyBytes > MAX_BODY_BYTES) {
      response.writeHead(413);
      response.end("Payload too large");
      request.destroy();
      return;
    }
    chunks.push(chunk);
  });

  request.on("end", () => {
    const rawBody = Buffer.concat(chunks);
    const signature = request.headers["x-hub-signature-256"];

    if (!verifySignature(rawBody, signature)) {
      response.writeHead(401, { "content-type": "application/json" });
      response.end(JSON.stringify({ error: "Invalid webhook signature" }));
      return;
    }

    if (request.headers["x-github-event"] !== "push") {
      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify({ ignored: "Not a push event" }));
      return;
    }

    let payload;
    try {
      payload = JSON.parse(rawBody.toString("utf8"));
    } catch {
      response.writeHead(400, { "content-type": "application/json" });
      response.end(JSON.stringify({ error: "Invalid JSON payload" }));
      return;
    }

    if (payload.ref !== "refs/heads/" + BRANCH) {
      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify({ ignored: "Push is not for branch " + BRANCH }));
      return;
    }

    if (payload.repository && payload.repository.full_name !== "YosmerryGod/beanance-frontend") {
      response.writeHead(403, { "content-type": "application/json" });
      response.end(JSON.stringify({ error: "Unexpected repository" }));
      return;
    }

    if (deploymentRunning) {
      response.writeHead(409, { "content-type": "application/json" });
      response.end(JSON.stringify({ error: "Deployment already running" }));
      return;
    }

    response.writeHead(202, { "content-type": "application/json" });
    response.end(JSON.stringify({ accepted: true, message: "Deployment queued" }));
    deploy(payload).catch((error) => {
      process.stderr.write("Unexpected deployment error: " + error.message + "\n");
    });
  });
});

server.listen(PORT, "0.0.0.0", () => {
  process.stdout.write(
    "Beanance deploy webhook listening on 0.0.0.0:" + PORT + "\n"
  );
});

process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
});

process.on("SIGINT", () => {
  server.close(() => process.exit(0));
});
