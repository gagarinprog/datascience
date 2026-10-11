import type { ReactNode } from "react";

/** Moldura das telas da navegação: título de tela e conteúdo em uma coluna. */
export function TelaDeAba({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-xl px-4 pt-8 pb-10 sm:px-6 lg:pt-14">
      <h1 className="text-titulo">{titulo}</h1>
      {children}
    </div>
  );
}

/** Aviso padrão quando os dados do navegador não carregam. */
export function ErroDeLeitura() {
  return (
    <p role="alert" className="mt-4 max-w-[64ch] text-texto-2">
      Não deu para carregar seus dados neste navegador. Recarregue a página para tentar de novo.
    </p>
  );
}
