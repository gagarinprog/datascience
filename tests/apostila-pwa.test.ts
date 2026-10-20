// @vitest-environment node
/**
 * A apostila publicada no GitHub Pages funciona offline pelo service worker (apostila/sw.js).
 * Todo arquivo da pasta precisa estar na lista ARQUIVOS, senão some no modo offline (scripts .py ficam de fora: não rodam no navegador).
 */
import { readdirSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

import { describe, expect, it } from "vitest";

const PASTA = join(process.cwd(), "apostila");
const FORA = new Set(["sw.js"]);

function listar(pasta: string): string[] {
  return readdirSync(pasta, { withFileTypes: true }).flatMap((item) => {
    const caminho = join(pasta, item.name);
    return item.isDirectory() ? listar(caminho) : [caminho];
  });
}

const arquivos = listar(PASTA)
  .map((caminho) => relative(PASTA, caminho).split(sep).join("/"))
  .filter((nome) => !FORA.has(nome) && !nome.endsWith(".py"));

const sw = readFileSync(join(PASTA, "sw.js"), "utf-8");
const bloco = sw.match(/const ARQUIVOS = \[([\s\S]*?)\];/)?.[1] ?? "";
const naLista = new Set(Array.from(bloco.matchAll(/"\.\/([^"]*)"/g), (achado) => achado[1] ?? ""));

describe("apostila instalável e offline", () => {
  it("lista no service worker todos os arquivos da pasta", () => {
    const faltando = arquivos.filter((nome) => !naLista.has(nome));
    expect(faltando).toEqual([]);
  });

  it("não lista arquivos que não existem", () => {
    const existentes = new Set(arquivos);
    const sobrando = [...naLista].filter((nome) => nome !== "" && !existentes.has(nome));
    expect(sobrando).toEqual([]);
  });

  it("tem manifesto com ícones de 192 e 512 px", () => {
    const manifesto = JSON.parse(readFileSync(join(PASTA, "manifest.webmanifest"), "utf-8")) as {
      icons: { sizes: string }[];
      display: string;
    };
    const tamanhos = manifesto.icons.map((icone) => icone.sizes);
    expect(tamanhos).toContain("192x192");
    expect(tamanhos).toContain("512x512");
    expect(manifesto.display).toBe("standalone");
  });

  it("registra o service worker na página inicial e em cada lição", () => {
    const paginas = arquivos.filter((nome) => nome.endsWith(".html"));
    const sem = paginas.filter(
      (nome) => !readFileSync(join(PASTA, nome), "utf-8").includes("serviceWorker.register"),
    );
    expect(sem).toEqual([]);
  });
});
