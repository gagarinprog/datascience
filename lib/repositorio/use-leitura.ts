import { startTransition, useEffect, useState } from "react";

import { obterRepositorio } from "./index";
import type { Repositorio } from "./tipos";

export type Leitura<T> =
  { situacao: "carregando" } | { situacao: "erro" } | { situacao: "pronto"; dados: T };

/**
 * Lê do repositório no navegador. `ler` precisa ser estável (definida fora do
 * componente). A troca para "pronto" vai numa transição, para o conteúdo entrar
 * com a animação "revelar".
 */
export function useLeitura<T>(
  ler: (repositorio: Repositorio) => Promise<T>,
  repositorio?: Repositorio,
): Leitura<T> {
  const [leitura, setLeitura] = useState<Leitura<T>>({ situacao: "carregando" });

  useEffect(() => {
    let ativo = true;
    ler(repositorio ?? obterRepositorio())
      .then((dados) => {
        if (ativo) startTransition(() => setLeitura({ situacao: "pronto", dados }));
      })
      .catch(() => {
        if (ativo) setLeitura({ situacao: "erro" });
      });
    return () => {
      ativo = false;
    };
  }, [ler, repositorio]);

  return leitura;
}
