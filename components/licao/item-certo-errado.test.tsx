import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ItemCertoErrado } from "./item-certo-errado";

describe("ItemCertoErrado", () => {
  it("tem os dois botões grandes e marca a escolha", async () => {
    const aoEscolher = vi.fn();
    const { rerender } = render(<ItemCertoErrado escolha={null} onEscolher={aoEscolher} />);

    await userEvent.click(screen.getByRole("button", { name: "Errado" }));
    expect(aoEscolher).toHaveBeenCalledWith("errado");

    rerender(<ItemCertoErrado escolha="errado" onEscolher={aoEscolher} />);
    expect(screen.getByRole("button", { name: "Errado" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Certo" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "Certo" })).toHaveClass("min-h-16");
  });

  it("depois de verificar, trava e mostra o gabarito; a escolha errada fica marcada como erro", () => {
    render(<ItemCertoErrado escolha="certo" onEscolher={() => {}} gabarito="errado" />);

    const gabarito = screen.getByRole("button", { name: "Errado, gabarito" });
    const escolhida = screen.getByRole("button", { name: "Certo, sua resposta" });

    expect(gabarito).toBeDisabled();
    expect(gabarito).toHaveClass("border-acerto");
    expect(escolhida).toBeDisabled();
    expect(escolhida).toHaveClass("border-erro");
  });
});
