import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { extrairTokensDeCor } from "./tokens";

const css = readFileSync(join(process.cwd(), "app", "globals.css"), "utf-8");
const design = readFileSync(join(process.cwd(), "docs", "DESIGN.md"), "utf-8");

/** Lê as tabelas de cor do DESIGN.md: | `--fundo` | `#0D1430` | ... */
function tokensDoDesign(markdown: string) {
  return Array.from(
    markdown.matchAll(/`(--[a-z0-9-]+)`\s*\|\s*`(#[0-9a-fA-F]{6})`/g),
    (achado) => ({
      nome: achado[1] ?? "",
      hex: (achado[2] ?? "").toLowerCase(),
    }),
  );
}

describe("extrairTokensDeCor", () => {
  it("lê as declarações e ignora o reset da paleta", () => {
    const tokens = extrairTokensDeCor(`
      --color-*: initial;
      --color-fundo: #0d1430;
      --color-corrente-base: color-mix(in oklab, var(--color-corrente) 52%, var(--color-fundo));
    `);

    expect(tokens).toEqual([
      { nome: "--fundo", variavel: "--color-fundo", valor: "#0d1430" },
      {
        nome: "--corrente-base",
        variavel: "--color-corrente-base",
        valor: "color-mix(in oklab, var(--color-corrente) 52%, var(--color-fundo))",
      },
    ]);
  });
});

describe("tokens de cor do globals.css contra o DESIGN.md", () => {
  const doDesign = tokensDoDesign(design);
  const doCss = extrairTokensDeCor(css);

  it("o DESIGN.md tem 18 tokens: 11 de base e 7 de disciplina", () => {
    expect(doDesign).toHaveLength(18);
  });

  it("todo token do DESIGN.md está no globals.css com o mesmo valor", () => {
    for (const { nome, hex } of doDesign) {
      expect(doCss.find((token) => token.nome === nome)?.valor.toLowerCase(), nome).toBe(hex);
    }
  });

  it("cor que não está no DESIGN.md é mistura de tokens, nunca hex novo", () => {
    const nomesDoDesign = new Set(doDesign.map((token) => token.nome));
    const derivadas = doCss.filter((token) => !nomesDoDesign.has(token.nome));

    for (const derivada of derivadas) {
      expect(derivada.valor, derivada.nome).toMatch(
        /^color-mix\(in oklab, var\(--color-[a-z0-9-]+\) \d+%, var\(--color-[a-z0-9-]+\)\)$/,
      );
    }
  });
});
