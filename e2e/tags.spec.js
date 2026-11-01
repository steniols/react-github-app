const { test, expect } = require("./fixtures");

test.use({ loggedIn: true });
// Each test continues from the tag created in the previous one
test.describe.configure({ mode: "serial" });

const title = `Tag E2E ${Date.now().toString().slice(-6)}`;
const editedTitle = `${title} editada`;
let tagPath;
let repoName;

const toast = (page, text) => page.locator(".Toastify__toast", { hasText: text });

test("salvar sem título mostra erro de validação", async ({ page }) => {
  await page.goto("/tag-list");
  await page.locator("[data-cy=button-add-tag]").click();
  await page.locator("[data-cy=tag-submit]").click();
  await expect(toast(page, "O Título é obrigatório")).toBeVisible();
});

test("cria uma tag", async ({ page }) => {
  await page.goto("/tag-add");
  await page.locator("[data-cy=tag-input-title]").fill(title);
  await page.locator("[data-cy=tag-input-content]").fill("Tag criada pelo teste E2E.");
  await page.locator("[data-cy=tag-input-image]").fill("https://picsum.photos/200/300");
  await page.locator("[data-cy=tag-submit]").click();

  await expect(toast(page, "A Tag foi salva com sucesso")).toBeVisible();
  await expect(page).toHaveURL(/\/tag-detail\/\d+$/);
  await expect(page.getByText(title)).toBeVisible();
  tagPath = new URL(page.url()).pathname;
});

test("edita a tag", async ({ page }) => {
  await page.goto(tagPath);
  await page.getByRole("button", { name: "Editar" }).click();
  // The form is only shown after the tag is loaded
  await expect(page.locator("[data-cy=tag-input-title]")).toHaveValue(title);
  await page.locator("[data-cy=tag-input-title]").fill(editedTitle);
  await page.locator("[data-cy=tag-submit]").click();

  await expect(toast(page, "A tag foi atualizada com sucesso")).toBeVisible();
  await expect(page).toHaveURL(tagPath);
  await expect(page.getByText(editedTitle)).toBeVisible();
});

test("a tag aparece na lista de tags", async ({ page }) => {
  await page.goto("/tag-list");
  await expect(page.locator("[data-cy=list-item]", { hasText: editedTitle })).toBeVisible();
});

test("relaciona a tag a um repositório e mantém após recarregar", async ({ page }) => {
  await page.goto("/repository-list");
  const first = page.locator("[data-cy=list-item]").first();
  await expect(first).toBeVisible({ timeout: 60000 });
  repoName = (await first.locator("h4").textContent()).trim();
  await first.click();

  await page.locator(".dropdown-container").click();
  await page.locator(".dropdown-content").getByText(editedTitle).click();
  await expect(toast(page, "As tags do repositório foram atualizadas com sucesso!")).toBeVisible();

  await page.reload();
  await page.locator(".dropdown-container").click();
  await expect(
    page.locator(".dropdown-content label", { hasText: editedTitle }).locator("input[type=checkbox]")
  ).toBeChecked();
});

test("busca de repositórios encontra pela tag e mostra o badge", async ({ page }) => {
  await page.goto("/repository-list");
  await page.getByPlaceholder("Procurar por nome, descrição ou tag...").fill(editedTitle.toLowerCase());
  const items = page.locator("[data-cy=list-item]");
  await expect(items).toHaveCount(1, { timeout: 60000 });
  await expect(items.first().locator("h4")).toHaveText(repoName);
  await expect(items.first().locator(".badge", { hasText: editedTitle })).toBeVisible();
});

test("exclui a tag e remove a relação com o repositório", async ({ page }) => {
  page.on("dialog", (dialog) => dialog.accept());
  await page.goto(tagPath);
  await page.getByRole("button", { name: "Excluir" }).click();
  await expect(toast(page, "A tag foi excluída com sucesso")).toBeVisible();
  await expect(page).toHaveURL(/tag-list/);

  await page.goto("/repository-list");
  await page.getByPlaceholder("Procurar por nome, descrição ou tag...").fill(editedTitle.toLowerCase());
  await expect(page.locator("[data-cy=no-found-records]")).toBeVisible({ timeout: 60000 });
});
