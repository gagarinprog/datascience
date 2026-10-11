import { UserRound } from "lucide-react";
import type { Metadata } from "next";

import { EstadoVazio } from "@/components/ui/estado-vazio";

export const metadata: Metadata = {
  title: "Eu",
};

export default function PaginaPerfil() {
  return (
    <EstadoVazio
      titulo="Eu"
      mensagem="Seu progresso aparece aqui."
      Icone={UserRound}
      acao={{ href: "/", rotulo: "Ir para a missão de hoje" }}
    >
      Sequência, domínio por disciplina e o diário de 3 linhas, conforme você estuda.
    </EstadoVazio>
  );
}
