import { X } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { estiloBotaoTatil } from "@/components/ui/botao-tatil";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Lição",
};

// Provisória, só para o "Começar sessão" ter destino: o player (DESIGN 6.3) chega na Fase 2.
export default function PaginaLicao() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col px-4 pt-3 pb-8 sm:px-6">
      <Link
        href="/"
        aria-label="Fechar a lição"
        className="-ml-2 grid size-11 place-items-center rounded-botao text-texto-2 hover:text-texto"
      >
        <X aria-hidden className="size-6" />
      </Link>
      <div className="flex flex-1 flex-col justify-center">
        <h1 className="text-titulo">A lição ainda está sendo montada</h1>
        <p className="mt-3 max-w-[64ch] text-texto-2">
          O player com desafio, conceito, exemplo e prática entra na próxima etapa do app. Por
          enquanto, volte para a tela Hoje.
        </p>
        <Link href="/" className={cn(estiloBotaoTatil({ largura: "total" }), "mt-8")}>
          Voltar para Hoje
        </Link>
      </div>
    </main>
  );
}
