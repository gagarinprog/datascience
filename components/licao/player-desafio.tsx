"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";

import { VOLTAR } from "@/components/transicao/transicao-de-tela";
import { BarraProgressoSegmentada } from "@/components/ui/barra-progresso-segmentada";
import { BotaoTatil, estiloBotaoTatil } from "@/components/ui/botao-tatil";
import { PainelFeedback } from "@/components/ui/painel-feedback";
import type { DesafioCertoErrado, RespostaCertoErrado } from "@/lib/conteudo/amostra";
import { obterRepositorio, type Repositorio } from "@/lib/repositorio";
import { cn } from "@/lib/utils";

import { ItemCertoErrado } from "./item-certo-errado";

/** Os passos da lição (CLAUDE.md, regra 1); por enquanto só o desafio é jogável. */
const PASSOS_DA_LICAO = 5;

type Fase = "respondendo" | "feedback" | "concluido";

type PlayerDesafioProps = {
  desafio: DesafioCertoErrado;
  /** Os testes passam um repositório próprio. */
  repositorio?: Repositorio;
};

/**
 * Player provisório (DESIGN 6.3): o desafio da lição, jogável, até o player
 * completo da Fase 2. Tela cheia, Verificar fixo embaixo, feedback que sobe.
 */
export function PlayerDesafio({ desafio, repositorio }: PlayerDesafioProps) {
  const [escolha, setEscolha] = useState<RespostaCertoErrado | null>(null);
  const [fase, setFase] = useState<Fase>("respondendo");
  const idDoEnunciado = useId();
  const acertou = escolha === desafio.gabarito;

  function verificar() {
    if (!escolha) return;
    setFase("feedback");
    void (repositorio ?? obterRepositorio()).registrarTentativa({
      itemId: desafio.id,
      resposta: escolha,
      correta: escolha === desafio.gabarito,
      erroTipo: escolha === desafio.gabarito ? null : desafio.erroTipo,
    });
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col px-4 pt-3 pb-44 sm:px-6">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          transitionTypes={VOLTAR}
          aria-label="Fechar a lição"
          className="-ml-2 grid size-11 shrink-0 place-items-center rounded-botao text-texto-2 hover:text-texto"
        >
          <X aria-hidden className="size-6" />
        </Link>
        <BarraProgressoSegmentada
          total={PASSOS_DA_LICAO}
          concluidos={fase === "respondendo" ? 0 : 1}
          disciplina={desafio.disciplina}
          rotulo="Progresso da lição"
        />
      </div>

      {fase === "concluido" ? (
        <DesafioConcluido acertou={acertou} />
      ) : (
        <>
          <p className="mt-8 text-secundario text-texto-2">Desafio · {desafio.titulo}</p>
          <h1 id={idDoEnunciado} className="mt-2 max-w-[64ch] text-titulo-cartao">
            {desafio.afirmacao}
          </h1>
          {/* Focável: se a tela for estreita demais e o código rolar, o teclado alcança. */}
          <pre
            tabIndex={0}
            role="region"
            aria-label="Consulta do desafio"
            className="mt-4 overflow-x-auto rounded-cartao bg-placa p-4 font-mono"
          >
            <code>{desafio.codigo}</code>
          </pre>
          <p className="mt-6 text-texto-2">Certo ou errado?</p>
          <ItemCertoErrado
            className="mt-3"
            escolha={escolha}
            onEscolher={setEscolha}
            gabarito={fase === "feedback" ? desafio.gabarito : undefined}
            idDoEnunciado={idDoEnunciado}
          />
        </>
      )}

      {fase === "respondendo" && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-trilha-apagada bg-fundo px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="mx-auto max-w-xl sm:px-2">
            <BotaoTatil largura="total" disabled={!escolha} onClick={verificar}>
              Verificar
            </BotaoTatil>
          </div>
        </div>
      )}

      {fase === "feedback" && (
        <div className="fixed inset-x-0 bottom-0 z-40">
          <div className="mx-auto max-w-xl">
            <PainelFeedback
              resultado={acertou ? "certo" : "errado"}
              acoes={["continuar"]}
              focarAcao
              onContinuar={() => setFase("concluido")}
            >
              {!acertou && <>O gabarito é {desafio.gabarito === "certo" ? "Certo" : "Errado"}. </>}
              {desafio.justificativa}
              {!acertou && (
                <span className="mt-2 block text-secundario text-texto-2">
                  Errar no desafio faz parte: ele prepara o que vem a seguir.
                </span>
              )}
            </PainelFeedback>
          </div>
        </div>
      )}
    </main>
  );
}

function DesafioConcluido({ acertou }: { acertou: boolean }) {
  return (
    <div className="flex flex-1 flex-col justify-center py-10">
      <p className="text-secundario text-texto-2">Desafio feito</p>
      <h1 className="mt-2 text-titulo">
        {acertou ? "Você acertou o desafio." : "Agora você já sabe onde mora a pegadinha."}
      </h1>
      <p className="mt-3 max-w-[64ch] text-texto-2">
        Sua resposta ficou guardada. O resto da lição (conceito, exemplo resolvido e prática) entra
        na próxima etapa do app.
      </p>
      <Link
        href="/"
        transitionTypes={VOLTAR}
        className={cn(estiloBotaoTatil({ largura: "total" }), "mt-8")}
      >
        Voltar para Hoje
      </Link>
    </div>
  );
}
