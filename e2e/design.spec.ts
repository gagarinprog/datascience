import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Roda em 390 px e 1280 px (projetos do playwright.config.ts).
test.describe("página /design", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/design");
    await expect(page.getByRole("heading", { level: 1, name: "Sistema de design" })).toBeVisible();
  });

  test("não tem rolagem horizontal", async ({ page }) => {
    const larguras = await page.evaluate(() => ({
      documento: document.documentElement.scrollWidth,
      janela: window.innerWidth,
    }));

    expect(larguras.documento).toBeLessThanOrEqual(larguras.janela);
  });

  test("passa no axe: WCAG A e AA, inclusive contraste", async ({ page }) => {
    const resultado = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    expect(resultado.violations).toEqual([]);
  });

  test("todo botão tem alvo de toque de pelo menos 44 px", async ({ page }) => {
    const pequenos = await page.locator("main button").evaluateAll((botoes) =>
      botoes
        .map((botao) => {
          const caixa = botao.getBoundingClientRect();
          return { texto: botao.textContent?.trim(), altura: caixa.height, largura: caixa.width };
        })
        .filter((botao) => botao.altura < 44 || botao.largura < 44),
    );

    expect(pequenos).toEqual([]);
  });

  test("o foco é um anel --corrente de 2 px", async ({ page }) => {
    await page.getByRole("button", { name: "Simular acerto" }).focus();
    await page.keyboard.press("Tab");

    const foco = await page.evaluate(() => {
      const elemento = document.activeElement as HTMLElement;
      const estilo = getComputedStyle(elemento);
      const corrente = document.createElement("span");
      corrente.style.color = "var(--color-corrente)";
      document.body.append(corrente);
      const esperada = getComputedStyle(corrente).color;
      corrente.remove();
      return {
        estilo: estilo.outlineStyle,
        largura: estilo.outlineWidth,
        cor: estilo.outlineColor,
        esperada,
      };
    });

    expect(foco.estilo).toBe("solid");
    expect(foco.largura).toBe("2px");
    expect(foco.cor).toBe(foco.esperada);
  });

  test("o painel de feedback sobe depois de verificar", async ({ page }) => {
    await page.getByRole("button", { name: "Simular erro" }).click();
    const painel = page.locator("section[data-resultado='errado']").last();

    await expect(painel.getByRole("status")).toContainText("Ainda não");
    await expect(painel.getByRole("button", { name: "Explicar meu erro" })).toBeInViewport();

    await painel.getByRole("button", { name: "Tentar de novo" }).click();
    await expect(page.getByRole("button", { name: "Tentar de novo" })).toHaveCount(1);
  });

  test("com reduzir movimento, o painel aparece sem animar", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.reload();

    await page.getByRole("button", { name: "Simular acerto" }).click();
    const painel = page.locator("section[data-resultado='certo']").last();

    // Sem animação, o painel já nasce na posição final (sem deslocamento).
    const transformacao = await painel.evaluate((elemento) => getComputedStyle(elemento).transform);
    expect(["none", "matrix(1, 0, 0, 1, 0, 0)"]).toContain(transformacao);
  });
});

test("a página inicial leva ao sistema de design", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Ver o sistema de design" }).click();

  await expect(page).toHaveURL(/\/design$/);
});
