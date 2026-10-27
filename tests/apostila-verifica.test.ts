// @vitest-environment jsdom
/**
 * As perguntas que substituíram as perguntas abertas (pedido do Kaio em 21/10/2026): a final de cada módulo no
 * estudo em 5 passos, a "ideia" de cada matéria na trilha e a etapa Explicar do Centro de Dados. Confere que todo
 * módulo, matéria e sala tem a sua, que cada formato está bem formado (uma alternativa certa, cada uma com o porquê;
 * nenhuma palavra do banco serve noutra lacuna; a frase errada existe) e que o motor resolve cada uma de primeira.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { beforeAll, describe, expect, it } from "vitest";

import { conferir, type Item, type Motor, resolver } from "./apostila-itens";

type Janela = {
  Motor: Motor;
  MATERIAS: { sigla: string; modulos: { codigo: string }[] }[];
  VERIFICA_MODULOS: Record<string, Item>;
  VERIFICA_MATERIAS: Record<string, Item>;
  VERIFICA_CASTELO: Record<string, Item>;
  CASTELO: { salas: { id: string; tarefas: { id: string; tipo: string }[] }[] };
};

const PASTA = join(process.cwd(), "apostila");
const carregar = (arq: string) => new Function(readFileSync(join(PASTA, arq), "utf-8"))();
let W: Janela;

beforeAll(() => {
  for (const arq of [
    "licoes/motor.js",
    "materias.js",
    "verifica-modulos.js",
    "verifica-materias.js",
    "castelo/verifica.js",
    "castelo/salas.js",
  ])
    carregar(arq);
  W = window as unknown as Janela;
});

describe("perguntas corrigidas no lugar das abertas", () => {
  it("todo módulo do estudo em 5 passos tem a sua pergunta final", () => {
    const codigos = W.MATERIAS.flatMap((m) => m.modulos.map((d) => d.codigo));
    expect(codigos.length).toBeGreaterThan(150);
    expect(codigos.filter((c) => !W.VERIFICA_MODULOS[c])).toEqual([]);
    expect(Object.keys(W.VERIFICA_MODULOS).filter((c) => !codigos.includes(c))).toEqual([]);
  });

  it("toda matéria tem a pergunta da ideia, e todo módulo do Centro de Dados a sua explicação", () => {
    expect(W.MATERIAS.map((m) => m.sigla).filter((s) => !W.VERIFICA_MATERIAS[s])).toEqual([]);
    const salas = W.CASTELO.salas;
    expect(salas.map((s) => s.id).filter((id) => !W.VERIFICA_CASTELO[id])).toEqual([]);
    const textos = salas.flatMap((s) =>
      s.tarefas.filter((t) => t.tipo === "texto").map((t) => `${s.id}.${t.id}`),
    );
    expect(textos.length).toBe(2);
    expect(textos.filter((k) => !W.VERIFICA_CASTELO[k])).toEqual([]);
  });

  it("os quatro formatos aparecem e cada item está bem formado", () => {
    const todos = { ...W.VERIFICA_MODULOS, ...W.VERIFICA_MATERIAS, ...W.VERIFICA_CASTELO };
    const formatos = new Set(Object.values(todos).map((d) => d.f));
    expect([...formatos].sort()).toEqual(["erro", "escolha", "lacunas", "ordem"]);
    for (const [k, d] of Object.entries(todos)) conferir(k, d);
  });

  it("o motor monta e resolve cada item de primeira", () => {
    const todos = { ...W.VERIFICA_MODULOS, ...W.VERIFICA_MATERIAS, ...W.VERIFICA_CASTELO };
    const falhas = Object.entries(todos)
      .filter(([, d]) => resolver(W.Motor, d) !== "primeira")
      .map(([k]) => k);
    expect(falhas).toEqual([]);
  });

  it("completar com palavras: errar uma lacuna marca só ela e devolve a palavra; a segunda erro revela", () => {
    const d = W.VERIFICA_MODULOS["FMT.01"] as Extract<Item, { f: "lacunas" }>;
    document.body.innerHTML = W.Motor.criar(d);
    const ex = document.querySelector<HTMLElement>(".exercicio")!;
    let resultado = "";
    W.Motor.montarExercicio(ex, {
      licao: "teste",
      resumo: "",
      aoResolver: (_e, r) => (resultado = r),
    });
    const vagas = [...ex.querySelectorAll<HTMLElement>("button.lacuna")];
    const chip = (t: string) =>
      [...ex.querySelectorAll<HTMLButtonElement>(".lacunas-banco button")].find(
        (c) => !c.disabled && c.textContent!.trim() === t,
      )!;
    // a primeira lacuna recebe uma palavra que confunde; as outras, a certa
    vagas.forEach((v, k) => {
      v.click();
      chip(k === 0 ? d.x[0]! : v.dataset.lacuna!).click();
    });
    ex.querySelector<HTMLElement>("[data-verificar]")!.click();
    expect(ex.querySelector(".retorno")!.textContent).toContain("lacuna 1");
    expect(vagas[0]!.classList.contains("nao")).toBe(true);
    expect(vagas[0]!.dataset.palavra).toBeUndefined();
    expect(vagas[1]!.dataset.palavra).toBe(vagas[1]!.dataset.lacuna);
    vagas[0]!.click();
    chip(d.x[1]!).click();
    ex.querySelector<HTMLElement>("[data-verificar]")!.click();
    expect(resultado).toBe("revelada");
    expect(vagas[0]!.textContent).toBe(vagas[0]!.dataset.lacuna);
  });
});
