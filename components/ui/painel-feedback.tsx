"use client";

import { CircleCheck, CircleX } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

import { BotaoTatil } from "@/components/ui/botao-tatil";
import { cn } from "@/lib/utils";

type Acao = "continuar" | "tentar-de-novo" | "explicar";

type PainelFeedbackProps = {
  resultado: "certo" | "errado";
  /** Certo: a frase curta do porquê. Errado: o erro exato. */
  children: ReactNode;
  titulo?: string;
  /**
   * Botões, do principal para o secundário. Padrão: Continuar no acerto;
   * Tentar de novo e Explicar meu erro no erro. Item Certo/Errado usa só Continuar.
   */
  acoes?: Acao[];
  /** Desligado na página /design, onde o painel aparece parado. */
  animarEntrada?: boolean;
  /** Leva o foco ao primeiro botão quando o painel aparece (teclado e leitor de tela). */
  focarAcao?: boolean;
  onContinuar?: () => void;
  onTentarDeNovo?: () => void;
  onExplicarErro?: () => void;
  className?: string;
};

const TITULO_PADRAO = {
  certo: "Certo",
  errado: "Ainda não",
} as const;

const ACOES_PADRAO: Record<PainelFeedbackProps["resultado"], Acao[]> = {
  certo: ["continuar"],
  errado: ["tentar-de-novo", "explicar"],
};

const ROTULO_DA_ACAO: Record<Acao, string> = {
  continuar: "Continuar",
  "tentar-de-novo": "Tentar de novo",
  explicar: "Explicar meu erro",
};

/**
 * Painel de feedback (DESIGN 5 e 6.3): sobe de baixo em 200 ms, ease-out, e o
 * ícone acende logo depois. Com prefers-reduced-motion, aparece direto.
 * A cor nunca vem sozinha: sempre com ícone e texto.
 */
export function PainelFeedback({
  resultado,
  children,
  titulo,
  acoes,
  animarEntrada = true,
  focarAcao = false,
  onContinuar,
  onTentarDeNovo,
  onExplicarErro,
  className,
}: PainelFeedbackProps) {
  const reduzirMovimento = useReducedMotion();
  const primeiroBotao = useRef<HTMLButtonElement>(null);
  const certo = resultado === "certo";
  const Icone = certo ? CircleCheck : CircleX;
  const animar = animarEntrada && !reduzirMovimento;

  useEffect(() => {
    if (focarAcao) primeiroBotao.current?.focus();
  }, [focarAcao]);

  const aoEscolher: Record<Acao, (() => void) | undefined> = {
    continuar: onContinuar,
    "tentar-de-novo": onTentarDeNovo,
    explicar: onExplicarErro,
  };

  return (
    <motion.section
      data-resultado={resultado}
      initial={animar ? { y: "100%" } : false}
      animate={{ y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "rounded-t-painel border-t-2 bg-placa-alta px-5 pt-5 pb-6 lg:px-6",
        certo ? "border-acerto" : "border-erro",
        className,
      )}
    >
      <div role="status" className="flex items-start gap-3">
        <motion.span
          aria-hidden
          initial={animar ? { scale: 0.6, opacity: 0 } : false}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.12, ease: [0.2, 0, 0, 1] }}
          className="mt-0.5 shrink-0"
        >
          <Icone className={cn("size-7", certo ? "text-acerto" : "text-erro")} />
        </motion.span>
        <div className="min-w-0">
          <p className="text-titulo-cartao">{titulo ?? TITULO_PADRAO[resultado]}</p>
          <div className="mt-1 text-corpo">{children}</div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {(acoes ?? ACOES_PADRAO[resultado]).map((acao, indice) => (
          <BotaoTatil
            key={acao}
            ref={indice === 0 ? primeiroBotao : undefined}
            largura="total"
            variante={indice === 0 ? "primario" : "secundario"}
            onClick={aoEscolher[acao]}
          >
            {ROTULO_DA_ACAO[acao]}
          </BotaoTatil>
        ))}
      </div>
    </motion.section>
  );
}
