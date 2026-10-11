import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { Carta, Repositorio } from "@/lib/repositorio";

import { TelaRevisar } from "./tela-revisar";

const CARTA: Carta = {
  itemId: "exemplo",
  estabilidade: null,
  dificuldade: null,
  ultimaRevisao: null,
  proximaRevisao: "2026-10-10T10:00:00.000Z",
  repeticoes: 0,
  lapsos: 0,
  estado: "novo",
};

function repositorioCom(cartas: Carta[]): Repositorio {
  return {
    sessaoDeHoje: async () => {
      throw new Error("não usado");
    },
    cartasParaRevisar: async () => cartas,
    dominio: async () => [],
    registrarTentativa: async () => {},
    registrarSessao: async () => {},
  };
}

describe("TelaRevisar", () => {
  it("conta as cartas esperando e oferece o desafio do dia", async () => {
    render(<TelaRevisar repositorio={repositorioCom([CARTA, CARTA, CARTA])} />);

    expect(await screen.findByText("3")).toHaveClass("text-destaque");
    expect(screen.getByText("cartas esperando revisão")).toBeVisible();
    expect(screen.getByRole("link", { name: "Fazer o desafio de hoje" })).toHaveAttribute(
      "href",
      "/licao/bd-group-by-having",
    );
  });

  it("sem cartas, convida para uma lição nova (DESIGN 7)", async () => {
    render(<TelaRevisar repositorio={repositorioCom([])} />);

    expect(
      await screen.findByText("Nenhuma revisão para hoje. Que tal uma lição nova?"),
    ).toBeVisible();
  });
});
