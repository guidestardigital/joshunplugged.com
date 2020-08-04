module.exports = ({ env }) => {
  console.log('Initializing database.js...')

  return {
    defaultConnection: "default",
    connections: {
      default: {
        connector: "bookshelf",
        settings: {
          client: "postgres",
          database: env('POSTGRES_DB'),
          host: env('POSTGRES_HOST'),
          port: env('POSTGRES_EXTERNAL_PORT'),
          username: env('POSTGRES_USER'),
          password: env('POSTGRES_PASSWORD')
        },
        options: {
          useNullAsDefault: true
        }
      }
    }
  };
};