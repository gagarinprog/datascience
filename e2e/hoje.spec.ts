import { expect, test } from "@playwright/test";

import { fixarRelogio } from "./relogio";

test.describe("tela Hoje", () => {
  test.beforeEach(async ({ page }) => {
    await fixarRelogio(page);
  });

  test("mostra o dia, a sequência, a missão e o aviso da AP", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1, name: "Domingo, 11 out" })).toBeVisible();
    await expect(page.getByText("12 dias")).toBeVisible();
    await expect(page.getByRole("progressbar", { name: "Meta da semana" })).toHaveAttribute(
      "aria-valuetext",
      "6 de 7 dias",
    );
    await expect(page.getByRole("heading", { level: 2, name: "Missão de hoje" })).toBeVisible();
    await expect(page.getByText("SQL · GROUP BY e HAVING")).toBeVisible();
    await expect(page.getByText("No fim, você vai saber filtrar grupos com HAVING.")).toBeVisible();
    await expect(page.getByText("25 min · 12 revisões")).toBeVisible();
    await expect(page.getByText("AP de Banco de Dados em 15 dias")).toBeVisible();
  });

  test("Começar sessão abre o desafio da lição", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Começar sessão" }).click();

    await expect(page).toHaveURL(/\/licao\/bd-group-by-having$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "A consulta abaixo lista as disciplinas com mais de 5 questões difíceis.",
    );
  });

  test("Só 10 minutos hoje leva para Revisar", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Só 10 minutos hoje" }).click();

    await expect(page).toHaveURL(/\/revisar$/);
  });

  test("a data e os dias até a AP seguem o relógio", async ({ page }) => {
    await fixarRelogio(page, new Date("2026-10-12T08:00:00-03:00"));
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1, name: "Segunda, 12 out" })).toBeVisible();
    await expect(page.getByText("AP de Banco de Dados em 14 dias")).toBeVisible();
  });
});
