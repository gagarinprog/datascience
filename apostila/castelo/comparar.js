// Correção pelo resultado (CLAUDE.md, regra 7) e tradução dos erros do PostgreSQL para o iniciante.
// Funciona no navegador (window.Comparar) e no Node (testes): não depende de nada.
(function (raiz) {
  "use strict";

  // valores do banco chegam como número, texto, booleano, Date ou null; tudo vira texto comparável
  function normalizar(v) {
    if (v === null || v === undefined) return null;
    if (v instanceof Date) return v.toISOString().replace("T", " ").replace(/\.000Z$/, "").replace(/ 00:00:00$/, "");
    if (typeof v === "boolean") return v ? "true" : "false";
    if (typeof v === "bigint") return v.toString();
    if (typeof v === "number") return v;
    const s = String(v);
    if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
    return s;
  }
  const linhaDe = (r) => (Array.isArray(r) ? r : Object.values(r)).map(normalizar);

  function igual(a, b, tol) {
    if (typeof a === "number" && typeof b === "number") return Math.abs(a - b) <= (tol || 1e-6);
    return a === b;
  }
  const linhasIguais = (x, y, tol) => x.length === y.length && x.every((v, i) => igual(v, y[i], tol));
  const chave = (l) => JSON.stringify(l.map((v) => (typeof v === "number" ? Math.round(v * 10) / 10 : v)));

  // compara duas listas de linhas; sem ordem, compara como conjuntos (com repetição)
  function comparar(obtido, esperado, opcoes) {
    const o = opcoes || {}, tol = o.tolerancia || 1e-6;
    const a = obtido.map(linhaDe), b = esperado.map(linhaDe);
    if (a.length && b.length && a[0].length !== b[0].length) {
      return { ok: false, motivo: `O resultado tem ${a[0].length} ${a[0].length === 1 ? "coluna" : "colunas"}; o esperado tem ${b[0].length}.` };
    }
    if (a.length !== b.length) return { ok: false, motivo: `O resultado tem ${a.length} ${a.length === 1 ? "linha" : "linhas"}; o esperado tem ${b.length}.` };
    if (o.ordem) {
      const i = a.findIndex((l, k) => !linhasIguais(l, b[k], tol));
      return i < 0 ? { ok: true } : { ok: false, motivo: `A linha ${i + 1} está diferente${a.every((l) => b.some((m) => linhasIguais(l, m, tol))) ? ": as linhas são as certas, mas a ordem não" : ""}.` };
    }
    const resto = b.slice();
    for (const l of a) {
      const k = resto.findIndex((m) => linhasIguais(l, m, tol));
      if (k < 0) return { ok: false, motivo: `A linha ${chave(l)} não deveria estar no resultado (ou algum valor dela está diferente).` };
      resto.splice(k, 1);
    }
    return { ok: true };
  }

  // erros do PostgreSQL em português de iniciante; o erro das aspas recebe atenção especial
  function traduzirErro(e, sql) {
    const msg = (e && e.message) || String(e);
    const codigo = e && e.code;
    const temAspasDuplas = /"[^"\n]*"/.test(sql || "");
    let m;
    if ((m = msg.match(/column "([^"]+)" does not exist/))) {
      return temAspasDuplas && new RegExp(`"${m[1].replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`).test(sql)
        ? `O banco procurou uma coluna chamada ${m[1]}. Aspas duplas são para nome de coluna; texto vai entre aspas simples: '${m[1]}'.`
        : `A coluna ${m[1]} não existe nessa tabela. Confira o nome no esquema do banco, ao lado.`;
    }
    if ((m = msg.match(/relation "([^"]+)" does not exist/))) return `A tabela ${m[1]} não existe (ainda). Confira o nome ou crie a tabela antes.`;
    if ((m = msg.match(/relation "([^"]+)" already exists/))) return `A tabela ${m[1]} já existe. Para recomeçar a sala, use “Desfazer esta sala”.`;
    if (/unterminated quoted string/.test(msg)) return "Uma aspa simples abriu e não fechou. Num texto com apóstrofo, escreva duas aspas simples: 'Joana D''Ávila'.";
    if ((m = msg.match(/syntax error at or near "([^"]*)"/))) {
      if (/'[^'\n]*'[A-Za-zÀ-ú]/.test(sql || "")) return `Erro de escrita perto de “${m[1]}”. Parece um apóstrofo dentro do texto: escreva duas aspas simples, como em 'D''Ávila'.`;
      return `Erro de escrita perto de “${m[1]}”. Confira vírgulas, parênteses e a ordem das partes (SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY).`;
    }
    if (/syntax error at end of input/.test(msg)) return "O comando terminou antes da hora: falta alguma parte, um parêntese ou uma aspa.";
    if (/duplicate key value violates unique constraint/.test(msg)) return "Já existe uma linha com essa chave primária. A chave primária não deixa repetir.";
    if (/violates foreign key constraint/.test(msg)) return "A chave estrangeira recusou: o número aponta para uma linha que não existe na outra tabela (ou ainda há linhas que dependem desta).";
    if ((m = msg.match(/null value in column "([^"]+)"/))) return `A coluna ${m[1]} é obrigatória (NOT NULL) e ficou vazia.`;
    if (/violates check constraint/.test(msg)) return "Um valor quebrou uma regra CHECK da tabela, como o nível fora de 1 a 5.";
    if ((m = msg.match(/column "([^"]+)" must appear in the GROUP BY clause/))) return `A coluna ${m[1]} está no SELECT, mas não está no GROUP BY nem dentro de uma função como COUNT ou AVG.`;
    if (/aggregate functions are not allowed in WHERE/.test(msg)) return "COUNT, AVG e companhia não podem ir no WHERE: o filtro de grupo vai no HAVING, depois do GROUP BY.";
    if (/operator does not exist/.test(msg)) return "Os tipos não combinam nessa comparação ou conta, como comparar número com texto.";
    if (/invalid input syntax for type/.test(msg)) return "Um valor não combina com o tipo da coluna, como um texto numa coluna de número ou data.";
    if (/cannot insert multiple commands into a prepared statement/.test(msg)) return "Aqui vai um comando só.";
    return `O banco recusou o comando: ${msg}${codigo ? ` (código ${codigo})` : ""}.`;
  }

  raiz.Comparar = { normalizar, comparar, traduzirErro };
})(typeof window !== "undefined" ? window : globalThis);
