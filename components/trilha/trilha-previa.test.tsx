import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { DominioDoConceito, Repositorio } from "@/lib/repositorio";

import { TrilhaPrevia } from "./trilha-previa";

const QUANDO = "2026-10-11T10:00:00.000Z";

const DOMINIO: DominioDoConceito[] = [
  { conceitoId: "bd.select", estado: "dominado", atualizadoEm: QUANDO },
  { conceitoId: "bd.where", estado: "praticado", atualizadoEm: QUANDO },
  { conceitoId: "bd.order-by", estado: "praticado", atualizadoEm: QUANDO },
  { conceitoId: "bd.group-by", estado: "disponivel", atualizadoEm: QUANDO },
  { conceitoId: "bd.having", estado: "bloqueado", atualizadoEm: QUANDO },
];

function repositorioCom(dominio: DominioDoConceito[]): Repositorio {
  return {
    sessaoDeHoje: async () => {
      throw new Error("não usado");
    },
    cartasParaRevisar: async () => [],
    dominio: async () => dominio,
    registrarTentativa: async () => {},
    registrarSessao: async () => {},
  };
}

describe("TrilhaPrevia", () => {
  it("mostra os conceitos de BD na ordem, com o estado de cada um", async () => {
    render(<TrilhaPrevia repositorio={repositorioCom(DOMINIO)} />);

    const trilha = await screen.findByRole("list", { name: "Trilha de Banco de Dados" });
    const estados = Array.from(trilha.querySelectorAll("[data-estado]"), (chip) =>
      chip.getAttribute("data-estado"),
    );

    // JOIN não está no domínio guardado: entra como bloqueado.
    expect(estados).toEqual([
      "dominado",
      "praticado",
      "praticado",
      "disponivel",
      "bloqueado",
      "bloqueado",
    ]);
    expect(screen.getByText(", disponível")).toBeInTheDocument();
  });

  it("a corrente acende o trecho depois de cada conceito praticado ou além", async () => {
    const { container } = render(<TrilhaPrevia repositorio={repositorioCom(DOMINIO)} />);
    await screen.findByRole("list", { name: "Trilha de Banco de Dados" });

    const trechos = Array.from(container.querySelectorAll("span[data-aceso]"), (trecho) =>
      trecho.getAttribute("data-aceso"),
    );
    expect(trechos).toEqual(["true", "true", "true", "false", "false"]);
  });

  it("aponta o próximo passo: o primeiro conceito disponível", async () => {
    render(<TrilhaPrevia repositorio={repositorioCom(DOMINIO)} />);

    expect(await screen.findByText("GROUP BY", { selector: "span.font-semibold" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Estudar agora" })).toHaveAttribute(
      "href",
      "/licao/bd-group-by-having",
    );
  });
});
