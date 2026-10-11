import { expect, test } from "@playwright/test";

import { fixarRelogio } from "./relogio";

// pnpm capturas: grava docs/capturas/<tela>-<projeto>.png para comparar com o DESIGN.md.
// O /design sai inteiro; as telas do app saem do tamanho da janela, com a navegação.
const TELAS = [
  { nome: "design", rota: "/design", paginaInteira: true },
  { nome: "hoje", rota: "/", paginaInteira: false },
  { nome: "trilha", rota: "/trilha", paginaInteira: false },
  { nome: "revisar", rota: "/revisar", paginaInteira: false },
  { nome: "laboratorio", rota: "/laboratorio", paginaInteira: false },
  { nome: "perfil", rota: "/perfil", paginaInteira: false },
  { nome: "licao", rota: "/licao/bd-group-by-having", paginaInteira: false },
];

for (const tela of TELAS) {
  test(`captura de ${tela.rota}`, { tag: "@captura" }, async ({ page }, info) => {
    await fixarRelogio(page);
    await page.goto(tela.rota);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.evaluate(() => document.fonts.ready);

    await page.screenshot({
      path: `docs/capturas/${tela.nome}-${info.project.name}.png`,
      fullPage: tela.paginaInteira,
      animations: "disabled",
    });
  });
}
