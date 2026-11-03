// @vitest-environment jsdom
/**
 * A aula linear (apostila/licoes/motor.js, pedido do Kaio em 03/11/2026): cada conceito em Entenda, Pratique e
 * Avance, um exercício por vez, o botão de baixo só libera depois de responder, e a posição fica guardada.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { beforeEach, describe, expect, it } from "vitest";

type Motor = { licao: (cfg: Record<string, unknown>) => void };
const ler = (...p: string[]) => readFileSync(join(process.cwd(), "apostila", ...p), "utf-8");
const conceito = (
  n: number,
) => `<section class="secao" id="c${n}"><p class="rotulo">Conceito ${n}</p><h2>Conceito ${n}</h2>
  <div class="exercicio desafio" data-escolha><p class="pergunta">Desafio ${n}?</p>
    <div class="opcoes"><button class="botao" type="button" data-ok>Sim</button><button class="botao" type="button">Não</button></div>
    <div class="retorno" hidden data-ok-texto="Isso." data-nao-texto="Não."></div></div>
  <h3>A ideia</h3><p class="simples">Texto simples.</p>
  <h3>Pratique</h3>
  <div class="exercicio" data-escolha><p class="pergunta">Um</p><div class="opcoes"><button class="botao" type="button" data-ok>A</button><button class="botao" type="button">B</button></div><div class="retorno" hidden data-ok-texto="Isso." data-nao-texto="Não."></div></div>
  <h3>Faça no Python: outro</h3>
  <div class="exercicio" data-escolha><p class="pergunta">Dois</p><div class="opcoes"><button class="botao" type="button" data-ok>A</button><button class="botao" type="button">B</button></div><div class="retorno" hidden data-ok-texto="Isso." data-nao-texto="Não."></div></div>
  <p class="resumo"><b>Resumo em uma frase</b>Resumo ${n}.</p>
  <button class="botao" type="button" data-marcar="c${n}">Marcar</button></section>`;

function montar() {
  document.body.className = "";
  document.body.innerHTML = `<div class="casca"><main class="conteudo"><div class="coluna"><header class="bloco"><h1>Módulo</h1><p class="lede">Sobre.</p></header>${conceito(1)}${conceito(2)}</div></main></div>`;
  new Function(ler("licoes", "motor.js"))();
  (window as unknown as { Motor: Motor }).Motor.licao({
    chave: "dominio:licao:TST.01",
    trilha: "LOG",
    nomes: ["Um", "Dois"],
  });
  return {
    ir: document.querySelector<HTMLButtonElement>(".aula-ir")!,
    voltar: document.querySelector<HTMLButtonElement>(".aula-voltar")!,
    sec: (n: number) => document.getElementById("c" + n)!,
  };
}
const clicar = (el: Element | null) => (el as HTMLElement).click();
const esperar = () => new Promise((r) => setTimeout(r, 0));

beforeEach(() => localStorage.clear());

describe("aula linear", () => {
  it("divide o conceito em três etapas e mostra uma por vez", () => {
    const { sec } = montar();
    const s = sec(1);
    expect(s.querySelectorAll(".etapa-painel")).toHaveLength(3);
    expect(s.querySelector(".etapa-entenda .desafio")).not.toBeNull();
    expect(s.querySelectorAll(".etapa-pratique .ex-passo")).toHaveLength(2);
    expect(s.querySelector(".etapa-avance .resumo")).not.toBeNull();
    expect(sec(2).hidden).toBe(true);
    expect(s.querySelector<HTMLElement>(".etapa-pratique")!.hidden).toBe(true);
    // o "Pratique" sozinho some (a contagem "Exercício 1 de 2" já diz); o título com conteúdo fica
    expect(s.querySelectorAll(".ex-passo")[0]!.querySelector("h3")).toBeNull();
    expect(s.querySelectorAll(".ex-passo")[1]!.querySelector("h3")!.textContent).toContain(
      "Faça no Python",
    );
  });

  it("só libera o botão de baixo depois de responder, e vai até o próximo conceito", async () => {
    const { ir, sec } = montar();
    expect(ir.disabled).toBe(true);
    expect(document.querySelector(".aula-aviso")!.textContent).toContain("Responda");
    clicar(sec(1).querySelector(".desafio [data-ok]"));
    await esperar();
    expect(ir.disabled).toBe(false);
    expect(ir.textContent).toBe("Ir para os exercícios");
    clicar(ir);
    expect(document.querySelector('[data-etapa="1"]')!.classList.contains("atual")).toBe(true);
    const passos = sec(1).querySelectorAll<HTMLElement>(".ex-passo");
    expect(passos[1]!.hidden).toBe(true);
    expect(ir.disabled).toBe(true);
    clicar(passos[0]!.querySelector("[data-ok]"));
    await esperar();
    expect(ir.textContent).toBe("Próximo exercício");
    clicar(ir);
    clicar(passos[1]!.querySelector("[data-ok]"));
    await esperar();
    expect(ir.textContent).toBe("Concluir o conceito");
    clicar(ir);
    expect(sec(1).querySelector(".avance-selo")!.textContent).toBe("3/3");
    expect(JSON.parse(localStorage.getItem("dominio:licao:TST.01")!)).toContain("c1");
    expect(ir.textContent).toBe("Próximo conceito");
    clicar(ir);
    expect(sec(1).hidden).toBe(true);
    expect(sec(2).hidden).toBe(false);
    expect(JSON.parse(localStorage.getItem("dominio:aula:v1")!)["TST.01"]).toMatchObject({
      c: 1,
      e: 0,
    });
  });

  it("o menu dos conceitos tranca os que ainda não foram alcançados", () => {
    montar();
    const itens = document.querySelectorAll<HTMLButtonElement>(".aula-conceitos button");
    expect(itens).toHaveLength(2);
    expect(itens[0]!.disabled).toBe(false);
    expect(itens[1]!.disabled).toBe(true);
    expect(document.querySelector(".aula-sobre")!.textContent).toContain("Sobre.");
  });
});
