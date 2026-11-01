require("dotenv").config({ quiet: true });

const { PG_USER, PG_PASSWORD, PG_HOST, PG_PORT } = process.env;
const url = (database) =>
  `postgres://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:${PG_PORT}/${database}`;

module.exports = {
  production: {
    client: "pg",
    connection: process.env.DATABASE_URL || url(process.env.PG_DATABASE),
  },
  development: {
    client: "pg",
    connection: url(process.env.PG_DATABASE),
  },
  test: {
    client: "pg",
    connection: url(process.env.PG_DATABASE_TEST),
  },
};
