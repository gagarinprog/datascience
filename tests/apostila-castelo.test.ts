// @vitest-environment node
/**
 * Castelo de Dados (apostila/castelo): o laboratório que constrói um banco PostgreSQL de verdade, sala por sala.
 * Aqui cada solução oficial roda num PostgreSQL de verdade (PGlite, o mesmo que o navegador usa), na ordem das
 * salas, e precisa passar nas próprias verificações; os nivelamentos também. Assim um erro de digitação no
 * roteiro não chega ao aluno. O Python das salas 9 a 11 é conferido no navegador (teste de fluxo).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { PGlite } from "@electric-sql/pglite";
import { beforeAll, describe, expect, it } from "vitest";

type Verificacao = { consulta: string; esperado: unknown[][]; msg: string };
type Tarefa = {
  id: string;
  tipo: string;
  titulo: string;
  inicial?: string;
  solucao?: string;
  pista?: string;
  gabarito?: string;
  ordem?: boolean;
  tolerancia?: number;
  verificar?: Verificacao[];
  fonte?: string;
  executar?: string;
  testes?: string;
  opcoes?: string[];
  certa?: number;
};
type Sala = {
  id: string;
  bloco: string;
  nome: string;
  parte: string;
  ferramenta: { nome: string; url: string; licenca: string };
  slides: { titulo: string }[];
  tarefas: Tarefa[];
  estado: string;
  desfazer: string;
};
type Nivel = { id: string; libera: string; minimo: number; itens: Tarefa[] };
type Castelo = {
  blocos: { id: string; porque: string }[];
  salas: Sala[];
  niveis: Nivel[];
  sqlHistorico: string;
};
type Backup = {
  gerar: (consultar: (sql: string) => Promise<unknown[][]>) => Promise<{ sql: string }>;
  LIMPAR: string;
};
type Resultado = { ok: boolean; motivo?: string };
type Comparar = {
  comparar: (
    a: unknown[][],
    b: unknown[][],
    o?: { ordem?: boolean; tolerancia?: number },
  ) => Resultado;
  normalizar: (v: unknown) => unknown;
  traduzirErro: (e: unknown, sql: string) => string;
};

const PASTA = join(process.cwd(), "apostila");
let C: Castelo;
let Cmp: Comparar;
let B: Backup;
let carga: string;

beforeAll(() => {
  new Function(readFileSync(join(PASTA, "castelo", "salas.js"), "utf-8"))();
  new Function(readFileSync(join(PASTA, "castelo", "comparar.js"), "utf-8"))();
  new Function(readFileSync(join(PASTA, "castelo", "backup.js"), "utf-8"))();
  const g = globalThis as unknown as { CASTELO: Castelo; Comparar: Comparar; Backup: Backup };
  C = g.CASTELO;
  Cmp = g.Comparar;
  B = g.Backup;
  carga = readFileSync(join(PASTA, "licoes", "dados", "estudo.sql"), "utf-8")
    .split("\n")
    .filter((l) => l.startsWith("INSERT INTO"))
    .map((l) => l.replace(/;$/, " ON CONFLICT DO NOTHING;"))
    .join("\n");
});

const linhas = (r: { rows: unknown[] }) => r.rows.map((x) => Object.values(x as object));
const consultar = (db: PGlite) => async (sql: string) =>
  (await db.query<unknown[]>(sql, [], { rowMode: "array" })).rows;
async function rodar(db: PGlite, sql: string) {
  const rs = await db.exec(sql.replace("--CARGA--", ""));
  if (sql.includes("--CARGA--")) await db.exec(carga);
  return rs;
}
async function totais(db: PGlite) {
  const r = await db.query(
    "SELECT (SELECT COUNT(*) FROM materias) m, (SELECT COUNT(*) FROM alunos) a, (SELECT COUNT(*) FROM questoes) q, (SELECT COUNT(*) FROM respostas) r",
  );
  return linhas(r)[0];
}

describe("comparação pelo resultado", () => {
  it("compara conjuntos sem ordem e listas com ordem", () => {
    expect(Cmp.comparar([[1], [2]], [[2], [1]]).ok).toBe(true);
    const r = Cmp.comparar([[1], [2]], [[2], [1]], { ordem: true });
    expect(r.ok).toBe(false);
    expect(r.motivo).toContain("a ordem não");
  });
  it("aceita números em texto, datas e tolerância", () => {
    expect(Cmp.comparar([["66.7"]], [[66.7]]).ok).toBe(true);
    expect(Cmp.comparar([[new Date("2026-10-23T00:00:00Z")]], [["2026-10-23"]]).ok).toBe(true);
    expect(Cmp.comparar([[3.04]], [[3]], { tolerancia: 0.06 }).ok).toBe(true);
  });
  it("explica quando o número de colunas ou de linhas não bate", () => {
    expect(Cmp.comparar([[1, 2]], [[1]]).motivo).toContain("2 colunas");
    expect(Cmp.comparar([[1]], [[1], [2]]).motivo).toContain("1 linha");
  });
});

describe("erros do PostgreSQL em português", () => {
  it("o erro das aspas duplas aponta as aspas simples", async () => {
    const db = await PGlite.create();
    await db.exec("CREATE TABLE materias (id INTEGER, nome TEXT, banca TEXT)");
    const sql = 'SELECT nome FROM materias WHERE banca = "FGV"';
    const erro = await db.query(sql).catch((e: unknown) => e);
    expect(Cmp.traduzirErro(erro, sql)).toContain("aspas simples");
    const apostrofo = "INSERT INTO materias VALUES (9, 'Joana D'Ávila', 'x')";
    const erro2 = await db.query(apostrofo).catch((e: unknown) => e);
    expect(Cmp.traduzirErro(erro2, apostrofo)).toMatch(/duas aspas simples/);
    await db.close();
    // criar um PostgreSQL novo leva alguns segundos quando a suíte inteira roda junto
  }, 30_000);
});

describe("roteiro das salas", () => {
  it("tem 17 salas em 5 zonas, cada uma com apresentação, ferramenta, uso no trabalho e tarefas completas", () => {
    expect(C.salas).toHaveLength(17);
    expect(C.blocos.map((b) => b.id)).toEqual(["A", "B", "C", "D", "E"]);
    for (const s of C.salas)
      expect((s as Sala & { trabalho?: string }).trabalho?.length ?? 0, s.id).toBeGreaterThan(60);
    for (const b of C.blocos) expect(b.porque.length).toBeGreaterThan(60);
    const partes = new Set<string>();
    for (const s of C.salas) {
      expect(s.slides.length, s.id).toBeGreaterThan(0);
      expect(s.ferramenta.url, s.id).toMatch(/^https:\/\/github\.com\//);
      partes.add(s.parte);
      for (const t of s.tarefas) {
        const rotulo = `${s.id}.${t.id}`;
        if (t.tipo === "sql" || t.tipo === "python") {
          expect(t.solucao, rotulo).toBeTruthy();
          expect(t.pista, rotulo).toBeTruthy();
        }
        if (t.tipo === "sql") expect(Boolean(t.gabarito || t.verificar?.length), rotulo).toBe(true);
        if (t.tipo === "python") expect(t.testes, rotulo).toContain("assert");
        if (t.tipo === "escolha") expect(t.opcoes?.[t.certa ?? -1], rotulo).toBeTruthy();
      }
    }
    expect(partes.size).toBe(17);
  });

  it("cada nivelamento libera a fase seguinte e é possível de passar", () => {
    for (const n of C.niveis) {
      expect(C.blocos.some((b) => b.id === n.libera)).toBe(true);
      expect(n.minimo).toBeLessThanOrEqual(n.itens.length);
      expect(n.minimo).toBeGreaterThan(n.itens.length / 2);
    }
  });

  it("não cita produto nem caminho de fora do projeto", () => {
    const texto = readFileSync(join(PASTA, "castelo", "salas.js"), "utf-8").toLowerCase();
    expect(texto).not.toContain("apostila viva");
    expect(texto).not.toContain("apostila-viva");
  });
});

describe("o castelo construído num PostgreSQL de verdade", () => {
  it(
    "todas as soluções oficiais, na ordem das salas, passam nas verificações",
    { timeout: 120_000 },
    async () => {
      const db = await PGlite.create();
      const falhas: string[] = [];
      let backup = "";
      for (const s of C.salas) {
        for (const t of s.tarefas) {
          const rotulo = `${s.id}.${t.id}`;
          let ultimo: { rows: unknown[]; fields: unknown[] } | undefined;
          if (t.tipo === "sql" && t.solucao) {
            const rs = await rodar(db, t.solucao);
            await db.exec("RESET ROLE");
            ultimo = [...rs].reverse().find((r) => r.fields.length > 0);
          } else if (t.tipo === "acao") {
            const acao = t.executar ?? "carga";
            if (acao === "carga") await db.exec(carga);
            else if (acao === "historico") await db.exec(C.sqlHistorico);
            else if (acao === "backup") backup = (await B.gerar(consultar(db))).sql;
            else if (acao === "restaurar") {
              await db.exec(B.LIMPAR);
              await db.exec(backup);
            }
          } else if (t.tipo === "fsrs" && t.fonte) {
            const qs = await db.query<{ id: number }>(t.fonte);
            if (qs.rows.length !== 5)
              falhas.push(`${rotulo}: a fonte trouxe ${qs.rows.length} questões`);
            for (const q of qs.rows)
              await db.query(
                "INSERT INTO revisoes VALUES ($1, CURRENT_DATE + 3, 2.3, 5.0) ON CONFLICT DO NOTHING",
                [q.id],
              );
          } else continue;
          for (const v of t.verificar ?? []) {
            const c = Cmp.comparar(linhas(await db.query(v.consulta)), v.esperado, { ordem: true });
            if (!c.ok) falhas.push(`${rotulo} verificar: ${c.motivo ?? ""}`);
          }
          if (t.gabarito) {
            const g = await db.query(t.gabarito);
            if (!g.rows.length) falhas.push(`${rotulo}: gabarito vazio`);
            if (!ultimo) falhas.push(`${rotulo}: a solução não devolveu tabela`);
            else {
              const c = Cmp.comparar(linhas(ultimo), linhas(g), {
                ordem: t.ordem,
                tolerancia: t.tolerancia,
              });
              if (!c.ok) falhas.push(`${rotulo} gabarito: ${c.motivo ?? ""}`);
            }
          }
        }
        const nivel = C.niveis.find((n) => n.id === s.bloco);
        const fimDoBloco = C.salas.filter((x) => x.bloco === s.bloco).at(-1) === s;
        if (nivel && fimDoBloco)
          for (const it of nivel.itens.filter((x) => x.tipo === "sql" && x.solucao && x.gabarito)) {
            const sol = await db.query((it.solucao ?? "").replace(/;\s*$/, ""));
            const g = await db.query(it.gabarito ?? "");
            const c = Cmp.comparar(linhas(sol), linhas(g), {
              ordem: it.ordem,
              tolerancia: it.tolerancia,
            });
            if (!c.ok || !g.rows.length)
              falhas.push(`nível ${nivel.id}.${it.id}: ${c.motivo ?? "vazio"}`);
          }
      }
      expect(falhas).toEqual([]);
      expect(await totais(db)).toEqual([8, 12, 62, 382]);
      await db.close();
    },
  );

  it("o código inicial de uma tarefa não passa sozinho", { timeout: 60_000 }, async () => {
    const db = await PGlite.create();
    const s1 = C.salas[0]!;
    await db.exec(s1.tarefas[0]!.inicial ?? "").catch(() => undefined);
    const v = s1.tarefas[0]!.verificar![0]!;
    expect(Cmp.comparar(linhas(await db.query(v.consulta)), v.esperado, { ordem: true }).ok).toBe(
      false,
    );
    await db.close();
  });

  it(
    "“Reconstruir o banco” é idempotente: rodar os estados duas vezes dá o mesmo banco",
    { timeout: 60_000 },
    async () => {
      const db = await PGlite.create();
      for (let vez = 0; vez < 2; vez++)
        for (const s of C.salas) if (s.estado) await rodar(db, s.estado);
      expect(await totais(db)).toEqual([8, 12, 62, 382]);
      await db.close();
    },
  );
});
