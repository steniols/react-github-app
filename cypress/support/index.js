import "./commands";

beforeEach(() => {
  cy.server();
  cy.githubLogin();
});
