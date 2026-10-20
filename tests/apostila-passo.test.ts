// @vitest-environment node
/**
 * Os passo a passo do Centro de Dados (apostila/castelo/passos.js): um por módulo, e cada etapa só fala de
 * peças e de partes do código que existem. Roda os layouts em duas larguras (celular e computador).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { beforeAll, describe, expect, it } from "vitest";

type Etapa = {
  t: string;
  d: string;
  foco?: string;
  feitos?: string[];
  layout?: (W: number, H: number) => Record<string, Record<string, unknown>>;
};
type Def = {
  titulo: string;
  codigo?: { partes: { id: string; texto: string }[] };
  ordem?: { id: string }[];
  pecas: { id: string }[];
  altura?: (W: number) => number;
  passos: Etapa[];
};

const PASTA = join(process.cwd(), "apostila");
let PASSOS: Record<string, Def>;
let salas: { id: string }[];

beforeAll(() => {
  new Function(readFileSync(join(PASTA, "castelo", "salas.js"), "utf-8"))();
  new Function(readFileSync(join(PASTA, "castelo", "passos.js"), "utf-8"))();
  const g = globalThis as unknown as {
    CASTELO: { salas: { id: string }[] };
    PASSOS_LAB: Record<string, Def>;
  };
  salas = g.CASTELO.salas;
  PASSOS = g.PASSOS_LAB;
});

describe("passo a passo do Centro de Dados", () => {
  it("há um passo a passo para cada módulo", () => {
    expect(Object.keys(PASSOS).sort()).toEqual(salas.map((s) => s.id).sort());
  });

  it("cada etapa acende só partes do código que existem e mexe só peças que existem", () => {
    for (const [id, def] of Object.entries(PASSOS)) {
      const partes = new Set([
        ...(def.codigo?.partes ?? []).map((p) => p.id),
        ...(def.ordem ?? []).map((o) => o.id),
      ]);
      const pecas = new Set(def.pecas.map((p) => p.id));
      expect(def.passos.length, id).toBeGreaterThanOrEqual(5);
      for (const W of [330, 700]) {
        const H = def.altura ? def.altura(W) : 360;
        def.passos.forEach((p, k) => {
          if (p.foco) expect(partes.has(p.foco), `${id} etapa ${k}: foco ${p.foco}`).toBe(true);
          (p.feitos ?? []).forEach((f) =>
            expect(partes.has(f), `${id} etapa ${k}: feito ${f}`).toBe(true),
          );
          const l = p.layout ? p.layout(W, H) : {};
          for (const peca of Object.keys(l))
            expect(pecas.has(peca), `${id} etapa ${k}: peça ${peca}`).toBe(true);
          expect(p.t.length, `${id} etapa ${k}`).toBeGreaterThan(3);
        });
      }
    }
  });

  it("não cita produto nem caminho de fora do projeto", () => {
    const texto = readFileSync(join(PASTA, "castelo", "passos.js"), "utf-8").toLowerCase();
    expect(texto).not.toContain("apostila viva");
    expect(texto).not.toContain("apostila-viva");
  });
});
