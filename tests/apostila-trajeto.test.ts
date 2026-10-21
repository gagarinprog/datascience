// @vitest-environment jsdom
/**
 * Trajeto (apostila/trajeto.js): salvar tudo o que o Domínio guarda no aparelho num arquivo e carregar de volta,
 * com a conferência do arquivo antes de trocar qualquer coisa e o desfazer.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { beforeAll, beforeEach, describe, expect, it } from "vitest";

type Pacote = { app: string; versao: number; salvo_em: string; dados: Record<string, string> };
type Trajeto = {
  empacotar: () => Pacote;
  validar: (texto: string) => Pacote;
  resumo: (p: Pacote) => { modulos: number; licoes: number; revisoes: number; laboratorio: number };
  aplicar: (p: Pacote) => void;
  desfazer: () => boolean;
  temAnterior: () => boolean;
  nomeArquivo: (d: Date) => string;
};
let T: Trajeto;

beforeAll(() => {
  new Function(readFileSync(join(process.cwd(), "apostila", "trajeto.js"), "utf-8"))();
  T = (window as unknown as { Trajeto: Trajeto }).Trajeto;
});

const progresso = (n: number) =>
  JSON.stringify({
    modulos: Object.fromEntries(
      Array.from({ length: n }, (_, i) => [
        `LOG.0${i + 1}`,
        { estado: "dominado", em: "2026-10-21" },
      ]),
    ),
  });

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem("dominio:progresso:v1", progresso(2));
  localStorage.setItem("dominio:licao:LOG.01", '["c1","c2"]');
  localStorage.setItem("dominio:revisao:v1", '{"a":{},"b":{},"c":{}}');
  localStorage.setItem("dominio:castelo:v1", '{"feitas":4}');
  localStorage.setItem("outro-site", "não entra");
});

describe("trajeto", () => {
  it("empacota só o que é do Domínio e resume em números que a pessoa reconhece", () => {
    const p = T.empacotar();
    expect(p.app).toBe("dominio");
    expect(Object.keys(p.dados)).not.toContain("outro-site");
    expect(T.resumo(p)).toEqual({
      modulos: 2,
      licoes: 1,
      revisoes: 3,
      laboratorio: 4,
      salvo_em: p.salvo_em,
    });
    expect(T.nomeArquivo(new Date(2026, 9, 21))).toBe("dominio-trajeto-2026-10-21.json");
  });

  it("recusa arquivo que não é trajeto, vazio ou de versão mais nova", () => {
    expect(() => T.validar("isto não é json")).toThrow(/não é um trajeto/);
    expect(() => T.validar(JSON.stringify({ app: "outro", versao: 1, dados: {} }))).toThrow(
      /não é um trajeto/,
    );
    expect(() =>
      T.validar(JSON.stringify({ app: "dominio", versao: 1, dados: { "x:y": "1" } })),
    ).toThrow(/vazio/);
    expect(() =>
      T.validar(JSON.stringify({ app: "dominio", versao: 99, dados: { "dominio:a": "1" } })),
    ).toThrow(/mais nova/);
  });

  it("troca o trajeto pelo do arquivo e o desfazer traz o de antes", () => {
    const deOutroAparelho = T.validar(
      JSON.stringify({
        app: "dominio",
        versao: 1,
        salvo_em: "2026-10-20T10:00:00Z",
        dados: { "dominio:progresso:v1": progresso(5), intruso: "x" },
      }),
    );
    expect(Object.keys(deOutroAparelho.dados)).toEqual(["dominio:progresso:v1"]);
    T.aplicar(deOutroAparelho);
    expect(T.resumo(T.empacotar()).modulos).toBe(5);
    expect(localStorage.getItem("dominio:licao:LOG.01")).toBeNull();
    expect(localStorage.getItem("outro-site")).toBe("não entra");
    expect(T.temAnterior()).toBe(true);
    expect(T.desfazer()).toBe(true);
    expect(T.resumo(T.empacotar())).toMatchObject({
      modulos: 2,
      licoes: 1,
      revisoes: 3,
      laboratorio: 4,
    });
    expect(T.temAnterior()).toBe(false);
  });
});
