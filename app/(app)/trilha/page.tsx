import { CircuitBoard } from "lucide-react";
import type { Metadata } from "next";

import { EstadoVazio } from "@/components/ui/estado-vazio";

export const metadata: Metadata = {
  title: "Trilha",
};

// A Trilha de Circuito (DESIGN 6.2) chega na Fase 7.
export default function PaginaTrilha() {
  return (
    <EstadoVazio
      titulo="Trilha"
      mensagem="A trilha acende conforme você estuda."
      Icone={CircuitBoard}
      acao={{ href: "/", rotulo: "Ir para a missão de hoje" }}
    >
      Cada conceito que você pratica acende um chip, e a corrente passa para o próximo.
    </EstadoVazio>
  );
}
