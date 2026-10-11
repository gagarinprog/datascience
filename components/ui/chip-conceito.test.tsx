import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ChipConceito, ESTADOS_CONCEITO, NOME_ESTADO } from "./chip-conceito";

describe("ChipConceito", () => {
  it.each(ESTADOS_CONCEITO)("anuncia o estado %s junto com o nome", (estado) => {
    render(<ChipConceito nome="GROUP BY" estado={estado} disciplina="bd" onClick={() => {}} />);

    expect(
      screen.getByRole("button", { name: `GROUP BY, ${NOME_ESTADO[estado].toLowerCase()}` }),
    ).toHaveAttribute("data-estado", estado);
  });

  it("cada um dos 6 estados tem um visual diferente", () => {
    const visuais = ESTADOS_CONCEITO.map((estado) => {
      const { container, unmount } = render(
        <ChipConceito nome="GROUP BY" estado={estado} disciplina="bd" />,
      );
      const html = container.innerHTML.replace(/data-estado="[a-z]+"/, "");
      unmount();
      return html;
    });

    expect(new Set(visuais).size).toBe(ESTADOS_CONCEITO.length);
  });

  it("só dominado e retido brilham; retido com anel duplo", () => {
    const { container, rerender } = render(
      <ChipConceito nome="JOIN" estado="praticado" disciplina="bd" />,
    );
    const chip = () => container.firstElementChild;
    expect(chip()).not.toHaveClass("brilho");

    rerender(<ChipConceito nome="JOIN" estado="dominado" disciplina="bd" />);
    expect(chip()).toHaveClass("brilho");

    rerender(<ChipConceito nome="JOIN" estado="retido" disciplina="bd" />);
    expect(chip()).toHaveClass("brilho-retido");
  });

  it("bloqueado fica apagado, sem a cor da disciplina", () => {
    const { container } = render(<ChipConceito nome="JOIN" estado="bloqueado" disciplina="bd" />);
    expect(container.firstElementChild).toHaveClass("border-trilha-apagada", "text-texto-2");
  });

  it("sem onClick não vira botão", () => {
    render(<ChipConceito nome="JOIN" estado="disponivel" disciplina="bd" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
