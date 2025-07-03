module.exports = {
  apps: [{
    name: 'twitter-engagement-updater',
    script: 'npx',
    args: 'ts-node -r tsconfig-paths/register scripts/update-twitter-engagement.ts',
    interpreter: 'none',
    exec_mode: 'fork',
    cron_restart: '0 */2 * * *', // Run every 2 hours
    watch: false,
    autorestart: false,
    instances: 1,
    env: {
      NODE_ENV: 'production',
      NODE_PATH: '.',
      TS_NODE_PROJECT: './tsconfig.json'
    }
  }]
}; 