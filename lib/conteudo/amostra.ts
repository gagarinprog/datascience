import type { Disciplina } from "@/lib/disciplinas";

export type RespostaCertoErrado = "certo" | "errado";

export type DesafioCertoErrado = {
  id: string;
  disciplina: Disciplina;
  /** Conceito da lição, ex.: "GROUP BY e HAVING". */
  titulo: string;
  afirmacao: string;
  codigo: string;
  gabarito: RespostaCertoErrado;
  justificativa: string;
  /** Código do catálogo de erros (doc 04, seção 4) para quem erra. */
  erroTipo: string;
};

/**
 * Provisório até o motor de conteúdo da Fase 2: o desafio da lição de
 * GROUP BY e HAVING, igual ao exemplo do doc 04, seção 2.
 */
export const DESAFIO_GROUP_BY_HAVING: DesafioCertoErrado = {
  id: "bd.group-by-having.desafio",
  disciplina: "bd",
  titulo: "GROUP BY e HAVING",
  afirmacao: "A consulta abaixo lista as disciplinas com mais de 5 questões difíceis.",
  // Linhas curtas: cabem em 390 px sem rolagem lateral.
  codigo: [
    "SELECT disciplina_id",
    "FROM questoes",
    "WHERE dificuldade >= 4",
    "  AND COUNT(*) > 5",
    "GROUP BY disciplina_id;",
  ].join("\n"),
  gabarito: "errado",
  justificativa:
    "COUNT não pode ficar no WHERE: o WHERE filtra linhas antes de existir qualquer grupo. Filtro de grupo vai no HAVING.",
  erroTipo: "having_vs_where",
};
