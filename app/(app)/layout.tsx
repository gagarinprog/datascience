import type { ReactNode } from "react";

import { Navegacao } from "@/components/navegacao/navegacao";

/** Casca das telas com navegação. O /design e o player de lição ficam fora, em tela cheia. */
export default function LayoutComNavegacao({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only rounded-botao bg-corrente font-semibold text-sobre-corrente focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-3"
      >
        Pular para o conteúdo
      </a>
      <Navegacao />
      <main
        id="conteudo"
        tabIndex={-1}
        className="pb-24 focus-visible:outline-none lg:pb-0 lg:pl-28"
      >
        {children}
      </main>
    </>
  );
}
