import { CLASSE_SINAL, type Disciplina } from "@/lib/disciplinas";
import { cn } from "@/lib/utils";

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

const ESTILO_ESTADO: Record<EstadoConceito, string> = {
  bloqueado: "border-trilha-apagada bg-fundo text-texto-2",
  disponivel: "border-(--sinal) bg-placa text-texto",
  apresentado: "border-(--sinal) bg-placa text-texto",
  praticado: "border-(--sinal) bg-(--sinal)/12 text-texto",
  dominado: "brilho border-(--sinal) bg-(--sinal)/12 text-texto",
  retido: "brilho-retido border-(--sinal) bg-(--sinal)/12 text-texto",
};

/**
 * Marcador da legenda do DESIGN 6.2. A forma muda com o estado
 * (vazio, contorno, meio, cheio, aceso), então a cor nunca informa sozinha.
 */
function Marcador({ estado }: { estado: EstadoConceito }) {
  const base = "size-3.5 shrink-0 border-2";

  switch (estado) {
    case "bloqueado":
      return <span aria-hidden className={cn(base, "rounded-[3px] border-trilha-apagada")} />;
    case "disponivel":
      return (
        <span
          aria-hidden
          className={cn(base, "grid place-items-center rounded-[3px] border-(--sinal)")}
        >
          <span className="size-1.5 rounded-[1px] bg-(--sinal)" />
        </span>
      );
    case "apresentado":
      return (
        <span
          aria-hidden
          className={cn(
            base,
            "rounded-[3px] border-(--sinal) bg-[linear-gradient(135deg,transparent_50%,var(--sinal)_50%)]",
          )}
        />
      );
    case "praticado":
      return (
        <span aria-hidden className={cn(base, "rounded-[3px] border-(--sinal) bg-(--sinal)")} />
      );
    case "dominado":
    case "retido":
      return (
        <span
          aria-hidden
          className={cn(
            base,
            "grid place-items-center rounded-full border-(--sinal) shadow-[0_0_8px_color-mix(in_oklab,var(--sinal)_70%,transparent)]",
          )}
        >
          <span className="size-1.5 rounded-full bg-(--sinal)" />
        </span>
      );
  }
}

type ChipConceitoProps = {
  nome: string;
  estado: EstadoConceito;
  disciplina: Disciplina;
  /** Com onClick, o chip vira botão (abre o painel do conceito na Fase 7). */
  onClick?: () => void;
  className?: string;
};

/** Chip de conceito da Trilha de Circuito (DESIGN 6.2). */
export function ChipConceito({ nome, estado, disciplina, onClick, className }: ChipConceitoProps) {
  const classes = cn(
    "inline-flex min-h-11 min-w-36 items-center justify-between gap-3 rounded-chip border px-3.5 py-2 text-left text-corpo font-semibold",
    CLASSE_SINAL[disciplina],
    ESTILO_ESTADO[estado],
    onClick && "hover:bg-placa-alta",
    className,
  );

  const conteudo = (
    <>
      <span className="min-w-0 truncate">
        {nome}
        <span className="sr-only">, {NOME_ESTADO[estado].toLowerCase()}</span>
      </span>
      <Marcador estado={estado} />
    </>
  );

  if (onClick) {
    return (
      <button type="button" data-estado={estado} onClick={onClick} className={classes}>
        {conteudo}
      </button>
    );
  }

  return (
    <div data-estado={estado} className={classes}>
      {conteudo}
    </div>
  );
}
