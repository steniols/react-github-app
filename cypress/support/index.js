import "./commands";

beforeEach(() => {
  cy.githubLogin();

  Cypress.Cookies.defaults({
    preserve: /[\s\S]*/,
  });
});
