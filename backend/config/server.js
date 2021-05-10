module.exports = ({ env }) => {
  console.log('API_DOMAIN', env('API_DOMAIN'));
  console.log('NODE_ENV', env('NODE_ENV'));

  return {
    host: `0.0.0.0`,
    url: env('API_DOMAIN'),
    port: 1337,
    production: env('NODE_ENV'),
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