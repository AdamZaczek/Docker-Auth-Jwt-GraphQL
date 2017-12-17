module.exports = {
  development: {
    client: 'pg',
    connection: {
      user: 'me',
      database: 'my_app',
    },
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
  },
};
