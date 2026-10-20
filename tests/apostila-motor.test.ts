// @vitest-environment jsdom
/**
 * Motor didático das lições (apostila/licoes/motor.js): duas tentativas com pista, gabarito só
 * depois da segunda, Certo/Errado com confiança, cartões em grupos, Parsons com linha falsa e
 * recuo, "ache o erro" e a revisão espaçada (doc 04, seções 2, 3, 6 e 9).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { beforeAll, beforeEach, describe, expect, it } from "vitest";

type Contexto = {
  licao: string;
  resumo: string;
  sec?: string;
  aoResolver?: (ex: HTMLElement, resultado: string) => void;
};
type Cartao = { caixa: number; proxima: string; erros: number };
type Motor = {
  montarExercicio: (ex: HTMLElement, ctx: Contexto) => void;
  hoje: () => string;
  somaDias: (iso: string, n: number) => string;
  Revisao: {
    todos: () => Record<string, Cartao>;
    daLicao: (ctx: Contexto, ex: HTMLElement, resultado: string) => void;
    daRevisao: (id: string, resultado: string) => Cartao | null;
    vencidos: (limite?: number) => { licao: string }[];
  };
  idDe: (ex: HTMLElement) => string;
};

let M: Motor;

beforeAll(() => {
  const codigo = readFileSync(join(process.cwd(), "apostila", "licoes", "motor.js"), "utf-8");
  new Function(codigo)();
  M = (window as unknown as { Motor: Motor }).Motor;
});

beforeEach(() => {
  document.body.innerHTML = "";
  localStorage.clear();
});

function montar(html: string, ctx: Partial<Contexto> = {}) {
  document.body.innerHTML = html;
  const ex = document.querySelector<HTMLElement>(".exercicio")!;
  const resultados: string[] = [];
  M.montarExercicio(ex, {
    licao: "TESTE",
    resumo: "a ideia central",
    aoResolver: (_e, r) => resultados.push(r),
    ...ctx,
  });
  return { ex, resultados, retorno: ex.querySelector<HTMLElement>(".retorno")! };
}
const clicar = (el: Element | null | undefined) => (el as HTMLElement).click();

const ESCOLHA = `<div class="exercicio" data-escolha><p class="pergunta">Quanto dá 2 ** 3?</p>
  <div class="opcoes"><button class="botao" type="button">6</button><button class="botao" type="button" data-ok>8</button><button class="botao" type="button">5</button></div>
  <div class="retorno" hidden data-ok-texto="Isso." data-nao-texto="É potência: 8." data-pista="pense em potência"></div></div>`;

describe("escolha", () => {
  it("dá uma segunda tentativa com pista antes do gabarito", () => {
    const { ex, retorno, resultados } = montar(ESCOLHA);
    const [seis, , cinco] = ex.querySelectorAll<HTMLButtonElement>(".opcoes .botao");
    clicar(seis);
    expect(retorno.className).toContain("tentativa");
    expect(retorno.textContent).toContain("pense em potência");
    expect(seis!.disabled).toBe(true);
    expect(ex.dataset.estado).toBeUndefined();
    clicar(cinco);
    expect(retorno.className).toContain("revelado");
    expect(resultados).toEqual(["revelada"]);
  });

  it("acerto na segunda tentativa conta como segunda", () => {
    const { ex, resultados } = montar(ESCOLHA);
    clicar(ex.querySelector(".opcoes .botao"));
    clicar(ex.querySelector(".opcoes .botao[data-ok]"));
    expect(resultados).toEqual(["segunda"]);
  });
});

describe("Certo/Errado com confiança", () => {
  const CE = `<div class="exercicio" data-escolha><p class="pergunta">nota = 70 compara.</p>
    <div class="opcoes"><button class="botao" type="button">Certo</button><button class="botao" type="button" data-ok>Errado</button></div>
    <div class="retorno" hidden data-ok-texto="Isso." data-nao-texto="Errado: = guarda."></div></div>`;

  it("pede a confiança, não dá segunda tentativa e mostra o saldo", () => {
    const { ex, retorno, resultados } = montar(CE);
    expect(ex.querySelectorAll("[data-conf]")).toHaveLength(3);
    clicar(ex.querySelector('[data-conf="chute"]'));
    clicar(ex.querySelector(".opcoes .botao[data-ok]"));
    expect(resultados).toEqual(["chute"]);
    expect(retorno.textContent).toContain("Saldo Cebraspe nesta lição: +1");
  });

  it("um erro no C/E já mostra a justificativa", () => {
    const { ex, retorno, resultados } = montar(CE);
    clicar(ex.querySelector(".opcoes .botao:not([data-ok])"));
    expect(resultados).toEqual(["revelada"]);
    expect(retorno.textContent).toContain("= guarda");
    expect(retorno.textContent).toContain("Saldo Cebraspe nesta lição: -1");
  });
});

describe("cartões em grupos", () => {
  const CLASSIFICAR = `<div class="exercicio" data-classificar><p class="pergunta">Classifique.</p><div>
    <div class="linha-classifica"><span>o peso</span><select data-resposta="entrada"><option value="">escolha</option><option value="entrada">entrada</option><option value="saida">saída</option></select></div>
    <div class="linha-classifica"><span>o resultado</span><select data-resposta="saida"><option value="">escolha</option><option value="entrada">entrada</option><option value="saida">saída</option></select></div>
    </div><div><button class="botao primario" type="button" data-verificar>Verificar</button></div>
    <div class="retorno" hidden data-ok-texto="Tudo certo. Explicação." data-nao-texto="Os campos em vermelho estão trocados. Pergunte de onde vem."></div></div>`;
  const grupo = (ex: HTMLElement, v: string) =>
    [...ex.querySelectorAll<HTMLElement>(".cat-grupo")]
      .find((g) => g.dataset.alvo === v)!
      .querySelector(".cat-nome");

  it("troca as listas por cartões e corrige por grupo", () => {
    const { ex, resultados } = montar(CLASSIFICAR);
    const cartoes = ex.querySelectorAll(".cat-cartao");
    expect(cartoes).toHaveLength(2);
    clicar(cartoes[0]!);
    clicar(grupo(ex, "entrada"));
    clicar(cartoes[1]!);
    clicar(grupo(ex, "saida"));
    clicar(ex.querySelector("[data-verificar]"));
    expect(resultados).toEqual(["primeira"]);
  });

  it("não aceita verificar com cartão sem grupo e revela na segunda tentativa", () => {
    const { ex, retorno, resultados } = montar(CLASSIFICAR);
    clicar(ex.querySelector("[data-verificar]"));
    expect(retorno.className).toContain("aviso");
    const cartoes = ex.querySelectorAll(".cat-cartao");
    clicar(cartoes[0]!);
    clicar(grupo(ex, "saida"));
    clicar(cartoes[1]!);
    clicar(grupo(ex, "entrada"));
    clicar(ex.querySelector("[data-verificar]"));
    expect(retorno.textContent).toContain("Pergunte de onde vem");
    expect(retorno.textContent).not.toContain("Os campos em vermelho");
    clicar(ex.querySelector("[data-verificar]"));
    expect(resultados).toEqual(["revelada"]);
    expect(retorno.textContent).not.toMatch(
      /Veja a resposta\.\s*Os cartões em destaque foram para o grupo certo\. Tudo certo/,
    );
  });
});

describe("Parsons com linha falsa e recuo", () => {
  const PARSONS = `<div class="exercicio" data-ordenar data-recuo data-resposta="if x &gt; 0:|    print(x)">
    <p class="pergunta">Monte.</p><div class="ordenar" data-banco>
    <button class="botao linha" type="button">print(x)</button><button class="botao linha" type="button" data-falsa>if x &gt; 0</button><button class="botao linha" type="button">if x &gt; 0:</button></div>
    <div class="montagem" data-montagem></div><div><button class="botao primario" type="button" data-verificar>Verificar</button></div>
    <div class="retorno" hidden data-ok-texto="Certo." data-nao-texto="Confira."></div></div>`;
  const linha = (ex: HTMLElement, t: string) =>
    [...ex.querySelectorAll(".linha")].find((l) => l.textContent === t)!;

  it("aceita a ordem e o recuo certos", () => {
    const { ex, resultados } = montar(PARSONS);
    clicar(linha(ex, "if x > 0:"));
    clicar(linha(ex, "print(x)"));
    clicar(ex.querySelectorAll(".p-item")[1]!.querySelector('.p-recuo[data-d="1"]'));
    clicar(ex.querySelector("[data-verificar]"));
    expect(resultados).toEqual(["primeira"]);
  });

  it("aponta a linha falsa e o recuo errado", () => {
    const { ex, retorno } = montar(PARSONS);
    clicar(linha(ex, "if x > 0"));
    clicar(linha(ex, "print(x)"));
    clicar(ex.querySelector("[data-verificar]"));
    expect(retorno.textContent).toContain("não faz parte do programa");
  });

  it("cobra o recuo", () => {
    const { ex, retorno } = montar(PARSONS);
    clicar(linha(ex, "if x > 0:"));
    clicar(linha(ex, "print(x)"));
    clicar(ex.querySelector("[data-verificar]"));
    expect(retorno.textContent).toContain("o recuo da linha");
  });
});

describe("ache o erro", () => {
  it("marca a linha errada e pede outra tentativa", () => {
    const { ex, retorno, resultados } =
      montar(`<div class="exercicio" data-ache><p class="pergunta">Ache.</p>
      <ol class="ache-codigo"><li>nota = 70</li><li data-erro>if nota = 70:</li></ol>
      <div class="retorno" hidden data-ok-texto="Isso." data-nao-texto="Linha 2." data-pista="guardar ou perguntar?"></div></div>`);
    clicar(ex.querySelector(".ache-codigo li button"));
    expect(retorno.textContent).toContain("guardar ou perguntar?");
    clicar(ex.querySelector("li[data-erro] button"));
    expect(resultados).toEqual(["segunda"]);
  });
});

describe("revisão espaçada", () => {
  it("cria cartão para amanhã quando não sai de primeira, mas ignora o desafio", () => {
    const { ex } = montar(ESCOLHA);
    M.Revisao.daLicao({ licao: "LOG.03", resumo: "" }, ex, "segunda");
    const id = M.idDe(ex);
    expect(M.Revisao.todos()[id]).toMatchObject({
      caixa: 0,
      proxima: M.somaDias(M.hoje(), 1),
      erros: 1,
    });
    ex.classList.add("desafio");
    localStorage.clear();
    M.Revisao.daLicao({ licao: "LOG.03", resumo: "" }, ex, "revelada");
    expect(Object.keys(M.Revisao.todos())).toHaveLength(0);
  });

  it("acerto de primeira na revisão afasta o próximo encontro; erro volta para amanhã", () => {
    const { ex } = montar(ESCOLHA);
    M.Revisao.daLicao({ licao: "LOG.03", resumo: "" }, ex, "revelada");
    const id = M.idDe(ex);
    expect(M.Revisao.daRevisao(id, "primeira")).toMatchObject({
      caixa: 1,
      proxima: M.somaDias(M.hoje(), 3),
    });
    expect(M.Revisao.daRevisao(id, "primeira")).toMatchObject({
      caixa: 2,
      proxima: M.somaDias(M.hoje(), 7),
    });
    expect(M.Revisao.daRevisao(id, "segunda")).toMatchObject({
      caixa: 0,
      proxima: M.somaDias(M.hoje(), 1),
    });
  });

  it("intercala as matérias na fila do dia", () => {
    const hoje = M.hoje();
    const cartoes = Object.fromEntries(
      ["LOG.01", "LOG.02", "LOG.03", "PY.02"].map((licao, i) => [
        `c${i}`,
        { id: `c${i}`, licao, caixa: 0, proxima: hoje, erros: 1 },
      ]),
    );
    localStorage.setItem("dominio:revisao:v1", JSON.stringify(cartoes));
    expect(M.Revisao.vencidos().map((c) => c.licao.split(".")[0])).toEqual([
      "LOG",
      "PY",
      "LOG",
      "LOG",
    ]);
  });
});
