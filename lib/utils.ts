import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Sem isto, o tailwind-merge acha que text-corpo (tamanho) e text-texto (cor)
// são do mesmo grupo e descarta um deles.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["destaque", "titulo", "titulo-cartao", "corpo", "secundario", "codigo"],
      radius: ["painel", "cartao", "botao", "chip"],
    },
  },
});

/** Junta classes condicionais e resolve conflitos do Tailwind (padrão do shadcn/ui). */
export function cn(...entradas: ClassValue[]) {
  return twMerge(clsx(entradas));
}
