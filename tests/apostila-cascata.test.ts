// @vitest-environment jsdom
/**
 * Cascata das lições e do Centro de Dados (apostila/passo/cascata.js e licoes/motor.js): cada conceito vira
 * etapas que abrem uma de cada vez, sem perder conteúdo; a dica de código vai para o editor como comentário.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { beforeAll, describe, expect, it } from "vitest";

type Item = {
  feito: boolean;
  aberto: boolean;
  trancado: boolean;
  corpo: HTMLElement;
  tipo?: string;
};
type Cx = { itens: Item[]; abrir: (it: Item, rolar: boolean) => void };
type Motor = {
  cascataSecao: (sec: HTMLElement) => Cx | null;
  dicaNoEditor: (ta: HTMLTextAreaElement, pista: string, lingua: string) => boolean;
};
let M: Motor;

beforeAll(() => {
  const ler = (...p: string[]) => readFileSync(join(process.cwd(), "apostila", ...p), "utf-8");
  new Function(ler("passo", "cascata.js"))();
  new Function(ler("licoes", "motor.js"))();
  M = (window as unknown as { Motor: Motor }).Motor;
});

const SECAO = `<section class="secao" id="c9"><p class="rotulo">Conceito 9</p><h2>Teste</h2>
  <div class="exercicio desafio" data-escolha><p class="pergunta">Desafio?</p></div>
  <h3>A ideia</h3><p class="simples">Texto simples.</p><figure data-clip="x"><figcaption>A animação</figcaption></figure>
  <h3>Exemplo resolvido</h3><div class="so-corpo">Passo 1</div>
  <div class="exercicio" data-escolha><p class="rotulo">Por que funciona?</p><p class="pergunta">Por quê?</p></div>
  <h3>Pratique</h3>
  <div class="exercicio" data-escolha><p class="pergunta">Um</p></div>
  <div class="exercicio" data-escolha><p class="pergunta">Dois</p></div>
  <p class="resumo">Resumo.</p><p class="explique">Explique em 3 linhas.</p></section>`;

describe("cascata do conceito", () => {
  it("divide em desafio, leitura, animação, exercícios e fechamento, sem perder nada", () => {
    document.body.innerHTML = SECAO;
    const sec = document.querySelector<HTMLElement>(".secao")!;
    const antes = sec.querySelectorAll(
      ".exercicio, figure, .resumo, .explique, .so-corpo, .simples",
    ).length;
    const cx = M.cascataSecao(sec)!;
    const rotulos = [...sec.querySelectorAll(".cx-tit small")].map((s) => s.textContent);
    const nomes = [
      "Desafio",
      "Leitura",
      "Ver o passo a passo",
      "Leitura",
      "Por que funciona?",
      "Pratique · 1 de 2",
      "Pratique · 2 de 2",
      "Fechar o conceito",
    ];
    expect(rotulos).toEqual(nomes.map((n, i) => `Etapa ${i + 1} de ${nomes.length} · ${n}`));
    // o mapa das etapas: um ponto por etapa, a primeira aberta, as seguintes trancadas
    const pontos = [...sec.querySelectorAll<HTMLButtonElement>(".cx-mapa .cx-ponto")];
    expect(pontos).toHaveLength(nomes.length);
    expect(pontos[0]!.getAttribute("aria-current")).toBe("step");
    expect(
      sec.querySelectorAll(
        ".cx .exercicio, .cx figure, .cx .resumo, .cx .explique, .cx .so-corpo, .cx .simples",
      ).length,
    ).toBe(antes);
    expect(sec.querySelectorAll(":scope > h3").length).toBe(0);
    // uma etapa aberta por vez
    expect(cx.itens.filter((i) => i.aberto).length).toBe(1);
    cx.abrir(cx.itens[3]!, false);
    expect(cx.itens.filter((i) => i.aberto).map((i) => cx.itens.indexOf(i))).toEqual([3]);
  });

  it("não mexe na seção sem desafio (a tarefa de domínio)", () => {
    document.body.innerHTML = `<section class="secao" id="td"><h2>Tarefa</h2><h3>A</h3><p>x</p><p class="explique">y</p></section>`;
    expect(M.cascataSecao(document.querySelector<HTMLElement>(".secao")!)).toBeNull();
  });
});

describe("dica de código no editor", () => {
  it("põe a dica como comentário abaixo do código, uma vez só", () => {
    const ta = document.createElement("textarea");
    ta.value = "SELECT nome FROM materias";
    expect(
      M.dicaNoEditor(ta, "termine com <code>;</code> e use aspas simples no texto", "SQL"),
    ).toBe(true);
    expect(ta.value.startsWith("SELECT nome FROM materias\n\n-- Dica: termine com ;")).toBe(true);
    expect(M.dicaNoEditor(ta, "outra", "SQL")).toBe(false);
    const py = document.createElement("textarea");
    py.value = "x = 1";
    M.dicaNoEditor(py, "use print", "Python");
    expect(py.value).toContain("# Dica: use print");
  });
});
