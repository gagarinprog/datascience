import { render, screen } from "@testing-library/react";
import { CircuitBoard } from "lucide-react";
import { describe, expect, it } from "vitest";

import { EstadoVazio } from "./estado-vazio";

describe("EstadoVazio", () => {
  it("diz o nome da tela, o que vai aparecer e o caminho para agir", () => {
    render(
      <EstadoVazio
        titulo="Trilha"
        mensagem="A trilha acende conforme você estuda."
        Icone={CircuitBoard}
        acao={{ href: "/", rotulo: "Ir para a missão de hoje" }}
      >
        Cada conceito que você pratica acende um chip.
      </EstadoVazio>,
    );

    expect(screen.getByRole("heading", { level: 1, name: "Trilha" })).toBeInTheDocument();
    expect(screen.getByText("A trilha acende conforme você estuda.")).toBeInTheDocument();
    expect(screen.getByText("Cada conceito que você pratica acende um chip.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ir para a missão de hoje" })).toHaveAttribute(
      "href",
      "/",
    );
  });
});
