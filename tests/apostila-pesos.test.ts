// @vitest-environment jsdom
/**
 * Pesos na formação de cientista de dados (pedido do Kaio em 27/10/2026): cada matéria vale uma parte, as 16 somam
 * 100%, cada uma explica o porquê, e os módulos dividem o peso da matéria entre si (gerados por tutor/gerar_percurso.py).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { beforeAll, describe, expect, it } from "vitest";

type Materia = {
  sigla: string;
  peso: number;
  peso_porque: string;
  modulos: { codigo: string; peso: number; virada?: boolean }[];
};
let MATERIAS: Materia[];

beforeAll(() => {
  new Function(readFileSync(join(process.cwd(), "apostila", "materias.js"), "utf-8"))();
  MATERIAS = (window as unknown as { MATERIAS: Materia[] }).MATERIAS;
});

describe("pesos da formação", () => {
  it("as matérias somam 100% e cada uma diz por quê", () => {
    expect(MATERIAS).toHaveLength(16);
    expect(MATERIAS.reduce((a, m) => a + m.peso, 0)).toBe(100);
    for (const m of MATERIAS) {
      expect(m.peso, m.sigla).toBeGreaterThan(0);
      expect(m.peso_porque.length, m.sigla).toBeGreaterThan(40);
    }
  });

  it("os módulos de cada matéria somam o peso dela", () => {
    for (const m of MATERIAS) {
      const soma = m.modulos.reduce((a, x) => a + x.peso, 0);
      expect(Math.abs(soma - m.peso), m.sigla).toBeLessThan(0.01);
      for (const x of m.modulos) expect(x.peso, x.codigo).toBeGreaterThan(0);
    }
  });

  it("o total de todos os módulos fecha em 100%", () => {
    const total = MATERIAS.reduce((a, m) => a + m.modulos.reduce((b, x) => b + x.peso, 0), 0);
    expect(Math.abs(total - 100)).toBeLessThan(0.05);
  });
});
