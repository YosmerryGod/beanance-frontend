# MILION Frontend Deployment

## Production architecture

- GitHub Actions builds the Next.js standalone output on the GitHub runner.
- The VPS does not run `npm install` or `next build` during deployment.
- The release archive is uploaded to the VPS and extracted into a timestamped directory under `/var/www/milion-frontend/releases`.
- The `current` symlink is switched atomically after the archive passes structural checks.
- PM2 runs the standalone `server.js` from the `current` symlink on port `3099`.
- The deploy runner uses an exclusive lock, bounded health checks, rollback, and release retention.

## GitHub Actions secrets

Configure these repository secrets:

- `VPS_HOST`
- `VPS_USER`
- `VPS_SSH_KEY`
- `VPS_PORT` (optional; defaults to 22)

The workflow deploys only from `main`. The validation workflow runs on `refactor/**` branches and pull requests but never deploys.

## One-time VPS preparation

Run as the deployment user with permission to manage PM2 and the application directories:

```bash
sudo mkdir -p /opt/milion-frontend-deploy
sudo mkdir -p /var/www/milion-frontend/releases
sudo mkdir -p /var/log/milion-deploy /var/log/milion-frontend
sudo mkdir -p /var/cache/nginx/milion_market
```

The deployment workflow uploads `deploy.js` and `ecosystem.config.cjs` to `/opt/milion-frontend-deploy` on every release. The legacy rollback target is created from the currently deployed Next.js app on the first atomic deployment. After merging the Nginx changes, refresh the source checkout once so the configuration files are available on the VPS; the production deployment workflow itself does not run `git pull`.

## Nginx setup

The cache-zone file contains an `http {}`-level directive. Include it inside the Nginx `http` block:

```nginx
include /var/www/milion-frontend/nginx/market-cache-zone.conf;
```

Include the location file inside the MILION HTTPS `server {}` block:

```nginx
include /var/www/milion-frontend/nginx/market-websocket-location.conf;
```

Ensure the Nginx worker user can write to the cache directory, then validate and reload:

```bash
sudo chown -R www-data:www-data /var/cache/nginx/milion_market
sudo nginx -t
sudo systemctl reload nginx
```

The REST micro-cache is limited to two seconds and bypasses requests carrying an Authorization header. The WebSocket route continues to proxy directly to the private market backend at `127.0.0.1:3030`.

## Log rotation

Install the repository logrotate policy:

```bash
sudo cp /var/www/milion-frontend/deploy/logrotate/milion-frontend /etc/logrotate.d/milion-frontend
sudo chmod 644 /etc/logrotate.d/milion-frontend
sudo logrotate -d /etc/logrotate.d/milion-frontend
```

Configure PM2's log rotation once:

```bash
bash /var/www/milion-frontend/deploy/setup-pm2-logrotate.sh
```

The PM2 policy retains seven compressed application logs with a 10 MB rotation threshold. The OS logrotate policy handles deployment logs only, avoiding double rotation of PM2 output files. Deployment logs are also pruned to the latest seven files by the deploy runner.

## Resource limits

| Resource | Setting | Purpose |
| --- | --- | --- |
| Node.js heap | 384 MB | Bound frontend process heap |
| PM2 restart threshold | 512 MB | Restart a process that exceeds its memory budget |
| PM2 instances | 1 | Avoid duplicating Next.js memory use |
| Build host | GitHub Actions runner | Keep compilation CPU and RAM off the shared VPS |
| Concurrent deploys | 1 | Workflow concurrency plus VPS file lock |
| Health check | 15 attempts, 2-second request timeout | Fail quickly and roll back |
| Retained releases | 3 | Bound disk use while preserving rollback |
| Deployment logs | 7 files | Bound deployment log growth |
| Market API cache | 2 seconds | Reduce repeated public market reads |

## Operational checks

After deployment:

```bash
pm2 status
pm2 logs milion-frontend --lines 80
curl -fsS http://127.0.0.1:3099/api/health
readlink -f /var/www/milion-frontend/current
df -h
free -h
```

Do not expose backend port 3030 publicly. Browser traffic should use the same-origin `/market-api` and `/ws/market` routes.
