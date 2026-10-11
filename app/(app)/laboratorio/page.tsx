import type { Metadata } from "next";
import Link from "next/link";

import { TabelasApostila } from "@/components/laboratorio/tabelas-apostila";
import { IR_FUNDO, TransicaoDeTela } from "@/components/transicao/transicao-de-tela";
import { estiloBotaoTatil } from "@/components/ui/botao-tatil";
import { TelaDeAba } from "@/components/ui/tela-de-aba";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Laboratório",
};

// O editor de SQL (DESIGN 6.5) chega na Fase 3; por enquanto, as tabelas para consulta.
export default function PaginaLaboratorio() {
  return (
    <TransicaoDeTela>
      <TelaDeAba titulo="Laboratório">
        <p className="mt-3 max-w-[64ch] text-texto-2">
          As tabelas da Apostila Viva, que todo exercício de SQL usa. O editor para rodar consultas
          chega em breve.
        </p>
        <TabelasApostila />
        <Link
          href="/licao/bd-group-by-having"
          transitionTypes={IR_FUNDO}
          className={cn(estiloBotaoTatil({ largura: "total" }), "mt-8")}
        >
          Fazer o desafio de SQL
        </Link>
      </TelaDeAba>
    </TransicaoDeTela>
  );
}
