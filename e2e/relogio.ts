import type { Page } from "@playwright/test";

/** Domingo, 11 de outubro de 2026: o dia do exemplo do DESIGN 6.1. */
export const DOMINGO_DO_DESIGN = new Date("2026-10-11T10:00:00-03:00");

/** Congela o relógio do navegador antes de abrir a página. */
export async function fixarRelogio(page: Page, quando: Date = DOMINGO_DO_DESIGN) {
  await page.clock.setFixedTime(quando);
}
