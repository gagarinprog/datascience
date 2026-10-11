"use client";

import { useState } from "react";

import { BotaoTatil } from "@/components/ui/botao-tatil";
import { Chip } from "@/components/ui/chip";
import { PainelFeedback } from "@/components/ui/painel-feedback";
import { DISCIPLINAS, NOME_DISCIPLINA, type Disciplina } from "@/lib/disciplinas";

/** Seletor de disciplina: o chip escolhido acende. */
export function DemoSeletorDisciplina() {
  const [escolhida, setEscolhida] = useState<Disciplina>("bd");

  return (
    <div role="group" aria-label="Escolha a disciplina" className="flex flex-wrap gap-2">
      {DISCIPLINAS.map((disciplina) => (
        <Chip
          key={disciplina}
          disciplina={disciplina}
          selecionado={disciplina === escolhida}
          onClick={() => setEscolhida(disciplina)}
        >
          {NOME_DISCIPLINA[disciplina]}
        </Chip>
      ))}
    </div>
  );
}

type Simulacao = { resultado: "certo" | "errado"; vez: number };

/** Mostra o painel de feedback subindo, como no player de lição. */
export function DemoFeedback() {
  const [simulacao, setSimulacao] = useState<Simulacao | null>(null);

  function simular(resultado: Simulacao["resultado"]) {
    setSimulacao((anterior) => ({ resultado, vez: (anterior?.vez ?? 0) + 1 }));
  }

  // Moldura do tamanho de um celular, como o player de lição.
  return (
    <div className="relative h-[31rem] max-w-md overflow-hidden rounded-cartao border border-trilha-apagada bg-fundo">
      <div className="flex flex-col gap-3 p-5">
        <BotaoTatil onClick={() => simular("certo")}>Simular acerto</BotaoTatil>
        <BotaoTatil variante="secundario" onClick={() => simular("errado")}>
          Simular erro
        </BotaoTatil>
      </div>
      <p className="absolute inset-x-5 bottom-10 text-center text-secundario text-texto-2">
        O painel de feedback sobe daqui de baixo.
      </p>

      {simulacao && (
        <PainelFeedback
          key={simulacao.vez}
          resultado={simulacao.resultado}
          className="absolute inset-x-0 bottom-0"
          onContinuar={() => setSimulacao(null)}
          onTentarDeNovo={() => setSimulacao(null)}
          onExplicarErro={() => setSimulacao(null)}
        >
          {simulacao.resultado === "certo" ? (
            <>
              <code className="font-mono">GROUP BY</code> juntou as questões por disciplina e{" "}
              <code className="font-mono">COUNT(*)</code> contou cada grupo.
            </>
          ) : (
            <>
              Você filtrou o grupo com <code className="font-mono">WHERE</code>. Filtro depois de
              agrupar vai no <code className="font-mono">HAVING</code>.
            </>
          )}
        </PainelFeedback>
      )}
    </div>
  );
}
