import { expect, test, type Page } from "@playwright/test";

import { fixarRelogio } from "./relogio";

const DESTINOS = [
  { nome: "Trilha", caminho: "/trilha", titulo: "Trilha" },
  { nome: "Revisar", caminho: "/revisar", titulo: "Revisar" },
  { nome: "Laboratório", caminho: "/laboratorio", titulo: "Laboratório" },
  { nome: "Eu", caminho: "/perfil", titulo: "Eu" },
  { nome: "Hoje", caminho: "/", titulo: "Domingo, 11 out" },
];

function linkDaNavegacao(page: Page, nome: string) {
  return page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: nome });
}

/** Aperta Tab até o link da navegação ficar com o foco. */
async function focarComTab(page: Page, nome: string) {
  const alvo = linkDaNavegacao(page, nome);
  for (let tentativa = 0; tentativa < 15; tentativa++) {
    await page.keyboard.press("Tab");
    if (await alvo.evaluate((link) => link === document.activeElement)) return;
  }
  throw new Error(`O Tab não chegou em "${nome}"`);
}

test.describe("navegação", () => {
  test.beforeEach(async ({ page }) => {
    await fixarRelogio(page);
  });

  test("dá para ir a cada tela só com o teclado", async ({ page }) => {
    for (const destino of DESTINOS) {
      await page.goto(destino.caminho === "/" ? "/perfil" : "/");
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

      await focarComTab(page, destino.nome);
      await page.keyboard.press("Enter");

      await expect(page).toHaveURL((url) => url.pathname === destino.caminho);
      await expect(page.getByRole("heading", { level: 1, name: destino.titulo })).toBeVisible();
      await expect(linkDaNavegacao(page, destino.nome)).toHaveAttribute("aria-current", "page");
    }
  });

  test("o primeiro Tab mostra o atalho que pula a navegação", async ({ page }) => {
    await page.goto("/trilha");
    await page.keyboard.press("Tab");

    const atalho = page.getByRole("link", { name: "Pular para o conteúdo" });
    await expect(atalho).toBeFocused();
    await expect(atalho).toBeInViewport();

    await page.keyboard.press("Enter");
    await expect(page.locator("main#conteudo")).toBeFocused();
  });

  test("fica embaixo no celular e na lateral no desktop", async ({ page }, info) => {
    await page.goto("/");
    const caixa = await page.getByRole("navigation", { name: "Principal" }).boundingBox();
    const janela = page.viewportSize();
    if (!caixa || !janela) throw new Error("sem medidas da navegação");

    if (info.project.name.startsWith("celular")) {
      expect(caixa.width).toBe(janela.width);
      expect(Math.round(caixa.y + caixa.height)).toBe(janela.height);
    } else {
      expect(caixa.x).toBe(0);
      expect(caixa.height).toBe(janela.height);
      expect(caixa.width).toBe(112);
    }
  });

  test("telas de lição ficam sem navegação, em tela cheia", async ({ page }) => {
    await page.goto("/licao/bd-group-by-having");

    await expect(page.getByRole("navigation", { name: "Principal" })).toHaveCount(0);
    await page.getByRole("link", { name: "Fechar a lição" }).click();
    await expect(page).toHaveURL((url) => url.pathname === "/");
  });
});
