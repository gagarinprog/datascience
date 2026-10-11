import type { Metadata } from "next";

import { TelaRevisar } from "@/components/revisar/tela-revisar";
import { TransicaoDeTela } from "@/components/transicao/transicao-de-tela";
import { TelaDeAba } from "@/components/ui/tela-de-aba";

export const metadata: Metadata = {
  title: "Revisar",
};

export default function PaginaRevisar() {
  return (
    <TransicaoDeTela>
      <TelaDeAba titulo="Revisar">
        <TelaRevisar />
      </TelaDeAba>
    </TransicaoDeTela>
  );
}
