import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { fixarRelogio } from "./relogio";

// Checklist do DESIGN 8 em todas as telas da Fase 1 (o /design tem o seu próprio teste).
const ROTAS = ["/", "/trilha", "/revisar", "/laboratorio", "/perfil", "/licao/bd-group-by-having"];

for (const rota of ROTAS) {
  test.describe(`tela ${rota}`, () => {
    test.beforeEach(async ({ page }) => {
      await fixarRelogio(page);
      await page.goto(rota);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });

    test("passa no axe: WCAG A e AA, inclusive contraste", async ({ page }) => {
      const resultado = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();

      expect(resultado.violations).toEqual([]);
    });

    test("não tem rolagem horizontal", async ({ page }) => {
      const larguras = await page.evaluate(() => ({
        documento: document.documentElement.scrollWidth,
        janela: window.innerWidth,
      }));

      expect(larguras.documento).toBeLessThanOrEqual(larguras.janela);
    });

    test("todo link e botão visível tem alvo de pelo menos 44 px", async ({ page }) => {
      const pequenos = await page.locator("a, button").evaluateAll((elementos) =>
        elementos
          .map((elemento) => {
            const caixa = elemento.getBoundingClientRect();
            return {
              texto: elemento.textContent?.trim(),
              altura: caixa.height,
              largura: caixa.width,
            };
          })
          // O atalho "Pular para o conteúdo" mede 1 px até receber o foco.
          .filter((alvo) => alvo.largura > 1 && alvo.altura > 1)
          .filter((alvo) => alvo.altura < 44 || alvo.largura < 44),
      );

      expect(pequenos).toEqual([]);
    });
  });
}
