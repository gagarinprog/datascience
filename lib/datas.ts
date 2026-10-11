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
