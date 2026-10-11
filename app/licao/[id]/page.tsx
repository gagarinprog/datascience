import type { Metadata } from "next";

import { PlayerDesafio } from "@/components/licao/player-desafio";
import { TransicaoDeTela } from "@/components/transicao/transicao-de-tela";
import { DESAFIO_GROUP_BY_HAVING } from "@/lib/conteudo/amostra";

export const metadata: Metadata = {
  title: "Lição",
};

// Provisória: só o desafio da lição é jogável até o player completo da Fase 2.
export default function PaginaLicao() {
  return (
    <TransicaoDeTela>
      <PlayerDesafio desafio={DESAFIO_GROUP_BY_HAVING} />
    </TransicaoDeTela>
  );
}
