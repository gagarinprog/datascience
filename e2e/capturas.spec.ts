import { test } from "@playwright/test";

// pnpm capturas: grava docs/capturas/design-<projeto>.png para comparar com o DESIGN.md.
test("captura da página /design", { tag: "@captura" }, async ({ page }, info) => {
  await page.goto("/design");
  await page.evaluate(() => document.fonts.ready);

  await page.screenshot({
    path: `docs/capturas/design-${info.project.name}.png`,
    fullPage: true,
    animations: "disabled",
  });
});
