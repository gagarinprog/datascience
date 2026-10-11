import { Layers } from "lucide-react";
import type { Metadata } from "next";

import { EstadoVazio } from "@/components/ui/estado-vazio";

export const metadata: Metadata = {
  title: "Revisar",
};

// A fila de revisão espaçada (DESIGN 6.6) chega na Fase 4.
export default function PaginaRevisar() {
  return (
    <EstadoVazio
      titulo="Revisar"
      mensagem="Suas revisões aparecem aqui."
      Icone={Layers}
      acao={{ href: "/", rotulo: "Ir para a missão de hoje" }}
    >
      Quando você termina uma lição, os itens dela viram cartas e voltam no dia certo, para você
      lembrar de memória.
    </EstadoVazio>
  );
}
