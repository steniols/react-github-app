/// <reference types="cypress" />

describe("Github", () => {
  it("Acessar a tela inicial após fazer o login", () => {
    cy.get("[data-cy=github-login]").should((el) => {
      expect(el.text()).equal("steniols");
    });
  });

  it("Listar os repositórios", () => {
    cy.visit("http://localhost:3000/repository-list");
    cy.get("[data-cy=page-top-title]").should((el) => {
      expect(el.text()).equal("Repositórios");
    });
  });
});
