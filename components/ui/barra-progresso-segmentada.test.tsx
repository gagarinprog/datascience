import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BarraProgressoSegmentada } from "./barra-progresso-segmentada";

function segmentos(container: HTMLElement) {
  return Array.from(container.querySelectorAll("[data-cheio]"), (segmento) =>
    segmento.getAttribute("data-cheio"),
  );
}

describe("BarraProgressoSegmentada", () => {
  it("informa o progresso para leitores de tela", () => {
    render(
      <BarraProgressoSegmentada
        total={7}
        concluidos={3}
        disciplina="bd"
        rotulo="Progresso da lição"
      />,
    );
    const barra = screen.getByRole("progressbar", { name: "Progresso da lição" });

    expect(barra).toHaveAttribute("aria-valuemin", "0");
    expect(barra).toHaveAttribute("aria-valuemax", "7");
    expect(barra).toHaveAttribute("aria-valuenow", "3");
    expect(barra).toHaveAttribute("aria-valuetext", "3 de 7");
  });

  it("desenha um segmento por passo, os cheios primeiro", () => {
    const { container } = render(
      <BarraProgressoSegmentada total={7} concluidos={3} rotulo="Progresso" />,
    );

    expect(segmentos(container)).toEqual([
      "true",
      "true",
      "true",
      "false",
      "false",
      "false",
      "false",
    ]);
  });

  it("não passa dos limites com valores fora da faixa", () => {
    const { rerender } = render(
      <BarraProgressoSegmentada total={5} concluidos={9} rotulo="Progresso" />,
    );
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "5");

    rerender(<BarraProgressoSegmentada total={5} concluidos={-2} rotulo="Progresso" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  });

  it("usa a cor da disciplina e, sem ela, a corrente", () => {
    const { rerender } = render(
      <BarraProgressoSegmentada total={3} concluidos={1} disciplina="bd" rotulo="Progresso" />,
    );
    expect(screen.getByRole("progressbar")).toHaveClass("sinal-bd");

    rerender(<BarraProgressoSegmentada total={3} concluidos={1} rotulo="Progresso" />);
    expect(screen.getByRole("progressbar")).toHaveClass("sinal-corrente");
  });
});
