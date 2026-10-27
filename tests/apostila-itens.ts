/**
 * Ajudantes dos testes de perguntas corrigidas: conferem a forma de um item e o resolvem no motor, de primeira.
 * Usados por apostila-verifica.test.ts e apostila-conceitos.test.ts.
 */
import { expect } from "vitest";

export type Item =
  | { f: "escolha"; p: string; o: [string, boolean, string][] }
  | { f: "lacunas"; p: string; t: string; x: string[]; por: string }
  | { f: "erro"; p: string; t: string[]; e: number; por: string }
  | { f: "ordem"; p: string; t: string[]; por: string };
export type Motor = {
  criar: (d: Item) => string;
  montarExercicio: (
    ex: HTMLElement,
    ctx: { licao: string; resumo: string; aoResolver?: (ex: HTMLElement, r: string) => void },
  ) => void;
};

const lacunasDe = (t: string) => [...t.matchAll(/\{\{([^}]+)\}\}/g)].map((m) => m[1]!);

export function conferir(chave: string, d: Item) {
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
export function resolver(Motor: Motor, d: Item): string {
  document.body.innerHTML = Motor.criar(d);
  const ex = document.querySelector<HTMLElement>(".exercicio")!;
  let resultado = "";
  Motor.montarExercicio(ex, {
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
