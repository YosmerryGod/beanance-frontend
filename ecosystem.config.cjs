const path = require("node:path");

const projectDir = path.resolve(process.env.PROJECT_DIR || "/var/www/beanance-frontend");
const currentDir = path.join(projectDir, "current");
const appPort = String(process.env.APP_PORT || "3099");

module.exports = {
  apps: [
    {
      name: "beanance-frontend",
      cwd: currentDir,
      script: "server.js",
      instances: 1,
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_restarts: 8,
      min_uptime: "10s",
      exp_backoff_restart_delay: 100,
      restart_delay: 1000,
      max_memory_restart: "512M",
      kill_timeout: 10000,
      listen_timeout: 10000,
      wait_ready: false,
      time: true,
      merge_logs: true,
      out_file: "/var/log/beanance-frontend/out.log",
      error_file: "/var/log/beanance-frontend/error.log",
      env: {
        NODE_ENV: "production",
        PORT: appPort,
        HOSTNAME: "127.0.0.1",
        NODE_OPTIONS: "--max-old-space-size=384",
        LEGACY_APP_DIR: projectDir,
      },
    },
  ],
};
