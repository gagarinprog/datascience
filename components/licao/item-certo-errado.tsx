"use client";

import { CircleCheck, CircleX } from "lucide-react";

import type { RespostaCertoErrado } from "@/lib/conteudo/amostra";
import { cn } from "@/lib/utils";

type ItemCertoErradoProps = {
  escolha: RespostaCertoErrado | null;
  onEscolher: (resposta: RespostaCertoErrado) => void;
  /** Depois de verificar: trava as opções e mostra o gabarito. */
  gabarito?: RespostaCertoErrado;
  /** id do enunciado, para o grupo ser anunciado com ele. */
  idDoEnunciado?: string;
  className?: string;
};

const OPCOES: { valor: RespostaCertoErrado; rotulo: string }[] = [
  { valor: "certo", rotulo: "Certo" },
  { valor: "errado", rotulo: "Errado" },
];

/**
 * Item Certo/Errado (DESIGN 6.4): dois botões grandes. Depois de verificar,
 * o gabarito ganha borda e ícone de acerto; a escolha errada, de erro.
 */
export function ItemCertoErrado({
  escolha,
  onEscolher,
  gabarito,
  idDoEnunciado,
  className,
}: ItemCertoErradoProps) {
  const verificado = gabarito !== undefined;

  return (
    <div
      role="group"
      aria-labelledby={idDoEnunciado}
      className={cn("grid grid-cols-2 gap-3", className)}
    >
      {OPCOES.map(({ valor, rotulo }) => {
        const marcada = escolha === valor;
        const ehGabarito = verificado && gabarito === valor;
        const errouAqui = verificado && marcada && !ehGabarito;

        return (
          <button
            key={valor}
            type="button"
            aria-pressed={marcada}
            aria-label={
              ehGabarito ? `${rotulo}, gabarito` : errouAqui ? `${rotulo}, sua resposta` : undefined
            }
            disabled={verificado}
            onClick={() => onEscolher(valor)}
            className={cn(
              "flex min-h-16 items-center justify-center gap-2 rounded-botao border-2 text-corpo font-semibold",
              "transition-[background-color,border-color,scale] duration-100 ease-out active:scale-[0.97] motion-reduce:transition-none",
              !verificado &&
                (marcada
                  ? "border-corrente bg-corrente/12 text-texto"
                  : "border-trilha-apagada bg-placa text-texto hover:bg-placa-alta"),
              ehGabarito && "border-acerto bg-acerto/10 text-texto",
              errouAqui && "border-erro bg-erro/10 text-texto",
              verificado &&
                !ehGabarito &&
                !errouAqui &&
                "border-trilha-apagada bg-placa text-texto-2",
            )}
          >
            {ehGabarito && <CircleCheck aria-hidden className="size-5 text-acerto" />}
            {errouAqui && <CircleX aria-hidden className="size-5 text-erro" />}
            {rotulo}
          </button>
        );
      })}
    </div>
  );
}
