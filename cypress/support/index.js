import "./commands";

// beforeEach(() => {
//   cy.githubLogin();
// });

beforeEach(() => {
  cy.restoreLocalStorage();
  cy.server();
});

afterEach(() => {
  cy.saveLocalStorage();
});
