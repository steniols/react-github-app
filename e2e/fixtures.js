const fs = require("fs");
const base = require("@playwright/test");
const { SESSION_FILE } = require("./global-setup");

exports.expect = base.expect;

exports.test = base.test.extend({
  // Set `loggedIn: true` (test.use) to start with the session prepared by global-setup
  loggedIn: [false, { option: true }],

  page: async ({ page, loggedIn }, use) => {
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));

    if (loggedIn) {
      const session = JSON.parse(fs.readFileSync(SESSION_FILE, "utf8"));
      // Only once per tab, so a logout inside the test is not undone on the next navigation
      await page.addInitScript(({ token, login }) => {
        if (!sessionStorage.getItem("e2e-session")) {
          localStorage.setItem("tokenGithub", token);
          localStorage.setItem("loginGithub", login);
          sessionStorage.setItem("e2e-session", "1");
        }
      }, session);
    }

    await use(page);

    base.expect(errors, "uncaught errors in the page").toEqual([]);
  },

  session: async ({}, use) => {
    await use(JSON.parse(fs.readFileSync(SESSION_FILE, "utf8")));
  },
});
