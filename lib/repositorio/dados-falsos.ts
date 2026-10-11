import type { Disciplina } from "@/lib/disciplinas";

import type { Carta, DominioDoConceito, SessaoDeHoje, Sessao, Tentativa } from "./tipos";

/** O que o repositório local guarda no navegador. */
export type DadosLocais = {
  versao: 1;
  sequenciaDias: number;
  metaSemana: SessaoDeHoje["metaSemana"];
  missao: Omit<SessaoDeHoje["missao"], "revisoes">;
  /** Avaliações Presenciais, com data no formato AAAA-MM-DD. */
  avaliacoes: { disciplina: Disciplina; data: string }[];
  cartas: Carta[];
  dominio: DominioDoConceito[];
  tentativas: Tentativa[];
  sessoes: Sessao[];
};

const UMA_HORA_EM_MS = 60 * 60 * 1000;

/**
 * Dados falsos da Fase 1, tirados do exemplo do DESIGN 6.1: 12 dias de
 * sequência, 12 cartas vencidas e a AP de Banco de Dados em 26/10.
 * Saem de cena quando o progresso passar a ser real.
 */
export function criarDadosFalsos(agora: Date): DadosLocais {
  const vencida = new Date(agora.getTime() - UMA_HORA_EM_MS).toISOString();
  const deAmanha = new Date(agora.getTime() + 24 * UMA_HORA_EM_MS).toISOString();
  const atualizadoEm = agora.toISOString();

  return {
    versao: 1,
    sequenciaDias: 12,
    metaSemana: { cumpridos: 6, total: 7 },
    missao: {
      disciplina: "bd",
      rotulo: "SQL",
      conceito: "GROUP BY e HAVING",
      fraseDeMapa: "No fim, você vai saber filtrar grupos com HAVING.",
      minutos: 25,
      licaoId: "bd-group-by-having",
    },
    avaliacoes: [{ disciplina: "bd", data: "2026-10-26" }],
    cartas: Array.from({ length: 14 }, (_, indice) => ({
      itemId: `exemplo-${indice + 1}`,
      estabilidade: null,
      dificuldade: null,
      ultimaRevisao: null,
      proximaRevisao: indice < 12 ? vencida : deAmanha,
      repeticoes: 0,
      lapsos: 0,
      estado: "novo",
    })),
    dominio: [
      { conceitoId: "bd.select", estado: "dominado", atualizadoEm },
      { conceitoId: "bd.where", estado: "praticado", atualizadoEm },
      { conceitoId: "bd.order-by", estado: "praticado", atualizadoEm },
      { conceitoId: "bd.group-by", estado: "disponivel", atualizadoEm },
      { conceitoId: "bd.having", estado: "bloqueado", atualizadoEm },
      { conceitoId: "bd.join", estado: "bloqueado", atualizadoEm },
    ],
    tentativas: [],
    sessoes: [],
  };
}
