Cypress.Commands.add("githubLogin", () => {
  cy.clearLocalStorage();

  cy.visit(
    `https://github.com/login/oauth/authorize?client_id=${Cypress.env(
      "github_client_id"
    )}&scope=repo`
  );

  cy.get("body").then(($body) => {
    if ($body.find("#login_field").length > 0) {
      cy.get("#login_field").type(Cypress.env("github_username"));
      cy.get("#password").type(Cypress.env("github_password"));
      cy.intercept("POST", "**/session").as("login");
      cy.get(".btn").click();
      cy.wait("@login");
    }
  });

  cy.get("body").then(($body) => {
    if ($body.find("#js-oauth-authorize-btn").length > 0) {
      cy.intercept("POST", "*").as("auth");
      cy.get("#js-oauth-authorize-btn").click();
      cy.wait("@auth");
    }
  });
});

let LOCAL_STORAGE_MEMORY = {};

Cypress.Commands.add("saveLocalStorage", () => {
  Object.keys(localStorage).forEach((key) => {
    LOCAL_STORAGE_MEMORY[key] = localStorage[key];
  });
});

Cypress.Commands.add("restoreLocalStorage", () => {
  Object.keys(LOCAL_STORAGE_MEMORY).forEach((key) => {
    localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key]);
  });
});
