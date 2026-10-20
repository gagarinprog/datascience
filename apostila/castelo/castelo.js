// Laboratório do Domínio: o Castelo de Dados.
// Uma sala à parte do mapa, que guia passo a passo a construção de um banco PostgreSQL de verdade.
// O banco roda no navegador (PGlite) e fica salvo no aparelho (IndexedDB). O Python roda no navegador (Pyodide).
// O roteiro das salas está em salas.js; a correção pelo resultado e a tradução dos erros, em comparar.js.
(function () {
  "use strict";
  const C = window.CASTELO, Cmp = window.Comparar;
  const PGLITE = "https://cdn.jsdelivr.net/npm/@electric-sql/pglite@0.5.8/dist/index.js";
  const PYODIDE = "https://cdn.jsdelivr.net/pyodide/v314.0.7/full/";
  const FSRS_URL = "https://cdn.jsdelivr.net/npm/ts-fsrs@5.4.2/dist/index.umd.js";
  const CHAVE = "dominio:castelo:v1";
  const palco = document.getElementById("lab-palco");

  // ---------- utilidades ----------
  const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const ler = () => { try { return Object.assign({ slides: {}, tarefas: {}, codigos: {}, niveis: {}, intros: {}, dominadas: {}, textos: {} }, JSON.parse(localStorage.getItem(CHAVE) || "{}")); } catch (e) { return { slides: {}, tarefas: {}, codigos: {}, niveis: {}, intros: {}, dominadas: {}, textos: {} }; } };
  let estado = ler();
  // "feitas" é só um resumo para o cartão do mapa, que não carrega o roteiro das salas
  const salvar = () => { try { estado.feitas = C.salas.filter(salaCompleta).length; localStorage.setItem(CHAVE, JSON.stringify(estado)); } catch (e) { /* sem armazenamento */ } };
  const reduz = () => !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const carregarScript = (src) => new Promise((ok, erro) => { const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = () => erro(new Error("Não consegui baixar " + src)); document.head.appendChild(s); });

  const salaPorId = (id) => C.salas.find((s) => s.id === id);
  const indice = (s) => C.salas.indexOf(s);
  const salaCompleta = (s) => !!estado.dominadas[s.id] || s.tarefas.every((t) => estado.tarefas[`${s.id}.${t.id}`]);
  const blocoDe = (id) => C.blocos.find((b) => b.id === id);
  const primeiraDoBloco = (s) => C.salas.find((x) => x.bloco === s.bloco) === s;
  const ultimaDoBloco = (b) => C.salas.filter((x) => x.bloco === b).at(-1);
  const blocoAnterior = (b) => C.blocos[C.blocos.findIndex((x) => x.id === b) - 1];
  function liberada(s) {
    const i = indice(s);
    if (i === 0) return true;
    const ant = C.salas[i - 1];
    if (!salaCompleta(ant)) return false;
    if (primeiraDoBloco(s)) { const b = blocoAnterior(s.bloco); return !b || !!(estado.niveis[b.id] && estado.niveis[b.id].aprovado); }
    return true;
  }
  const proxima = () => C.salas.find((s) => !salaCompleta(s));
  const nivelDe = (b) => C.niveis.find((n) => n.id === b);
  // a única ação principal da tela inicial: a próxima sala, ou o nivelamento que a destrava
  function proximoDestino() {
    const s = proxima();
    if (!s) return { href: "#relatorio", texto: "Ver o relatório do castelo" };
    if (!liberada(s)) { const b = blocoAnterior(s.bloco); if (b && nivelDe(b.id)) return { href: `#nivel-${b.id}`, texto: `Fazer o nivelamento: ${nivelDe(b.id).nome}` }; }
    return { href: `#${s.id}`, texto: `${C.salas.some(salaCompleta) ? "Continuar" : "Começar"}: ${s.nome}` };
  }

  // ---------- o banco (PGlite) ----------
  let dbPromessa = null, emMemoria = false;
  function banco() {
    // salvo no aparelho (IndexedDB); onde o navegador não deixa guardar, o banco vive só nesta aba
    if (!dbPromessa) dbPromessa = import(PGLITE).then((m) => m.PGlite.create("idb://dominio-castelo").catch(() => { emMemoria = true; return m.PGlite.create(); }));
    return dbPromessa;
  }
  // divide o SQL em comandos, respeitando aspas e comentários
  function dividir(sql) {
    const out = []; let atual = "", i = 0;
    while (i < sql.length) {
      const c = sql[i], d = sql[i + 1];
      if (c === "-" && d === "-") { const f = sql.indexOf("\n", i); const fim = f < 0 ? sql.length : f; atual += sql.slice(i, fim); i = fim; continue; }
      if (c === "/" && d === "*") { const f = sql.indexOf("*/", i + 2); const fim = f < 0 ? sql.length : f + 2; atual += sql.slice(i, fim); i = fim; continue; }
      if (c === "'" || c === '"') { let j = i + 1; while (j < sql.length) { if (sql[j] === c) { if (sql[j + 1] === c) { j += 2; continue; } break; } j++; } atual += sql.slice(i, j + 1); i = j + 1; continue; }
      if (c === ";") { if (atual.trim()) out.push(atual.trim()); atual = ""; i++; continue; }
      atual += c; i++;
    }
    if (atual.replace(/--[^\n]*/g, "").trim()) out.push(atual.trim());
    return out.filter((x) => x.replace(/--[^\n]*/g, "").replace(/\/\*[\s\S]*?\*\//g, "").trim());
  }
  // executa comando por comando; para no primeiro erro; devolve o último resultado com colunas
  async function executar(sql) {
    const db = await banco();
    let ultimo = null, afetadas = 0;
    for (const cmd of dividir(sql)) {
      const r = await db.query(cmd, [], { rowMode: "array" });
      if (r.fields && r.fields.length) ultimo = r; else afetadas += r.affectedRows || 0;
    }
    return { ultimo, afetadas };
  }
  const consultar = async (sql) => (await (await banco()).query(sql, [], { rowMode: "array" })).rows;
  const objetos = async (sql) => { const r = await (await banco()).query(sql); return r.rows.map((x) => Object.fromEntries(Object.entries(x).map(([k, v]) => [k, v instanceof Date ? v.toISOString() : v]))); };
  let cargaTexto = null;
  async function carga() {
    if (!cargaTexto) cargaTexto = await fetch("../licoes/dados/estudo.sql").then((r) => { if (!r.ok) throw new Error("Não consegui ler o arquivo da carga."); return r.text(); });
    const sql = cargaTexto.split("\n").filter((l) => l.startsWith("INSERT INTO")).map((l) => l.replace(/;$/, " ON CONFLICT DO NOTHING;")).join("\n");
    await (await banco()).exec(sql);
  }
  async function aplicarEstado(s) {
    if (!s.estado) return;
    await (await banco()).exec(s.estado.replace("--CARGA--", ""));
    if (s.estado.includes("--CARGA--")) await carga();
  }
  async function reconstruir(ate) {
    const db = await banco();
    await db.exec("DROP TABLE IF EXISTS revisoes, respostas, alunos, questoes, materias CASCADE;");
    for (const s of C.salas) { if (indice(s) > ate) break; await aplicarEstado(s); }
  }
  async function tabelas() {
    return consultar("SELECT table_name, string_agg(column_name, ', ' ORDER BY ordinal_position) FROM information_schema.columns WHERE table_schema = 'public' GROUP BY table_name ORDER BY table_name");
  }

  // ---------- Python (Pyodide) ----------
  let pyPromessa = null, pacotes = {};
  function python() {
    if (!pyPromessa) pyPromessa = carregarScript(PYODIDE + "pyodide.js").then(() => window.loadPyodide({ indexURL: PYODIDE }));
    return pyPromessa;
  }
  async function prepararPython(t, sala) {
    const py = await python();
    for (const p of t.pacotes || []) if (!pacotes[p]) { await py.loadPackage(p); pacotes[p] = true; }
    py.runPython("import json");
    for (const d of t.dados || []) { py.globals.set("_json", JSON.stringify(await objetos(d.sql))); py.runPython(`${d.nome} = json.loads(_json)`); }
    for (const e of t.esperados || []) {
      const r = await consultar(e.sql);
      const v = e.forma === "valor" ? (r[0] ? r[0][0] : null) : r;
      py.globals.set("_json", JSON.stringify(v, (k, x) => (typeof x === "string" && /^-?\d+(\.\d+)?$/.test(x) ? Number(x) : typeof x === "bigint" ? Number(x) : x)));
      py.runPython(`${e.nome} = json.loads(_json)`);
    }
    // o que as tarefas anteriores da mesma sala criaram (funções, variáveis) volta a existir
    if (sala) for (const ant of sala.tarefas) {
      if (ant === t) break;
      if (ant.tipo !== "python") continue;
      for (const d of ant.dados || []) { py.globals.set("_json", JSON.stringify(await objetos(d.sql))); py.runPython(`${d.nome} = json.loads(_json)`); }
      if (ant.preparo) py.runPython(ant.preparo);
      try { py.runPython(estado.codigos[`${sala.id}.${ant.id}`] || ant.solucao); } catch (e) { py.runPython(ant.solucao); }
    }
    if (t.preparo) py.runPython(t.preparo);
    return py;
  }
  function erroPython(e) {
    const msg = String(e && e.message || e);
    const ultima = msg.trim().split("\n").filter(Boolean).pop() || msg;
    let m;
    if ((m = ultima.match(/^AssertionError: (.*)$/))) return { teste: true, texto: m[1] };
    if (/^AssertionError/.test(ultima)) return { teste: true, texto: "Um teste falhou." };
    if ((m = ultima.match(/^NameError: name '([^']+)' is not defined/))) return { texto: `O nome ${m[1]} não existe. Ele foi criado antes de ser usado? Confira a grafia.` };
    if (/^IndentationError/.test(ultima)) return { texto: "Erro de recuo: as linhas de um bloco (depois de dois-pontos) precisam de 4 espaços a mais." };
    if ((m = ultima.match(/^SyntaxError: (.*)$/))) return { texto: `Erro de escrita no Python: ${m[1]}. Confira dois-pontos, parênteses e aspas.` };
    if ((m = ultima.match(/^TypeError: (.*)$/))) return { texto: `Tipos que não combinam: ${m[1]}.` };
    if ((m = ultima.match(/^KeyError: (.*)$/))) return { texto: `A chave ${m[1]} não existe nesse dicionário.` };
    if (/^ZeroDivisionError/.test(ultima)) return { texto: "Divisão por zero: confira o caso da lista vazia." };
    return { texto: ultima };
  }

  // ---------- desenho do castelo ----------
  const PARTES = { fundacao: "Pedra fundamental", paredes: "Primeiros moradores", muralha: "Muralha das chaves", portao: "Portão das aspas", celeiro: "Celeiro da carga", torre: "Torre de vigia", salao: "Salão dos grupos", ponte: "Ponte das junções", oficina: "Oficina Python", relogio: "Relógio da execução", observatorio: "Observatório", arquivo: "Arquivo de memória" };
  function castelo() {
    const g = (p, corpo) => `<g class="parte" data-parte="${p}"><title>${PARTES[p] || "Bandeira"}</title>${corpo}</g>`;
    return `<svg class="cst-svg" viewBox="0 0 360 232" role="img" aria-label="O castelo, com as partes já construídas destacadas">
      <path class="cst-chao" d="M10 200 H350"/><path class="cst-agua" d="M36 210 H324"/>
      ${g("observatorio", `<rect x="64" y="84" width="26" height="56"/><path d="M62 84 A15 15 0 0 1 92 84 Z"/><path class="cst-det" d="M77 72 L86 64"/>`)}
      ${g("arquivo", `<rect x="96" y="100" width="34" height="40"/><path class="cst-det" d="M102 110 H124 M102 118 H124 M102 126 H124"/>`)}
      ${g("torre", `<rect x="270" y="66" width="26" height="74"/><path d="M266 66 L283 44 L300 66 Z"/>`)}
      ${g("relogio", `<circle cx="283" cy="86" r="7"/><path class="cst-det" d="M283 81 V86 H287"/>`)}
      ${g("salao", `<path d="M134 110 V92 H142 V98 H150 V92 H158 V98 H166 V92 H174 V98 H186 V92 H194 V98 H202 V92 H210 V98 H218 V92 H226 V110 Z"/><rect class="cst-det" x="150" y="120" width="8" height="12"/><rect class="cst-det" x="176" y="120" width="8" height="12"/><rect class="cst-det" x="202" y="120" width="8" height="12"/>`)}
      ${g("paredes", `<rect x="130" y="110" width="100" height="78"/>`)}
      ${g("muralha", `<path d="M60 188 V140 H66 V134 H72 V140 H80 V134 H86 V140 H94 V134 H100 V140 H108 V134 H114 V140 H122 V134 H130 V188 Z"/><path d="M230 188 V140 H236 V134 H242 V140 H250 V134 H256 V140 H264 V134 H270 V140 H278 V134 H284 V140 H292 V134 H300 V188 Z"/>`)}
      ${g("portao", `<path d="M165 188 V164 A15 15 0 0 1 195 164 V188 Z"/>`)}
      ${g("celeiro", `<rect x="20" y="168" width="34" height="32"/><path d="M16 168 L37 152 L58 168 Z"/>`)}
      ${g("oficina", `<rect x="306" y="168" width="34" height="32"/><path d="M302 168 L323 154 L344 168 Z"/><rect x="330" y="146" width="6" height="14"/>`)}
      ${g("ponte", `<rect x="162" y="200" width="36" height="8"/><path class="cst-det" d="M165 188 L162 200 M195 188 L198 200"/>`)}
      ${g("fundacao", `<rect x="56" y="188" width="248" height="12"/><path class="cst-det" d="M96 188 V200 M140 188 V200 M180 188 V200 M220 188 V200 M264 188 V200"/>`)}
      ${g("bandeira", `<path class="cst-det" d="M180 92 V60"/><path d="M180 60 L200 66 L180 72 Z"/>`)}
    </svg>`;
  }
  function pintarCastelo(animarParte) {
    const svg = document.querySelector(".lab-castelo");
    if (!svg) return;
    const prontas = new Set(C.salas.filter(salaCompleta).map((s) => s.parte));
    if (C.salas.every(salaCompleta)) prontas.add("bandeira");
    svg.querySelectorAll(".parte").forEach((el) => el.classList.toggle("pronta", prontas.has(el.dataset.parte)));
    const prox = proxima();
    svg.querySelectorAll(".parte").forEach((el) => el.classList.toggle("proxima", !!prox && el.dataset.parte === prox.parte));
    const feitas = C.salas.filter(salaCompleta).length;
    const p = document.getElementById("lab-progresso");
    if (p) p.textContent = `${feitas} de ${C.salas.length} salas construídas`;
    // a parte nova sobe para o lugar (animação nativa do navegador; nenhuma biblioteca a mais)
    if (animarParte && !reduz()) {
      const el = svg.querySelector(`.parte[data-parte="${animarParte}"]`);
      if (el && el.animate) el.animate([{ opacity: 0.15, transform: "translateY(10px)" }, { opacity: 1, transform: "translateY(-2px)", offset: 0.7 }, { opacity: 1, transform: "translateY(0)" }], { duration: 900, easing: "cubic-bezier(0.2, 0, 0, 1)" });
    }
  }

  // ---------- componentes ----------
  function tabelaHTML(r, limite) {
    if (!r) return "";
    const n = r.rows.length, lim = limite || 50;
    const cel = (v) => v === null ? '<span class="nulo">NULL</span>' : esc(v instanceof Date ? Cmp.normalizar(v) : typeof v === "boolean" ? (v ? "true" : "false") : v);
    return `<div class="rolagem"><table class="tabela lab-res"><thead><tr>${r.fields.map((f) => `<th>${esc(f.name)}</th>`).join("")}</tr></thead><tbody>${r.rows.slice(0, lim).map((l) => `<tr>${l.map((v) => `<td>${cel(v)}</td>`).join("")}</tr>`).join("")}</tbody></table></div><p class="lab-nota">${n} ${n === 1 ? "linha" : "linhas"}${n > lim ? `; mostrando as ${lim} primeiras` : ""}.</p>`;
  }
  function retorno(el, tipo, cab, corpo) {
    el.hidden = false;
    el.className = "retorno " + tipo;
    el.innerHTML = `<span class="cab">${cab}</span>${corpo}`;
  }
  const tresPartes = (p) => `<ul class="tres-partes">${p.certo ? `<li><b>Certo até aqui:</b> ${p.certo}</li>` : ""}<li><b>O erro:</b> ${p.erro}</li>${p.passo ? `<li><b>Próximo passo:</b> ${p.passo}</li>` : ""}</ul>`;

  function editor(id, inicial, lingua) {
    return `<div class="lab-editor"><label class="visivel-leitor" for="ed-${id}">Seu código ${lingua}</label>
      <textarea id="ed-${id}" class="lab-codigo" wrap="off" spellcheck="false" autocapitalize="off" autocomplete="off" rows="${Math.max(4, inicial.split("\n").length + 1)}">${esc(inicial)}</textarea></div>`;
  }
  function ligarEditor(ta, aoRodar) {
    ta.addEventListener("keydown", (e) => {
      if (e.key === "Tab" && !e.shiftKey) { e.preventDefault(); const i = ta.selectionStart; ta.setRangeText("    ", i, ta.selectionEnd, "end"); }
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); aoRodar(); }
    });
    const ajustar = () => { ta.rows = Math.max(4, ta.value.split("\n").length + 1); };
    ta.addEventListener("input", ajustar);
  }

  // ---------- slides (apresentação curta) ----------
  function slides(s, aoFim) {
    let i = 0;
    const caixa = document.createElement("section");
    caixa.className = "lab-slides";
    caixa.setAttribute("aria-label", "Apresentação da sala");
    function pintar() {
      const sl = s.slides[i];
      caixa.innerHTML = `<p class="lab-slide-n">Apresentação · ${i + 1} de ${s.slides.length}</p><h3>${sl.titulo}</h3>${sl.texto ? `<p>${sl.texto}</p>` : ""}${sl.codigo ? `<pre class="lab-slide-cod"><code>${esc(sl.codigo)}</code></pre>` : ""}
        <div class="lab-slide-nav"><button type="button" class="botao" data-a="ant"${i === 0 ? " disabled" : ""}>Voltar</button><span class="lab-pontos">${s.slides.map((_, k) => `<i class="${k === i ? "atual" : k < i ? "feito" : ""}"></i>`).join("")}</span>${i < s.slides.length - 1 ? '<button type="button" class="botao primario" data-a="prox">Avançar</button>' : '<button type="button" class="botao primario" data-a="fim">Começar a construir</button>'}</div>
        <button type="button" class="lab-pular" data-a="fim">Pular a apresentação</button>`;
      caixa.querySelectorAll("[data-a]").forEach((b) => b.addEventListener("click", () => {
        if (b.dataset.a === "ant") i--; else if (b.dataset.a === "prox") i++; else { estado.slides[s.id] = true; salvar(); aoFim(); return; }
        pintar(); caixa.querySelector("h3").focus && caixa.querySelector("h3").setAttribute("tabindex", "-1"); caixa.querySelector("h3").focus();
      }));
    }
    caixa.addEventListener("keydown", (e) => { if (e.key === "ArrowRight" && i < s.slides.length - 1) { i++; pintar(); } if (e.key === "ArrowLeft" && i > 0) { i--; pintar(); } });
    pintar();
    return caixa;
  }

  // ---------- tarefas ----------
  // cada tarefa recebe: el (o cartão), t (a tarefa), chave (sala.tarefa), aoConcluir(resultado); modo "teste" tem uma tentativa
  function tarefaSQL(el, t, chave, aoConcluir, modo) {
    const id = chave.replace(/\W/g, "-");
    const inicial = estado.codigos[chave] || t.inicial || "";
    el.insertAdjacentHTML("beforeend", `${editor(id, inicial, "SQL")}
      <div class="lab-acoes"><button type="button" class="botao" data-a="rodar">Rodar</button><button type="button" class="botao primario" data-a="verificar">${modo === "teste" ? "Entregar" : "Verificar"}</button><button type="button" class="lab-link" data-a="restaurar">Voltar ao código inicial</button></div>
      <div class="lab-saida" aria-live="polite"></div><div class="retorno" hidden></div>`);
    const ta = el.querySelector("textarea"), saida = el.querySelector(".lab-saida"), ret = el.querySelector(".retorno");
    let tentativas = 0;
    const guardar = () => { estado.codigos[chave] = ta.value; salvar(); };
    async function rodar() {
      guardar();
      saida.innerHTML = '<p class="lab-nota">Rodando no seu banco...</p>';
      try {
        const r = await executar(ta.value);
        saida.innerHTML = r.ultimo ? tabelaHTML(r.ultimo) : `<p class="lab-ok">Comando executado${r.afetadas ? `: ${r.afetadas} ${r.afetadas === 1 ? "linha afetada" : "linhas afetadas"}` : ""}.</p>`;
        return { ok: true, r };
      } catch (e) {
        saida.innerHTML = `<div class="lab-erro"><b>O banco recusou.</b> ${esc(Cmp.traduzirErro(e, ta.value))}<details><summary>Mensagem original do PostgreSQL</summary><code>${esc(e.message)}</code></details></div>`;
        return { ok: false, e };
      }
    }
    async function verificar() {
      if (el.dataset.feita) return;
      const exec = await rodar();
      const problemas = [];
      for (const v of t.verificar || []) {
        try { const c = Cmp.comparar(await consultar(v.consulta), v.esperado, { ordem: true }); if (!c.ok) problemas.push(v.msg); }
        catch (e) { problemas.push(v.msg); }
      }
      if (t.gabarito) {
        if (!exec.ok || !exec.r.ultimo) problemas.push(exec.ok ? "O seu código não devolveu nenhuma tabela: termine com uma consulta SELECT." : "Corrija o erro acima e rode de novo.");
        else { const g = await consultar(t.gabarito); const c = Cmp.comparar(exec.r.ultimo.rows, g, { ordem: t.ordem, tolerancia: t.tolerancia }); if (!c.ok) problemas.push(`O resultado não bate com o esperado. ${c.motivo}`); }
      }
      // num comando que cria ou insere, rodar de novo dá "já existe"; o que vale é o banco ter ficado certo
      if (!t.gabarito && !exec.ok && !problemas.length && !/already exists|duplicate key/.test(exec.e.message)) problemas.push("Corrija o erro acima.");
      tentativas++;
      if (!problemas.length) {
        el.dataset.feita = "1";
        retorno(ret, "ok", "Certo.", `<span>${t.ok || "Resposta certa."}</span>`);
        aoConcluir(tentativas === 1 ? "primeira" : el.dataset.solucao ? "revelada" : "segunda");
        return;
      }
      // na prova não há segunda chance nem solução: quem refaz a prova corrige o próprio código
      if (modo === "teste") { el.dataset.feita = "1"; retorno(ret, "nao", "Errado.", `<span>${esc(problemas[0])}</span>`); aoConcluir("errada"); return; }
      if (tentativas === 1) retorno(ret, "nao tentativa", "Ainda não. Tente de novo.", tresPartes({ erro: esc(problemas[0]), passo: t.pista }));
      else {
        el.dataset.solucao = "1";
        retorno(ret, "revelado", "Veja uma solução.", `<span>${esc(problemas[0])}</span><pre class="lab-slide-cod"><code>${esc(t.solucao)}</code></pre><p><button type="button" class="botao" data-a="usar">Usar esta solução no editor</button></p>`);
        ret.querySelector('[data-a="usar"]').addEventListener("click", () => { ta.value = t.solucao; ta.dispatchEvent(new Event("input")); guardar(); ta.focus(); });
      }
    }
    ligarEditor(ta, rodar);
    el.querySelector('[data-a="rodar"]').addEventListener("click", rodar);
    el.querySelector('[data-a="verificar"]').addEventListener("click", verificar);
    el.querySelector('[data-a="restaurar"]').addEventListener("click", () => { ta.value = t.inicial || ""; ta.dispatchEvent(new Event("input")); guardar(); });
  }

  function tarefaPython(el, t, chave, aoConcluir, modo, sala) {
    const id = chave.replace(/\W/g, "-");
    const inicial = estado.codigos[chave] || t.inicial || "";
    el.insertAdjacentHTML("beforeend", `${editor(id, inicial, "Python")}
      <div class="lab-acoes"><button type="button" class="botao" data-a="rodar">Rodar</button><button type="button" class="botao primario" data-a="verificar">${modo === "teste" ? "Entregar" : "Verificar com os testes"}</button><button type="button" class="lab-link" data-a="restaurar">Voltar ao código inicial</button></div>
      <details class="lab-testes"><summary>Ver os testes</summary><pre class="lab-slide-cod"><code>${esc(t.testes)}</code></pre></details>
      <div class="lab-saida" aria-live="polite"></div><div class="retorno" hidden></div><div class="lab-grafico"></div>`);
    const ta = el.querySelector("textarea"), saida = el.querySelector(".lab-saida"), ret = el.querySelector(".retorno");
    let tentativas = 0;
    const guardar = () => { estado.codigos[chave] = ta.value; salvar(); };
    async function rodar(comTestes) {
      guardar();
      saida.innerHTML = `<p class="lab-nota">${pyPromessa ? "Rodando..." : "Carregando o Python no navegador (na primeira vez, alguns segundos)..."}</p>`;
      let py;
      try { py = await prepararPython(t, sala); } catch (e) { saida.innerHTML = `<div class="lab-erro"><b>Não consegui carregar o Python.</b> ${esc(e.message)}. Na primeira vez é preciso internet.</div>`; return { ok: false }; }
      let texto = "";
      py.setStdout({ batched: (s) => { texto += s + "\n"; } });
      try {
        py.runPython(ta.value);
        if (comTestes) py.runPython(t.testes);
        saida.innerHTML = texto ? `<pre class="lab-print"><code>${esc(texto)}</code></pre>` : '<p class="lab-ok">Rodou sem erro.</p>';
        return { ok: true, py };
      } catch (e) {
        const x = erroPython(e);
        saida.innerHTML = (texto ? `<pre class="lab-print"><code>${esc(texto)}</code></pre>` : "") + (x.teste ? "" : `<div class="lab-erro"><b>O Python parou com erro.</b> ${esc(x.texto)}<details><summary>Mensagem original</summary><code>${esc(String(e.message).trim().split("\n").slice(-4).join("\n"))}</code></details></div>`);
        return { ok: false, x };
      } finally { py.setStdout(); }
    }
    async function verificar() {
      if (el.dataset.feita) return;
      const r = await rodar(true);
      tentativas++;
      if (r.ok) {
        el.dataset.feita = "1";
        retorno(ret, "ok", "Certo.", `<span>${t.ok || "Todos os testes passaram."}</span>`);
        if (t.grafico) desenharGrafico(el.querySelector(".lab-grafico"), r.py, t.grafico);
        aoConcluir(tentativas === 1 ? "primeira" : el.dataset.solucao ? "revelada" : "segunda");
        return;
      }
      const motivo = r.x ? (r.x.teste ? `um teste falhou: ${r.x.texto}` : r.x.texto) : "o Python não carregou.";
      if (modo === "teste") { el.dataset.feita = "1"; retorno(ret, "nao", "Errado.", `<span>${esc(motivo)}</span>`); aoConcluir("errada"); return; }
      if (tentativas === 1) retorno(ret, "nao tentativa", "Ainda não. Tente de novo.", tresPartes({ erro: esc(motivo), passo: t.pista }));
      else {
        el.dataset.solucao = "1";
        retorno(ret, "revelado", "Veja uma solução.", `<span>${esc(motivo)}</span><pre class="lab-slide-cod"><code>${esc(t.solucao)}</code></pre><p><button type="button" class="botao" data-a="usar">Usar esta solução no editor</button></p>`);
        ret.querySelector('[data-a="usar"]').addEventListener("click", () => { ta.value = t.solucao; ta.dispatchEvent(new Event("input")); guardar(); ta.focus(); });
      }
    }
    ligarEditor(ta, () => rodar(false));
    el.querySelector('[data-a="rodar"]').addEventListener("click", () => rodar(false));
    el.querySelector('[data-a="verificar"]').addEventListener("click", verificar);
    el.querySelector('[data-a="restaurar"]').addEventListener("click", () => { ta.value = t.inicial || ""; ta.dispatchEvent(new Event("input")); guardar(); });
  }

  function desenharGrafico(caixa, py, g) {
    const dados = JSON.parse(py.runPython(`json.dumps({str(k): float(v) for k, v in ${g.variavel}.items()})`));
    const nomes = Object.keys(dados), max = Math.max(...Object.values(dados)) * 1.15;
    caixa.innerHTML = `<figure class="lab-barras"><figcaption>${esc(g.titulo)}</figcaption><div class="lab-barras-area">${nomes.map((n) => `<div class="lab-barra"><span class="v">${String(dados[n]).replace(".", ",")}${g.unidade || ""}</span><i style="--h:${(dados[n] / max) * 100}%"></i><small>nível ${esc(n)}</small></div>`).join("")}</div></figure>`;
    requestAnimationFrame(() => caixa.querySelector(".lab-barras").classList.add("ver"));
  }

  function tarefaEscolha(el, t, chave, aoConcluir, modo) {
    el.insertAdjacentHTML("beforeend", `<p class="pergunta">${t.pergunta}</p><div class="opcoes coluna-opcoes">${t.opcoes.map((o, i) => `<button type="button" class="botao" data-i="${i}">${o}</button>`).join("")}</div><div class="retorno" hidden></div>`);
    const bs = [...el.querySelectorAll(".opcoes .botao")], ret = el.querySelector(".retorno");
    let tentativas = 0;
    bs.forEach((b) => b.addEventListener("click", () => {
      if (el.dataset.feita) return;
      tentativas++;
      const ok = Number(b.dataset.i) === t.certa;
      const fechar = () => { el.dataset.feita = "1"; bs.forEach((x) => { x.disabled = true; if (Number(x.dataset.i) === t.certa) x.classList.add("certo"); }); };
      if (ok) { fechar(); retorno(ret, "ok", "Certo.", `<span>${t.ok}</span>`); aoConcluir(tentativas === 1 ? "primeira" : "segunda"); }
      else if (modo === "teste") { el.dataset.feita = "1"; bs.forEach((x) => { x.disabled = true; }); b.classList.add("errado"); retorno(ret, "nao", "Errado.", "<span>Na prova, a resposta certa não aparece: reveja a fase e refaça.</span>"); aoConcluir("errada"); }
      else if (tentativas >= 2 || bs.length <= 2) { fechar(); b.classList.add("errado"); retorno(ret, "revelado", "Veja a resposta.", `<span>${t.nao}</span>`); aoConcluir("revelada"); }
      else { b.classList.add("errado"); b.disabled = true; retorno(ret, "nao tentativa", "Ainda não. Você tem mais uma tentativa.", tresPartes({ erro: `“${b.textContent}” não é a resposta.`, passo: "releia a apresentação da sala; a resposta está lá." })); }
    }));
  }

  function tarefaAcao(el, t, chave, aoConcluir) {
    el.insertAdjacentHTML("beforeend", `<div class="lab-acoes"><button type="button" class="botao primario" data-a="acao">${esc(t.botao)}</button></div><div class="lab-saida" aria-live="polite"></div><div class="retorno" hidden></div>`);
    const saida = el.querySelector(".lab-saida"), ret = el.querySelector(".retorno");
    el.querySelector('[data-a="acao"]').addEventListener("click", async () => {
      if (el.dataset.feita) return;
      saida.innerHTML = '<p class="lab-nota">Carregando...</p>';
      try { if (t.executar === "carga") await carga(); } catch (e) { saida.innerHTML = `<div class="lab-erro"><b>A carga parou.</b> ${esc(Cmp.traduzirErro(e, ""))}</div>`; return; }
      const r = await executar("SELECT (SELECT COUNT(*) FROM materias) AS materias, (SELECT COUNT(*) FROM alunos) AS alunos, (SELECT COUNT(*) FROM questoes) AS questoes, (SELECT COUNT(*) FROM respostas) AS respostas").catch(() => null);
      saida.innerHTML = r && r.ultimo ? tabelaHTML(r.ultimo) : "";
      for (const v of t.verificar || []) { const c = Cmp.comparar(await consultar(v.consulta).catch(() => []), v.esperado, { ordem: true }); if (!c.ok) { retorno(ret, "nao", "Ainda não.", `<span>${esc(v.msg)}</span>`); return; } }
      el.dataset.feita = "1";
      retorno(ret, "ok", "Certo.", `<span>${t.ok}</span>`);
      aoConcluir("primeira");
    });
  }

  function tarefaRelogio(el, t, chave, aoConcluir) {
    el.insertAdjacentHTML("beforeend", `<pre class="lab-slide-cod"><code>${esc(t.codigo)}</code></pre><div class="lab-acoes"><button type="button" class="botao primario" data-a="relogio">Rodar com o relógio</button></div><div class="lab-saida" aria-live="polite"></div><div class="retorno" hidden></div>`);
    const saida = el.querySelector(".lab-saida"), ret = el.querySelector(".retorno");
    el.querySelector('[data-a="relogio"]').addEventListener("click", async () => {
      saida.innerHTML = `<p class="lab-nota">${pyPromessa ? "Rodando..." : "Carregando o Python no navegador (na primeira vez, alguns segundos)..."}</p>`;
      try {
        const py = await python();
        const codigoRelogio = await fetch("relogio.py").then((r) => r.text());
        py.globals.set("_codigo", t.codigo); py.globals.set("_chamada", t.chamada);
        const passos = JSON.parse(py.runPython(codigoRelogio));
        const linhas = t.codigo.split("\n");
        const nomes = [];
        passos.forEach((p) => Object.keys(p.vars).forEach((k) => { if (!nomes.includes(k)) nomes.push(k); }));
        let antes = {};
        const def = window.Clip.execucao({
          titulo: "A função executando, linha por linha",
          codigo: linhas, vars: nomes, teste: true,
          passos: [{ l: `Chamada: <b>${esc(t.chamada)}</b>. O relógio vai anotar cada linha executada.`, linha: -1, mem: {} }].concat(passos.map((p) => {
            const mudou = Object.keys(p.vars).filter((k) => antes[k] !== p.vars[k]);
            antes = p.vars;
            const sobre = mudou.length ? ` Mudou: ${mudou.map((k) => `<b>${esc(k)}</b> = ${esc(p.vars[k])}`).join(", ")}.` : "";
            return p.evento === "return"
              ? { l: `A função termina e devolve <b>${esc(p.ret)}</b>.`, linha: p.linha - 1, mem: p.vars, saida: p.ret }
              : { l: `Linha ${p.linha}: <code>${esc(linhas[p.linha - 1].trim())}</code>.${sobre}`, linha: p.linha - 1, mem: p.vars, ms: 2600 };
          })),
        });
        const idClip = "relogio-" + Date.now();
        window.Clip.registrar(idClip, def);
        saida.innerHTML = `<figure data-clip="${idClip}" style="--alt: 380px"><figcaption>${passos.length + 1} passos. Use Passo para avançar no seu ritmo.</figcaption></figure>`;
        window.Clip.iniciar(saida);
        if (!el.dataset.feita) { el.dataset.feita = "1"; retorno(ret, "ok", "Pronto.", `<span>${t.ok}</span>`); aoConcluir("primeira"); }
      } catch (e) { saida.innerHTML = `<div class="lab-erro"><b>Não consegui rodar o relógio.</b> ${esc(e.message)}</div>`; }
    });
  }

  function tarefaFSRS(el, t, chave, aoConcluir) {
    el.insertAdjacentHTML("beforeend", `<div class="lab-fsrs" aria-live="polite"><p class="lab-nota">Carregando as questões e o algoritmo...</p></div><div class="retorno" hidden></div>`);
    const caixa = el.querySelector(".lab-fsrs"), ret = el.querySelector(".retorno");
    (async () => {
      try {
        if (!window.FSRS) await carregarScript(FSRS_URL);
        const F = window.FSRS, f = F.fsrs(F.generatorParameters({ enable_fuzz: false, enable_short_term: false }));
        const agora = new Date();
        const qs = await objetos(t.fonte);
        const notas = [[F.Rating.Again, "Errei"], [F.Rating.Hard, "Difícil"], [F.Rating.Good, "Bom"], [F.Rating.Easy, "Fácil"]];
        const dia = (d) => d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
        caixa.innerHTML = qs.map((q) => {
          const prev = f.repeat(F.createEmptyCard(agora), agora);
          return `<div class="lab-carta" data-q="${q.id}"><p><b>${esc(q.enunciado)}</b> <small>${esc(q.materia)} · questão ${q.id}</small></p><div class="lab-notas">${notas.map(([r, n]) => `<button type="button" class="botao" data-r="${r}">${n}<small>volta ${dia(prev[r].card.due)}</small></button>`).join("")}</div><p class="lab-nota" data-res></p></div>`;
        }).join("");
        caixa.querySelectorAll("[data-r]").forEach((b) => b.addEventListener("click", async () => {
          const carta = b.closest(".lab-carta"), q = Number(carta.dataset.q);
          const r = f.next(F.createEmptyCard(agora), agora, Number(b.dataset.r)).card;
          const data = r.due.toISOString().slice(0, 10);
          await (await banco()).query("INSERT INTO revisoes VALUES ($1, $2, $3, $4) ON CONFLICT (questao_id) DO UPDATE SET proxima = EXCLUDED.proxima, estabilidade = EXCLUDED.estabilidade, dificuldade = EXCLUDED.dificuldade", [q, data, r.stability, r.difficulty]);
          carta.querySelectorAll("[data-r]").forEach((x) => x.classList.toggle("certo", x === b));
          carta.querySelector("[data-res]").textContent = `Agendada para ${dia(r.due)}: estabilidade de ${r.stability.toFixed(1).replace(".", ",")} dias e dificuldade ${r.difficulty.toFixed(1).replace(".", ",")} (de 1 a 10).`;
          const c = Cmp.comparar(await consultar(t.verificar[0].consulta), t.verificar[0].esperado, { ordem: true });
          if (c.ok && !el.dataset.feita) { el.dataset.feita = "1"; retorno(ret, "ok", "Certo.", `<span>${t.ok}</span>`); aoConcluir("primeira"); }
        }));
      } catch (e) { caixa.innerHTML = `<div class="lab-erro"><b>Não consegui carregar.</b> ${esc(e.message)}. Na primeira vez é preciso internet.</div>`; }
    })();
  }

  function tarefaTexto(el, t, chave, aoConcluir) {
    el.insertAdjacentHTML("beforeend", `<textarea class="lab-texto" rows="4" aria-label="Sua frase de análise">${esc(estado.textos[chave] || "")}</textarea><div class="lab-acoes"><button type="button" class="botao primario" data-a="salvar">Salvar</button></div><p class="lab-nota">${t.modelo}</p><div class="retorno" hidden></div>`);
    el.querySelector('[data-a="salvar"]').addEventListener("click", () => {
      const v = el.querySelector("textarea").value.trim();
      if (!v) return;
      estado.textos[chave] = v; salvar();
      retorno(el.querySelector(".retorno"), "ok", "Salvo.", "<span>Leve essa frase para o /aula se quiser uma correção do tutor.</span>");
      if (!el.dataset.feita) { el.dataset.feita = "1"; aoConcluir("primeira"); }
    });
  }

  function montarTarefa(el, t, chave, aoConcluir, modo, sala) {
    ({ sql: tarefaSQL, python: tarefaPython, escolha: tarefaEscolha, acao: tarefaAcao, relogio: tarefaRelogio, fsrs: tarefaFSRS, texto: tarefaTexto })[t.tipo](el, t, chave, aoConcluir, modo, sala);
  }

  // ---------- telas ----------
  function irPara(hash) { if (location.hash === hash) render(); else location.hash = hash; }

  function telaInicio() {
    const destino = proximoDestino();
    palco.innerHTML = `<section class="lab-bloco-lista">
      <a class="botao primario lab-continuar" href="${destino.href}">${esc(destino.texto)}</a>
      ${C.blocos.map((b) => {
        const salas = C.salas.filter((s) => s.bloco === b.id), nivel = nivelDe(b.id);
        const nivelAberto = salaCompleta(ultimaDoBloco(b.id)) || liberada(salas[0]) || (estado.niveis[b.id] && estado.niveis[b.id].aprovado);
        return `<div class="lab-fase"><h2><span>Fase ${b.id}</span> ${esc(b.nome)}</h2><p class="lab-nota">${esc(b.assunto)}</p><ol class="lab-salas">${salas.map((s) => {
          const st = salaCompleta(s) ? "feita" : liberada(s) ? "aberta" : "fechada";
          return `<li class="${st}">${st === "fechada" ? `<span>${indice(s) + 1}. ${esc(s.nome)}</span><small>bloqueada</small>` : `<a href="#${s.id}">${indice(s) + 1}. ${esc(s.nome)}</a><small>${st === "feita" ? (estado.dominadas[s.id] ? "dominada no nivelamento" : "construída") : "aberta"}</small>`}</li>`;
        }).join("")}${nivel ? `<li class="${estado.niveis[b.id] && estado.niveis[b.id].aprovado ? "feita" : nivelAberto ? "aberta" : "fechada"} lab-nivel-item">${nivelAberto ? `<a href="#nivel-${b.id}">Nivelamento: ${esc(nivel.nome)}</a>` : `<span>Nivelamento: ${esc(nivel.nome)}</span>`}<small>${estado.niveis[b.id] && estado.niveis[b.id].aprovado ? `aprovado (${estado.niveis[b.id].nota} de ${nivel.itens.length})` : "libera a próxima fase"}</small></li>` : ""}</ol></div>`;
      }).join("")}
    </section>${painelBanco()}`;
    ligarPainelBanco();
  }

  function painelBanco() {
    return `<details class="lab-painel"><summary>Seu banco: esquema, reconstruir e baixar</summary><div class="lab-painel-corpo"><div id="lab-esquema"><p class="lab-nota">Abra para ver as tabelas.</p></div>
      <div class="lab-acoes"><button type="button" class="botao" data-a="baixar">Baixar o banco (.sql)</button><button type="button" class="botao" data-a="reconstruir">Reconstruir o banco</button></div>
      <p class="lab-nota">Reconstruir apaga o banco e refaz, com as soluções oficiais, tudo o que você já construiu. Use se algo quebrou.</p></div></details>`;
  }
  function ligarPainelBanco() {
    const p = palco.querySelector(".lab-painel");
    if (!p) return;
    p.addEventListener("toggle", async () => { if (p.open) await mostrarEsquema(p.querySelector("#lab-esquema")); });
    p.querySelector('[data-a="baixar"]').addEventListener("click", baixar);
    p.querySelector('[data-a="reconstruir"]').addEventListener("click", async () => {
      if (!confirm("Apagar o banco e refazer tudo o que você já construiu com as soluções oficiais?")) return;
      const ultima = Math.max(-1, ...C.salas.filter(salaCompleta).map(indice));
      await reconstruir(ultima);
      await mostrarEsquema(p.querySelector("#lab-esquema"));
    });
  }
  async function mostrarEsquema(caixa) {
    if (!caixa) return;
    caixa.innerHTML = '<p class="lab-nota">Lendo o banco...</p>';
    try {
      const ts = await tabelas();
      caixa.innerHTML = (ts.length ? `<ul class="lab-esquema">${ts.map(([n, cols]) => `<li><b>${esc(n)}</b> <code>${esc(cols)}</code></li>`).join("")}</ul>` : '<p class="lab-nota">O banco ainda está vazio.</p>')
        + (emMemoria ? '<p class="lab-nota">Neste navegador o banco não pode ser salvo no aparelho: ele vive só enquanto a aba estiver aberta. O seu progresso fica salvo, e “Reconstruir o banco” refaz as tabelas.</p>' : "");
    } catch (e) { caixa.innerHTML = `<p class="lab-erro">Não consegui abrir o banco: ${esc(e.message)}</p>`; }
  }
  async function baixar() {
    const db = await banco();
    const ordem = ["materias", "alunos", "questoes", "respostas", "revisoes"];
    const existentes = (await consultar("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")).map((r) => r[0]);
    let sql = `-- Banco construído no Castelo de Dados do Domínio em ${new Date().toLocaleDateString("pt-BR")}.\n-- Dados fictícios. Roda no PostgreSQL.\n\n`;
    const lit = (v) => v === null ? "NULL" : typeof v === "number" || typeof v === "boolean" ? String(v) : v instanceof Date ? `'${Cmp.normalizar(v)}'` : `'${String(v).replace(/'/g, "''")}'`;
    for (const t of ordem.filter((x) => existentes.includes(x)).concat(existentes.filter((x) => !ordem.includes(x)))) {
      const cols = await consultar(`SELECT column_name, data_type, is_nullable, column_default FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '${t}' ORDER BY ordinal_position`);
      const regras = await consultar(`SELECT pg_get_constraintdef(oid) FROM pg_constraint WHERE conrelid = '${t}'::regclass AND contype IN ('p', 'f', 'c', 'u') ORDER BY contype DESC`);
      sql += `CREATE TABLE ${t} (\n${cols.map(([n, tipo, nulo, padrao]) => `  ${n} ${tipo.toUpperCase()}${nulo === "NO" ? " NOT NULL" : ""}${padrao ? ` DEFAULT ${padrao}` : ""}`).concat(regras.map(([r]) => `  ${r}`)).join(",\n")}\n);\n`;
      const linhas = (await db.query(`SELECT * FROM ${t}`, [], { rowMode: "array" })).rows;
      for (const l of linhas) sql += `INSERT INTO ${t} VALUES (${l.map(lit).join(", ")});\n`;
      sql += "\n";
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([sql], { type: "application/sql" }));
    a.download = "meu-castelo-de-dados.sql";
    document.body.appendChild(a); a.click(); a.remove();
  }

  async function telaSala(s) {
    if (!liberada(s)) { palco.innerHTML = `<div class="lab-cartao"><h2>${esc(s.nome)} ainda está fechada.</h2><p>Termine a sala anterior${primeiraDoBloco(s) ? " e o nivelamento da fase" : ""} para abrir esta.</p><p><a class="botao primario" href="#">Voltar ao castelo</a></p></div>`; return; }
    const b = blocoDe(s.bloco), i = indice(s);
    // mudança de fase: a importância da fase aparece antes da primeira sala dela
    if (primeiraDoBloco(s) && !estado.intros[b.id] && !salaCompleta(s)) {
      const nivel = C.niveis.find((n) => n.id === b.id);
      palco.innerHTML = `<div class="lab-cartao lab-fase-intro"><p class="sobretitulo">Nova fase do castelo</p><h2>Fase ${b.id}: ${esc(b.nome)}</h2><p class="lab-assunto">${esc(b.assunto)}</p>
        <h3>Por que estudar isso</h3><p>${esc(b.porque)}</p>
        <div class="lab-acoes"><button type="button" class="botao primario" data-a="comecar">Começar a fase</button>${nivel ? `<a class="botao" href="#nivel-${b.id}">Já sei isso: fazer o nivelamento</a>` : ""}</div>
        ${nivel ? `<p class="lab-nota">O nivelamento é uma prova prática de ${nivel.itens.length} itens. Quem acerta ${nivel.minimo} pula as salas desta fase; o banco é construído com as soluções oficiais.</p>` : ""}</div>`;
      palco.querySelector('[data-a="comecar"]').addEventListener("click", () => { estado.intros[b.id] = true; salvar(); render(); });
      return;
    }
    palco.innerHTML = `<article class="lab-sala"><p class="sobretitulo">Fase ${b.id} · ${esc(b.nome)} · sala ${i + 1} de ${C.salas.length}</p><h2>${esc(s.nome)}</h2>
      <p class="lab-ferramenta">Ferramenta: <a href="${s.ferramenta.url}" target="_blank" rel="noopener">${esc(s.ferramenta.nome)}</a> (licença ${esc(s.ferramenta.licenca)}): ${esc(s.ferramenta.papel)}.</p>
      <div class="lab-aviso-banco" hidden></div><div class="lab-slides-lugar"></div><div class="lab-tarefas"></div>
      <div class="lab-rodape"><a class="botao" href="#">Voltar ao castelo</a><button type="button" class="lab-link" data-a="slides">Rever a apresentação</button>${!salaCompleta(s) && s.desfazer ? '<button type="button" class="lab-link" data-a="desfazer">Recomeçar esta sala</button>' : ""}</div></article>${painelBanco()}`;
    ligarPainelBanco();
    const lugar = palco.querySelector(".lab-slides-lugar"), lista = palco.querySelector(".lab-tarefas");
    const mostrarTarefas = () => { lugar.innerHTML = ""; montarTarefas(s, lista); };
    palco.querySelector('[data-a="slides"]').addEventListener("click", () => { lista.innerHTML = ""; lugar.innerHTML = ""; lugar.appendChild(slides(s, mostrarTarefas)); });
    const desf = palco.querySelector('[data-a="desfazer"]');
    if (desf) desf.addEventListener("click", async () => {
      if (!confirm("Recomeçar esta sala? O que ela criou no banco é apagado e os exercícios voltam a ficar em aberto.")) return;
      await (await banco()).exec(s.desfazer);
      for (const ant of C.salas.slice(0, i)) await aplicarEstado(ant);
      s.tarefas.forEach((t) => { delete estado.tarefas[`${s.id}.${t.id}`]; delete estado.codigos[`${s.id}.${t.id}`]; });
      salvar(); render();
    });
    // o banco tem o que as salas anteriores construíram?
    checarBanco(s).then((falta) => {
      if (!falta) return;
      const av = palco.querySelector(".lab-aviso-banco");
      av.hidden = false;
      av.innerHTML = `<b>O seu banco não tem tudo o que as salas anteriores construíram</b> (falta: ${esc(falta)}). Isso acontece quando os dados do navegador são apagados. <button type="button" class="botao" data-a="refazer">Reconstruir até aqui</button>`;
      av.querySelector('[data-a="refazer"]').addEventListener("click", async () => { await reconstruir(i - 1); av.hidden = true; });
    }).catch(() => {});
    if (s.slides && !estado.slides[s.id]) lugar.appendChild(slides(s, mostrarTarefas));
    else mostrarTarefas();
  }

  // tabelas que precisam existir antes de cada sala
  const CRIA = { s1: "materias", s3: "questoes", s4: "alunos", s5: "respostas", s12: "revisoes" };
  async function checarBanco(s) {
    const i = indice(s);
    const precisa = C.salas.slice(0, i).map((x) => CRIA[x.id]).filter(Boolean);
    if (!precisa.length) return "";
    const tem = (await consultar("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")).map((r) => r[0]);
    const faltam = precisa.filter((t) => !tem.includes(t));
    if (!faltam.length && i > indice(salaPorId("s5"))) { const n = (await consultar("SELECT COUNT(*) FROM respostas"))[0][0]; if (Number(n) < 382) faltam.push("a carga das respostas"); }
    return faltam.join(", ");
  }

  function montarTarefas(s, lista) {
    lista.innerHTML = "";
    if (s.passoAPasso) lista.appendChild(passoAPasso(s.passoAPasso));
    const chaveDe = (t) => `${s.id}.${t.id}`;
    const els = s.tarefas.map((t, k) => {
      const feita = estado.tarefas[chaveDe(t)];
      const el = document.createElement("section");
      el.className = "lab-tarefa trancada" + (feita ? " concluida" : "");
      el.innerHTML = `<h3><span>${k + 1}</span> ${esc(t.titulo)}${feita ? ' <small class="lab-check">feita</small>' : ""}</h3>${t.enunciado ? `<p class="lab-enunciado">${t.enunciado}</p>` : ""}<p class="lab-nota lab-trancada-nota">Abre quando a tarefa anterior estiver feita.</p>`;
      lista.appendChild(el);
      return el;
    });
    // abre uma tarefa no lugar, sem redesenhar as outras: o retorno e o gráfico das anteriores continuam na tela
    function abrir(k) {
      const t = s.tarefas[k], el = els[k], chave = chaveDe(t);
      el.classList.remove("trancada");
      const nota = el.querySelector(".lab-trancada-nota");
      if (nota) nota.remove();
      montarTarefa(el, t, chave, (resultado) => {
        estado.tarefas[chave] = resultado; salvar();
        el.classList.add("concluida");
        if (!el.querySelector(".lab-check")) el.querySelector("h3").insertAdjacentHTML("beforeend", ' <small class="lab-check">feita</small>');
        if (salaCompleta(s)) concluirSala(s, lista);
        else if (els[k + 1] && els[k + 1].classList.contains("trancada")) abrir(k + 1);
      }, "", s);
    }
    for (let k = 0; k < s.tarefas.length; k++) { abrir(k); if (!estado.tarefas[chaveDe(s.tarefas[k])]) break; }
    if (salaCompleta(s)) concluirSala(s, lista, true);
  }

  function concluirSala(s, lista, jaEstava) {
    if (lista.querySelector(".lab-fim")) return;
    const i = indice(s), prox = C.salas[i + 1], fimDoBloco = ultimaDoBloco(s.bloco) === s, nivel = C.niveis.find((n) => n.id === s.bloco);
    pintarCastelo(jaEstava ? null : s.parte);
    const destino = fimDoBloco && nivel ? `<a class="botao primario" href="#nivel-${s.bloco}">Fazer o nivelamento: ${esc(nivel.nome)}</a>` : prox ? `<a class="botao primario" href="#${prox.id}">Próxima sala: ${esc(prox.nome)}</a>` : '<a class="botao primario" href="#relatorio">Ver o relatório do castelo</a>';
    lista.insertAdjacentHTML("beforeend", `<div class="lab-cartao lab-fim"><h3>${esc(s.nome)}: construída.</h3><p>${fimDoBloco && nivel ? "Esta fase acabou. Para abrir a próxima, faça o nivelamento: uma prova prática curta." : "Uma parte nova do castelo ficou de pé."}</p><div class="lab-acoes">${destino}</div></div>`);
  }

  function passoAPasso(etapas) {
    const caixa = document.createElement("section");
    caixa.className = "lab-cartao lab-passo";
    caixa.innerHTML = `<h3>A ordem em que o banco pensa</h3><p class="lab-nota">Cada etapa roda de verdade no seu banco. Veja a tabela mudar.</p><div class="lab-etapas">${etapas.map((e, i) => `<button type="button" class="botao" data-i="${i}">${esc(e.etapa)}</button>`).join("")}</div><div class="lab-saida" aria-live="polite"></div>`;
    const saida = caixa.querySelector(".lab-saida");
    caixa.querySelectorAll("[data-i]").forEach((b) => b.addEventListener("click", async () => {
      caixa.querySelectorAll("[data-i]").forEach((x) => x.classList.toggle("atual", x === b));
      const e = etapas[Number(b.dataset.i)];
      try { const r = await executar(e.sql); saida.innerHTML = `<p><b>${esc(e.etapa)}.</b> ${esc(e.nota)}</p><pre class="lab-slide-cod"><code>${esc(e.sql)}</code></pre>${tabelaHTML(r.ultimo, 12)}`; }
      catch (err) { saida.innerHTML = `<p class="lab-erro">${esc(Cmp.traduzirErro(err, e.sql))}</p>`; }
    }));
    return caixa;
  }

  async function telaNivel(b) {
    const nivel = C.niveis.find((n) => n.id === b);
    if (!nivel) { irPara(""); return; }
    const bloco = blocoDe(b), ultima = ultimaDoBloco(b);
    const salasDoBloco = C.salas.filter((s) => s.bloco === b);
    const porPular = !salaCompleta(ultima);
    if (porPular && !liberada(salasDoBloco[0])) { palco.innerHTML = '<div class="lab-cartao"><h2>Este nivelamento ainda está fechado.</h2><p><a class="botao primario" href="#">Voltar ao castelo</a></p></div>'; return; }
    palco.innerHTML = `<article class="lab-sala"><p class="sobretitulo">Nivelamento da fase ${b} · ${esc(bloco.nome)}</p><h2>${esc(nivel.nome)}</h2>
      <p class="lab-enunciado">${nivel.itens.length} itens práticos, uma entrega cada. Passa quem acertar ${nivel.minimo}. Antes de entregar, você pode rodar à vontade.</p>
      <div class="lab-aviso-banco" ${porPular ? "" : "hidden"}>${porPular ? "Preparando o banco com as soluções oficiais das salas desta fase, para a prova ter dados..." : ""}</div>
      <div class="lab-tarefas"></div><div class="lab-resultado" aria-live="polite"></div>
      <div class="lab-rodape"><a class="botao" href="#">Voltar ao castelo</a></div></article>`;
    if (porPular) { await reconstruir(indice(ultima)); palco.querySelector(".lab-aviso-banco").hidden = true; }
    const lista = palco.querySelector(".lab-tarefas"), res = palco.querySelector(".lab-resultado");
    const notas = {};
    nivel.itens.forEach((t, k) => {
      const el = document.createElement("section");
      el.className = "lab-tarefa";
      el.innerHTML = `<h3><span>${k + 1}</span> ${esc(t.titulo)}</h3>${t.enunciado ? `<p class="lab-enunciado">${t.enunciado}</p>` : ""}`;
      lista.appendChild(el);
      montarTarefa(el, t, `nivel-${b}.${t.id}`, (r) => {
        notas[t.id] = r === "primeira" || r === "segunda";
        if (Object.keys(notas).length < nivel.itens.length) return;
        const nota = Object.values(notas).filter(Boolean).length, aprovado = nota >= nivel.minimo;
        estado.niveis[b] = { aprovado: aprovado || !!(estado.niveis[b] && estado.niveis[b].aprovado), nota };
        if (aprovado && porPular) salasDoBloco.forEach((s) => { estado.dominadas[s.id] = true; });
        if (aprovado) estado.intros[b] = true;
        salvar();
        const prox = C.salas.find((s) => s.bloco === nivel.libera);
        res.innerHTML = `<div class="lab-cartao ${aprovado ? "lab-aprovado" : ""}"><h3>${aprovado ? "Aprovado" : "Ainda não"}: ${nota} de ${nivel.itens.length}.</h3><p>${aprovado ? (prox ? `A fase ${nivel.libera} está aberta.` : "") : `Para passar são ${nivel.minimo}. Seu código continua nos editores: corrija os itens errados e entregue de novo.`}</p>${Object.values(notas).every(Boolean) ? "" : `<p class="lab-nota">Errados: ${esc(nivel.itens.map((x, k) => (notas[x.id] ? "" : `${k + 1}. ${x.titulo}`)).filter(Boolean).join("; "))}.</p>`}<div class="lab-acoes">${aprovado && prox ? `<a class="botao primario" href="#${prox.id}">Ir para a fase ${nivel.libera}</a>` : `<button type="button" class="botao primario" data-a="refazer">Tentar de novo</button>`}</div></div>`;
        const re = res.querySelector('[data-a="refazer"]');
        if (re) re.addEventListener("click", () => render());
        pintarCastelo();
      }, "teste");
    });
  }

  async function telaRelatorio() {
    palco.innerHTML = '<article class="lab-sala"><p class="sobretitulo">O castelo está completo</p><h2>Relatório do castelo</h2><div class="lab-saida"><p class="lab-nota">Lendo o seu banco...</p></div><div class="lab-rodape"><a class="botao" href="#">Voltar ao castelo</a></div></article>' + painelBanco();
    ligarPainelBanco();
    const saida = palco.querySelector(".lab-saida");
    try {
      const tot = await executar("SELECT (SELECT COUNT(*) FROM materias) AS materias, (SELECT COUNT(*) FROM alunos) AS alunos, (SELECT COUNT(*) FROM questoes) AS questoes, (SELECT COUNT(*) FROM respostas) AS respostas");
      const mat = await executar("SELECT m.nome AS materia, ROUND(AVG(CASE WHEN r.acertou THEN 100.0 ELSE 0 END), 1) AS taxa FROM respostas r JOIN questoes q ON q.id = r.questao_id JOIN materias m ON m.id = q.materia_id WHERE r.resposta IS NOT NULL GROUP BY m.nome ORDER BY taxa");
      const rev = await executar("SELECT questao_id, proxima FROM revisoes ORDER BY proxima, questao_id").catch(() => null);
      const frase = Object.entries(estado.textos).map(([, v]) => v).pop();
      saida.innerHTML = `<h3>O que você construiu</h3>${tabelaHTML(tot.ultimo)}<h3>Taxa de acerto por matéria</h3>${tabelaHTML(mat.ultimo)}${rev && rev.ultimo ? `<h3>Revisões agendadas pelo FSRS</h3>${tabelaHTML(rev.ultimo)}` : ""}${frase ? `<h3>A sua análise</h3><blockquote class="lab-frase">${esc(frase)}</blockquote>` : ""}<p class="lab-enunciado">O banco é seu: abra “Seu banco” abaixo e baixe o arquivo .sql. Ele roda em qualquer PostgreSQL.</p>`;
    } catch (e) { saida.innerHTML = `<p class="lab-erro">${esc(Cmp.traduzirErro(e, ""))}</p>`; }
  }

  function render() {
    const h = location.hash.replace(/^#/, "");
    document.body.classList.toggle("em-sala", !!h);
    pintarCastelo();
    if (!h) telaInicio();
    else if (h === "relatorio") telaRelatorio();
    else if (h.startsWith("nivel-")) telaNivel(h.slice(6));
    else if (salaPorId(h)) telaSala(salaPorId(h));
    else telaInicio();
    window.scrollTo(0, 0);
  }

  document.querySelector(".lab-castelo").innerHTML = castelo() + '<p class="lab-nota" id="lab-progresso"></p>';
  window.addEventListener("hashchange", render);
  render();
  window.Castelo = { banco, executar, dividir, reconstruir, estado: () => estado };
})();
