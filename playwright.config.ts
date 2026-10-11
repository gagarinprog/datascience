import { defineConfig } from "@playwright/test";

const PORTA = 3100;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: `http://localhost:${PORTA}`,
    locale: "pt-BR",
    timezoneId: "America/Sao_Paulo",
    trace: "on-first-retry",
  },
  // Mobile primeiro (390 px), depois desktop (1280 px): todo teste roda nos dois.
  projects: [
    {
      name: "celular-390",
      use: {
        browserName: "chromium",
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: "desktop-1280",
      use: {
        browserName: "chromium",
        viewport: { width: 1280, height: 800 },
      },
    },
  ],
  // Testa o build de produção, que é o que mais se parece com o uso real.
  webServer: {
    command: `pnpm build && pnpm start --port ${PORTA}`,
    url: `http://localhost:${PORTA}`,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
});
