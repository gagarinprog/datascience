import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { fixarRelogio } from "./relogio";

test.describe("desafio da lição", () => {
  test.beforeEach(async ({ page }) => {
    await fixarRelogio(page);
    await page.goto("/licao/bd-group-by-having");
  });

  test("acerto: escolher, verificar, ler o porquê e concluir", async ({ page }) => {
    const verificar = page.getByRole("button", { name: "Verificar" });
    await expect(verificar).toBeDisabled();

    await page.getByRole("button", { name: "Errado" }).click();
    await verificar.click();

    const feedback = page.getByRole("status");
    await expect(feedback).toContainText("Certo");
    await expect(feedback).toContainText("Filtro de grupo vai no HAVING.");
    await expect(page.getByRole("progressbar", { name: "Progresso da lição" })).toHaveAttribute(
      "aria-valuenow",
      "1",
    );

    // O foco vai para Continuar: dá para seguir só com o teclado.
    await expect(page.getByRole("button", { name: "Continuar" })).toBeFocused();
    await page.keyboard.press("Enter");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Você acertou o desafio.");
    await page.getByRole("link", { name: "Voltar para Hoje" }).click();
    await expect(page).toHaveURL((url) => url.pathname === "/");
  });

  test("erro: o gabarito aparece e não há 'Tentar de novo' num Certo/Errado", async ({ page }) => {
    await page.getByRole("button", { name: "Certo" }).click();
    await page.getByRole("button", { name: "Verificar" }).click();

    await expect(page.getByRole("status")).toContainText("O gabarito é Errado.");
    await expect(page.getByRole("button", { name: "Errado, gabarito" })).toBeDisabled();
    await expect(page.getByRole("button", { name: "Tentar de novo" })).toHaveCount(0);
  });

  test("com o painel aberto, passa no axe e nada fica fora da tela", async ({ page }) => {
    await page.getByRole("button", { name: "Errado" }).click();
    await page.getByRole("button", { name: "Verificar" }).click();
    await expect(page.getByRole("button", { name: "Continuar" })).toBeInViewport();

    const resultado = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(resultado.violations).toEqual([]);
  });

  test("a tentativa fica guardada no navegador", async ({ page }) => {
    await page.getByRole("button", { name: "Certo" }).click();
    await page.getByRole("button", { name: "Verificar" }).click();
    await expect(page.getByRole("status")).toBeVisible();

    const tentativas = await page.evaluate(() => {
      const bruto = window.localStorage.getItem("dominio:dados:v2");
      return bruto ? JSON.parse(bruto).tentativas : null;
    });
    expect(tentativas).toEqual([
      expect.objectContaining({
        itemId: "bd.group-by-having.desafio",
        correta: false,
        erroTipo: "having_vs_where",
      }),
    ]);
  });
});
