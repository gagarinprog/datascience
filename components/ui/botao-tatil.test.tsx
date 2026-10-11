import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { BotaoTatil } from "./botao-tatil";

describe("BotaoTatil", () => {
  it("é do tipo button por padrão, para não enviar formulário sem querer", () => {
    render(<BotaoTatil>Começar sessão</BotaoTatil>);
    expect(screen.getByRole("button", { name: "Começar sessão" })).toHaveAttribute(
      "type",
      "button",
    );
  });

  it("chama onClick ao ser clicado", async () => {
    const aoClicar = vi.fn();
    render(<BotaoTatil onClick={aoClicar}>Verificar</BotaoTatil>);

    await userEvent.click(screen.getByRole("button", { name: "Verificar" }));

    expect(aoClicar).toHaveBeenCalledOnce();
  });

  it("desabilitado não responde ao clique", async () => {
    const aoClicar = vi.fn();
    render(
      <BotaoTatil disabled onClick={aoClicar}>
        Verificar
      </BotaoTatil>,
    );
    const botao = screen.getByRole("button", { name: "Verificar" });

    await userEvent.click(botao);

    expect(botao).toBeDisabled();
    expect(aoClicar).not.toHaveBeenCalled();
  });

  it("marca o visual pressionado quando pedido", () => {
    render(<BotaoTatil pressionado>Continuar</BotaoTatil>);
    expect(screen.getByRole("button")).toHaveAttribute("data-pressionado", "true");
  });

  it("usa a base escura de cada variante", () => {
    render(
      <>
        <BotaoTatil>Primário</BotaoTatil>
        <BotaoTatil variante="secundario">Secundário</BotaoTatil>
        <BotaoTatil variante="perigo">Perigo</BotaoTatil>
      </>,
    );

    expect(screen.getByRole("button", { name: "Primário" }).className).toContain(
      "var(--color-corrente-base)",
    );
    expect(screen.getByRole("button", { name: "Secundário" }).className).toContain(
      "var(--color-trilha-apagada)",
    );
    expect(screen.getByRole("button", { name: "Perigo" }).className).toContain(
      "var(--color-erro-base)",
    );
  });

  it("mantém o tamanho do texto junto com a cor", () => {
    render(<BotaoTatil variante="secundario">Explicar meu erro</BotaoTatil>);
    const classes = screen.getByRole("button").className.split(" ");

    expect(classes).toContain("text-corpo");
    expect(classes).toContain("text-texto");
  });
});
