require("dotenv").config();

module.exports = {
  production: {
    client: "pg",
    connection: `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`,
  },
  development: {
    client: "pg",
    connection: `postgres://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`,
  },
  test: {
    client: "pg",
    connection: "postgres://postgres:teste123@localhost/test-github-app",
  },
};
