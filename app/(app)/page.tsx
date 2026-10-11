import type { Metadata } from "next";

import { TelaHoje } from "@/components/hoje/tela-hoje";
import { TransicaoDeTela } from "@/components/transicao/transicao-de-tela";

export const metadata: Metadata = {
  title: "Hoje",
};

export default function PaginaHoje() {
  return (
    <TransicaoDeTela>
      <TelaHoje />
    </TransicaoDeTela>
  );
}
