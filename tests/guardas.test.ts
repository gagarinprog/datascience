// @vitest-environment node
/**
 * Guardas do DESIGN.md (checklist da seção 8) que dá para checar no código:
 * nenhuma cor fora dos tokens, nenhum emoji, nenhum rótulo em caixa alta.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { extname, join, relative, sep } from "node:path";

import { describe, expect, it } from "vitest";

const RAIZ = process.cwd();
const PASTAS = ["app", "components", "lib", "content", "data"];
const EXTENSOES = new Set([".ts", ".tsx", ".mts", ".css", ".json", ".svg", ".sql"]);
const ARQUIVO_DOS_TOKENS = "app/globals.css";

type Arquivo = { caminho: string; texto: string };

function listar(pasta: string): string[] {
  if (!existsSync(pasta)) return [];
  return readdirSync(pasta, { withFileTypes: true }).flatMap((item) => {
    const caminho = join(pasta, item.name);
    if (item.isDirectory()) return listar(caminho);
    // Os testes ficam de fora: eles escrevem cores e textos de propósito.
    const ehTeste = /\.test\.tsx?$/.test(item.name);
    return EXTENSOES.has(extname(item.name)) && !ehTeste ? [caminho] : [];
  });
}

const arquivos: Arquivo[] = PASTAS.flatMap((pasta) => listar(join(RAIZ, pasta))).map((caminho) => ({
  caminho: relative(RAIZ, caminho).split(sep).join("/"),
  texto: readFileSync(caminho, "utf-8"),
}));

const hexDoDesign = new Set(
  Array.from(
    readFileSync(join(RAIZ, "docs", "DESIGN.md"), "utf-8").matchAll(/`(#[0-9a-fA-F]{6})`/g),
    (achado) => (achado[1] ?? "").toLowerCase(),
  ),
);

function ocorrencias(padrao: RegExp, filtro: (arquivo: Arquivo) => boolean = () => true) {
  return arquivos
    .filter(filtro)
    .flatMap(({ caminho, texto }) =>
      Array.from(texto.matchAll(padrao), (achado) => `${caminho}: ${achado[0]}`),
    );
}

const HEX = /#[0-9a-fA-F]{3,8}\b/g;

describe("guardas do DESIGN.md", () => {
  it("encontrou os arquivos do app", () => {
    expect(arquivos.some((arquivo) => arquivo.caminho === ARQUIVO_DOS_TOKENS)).toBe(true);
  });

  it("nenhuma cor escrita à mão fora do globals.css e dos SVG", () => {
    const foraDoLugar = (arquivo: Arquivo) =>
      arquivo.caminho !== ARQUIVO_DOS_TOKENS && !arquivo.caminho.endsWith(".svg");

    expect(ocorrencias(HEX, foraDoLugar)).toEqual([]);
    expect(ocorrencias(/\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch)\(/g)).toEqual([]);
  });

  it("todo hex do globals.css e dos SVG é um token do DESIGN.md", () => {
    const comHex = (arquivo: Arquivo) =>
      arquivo.caminho === ARQUIVO_DOS_TOKENS || arquivo.caminho.endsWith(".svg");
    const desconhecidos = ocorrencias(HEX, comHex).filter(
      (ocorrencia) => !hexDoDesign.has(ocorrencia.split(": ")[1]?.toLowerCase() ?? ""),
    );

    expect(desconhecidos).toEqual([]);
  });

  it("nenhuma classe da paleta padrão do Tailwind", () => {
    expect(
      ocorrencias(
        /\b(?:bg|text|border|ring|outline|fill|stroke|from|via|to|shadow|decoration|accent|caret|divide|placeholder)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|black|white)(?:-\d{2,3})?\b/g,
      ),
    ).toEqual([]);
  });

  it("nenhum emoji", () => {
    expect(ocorrencias(/[\p{Extended_Pictographic}\u{FE0F}]/gu)).toEqual([]);
  });

  it("nenhum rótulo em caixa alta", () => {
    expect(ocorrencias(/\buppercase\b|text-transform:\s*uppercase/g)).toEqual([]);
  });
});
