module.exports = ({ env }) => {
  console.log('POSTGRES_HOST', env('POSTGRES_HOST'));
  console.log('POSTGRES_PORT', env('POSTGRES_PORT'));
  console.log('POSTGRES_DB', env('POSTGRES_DB'));
  console.log('POSTGRES_USER', env('POSTGRES_USER'));
  console.log('NODE_ENV', env('NODE_ENV'));

  return {
    defaultConnection: "default",
    connections: {
      default: {
        connector: "bookshelf",
        settings: {
          client: "postgres",
          database: env('POSTGRES_DB'),
          host: env('POSTGRES_HOST'),
          port: parseInt(env('POSTGRES_PORT')),
          username: env('POSTGRES_USER'),
          password: env('POSTGRES_PASSWORD')
        },
        options: {
          useNullAsDefault: true,
          pool: { 
            min: 0, 
            max: 7 
          }
        }
      }
    }
  };
};