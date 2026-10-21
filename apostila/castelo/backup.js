// Backup e restauração do banco do Centro de Dados: gera um .sql que recria tudo (tabelas com as regras, dados,
// índices, visões, o usuário leitor e as permissões) e restaura a partir dele. Não depende de nada: roda no
// navegador (window.Backup) e no Node (testes). Recebe uma função consultar(sql) que devolve as linhas em listas.
(function (raiz) {
  "use strict";
  const ORDEM = ["materias", "alunos", "questoes", "respostas", "revisoes"];
  // apaga tudo o que um backup recria (as visões caem junto, pelo CASCADE)
  const LIMPAR = "DROP TABLE IF EXISTS revisoes, respostas, alunos, questoes, materias, historico CASCADE;";
  const pad = (n) => String(n).padStart(2, "0");
  const dataISO = (d) => `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
  function literal(v) {
    if (v === null || v === undefined) return "NULL";
    if (typeof v === "number" || typeof v === "bigint") return String(v);
    if (typeof v === "boolean") return v ? "TRUE" : "FALSE";
    if (v instanceof Date) return `'${dataISO(v)}'`;
    return `'${String(v).replace(/'/g, "''")}'`;
  }
  const nomeSeguro = (n) => /^[a-z_][a-z0-9_]*$/.test(n);

  async function gerar(consultar, cabecalho) {
    const existentes = (await consultar("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'")).map((r) => r[0]).filter(nomeSeguro);
    const tabelas = ORDEM.filter((t) => existentes.includes(t)).concat(existentes.filter((t) => !ORDEM.includes(t)).sort());
    let sql = `${cabecalho || "-- Backup do banco do Centro de Dados do Domínio."}\n-- Dados fictícios. Roda no PostgreSQL: psql -f este-arquivo.sql\n\n`;
    const contagens = {};
    for (const t of tabelas) {
      const cols = await consultar(`SELECT column_name, data_type, is_nullable, column_default FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '${t}' ORDER BY ordinal_position`);
      const regras = await consultar(`SELECT pg_get_constraintdef(oid) FROM pg_constraint WHERE conrelid = 'public.${t}'::regclass AND contype IN ('p', 'f', 'c', 'u') ORDER BY contype DESC, conname`);
      sql += `CREATE TABLE ${t} (\n${cols.map(([n, tipo, nulo, padrao]) => `  ${n} ${String(tipo).toUpperCase()}${nulo === "NO" ? " NOT NULL" : ""}${padrao ? ` DEFAULT ${padrao}` : ""}`).concat(regras.map(([r]) => `  ${r}`)).join(",\n")}\n);\n`;
      const linhas = await consultar(`SELECT * FROM ${t} ORDER BY 1`);
      contagens[t] = linhas.length;
      for (const l of linhas) sql += `INSERT INTO ${t} VALUES (${l.map(literal).join(", ")});\n`;
      sql += "\n";
    }
    const indices = await consultar("SELECT indexdef FROM pg_indexes WHERE schemaname = 'public' AND indexname NOT IN (SELECT conname FROM pg_constraint) ORDER BY indexname");
    if (indices.length) sql += "-- índices\n" + indices.map(([d]) => d + ";").join("\n") + "\n\n";
    const visoes = await consultar("SELECT viewname, definition FROM pg_views WHERE schemaname = 'public' ORDER BY viewname");
    if (visoes.length) sql += "-- visões\n" + visoes.filter(([n]) => nomeSeguro(n)).map(([n, d]) => `CREATE OR REPLACE VIEW ${n} AS\n${String(d).trim()}`).join("\n") + "\n\n";
    const acessos = await consultar("SELECT grantee, table_name, privilege_type FROM information_schema.role_table_grants WHERE table_schema = 'public' AND grantee NOT IN ('postgres', 'PUBLIC') ORDER BY grantee, table_name, privilege_type");
    const papeis = [...new Set(acessos.map((r) => r[0]))].filter(nomeSeguro);
    if (papeis.length) {
      sql += "-- usuários e permissões\n";
      for (const p of papeis) sql += `DO $$ BEGIN CREATE ROLE ${p}; EXCEPTION WHEN duplicate_object THEN NULL; END $$;\n`;
      for (const [p, t, priv] of acessos) if (nomeSeguro(p) && nomeSeguro(t) && /^[A-Z ]+$/.test(priv)) sql += `GRANT ${priv} ON ${t} TO ${p};\n`;
    }
    return { sql, tabelas, contagens, indices: indices.length, visoes: visoes.length, papeis };
  }

  raiz.Backup = { gerar, LIMPAR, literal };
})(typeof window !== "undefined" ? window : globalThis);
