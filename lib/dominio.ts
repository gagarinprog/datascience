/** Estados de domínio de um conceito (blueprint 4.2), do mais apagado ao mais aceso. */
export const ESTADOS_CONCEITO = [
  "bloqueado",
  "disponivel",
  "apresentado",
  "praticado",
  "dominado",
  "retido",
] as const;

export type EstadoConceito = (typeof ESTADOS_CONCEITO)[number];

export const NOME_ESTADO: Record<EstadoConceito, string> = {
  bloqueado: "Bloqueado",
  disponivel: "Disponível",
  apresentado: "Apresentado",
  praticado: "Praticado",
  dominado: "Dominado",
  retido: "Retido",
};
