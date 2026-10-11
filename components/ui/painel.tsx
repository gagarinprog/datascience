import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/** Superfícies do DESIGN: placa (superfície 1) e placa alta (superfície 2). */
const estiloPainel = cva("text-texto", {
  variants: {
    nivel: {
      placa: "bg-placa",
      alta: "bg-placa-alta",
    },
    raio: {
      painel: "rounded-painel",
      cartao: "rounded-cartao",
    },
    espaco: {
      normal: "p-5 lg:p-6",
      compacto: "p-4",
    },
  },
  defaultVariants: {
    nivel: "placa",
    raio: "cartao",
    espaco: "normal",
  },
});

type PainelProps = ComponentProps<"div"> & VariantProps<typeof estiloPainel>;

export function Painel({ nivel, raio, espaco, className, ...props }: PainelProps) {
  return <div className={cn(estiloPainel({ nivel, raio, espaco }), className)} {...props} />;
}
