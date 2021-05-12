Cypress.Commands.add("githubLogin", () => {
  cy.clearLocalStorage();

  cy.visit(
    `https://github.com/login/oauth/authorize?client_id=${Cypress.env(
      "github_client_id"
    )}&scope=repo`
  );

  cy.get("body").then(($body) => {
    if ($body.find("#login_field").length > 0) {
      cy.get("#login_field").type(Cypress.env("github_client_id"));
      cy.get("#password").type(Cypress.env("github_client_id"));
      cy.get(".btn").click();
    }
  });
});
