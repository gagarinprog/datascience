import { dataLocalIso } from "@/lib/datas";
import type { Disciplina } from "@/lib/disciplinas";

import type { Carta, DominioDoConceito, SessaoDeHoje, Sessao, Tentativa } from "./tipos";

/** O que o repositório local guarda no navegador. */
export type DadosLocais = {
  versao: 2;
  /** Dias com sessão concluída, no formato AAAA-MM-DD. A sequência sai daqui. */
  diasEstudados: string[];
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
 * Dados falsos, tirados do exemplo do DESIGN 6.1: os 12 dias antes de hoje
 * estudados (sequência de 12), 12 cartas vencidas e a AP de Banco de Dados
 * em 26/10. Saem de cena quando o progresso passar a ser real.
 */
export function criarDadosFalsos(agora: Date): DadosLocais {
  const vencida = new Date(agora.getTime() - UMA_HORA_EM_MS).toISOString();
  const deAmanha = new Date(agora.getTime() + 24 * UMA_HORA_EM_MS).toISOString();
  const atualizadoEm = agora.toISOString();
  const diasEstudados = Array.from({ length: 12 }, (_, indice) =>
    dataLocalIso(new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() - 12 + indice)),
  );

  return {
    versao: 2,
    diasEstudados,
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
