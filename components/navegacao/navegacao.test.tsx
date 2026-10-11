import { render, screen, within } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { describe, expect, it, vi } from "vitest";

import { destinoAtivo, Navegacao } from "./navegacao";

vi.mock("next/navigation", () => ({ usePathname: vi.fn() }));

describe("Navegacao", () => {
  it("tem os 5 destinos, na ordem do DESIGN 6.1", () => {
    vi.mocked(usePathname).mockReturnValue("/");
    render(<Navegacao />);
    const navegacao = screen.getByRole("navigation", { name: "Principal" });

    expect(
      within(navegacao)
        .getAllByRole("link")
        .map((link) => link.getAttribute("href")),
    ).toEqual(["/", "/trilha", "/revisar", "/laboratorio", "/perfil"]);
    for (const nome of ["Hoje", "Trilha", "Revisar", "Laboratório", "Eu"]) {
      expect(within(navegacao).getByRole("link", { name: nome })).toBeInTheDocument();
    }
  });

  it("marca só a página atual", () => {
    vi.mocked(usePathname).mockReturnValue("/revisar");
    render(<Navegacao />);

    expect(screen.getByRole("link", { name: "Revisar" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Hoje" })).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("link", { name: "Trilha" })).not.toHaveAttribute("aria-current");
  });

  it("todo destino é um alvo de toque de pelo menos 44 px", () => {
    vi.mocked(usePathname).mockReturnValue("/");
    render(<Navegacao />);

    for (const link of screen.getAllByRole("link")) {
      expect(link).toHaveClass("min-h-16");
    }
  });
});

describe("destinoAtivo", () => {
  it("acende Hoje só na página inicial", () => {
    expect(destinoAtivo("/", "/")).toBe(true);
    expect(destinoAtivo("/trilha", "/")).toBe(false);
  });

  it("acende o destino também nas subpáginas, sem confundir prefixos", () => {
    expect(destinoAtivo("/trilha", "/trilha")).toBe(true);
    expect(destinoAtivo("/trilha/bd", "/trilha")).toBe(true);
    expect(destinoAtivo("/trilhas", "/trilha")).toBe(false);
  });
});
