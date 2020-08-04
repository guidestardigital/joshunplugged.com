module.exports = ({ env }) => {
  console.log('Initializing server.js...')

  return {
    host: env('BLOG_DOMAIN'),
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