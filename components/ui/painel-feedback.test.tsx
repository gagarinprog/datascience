import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { PainelFeedback } from "./painel-feedback";

describe("PainelFeedback", () => {
  it("certo: anuncia o resultado e oferece só Continuar", async () => {
    const aoContinuar = vi.fn();
    render(
      <PainelFeedback resultado="certo" onContinuar={aoContinuar}>
        COUNT(*) contou cada grupo.
      </PainelFeedback>,
    );

    expect(screen.getByRole("status")).toHaveTextContent("Certo");
    expect(screen.getByRole("status")).toHaveTextContent("COUNT(*) contou cada grupo.");
    expect(screen.queryByRole("button", { name: "Explicar meu erro" })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Continuar" }));
    expect(aoContinuar).toHaveBeenCalledOnce();
  });

  it("errado: mostra o erro exato, Tentar de novo e Explicar meu erro", async () => {
    const aoTentar = vi.fn();
    const aoExplicar = vi.fn();
    render(
      <PainelFeedback resultado="errado" onTentarDeNovo={aoTentar} onExplicarErro={aoExplicar}>
        Filtro depois de agrupar vai no HAVING.
      </PainelFeedback>,
    );

    expect(screen.getByRole("status")).toHaveTextContent("Ainda não");
    expect(screen.getByRole("status")).toHaveTextContent("Filtro depois de agrupar vai no HAVING.");
    expect(screen.queryByRole("button", { name: "Continuar" })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Tentar de novo" }));
    await userEvent.click(screen.getByRole("button", { name: "Explicar meu erro" }));
    expect(aoTentar).toHaveBeenCalledOnce();
    expect(aoExplicar).toHaveBeenCalledOnce();
  });

  it("usa a cor do resultado na borda", () => {
    const { container, rerender } = render(<PainelFeedback resultado="certo">Ok.</PainelFeedback>);
    expect(container.firstElementChild).toHaveClass("border-acerto");

    rerender(<PainelFeedback resultado="errado">Ok.</PainelFeedback>);
    expect(container.firstElementChild).toHaveClass("border-erro");
  });

  it("aceita um título próprio", () => {
    render(
      <PainelFeedback resultado="certo" titulo="Exatamente isso">
        Ok.
      </PainelFeedback>,
    );
    expect(screen.getByRole("status")).toHaveTextContent("Exatamente isso");
  });
});
