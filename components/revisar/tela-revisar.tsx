"use client";

import { Layers } from "lucide-react";
import Link from "next/link";
import { ViewTransition } from "react";

import { IR_FUNDO } from "@/components/transicao/transicao-de-tela";
import { estiloBotaoTatil } from "@/components/ui/botao-tatil";
import { ErroDeLeitura } from "@/components/ui/tela-de-aba";
import type { Carta, Repositorio } from "@/lib/repositorio";
import { useLeitura } from "@/lib/repositorio/use-leitura";
import { cn } from "@/lib/utils";

const lerCartas = (repositorio: Repositorio) => repositorio.cartasParaRevisar();

/** Revisar (DESIGN 6.6), por enquanto só a contagem: a fila com as cartas é da Fase 4. */
export function TelaRevisar({ repositorio }: { repositorio?: Repositorio }) {
  const leitura = useLeitura<Carta[]>(lerCartas, repositorio);

  if (leitura.situacao === "erro") return <ErroDeLeitura />;
  if (leitura.situacao === "carregando") {
    return <div aria-busy="true" className="mt-8 h-56 rounded-cartao bg-placa" />;
  }

  const quantas = leitura.dados.length;

  return (
    <ViewTransition enter="revelar" default="none">
      <div className="mt-8">
        {quantas === 0 ? (
          <p className="text-titulo-cartao">Nenhuma revisão para hoje. Que tal uma lição nova?</p>
        ) : (
          <p className="flex items-center gap-3">
            <Layers aria-hidden className="size-8 shrink-0 text-corrente" />
            <span className="text-destaque">{quantas}</span>
            <span className="text-texto-2">
              {quantas === 1 ? "carta esperando revisão" : "cartas esperando revisão"}
            </span>
          </p>
        )}
        <p className="mt-4 max-w-[64ch] text-texto-2">
          Cada carta é um item que você já viu e volta no dia certo, para você lembrar de memória. A
          tela de revisão chega em breve; por enquanto, o desafio de hoje treina o mesmo músculo.
        </p>
        <Link
          href="/licao/bd-group-by-having"
          transitionTypes={IR_FUNDO}
          className={cn(estiloBotaoTatil({ largura: "total" }), "mt-8")}
        >
          Fazer o desafio de hoje
        </Link>
      </div>
    </ViewTransition>
  );
}
