import { ViewTransition, type ReactNode } from "react";

/**
 * Envolve o conteúdo de cada página (não o layout, que persiste entre telas).
 * Os links marcam o tipo de navegação com transitionTypes:
 *   "ir-fundo" para entrar na lição e "voltar" para sair dela.
 * Sem tipo (troca de aba, voltar do navegador), o conteúdo só esmaece.
 * As animações estão em app/globals.css (seção 5.1).
 */
export function TransicaoDeTela({ children }: { children: ReactNode }) {
  return (
    <ViewTransition
      enter={{ "ir-fundo": "ir-fundo", voltar: "voltar", default: "aba" }}
      exit={{ "ir-fundo": "ir-fundo", voltar: "voltar", default: "aba" }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}

/** Tipos usados em <Link transitionTypes>. */
export const IR_FUNDO = ["ir-fundo"];
export const VOLTAR = ["voltar"];
