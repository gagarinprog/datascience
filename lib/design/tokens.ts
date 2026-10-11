import { readFileSync } from "node:fs";
import { join } from "node:path";

export type TokenDeCor = {
  /** Nome no DESIGN.md, ex.: "--fundo". */
  nome: string;
  /** Variável gerada pelo Tailwind, ex.: "--color-fundo". */
  variavel: string;
  /** Valor declarado no globals.css: hex ou color-mix de outros tokens. */
  valor: string;
};

/** Extrai as declarações --color-* de um CSS (o reset "--color-*: initial" fica de fora). */
export function extrairTokensDeCor(css: string): TokenDeCor[] {
  const tokens: TokenDeCor[] = [];
  for (const [, nome, valor] of css.matchAll(/--color-([a-z0-9-]+):\s*([^;]+);/g)) {
    if (nome && valor) {
      tokens.push({ nome: `--${nome}`, variavel: `--color-${nome}`, valor: valor.trim() });
    }
  }
  return tokens;
}

/**
 * Lê os tokens direto do app/globals.css, a fonte única das cores.
 * Só no servidor: a página /design usa isto ao ser pré-renderizada.
 */
export function lerTokensDeCor(): TokenDeCor[] {
  return extrairTokensDeCor(readFileSync(join(process.cwd(), "app", "globals.css"), "utf-8"));
}
