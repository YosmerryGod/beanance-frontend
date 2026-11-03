"use strict";

const fs = require("node:fs");
const path = require("node:path");

const projectDir = path.resolve(process.env.PROJECT_DIR || "/var/www/beanance-frontend");
const currentLink = path.resolve(process.env.CURRENT_RELEASE_LINK || path.join(projectDir, "current"));
const releaseDir = fs.realpathSync(currentLink);
const serverPath = path.join(releaseDir, "server.js");

if (!fs.existsSync(serverPath)) {
  throw new Error("Active release is missing server.js: " + serverPath);
}

process.chdir(releaseDir);
process.env.NODE_ENV = process.env.NODE_ENV || "production";
process.env.PORT = process.env.PORT || "3099";
process.env.HOSTNAME = process.env.HOSTNAME || "0.0.0.0";

process.stdout.write("Starting Beanance release: " + releaseDir + "\n");
require(serverPath);
