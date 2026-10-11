/** Disciplinas do curso, com o id usado em content/ e nos tokens --color-sinal-*. */
export const DISCIPLINAS = ["alg2", "bd", "ed", "gaal", "poo", "icc", "est"] as const;

export type Disciplina = (typeof DISCIPLINAS)[number];

export const NOME_DISCIPLINA: Record<Disciplina, string> = {
  alg2: "Algoritmos II",
  bd: "Banco de Dados",
  ed: "Estrutura de Dados",
  gaal: "GAAL",
  poo: "POO",
  icc: "Intro. Conceitos de Computação",
  est: "Estatística",
};

/** Classe que define --sinal com a cor da disciplina (ver app/globals.css). */
export const CLASSE_SINAL: Record<Disciplina, string> = {
  alg2: "sinal-alg2",
  bd: "sinal-bd",
  ed: "sinal-ed",
  gaal: "sinal-gaal",
  poo: "sinal-poo",
  icc: "sinal-icc",
  est: "sinal-est",
};
