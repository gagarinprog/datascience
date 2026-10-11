import { expect, test, type Page } from "@playwright/test";

import { fixarRelogio } from "./relogio";

// pnpm capturas: grava docs/capturas/<tela>-<projeto>.png para comparar com o DESIGN.md.
// O /design sai inteiro; as telas do app saem do tamanho da janela, com a navegação.
// Sem movimento, para a captura mostrar o estado final de cada tela.
test.use({ reducedMotion: "reduce" });

const TELAS: {
  nome: string;
  rota: string;
  paginaInteira: boolean;
  antes?: (page: Page) => Promise<void>;
}[] = [
  { nome: "design", rota: "/design", paginaInteira: true },
  { nome: "hoje", rota: "/", paginaInteira: false },
  { nome: "trilha", rota: "/trilha", paginaInteira: false },
  { nome: "revisar", rota: "/revisar", paginaInteira: false },
  { nome: "laboratorio", rota: "/laboratorio", paginaInteira: false },
  { nome: "perfil", rota: "/perfil", paginaInteira: false },
  { nome: "licao", rota: "/licao/bd-group-by-having", paginaInteira: false },
  {
    nome: "licao-feedback",
    rota: "/licao/bd-group-by-having",
    paginaInteira: false,
    antes: async (page) => {
      await page.getByRole("button", { name: "Errado" }).click();
      await page.getByRole("button", { name: "Verificar" }).click();
      await expect(page.getByRole("status")).toBeVisible();
    },
  },
];

for (const tela of TELAS) {
  test(`captura de ${tela.nome}`, { tag: "@captura" }, async ({ page }, info) => {
    await fixarRelogio(page);
    await page.goto(tela.rota);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator('[aria-busy="true"]')).toHaveCount(0);
    await tela.antes?.(page);
    await page.evaluate(() => document.fonts.ready);

    await page.screenshot({
      path: `docs/capturas/${tela.nome}-${info.project.name}.png`,
      fullPage: tela.paginaInteira,
      animations: "disabled",
    });
  });
}
