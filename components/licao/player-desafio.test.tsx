import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { DESAFIO_GROUP_BY_HAVING } from "@/lib/conteudo/amostra";
import type { Repositorio } from "@/lib/repositorio";

import { PlayerDesafio } from "./player-desafio";

function repositorioQueGuarda() {
  const registrarTentativa = vi.fn(async () => {});
  const repositorio: Repositorio = {
    sessaoDeHoje: async () => {
      throw new Error("não usado");
    },
    cartasParaRevisar: async () => [],
    dominio: async () => [],
    registrarTentativa,
    registrarSessao: async () => {},
  };
  return { repositorio, registrarTentativa };
}

describe("PlayerDesafio", () => {
  it("Verificar fica desabilitado até escolher uma resposta", async () => {
    render(
      <PlayerDesafio
        desafio={DESAFIO_GROUP_BY_HAVING}
        repositorio={repositorioQueGuarda().repositorio}
      />,
    );
    const verificar = screen.getByRole("button", { name: "Verificar" });

    expect(verificar).toBeDisabled();
    await userEvent.click(screen.getByRole("button", { name: "Certo" }));
    expect(verificar).toBeEnabled();
  });

  it("acerto: feedback com o porquê, progresso anda e a tentativa fica guardada", async () => {
    const { repositorio, registrarTentativa } = repositorioQueGuarda();
    render(<PlayerDesafio desafio={DESAFIO_GROUP_BY_HAVING} repositorio={repositorio} />);

    await userEvent.click(screen.getByRole("button", { name: "Errado" }));
    await userEvent.click(screen.getByRole("button", { name: "Verificar" }));

    expect(screen.getByRole("status")).toHaveTextContent("Certo");
    expect(screen.getByRole("status")).toHaveTextContent("Filtro de grupo vai no HAVING.");
    expect(screen.getByRole("progressbar", { name: "Progresso da lição" })).toHaveAttribute(
      "aria-valuenow",
      "1",
    );
    expect(registrarTentativa).toHaveBeenCalledWith({
      itemId: "bd.group-by-having.desafio",
      resposta: "errado",
      correta: true,
      erroTipo: null,
    });
  });

  it("erro: mostra o gabarito, guarda o tipo de erro e segue com Continuar", async () => {
    const { repositorio, registrarTentativa } = repositorioQueGuarda();
    render(<PlayerDesafio desafio={DESAFIO_GROUP_BY_HAVING} repositorio={repositorio} />);

    await userEvent.click(screen.getByRole("button", { name: "Certo" }));
    await userEvent.click(screen.getByRole("button", { name: "Verificar" }));

    expect(screen.getByRole("status")).toHaveTextContent("Ainda não");
    expect(screen.getByRole("status")).toHaveTextContent("O gabarito é Errado.");
    expect(screen.queryByRole("button", { name: "Tentar de novo" })).not.toBeInTheDocument();
    expect(registrarTentativa).toHaveBeenCalledWith(
      expect.objectContaining({ correta: false, erroTipo: "having_vs_where" }),
    );

    await userEvent.click(screen.getByRole("button", { name: "Continuar" }));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Agora você já sabe onde mora a pegadinha.",
    );
    expect(screen.getByRole("link", { name: "Voltar para Hoje" })).toHaveAttribute("href", "/");
  });
});
