Cypress.Commands.add("githubLogin", () => {
  cy.clearLocalStorage();

  // cy.visit(`http://localhost:3000`);
  // cy.get("[data-cy=button-login]").click();

  cy.visit(
    `https://github.com/login/oauth/authorize?client_id=${Cypress.env(
      "github_client_id"
    )}&scope=repo`
  );

  cy.get("body").then(($body) => {
    if ($body.find("#login_field").length > 0) {
      cy.get("#login_field").type(Cypress.env("github_username"));
      cy.get("#password").type(Cypress.env("github_password"));
      cy.intercept("POST", "**/session").as("auth");
      cy.get(".btn").click();
      cy.wait("@auth");
    }

    if ($body.find("#js-oauth-authorize-btn").length > 0) {
      cy.get("#js-oauth-authorize-btn").click();
    }
  });
});
