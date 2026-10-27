import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Desliga as regras de estilo que brigam com o Prettier.
  prettier,
  globalIgnores([
    // Padrões do eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Saídas do Playwright:
    "playwright-report/**",
    "test-results/**",
    "blob-report/**",
    // Apostila: páginas estáticas, fora do app Next.
    "apostila/**",
    // Pacotes gerados por ferramentas/empacotar_offline.py e pelo build do Android (fora do git):
    "build-offline/**",
    "android/**/build/**",
  ]),
]);

export default eslintConfig;
