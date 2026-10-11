// @vitest-environment node
import { describe, expect, it } from "vitest";

import { criarDadosFalsos } from "./dados-falsos";
import { CHAVE_LOCAL, criarRepositorioLocal } from "./local";
import type { NovaSessao } from "./tipos";

const AGORA = new Date(2026, 9, 11, 10, 0);

function criarArmazenamento() {
  const valores = new Map<string, string>();
  return {
    getItem: (chave: string) => valores.get(chave) ?? null,
    setItem: (chave: string, valor: string) => {
      valores.set(chave, valor);
    },
  };
}

function lerGuardado(armazenamento: ReturnType<typeof criarArmazenamento>) {
  return JSON.parse(armazenamento.getItem(CHAVE_LOCAL) ?? "null");
}

const SESSAO: NovaSessao = { inicio: AGORA.toISOString(), fim: null, tipo: "base", foco: "bd" };

describe("criarRepositorioLocal", () => {
  it("começa com os dados de exemplo do DESIGN 6.1", async () => {
    const repositorio = criarRepositorioLocal({
      armazenamento: criarArmazenamento(),
      relogio: () => AGORA,
    });

    const sessao = await repositorio.sessaoDeHoje();

    expect(sessao.sequenciaDias).toBe(12);
    expect(sessao.metaSemana).toEqual({ cumpridos: 6, total: 7 });
    expect(sessao.missao).toMatchObject({
      disciplina: "bd",
      rotulo: "SQL",
      conceito: "GROUP BY e HAVING",
      minutos: 25,
      revisoes: 12,
      licaoId: "bd-group-by-having",
    });
    expect(sessao.proximaAvaliacao).toEqual({ disciplina: "bd", data: "2026-10-26" });
  });

  it("guarda tentativas e sessões, e outra instância lê de volta", async () => {
    const armazenamento = criarArmazenamento();
    await criarRepositorioLocal({
      armazenamento,
      relogio: () => AGORA,
      gerarId: () => "tentativa-1",
    }).registrarTentativa({
      itemId: "bd.having.1",
      resposta: "WHERE COUNT(*) > 10",
      correta: false,
      erroTipo: "having_vs_where",
    });

    await criarRepositorioLocal({
      armazenamento,
      relogio: () => AGORA,
      gerarId: () => "sessao-1",
    }).registrarSessao(SESSAO);

    const guardado = lerGuardado(armazenamento);
    expect(guardado.tentativas).toEqual([
      {
        id: "tentativa-1",
        itemId: "bd.having.1",
        resposta: "WHERE COUNT(*) > 10",
        correta: false,
        erroTipo: "having_vs_where",
        feitaEm: AGORA.toISOString(),
      },
    ]);
    expect(guardado.sessoes).toEqual([{ id: "sessao-1", ...SESSAO }]);
  });

  it("devolve só cartas vencidas, das mais atrasadas para as mais recentes", async () => {
    const armazenamento = criarArmazenamento();
    const dados = criarDadosFalsos(AGORA);
    dados.cartas = [
      { ...dados.cartas[0]!, itemId: "ontem", proximaRevisao: "2026-10-10T10:00:00.000Z" },
      { ...dados.cartas[0]!, itemId: "semana-passada", proximaRevisao: "2026-10-04T10:00:00.000Z" },
      { ...dados.cartas[0]!, itemId: "nunca-vista", proximaRevisao: null },
      { ...dados.cartas[0]!, itemId: "mes-que-vem", proximaRevisao: "2026-11-11T10:00:00.000Z" },
    ];
    armazenamento.setItem(CHAVE_LOCAL, JSON.stringify(dados));

    const cartas = await criarRepositorioLocal({
      armazenamento,
      relogio: () => AGORA,
    }).cartasParaRevisar();

    expect(cartas.map((carta) => carta.itemId)).toEqual(["semana-passada", "ontem"]);
  });

  it("o aquecimento para em 12 cartas, mesmo com mais vencidas", async () => {
    const armazenamento = criarArmazenamento();
    await criarRepositorioLocal({ armazenamento, relogio: () => AGORA }).sessaoDeHoje();

    // Dois dias depois, as 2 cartas que eram para amanhã também venceram.
    const depois = criarRepositorioLocal({
      armazenamento,
      relogio: () => new Date(2026, 9, 13, 10, 0),
    });

    expect(await depois.cartasParaRevisar(20)).toHaveLength(14);
    expect(await depois.cartasParaRevisar(5)).toHaveLength(5);
    expect((await depois.sessaoDeHoje()).missao.revisoes).toBe(12);
  });

  it("não mostra AP que já passou", async () => {
    const repositorio = criarRepositorioLocal({
      armazenamento: criarArmazenamento(),
      relogio: () => new Date(2026, 9, 27, 10, 0),
    });

    expect((await repositorio.sessaoDeHoje()).proximaAvaliacao).toBeNull();
  });

  it("devolve o estado de domínio dos conceitos", async () => {
    const repositorio = criarRepositorioLocal({
      armazenamento: criarArmazenamento(),
      relogio: () => AGORA,
    });

    const dominio = await repositorio.dominio();

    expect(dominio.find((conceito) => conceito.conceitoId === "bd.select")?.estado).toBe(
      "dominado",
    );
    expect(dominio.find((conceito) => conceito.conceitoId === "bd.join")?.estado).toBe("bloqueado");
  });

  it("recomeça com os dados de exemplo se o que está guardado estiver corrompido", async () => {
    const armazenamento = criarArmazenamento();
    armazenamento.setItem(CHAVE_LOCAL, "{isto não é json");

    const repositorio = criarRepositorioLocal({ armazenamento, relogio: () => AGORA });

    await expect(repositorio.sessaoDeHoje()).resolves.toMatchObject({ sequenciaDias: 12 });
    expect(lerGuardado(armazenamento).versao).toBe(1);
  });

  it("continua funcionando na memória se o navegador bloquear o armazenamento", async () => {
    const bloqueado = {
      getItem: () => {
        throw new Error("armazenamento bloqueado");
      },
      setItem: () => {
        throw new Error("armazenamento bloqueado");
      },
    };
    const repositorio = criarRepositorioLocal({ armazenamento: bloqueado, relogio: () => AGORA });

    await expect(repositorio.registrarSessao(SESSAO)).resolves.toBeUndefined();
    await expect(repositorio.sessaoDeHoje()).resolves.toMatchObject({ sequenciaDias: 12 });
  });
});
