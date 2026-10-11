const DIAS_DA_SEMANA = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

const UM_DIA_EM_MS = 24 * 60 * 60 * 1000;

/** "Domingo, 11 out", como no topo da tela Hoje (DESIGN 6.1). */
export function formatarDiaDeHoje(data: Date): string {
  return `${DIAS_DA_SEMANA[data.getDay()]}, ${data.getDate()} ${MESES[data.getMonth()]}`;
}

/** Data local no formato AAAA-MM-DD. */
export function dataLocalIso(data: Date): string {
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${data.getFullYear()}-${mes}-${dia}`;
}

/**
 * Dias de calendário entre hoje e uma data AAAA-MM-DD, no fuso do aparelho.
 * Negativo quando a data já passou.
 */
export function diasAte(dataAlvo: string, hoje: Date): number {
  const [ano, mes, dia] = dataAlvo.split("-").map(Number);
  const alvo = new Date(ano ?? 0, (mes ?? 1) - 1, dia ?? 1);
  const inicioDeHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  return Math.round((alvo.getTime() - inicioDeHoje.getTime()) / UM_DIA_EM_MS);
}

/** "hoje", "amanhã" ou "em 15 dias". */
export function textoDiasAte(dias: number): string {
  if (dias === 0) return "hoje";
  if (dias === 1) return "amanhã";
  return `em ${dias} dias`;
}

function inicioDoDia(data: Date): Date {
  return new Date(data.getFullYear(), data.getMonth(), data.getDate());
}

/**
 * Dias seguidos de estudo até hoje. Se hoje ainda não teve estudo, a contagem
 * vale até ontem: a sequência só quebra quando um dia inteiro passa em branco.
 */
export function contarSequencia(diasEstudados: Iterable<string>, hoje: Date): number {
  const estudados = new Set(diasEstudados);
  const cursor = inicioDoDia(hoje);
  if (!estudados.has(dataLocalIso(cursor))) cursor.setDate(cursor.getDate() - 1);

  let dias = 0;
  while (estudados.has(dataLocalIso(cursor))) {
    dias += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return dias;
}

export type DiaDaSemana = {
  /** AAAA-MM-DD */
  data: string;
  /** "S", "T", "Q", "Q", "S", "S", "D" */
  inicial: string;
  cumprido: boolean;
  hoje: boolean;
};

const INICIAIS_SEGUNDA_A_DOMINGO = ["S", "T", "Q", "Q", "S", "S", "D"];

/** A semana de segunda a domingo que contém hoje, com os dias de estudo marcados. */
export function semanaDeEstudo(diasEstudados: Iterable<string>, hoje: Date): DiaDaSemana[] {
  const estudados = new Set(diasEstudados);
  const segunda = inicioDoDia(hoje);
  segunda.setDate(segunda.getDate() - ((segunda.getDay() + 6) % 7));
  const dataDeHoje = dataLocalIso(hoje);

  return INICIAIS_SEGUNDA_A_DOMINGO.map((inicial, indice) => {
    const dia = new Date(segunda.getFullYear(), segunda.getMonth(), segunda.getDate() + indice);
    const data = dataLocalIso(dia);
    return { data, inicial, cumprido: estudados.has(data), hoje: data === dataDeHoje };
  });
}
