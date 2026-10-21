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

type Item =
  | { f: "escolha"; p: string; o: [string, boolean, string][] }
  | { f: "lacunas"; p: string; t: string; x: string[]; por: string }
  | { f: "erro"; p: string; t: string[]; e: number; por: string }
  | { f: "ordem"; p: string; t: string[]; por: string };
type Motor = {
  criar: (d: Item) => string;
  montarExercicio: (
    ex: HTMLElement,
    ctx: { licao: string; resumo: string; aoResolver?: (ex: HTMLElement, r: string) => void },
  ) => void;
};
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

const lacunasDe = (t: string) => [...t.matchAll(/\{\{([^}]+)\}\}/g)].map((m) => m[1]!);

function conferir(chave: string, d: Item) {
  expect(d.p.trim(), chave).not.toBe("");
  const textos: string[] = [d.p];
  if (d.f === "escolha") {
    expect(d.o.length, chave).toBeGreaterThanOrEqual(3);
    expect(d.o.filter((o) => o[1]).length, `${chave}: uma certa`).toBe(1);
    for (const [t, , por] of d.o) {
      expect(t.trim(), chave).not.toBe("");
      expect(por.trim(), `${chave}: cada alternativa explica o porquê`).not.toBe("");
      textos.push(t, por);
    }
    expect(new Set(d.o.map((o) => o[0])).size, chave).toBe(d.o.length);
  } else if (d.f === "lacunas") {
    const vagas = lacunasDe(d.t);
    expect(vagas.length, chave).toBeGreaterThanOrEqual(2);
    expect(d.x.length, chave).toBeGreaterThanOrEqual(2);
    // nenhuma palavra repetida no banco, e nenhuma que confunde é igual a uma resposta
    const banco = [...vagas, ...d.x].map((w) => w.toLowerCase());
    expect(new Set(banco).size, `${chave}: palavras repetidas no banco`).toBe(banco.length);
    textos.push(d.t, d.por, ...d.x);
  } else if (d.f === "erro") {
    expect(d.t.length, chave).toBeGreaterThanOrEqual(3);
    expect(d.e, chave).toBeGreaterThanOrEqual(0);
    expect(d.e, chave).toBeLessThan(d.t.length);
    textos.push(...d.t, d.por);
  } else {
    expect(d.t.length, chave).toBeGreaterThanOrEqual(3);
    expect(new Set(d.t).size, `${chave}: passos repetidos`).toBe(d.t.length);
    textos.push(...d.t, d.por);
  }
  const tudo = textos.join(" ");
  expect(tudo, `${chave}: sem emoji`).not.toMatch(/\p{Extended_Pictographic}/u);
  expect(tudo.toLowerCase(), chave).not.toContain("apostila viva");
}

// monta no DOM e resolve como o aluno, de primeira
function resolver(d: Item): string {
  document.body.innerHTML = W.Motor.criar(d);
  const ex = document.querySelector<HTMLElement>(".exercicio")!;
  let resultado = "";
  W.Motor.montarExercicio(ex, {
    licao: "teste",
    resumo: "",
    aoResolver: (_e, r) => (resultado = r),
  });
  const clicar = (el: Element | null | undefined) => (el as HTMLElement).click();
  if (d.f === "escolha") clicar(ex.querySelector(".opcoes [data-ok]"));
  else if (d.f === "erro") clicar(ex.querySelector(".ache-codigo li[data-erro] button"));
  else if (d.f === "ordem") {
    for (const passo of d.t)
      clicar(
        [...ex.querySelectorAll("[data-banco] .linha")].find(
          (l) => l.textContent!.trim() === passo,
        ),
      );
    clicar(ex.querySelector("[data-verificar]"));
  } else {
    for (const v of ex.querySelectorAll<HTMLElement>("button.lacuna")) {
      clicar(v);
      clicar(
        [...ex.querySelectorAll<HTMLButtonElement>(".lacunas-banco button")].find(
          (c) => !c.disabled && c.textContent!.trim() === v.dataset.lacuna,
        ),
      );
    }
    clicar(ex.querySelector("[data-verificar]"));
  }
  return resultado;
}

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
      .filter(([, d]) => resolver(d) !== "primeira")
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
