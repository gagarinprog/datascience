import Link from "next/link";

import { estiloBotaoTatil } from "@/components/ui/botao-tatil";
import { cn } from "@/lib/utils";

export default function NaoEncontrada() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-4 py-12">
      <h1 className="text-titulo">Página não encontrada</h1>
      <p className="mt-3 text-texto-2">Este endereço não existe no Domínio.</p>
      <Link href="/" className={cn(estiloBotaoTatil({ largura: "total" }), "mt-8")}>
        Voltar ao início
      </Link>
    </main>
  );
}
