import type { Metadata } from "next";

import { TelaPerfil } from "@/components/perfil/tela-perfil";
import { TransicaoDeTela } from "@/components/transicao/transicao-de-tela";
import { TelaDeAba } from "@/components/ui/tela-de-aba";

export const metadata: Metadata = {
  title: "Eu",
};

export default function PaginaPerfil() {
  return (
    <TransicaoDeTela>
      <TelaDeAba titulo="Eu">
        <TelaPerfil />
      </TelaDeAba>
    </TransicaoDeTela>
  );
}
