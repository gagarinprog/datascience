import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { estiloBotaoTatil } from "@/components/ui/botao-tatil";
import { cn } from "@/lib/utils";

type EstadoVazioProps = {
  /** Nome da tela (título de tela). */
  titulo: string;
  /** O que ainda não tem aqui, em uma frase curta. */
  mensagem: string;
  children: ReactNode;
  Icone: LucideIcon;
  acao: { href: string; rotulo: string };
};

/** Tela sem conteúdo ainda: diz o que vai aparecer e convida a agir (DESIGN 7). */
export function EstadoVazio({ titulo, mensagem, children, Icone, acao }: EstadoVazioProps) {
  return (
    <div className="mx-auto w-full max-w-xl px-4 pt-8 pb-10 sm:px-6 lg:pt-14">
      <h1 className="text-titulo">{titulo}</h1>

      <div className="mt-10 flex flex-col items-start">
        {/* Um chip apagado: nada aceso aqui ainda. */}
        <span
          aria-hidden
          className="grid size-14 place-items-center rounded-cartao border border-trilha-apagada bg-placa text-texto-2"
        >
          <Icone className="size-7" />
        </span>
        <p className="mt-5 text-titulo-cartao">{mensagem}</p>
        <div className="mt-2 max-w-[64ch] text-texto-2">{children}</div>
        <Link href={acao.href} className={cn(estiloBotaoTatil({ largura: "total" }), "mt-8")}>
          {acao.rotulo}
        </Link>
      </div>
    </div>
  );
}
