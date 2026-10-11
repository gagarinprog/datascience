import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/**
 * Botão tátil (DESIGN 4): base de 4 px mais escura embaixo; ao pressionar,
 * o botão desce 4 px e a base some. Exportado para estilizar links também.
 */
export const estiloBotaoTatil = cva(
  [
    "inline-flex min-h-13 items-center justify-center gap-2 rounded-botao px-6",
    "text-center text-corpo font-semibold select-none",
    "transition-transform duration-75 ease-out motion-reduce:transition-none",
    "[&_svg]:size-5 [&_svg]:shrink-0",
    "active:translate-y-1 active:shadow-none",
    "data-[pressionado=true]:translate-y-1 data-[pressionado=true]:shadow-none",
    "disabled:translate-y-1 disabled:cursor-not-allowed disabled:border-transparent disabled:bg-placa-alta disabled:text-texto-2 disabled:shadow-none",
  ],
  {
    variants: {
      variante: {
        primario: "bg-corrente text-sobre-corrente shadow-[0_4px_0_var(--color-corrente-base)]",
        secundario:
          "border border-trilha-apagada bg-placa-alta text-texto shadow-[0_4px_0_var(--color-trilha-apagada)]",
        perigo: "bg-erro text-sobre-corrente shadow-[0_4px_0_var(--color-erro-base)]",
      },
      largura: {
        auto: "",
        total: "w-full",
      },
    },
    defaultVariants: {
      variante: "primario",
      largura: "auto",
    },
  },
);

type BotaoTatilProps = ComponentProps<"button"> &
  VariantProps<typeof estiloBotaoTatil> & {
    /** Força o visual pressionado (usado na página /design). */
    pressionado?: boolean;
  };

export function BotaoTatil({
  variante,
  largura,
  pressionado,
  className,
  type = "button",
  ...props
}: BotaoTatilProps) {
  return (
    <button
      type={type}
      data-pressionado={pressionado ? "true" : undefined}
      className={cn(estiloBotaoTatil({ variante, largura }), className)}
      {...props}
    />
  );
}
