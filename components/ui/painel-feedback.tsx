"use client";

import { CircleCheck, CircleX } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { BotaoTatil } from "@/components/ui/botao-tatil";
import { cn } from "@/lib/utils";

type PainelFeedbackProps = {
  resultado: "certo" | "errado";
  /** Certo: a frase curta do porquê. Errado: o erro exato. */
  children: ReactNode;
  titulo?: string;
  /** Desligado na página /design, onde o painel aparece parado. */
  animarEntrada?: boolean;
  onContinuar?: () => void;
  onTentarDeNovo?: () => void;
  onExplicarErro?: () => void;
  className?: string;
};

const TITULO_PADRAO = {
  certo: "Certo",
  errado: "Ainda não",
} as const;

/**
 * Painel de feedback (DESIGN 5 e 6.3): sobe de baixo em 200 ms, ease-out.
 * Com prefers-reduced-motion, aparece direto. A cor nunca vem sozinha:
 * sempre com ícone e texto.
 */
export function PainelFeedback({
  resultado,
  children,
  titulo,
  animarEntrada = true,
  onContinuar,
  onTentarDeNovo,
  onExplicarErro,
  className,
}: PainelFeedbackProps) {
  const reduzirMovimento = useReducedMotion();
  const certo = resultado === "certo";
  const Icone = certo ? CircleCheck : CircleX;

  return (
    <motion.section
      data-resultado={resultado}
      initial={animarEntrada && !reduzirMovimento ? { y: "100%" } : false}
      animate={{ y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "rounded-t-painel border-t-2 bg-placa-alta px-5 pt-5 pb-6 lg:px-6",
        certo ? "border-acerto" : "border-erro",
        className,
      )}
    >
      <div role="status" className="flex items-start gap-3">
        <Icone
          aria-hidden
          className={cn("mt-0.5 size-7 shrink-0", certo ? "text-acerto" : "text-erro")}
        />
        <div className="min-w-0">
          <p className="text-titulo-cartao">{titulo ?? TITULO_PADRAO[resultado]}</p>
          <div className="mt-1 text-corpo">{children}</div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {certo ? (
          <BotaoTatil largura="total" onClick={onContinuar}>
            Continuar
          </BotaoTatil>
        ) : (
          <>
            <BotaoTatil largura="total" onClick={onTentarDeNovo}>
              Tentar de novo
            </BotaoTatil>
            <BotaoTatil largura="total" variante="secundario" onClick={onExplicarErro}>
              Explicar meu erro
            </BotaoTatil>
          </>
        )}
      </div>
    </motion.section>
  );
}
