"use client";

import { Zap } from "lucide-react";
import Link from "next/link";
import { ViewTransition } from "react";

import { SemanaDeEstudo } from "@/components/hoje/semana-de-estudo";
import { estiloBotaoTatil } from "@/components/ui/botao-tatil";
import { Painel } from "@/components/ui/painel";
import { ErroDeLeitura } from "@/components/ui/tela-de-aba";
import { ESTADOS_CONCEITO, NOME_ESTADO } from "@/lib/dominio";
import type { DominioDoConceito, Repositorio, SessaoDeHoje } from "@/lib/repositorio";
import { useLeitura } from "@/lib/repositorio/use-leitura";
import { cn } from "@/lib/utils";

type Resumo = { sessao: SessaoDeHoje; dominio: DominioDoConceito[] };

const lerResumo = async (repositorio: Repositorio): Promise<Resumo> => {
  const [sessao, dominio] = await Promise.all([repositorio.sessaoDeHoje(), repositorio.dominio()]);
  return { sessao, dominio };
};

/** Eu: sequência, semana e domínio por estado. O diário de 3 linhas chega com as lições. */
export function TelaPerfil({ repositorio }: { repositorio?: Repositorio }) {
  const leitura = useLeitura<Resumo>(lerResumo, repositorio);

  if (leitura.situacao === "erro") return <ErroDeLeitura />;
  if (leitura.situacao === "carregando") {
    return <div aria-busy="true" className="mt-8 h-96 rounded-cartao bg-placa" />;
  }

  const { sessao, dominio } = leitura.dados;
  // Progresso se lê do mais avançado para o menos: retido primeiro, bloqueado por último.
  const contagem = [...ESTADOS_CONCEITO]
    .reverse()
    .map((estado) => ({
      estado,
      quantos: dominio.filter((conceito) => conceito.estado === estado).length,
    }))
    .filter(({ quantos }) => quantos > 0);

  return (
    <ViewTransition enter="revelar" default="none">
      <div className="mt-8 space-y-6">
        <Painel>
          <h2 className="text-secundario text-texto-2">Sequência</h2>
          <p className="mt-1 flex items-center gap-3">
            <Zap
              aria-hidden
              className={cn(
                "size-8 shrink-0",
                sessao.estudouHoje ? "fill-corrente text-corrente" : "text-texto-2",
              )}
            />
            <span className="text-destaque">
              {sessao.sequenciaDias} {sessao.sequenciaDias === 1 ? "dia" : "dias"}
            </span>
          </p>
          <SemanaDeEstudo semana={sessao.semana} className="mt-5" />
        </Painel>

        <Painel>
          <h2 className="text-secundario text-texto-2">Domínio em Banco de Dados</h2>
          <ul className="mt-3 space-y-1">
            {contagem.map(({ estado, quantos }) => (
              <li key={estado} className="flex justify-between gap-4">
                <span>{NOME_ESTADO[estado]}</span>
                <span className="font-semibold">
                  {quantos} {quantos === 1 ? "conceito" : "conceitos"}
                </span>
              </li>
            ))}
          </ul>
        </Painel>

        <Painel>
          <h2 className="text-secundario text-texto-2">Diário de 3 linhas</h2>
          <p className="mt-1 text-texto-2">
            Aparece aqui quando você fechar a primeira lição explicando o que aprendeu.
          </p>
        </Painel>

        <Link href="/" className={cn(estiloBotaoTatil({ largura: "total" }), "mt-2")}>
          Ir para a missão de hoje
        </Link>
      </div>
    </ViewTransition>
  );
}
