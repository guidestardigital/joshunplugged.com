module.exports = ({ env }) => {
  console.log('Initializing server.js...')
  Object.keys(process.env).filter(k => !k.startsWith('npm')).sort().forEach(k => {
    console.log(`${k} = ${process.env[k]}`);
  });
  console.log();
  return {
    host: '0.0.0.0',
    port: 1337,
    production: env('NODE_ENV') === 'production',
    proxy: {
      enabled: false
    },
    cron: {
      enabled: false
    },
    admin: {
      autoOpen: false,
      auth: {
        secret: env('ADMIN_JWT_SECRET'),
      },
    },
  };
};