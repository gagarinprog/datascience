import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Chip } from "./chip";

describe("Chip", () => {
  it("leva a cor da disciplina", () => {
    render(<Chip disciplina="bd">Banco de Dados</Chip>);
    const chip = screen.getByText("Banco de Dados");

    expect(chip).toHaveClass("sinal-bd");
    expect(chip).toHaveClass("text-(--sinal)");
  });

  it("sem disciplina é neutro", () => {
    render(<Chip>Sem disciplina</Chip>);
    expect(screen.getByText("Sem disciplina")).toHaveClass("text-texto-2");
  });

  it("com onClick vira botão de seleção", async () => {
    const aoEscolher = vi.fn();
    render(
      <Chip disciplina="gaal" selecionado={false} onClick={aoEscolher}>
        GAAL
      </Chip>,
    );
    const botao = screen.getByRole("button", { name: "GAAL" });

    await userEvent.click(botao);

    expect(botao).toHaveAttribute("aria-pressed", "false");
    expect(botao).toHaveClass("text-texto-2");
    expect(aoEscolher).toHaveBeenCalledOnce();
  });

  it("selecionado acende e tem alvo de toque de 44 px", () => {
    render(
      <Chip disciplina="gaal" selecionado onClick={() => {}}>
        GAAL
      </Chip>,
    );
    const botao = screen.getByRole("button", { name: "GAAL" });

    expect(botao).toHaveAttribute("aria-pressed", "true");
    expect(botao).toHaveClass("text-(--sinal)", "min-h-11");
  });
});
