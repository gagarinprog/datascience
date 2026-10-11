import type { Metadata } from "next";

import { TransicaoDeTela } from "@/components/transicao/transicao-de-tela";
import { TrilhaPrevia } from "@/components/trilha/trilha-previa";
import { TelaDeAba } from "@/components/ui/tela-de-aba";

export const metadata: Metadata = {
  title: "Trilha",
};

export default function PaginaTrilha() {
  return (
    <TransicaoDeTela>
      <TelaDeAba titulo="Trilha">
        <TrilhaPrevia />
      </TelaDeAba>
    </TransicaoDeTela>
  );
}
