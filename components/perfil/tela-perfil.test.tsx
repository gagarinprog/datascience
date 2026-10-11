import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { semanaDeEstudo } from "@/lib/datas";
import type { DominioDoConceito, Repositorio, SessaoDeHoje } from "@/lib/repositorio";

import { TelaPerfil } from "./tela-perfil";

const AGORA = new Date(2026, 9, 11, 10, 0);
const QUANDO = AGORA.toISOString();

const SESSAO: SessaoDeHoje = {
  sequenciaDias: 12,
  estudouHoje: false,
  semana: semanaDeEstudo(["2026-10-05", "2026-10-06"], AGORA),
  metaSemana: { cumpridos: 2, total: 7 },
  missao: {
    disciplina: "bd",
    rotulo: "SQL",
    conceito: "GROUP BY e HAVING",
    fraseDeMapa: "",
    minutos: 25,
    revisoes: 12,
    licaoId: "bd-group-by-having",
  },
  proximaAvaliacao: null,
};

const DOMINIO: DominioDoConceito[] = [
  { conceitoId: "bd.select", estado: "dominado", atualizadoEm: QUANDO },
  { conceitoId: "bd.where", estado: "praticado", atualizadoEm: QUANDO },
  { conceitoId: "bd.order-by", estado: "praticado", atualizadoEm: QUANDO },
  { conceitoId: "bd.having", estado: "bloqueado", atualizadoEm: QUANDO },
];

const REPOSITORIO: Repositorio = {
  sessaoDeHoje: async () => SESSAO,
  cartasParaRevisar: async () => [],
  dominio: async () => DOMINIO,
  registrarTentativa: async () => {},
  registrarSessao: async () => {},
};

describe("TelaPerfil", () => {
  it("resume sequência, semana e domínio por estado", async () => {
    render(<TelaPerfil repositorio={REPOSITORIO} />);

    expect(await screen.findByText("12 dias")).toBeVisible();
    expect(screen.getByRole("progressbar", { name: "Meta da semana" })).toHaveAttribute(
      "aria-valuetext",
      "2 de 7 dias",
    );
    expect(screen.getByText("Dominado").nextElementSibling).toHaveTextContent("1 conceito");
    expect(screen.getByText("Praticado").nextElementSibling).toHaveTextContent("2 conceitos");
    expect(screen.queryByText("Disponível")).not.toBeInTheDocument();
  });
});
