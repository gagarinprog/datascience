// Os 12 passo a passo do Centro de Dados: um por módulo, sempre com as linhas reais do banco de estudo.
// Cada um é uma definição para Passo.montar (../passo/passo.js). Os números foram conferidos num PostgreSQL
// de verdade com o arquivo ../licoes/dados/estudo.sql.
(function (raiz) {
  "use strict";
  const P = 12;
  const cols = (W, n, gap = 8) => { const w = (W - P * 2 - gap * (n - 1)) / n; return Array.from({ length: n }, (_, i) => ({ x: P + i * (w + gap), w })); };
  const larg = (W) => W - P * 2;
  // fileira de células: ids prefixo_0..n, alinhadas às colunas c, na altura y
  const fileira = (pref, c, y, extra) => { const o = {}; c.forEach((k, i) => { o[`${pref}${i}`] = Object.assign({ x: k.x, y, w: k.w, o: 1 }, extra || {}); }); return o; };
  const espera = (pref, c, y) => { const o = {}; c.forEach((k, i) => { o[`${pref}${i}`] = { x: k.x - 24, y, w: k.w, o: 0 }; }); return o; };
  const celulas = (pref, valores, tipo) => valores.map((v, i) => ({ id: `${pref}${i}`, html: v, tipo }));
  const junta = (...os) => { const r = {}; os.forEach((o) => { for (const k in o) r[k] = Object.assign({}, r[k], o[k]); }); return r; };
  const nul = '<span class="nulo">NULL</span>';
  // três colunas id, nome e banca: a do nome é a mais larga
  const c3 = (W) => { const L = larg(W) - 12, r = W < 520 ? [0.11, 0.6, 0.29] : [0.16, 0.5, 0.34]; let x = P; return r.map((f) => { const k = { x, w: L * f }; x += L * f + 6; return k; }); };
  const dec = (n) => String(n).replace(".", ",");

  const D = {};

  // ---------------- 1 · Rack de tabelas: CREATE TABLE e chave primária ----------------
  D.s1 = {
    titulo: "Como o CREATE TABLE monta a tabela e as regras",
    codigo: { partes: [
      { id: "c", texto: "CREATE TABLE materias (" }, { id: "id", texto: "\n  id INTEGER PRIMARY KEY," },
      { id: "nome", texto: "\n  nome TEXT NOT NULL," }, { id: "banca", texto: "\n  banca TEXT NOT NULL" }, { id: "fim", texto: "\n);" }] },
    pecas: [{ id: "rot", tipo: "rotulo", html: "tabela materias" }, ...celulas("h", ["id", "nome", "banca"]),
      ...celulas("a", ["1", "Língua Portuguesa", "Cebraspe"]), ...celulas("b", ["1", "Raciocínio Lógico", "FGV"]), ...celulas("n", ["2", nul, "FGV"]),
      { id: "nota", tipo: "caixa" }],
    altura: (W) => (W < 420 ? 330 : 290),
    passos: [
      { t: "Um comando, uma tabela vazia", d: "O <code>CREATE TABLE</code> diz o nome da tabela e, dentro dos parênteses, cada coluna com o seu tipo e as suas regras. Vamos montar coluna por coluna.", foco: "c",
        layout: (W) => { const c = c3(W); return junta({ rot: { x: P, y: 10, o: 1 }, nota: { x: P, y: 190, w: larg(W), o: 1, html: "<b>Nada existe ainda.</b>O banco vai guardar as regras junto com a tabela e conferir cada linha que chegar." } },
          espera("h", c, 36), espera("a", c, 76), espera("b", c, 112), espera("n", c, 148)); } },
      { t: "id INTEGER PRIMARY KEY", d: "Número inteiro que identifica a linha. A chave primária não deixa repetir e não deixa ficar vazio.", foco: "id", feitos: ["c"],
        layout: (W) => ({ h0: { x: c3(W)[0].x, y: 36, w: c3(W)[0].w, o: 1, c: "cab", pulso: true }, nota: { html: "<b>Regra da coluna id</b>único e obrigatório: é o RG da linha." } }) },
      { t: "nome TEXT NOT NULL", d: "Texto. <code>NOT NULL</code> obriga a preencher: linha sem nome não entra.", foco: "nome", feitos: ["c", "id"],
        layout: (W) => ({ h1: { x: c3(W)[1].x, y: 36, w: c3(W)[1].w, o: 1, c: "cab", pulso: true }, nota: { html: "<b>Regra da coluna nome</b>texto obrigatório." } }) },
      { t: "banca TEXT NOT NULL", d: "Mais um texto obrigatório. A última coluna não leva vírgula depois.", foco: "banca", feitos: ["c", "id", "nome"],
        layout: (W) => ({ h2: { x: c3(W)[2].x, y: 36, w: c3(W)[2].w, o: 1, c: "cab", pulso: true }, nota: { html: "<b>Regra da coluna banca</b>texto obrigatório." } }) },
      { t: "A primeira linha chega", d: "A tabela existe. A linha 1 passa em todas as regras e entra.", foco: "fim", feitos: ["c", "id", "nome", "banca"],
        layout: (W) => junta(fileira("a", c3(W), 76, { c: "ok" }), { nota: { html: "<b>Aceita.</b>id novo, nome e banca preenchidos." } }) },
      { t: "Outra linha com id 1", d: "O banco confere a chave primária antes de gravar. O id 1 já existe: a linha é recusada inteira.", feitos: ["c", "id", "nome", "banca", "fim"], escalonar: 60,
        layout: (W) => junta(fileira("b", c3(W), 112), { b0: { c: "ruim" }, nota: { html: "<b>Recusada pela chave primária.</b>O PostgreSQL diz: <code>duplicate key value violates unique constraint</code>." } }) },
      { t: "Uma linha sem nome", d: "Agora o id é novo, mas o nome veio vazio. A regra NOT NULL barra a linha.", feitos: ["c", "id", "nome", "banca", "fim"], escalonar: 60,
        layout: (W) => junta(fileira("n", c3(W), 148), { n1: { c: "ruim" }, b0: { c: "ruim apagado" }, b1: { c: "apagado" }, b2: { c: "apagado" },
          nota: { html: "<b>Recusada pelo NOT NULL.</b><code>null value in column \"nome\" violates not-null constraint</code>. No fim, só a linha 1 ficou na tabela." } }) },
    ],
  };

  // ---------------- 2 · Primeiros registros: INSERT e SELECT ----------------
  const S2 = [["1", "Língua Portuguesa", "Cebraspe"], ["2", "Raciocínio Lógico", "FGV"], ["3", "Direito Administrativo", "Quadrix"]];
  const s2cols = c3;
  D.s2 = {
    titulo: "Como o INSERT enche a tabela e o SELECT pergunta",
    codigo: { partes: [
      { id: "ins", texto: "INSERT INTO materias (id, nome, banca) VALUES" }, { id: "l1", texto: "\n  (1, 'Língua Portuguesa', 'Cebraspe')," },
      { id: "l2", texto: "\n  (2, 'Raciocínio Lógico', 'FGV')," }, { id: "l3", texto: "\n  (3, 'Direito Administrativo', 'Quadrix');" },
      { id: "from", texto: "\n\nSELECT nome FROM materias" }, { id: "where", texto: "\nWHERE banca = 'FGV';" },
      { id: "order", texto: "\n\nSELECT nome, banca FROM materias\nORDER BY nome;" }] },
    pecas: [...celulas("h", ["id", "nome", "banca"]), ...S2.flatMap((l, k) => celulas(`r${k}_`, l)), { id: "res", tipo: "caixa" }, { id: "nota", tipo: "rotulo" }],
    altura: () => 270,
    passos: [
      { t: "A tabela vazia", d: "As colunas existem, mas não há nenhuma linha. O INSERT põe as linhas; cada parêntese é uma linha, na ordem das colunas.", foco: "ins",
        layout: (W) => { const c = s2cols(W); return junta(fileira("h", c, 12, { c: "cab" }), espera("r0_", c, 50), espera("r1_", c, 84), espera("r2_", c, 118), { res: { x: P, y: 170, w: larg(W), o: 0 }, nota: { x: P, y: 160, o: 0 } }); } },
      { t: "Primeira linha", d: "Os valores entram na mesma ordem das colunas listadas: 1 vai para id, o texto para nome, Cebraspe para banca.", foco: "l1", feitos: ["ins"], escalonar: 80, layout: (W) => fileira("r0_", s2cols(W), 50) },
      { t: "Segunda linha", d: "Texto vai entre aspas simples; número, não.", foco: "l2", feitos: ["ins", "l1"], escalonar: 80, layout: (W) => fileira("r1_", s2cols(W), 84) },
      { t: "Terceira linha", d: "O ponto e vírgula fecha o comando. A tabela tem três linhas.", foco: "l3", feitos: ["ins", "l1", "l2"], escalonar: 80, layout: (W) => fileira("r2_", s2cols(W), 118) },
      { t: "SELECT nome FROM materias", d: "O SELECT lê a tabela inteira. Ainda não mudou nada: perguntar não altera os dados.", foco: "from", feitos: ["ins", "l1", "l2", "l3"],
        layout: () => { const o = {}; [0, 1, 2].forEach((k) => [0, 1, 2].forEach((i) => { o[`r${k}_${i}`] = { c: "foco" }; })); return o; } },
      { t: "WHERE banca = 'FGV'", d: "O filtro testa cada linha. Só a linha 2 tem a banca FGV; as outras ficam de fora do resultado.", foco: "where", feitos: ["from"],
        layout: () => { const o = {}; [0, 1, 2].forEach((k) => [0, 1, 2].forEach((i) => { o[`r${k}_${i}`] = { c: k === 1 ? (i === 2 ? "ok" : "") : "apagado" }; })); return o; } },
      { t: "O resultado: só a coluna nome", d: "O SELECT pediu só <code>nome</code>. Sai uma linha com uma coluna: Raciocínio Lógico.", feitos: ["from", "where"],
        layout: (W) => ({ r1_0: { c: "apagado" }, r1_1: { c: "ok" }, r1_2: { c: "apagado" }, res: { y: 164, o: 1, html: "<b>Resultado</b>nome<br>Raciocínio Lógico" } }) },
      { t: "ORDER BY nome", d: "Outra pergunta: todas as linhas, em ordem alfabética do nome. As linhas trocam de lugar só no resultado; na tabela, nada muda.", foco: "order", feitos: ["from", "where"], escalonar: 50,
        layout: (W) => { const c = s2cols(W); const ordem = { 2: 50, 0: 84, 1: 118 }; const o = { res: { o: 0, y: 190 } }; [0, 1, 2].forEach((k) => c.forEach((cc, i) => { o[`r${k}_${i}`] = { x: cc.x, y: ordem[k], w: cc.w, o: i === 0 ? 0.35 : 1, c: "" }; })); return o; } },
    ],
  };

  const geo3 = (W) => { const estreito = W < 520, x0 = estreito ? P : P + 176, c = cols(W - x0 + P, 3).map((k) => ({ x: k.x + x0 - P, w: k.w }));
    return { c, yq: estreito ? 204 : 34, yn: estreito ? 262 : 172, k: estreito ? "duas" : "" }; };
  // ---------------- 3 · Integridade: chave estrangeira e CHECK ----------------
  D.s3 = {
    titulo: "Como a chave estrangeira e o CHECK barram dado errado",
    codigo: { partes: [
      { id: "fk", texto: "materia_id INTEGER NOT NULL\n  REFERENCES materias(id)," }, { id: "ck", texto: "\nnivel INTEGER NOT NULL\n  CHECK (nivel BETWEEN 1 AND 5)" },
      { id: "i1", texto: "\n\nINSERT INTO questoes VALUES\n  (1, 99, 'Crase antes de palavra masculina', 'E', 5);" },
      { id: "i2", texto: "\nINSERT INTO questoes VALUES\n  (1, 1, 'Crase antes de palavra masculina', 'E', 5);" },
      { id: "i3", texto: "\nINSERT INTO questoes VALUES\n  (2, 1, 'Regência do verbo assistir', 'C', 7);" }] },
    pecas: [{ id: "tm", tipo: "rotulo", html: "materias.id" }, { id: "m1", html: "1" }, { id: "m2", html: "2" }, { id: "m3", html: "3" },
      { id: "tq", tipo: "rotulo", html: "linha que quer entrar em questoes" }, ...celulas("q", ["id 1", "materia_id 99", "nivel 5"].map((x) => x)), { id: "lupa", tipo: "chip" }, { id: "nota", tipo: "caixa" }],
    altura: (W) => (W < 520 ? 366 : 270),
    passos: [
      { t: "Duas tabelas ligadas", d: "Toda questão aponta para uma matéria pelo <code>materia_id</code>. A matéria precisa existir na tabela materias, que tem os ids 1, 2 e 3.", foco: "fk",
        layout: (W) => { const g = geo3(W);
          return junta({ tm: { x: P, y: 10, o: 1 }, m1: { x: P, y: 34, w: 70, o: 1 }, m2: { x: P, y: 68, w: 70, o: 1 }, m3: { x: P, y: 102, w: 70, o: 1 },
            tq: { x: g.c[0].x, y: g.yq - 24, o: 0 }, lupa: { x: P + 80, y: 34, w: 76, o: 0, html: "<b>99?</b>" }, nota: { x: P, y: g.yn, w: larg(W), o: 0 } }, espera("q", g.c, g.yq), { q0: { c: g.k }, q1: { c: g.k }, q2: { c: g.k } }); } },
      { t: "Chega a questão da matéria 99", d: "O INSERT tenta gravar uma questão com <code>materia_id</code> 99.", foco: "i1", feitos: ["fk"], escalonar: 70,
        layout: (W) => { const g = geo3(W); return junta({ tq: { o: 1 } }, fileira("q", g.c, g.yq, { c: g.k }), { q1: { c: "foco " + g.k } }); } },
      { t: "REFERENCES: o banco procura a matéria 99", d: "Antes de gravar, o banco procura 99 em <code>materias.id</code>: 1? não. 2? não. 3? não.", foco: "fk", feitos: [], dur: 1400, ease: "inOutSine",
        layout: () => ({ lupa: { y: 102, o: 1 }, m1: { c: "apagado" }, m2: { c: "apagado" }, m3: { c: "apagado" } }) },
      { t: "Recusada", d: "Não achou. A linha inteira é recusada: <code>violates foreign key constraint</code>. Sem essa trava, a questão ficaria órfã, de uma matéria que não existe.", foco: "i1",
        layout: (W) => ({ lupa: { c: "ruim", html: "<b>99</b><small>não existe</small>" }, q0: { c: "ruim " + geo3(W).k }, q1: { c: "ruim " + geo3(W).k }, q2: { c: "ruim " + geo3(W).k }, nota: { o: 1, html: "<b>Trava 1: REFERENCES</b>confere se o valor existe na outra tabela." } }) },
      { t: "A mesma questão, agora da matéria 1", d: "O banco procura 1 em <code>materias.id</code> e acha logo na primeira linha. A questão entra.", foco: "i2", feitos: ["fk"],
        layout: (W) => ({ lupa: { y: 34, c: "ok", html: "<b>1</b><small>achou</small>" }, m1: { c: "ok" }, m2: { c: "" }, m3: { c: "" }, q0: { c: "ok " + geo3(W).k, html: "id 1" }, q1: { c: "ok " + geo3(W).k, html: "materia_id 1" }, q2: { c: "ok " + geo3(W).k, html: "nivel 5" } }) },
      { t: "Uma questão de nível 7", d: "A matéria existe, então o REFERENCES deixa. Mas o <code>CHECK</code> só aceita nível de 1 a 5, e 7 está fora.", foco: "ck", feitos: ["fk", "i1", "i2"],
        layout: (W) => ({ q0: { c: " " + geo3(W).k, html: "id 2" }, q1: { c: "ok " + geo3(W).k, html: "materia_id 1" }, q2: { c: "ruim " + geo3(W).k, html: "nivel 7", pulso: true }, nota: { html: "<b>Trava 2: CHECK</b>confere uma condição na própria linha: <code>violates check constraint</code>." } }) },
      { t: "Duas travas, dois jeitos de conferir", d: "REFERENCES olha para outra tabela; CHECK olha para a própria linha. As duas trabalham antes de gravar, e a linha errada nunca chega ao banco.", feitos: ["fk", "ck", "i1", "i2", "i3"],
        layout: () => ({ lupa: { o: 0 } }) },
    ],
  };

  // ---------------- 4 · Porta de entrada: aspas, apóstrofo e NULL ----------------
  D.s4 = {
    titulo: "Como o banco lê aspas, apóstrofo e NULL",
    codigo: { partes: [
      { id: "err", texto: "-- errado\n'Joana D'Ávila'" }, { id: "certo", texto: "\n-- certo\n'Joana D''Ávila'" },
      { id: "dupla", texto: "\n\nWHERE banca = \"FGV\"   -- errado" }, { id: "nulo", texto: "\n\n(7, 'Gabriela Reis', NULL)" }, { id: "is", texto: "\n\nWHERE email IS NULL" }] },
    pecas: [{ id: "t1", tipo: "chip" }, { id: "t2", tipo: "chip" }, { id: "t3", tipo: "chip" }, { id: "t4", tipo: "chip" }, { id: "nota", tipo: "caixa" },
      { id: "v1", tipo: "caixa" }, { id: "v2", tipo: "caixa" }],
    altura: (W) => (W < 420 ? 330 : 270),
    passos: [
      { t: "A aspa simples abre e fecha um texto", d: "O banco lê da esquerda para a direita. A primeira aspa abre o texto; a próxima aspa que ele encontrar fecha.", foco: "err",
        layout: (W) => { const c = cols(W, 4, 6); const o = { nota: { x: P, y: 100, w: larg(W), o: 1, html: "<b>Regra</b>texto entre aspas simples: <code>'Joana'</code>." }, v1: { x: P, y: 210, w: larg(W) / 2 - 4, o: 0 }, v2: { x: P + larg(W) / 2 + 4, y: 210, w: larg(W) / 2 - 4, o: 0 } };
          ["<b>'</b><small>abre</small>", "<b>Joana D</b><small>texto</small>", "<b>'</b><small>fecha?</small>", "<b>Ávila'</b><small>sobra</small>"].forEach((h, i) => { o["t" + (i + 1)] = { x: c[i].x, y: 20, w: c[i].w, o: i < 2 ? 1 : 0, html: h }; }); return o; } },
      { t: "O apóstrofo de D'Ávila fecha o texto", d: "A aspa do apóstrofo é igual à de fechar. Para o banco, o texto acabou em <code>'Joana D'</code>, e sobra <code>Ávila'</code>, que ele não entende.", foco: "err",
        layout: () => ({ t3: { o: 1, c: "aviso", html: "<b>'</b><small>fechou aqui</small>" }, t4: { o: 1, c: "ruim", pulso: true }, nota: { html: "<b>Erro de sintaxe</b><code>syntax error at or near \"Ávila\"</code>" } }) },
      { t: "Apóstrofo se escreve duas vezes", d: "Duas aspas seguidas, <code>''</code>, dentro de um texto querem dizer: uma aspa de verdade. O texto vai até a última aspa.", foco: "certo", feitos: ["err"],
        layout: (W) => { const c = cols(W, 4, 6); return { t1: { c: "" }, t2: { x: c[1].x, w: c[1].w + c[2].w + 6, c: "ok", html: "<b>Joana D'Ávila</b><small>um texto só</small>" }, t3: { x: c[2].x + c[2].w / 2, o: 0 }, t4: { c: "", html: "<b>'</b><small>fecha</small>" }, nota: { html: "<b>Aceito</b><code>'Joana D''Ávila'</code> grava <code>Joana D'Ávila</code>." } }; } },
      { t: "Aspas duplas são outra coisa", d: "Em SQL, aspas duplas marcam <b>nome de coluna</b>. <code>\"FGV\"</code> faz o banco procurar uma coluna chamada FGV.", foco: "dupla", feitos: ["err", "certo"],
        layout: (W) => { const c = cols(W, 4, 6); return { t1: { x: c[0].x, w: c[0].w + c[1].w + 6, c: "", html: "<b>banca</b><small>coluna</small>" }, t2: { x: c[1].x + c[1].w / 2, w: 40, o: 0 }, t3: { x: c[2].x, w: c[2].w, o: 1, c: "", html: "<b>=</b><small>compara</small>" }, t4: { c: "ruim", html: "<b>\"FGV\"</b><small>coluna?</small>" }, nota: { html: "<b>Erro</b><code>column \"FGV\" does not exist</code>. Texto é sempre com aspas simples: <code>'FGV'</code>." } }; } },
      { t: "Vazio não é NULL", d: "<code>''</code> é um texto que existe e tem zero letras. <code>NULL</code> é a ausência de valor: ninguém sabe o e-mail da Gabriela.", foco: "nulo", feitos: ["err", "certo", "dupla"],
        layout: () => ({ t1: { o: 0 }, t3: { o: 0 }, t4: { o: 0 }, nota: { o: 0 }, v1: { y: 30, o: 1, html: "<b>email = ''</b>texto vazio: existe, 0 letras" }, v2: { y: 30, o: 1, html: "<b>email = NULL</b>sem valor: desconhecido" } }) },
      { t: "Para achar NULL, IS NULL", d: "Comparar com <code>= NULL</code> nunca dá verdadeiro: desconhecido comparado com qualquer coisa é desconhecido. O certo é <code>IS NULL</code>.", foco: "is", feitos: ["err", "certo", "dupla", "nulo"],
        layout: (W) => ({ v1: { html: "<b>email = NULL</b>desconhecido: 0 linhas", c: "ruim" }, v2: { html: "<b>email IS NULL</b>verdadeiro: acha a Gabriela", c: "ok", pulso: true } }) },
    ],
  };

  // ---------------- 5 · Carga em lote ----------------
  const S5 = [["materias", 6], ["alunos", 12], ["questoes", 60], ["respostas", 382]];
  D.s5 = {
    titulo: "Em que ordem a carga entra no banco",
    codigo: { partes: [{ id: "m", texto: "INSERT INTO materias ...   -- 6" }, { id: "a", texto: "\nINSERT INTO alunos ...     -- 12" }, { id: "q", texto: "\nINSERT INTO questoes ...   -- 60" }, { id: "r", texto: "\nINSERT INTO respostas ...  -- 382" },
      { id: "b", texto: "\n\nSELECT COUNT(*) FROM respostas\nWHERE resposta IS NULL;" }] },
    pecas: [...S5.map(([n], i) => ({ id: "k" + i, tipo: "chip" })), { id: "nota", tipo: "caixa" }, { id: "p1", tipo: "chip" }, { id: "p2", tipo: "chip" }],
    altura: (W) => (W < 420 ? 300 : 250),
    passos: [
      { t: "Quatro tabelas vazias", d: "A carga traz 460 linhas. A ordem importa: quem aponta para outra tabela só entra depois dela.", foco: "m",
        layout: (W) => { const c = cols(W, W < 420 ? 2 : 4); const o = { nota: { x: P, y: W < 420 ? 160 : 92, w: larg(W), o: 1, html: "<b>Quem depende de quem</b>questoes aponta para materias; respostas aponta para alunos e para questoes." },
          p1: { x: P, y: W < 420 ? 210 : 160, w: larg(W) / 2 - 4, o: 0 }, p2: { x: P + larg(W) / 2 + 4, y: W < 420 ? 210 : 160, w: larg(W) / 2 - 4, o: 0 } };
          S5.forEach(([n], i) => { const k = c[W < 420 ? i % 2 : i]; o["k" + i] = { x: k.x, y: W < 420 ? 10 + Math.floor(i / 2) * 72 : 10, w: k.w, o: 1, html: `<b>0</b><small>${n}</small>`, c: "apagado" }; }); return o; } },
      { t: "1. materias: 6 linhas", d: "Não depende de ninguém, então entra primeiro.", foco: "m", layout: () => ({ k0: { html: "<b>6</b><small>materias</small>", c: "ok", pulso: true } }) },
      { t: "2. alunos: 12 linhas", d: "Também não depende de ninguém.", foco: "a", feitos: ["m"], layout: () => ({ k1: { html: "<b>12</b><small>alunos</small>", c: "ok", pulso: true } }) },
      { t: "3. questoes: 60 linhas", d: "Cada questão confere se a sua matéria existe. Como as 6 matérias já entraram, as 60 passam.", foco: "q", feitos: ["m", "a"], layout: () => ({ k2: { html: "<b>60</b><small>questoes</small>", c: "ok", pulso: true } }) },
      { t: "4. respostas: 382 linhas", d: "Cada resposta confere o aluno e a questão. Os dois já existem: as 382 passam.", foco: "r", feitos: ["m", "a", "q"], layout: () => ({ k3: { html: "<b>382</b><small>respostas</small>", c: "ok", pulso: true } }) },
      { t: "E se fosse ao contrário?", d: "Se as respostas viessem antes das questões, a primeira já seria recusada: a resposta 1 aponta para uma questão que ainda não existe. É a trava do módulo 3 trabalhando na carga.", feitos: ["m", "a", "q", "r"],
        layout: () => ({ nota: { c: "aviso", html: "<b>Ordem errada</b><code>violates foreign key constraint</code> na primeira resposta." } }) },
      { t: "Quantas ficaram em branco", d: "Das 382 respostas, 20 têm <code>resposta</code> vazia, em NULL. O <code>IS NULL</code> acha essas 20; as outras 362 foram respondidas.", foco: "b", feitos: ["m", "a", "q", "r"],
        layout: () => ({ nota: { o: 0 }, k3: { c: "foco" }, p1: { o: 1, html: "<b>362</b><small>respondidas</small>", c: "ok" }, p2: { o: 1, html: "<b>20</b><small>IS NULL</small>", c: "aviso", pulso: true } }) },
    ],
  };

  // ---------------- 6 · Filtro: WHERE, ORDER BY e LIMIT ----------------
  const S6 = [[1, 1, 5], [2, 1, 2], [3, 1, 5], [4, 1, 1], [5, 1, 1], [6, 1, 1], [7, 1, 3], [8, 1, 4], [9, 1, 3], [10, 1, 4], [11, 2, 1], [21, 3, 4]];
  const S6ord = [1, 3, 8, 10, 7, 9, 2, 4, 5, 6];
  D.s6 = {
    titulo: "Como WHERE, ORDER BY e LIMIT recortam as questões",
    codigo: { partes: [{ id: "select", texto: "SELECT id, enunciado, nivel" }, { id: "from", texto: "\nFROM questoes" }, { id: "where", texto: "\nWHERE materia_id = 1" }, { id: "order", texto: "\nORDER BY nivel DESC, id" }, { id: "limit", texto: "\nLIMIT 5;" }] },
    ordem: [{ id: "from", rotulo: "1 FROM" }, { id: "where", rotulo: "2 WHERE" }, { id: "select", rotulo: "3 SELECT" }, { id: "order", rotulo: "4 ORDER BY" }, { id: "limit", rotulo: "5 LIMIT" }],
    pecas: [...S6.map(([id, m, n]) => ({ id: "q" + id, html: `<span>questão ${id}</span><span class="fr2">matéria ${m}</span><span class="fr">nível ${n}</span>` })), { id: "corte", tipo: "rotulo" }, { id: "res", tipo: "caixa" }],
    altura: () => 12 + 12 * 29 + 24,
    passos: [
      { t: "A pergunta", d: "Quais são as 5 questões mais difíceis de Língua Portuguesa? Aqui estão 12 das 60 questões: as 10 da matéria 1 e duas de outras matérias.", layout: (W) => { const o = { corte: { x: P, y: 0, o: 0, html: "LIMIT 5 corta aqui" }, res: { x: P, y: 200, w: larg(W), o: 0 } }; S6.forEach(([id], i) => { o["q" + id] = { x: P, y: 12 + i * 29, w: larg(W), o: 0 }; }); return o; } },
      { t: "1. FROM questoes", d: "O banco começa pela tabela. Ainda não importa o que o SELECT pede.", foco: "from", escalonar: 35, layout: () => { const o = {}; S6.forEach(([id]) => { o["q" + id] = { o: 1 }; }); return o; } },
      { t: "2. WHERE materia_id = 1", d: "Cada linha é testada. As questões 11 e 21 são de outras matérias e saem: sobram 10.", foco: "where", feitos: ["from"],
        layout: (W) => ({ q11: { x: W + 20, o: 0 }, q21: { x: W + 20, o: 0 } }) },
      { t: "3. SELECT id, enunciado, nivel", d: "Só agora as colunas pedidas são escolhidas. O enunciado também viria; aqui ele fica de fora para caber na tela.", foco: "select", feitos: ["from", "where"],
        layout: () => { const o = {}; S6.slice(0, 10).forEach(([id]) => { o["q" + id] = { c: "foco" }; }); return o; } },
      { t: "4. ORDER BY nivel DESC, id", d: "Do nível maior para o menor. No empate, o id desempata em ordem crescente: 1 antes de 3, 8 antes de 10.", foco: "order", feitos: ["from", "where", "select"], escalonar: 30, ease: "inOutQuart", dur: 800,
        layout: () => { const o = {}; S6ord.forEach((id, i) => { o["q" + id] = { y: 12 + i * 29, c: "" }; }); return o; } },
      { t: "5. LIMIT 5", d: "Só as cinco primeiras linhas saem: questões 1, 3, 8, 10 e 7. O LIMIT corta depois da ordem; sem ORDER BY, as cinco seriam quaisquer.", foco: "limit", feitos: ["from", "where", "select", "order"],
        layout: (W) => { const o = { corte: { x: P, y: 12 + 5 * 29 + 1, o: 1 } }; S6ord.forEach((id, i) => { o["q" + id] = { c: i < 5 ? "ok" : "apagado cortado", y: 12 + i * 29 + (i < 5 ? 0 : 18) }; }); return o; } },
    ],
  };

  // ---------------- 7 · Agregador: GROUP BY (12 respostas reais de três alunos) ----------------
  const S7 = [[173, 7, "D", false], [174, 7, null, null], [175, 7, "E", false], [176, 7, "D", true], [245, 9, "E", true], [246, 9, "D", true], [247, 9, "C", false], [248, 9, "E", true], [345, 12, null, null], [346, 12, "E", true], [347, 12, "C", false], [348, 12, "D", true]];
  const AL = [7, 9, 12], COR = { 7: "var(--aviso)", 9: "var(--tinta)", 12: "var(--certo)" }, TAXA = { 7: 33.3, 9: 75.0, 12: 66.7 }, ORD7 = [9, 12, 7];
  const CONTA = { 7: "(0 + 0 + 100) ÷ 3", 9: "(100 + 100 + 0 + 100) ÷ 4", 12: "(100 + 0 + 100) ÷ 3" };
  const ficha7 = (id, al, resp, ac, curta, val) => `<span class="cor" style="background:${COR[al]}"></span>${curta ? "" : `<span class="fr2">#${id} · aluno ${al}</span>`}<span>${resp === null ? "em branco" : (curta ? "" : "resp. ") + resp}</span><span class="fr">${val}</span>`;
  D.s7 = {
    titulo: "Como o GROUP BY transforma linhas em uma por aluno",
    codigo: { partes: [{ id: "select", texto: "SELECT aluno_id,\n  ROUND(AVG(CASE WHEN acertou\n    THEN 100.0 ELSE 0 END), 1) AS taxa" }, { id: "from", texto: "\nFROM respostas" }, { id: "where", texto: "\nWHERE resposta IS NOT NULL" }, { id: "group", texto: "\nGROUP BY aluno_id" }, { id: "order", texto: "\nORDER BY taxa DESC" }, { id: "limit", texto: "\nLIMIT 2;" }] },
    ordem: [{ id: "from", rotulo: "1 FROM" }, { id: "where", rotulo: "2 WHERE" }, { id: "group", rotulo: "3 GROUP BY" }, { id: "select", rotulo: "4 SELECT" }, { id: "order", rotulo: "5 ORDER BY" }, { id: "limit", rotulo: "6 LIMIT" }],
    pecas: [...S7.map(([id, al, r, ac]) => ({ id: "f" + id, html: ficha7(id, al, r, ac, false, ac === null ? "—" : ac ? "acertou" : "errou") })),
      ...AL.map((a) => ({ id: "g" + a, tipo: "rotulo", html: "aluno " + a })), ...AL.map((a) => ({ id: "c" + a, tipo: "chip" })), { id: "res", tipo: "caixa", html: "<b>Resultado</b>aluno 9 · taxa 75,0<br>aluno 12 · taxa 66,7" }],
    altura: (W) => (W < 420 ? 440 : 410),
    intervalo: 3600,
    passos: (function () {
      const vis = S7.filter((l) => l[2] !== null);
      const pos = (k, W) => {
        const cw = (W - P * 4) / 3, o = {};
        S7.forEach(([id, al, resp, ac], idx) => {
          const p = { x: P, y: P + idx * 32, w: larg(W), o: 1, html: ficha7(id, al, resp, ac, false, ac === null ? "—" : ac ? "acertou" : "errou"), c: resp === null ? "aviso" : "" };
          if (k === 0) p.o = 0;
          if (k >= 2 && resp === null) { p.o = 0; p.x = W + 20; }
          if (k === 2 && resp !== null) p.y = P + vis.findIndex((l) => l[0] === id) * 32;
          if (k >= 3 && resp !== null) {
            const g = AL.indexOf(al), dentro = S7.filter((l) => l[1] === al && l[2] !== null).findIndex((l) => l[0] === id);
            Object.assign(p, { x: P + g * (cw + P), y: 44 + dentro * 34, w: cw, html: ficha7(id, al, resp, ac, true, k >= 4 ? (ac ? "100" : "0") : ac ? "certo" : "errou") });
            if (k >= 5) { p.o = 0; p.y = 104; }
          }
          o["f" + id] = p;
        });
        AL.forEach((a, g) => {
          const oi = k >= 6 ? ORD7.indexOf(a) : g;
          o["g" + a] = { x: P + g * (cw + P), y: 18, o: k >= 3 && k < 5 ? 1 : 0 };
          o["c" + a] = { x: P + oi * (cw + P), y: k >= 5 ? 40 : 70, w: cw, o: k >= 5 ? (k >= 7 && oi === 2 ? 0.4 : 1) : 0, c: k >= 7 && oi === 2 ? "cortado" : "",
            html: `<b>${k >= 5 ? dec(TAXA[a].toFixed(1)) : "0"}</b><small>aluno ${a}</small><small>${CONTA[a]}</small>` };
        });
        o.res = { x: P, y: k === 7 ? 170 : 190, w: larg(W), o: k === 7 ? 1 : 0 };
        return o;
      };
      const txt = [
        ["A pergunta", "Quem está acertando mais? O banco não lê a consulta de cima para baixo: começa pelo FROM e só calcula o SELECT na quarta etapa.", null],
        ["1. FROM respostas", "O banco pega a tabela. Aqui, 12 respostas de três alunos: a Gabriela (7), a Joana (9) e o Marcos (12).", "from"],
        ["2. WHERE resposta IS NOT NULL", "Duas respostas ficaram em branco. O filtro tira essas linhas antes de qualquer conta: sobram 10.", "where"],
        ["3. GROUP BY aluno_id", "As linhas do mesmo aluno vão para o mesmo grupo. Agora há três montes, um por aluno.", "group"],
        ["4. CASE WHEN acertou THEN 100.0 ELSE 0", "Dentro de cada grupo, acerto vira 100 e erro vira 0. A média desses números já é a porcentagem.", "select"],
        ["4. AVG(...) AS taxa", "Cada grupo vira uma linha só: a média dos seus números. Joana: (100 + 100 + 0 + 100) ÷ 4 = 75,0.", "select"],
        ["5. ORDER BY taxa DESC", "Os grupos se reorganizam da maior taxa para a menor.", "order"],
        ["6. LIMIT 2", "Só as duas primeiras linhas saem: Joana com 75,0 e Marcos com 66,7. A Gabriela ficou de fora pelo corte, não pelo filtro.", "limit"],
      ];
      const seq = ["from", "where", "group", "select", "order", "limit"];
      return txt.map(([t, d, foco], k) => ({ t, d, foco, feitos: foco ? seq.slice(0, seq.indexOf(foco)) : [], layout: (W) => pos(k, W),
        escalonar: k === 1 ? 45 : k === 3 ? 30 : 0, ease: k === 3 ? "outBack(1.1)" : k === 6 ? "inOutQuart" : "outExpo" }));
    })(),
  };

  // ---------------- 8 · Junção: JOIN e LEFT JOIN ----------------
  const R8 = [[245, 35], [246, 56], [247, 49], [248, 6], [249, 41]];
  const Q8 = { 35: 4, 56: 6, 49: 5, 6: 1, 41: 5 };
  const M8 = { 4: "Informática", 6: "Banco de Dados", 5: "Estatística", 1: "Língua Portuguesa" };
  const L8 = [["Língua Portuguesa", 10], ["Raciocínio Lógico", 10], ["Direito Administrativo", 10], ["Informática", 10], ["Estatística", 10], ["Banco de Dados", 10], ["Contabilidade", 0]];
  D.s8 = {
    titulo: "Como o JOIN liga as linhas de três tabelas",
    codigo: { partes: [{ id: "from", texto: "SELECT m.nome, COUNT(*)\nFROM respostas r" }, { id: "j1", texto: "\nJOIN questoes q ON q.id = r.questao_id" }, { id: "j2", texto: "\nJOIN materias m ON m.id = q.materia_id" }, { id: "group", texto: "\nGROUP BY m.nome;" },
      { id: "left", texto: "\n\nSELECT m.nome, COUNT(q.id)\nFROM materias m\nLEFT JOIN questoes q\n  ON q.materia_id = m.id\nGROUP BY m.nome;" }] },
    pecas: [{ id: "tr", tipo: "rotulo", html: "respostas" }, { id: "tq", tipo: "rotulo", html: "questoes" }, { id: "tm", tipo: "rotulo", html: "materias" },
      ...R8.map(([id, q]) => ({ id: "r" + id, html: `#${id} · <b>q ${q}</b>` })), ...R8.map(([, q]) => ({ id: "q" + q, html: `<b>q ${q}</b> · m ${Q8[q]}` })),
      ...[4, 6, 5, 1].map((m) => ({ id: "m" + m, html: `<b>m ${m}</b> · ${M8[m]}` })), { id: "m5b", html: `<b>m 5</b> · ${M8[5]}` },
      ...L8.map((l, i) => ({ id: "l" + i })), { id: "nota", tipo: "caixa" }],
    altura: (W) => (W < 520 ? 400 : 300),
    passos: (function () {
      // no celular as células quebram em duas linhas; no computador, a coluna das matérias é mais larga
      const base = (W) => { if (W < 520) { const L = larg(W) - 12; return [{ x: P, w: L * 0.29 }, { x: P + L * 0.29 + 6, w: L * 0.29 }, { x: P + L * 0.58 + 12, w: L * 0.42 }]; } const L = larg(W) - 12, a = L * 0.27, b = L * 0.27; return [{ x: P, w: a }, { x: P + a + 6, w: b }, { x: P + a + b + 12, w: L - a - b }]; };
      const dy = (W) => (W < 520 ? 50 : 34), cl = (W) => (W < 520 ? "duas" : "");
      const qOrdem = [6, 35, 41, 49, 56], mOrdem = [1, 4, 5, 6];
      return [
        { t: "Três tabelas separadas", d: "A resposta sabe só o número da questão; a questão sabe só o número da matéria; o nome da matéria está na terceira tabela.", foco: "from",
          layout: (W) => { const c = base(W), d = dy(W), k = cl(W), o = { tr: { x: c[0].x, y: 8, o: 1 }, tq: { x: c[1].x, y: 8, o: 1 }, tm: { x: c[2].x, y: 8, o: 1 }, nota: { x: P, y: 30 + 5 * d + 8, w: larg(W), o: 0 } };
            R8.forEach(([id], i) => { o["r" + id] = { x: c[0].x, y: 30 + i * d, w: c[0].w, o: 1, c: k }; });
            qOrdem.forEach((q, i) => { o["q" + q] = { x: c[1].x, y: 30 + i * d, w: c[1].w, o: 1, c: k }; });
            mOrdem.forEach((m, i) => { o["m" + m] = { x: c[2].x, y: 30 + i * d, w: c[2].w, o: 1, c: k }; });
            o.m5b = { x: c[2].x, y: 30 + 2 * d, w: c[2].w, o: 0, c: k };
            L8.forEach((l, i) => { o["l" + i] = { x: P, y: 30 + i * 32, w: larg(W), o: 0, html: `<span>${l[0]}</span><span class="fr">${l[1]}</span>` }; }); return o; } },
        { t: "JOIN questoes ON q.id = r.questao_id", d: "Para cada resposta, o banco busca a questão com o mesmo número e põe as duas lado a lado. A ordem da tabela questoes não importa: o que liga é o valor.", foco: "j1", feitos: ["from"], escalonar: 70, dur: 800,
          layout: (W) => { const o = {}; R8.forEach(([id, q], i) => { o["q" + q] = { y: 30 + i * dy(W), c: "ok " + cl(W) }; o["r" + id] = { c: "ok " + cl(W) }; }); return o; } },
        { t: "JOIN materias ON m.id = q.materia_id", d: "Agora cada questão busca a sua matéria. As respostas 247 e 249 caem na mesma matéria, Estatística: a mesma linha de materias serve às duas.", foco: "j2", feitos: ["from", "j1"], escalonar: 70, dur: 800,
          layout: (W) => { const o = {}; const alvo = { 35: "m4", 56: "m6", 49: "m5", 6: "m1", 41: "m5b" }; R8.forEach(([, q], i) => { o[alvo[q]] = { y: 30 + i * dy(W), o: 1, c: "ok " + cl(W) }; }); return o; } },
        { t: "GROUP BY m.nome", d: "Com o nome ao lado de cada resposta, dá para agrupar: Estatística aparece 2 vezes; as outras, 1. Essa é a ponte que responde “qual matéria eu mais erro?”.", foco: "group", feitos: ["from", "j1", "j2"],
          layout: (W) => ({ m5: { c: "foco " + cl(W), pulso: true }, m5b: { c: "foco " + cl(W), pulso: true }, nota: { o: 1, html: "<b>Resultado</b>Estatística 2 · Informática 1 · Banco de Dados 1 · Língua Portuguesa 1" } }) },
        { t: "E a matéria sem nenhuma questão?", d: "Cadastre Contabilidade, que ainda não tem questão. O JOIN comum só mostra linhas que acharam par: a Contabilidade some do resultado.", foco: "left", feitos: ["from", "j1", "j2", "group"], escalonar: 40,
          layout: () => { const o = { nota: { o: 0 }, tr: { o: 0 }, tq: { o: 0 }, tm: { o: 0 } }; R8.forEach(([id, q]) => { o["r" + id] = { o: 0 }; o["q" + q] = { o: 0 }; }); ["m4", "m6", "m5", "m1", "m5b"].forEach((m) => { o[m] = { o: 0 }; });
            L8.forEach((l, i) => { o["l" + i] = { o: i === 6 ? 0.5 : 1, c: i === 6 ? "ruim cortado" : "", html: `<span>${l[0]}</span><span class="fr">${i === 6 ? "sem par: some no JOIN" : l[1]}</span>` }; }); return o; } },
        { t: "LEFT JOIN guarda a matéria", d: "O LEFT JOIN mantém todas as linhas da tabela da esquerda, materias. Onde não há questão, as colunas de q ficam NULL, e <code>COUNT(q.id)</code> conta 0.", foco: "left", feitos: ["from", "j1", "j2", "group"],
          layout: () => ({ l6: { o: 1, c: "ok", html: `<span>Contabilidade</span><span class="fr2">q.id = NULL</span><span class="fr">0</span>`, pulso: true } }) },
      ];
    })(),
  };

  // ---------------- 9 · Nó Python: agrupar num dicionário ----------------
  const R9 = [[173, 7, false], [175, 7, false], [176, 7, true], [245, 9, true], [246, 9, true], [247, 9, false], [248, 9, true]];
  const lista9 = (al, ate) => "[" + R9.slice(0, ate).filter((r) => r[1] === al).map((r) => (r[2] ? "True" : "False")).join(", ") + "]";
  D.s9 = {
    titulo: "Como o for monta um dicionário de listas",
    codigo: { partes: [{ id: "ini", texto: "listas = {}" }, { id: "for", texto: "\nfor r in respostas:" }, { id: "al", texto: "\n    aluno = r[\"aluno_id\"]" }, { id: "if", texto: "\n    if aluno not in listas:\n        listas[aluno] = []" },
      { id: "app", texto: "\n    listas[aluno].append(r[\"acertou\"])" }, { id: "taxa", texto: "\n\nfor aluno in listas:\n    por_aluno[aluno] = taxa_de_acerto(listas[aluno])" }] },
    pecas: [{ id: "tl", tipo: "rotulo", html: "respostas (do seu banco)" }, ...R9.map(([id, al, ac]) => ({ id: "r" + id, html: `<span class="fr2">#${id}</span><span>aluno ${al}</span><span class="fr">${ac ? "True" : "False"}</span>` })),
      { id: "td", tipo: "rotulo", html: "listas" }, { id: "k7", tipo: "caixa" }, { id: "k9", tipo: "caixa" }, { id: "nota", tipo: "rotulo" }],
    altura: (W) => (W < 420 ? 470 : 290),
    passos: (function () {
      const geo = (W) => { const estreito = W < 420, wl = estreito ? larg(W) : Math.min(260, larg(W) * 0.48); return { estreito, wl, xd: estreito ? P : P + wl + 18, yd: estreito ? 30 + 7 * 32 + 34 : 30, wd: estreito ? larg(W) : larg(W) - wl - 18 }; };
      const ch = (k, ate, foco) => ({ html: `<b>listas[${k}]</b>${lista9(k, ate)}`, o: 1, c: foco ? "foco" : "", pulso: !!foco });
      const passo = (i, t, d, foco, extra) => ({ t, d, foco, feitos: ["ini", "for"], layout: () => { const o = {}; R9.forEach(([id], j) => { o["r" + id] = { c: j < i ? "ok apagado" : j === i ? "foco" : "" }; }); return Object.assign(o, extra || {}); } });
      return [
        { t: "Um dicionário vazio", d: "<code>listas = {}</code> começa sem nenhuma chave. O for vai passar por cada resposta, uma de cada vez, e separar os acertos por aluno.", foco: "ini",
          layout: (W) => { const g = geo(W), o = { tl: { x: P, y: 8, o: 1 }, td: { x: g.xd, y: g.yd - 22, o: 1 }, k7: { x: g.xd, y: g.yd, w: g.wd, o: 0 }, k9: { x: g.xd, y: g.yd + (g.estreito ? 84 : 104), w: g.wd, o: 0 }, nota: { x: g.xd, y: g.yd + 4, o: 1, html: "{ }  vazio" } };
            R9.forEach(([id], j) => { o["r" + id] = { x: P, y: 30 + j * 32, w: g.wl, o: 1 }; }); return o; } },
        passo(0, "r = #173: o aluno 7 ainda não está em listas", "O <code>if aluno not in listas</code> dá verdadeiro: o for cria a chave 7 com uma lista vazia e põe o False dentro.", "if", { nota: { o: 0 }, k7: ch(7, 1, true) }),
        passo(1, "r = #175: o aluno 7 já existe", "Agora o if dá falso: a chave 7 já está lá. Só o append roda, e a lista ganha mais um False.", "app", { k7: ch(7, 2, true) }),
        passo(2, "r = #176: mais uma do aluno 7", "A lista do aluno 7 fica com três valores: [False, False, True].", "app", { k7: ch(7, 3, true) }),
        passo(3, "r = #245: chega o aluno 9", "Chave nova: o if cria listas[9] e o append põe o True.", "if", { k7: ch(7, 3, false), k9: ch(9, 4, true) }),
        passo(6, "r = #246, #247 e #248", "As três são do aluno 9: cada volta do for faz um append. listas[9] termina com [True, True, False, True].", "app", { k9: ch(9, 7, true), r246: { c: "ok apagado" }, r247: { c: "ok apagado" } }),
        { t: "Uma taxa por aluno", d: "O segundo for chama a sua função em cada lista: 1 acerto em 3 dá 33,3; 3 em 4 dá 75,0. É o mesmo resultado do GROUP BY do módulo 7, por outro caminho.", foco: "taxa", feitos: ["ini", "for", "al", "if", "app"],
          layout: () => { const o = { k7: { html: "<b>por_aluno[7]</b>taxa_de_acerto([False, False, True]) → <b>33.3</b>", c: "ok", pulso: true }, k9: { html: "<b>por_aluno[9]</b>taxa_de_acerto([True, True, False, True]) → <b>75.0</b>", c: "ok", pulso: true } }; R9.forEach(([id]) => { o["r" + id] = { c: "apagado" }; }); return o; } },
      ];
    })(),
  };

  // ---------------- 10 · Rastreador: a função linha por linha ----------------
  const L10 = ["def taxa_de_acerto(lista):", "    if len(lista) == 0:", "        return 0", "    acertos = 0", "    for valor in lista:", "        if valor:", "            acertos = acertos + 1", "    return round(acertos / len(lista) * 100, 1)"];
  const V10 = [
    ["Chamada", "taxa_de_acerto([True, False, True]): a lista entra na variável <code>lista</code>.", 0, { lista: "[True, False, True]" }],
    ["Linha 2: a lista está vazia?", "<code>len(lista)</code> é 3, não 0. O if é falso e a linha 3 é pulada.", 1, {}],
    ["Linha 4: acertos começa em 0", "Uma variável nova aparece na memória.", 3, { acertos: "0" }],
    ["Linha 5: primeira volta", "O for pega o primeiro item: <code>valor</code> vale True.", 4, { valor: "True" }],
    ["Linha 6 e 7: acertou", "True passa no if, e acertos vira 0 + 1 = 1.", 6, { acertos: "1" }],
    ["Linha 5: segunda volta", "<code>valor</code> agora vale False.", 4, { valor: "False" }],
    ["Linha 6: errou", "False não passa no if. A linha 7 não roda nesta volta, e acertos continua 1.", 5, {}],
    ["Linha 5: terceira volta", "<code>valor</code> vale True de novo.", 4, { valor: "True" }],
    ["Linha 7: acertos vira 2", "1 + 1 = 2. Em três voltas, a linha 7 rodou só duas vezes.", 6, { acertos: "2" }],
    ["Linha 8: a função devolve", "A lista acabou. round(2 / 3 * 100, 1) = 66,7: é isso que a chamada devolve.", 7, { devolve: "66.7" }],
  ];
  D.s10 = {
    titulo: "A função executando, uma linha por vez",
    rotuloCodigo: "A função",
    codigo: { partes: L10.map((l, i) => ({ id: "l" + i, texto: (i ? "\n" : "") + l })) },
    pecas: [{ id: "tm", tipo: "rotulo", html: "memória" }, ...["lista", "acertos", "valor", "devolve"].map((n) => ({ id: "v_" + n, tipo: "caixa" })), { id: "cont", tipo: "rotulo" }],
    altura: (W) => (W < 420 ? 300 : 230),
    passos: (function () {
      const mem = {}; let voltas = 0;
      return V10.map(([t, d, linha, muda], k) => {
        Object.assign(mem, muda);
        if (muda.valor) voltas++;
        const snap = Object.assign({}, mem), v = voltas;
        return { t, d, foco: "l" + linha, layout: (W) => {
          const c = cols(W, W < 420 ? 2 : 4), o = { tm: { x: P, y: 8, o: 1 }, cont: { x: P, y: W < 420 ? 190 : 120, o: v ? 1 : 0, html: `voltas do for: ${v} de 3` } };
          ["lista", "acertos", "valor", "devolve"].forEach((n, i) => {
            const cc = c[W < 420 ? i % 2 : i], y = W < 420 ? 32 + Math.floor(i / 2) * 76 : 32;
            o["v_" + n] = { x: cc.x, y, w: cc.w, h: 64, o: snap[n] !== undefined ? 1 : 0, html: `<b>${n === "devolve" ? "devolve" : n}</b>${snap[n] !== undefined ? snap[n] : ""}`, c: muda[n] !== undefined ? (n === "devolve" ? "ok" : "foco") : "", pulso: muda[n] !== undefined };
          });
          return o;
        } };
      });
    })(),
  };

  // ---------------- 11 · Painel: pandas groupby ----------------
  const D11 = [["Informática", false], ["Informática", true], ["Língua Portuguesa", true], ["Informática", false], ["Banco de Dados", false], ["Raciocínio Lógico", false], ["Raciocínio Lógico", false], ["Língua Portuguesa", false]];
  const G11 = ["Informática", "Língua Portuguesa", "Raciocínio Lógico", "Banco de Dados"];
  const T11 = [["Direito Administrativo", 40.4], ["Raciocínio Lógico", 47.4], ["Língua Portuguesa", 50.0], ["Banco de Dados", 50.7], ["Estatística", 50.9], ["Informática", 53.6]];
  D.s11 = {
    titulo: "O que o pandas faz em uma linha",
    codigo: { partes: [{ id: "df", texto: "df" }, { id: "gb", texto: ".groupby(\"materia\")" }, { id: "col", texto: "[\"acertou\"]" }, { id: "mean", texto: ".mean()" }, { id: "x100", texto: " * 100" }, { id: "idx", texto: "\n\npior = por_materia.idxmin()" }] },
    pecas: [...D11.map(([m, a], i) => ({ id: "d" + i, html: `<span>${m}</span><span class="fr">${a ? "True" : "False"}</span>` })), ...G11.map((g, i) => ({ id: "g" + i, tipo: "rotulo" })),
      ...T11.map((t, i) => ({ id: "t" + i })), { id: "nota", tipo: "caixa" }],
    altura: (W) => (W < 420 ? 380 : 330),
    passos: (function () {
      const grupo = (W, gi) => { const c = cols(W, 2, 10); return { x: c[gi % 2].x, w: c[gi % 2].w, y: 26 + Math.floor(gi / 2) * 130 }; };
      return [
        { t: "A tabela df", d: "As 8 primeiras das 362 linhas respondidas: a matéria de cada resposta e se acertou.", foco: "df",
          layout: (W) => { const o = { nota: { x: P, y: 290, w: larg(W), o: 0 } }; D11.forEach((_, i) => { o["d" + i] = { x: P, y: 10 + i * 32, w: larg(W), o: 1 }; }); G11.forEach((g, i) => { const p = grupo(W, i); o["g" + i] = { x: p.x, y: p.y - 20, o: 0, html: g }; }); T11.forEach((t, i) => { o["t" + i] = { x: P, y: 10 + i * 34, w: larg(W), o: 0 }; }); return o; } },
        { t: ".groupby(\"materia\")", d: "As linhas da mesma matéria vão para o mesmo grupo, igual ao GROUP BY.", foco: "gb", feitos: ["df"], escalonar: 40, ease: "outBack(1.1)",
          layout: (W) => { const o = {}, conta = {}; D11.forEach(([m], i) => { const gi = G11.indexOf(m), p = grupo(W, gi), k = (conta[m] = (conta[m] || 0) + 1) - 1; o["d" + i] = { x: p.x, y: p.y + 4 + k * 32, w: p.w, html: `<span class="fr">${D11[i][1] ? "True" : "False"}</span>` }; }); G11.forEach((_, i) => { o["g" + i] = { o: 1 }; }); return o; } },
        { t: "[\"acertou\"].mean()", d: "Em cada grupo, a média de True e False: True conta 1, False conta 0. Informática nestas 8 linhas: 1 acerto em 3 = 0,333.", foco: "mean", feitos: ["df", "gb", "col"],
          layout: (W) => { const o = {}, m = { "Informática": "0,333", "Língua Portuguesa": "0,5", "Raciocínio Lógico": "0,0", "Banco de Dados": "0,0" }; G11.forEach((g, i) => { o["g" + i] = { html: `${g}: <b>${m[g]}</b>` }; }); return o; } },
        { t: "Com as 362 linhas, vezes 100", d: "O mesmo cálculo na tabela inteira, multiplicado por 100, dá a taxa de cada matéria. É a consulta de três tabelas da Junção, em uma linha.", foco: "x100", feitos: ["df", "gb", "col", "mean"], escalonar: 50,
          layout: () => { const o = {}; D11.forEach((_, i) => { o["d" + i] = { o: 0 }; }); G11.forEach((_, i) => { o["g" + i] = { o: 0 }; }); T11.forEach(([n, v], i) => { o["t" + i] = { o: 1, html: `<span>${n}</span><span class="fr">${dec(v.toFixed(1))}</span>` }; }); return o; } },
        { t: "idxmin(): o rótulo do menor", d: "<code>idxmin()</code> não devolve o número 40,4: devolve o rótulo da linha, \"Direito Administrativo\". É a matéria que mais derruba a nota.", foco: "idx", feitos: ["df", "gb", "col", "mean", "x100"],
          layout: () => ({ t0: { c: "foco", pulso: true }, nota: { o: 1, y: 230, html: "<b>pior</b>\"Direito Administrativo\"" } }) },
      ];
    })(),
  };

  // ---------------- 12 · Agendador: revisão com FSRS ----------------
  const DIAS = [0, 1, 3, 8, 14, 30, 57];
  D.s12 = {
    titulo: "Como o FSRS decide quando a questão volta",
    rotuloCodigo: "O que o algoritmo faz",
    codigo: { partes: [{ id: "nova", texto: "cartao = createEmptyCard(hoje)" }, { id: "nota", texto: "\nopcoes = f.repeat(cartao, hoje)\n# Errei, Difícil, Bom, Fácil" }, { id: "bom", texto: "\ncartao = opcoes[Bom].card" }, { id: "grava", texto: "\n\nINSERT INTO revisoes\nVALUES (35, proxima, estabilidade,\n        dificuldade);" }] },
    pecas: [{ id: "eixo", tipo: "caixa" }, ...DIAS.map((d) => ({ id: "x" + d, tipo: "rotulo", html: d === 0 ? "hoje" : d + " d" })),
      { id: "c", tipo: "chip" }, ...["Errei", "Difícil", "Bom", "Fácil"].map((n, i) => ({ id: "o" + i, tipo: "chip" })), { id: "h", tipo: "rotulo" }, { id: "nota", tipo: "caixa" }],
    altura: (W) => (W < 520 ? 330 : 300),
    passos: (function () {
      // régua em raiz quadrada: os primeiros dias ficam legíveis e o dia 57 ainda cabe
      const X = (W, d) => P + 14 + (Math.sqrt(d) / Math.sqrt(57)) * (larg(W) - 44);
      const yE = 176, cw = 64;
      const carta = (W, d, extra) => Object.assign({ x: Math.max(P, Math.min(W - P - cw, X(W, d) - cw / 2)), y: yE - 80, w: cw }, extra);
      return [
        { t: "Uma questão nova", d: "A Joana errou a questão 35. Ela vira um cartão novo, que o algoritmo ainda não conhece. A régua mostra os dias a partir de hoje.", foco: "nova",
          layout: (W) => { const o = { eixo: { x: P, y: yE, w: larg(W), o: 1, c: "traco" }, c: carta(W, 0, { o: 1, html: "<b>35</b><small>nova</small>" }), h: { x: P, y: yE + 34, o: 0 }, nota: { x: P, y: yE + 58, w: larg(W), o: 0 } };
            DIAS.forEach((d) => { o["x" + d] = { x: Math.max(P, X(W, d) - 12), y: yE + 8, o: 1 }; });
            const c4 = cols(W, 4, 6); ["Errei", "Difícil", "Bom", "Fácil"].forEach((n, i) => { o["o" + i] = { x: c4[i].x, y: 0, w: c4[i].w, o: 0, html: `<b>${[1, 2, 3, 8][i]} d</b><small>${n}</small>` }; }); return o; } },
        { t: "Quatro respostas possíveis", d: "Antes de você responder, o FSRS calcula quando o cartão voltaria em cada caso: Errei, 1 dia; Difícil, 2; Bom, 3; Fácil, 8.", foco: "nota", feitos: ["nova"], escalonar: 90,
          layout: () => ({ o0: { y: 6, o: 1 }, o1: { y: 6, o: 1 }, o2: { y: 6, o: 1 }, o3: { y: 6, o: 1 } }) },
        { t: "Você escolhe Bom", d: "O cartão vai para daqui a 3 dias. Ele fica de fora da sua revisão até lá.", foco: "bom", feitos: ["nova", "nota"],
          layout: (W) => ({ o0: { o: 0.3 }, o1: { o: 0.3 }, o3: { o: 0.3 }, o2: { c: "ok" }, c: carta(W, 3, { html: "<b>35</b><small>dia 3</small>", c: "ok" }) }) },
        { t: "Bom de novo: 14 dias", d: "Acertou no dia 3. A memória ficou mais estável, e o intervalo cresce: o próximo é em 14 dias.", foco: "bom", feitos: ["nova", "nota"],
          layout: (W) => ({ o0: { o: 0 }, o1: { o: 0 }, o2: { o: 0 }, o3: { o: 0 }, c: carta(W, 14, { html: "<b>35</b><small>dia 14</small>" }), h: { o: 1, html: "Bom, Bom: 3 dias, depois 14" } }) },
        { t: "Bom mais uma vez: 57 dias", d: "Cada acerto no dia certo empurra o próximo para mais longe: 3, 14, 57. Você estuda menos o que já sabe e mais o que está por esquecer.", foco: "bom", feitos: ["nova", "nota"],
          layout: (W) => ({ c: carta(W, 57, { html: "<b>35</b><small>dia 57</small>", pulso: true }), h: { html: "Bom, Bom, Bom: 3, 14, 57 dias" } }) },
        { t: "Se fosse sempre Difícil", d: "Com Difícil, o intervalo cresce devagar: 2, 4, 9, 15, 23 dias. A questão volta mais vezes, porque a memória está fraca.", feitos: ["nova", "nota", "bom"],
          layout: (W) => ({ c: carta(W, 23, { html: "<b>35</b><small>dia 23</small>", c: "aviso" }), h: { html: "Difícil, cinco vezes: 2, 4, 9, 15, 23 dias" } }) },
        { t: "A agenda vai para o banco", d: "O resultado vira uma linha da tabela revisoes: a data da próxima revisão e os dois números do algoritmo, estabilidade e dificuldade.", foco: "grava", feitos: ["nova", "nota", "bom"],
          layout: () => ({ c: { c: "ok", html: "<b>35</b><small>gravada</small>" }, nota: { o: 1, html: "<b>revisoes</b>questao_id 35 · proxima · estabilidade · dificuldade" } }) },
      ];
    })(),
  };

  // ---------------- 13 · Acelerador: índice (medições reais: 100 mil linhas no PGlite) ----------------
  const H13 = [[33, 34], [34, 35], [35, 36], [94, 35], [95, 36], [154, 35], [155, 36], [214, 35]];
  const I13 = [[34, 33], [35, 34], [35, 94], [35, 154], [35, 214], [36, 35]];
  D.s13 = {
    titulo: "Como o índice evita ler a tabela inteira",
    codigo: { partes: [{ id: "sel", texto: "SELECT COUNT(*) FROM historico\nWHERE questao_id = 35;" }, { id: "idx", texto: "\n\nCREATE INDEX idx_historico_questao\n  ON historico (questao_id);" }, { id: "exp", texto: "\n\nEXPLAIN ANALYZE\nSELECT COUNT(*) FROM historico\nWHERE questao_id = 35;" }, { id: "ins", texto: "\n\nINSERT INTO historico VALUES (...);" }] },
    pecas: [{ id: "th", tipo: "rotulo", html: "tabela historico" }, { id: "ti", tipo: "rotulo", html: "o índice" },
      ...H13.map(([l, q]) => ({ id: "h" + l, html: `<span class="fr2">linha ${l}</span><span class="fr">q ${q}</span>` })),
      ...I13.map(([q, l], k) => ({ id: "i" + k, html: `<span>q ${q}</span><span class="fr2">→ linha ${l}</span>` })),
      { id: "cont", tipo: "caixa" }, { id: "ta", tipo: "chip" }, { id: "td", tipo: "chip" }, { id: "novo", html: `<span class="fr2">linha 100.001</span><span class="fr">q 35</span>` }, { id: "inovo", html: `<span>q 35</span><span class="fr2">→ 100.001</span>` }],
    altura: (W) => (W < 520 ? 450 : 420),
    passos: (function () {
      const geo = (W) => { const w = (larg(W) - 10) / 2; return { xa: P, xb: P + w + 10, w, y: (k) => 28 + k * 32, yc: 292, yt: W < 520 ? 366 : 352 }; };
      const linhas = (W, extra) => { const g = geo(W), o = {}; H13.forEach(([l], k) => { o["h" + l] = Object.assign({ x: g.xa, y: g.y(k), w: g.w, o: 1, c: "" }, extra ? extra(l, k) : {}); }); return o; };
      return [
        { t: "A pergunta", d: "Quantas respostas a questão 35 tem no histórico? Aqui aparecem 8 das 100 mil linhas; a questão de cada uma está à direita.", foco: "sel",
          layout: (W) => { const g = geo(W), o = { th: { x: g.xa, y: 6, o: 1 }, ti: { x: g.xb, y: 6, o: 0 }, cont: { x: P, y: g.yc, w: larg(W), o: 0 }, ta: { x: P, y: g.yt, w: larg(W) / 2 - 5, o: 0 }, td: { x: P + larg(W) / 2 + 5, y: g.yt, w: larg(W) / 2 - 5, o: 0 }, novo: { x: g.xa, y: g.yc, w: g.w, o: 0 }, inovo: { x: g.xb, y: g.yc, w: g.w, o: 0 } };
            I13.forEach((_, k) => { o["i" + k] = { x: g.xb + 20, y: g.y(k), w: g.w, o: 0 }; }); return Object.assign(o, linhas(W)); } },
        { t: "Sem índice: ler tudo", d: "O banco não sabe onde estão as linhas da questão 35. Lê as 100 mil, uma por uma, e separa as que servem. No plano, isso aparece como <b>Seq Scan</b>.", foco: "sel", escalonar: 70,
          layout: (W) => Object.assign(linhas(W, (l, k) => ({ c: H13[k][1] === 35 ? "ok" : "foco" })), { cont: { o: 1, html: "<b>Seq Scan</b>leu 100.000 linhas para achar 1.667" } }) },
        { t: "Quanto custou", d: "Medido com EXPLAIN ANALYZE no PostgreSQL deste laboratório: cerca de 11 milissegundos. Parece pouco, mas o painel faz essa consulta para cada questão, toda vez que abre.", foco: "exp",
          layout: () => ({ ta: { o: 1, html: "<b>≈ 11 ms</b><small>sem índice</small>", pulso: true } }) },
        { t: "CREATE INDEX", d: "O índice é uma lista à parte, em ordem de questão, que diz em que linha está cada uma. Como o índice remissivo de um livro.", foco: "idx", escalonar: 60,
          layout: (W) => { const g = geo(W), o = linhas(W, () => ({ c: "" })); I13.forEach((_, k) => { o["i" + k] = { x: g.xb, y: g.y(k), w: g.w, o: 1, c: "" }; }); o.ti = { o: 1 }; o.cont = { o: 0 }; return o; } },
        { t: "Com índice: direto às linhas", d: "O banco procura 35 no índice, que está em ordem, e vai direto às linhas certas. No plano, aparece <b>Index Scan</b> (ou Bitmap Index Scan).", foco: "exp", escalonar: 50,
          layout: (W) => { const o = linhas(W, (l, k) => ({ c: H13[k][1] === 35 ? "ok" : "apagado" })); I13.forEach(([q], k) => { o["i" + k] = { c: q === 35 ? "ok" : "apagado" }; }); o.cont = { o: 1, html: "<b>Index Scan</b>foi direto às 1.667 linhas da questão 35" }; return o; } },
        { t: "Quanto custou agora", d: "Cerca de 2,5 milissegundos: umas 4 vezes mais rápido. Em tabelas de milhões de linhas, a diferença vira a de minutos para segundos.", foco: "exp",
          layout: () => ({ td: { o: 1, c: "ok", html: "<b>≈ 2,5 ms</b><small>com índice</small>", pulso: true } }) },
        { t: "O preço do índice", d: "Cada linha nova agora é gravada em dois lugares: na tabela e no índice. Por isso não se cria índice em toda coluna, só nas que as consultas mais usam.", foco: "ins",
          layout: () => ({ cont: { o: 0 }, novo: { o: 1, c: "aviso", pulso: true }, inovo: { o: 1, c: "aviso", pulso: true } }) },
      ];
    })(),
  };

  // ---------------- 14 · Transações: tudo ou nada ----------------
  D.s14 = {
    titulo: "Como a transação grava tudo ou nada",
    codigo: { partes: [{ id: "b1", texto: "BEGIN;" }, { id: "i8", texto: "\nINSERT INTO materias VALUES (8, 'Economia', ...);" }, { id: "iq", texto: "\nINSERT INTO questoes VALUES (61, 8, ...);\nINSERT INTO questoes VALUES (62, 8, ...);" }, { id: "c1", texto: "\nCOMMIT;" },
      { id: "b2", texto: "\n\nBEGIN;" }, { id: "i9", texto: "\nINSERT INTO materias VALUES (9, ...);" }, { id: "q99", texto: "\nINSERT INTO questoes VALUES (63, 99, ...);" }, { id: "rb", texto: "\n-- erro: o banco faz ROLLBACK" }] },
    pecas: [{ id: "tx", tipo: "rotulo", html: "dentro da transação · ainda não gravado" }, { id: "bd", tipo: "rotulo", html: "no banco · gravado" },
      { id: "m8", html: "<span>matéria 8</span><span class=\"fr\">Economia</span>" }, { id: "q61", html: "<span>questão 61</span><span class=\"fr\">matéria 8</span>" }, { id: "q62", html: "<span>questão 62</span><span class=\"fr\">matéria 8</span>" },
      { id: "m9", html: "<span>matéria 9</span><span class=\"fr\">Contab. Pública</span>" }, { id: "q63", html: "<span>questão 63</span><span class=\"fr\">matéria 99</span>" }, { id: "nota", tipo: "caixa" }],
    altura: (W) => (W < 520 ? 380 : 300),
    passos: (function () {
      // no computador, pendente à esquerda e gravado à direita; no celular, um em cima do outro
      const geo = (W) => { const e = W < 520, w = e ? larg(W) : (larg(W) - 12) / 2; return { xa: P, xb: e ? P : P + w + 12, w, y: (k) => 34 + k * 36, yb: (k) => (e ? 186 : 34) + k * 36, lb: e ? 160 : 8, yn: e ? 300 : 176 }; };
      return [
        { t: "BEGIN abre a transação", d: "Daqui até o COMMIT, nada fica gravado para valer. O banco anota tudo à parte.", foco: "b1",
          layout: (W) => { const g = geo(W); return { tx: { x: g.xa, y: 8, o: 1 }, bd: { x: g.xb, y: g.lb, o: 1 }, m8: { x: g.xa - 20, y: g.y(0), w: g.w, o: 0 }, q61: { x: g.xa - 20, y: g.y(1), w: g.w, o: 0 }, q62: { x: g.xa - 20, y: g.y(2), w: g.w, o: 0 }, m9: { x: g.xa - 20, y: g.y(0), w: g.w, o: 0 }, q63: { x: g.xa - 20, y: g.y(1), w: g.w, o: 0 }, nota: { x: P, y: g.yn, w: larg(W), o: 0 } }; } },
        { t: "A matéria entra, mas fica pendente", d: "O INSERT da matéria 8 deu certo, mas só dentro da transação. Quem consultar o banco agora ainda não vê a Economia.", foco: "i8", feitos: ["b1"],
          layout: (W) => ({ m8: { x: geo(W).xa, o: 1, c: "aviso" } }) },
        { t: "As duas questões também", d: "As questões 61 e 62 entram na mesma transação. Três linhas pendentes.", foco: "iq", feitos: ["b1", "i8"], escalonar: 90,
          layout: (W) => ({ q61: { x: geo(W).xa, o: 1, c: "aviso" }, q62: { x: geo(W).xa, o: 1, c: "aviso" } }) },
        { t: "COMMIT grava tudo de uma vez", d: "No COMMIT, as três linhas passam a existir para todo mundo, juntas. Não há um momento em que a matéria exista sem as questões.", foco: "c1", feitos: ["b1", "i8", "iq"], escalonar: 80, dur: 800,
          layout: (W) => { const g = geo(W); return { m8: { x: g.xb, y: g.yb(0), c: "ok" }, q61: { x: g.xb, y: g.yb(1), c: "ok" }, q62: { x: g.xb, y: g.yb(2), c: "ok" } }; } },
        { t: "Outra transação: a matéria 9", d: "Uma nova carga começa. A matéria 9 entra, pendente.", foco: "i9", feitos: ["b1", "i8", "iq", "c1", "b2"],
          layout: (W) => { const g = geo(W); return { m8: { o: 0.45 }, q61: { o: 0.45 }, q62: { o: 0.45 }, m9: { x: g.xa, o: 1, c: "aviso" } }; } },
        { t: "A questão 63 aponta para a matéria 99", d: "A matéria 99 não existe: a trava da chave estrangeira recusa a linha. A transação inteira fica condenada.", foco: "q99", feitos: ["b2", "i9"],
          layout: (W) => ({ q63: { x: geo(W).xa, o: 1, c: "ruim", pulso: true }, nota: { o: 1, c: "ruim", html: "<b>Erro</b><code>violates foreign key constraint</code>" } }) },
        { t: "ROLLBACK: nada fica", d: "O banco desfaz tudo desde o BEGIN. A matéria 9, que tinha entrado, sai junto. O banco continua inteiro, sem metade de carga.", foco: "rb", feitos: ["b2", "i9", "q99"], escalonar: 80,
          layout: () => ({ m9: { x: -40, o: 0 }, q63: { x: -40, o: 0 }, nota: { c: "ok", html: "<b>Resultado</b>SELECT COUNT(*) FROM materias WHERE id = 9 → 0" } }) },
      ];
    })(),
  };

  // ---------------- 15 · Portaria: visões e permissões ----------------
  D.s15 = {
    titulo: "Como a visão e a permissão mostram só o necessário",
    codigo: { partes: [{ id: "view", texto: "CREATE VIEW painel_materias AS\nSELECT m.nome AS materia, ..., taxa\nFROM respostas r JOIN ...;" }, { id: "role", texto: "\n\nCREATE ROLE leitor;" }, { id: "grant", texto: "\nGRANT SELECT ON painel_materias\n  TO leitor;" }, { id: "set", texto: "\n\nSET ROLE leitor;\nSELECT * FROM painel_materias;\nSELECT * FROM respostas;" }] },
    pecas: [{ id: "alunos", tipo: "caixa", html: "<b>alunos</b>nome, e-mail" }, { id: "resp", tipo: "caixa", html: "<b>respostas</b>quem, quando, acertou" }, { id: "quest", tipo: "caixa", html: "<b>questoes + materias</b>enunciado, matéria" },
      { id: "vis", tipo: "caixa" }, { id: "leitor", tipo: "chip", html: "<b>leitor</b><small>marketing</small>" }, { id: "nota", tipo: "caixa" }],
    altura: (W) => (W < 520 ? 440 : 330),
    passos: (function () {
      const geo = (W) => { const c = cols(W, 3, 8), estreito = W < 520; return { c, yv: estreito ? 130 : 92, wv: estreito ? larg(W) - 96 : larg(W) * 0.6, xl: estreito ? W - P - 86 : P + larg(W) * 0.6 + 16, yn: estreito ? 340 : 246 }; };
      const VIS = "<b>painel_materias</b>Direito Administrativo · 40,4<br>Raciocínio Lógico · 47,4<br>Língua Portuguesa · 50,0<br>Banco de Dados · 50,7<br>Estatística · 50,9<br>Informática · 53,6";
      return [
        { t: "As tabelas de verdade", d: "Os dados ficam nas tabelas. Uma delas tem nome e e-mail de pessoas: dado pessoal, que não deve circular à toa.", foco: "view",
          layout: (W) => { const g = geo(W); return { alunos: { x: g.c[0].x, y: 10, w: g.c[0].w, o: 1, c: "aviso" }, resp: { x: g.c[1].x, y: 10, w: g.c[1].w, o: 1 }, quest: { x: g.c[2].x, y: 10, w: g.c[2].w, o: 1 }, vis: { x: P, y: g.yv + 20, w: g.wv, o: 0, html: VIS }, leitor: { x: g.xl, y: g.yv + 30, w: 86, o: 0 }, nota: { x: P, y: g.yn, w: larg(W), o: 0 } }; } },
        { t: "CREATE VIEW guarda a consulta", d: "A visão junta respostas, questões e matérias e entrega só três colunas: matéria, respostas e taxa. Nenhum nome, nenhum e-mail.", foco: "view",
          layout: (W) => ({ vis: { y: geo(W).yv, o: 1, c: "ok", pulso: true }, alunos: { c: "apagado" } }) },
        { t: "Ela roda na hora", d: "A visão não guarda os números: guarda a consulta. Cada SELECT nela calcula de novo com os dados de agora.", foco: "view",
          layout: () => ({ resp: { c: "foco" }, quest: { c: "foco" } }) },
        { t: "CREATE ROLE leitor", d: "Um usuário novo do banco, para o time de marketing. Ainda não pode ver nada.", foco: "role", feitos: ["view"],
          layout: (W) => ({ resp: { c: "" }, quest: { c: "" }, leitor: { y: geo(W).yv, o: 1, pulso: true } }) },
        { t: "GRANT SELECT só na visão", d: "O leitor recebe uma única permissão: ler a visão. As tabelas continuam fechadas para ele.", foco: "grant", feitos: ["view", "role"],
          layout: () => ({ leitor: { c: "ok" }, nota: { o: 1, c: "ok", html: "<b>leitor</b>pode ler: painel_materias · não pode ler: alunos, respostas, questoes, materias" } }) },
        { t: "Como leitor, a tabela fecha", d: "Com SET ROLE leitor, a visão abre normalmente; já SELECT * FROM respostas responde “permissão negada”.", foco: "set", feitos: ["view", "role", "grant"],
          layout: () => ({ alunos: { c: "ruim" }, resp: { c: "ruim", pulso: true }, quest: { c: "ruim" }, nota: { c: "ruim", html: "<b>SELECT * FROM respostas</b><code>permission denied for table respostas</code>" } }) },
      ];
    })(),
  };

  // ---------------- 16 · Cofre: backup e restauração ----------------
  const T16 = [["materias", 8], ["alunos", 12], ["questoes", 62], ["respostas", 382], ["revisoes", 5]];
  D.s16 = {
    titulo: "Como o backup recria o banco depois de um desastre",
    rotuloCodigo: "O que acontece",
    codigo: { partes: [{ id: "bk", texto: "-- 1. backup: gera o arquivo\nbackup.sql" }, { id: "fora", texto: "\n-- 2. guardar em outro lugar" }, { id: "drop", texto: "\n\nDROP TABLE respostas CASCADE;" }, { id: "rest", texto: "\n\n-- 3. restaurar: apagar e rodar\n--    o backup.sql de novo" }, { id: "conf", texto: "\n-- 4. conferir as contagens" }] },
    pecas: [{ id: "rb", tipo: "rotulo", html: "o banco" }, { id: "ra", tipo: "rotulo", html: "backup.sql" },
      ...T16.map(([t, n]) => ({ id: "b_" + t, html: `<span>${t}</span><span class="fr">${n}</span>` })), { id: "vis", html: "<span>+ visão e índice</span>" },
      { id: "arq", tipo: "caixa" }, { id: "nota", tipo: "caixa" }],
    altura: (W) => (W < 520 ? 360 : 300),
    passos: (function () {
      const geo = (W) => { const w = (larg(W) - 14) / 2; return { xa: P, xb: P + w + 14, w, y: (k) => 30 + k * 34, yn: W < 520 ? 246 : 240 }; };
      const banco = (W, extra) => { const g = geo(W), o = {}; T16.forEach(([t], k) => { o["b_" + t] = Object.assign({ x: g.xa, y: g.y(k), w: g.w, o: 1, c: "" }, extra ? extra(t) : {}); }); o.vis = Object.assign({ x: g.xa, y: g.y(5), w: g.w, o: 1, c: "" }, extra ? extra("vis") : {}); return o; };
      return [
        { t: "O banco, como está", d: "Cinco tabelas, a visão do painel, o índice e o usuário leitor. É isso que um backup precisa recriar.", foco: "bk",
          layout: (W) => { const g = geo(W); return Object.assign(banco(W), { rb: { x: g.xa, y: 6, o: 1 }, ra: { x: g.xb, y: 6, o: 0 }, arq: { x: g.xb, y: 30, w: g.w, h: 196, o: 0 }, nota: { x: P, y: g.yn, w: larg(W), o: 0 } }); } },
        { t: "O backup: tudo vira SQL", d: "O laboratório escreve um arquivo com os CREATE TABLE, as regras, um INSERT por linha, o índice, a visão e as permissões. Rodar esse arquivo recria o banco inteiro.", foco: "bk",
          layout: () => ({ ra: { o: 1 }, arq: { o: 1, c: "ok", pulso: true, html: "<b>backup.sql</b>CREATE TABLE materias ...<br>INSERT INTO materias ... × 8<br>INSERT INTO respostas ... × 382<br>CREATE INDEX idx_respostas_aluno ...<br>CREATE VIEW painel_materias ...<br>GRANT SELECT ... TO leitor" } }) },
        { t: "Guardar em outro lugar", d: "Backup no mesmo servidor do banco morre junto com ele. A cópia vai para outro disco ou para a nuvem.", foco: "fora", feitos: ["bk"],
          layout: () => ({ ra: { html: "backup.sql · fora daqui" } }) },
        { t: "O desastre", d: "Alguém roda DROP TABLE respostas CASCADE. Somem 382 linhas e, junto, a visão que dependia delas.", foco: "drop", feitos: ["bk", "fora"],
          layout: (W) => banco(W, (t) => (t === "respostas" || t === "vis" ? { c: "ruim cortado", o: 0.5 } : {})) },
        { t: "Restaurar: apagar o que sobrou", d: "Para não misturar versões, a restauração apaga o que restou e começa limpa.", foco: "rest", feitos: ["bk", "fora", "drop"], escalonar: 50,
          layout: (W) => banco(W, () => ({ o: 0, x: -30 })) },
        { t: "Rodar o backup de novo", d: "O arquivo roda do começo ao fim: as tabelas voltam, os dados voltam, e o índice, a visão e o leitor também.", foco: "rest", feitos: ["bk", "fora", "drop"], escalonar: 70, dur: 800,
          layout: (W) => banco(W, () => ({ o: 1, c: "ok" })) },
        { t: "Conferir: o teste que importa", d: "As contagens de antes e de depois precisam bater. Backup que nunca foi restaurado é só esperança.", foco: "conf", feitos: ["bk", "fora", "drop", "rest"],
          layout: () => ({ nota: { o: 1, c: "ok", html: "<b>Antes e depois</b>materias 8 · alunos 12 · questoes 62 · respostas 382: iguais" } }) },
      ];
    })(),
  };

  // ---------------- 17 · Apresentação: do número à decisão ----------------
  const M17 = [["Direito Administrativo", 40.4], ["Raciocínio Lógico", 47.4], ["Língua Portuguesa", 50.0], ["Banco de Dados", 50.7], ["Estatística", 50.9], ["Informática", 53.6]];
  const MES17 = [["ago/26", 48.6, 148], ["set/26", 52.2, 136], ["out/26", 44.9, 78]];
  D.s17 = {
    titulo: "Como o resultado vira uma apresentação",
    codigo: { partes: [{ id: "capa", texto: "SELECT (SELECT COUNT(*) FROM alunos),\n       COUNT(*), ROUND(AVG(...), 1)\nFROM respostas\nWHERE resposta IS NOT NULL;" }, { id: "vis", texto: "\n\nSELECT * FROM painel_materias\nORDER BY taxa;" }, { id: "mes", texto: "\n\nSELECT to_char(respondida_em, 'YYYY-MM'),\n       ... GROUP BY 1 ORDER BY 1;" }, { id: "rec", texto: "\n\n-- e o recado: o que fazer" }] },
    pecas: [{ id: "k0", tipo: "chip" }, { id: "k1", tipo: "chip" }, { id: "k2", tipo: "chip" }, ...M17.map((m, i) => ({ id: "m" + i })), ...MES17.map((m, i) => ({ id: "t" + i, tipo: "chip" })), { id: "rec", tipo: "caixa" }, { id: "nota", tipo: "rotulo" }],
    altura: (W) => (W < 520 ? 470 : 460),
    passos: (function () {
      const geo = (W) => { const c3 = cols(W, 3, 8); return { c3, yb: 92, wb: larg(W), yt: W < 520 ? 312 : 92 + 6 * 32 + 14, rec: W < 520 ? 312 : 92 + 6 * 32 + 14 }; };
      const barra = (n, v, W) => `<span style="flex:none;width:${Math.round((v / 60) * Math.max(80, larg(W) - 230))}px;height:12px;border-radius:3px;background:var(--tinta)"></span><span>${n}</span><span class="fr">${dec(v.toFixed(1))}</span>`;
      return [
        { t: "O que a chefia quer saber", d: "Como está o desempenho, onde está o problema e o que fazer. A apresentação responde nessa ordem: capa, evidência, recomendação.", foco: "capa",
          layout: (W) => { const g = geo(W), o = { nota: { x: P, y: 10, o: 1, html: "três partes: capa · evidência · recomendação" }, rec: { x: P, y: g.rec, w: larg(W), o: 0 } };
            ["k0", "k1", "k2"].forEach((k, i) => { o[k] = { x: g.c3[i].x, y: 10, w: g.c3[i].w, o: 0 }; });
            M17.forEach(([n, v], i) => { o["m" + i] = { x: P, y: g.yb + i * 32, w: g.wb, o: 0, html: barra(n, v, W) }; });
            MES17.forEach(([m, v, r], i) => { o["t" + i] = { x: g.c3[i].x, y: g.yt, w: g.c3[i].w, o: 0, html: `<b>${dec(v.toFixed(1))}%</b><small>${m} · ${r} resp.</small>` }; }); return o; } },
        { t: "Os números de capa", d: "O tamanho do que foi analisado, numa linha: 12 alunos, 362 respostas, 49,2% de acerto.", foco: "capa", escalonar: 90,
          layout: () => ({ nota: { o: 0 }, k0: { o: 1, html: "<b>12</b><small>alunos</small>" }, k1: { o: 1, html: "<b>362</b><small>respostas</small>" }, k2: { o: 1, html: "<b>49,2%</b><small>de acerto</small>" } }) },
        { t: "A evidência: por matéria", d: "A visão do painel, em ordem crescente de taxa. A primeira barra é o achado: Direito Administrativo, com 40,4%.", foco: "vis", feitos: ["capa"], escalonar: 70,
          layout: () => { const o = {}; M17.forEach((_, i) => { o["m" + i] = { o: 1, c: i === 0 ? "aviso" : "" }; }); return o; } },
        { t: "A evolução no tempo", d: "Agosto 48,6%, setembro 52,2%, outubro 44,9%. Outubro tem só 78 respostas: o mês não acabou, então a queda pede cautela.", foco: "mes", feitos: ["capa", "vis"], escalonar: 90,
          layout: (W) => { const o = {}; MES17.forEach((_, i) => { o["t" + i] = { o: 1, c: i === 2 ? "aviso" : "" }; }); if (W < 520) M17.forEach((_, i) => { o["m" + i] = { o: i === 0 ? 1 : 0.3 }; }); return o; } },
        { t: "A recomendação", d: "Sem ela, é só curiosidade. Uma frase com o que fazer, quanto e quando medir de novo.", foco: "rec", feitos: ["capa", "vis", "mes"],
          layout: (W) => { const o = { rec: { o: 1, c: "ok", pulso: true, html: "<b>Recomendação</b>Dobrar o tempo de Direito Administrativo por quatro semanas e medir de novo em novembro." } }; MES17.forEach((_, i) => { o["t" + i] = { o: W < 520 ? 0 : 1 }; }); if (W >= 520) o.rec.y = geo(W).rec + 70; return o; } },
      ];
    })(),
  };

  raiz.PASSOS_LAB = D;
})(typeof window !== "undefined" ? window : globalThis);
