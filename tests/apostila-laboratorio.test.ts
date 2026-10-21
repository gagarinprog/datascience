// @vitest-environment jsdom
/**
 * Faça no Python (apostila/licoes/laboratorio.js): os erros do Python chegam em português, com a linha, e o
 * teste que falha devolve a mensagem escrita pelo autor do exercício.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { beforeAll, describe, expect, it } from "vitest";

type Erro = { texto: string; teste?: boolean };
let erroPython: (msg: string) => Erro;

beforeAll(() => {
  new Function(
    readFileSync(join(process.cwd(), "apostila", "licoes", "laboratorio.js"), "utf-8"),
  )();
  erroPython = (window as unknown as { Laboratorio: { erroPython: typeof erroPython } }).Laboratorio
    .erroPython;
});

const tb = (linha: number, fim: string) =>
  `Traceback (most recent call last):\n  File "<exec>", line ${linha}, in <module>\n${fim}`;

describe("erros do Python em português", () => {
  it("nome que não existe, aspas abertas e coluna que não existe", () => {
    expect(erroPython(tb(1, "NameError: name 'total' is not defined")).texto).toMatch(
      /O nome total não existe \(linha 1\)/,
    );
    expect(
      erroPython(tb(2, "SyntaxError: unterminated string literal (detected at line 2)")).texto,
    ).toMatch(/Aspas abertas e não fechadas/);
    expect(erroPython(tb(3, "KeyError: 'totla'")).texto).toMatch(/A coluna totla não existe/);
  });
  it("recuo, texto com número e lacuna por completar", () => {
    expect(erroPython(tb(3, "IndentationError: expected an indented block")).texto).toMatch(
      /Erro de recuo/,
    );
    expect(
      erroPython(tb(1, 'TypeError: can only concatenate str (not "int") to str')).texto,
    ).toMatch(/Texto só se junta com texto/);
    expect(erroPython(tb(2, "SyntaxError: invalid syntax")).texto).toMatch(
      /Falta completar alguma parte/,
    );
  });
  it("o teste do autor vira a mensagem do retorno", () => {
    const r = erroPython(tb(4, "AssertionError: n deveria contar as linhas de aprovados."));
    expect(r.teste).toBe(true);
    expect(r.texto).toBe("n deveria contar as linhas de aprovados.");
  });
});
