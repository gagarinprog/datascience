import { expect, test, type Page } from "@playwright/test";

import { fixarRelogio } from "./relogio";

/** Conta as transições de tela pedidas ao navegador (View Transitions API). */
async function contarTransicoes(page: Page) {
  await page.addInitScript(() => {
    const registro: string[][] = [];
    Object.defineProperty(window, "__transicoes", { value: registro });
    const original = document.startViewTransition?.bind(document);
    if (!original) return;
    document.startViewTransition = ((argumento?: unknown) => {
      const tipos =
        typeof argumento === "object" && argumento !== null && "types" in argumento
          ? Array.from((argumento as { types?: Iterable<string> }).types ?? [])
          : [];
      registro.push(tipos);
      return original(argumento as Parameters<typeof original>[0]);
    }) as typeof document.startViewTransition;
  });
}

async function transicoes(page: Page): Promise<string[][]> {
  return page.evaluate(() => (window as unknown as { __transicoes: string[][] }).__transicoes);
}

test.describe("movimento", () => {
  test.beforeEach(async ({ page }) => {
    await fixarRelogio(page);
    await contarTransicoes(page);
  });

  test("a navegação fica parada durante as transições de tela", async ({ page }) => {
    await page.goto("/");
    const nome = await page
      .getByRole("navigation", { name: "Principal" })
      .evaluate((navegacao) => getComputedStyle(navegacao).viewTransitionName);
    expect(nome).toBe("navegacao");
  });

  test("trocar de aba e entrar na lição passam por transições de tela", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const antes = (await transicoes(page)).length;

    await page
      .getByRole("navigation", { name: "Principal" })
      .getByRole("link", { name: "Trilha" })
      .click();
    await expect(page.getByRole("heading", { level: 1, name: "Trilha" })).toBeVisible();
    await expect.poll(async () => (await transicoes(page)).length).toBeGreaterThan(antes);

    const naTrilha = (await transicoes(page)).length;
    await page.getByRole("link", { name: "Estudar agora" }).click();
    await expect(page).toHaveURL(/\/licao\//);
    await expect.poll(async () => (await transicoes(page)).length).toBeGreaterThan(naTrilha);
  });
});
