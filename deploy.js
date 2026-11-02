#!/usr/bin/env node
"use strict";

// [MODIFIED] Manual deployment runner invoked by GitHub Actions over SSH.
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const PROJECT_DIR = process.env.PROJECT_DIR || __dirname;
const BRANCH = process.env.BRANCH || "main";
const PM2_TARGET = process.env.PM2_TARGET || "beanance-frontend";
const APP_PORT = Number(process.env.APP_PORT || 3099);
const LOG_DIR = process.env.DEPLOY_LOG_DIR || "/var/log/beanance-deploy";

function log(message) {
  process.stdout.write(`[${new Date().toISOString()}] ${message}\n`);
}

function run(step) {
  log(`START: ${step.name}`);
  const result = spawnSync(step.cmd, step.args, {
    cwd: path.resolve(PROJECT_DIR),
    stdio: "inherit",
    env: { ...process.env, PORT: String(APP_PORT) },
  });

  if (result.error) {
    log(`ERROR: ${step.name}: ${result.error.message}`);
    process.exit(1);
  }

  if (result.status !== 0) {
    log(`ERROR: ${step.name} exited with code ${result.status}`);
    process.exit(result.status || 1);
  }

  log(`SUCCESS: ${step.name}`);
}

async function verifyHealth() {
  const url = `http://127.0.0.1:${APP_PORT}`;
  for (let attempt = 1; attempt <= 30; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(3000) });
      if (response.status >= 200 && response.status < 400) {
        log(`HEALTH CHECK OK: HTTP ${response.status}`);
        return;
      }
      log(`Health check attempt ${attempt}: HTTP ${response.status}`);
    } catch (error) {
      log(`Health check attempt ${attempt}: ${error.message}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  throw new Error("Application health check failed after PM2 restart.");
}

async function main() {
  const projectPath = path.resolve(PROJECT_DIR);
  if (!fs.existsSync(path.join(projectPath, ".git"))) {
    throw new Error(`Git repository not found: ${projectPath}`);
  }

  fs.mkdirSync(LOG_DIR, { recursive: true });
  const logFile = path.join(LOG_DIR, `deploy-${new Date().toISOString().replace(/[:.]/g, "-")}.log`);
  const startedAt = Date.now();

  log(`Deployment started in ${projectPath}`);
  log(`Branch: ${BRANCH}`);
  log(`PM2 target: ${PM2_TARGET}`);
  log(`Detailed output is also streamed to GitHub Actions; deployment log: ${logFile}`);

  const originalWrite = process.stdout.write.bind(process.stdout);
  const originalError = process.stderr.write.bind(process.stderr);
  const append = (stream, chunk, encoding, callback) => {
    fs.appendFileSync(logFile, Buffer.isBuffer(chunk) ? chunk : String(chunk));
    return stream(chunk, encoding, callback);
  };
  process.stdout.write = (chunk, encoding, callback) => append(originalWrite, chunk, encoding, callback);
  process.stderr.write = (chunk, encoding, callback) => append(originalError, chunk, encoding, callback);

  const steps = [
    { name: "Git pull", cmd: "git", args: ["pull", "--ff-only", "origin", BRANCH] },
    { name: "Install dependencies", cmd: "npm", args: ["install", "--no-package-lock"] },
    { name: "Next.js production build", cmd: "npm", args: ["run", "build"] },
  ];

  for (const step of steps) run(step);

  const buildIdPath = path.join(projectPath, ".next", "BUILD_ID");
  if (!fs.existsSync(buildIdPath) || fs.statSync(buildIdPath).size === 0) {
    throw new Error("Build validation failed: .next/BUILD_ID is missing or empty.");
  }
  log("SUCCESS: Build validation");

  run({
    name: "Restart Beanance frontend with PM2",
    cmd: "pm2",
    args: ["restart", PM2_TARGET, "--update-env"],
  });

  await verifyHealth();
  log(`DEPLOYMENT SUCCESS in ${((Date.now() - startedAt) / 1000).toFixed(1)} seconds`);
}

main().catch((error) => {
  log(`DEPLOYMENT FAILED: ${error.stack || error.message}`);
  process.exit(1);
});
