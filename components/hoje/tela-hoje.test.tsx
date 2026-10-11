import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { semanaDeEstudo } from "@/lib/datas";
import type { Repositorio, SessaoDeHoje } from "@/lib/repositorio";

import { TelaHoje } from "./tela-hoje";

const AGORA = new Date(2026, 9, 11, 10, 0);

// Segunda (5/10) a sábado (10/10) estudados; domingo, hoje, ainda aberto.
const ESTUDADOS = [
  "2026-10-05",
  "2026-10-06",
  "2026-10-07",
  "2026-10-08",
  "2026-10-09",
  "2026-10-10",
];

const SESSAO: SessaoDeHoje = {
  sequenciaDias: 12,
  estudouHoje: false,
  semana: semanaDeEstudo(ESTUDADOS, AGORA),
  metaSemana: { cumpridos: 6, total: 7 },
  missao: {
    disciplina: "bd",
    rotulo: "SQL",
    conceito: "GROUP BY e HAVING",
    fraseDeMapa: "No fim, você vai saber filtrar grupos com HAVING.",
    minutos: 25,
    revisoes: 12,
    licaoId: "bd-group-by-having",
  },
  proximaAvaliacao: { disciplina: "bd", data: "2026-10-26" },
};

function repositorioCom(sessaoDeHoje: () => Promise<SessaoDeHoje>): Repositorio {
  return {
    sessaoDeHoje,
    cartasParaRevisar: async () => [],
    dominio: async () => [],
    registrarTentativa: async () => {},
    registrarSessao: async () => {},
  };
}

function renderizar(sessao: SessaoDeHoje = SESSAO) {
  return render(<TelaHoje repositorio={repositorioCom(async () => sessao)} agora={AGORA} />);
}

describe("TelaHoje", () => {
  it("mostra o dia, a sequência e a semana de segunda a domingo", async () => {
    const { container } = renderizar();

    expect(
      await screen.findByRole("heading", { level: 1, name: "Domingo, 11 out" }),
    ).toBeInTheDocument();
    expect(screen.getByText("12 dias")).toHaveClass("text-destaque");
    expect(screen.getByRole("progressbar", { name: "Meta da semana" })).toHaveAttribute(
      "aria-valuetext",
      "6 de 7 dias",
    );
    const dias = container.querySelectorAll("[data-cumprido]");
    expect(Array.from(dias, (dia) => dia.getAttribute("data-cumprido"))).toEqual([
      "true",
      "true",
      "true",
      "true",
      "true",
      "true",
      "false",
    ]);
    expect(dias[6]).toHaveAttribute("data-hoje", "true");
  });

  it("a corrente da sequência só acende quando hoje já teve estudo", async () => {
    const { container, unmount } = renderizar();
    await screen.findByRole("heading", { level: 1 });
    expect(container.querySelector("[data-aceso]")).toHaveAttribute("data-aceso", "false");
    unmount();

    const { container: depois } = renderizar({ ...SESSAO, estudouHoje: true, sequenciaDias: 13 });
    await screen.findByText("13 dias");
    expect(depois.querySelector("[data-aceso]")).toHaveAttribute("data-aceso", "true");
  });

  it("mostra a missão com o chip da disciplina e a frase de mapa", async () => {
    renderizar();

    expect(await screen.findByRole("heading", { level: 2, name: "Missão de hoje" })).toBeVisible();
    expect(screen.getByText("SQL · GROUP BY e HAVING")).toHaveClass("sinal-bd");
    expect(screen.getByText("No fim, você vai saber filtrar grupos com HAVING.")).toBeVisible();
    expect(screen.getByText("25 min · 12 revisões")).toBeVisible();
  });

  it("tem uma única ação principal: Começar sessão leva à lição", async () => {
    renderizar();

    const comecar = await screen.findByRole("link", { name: "Começar sessão" });
    expect(comecar).toHaveAttribute("href", "/licao/bd-group-by-having");
    expect(screen.getByRole("link", { name: "Só 10 minutos hoje" })).toHaveAttribute(
      "href",
      "/revisar",
    );
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("avisa a AP com os dias contados a partir de hoje", async () => {
    renderizar();
    expect(await screen.findByText("AP de Banco de Dados em 15 dias")).toBeVisible();
  });

  it("não mostra aviso sem AP marcada", async () => {
    renderizar({ ...SESSAO, proximaAvaliacao: null });

    await screen.findByRole("heading", { level: 1 });
    expect(screen.queryByText(/^AP de/)).not.toBeInTheDocument();
  });

  it("escreve no singular quando é um só", async () => {
    renderizar({
      ...SESSAO,
      sequenciaDias: 1,
      missao: { ...SESSAO.missao, revisoes: 1 },
    });

    expect(await screen.findByText("1 dia")).toBeVisible();
    expect(screen.getByText("25 min · 1 revisão")).toBeVisible();
  });

  it("mostra um esqueleto parado enquanto carrega", () => {
    render(<TelaHoje repositorio={repositorioCom(() => new Promise(() => {}))} agora={AGORA} />);

    expect(screen.getByText("Carregando o dia de hoje")).toBeInTheDocument();
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("explica o que fazer se os dados não carregam", async () => {
    render(
      <TelaHoje
        repositorio={repositorioCom(() => Promise.reject(new Error("falhou")))}
        agora={AGORA}
      />,
    );

    expect(await screen.findByRole("alert")).toHaveTextContent("Recarregue a página");
  });
});
