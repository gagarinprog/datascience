/**
 * Contrato entre as telas e onde os dados moram. Até a Fase 5 a implementação
 * é o navegador (local.ts); depois vem o Supabase com a mesma interface.
 * Os tipos seguem o schema do blueprint, seção 8.
 */
import type { DiaDaSemana } from "@/lib/datas";
import type { Disciplina } from "@/lib/disciplinas";
import type { EstadoConceito } from "@/lib/dominio";

/** Tudo o que a tela Hoje mostra (DESIGN 6.1). */
export type SessaoDeHoje = {
  sequenciaDias: number;
  /** Hoje já teve estudo? A sequência acende quando sim. */
  estudouHoje: boolean;
  /** Segunda a domingo da semana atual. */
  semana: DiaDaSemana[];
  metaSemana: { cumpridos: number; total: number };
  missao: {
    disciplina: Disciplina;
    /** Assunto curto do chip, ex.: "SQL". */
    rotulo: string;
    conceito: string;
    /** Frase de mapa (blueprint 7.1): o que você vai saber no fim. */
    fraseDeMapa: string;
    minutos: number;
    revisoes: number;
    licaoId: string;
  };
  /** A próxima Avaliação Presencial, se houver. Data no formato AAAA-MM-DD. */
  proximaAvaliacao: { disciplina: Disciplina; data: string } | null;
};

/** Memória de um item para o FSRS (tabela carta). Datas em ISO 8601. */
export type Carta = {
  itemId: string;
  estabilidade: number | null;
  dificuldade: number | null;
  ultimaRevisao: string | null;
  proximaRevisao: string | null;
  repeticoes: number;
  lapsos: number;
  estado: "novo" | "aprendendo" | "revisao" | "reaprendendo";
};

/** Estado de domínio de um conceito (tabela dominio). */
export type DominioDoConceito = {
  conceitoId: string;
  estado: EstadoConceito;
  atualizadoEm: string;
};

/** Uma resposta a um item (tabela tentativa). */
export type NovaTentativa = {
  itemId: string;
  resposta: string;
  correta: boolean;
  usouDica?: boolean;
  /** Ex.: "aspas", "having_vs_where". */
  erroTipo?: string | null;
  /** Texto devolvido pelo tutor. */
  feedback?: string | null;
};

export type Tentativa = NovaTentativa & { id: string; feitaEm: string };

/** Uma sessão de estudo (tabela sessao). */
export type NovaSessao = {
  inicio: string;
  fim: string | null;
  tipo: "minimo" | "base" | "estendido" | "prova";
  foco: Disciplina | null;
  explicacao3Linhas?: string | null;
  notaExplicacao?: 0 | 1 | 2 | 3 | null;
};

export type Sessao = NovaSessao & { id: string };

export interface Repositorio {
  sessaoDeHoje(): Promise<SessaoDeHoje>;
  /** Cartas vencidas até agora, das mais atrasadas para as mais recentes. */
  cartasParaRevisar(limite?: number): Promise<Carta[]>;
  dominio(): Promise<DominioDoConceito[]>;
  registrarTentativa(tentativa: NovaTentativa): Promise<void>;
  registrarSessao(sessao: NovaSessao): Promise<void>;
}
