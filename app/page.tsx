import Link from "next/link";

import { estiloBotaoTatil } from "@/components/ui/botao-tatil";
import { cn } from "@/lib/utils";

// Provisória: a tela Hoje (DESIGN 6.1) chega na Fase 1.
export default function Inicio() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-4 py-12">
      <p className="text-secundario text-texto-2">Fase 0 · fundação</p>
      <h1 className="mt-2 text-titulo">Domínio</h1>
      <p className="mt-3 text-texto-2">
        A tela Hoje chega na Fase 1. Por enquanto, o que existe é o sistema de design.
      </p>
      <Link href="/design" className={cn(estiloBotaoTatil({ largura: "total" }), "mt-8")}>
        Ver o sistema de design
      </Link>
    </main>
  );
}
