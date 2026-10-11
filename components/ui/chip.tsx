import type { ReactNode } from "react";

import { CLASSE_SINAL, type Disciplina } from "@/lib/disciplinas";
import { cn } from "@/lib/utils";

type ChipProps = {
  children: ReactNode;
  /** Sem disciplina, o chip é neutro. */
  disciplina?: Disciplina;
  /** Com onClick, o chip vira botão de seleção (ex.: seletor de disciplina). */
  onClick?: () => void;
  selecionado?: boolean;
  className?: string;
};

/**
 * Chip com a cor da disciplina na borda, no texto e no pad. O fundo fica
 * transparente para o texto colorido manter contraste AA em qualquer superfície.
 * Seleção também muda a forma do pad (cheio ou vazado), não só a cor.
 */
export function Chip({ children, disciplina, onClick, selecionado, className }: ChipProps) {
  const interativo = onClick !== undefined;
  const aceso = interativo ? Boolean(selecionado) : disciplina !== undefined;

  const classes = cn(
    "inline-flex items-center gap-2 rounded-chip border px-2.5 py-1 text-secundario font-semibold",
    disciplina ? CLASSE_SINAL[disciplina] : "sinal-corrente",
    aceso ? "border-(--sinal)/60 text-(--sinal)" : "border-trilha-apagada text-texto-2",
    interativo && "min-h-11 px-3.5 hover:bg-placa-alta",
    className,
  );

  const pad = (
    <span
      aria-hidden
      className={cn(
        "size-2 shrink-0 rounded-full border-2",
        aceso || disciplina ? "border-(--sinal)" : "border-trilha-apagada",
        aceso && "bg-(--sinal)",
      )}
    />
  );

  if (interativo) {
    return (
      <button
        type="button"
        aria-pressed={Boolean(selecionado)}
        onClick={onClick}
        className={classes}
      >
        {pad}
        {children}
      </button>
    );
  }

  return (
    <span className={classes}>
      {pad}
      {children}
    </span>
  );
}
