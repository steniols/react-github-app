/// <reference types="cypress" />

describe("Login", () => {
  it("Login through GitHub", () => {
    const username = Cypress.env("GitHubSocialLoginUsername");
    const password = Cypress.env("GitHubSocialLoginPassword");
    const loginUrl = Cypress.env("loginUrl");
    const cookieName = Cypress.env("cookieName");
    const socialLoginOptions = {
      username: username,
      password: password,
      loginUrl: loginUrl,
      headless: true,
      logs: false,
      loginSelector: '[href="/auth/auth0/GitHub-oauth2"]',
      postLoginSelector: ".account-panel",
    };

    return cy
      .task("GitHubSocialLogin", socialLoginOptions)
      .then(({ cookies }) => {
        cy.clearCookies();

        const cookie = cookies
          .filter((cookie) => cookie.name === cookieName)
          .pop();
        if (cookie) {
          cy.setCookie(cookie.name, cookie.value, {
            domain: cookie.domain,
            expiry: cookie.expires,
            httpOnly: cookie.httpOnly,
            path: cookie.path,
            secure: cookie.secure,
          });

          Cypress.Cookies.defaults({
            preserve: cookieName,
          });
        }
      });
  });
});
