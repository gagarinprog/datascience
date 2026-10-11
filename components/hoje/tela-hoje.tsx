"use client";

import { CalendarClock, Zap } from "lucide-react";
import Link from "next/link";
import { startTransition, useEffect, useState, ViewTransition } from "react";

import { estiloBotaoTatil } from "@/components/ui/botao-tatil";
import { Chip } from "@/components/ui/chip";
import { Painel } from "@/components/ui/painel";
import { IR_FUNDO } from "@/components/transicao/transicao-de-tela";
import { diasAte, formatarDiaDeHoje, textoDiasAte } from "@/lib/datas";
import { NOME_DISCIPLINA } from "@/lib/disciplinas";
import { obterRepositorio, type Repositorio, type SessaoDeHoje } from "@/lib/repositorio";
import { cn } from "@/lib/utils";

import { SemanaDeEstudo } from "./semana-de-estudo";

const CONTEUDO = "mx-auto w-full max-w-xl px-4 pt-8 pb-10 sm:px-6 lg:pt-14";

type TelaHojeProps = {
  /** Os testes passam um repositório e uma data fixos. */
  repositorio?: Repositorio;
  agora?: Date;
};

type Carregamento =
  | { situacao: "carregando" }
  | { situacao: "erro" }
  | { situacao: "pronto"; hoje: Date; sessao: SessaoDeHoje };

function plural(quantidade: number, singular: string, plural: string) {
  return `${quantidade} ${quantidade === 1 ? singular : plural}`;
}

/** Tela Hoje (DESIGN 6.1): uma missão, um botão. */
export function TelaHoje({ repositorio, agora }: TelaHojeProps) {
  const [carregamento, setCarregamento] = useState<Carregamento>({ situacao: "carregando" });

  useEffect(() => {
    let ativo = true;
    // A data e os dados só existem no navegador: fuso do aparelho e localStorage.
    const hoje = agora ?? new Date();
    (repositorio ?? obterRepositorio())
      .sessaoDeHoje()
      .then((sessao) => {
        // Dentro de uma transição, o conteúdo entra com a animação "revelar".
        if (ativo) startTransition(() => setCarregamento({ situacao: "pronto", hoje, sessao }));
      })
      .catch(() => {
        if (ativo) setCarregamento({ situacao: "erro" });
      });
    return () => {
      ativo = false;
    };
  }, [repositorio, agora]);

  if (carregamento.situacao === "erro") return <ErroHoje />;
  if (carregamento.situacao === "carregando") {
    return (
      <ViewTransition exit="aba" default="none">
        <EsqueletoHoje />
      </ViewTransition>
    );
  }

  const { hoje, sessao } = carregamento;
  const { missao, proximaAvaliacao } = sessao;
  const diasParaAvaliacao = proximaAvaliacao ? diasAte(proximaAvaliacao.data, hoje) : -1;

  return (
    <ViewTransition enter="revelar" default="none">
      <div className={CONTEUDO}>
        <h1 className="text-titulo">{formatarDiaDeHoje(hoje)}</h1>

        <p className="mt-8 flex items-center gap-3">
          <span className="text-secundario text-texto-2">Sequência</span>
          {/* A corrente acende quando o dia de hoje já teve estudo. */}
          <Zap
            aria-hidden
            data-aceso={sessao.estudouHoje}
            className={cn(
              "size-8 shrink-0",
              sessao.estudouHoje ? "fill-corrente text-corrente" : "text-texto-2",
            )}
          />
          <span className="text-destaque">{plural(sessao.sequenciaDias, "dia", "dias")}</span>
        </p>
        <SemanaDeEstudo semana={sessao.semana} className="mt-5 max-w-80" />

        <Painel className="mt-8">
          <h2 className="text-titulo-cartao">Missão de hoje</h2>
          <Chip disciplina={missao.disciplina} className="mt-3">
            {missao.rotulo} · {missao.conceito}
          </Chip>
          <p className="mt-4 max-w-[64ch]">{missao.fraseDeMapa}</p>
          <p className="mt-2 text-secundario text-texto-2">
            {missao.minutos} min · {plural(missao.revisoes, "revisão", "revisões")}
          </p>
          <Link
            href={`/licao/${missao.licaoId}`}
            transitionTypes={IR_FUNDO}
            className={cn(estiloBotaoTatil({ largura: "total" }), "mt-6")}
          >
            Começar sessão
          </Link>
        </Painel>

        {/* Dia mínimo (blueprint 3.1): só revisão e fechamento, conta como dia cumprido. */}
        <Link
          href="/revisar"
          className="mt-3 inline-flex min-h-11 items-center text-texto-2 underline decoration-trilha-apagada underline-offset-4 hover:text-texto"
        >
          Só 10 minutos hoje
        </Link>

        {proximaAvaliacao && diasParaAvaliacao >= 0 && (
          <p className="mt-6 flex items-center gap-2 text-secundario">
            <CalendarClock aria-hidden className="size-5 shrink-0 text-aviso" />
            AP de {NOME_DISCIPLINA[proximaAvaliacao.disciplina]} {textoDiasAte(diasParaAvaliacao)}
          </p>
        )}
      </div>
    </ViewTransition>
  );
}

/** Mesmo tamanho da tela pronta, para nada pular. Parado: movimento só responde a ação. */
function EsqueletoHoje() {
  return (
    <div className={CONTEUDO} aria-busy="true">
      <p className="sr-only">Carregando o dia de hoje</p>
      <div className="h-8 w-56 rounded-chip bg-placa lg:h-9" />
      <div className="mt-8 h-10 w-48 rounded-chip bg-placa lg:h-12" />
      <div className="mt-5 h-12 w-80 max-w-full rounded-chip bg-placa" />
      <div className="mt-8 h-72 rounded-cartao bg-placa" />
    </div>
  );
}

function ErroHoje() {
  return (
    <div className={CONTEUDO}>
      <h1 className="text-titulo">Hoje</h1>
      <p role="alert" className="mt-4 max-w-[64ch] text-texto-2">
        Não deu para carregar seus dados neste navegador. Recarregue a página para tentar de novo.
      </p>
    </div>
  );
}
