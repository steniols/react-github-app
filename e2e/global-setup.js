// Prepares the test database and a logged session for the E2E tests.
//
// Instead of automating the GitHub login page (which breaks with 2FA), it uses a
// GitHub token and registers it in the test database, as the OAuth callback does:
//   1. E2E_GITHUB_TOKEN from .env (a personal access token with the "repo" scope), or
//   2. the token saved by your last login in the app (development database).
require("dotenv").config({ quiet: true });
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const knex = require("knex");
const config = require("../knexfile");

const SESSION_FILE = path.join(__dirname, ".auth", "session.json");

async function findToken(devDb) {
  if (process.env.E2E_GITHUB_TOKEN) return process.env.E2E_GITHUB_TOKEN;
  const auth = await devDb("auth").orderBy("id", "desc").first();
  if (auth) return auth.token;
  throw new Error(
    "No GitHub token for the E2E tests. Set E2E_GITHUB_TOKEN in .env " +
      '(a personal access token with the "repo" scope) or log in once in the app (npm run dev).'
  );
}

module.exports = async () => {
  const devDb = knex(config.development);
  const testDb = knex(config.test);
  try {
    try {
      await testDb.migrate.latest();
    } catch (error) {
      throw new Error(`Could not prepare the test database (is \`npm run db\` running?): ${error.message}`);
    }

    const token = await findToken(devDb);
    const { data: user } = await axios
      .get("https://api.github.com/user", { headers: { authorization: `Bearer ${token}` } })
      .catch((error) => {
        throw new Error(`The GitHub token was rejected (${error.response?.status || error.message}).`);
      });

    await testDb("auth").where("username", user.login).del();
    await testDb("auth").insert({ username: user.login, token });

    fs.mkdirSync(path.dirname(SESSION_FILE), { recursive: true });
    fs.writeFileSync(SESSION_FILE, JSON.stringify({ token, login: user.login, name: user.name }));
  } finally {
    await devDb.destroy();
    await testDb.destroy();
  }
};

module.exports.SESSION_FILE = SESSION_FILE;
