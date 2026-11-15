// @vitest-environment jsdom
/**
 * Revisão espaçada com o FSRS na apostila (apostila/licoes/fsrs.js + Motor.Revisao): o critério de aceite da Fase 4,
 * simular 30 dias de revisão e conferir que os intervalos crescem com acertos e encolhem com erros, mais o treino de
 * erros e a força das lembranças.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

type Cartao = {
  id: string;
  licao: string;
  proxima: string;
  intervalo?: number;
  erros: number;
  fsrs?: { stability: number; due: string };
};
type Motor = {
  idDe: (ex: Element) => string;
  hoje: () => string;
  Revisao: {
    daLicao: (ctx: Record<string, unknown>, ex: Element, resultado: string) => void;
    daRevisao: (id: string, resultado: string) => Cartao | null;
    todos: () => Record<string, Cartao>;
    erros: (limite?: number) => Cartao[];
    forca: () => { fragil: number; formando: number; firme: number; total: number };
    lembranca: (c: Cartao) => number | null;
  };
};
const ler = (...p: string[]) => readFileSync(join(process.cwd(), "apostila", ...p), "utf-8");
let M: Motor;

beforeAll(async () => {
  new Function(ler("licoes", "motor.js"))();
  M = (window as unknown as { Motor: Motor }).Motor;
  // o módulo de verdade, o mesmo que as páginas carregam
  await import("../apostila/licoes/fsrs.js");
  expect((window as unknown as { FSRS?: unknown }).FSRS).toBeDefined();
});
beforeEach(() => localStorage.clear());
afterEach(() => vi.useRealTimers());

function exercicio(texto: string) {
  const ex = document.createElement("div");
  ex.className = "exercicio";
  ex.innerHTML = `<p class="pergunta">${texto}</p>`;
  document.body.appendChild(ex);
  return ex;
}
const dias = (de: string, ate: string) =>
  Math.round((new Date(ate + "T12:00").getTime() - new Date(de + "T12:00").getTime()) / 864e5);

describe("revisão com FSRS", () => {
  it("em 30 dias, os intervalos crescem com acertos e encolhem depois de um erro", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-01T10:00:00"));
    const ex = exercicio("Quanto vale 7 // 2?");
    M.Revisao.daLicao({ licao: "LOG.03" }, ex, "segunda");
    const id = M.idDe(ex);
    const intervalos: number[] = [];
    const notas = ["primeira", "primeira", "primeira", "revelada", "primeira"];
    let c = M.Revisao.todos()[id]!;
    for (const nota of notas) {
      // volta no dia marcado, como na vida real
      vi.setSystemTime(new Date(c.proxima + "T10:00:00"));
      c = M.Revisao.daRevisao(id, nota)!;
      intervalos.push(c.intervalo!);
      expect(dias(M.hoje(), c.proxima)).toBe(c.intervalo);
    }
    expect(intervalos[1]!).toBeGreaterThan(intervalos[0]!);
    expect(intervalos[2]!).toBeGreaterThan(intervalos[1]!);
    expect(intervalos[3]!).toBeLessThan(intervalos[2]!); // o erro encolhe
    expect(intervalos[4]!).toBeGreaterThan(intervalos[3]!); // e o acerto volta a afastar
    expect(c.fsrs!.stability).toBeGreaterThan(1);
  });

  it("nada volta no mesmo dia: o menor intervalo é amanhã", () => {
    const ex = exercicio("Algoritmo tem fim?");
    M.Revisao.daLicao({ licao: "LOG.01" }, ex, "revelada");
    const c = M.Revisao.todos()[M.idDe(ex)]!;
    expect(c.intervalo).toBe(1);
    expect(dias(M.hoje(), c.proxima)).toBe(1);
  });

  it("o treino de erros traz primeiro os mais errados, vencidos ou não", () => {
    const a = exercicio("A"),
      b = exercicio("B");
    M.Revisao.daLicao({ licao: "LOG.01" }, a, "revelada");
    M.Revisao.daLicao({ licao: "PY.01" }, b, "revelada");
    M.Revisao.daRevisao(M.idDe(b), "revelada");
    const lista = M.Revisao.erros();
    expect(lista.map((c) => c.licao)).toEqual(["PY.01", "LOG.01"]);
    expect(lista[0]!.erros).toBe(2);
  });

  it("a força das lembranças separa frágeis, em formação e firmes", () => {
    const ex = exercicio("C");
    M.Revisao.daLicao({ licao: "LOG.02" }, ex, "segunda");
    expect(M.Revisao.forca()).toMatchObject({ total: 1, fragil: 1 });
    const c = M.Revisao.todos()[M.idDe(ex)]!;
    const r = M.Revisao.lembranca(c);
    expect(r).not.toBeNull();
    expect(r!).toBeGreaterThan(0.8);
  });
});
