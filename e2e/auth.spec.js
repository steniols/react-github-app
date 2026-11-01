const knex = require("knex");
const config = require("../knexfile");
const { test, expect } = require("./fixtures");

test.describe("Sem login", () => {
  test("home mostra o botão de login", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("[data-cy=button-login]")).toBeVisible();
  });

  test("rota protegida redireciona para a home", async ({ page }) => {
    await page.goto("/tag-list");
    await expect(page).toHaveURL("/");
  });

  test("rota inexistente mostra a página 404", async ({ page }) => {
    await page.goto("/nao-existe");
    await expect(page.getByText("Página não encontrada")).toBeVisible();
  });

  test("login redireciona para o OAuth do GitHub com client_id", async ({ page }) => {
    // Don't actually go to GitHub, only check where the app sends the user
    await page.route("https://github.com/**", (route) => route.abort());
    await page.goto("/");
    const [request] = await Promise.all([
      page.waitForRequest((r) => r.url().startsWith("https://github.com/login/oauth/authorize")),
      page.locator("[data-cy=button-login]").click(),
    ]);
    expect(request.url()).toMatch(/client_id=[^&]+/);
  });
});

test.describe("Com login", () => {
  test.use({ loggedIn: true });

  test("home mostra o usuário logado", async ({ page, session }) => {
    await page.goto("/");
    await expect(page.locator("[data-cy=github-login]")).toHaveText(session.login);
    await expect(page.getByText("Você está conectado como:")).toBeVisible();
  });

  test("menu mobile abre e fecha ao navegar", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto("/");
    const tagsLink = page.getByRole("link", { name: "Tags" });
    await expect(tagsLink).toBeHidden();
    await page.locator(".navbar-toggler").click();
    await tagsLink.click();
    await expect(page).toHaveURL(/tag-list/);
    await expect(page.locator("#navbarMenu")).not.toHaveClass(/show/);
  });

  test("logout encerra a sessão", async ({ page, session }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Sair" }).click();
    await expect(page.locator("[data-cy=button-login]")).toBeVisible();
    expect(await page.evaluate(() => localStorage.getItem("tokenGithub"))).toBeNull();

    // Logout removes the token from the test database: register it again for the other tests
    const db = knex(config.test);
    await db("auth").insert({ username: session.login, token: session.token });
    await db.destroy();
  });
});
