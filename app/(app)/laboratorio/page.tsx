import { FlaskConical } from "lucide-react";
import type { Metadata } from "next";

import { EstadoVazio } from "@/components/ui/estado-vazio";

export const metadata: Metadata = {
  title: "Laboratório",
};

// O laboratório de SQL (DESIGN 6.5) chega na Fase 3.
export default function PaginaLaboratorio() {
  return (
    <EstadoVazio
      titulo="Laboratório"
      mensagem="Seu laboratório de SQL fica aqui."
      Icone={FlaskConical}
      acao={{ href: "/", rotulo: "Ir para a missão de hoje" }}
    >
      Você vai escrever consultas no banco da Apostila Viva e ver o resultado na hora, com as
      tabelas ao lado.
    </EstadoVazio>
  );
}
