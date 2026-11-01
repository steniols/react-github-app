const { test, expect } = require("./fixtures");

test.use({ loggedIn: true });

const SEARCH = "Procurar por nome, descrição ou tag...";

test("lista os repositórios do usuário", async ({ page }) => {
  await page.goto("/repository-list");
  await expect(page.locator("[data-cy=page-top-title]")).toHaveText("Repositórios");
  await expect(page.locator("[data-cy=list-item]").first()).toBeVisible({ timeout: 60000 });
});

test("busca (sem diferenciar maiúsculas) filtra a lista", async ({ page }) => {
  await page.goto("/repository-list");
  const items = page.locator("[data-cy=list-item]");
  await expect(items.first()).toBeVisible({ timeout: 60000 });
  const name = (await items.first().locator("h4").textContent()).trim();

  await page.getByPlaceholder(SEARCH).fill(name.toUpperCase());
  await expect(items.locator("h4", { hasText: new RegExp(`^${name}$`) })).toBeVisible();

  await page.getByPlaceholder(SEARCH).fill("zzzz-nao-existe-zzzz");
  await expect(page.locator("[data-cy=no-found-records]")).toBeVisible();
  await expect(items).toHaveCount(0);
});

test("detalha um repositório", async ({ page }) => {
  await page.goto("/repository-list");
  const first = page.locator("[data-cy=list-item]").first();
  await expect(first).toBeVisible({ timeout: 60000 });
  const name = (await first.locator("h4").textContent()).trim();
  await first.click();

  await expect(page.locator("[data-cy=page-top-title]")).toHaveText("Repositório");
  await expect(page.locator("[data-cy=repository-detail]")).toContainText(name);
  await expect(page.getByText("Relacionar Tags")).toBeVisible();
});

test("sem tags, mostra link para criar a primeira tag", async ({ page }) => {
  // Simulate a user without tags, regardless of what is in the database
  await page.route("**/tags", (route) =>
    route.request().method() === "GET" ? route.fulfill({ json: { data: [] } }) : route.continue()
  );
  await page.goto("/repository-list");
  const first = page.locator("[data-cy=list-item]").first();
  await expect(first).toBeVisible({ timeout: 60000 });
  await first.click();

  await expect(page.locator("[data-cy=no-tags]")).toContainText("Sem opções");
  await expect(page.locator(".dropdown-container")).toHaveCount(0);
  await page.getByRole("link", { name: "clique aqui para criar a primeira tag" }).click();
  await expect(page).toHaveURL("/tag-add");
  await expect(page.locator("[data-cy=page-top-title]")).toHaveText("Nova Tag");
});
