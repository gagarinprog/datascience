"use client";

import Link from "next/link";
import { ViewTransition } from "react";

import { IR_FUNDO } from "@/components/transicao/transicao-de-tela";
import { estiloBotaoTatil } from "@/components/ui/botao-tatil";
import { Chip } from "@/components/ui/chip";
import { ChipConceito } from "@/components/ui/chip-conceito";
import { ErroDeLeitura } from "@/components/ui/tela-de-aba";
import { CONCEITOS_BD } from "@/lib/conteudo/conceitos";
import type { EstadoConceito } from "@/lib/dominio";
import type { DominioDoConceito, Repositorio } from "@/lib/repositorio";
import { useLeitura } from "@/lib/repositorio/use-leitura";
import { cn } from "@/lib/utils";

/** A corrente passa adiante de um conceito praticado ou além (blueprint 4.2). */
const ESTADOS_ACESOS: EstadoConceito[] = ["praticado", "dominado", "retido"];

const lerDominio = (repositorio: Repositorio) => repositorio.dominio();

/**
 * Prévia da Trilha de Circuito (DESIGN 6.2), em linha reta, só com Banco de
 * Dados. A trilha completa, com ramificações e o painel do chip, é da Fase 7.
 */
export function TrilhaPrevia({ repositorio }: { repositorio?: Repositorio }) {
  const leitura = useLeitura<DominioDoConceito[]>(lerDominio, repositorio);

  if (leitura.situacao === "erro") return <ErroDeLeitura />;
  if (leitura.situacao === "carregando") {
    return <div aria-busy="true" className="mt-6 h-96 rounded-cartao bg-placa" />;
  }

  const estadoDe = new Map(leitura.dados.map((item) => [item.conceitoId, item.estado]));
  const conceitos = CONCEITOS_BD.map((conceito) => ({
    ...conceito,
    estado: estadoDe.get(conceito.id) ?? "bloqueado",
  }));
  const proximo = conceitos.find((conceito) =>
    (["disponivel", "apresentado"] as EstadoConceito[]).includes(conceito.estado),
  );

  return (
    <ViewTransition enter="revelar" default="none">
      <div>
        <Chip disciplina="bd" className="mt-4">
          Banco de Dados
        </Chip>

        <ol
          aria-label="Trilha de Banco de Dados"
          className="mt-6 flex flex-col items-start sinal-bd"
        >
          {conceitos.map((conceito, indice) => (
            <li key={conceito.id} className="flex flex-col items-start">
              <ChipConceito
                nome={conceito.nome}
                estado={conceito.estado}
                disciplina="bd"
                className="w-48"
              />
              {indice < conceitos.length - 1 && (
                <span
                  aria-hidden
                  data-aceso={ESTADOS_ACESOS.includes(conceito.estado)}
                  className={cn(
                    "ml-8 h-7 w-0.5",
                    ESTADOS_ACESOS.includes(conceito.estado)
                      ? "bg-(--sinal) shadow-[0_0_8px_color-mix(in_oklab,var(--sinal)_60%,transparent)]"
                      : "bg-trilha-apagada",
                  )}
                />
              )}
            </li>
          ))}
        </ol>

        <p className="mt-6 max-w-[64ch] text-secundario text-texto-2">
          Quanto mais cheio o marcador, mais domínio. A corrente acende o trecho depois de cada
          conceito praticado.
        </p>

        {proximo && (
          <div className="mt-8">
            <p className="text-texto-2">
              Próximo passo: <span className="font-semibold text-texto">{proximo.nome}</span>
            </p>
            <Link
              href="/licao/bd-group-by-having"
              transitionTypes={IR_FUNDO}
              className={cn(estiloBotaoTatil({ largura: "total" }), "mt-4")}
            >
              Estudar agora
            </Link>
          </div>
        )}
      </div>
    </ViewTransition>
  );
}
