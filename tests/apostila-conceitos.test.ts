// @vitest-environment jsdom
/**
 * Janelas de explicação das ideias (conceitos-log.js e conceitos-py.js, pedido do Kaio em 26/10/2026): cada módulo
 * escrito tem uma janela por conceito, na ordem de materias.js; todo código de exemplo roda de verdade no Python e
 * mostra a saída escrita; cada desenho tem um modelo que a planta sabe montar; e cada teste está bem formado e se
 * resolve de primeira no motor. Também confere que licoes-info.js está em dia com as lições.
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { beforeAll, describe, expect, it } from "vitest";

import { conferir, type Item, type Motor, resolver } from "./apostila-itens";

type Fig = { t: string; linhas?: string[]; saida?: string; [k: string]: unknown };
type Ideia = {
  r: string;
  g: string;
  ideia: string;
  fig: Fig;
  dia: { titulo: string; texto: string };
  codigo?: { linhas: string[]; saida: string };
  teste: Item;
};
type Janela = {
  Motor: Motor;
  MATERIAS: { sigla: string; modulos: { codigo: string; conceitos: string[] }[] }[];
  CONCEITOS: Record<string, { evitar: { errado: object; certo: object }; ideias: Ideia[] }>;
  Planta: {
    glifo: (g: string) => string;
    montar: (el: HTMLElement, f: Fig) => HTMLElement;
    GLIFOS: string[];
  };
  LICOES_INFO: Record<string, { conceitos: number; python: number }>;
};

const PASTA = join(process.cwd(), "apostila");
const carregar = (arq: string) => new Function(readFileSync(join(PASTA, arq), "utf-8"))();
let W: Janela;

beforeAll(() => {
  for (const arq of [
    "licoes/motor.js",
    "materias.js",
    "planta.js",
    "conceitos-log.js",
    "conceitos-py.js",
    "licoes-info.js",
  ])
    carregar(arq);
  W = window as unknown as Janela;
});

const modulos = () =>
  Object.fromEntries(W.MATERIAS.flatMap((m) => m.modulos.map((d) => [d.codigo, d])));

describe("janelas das ideias", () => {
  it("LOG e PY têm uma janela por conceito, em todos os módulos", () => {
    const M = modulos();
    const alvo = W.MATERIAS.filter((m) => ["LOG", "PY"].includes(m.sigla)).flatMap((m) =>
      m.modulos.map((d) => d.codigo),
    );
    expect(alvo.filter((c) => !W.CONCEITOS[c])).toEqual([]);
    for (const [cod, c] of Object.entries(W.CONCEITOS)) {
      expect(M[cod], cod).toBeTruthy();
      expect(c.ideias.length, cod).toBe(M[cod]!.conceitos.length);
      expect(c.evitar.errado && c.evitar.certo, cod).toBeTruthy();
    }
    expect(
      Object.values(W.CONCEITOS).reduce((a, c) => a + c.ideias.length, 0),
    ).toBeGreaterThanOrEqual(117);
  });

  it("cada ideia tem resumo, desenho conhecido, dia a dia e teste bem formado", () => {
    for (const [cod, c] of Object.entries(W.CONCEITOS))
      c.ideias.forEach((d, i) => {
        const k = `${cod}.${i + 1}`;
        for (const campo of [d.r, d.ideia, d.dia.titulo, d.dia.texto])
          expect(String(campo).trim(), k).not.toBe("");
        expect(W.Planta.GLIFOS, `${k}: glifo`).toContain(d.g);
        expect(
          ["fluxo", "decisao", "codigo", "tabela", "memoria", "lista", "comparar"],
          `${k}: figura`,
        ).toContain(d.fig.t);
        expect(JSON.stringify(d), `${k}: sem emoji`).not.toMatch(/\p{Extended_Pictographic}/u);
        conferir(k, d.teste);
      });
  });

  it("os desenhos montam sem erro e andam por etapas", () => {
    for (const [cod, c] of Object.entries(W.CONCEITOS))
      c.ideias.forEach((d, i) => {
        const el = document.createElement("div");
        document.body.replaceChildren(el);
        W.Planta.montar(el, d.fig);
        expect(el.querySelector(".pl-palco")!.innerHTML.trim(), `${cod}.${i + 1}`).not.toBe("");
        const passo = el.querySelector<HTMLButtonElement>('[data-pl="passo"]');
        if (passo) {
          passo.click();
          expect(el.querySelector(".pl-nota b")!.textContent, `${cod}.${i + 1}`).toMatch(/^2\//);
        }
      });
  });

  it("todo teste se resolve de primeira no motor", () => {
    const falhas: string[] = [];
    for (const [cod, c] of Object.entries(W.CONCEITOS))
      c.ideias.forEach((d, i) => {
        if (resolver(W.Motor, d.teste) !== "primeira") falhas.push(`${cod}.${i + 1}`);
      });
    expect(falhas).toEqual([]);
  });

  it("todo código de exemplo roda no Python e mostra a saída escrita", () => {
    const pasta = mkdtempSync(join(tmpdir(), "conceitos-"));
    const roda = (linhas: string[]) => {
      try {
        return execFileSync("python3", ["-I", "-c", linhas.join("\n")], {
          cwd: pasta,
          encoding: "utf8",
          stdio: ["pipe", "pipe", "pipe"],
        }).replace(/\n$/, "");
      } catch (e) {
        return (
          "ERRO " +
          String((e as { stderr?: string }).stderr)
            .trim()
            .split("\n")
            .pop()
        );
      }
    };
    const falhas: string[] = [];
    for (const [cod, c] of Object.entries(W.CONCEITOS))
      c.ideias.forEach((d, i) => {
        if (d.codigo && roda(d.codigo.linhas) !== d.codigo.saida)
          falhas.push(`${cod}.${i + 1} código`);
        const f = d.fig;
        if (
          f.t === "codigo" &&
          f.saida != null &&
          f.linhas &&
          !/^(>>>|Traceback)/.test(f.linhas[0]!) &&
          roda(f.linhas) !== f.saida
        )
          falhas.push(`${cod}.${i + 1} desenho`);
      });
    expect(falhas).toEqual([]);
  }, 120_000);

  it("licoes-info.js está em dia com as lições ilustradas", () => {
    const antes = readFileSync(join(PASTA, "licoes-info.js"), "utf-8");
    execFileSync("python3", ["-I", join(process.cwd(), "ferramentas/gerar_licoes_info.py")], {
      stdio: "pipe",
    });
    expect(readFileSync(join(PASTA, "licoes-info.js"), "utf-8")).toBe(antes);
  });
});
