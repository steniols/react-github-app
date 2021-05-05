require("dotenv").config();

module.exports = {
  production: {
    client: "pg",
    connection: `postgres://ligashmowiwuuc:d15962d95a61676f0876f9e503dbe8fc631d5137cb928fcc3f8b5413e463ffbb@ec2-3-217-219-146.compute-1.amazonaws.com:5432/d68ghstahvs7qs`,
    migrations: {
      directory: "migrations",
      tableName: "knex_migrations",
    },
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
