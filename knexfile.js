module.exports = {
  development: {
    client: "pg",
    connection: "postgres://postgres:teste123@localhost/github-app-02",
  },
  test: {
    client: "pg",
    connection: "postgres://postgres:teste123@localhost/test-github-app",
  },
};
