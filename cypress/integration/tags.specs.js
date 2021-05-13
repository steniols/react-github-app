/// <reference types="cypress" />

describe("Tags", () => {
  it("Login", () => {
    cy.githubLogin();
  });

  it("Listar as tags (Nenhum registo encontrado)", () => {
    cy.visit("http://localhost:3000/tag-list");
    cy.get("[data-cy=page-top-title]").should((el) => {
      expect(el.text()).equal("Tags");
    });
    expect(cy.get("[data-cy=no-found-records]")).to.exist;
  });

  it("Listar as tags (com itens)", () => {
    cy.visit("http://localhost:3000/tag-list");
    cy.get("[data-cy=button-add-tag]").click();

    cy.get("[data-cy=tag-input-title]").type("Javascript");
    cy.get("[data-cy=tag-input-content]").type(
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia impedit dolorum omnis necessitatibus molestiae! Excepturi quia fuga quos? Sunt perspiciatis exercitationem ut modi rerum, sit ratione quia optio facere tempore."
    );
    cy.get("[data-cy=tag-input-image]").type("https://picsum.photos/200/300");
    cy.route("POST", "**/save").as("postTag");
    cy.get("[data-cy=tag-submit]").click();
    cy.wait("@postTag");

    cy.visit("http://localhost:3000/tag-list");
    expect(cy.get("[data-cy=list-item]")).to.exist;
  });
});
