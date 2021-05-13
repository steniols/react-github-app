/// <reference types="cypress" />

describe("Github", () => {
  // it("Login", () => {
  //   cy.githubLogin();
  // });

  it("Acessar a tela inicial após fazer o login", () => {
    cy.get("[data-cy=github-login]").should((el) => {
      expect(el.text()).to.be.a("string");
    });
  });

  it("Listar os repositórios", () => {
    cy.visit("http://localhost:3000/repository-list");
    cy.get("[data-cy=page-top-title]").should((el) => {
      expect(el.text()).equal("Repositórios");
    });
    expect(cy.get("[data-cy=list-item]")).to.exist;
  });

  it("Detalhar um repositório", () => {
    cy.visit("http://localhost:3000/repository-list");
    expect(cy.get("[data-cy=list-item]")).to.exist;

    cy.get("[data-cy=list-item]").first().click();
    cy.get("[data-cy=page-top-title]").should((el) => {
      expect(el.text()).equal("Repositório");
    });
    expect(cy.get("[data-cy=repository-detail]")).to.exist;
  });
});
