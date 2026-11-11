"use strict";

const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const net = require("node:net");

// Forward browser WebSocket connections on /ws/market to the private market backend,
// so the app works when opened directly via http://<ip>:<port> without Nginx.
const MARKET_WS_PORT = Number(process.env.MARKET_WS_PORT || 3030);
const originalEmit = http.Server.prototype.emit;

http.Server.prototype.emit = function (event, req, socket, head) {
  if (event === "upgrade" && String(req.url).split("?")[0] === "/ws/market") {
    const upstream = net.connect(MARKET_WS_PORT, "127.0.0.1", () => {
      let raw = req.method + " " + req.url + " HTTP/1.1\r\n";
      for (let i = 0; i < req.rawHeaders.length; i += 2) {
        raw += req.rawHeaders[i] + ": " + req.rawHeaders[i + 1] + "\r\n";
      }
      upstream.write(raw + "\r\n");
      if (head && head.length) upstream.write(head);
      socket.pipe(upstream);
      upstream.pipe(socket);
    });
    upstream.on("error", () => socket.destroy());
    socket.on("error", () => upstream.destroy());
    socket.on("close", () => upstream.destroy());
    return true;
  }
  return originalEmit.apply(this, arguments);
};

const projectDir = path.resolve(process.env.PROJECT_DIR || "/var/www/milion-frontend");
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

process.stdout.write("Starting MILION release: " + releaseDir + "\n");
require(serverPath);
