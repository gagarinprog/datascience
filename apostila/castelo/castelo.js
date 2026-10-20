// Laboratório do Domínio: o Centro de Dados (antes Castelo de Dados; a pasta, a chave do progresso e o banco
// no aparelho mantêm o nome antigo para nada se perder). Uma sala à parte do mapa, que guia a construção de um
// banco PostgreSQL de verdade, um módulo por vez, no ciclo entender, ver o passo a passo, fazer e explicar.
// O banco roda no navegador (PGlite) e fica salvo no aparelho (IndexedDB). O Python roda no navegador (Pyodide).
// O roteiro dos módulos está em salas.js; os passo a passo animados, em passos.js (motor em ../passo/passo.js);
// a correção pelo resultado e a tradução dos erros, em comparar.js.
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
  const VAZIO = () => ({ slides: {}, tarefas: {}, codigos: {}, niveis: {}, intros: {}, dominadas: {}, textos: {}, passos: {}, explica: {} });
  const ler = () => { try { return Object.assign(VAZIO(), JSON.parse(localStorage.getItem(CHAVE) || "{}")); } catch (e) { return VAZIO(); } };
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
    if (!s) return { href: "#relatorio", texto: "Ver o relatório do centro de dados" };
    if (!liberada(s)) { const b = blocoAnterior(s.bloco); if (b && nivelDe(b.id)) return { href: `#nivel-${b.id}`, texto: `Fazer o nivelamento: ${nivelDe(b.id).nome}` }; }
    return { href: `#${s.id}`, texto: `${C.salas.some(salaCompleta) || estado.slides[s.id] ? "Continuar" : "Começar"}: módulo ${indice(s) + 1}, ${s.nome}` };
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

  // ---------- o mapa do centro de dados ----------
  // Cada módulo é um equipamento; cada zona, uma fase. Equipamento ligado tem LEDs verdes; o módulo em
  // andamento tem contorno azul que respira; o que falta é tracejado. Pacotes de dados correm só pelos cabos
  // que saem de uma zona já ligada. O movimento usa o Anime.js e fica parado com "reduzir movimento".
  const A = () => window.anime;
  const SVGNS = "http://www.w3.org/2000/svg";
  let selecionado = null, animacoes = [];
  const estadoMod = (s) => (salaCompleta(s) ? "ligado" : s === proxima() ? "atual" : "falta");
  function geometria(estreito) {
    if (!estreito) return { vb: [760, 284],
      zonas: [{ x: 14, y: 30, w: 252, h: 236 }, { x: 286, y: 30, w: 190, h: 236 }, { x: 496, y: 30, w: 250, h: 108 }, { x: 496, y: 158, w: 250, h: 108 }],
      disp: (zi, k) => (zi === 0 ? { x: 32 + k * 46, y: 80, w: 36, h: 150 } : zi === 1 ? { x: 306 + k * 54, y: 80, w: 42, h: 150 } : { x: 514 + k * 116, y: zi === 2 ? 76 : 204, w: 100, h: 46 }),
      cabos: [["A", "M266 155 H286"], ["B", "M476 104 H486 V84 H496"], ["B", "M476 210 H486 V212 H496"], ["C", "M621 138 V158"]] };
    return { vb: [360, 612],
      zonas: [{ x: 10, y: 20, w: 340, h: 170 }, { x: 10, y: 206, w: 340, h: 170 }, { x: 10, y: 392, w: 340, h: 96 }, { x: 10, y: 504, w: 340, h: 96 }],
      disp: (zi, k) => (zi === 0 ? { x: 28 + k * 64, y: 60, w: 48, h: 96 } : zi === 1 ? { x: 40 + k * 102, y: 246, w: 72, h: 96 } : { x: 26 + k * 162, y: zi === 2 ? 432 : 544, w: 146, h: 44 }),
      cabos: [["A", "M180 190 V206"], ["B", "M180 376 V392"], ["C", "M180 488 V504"]] };
  }
  function equipamento(s, d, rack, novo) {
    const st = estadoMod(s), i = indice(s), n = String(i + 1).padStart(2, "0");
    const nLeds = rack ? 6 : 4, leds = [];
    for (let k = 0; k < nLeds; k++) {
      const x = rack ? d.x + 8 : d.x + 12 + k * 18, y = rack ? d.y + 14 + k * ((d.h - 26) / (nLeds - 1)) : d.y + d.h - 12;
      leds.push(`<rect class="led ${st}" x="${x}" y="${y}" width="${rack ? d.w - 16 : 12}" height="${rack ? 5 : 4}" rx="1.5"/>`);
    }
    const rotulo = rack ? `<text class="num" x="${d.x + d.w / 2}" y="${d.y + d.h + 15}" text-anchor="middle">${n}</text>` : `<text class="nome" x="${d.x + 10}" y="${d.y + 18}">${n} · ${esc(s.nome)}</text>`;
    const situacao = st === "ligado" ? (estado.dominadas[s.id] ? "dominado no nivelamento" : "ligado") : st === "atual" ? "em andamento" : liberada(s) ? "aberto" : "a montar";
    return `<g class="disp ${st}${selecionado === s.id ? " sel" : ""}${novo ? " novo" : ""}" data-sala="${s.id}" tabindex="0" role="button" aria-label="Módulo ${i + 1}, ${esc(s.nome)}: ${situacao}">
      <rect class="corpo" x="${d.x}" y="${d.y}" width="${d.w}" height="${d.h}" rx="4"/>${leds.join("")}${rotulo}
      ${st === "atual" ? `<rect class="halo" x="${d.x - 4}" y="${d.y - 4}" width="${d.w + 8}" height="${d.h + 8}" rx="7"/>` : ""}</g>`;
  }
  function desenharMapa(novo) {
    const lugar = document.getElementById("cd-mapa");
    if (!lugar) return;
    animacoes.forEach((a) => a && a.revert && a.revert()); animacoes = [];
    const g = geometria(lugar.clientWidth < 520);
    const feitas = C.salas.filter(salaCompleta).length;
    let svg = `<svg viewBox="0 0 ${g.vb[0]} ${g.vb[1]}" role="group" aria-label="Planta do centro de dados: ${feitas} de ${C.salas.length} módulos ligados">
      <defs><pattern id="cd-piso" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" class="piso"/></pattern></defs>
      <rect width="${g.vb[0]}" height="${g.vb[1]}" fill="url(#cd-piso)"/>`;
    // um cabo só leva tráfego quando a zona de onde ele sai já tem módulo ligado
    g.cabos.forEach(([z, d]) => { const on = C.salas.some((s) => s.bloco === z && salaCompleta(s)); svg += `<path class="cabo${on ? " on" : ""}" d="${d}"/>`; });
    C.blocos.forEach((b, zi) => {
      const r = g.zonas[zi], salas = C.salas.filter((s) => s.bloco === b.id), prontas = salas.filter(salaCompleta).length;
      svg += `<rect class="zona" x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="8"/>
        <text class="zona-n" x="${r.x + 12}" y="${r.y + 20}">ZONA ${b.id} · ${esc(b.zona.toUpperCase())}</text>
        <text class="zona-s" x="${r.x + 12}" y="${r.y + 36}">${esc(b.nome)} · ${prontas} de ${salas.length}</text>`;
      salas.forEach((s, k) => { svg += equipamento(s, g.disp(zi, k), zi <= 1, novo === s.id); });
    });
    lugar.innerHTML = svg + "</svg>";
    document.getElementById("cd-total").textContent = `${feitas} de ${C.salas.length} módulos ligados`;
    lugar.querySelectorAll(".disp").forEach((el) => {
      const sel = () => { selecionado = el.dataset.sala; lugar.querySelectorAll(".disp").forEach((x) => x.classList.toggle("sel", x === el)); pintarDetalhe(); };
      el.addEventListener("click", sel);
      el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); sel(); } });
    });
    if (reduz() || !A()) return;
    // tráfego: dois pacotes por cabo ligado
    lugar.querySelectorAll("path.cabo.on").forEach((p, k) => {
      for (let j = 0; j < 2; j++) {
        const c = document.createElementNS(SVGNS, "circle");
        c.setAttribute("r", "3.2"); c.setAttribute("class", "pacote");
        p.parentNode.appendChild(c);
        animacoes.push(A().animate(c, Object.assign({}, A().svg.createMotionPath(p), { duration: 1400 + k * 200, delay: j * 700, loop: true, ease: "linear" })));
      }
    });
    const h = lugar.querySelector(".halo");
    if (h) animacoes.push(A().animate(h, { opacity: [0.15, 0.7], duration: 1300, alternate: true, loop: true, ease: "inOutSine" }));
    // o equipamento recém-ligado: o corpo se desenha e os LEDs acendem em sequência
    const n = lugar.querySelector(".disp.novo");
    if (n) {
      A().animate(A().svg.createDrawable(n.querySelector(".corpo")), { draw: ["0 0", "0 1"], duration: 700, ease: "inOutQuad" });
      A().animate(n.querySelectorAll(".led"), { opacity: [0, 1], scaleX: [0.2, 1], delay: A().stagger(90, { start: 450 }), duration: 380, ease: "outBack" });
    }
  }

  // ---------- painel de progresso: o que fazer agora, o ciclo do módulo e as zonas ----------
  const CHECK = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>';
  function ciclo(s) {
    const dom = !!estado.dominadas[s.id], feitas = s.tarefas.filter((t) => estado.tarefas[`${s.id}.${t.id}`]).length;
    return [
      { nome: "Entender", detalhe: `${(s.slides || []).length} telas`, feito: dom || !!estado.slides[s.id] },
      { nome: "Ver o passo a passo", detalhe: window.PASSOS_LAB && window.PASSOS_LAB[s.id] ? `${window.PASSOS_LAB[s.id].passos.length} etapas` : "", feito: dom || !!estado.passos[s.id] },
      { nome: "Fazer", detalhe: `${feitas} de ${s.tarefas.length} tarefas`, feito: dom || feitas === s.tarefas.length },
      { nome: "Explicar", detalhe: "1 frase", feito: !!estado.explica[s.id] },
    ];
  }
  const cicloHTML = (s) => { const c = ciclo(s), atual = c.findIndex((x) => !x.feito);
    return `<ol class="cd-ciclo">${c.map((x, k) => `<li class="${x.feito ? "feito" : k === atual ? "atual" : ""}"><span class="bola">${x.feito ? CHECK : k + 1}</span><span>${x.nome}</span><small>${esc(x.detalhe)}</small></li>`).join("")}</ol>`; };
  function pintarPainel(animar) {
    const p = document.getElementById("cd-painel");
    if (!p) return;
    const destino = proximoDestino(), s = proxima();
    const feitas = C.salas.filter(salaCompleta).length, tarefas = C.salas.reduce((n, x) => n + x.tarefas.filter((t) => estado.tarefas[`${x.id}.${t.id}`]).length, 0);
    const totalT = C.salas.reduce((n, x) => n + x.tarefas.length, 0), niveis = C.niveis.filter((n) => estado.niveis[n.id] && estado.niveis[n.id].aprovado).length;
    let agora;
    if (!s) agora = `<p class="cd-olho">Tudo ligado</p><h2>O centro de dados está completo</h2><p class="cd-suave">Veja o relatório e baixe o seu banco.</p>`;
    else if (destino.href.startsWith("#nivel-")) { const b = blocoAnterior(s.bloco); agora = `<p class="cd-olho">Agora</p><h2>Nivelamento da zona ${b.id}</h2><p class="cd-suave">Uma prova prática curta libera a zona ${s.bloco}, ${esc(blocoDe(s.bloco).zona.toLowerCase())}.</p>`; }
    else { const b = blocoDe(s.bloco); agora = `<p class="cd-olho">Agora</p><h2>Módulo ${indice(s) + 1} · ${esc(s.nome)}</h2><p class="cd-suave">${esc(s.conceito)} · zona ${b.id}, ${esc(b.zona.toLowerCase())}</p>${cicloHTML(s)}`; }
    p.innerHTML = `<div class="cd-agora">${agora}</div>
      <a class="botao primario cd-continuar" href="${destino.href}">${esc(destino.texto)}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
      <div class="cd-zonas">${C.blocos.map((b) => { const ss = C.salas.filter((x) => x.bloco === b.id), pr = ss.filter(salaCompleta).length;
        return `<div class="cd-zona${pr === ss.length ? " cheia" : ""}"><span>Zona ${b.id} · ${esc(b.zona)}</span><span class="mono">${pr}/${ss.length}</span><div class="barra" role="presentation"><i data-w="${(pr / ss.length) * 100}"></i></div></div>`; }).join("")}</div>
      <div class="cd-numeros"><div><b class="mono" data-n="${feitas}">${feitas}</b><span>módulos ligados</span></div><div><b class="mono">${tarefas}</b><span>de ${totalT} tarefas</span></div><div><b class="mono">${niveis}</b><span>de ${C.niveis.length} nivelamentos</span></div></div>
      <div class="cd-detalhe" aria-live="polite"></div>`;
    p.querySelectorAll(".barra i").forEach((i) => { const w = i.dataset.w + "%"; if (animar && !reduz() && A()) A().animate(i, { width: ["0%", w], duration: 900, ease: "outExpo" }); else i.style.width = w; });
    pintarDetalhe();
  }
  function pintarDetalhe() {
    const d = document.querySelector(".cd-detalhe");
    if (!d) return;
    const s = salaPorId(selecionado);
    if (!s) { d.innerHTML = '<p class="cd-suave">Toque num equipamento do mapa para ver o que ele ensina.</p>'; return; }
    const st = estadoMod(s), aberto = liberada(s) || salaCompleta(s);
    d.innerHTML = `<span class="cd-olho">Selecionado no mapa</span><b>${String(indice(s) + 1).padStart(2, "0")} · ${esc(s.nome)}</b><span class="cd-suave">${esc(s.conceito)} · ${st === "ligado" ? "ligado" : st === "atual" ? "em andamento" : aberto ? "aberto" : "abre depois dos anteriores"}</span>${aberto ? `<a class="lab-link" href="#${s.id}">${salaCompleta(s) ? "Rever o módulo" : "Abrir o módulo"}</a>` : ""}`;
  }
  function pintarCentro(novo) { desenharMapa(novo); pintarPainel(!!novo); }

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

  // a dica de um exercício de código vai para dentro do editor, como comentário abaixo do código da pessoa
  function textoPuro(html) { const d = document.createElement("div"); d.innerHTML = html; return d.textContent.replace(/\s+/g, " ").trim(); }
  function dicaNoEditor(ta, pista, lingua) {
    if (!pista || /^\s*(--|#) Dica:/m.test(ta.value)) return false;
    const marca = lingua === "Python" ? "#" : "--", linhas = [];
    let l = "Dica:";
    textoPuro(pista).split(" ").forEach((p) => { if ((l + " " + p).length > 44) { linhas.push(l); l = "  " + p; } else l += " " + p; });
    linhas.push(l);
    ta.value = ta.value.replace(/\s+$/, "") + "\n\n" + linhas.map((x) => `${marca} ${x}`).join("\n") + "\n";
    ta.dispatchEvent(new Event("input"));
    ta.scrollLeft = 0;
    return true;
  }
  const AVISO_DICA = "a dica está no editor, como comentário logo abaixo do seu código. Ajuste e verifique de novo.";

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
    caixa.setAttribute("aria-label", "Apresentação do módulo");
    function pintar() {
      const sl = s.slides[i];
      caixa.innerHTML = `<p class="lab-slide-n">Apresentação · ${i + 1} de ${s.slides.length}</p><h3>${sl.titulo}</h3>${sl.texto ? `<p>${sl.texto}</p>` : ""}${sl.codigo ? `<pre class="lab-slide-cod"><code>${esc(sl.codigo)}</code></pre>` : ""}
        <div class="lab-slide-nav"><button type="button" class="botao" data-a="ant"${i === 0 ? " disabled" : ""}>Voltar</button><span class="lab-pontos">${s.slides.map((_, k) => `<i class="${k === i ? "atual" : k < i ? "feito" : ""}"></i>`).join("")}</span>${i < s.slides.length - 1 ? '<button type="button" class="botao primario" data-a="prox">Avançar</button>' : '<button type="button" class="botao primario" data-a="fim">Entendi: seguir</button>'}</div>
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
      // a tentativa anterior já criou a tabela, com o formato errado: rodar o CREATE de novo não muda nada
      const tabela = !exec.ok && /relation "(\w+)" already exists/.exec(exec.e.message);
      if (problemas.length && tabela) problemas.unshift(`a tabela ${tabela[1]} já existe, criada na tentativa anterior. Para criar de novo, comece o código com DROP TABLE ${tabela[1]}; e verifique.`);
      tentativas++;
      if (!problemas.length) {
        el.dataset.feita = "1";
        retorno(ret, "ok", "Certo.", `<span>${t.ok || "Resposta certa."}</span>`);
        aoConcluir(tentativas === 1 ? "primeira" : el.dataset.solucao ? "revelada" : "segunda");
        return;
      }
      // na prova não há segunda chance nem solução: quem refaz a prova corrige o próprio código
      if (modo === "teste") { el.dataset.feita = "1"; retorno(ret, "nao", "Errado.", `<span>${esc(problemas[0])}</span>`); aoConcluir("errada"); return; }
      if (tentativas === 1) { const foi = dicaNoEditor(ta, t.pista, "SQL"); guardar(); retorno(ret, "nao tentativa", "Ainda não. Tente de novo.", tresPartes({ erro: esc(problemas[0]), passo: foi ? AVISO_DICA : t.pista })); }
      else {
        el.dataset.solucao = "1";
        const sol = tabela ? `DROP TABLE ${tabela[1]};\n\n${t.solucao}` : t.solucao;
        retorno(ret, "revelado", "Veja uma solução.", `<span>${esc(problemas[0])}</span><pre class="lab-slide-cod"><code>${esc(sol)}</code></pre><p><button type="button" class="botao" data-a="usar">Usar esta solução no editor</button></p>`);
        ret.querySelector('[data-a="usar"]').addEventListener("click", () => { ta.value = sol; ta.dispatchEvent(new Event("input")); guardar(); ta.focus(); });
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
      if (tentativas === 1) { const foi = dicaNoEditor(ta, t.pista, "Python"); guardar(); retorno(ret, "nao tentativa", "Ainda não. Tente de novo.", tresPartes({ erro: esc(motivo), passo: foi ? AVISO_DICA : t.pista })); }
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
    el.insertAdjacentHTML("beforeend", `<pre class="lab-slide-cod"><code>${esc(t.codigo)}</code></pre><div class="lab-acoes"><button type="button" class="botao primario" data-a="relogio">Rodar com o rastreador</button></div><div class="lab-saida" aria-live="polite"></div><div class="retorno" hidden></div>`);
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
          passos: [{ l: `Chamada: <b>${esc(t.chamada)}</b>. O rastreador vai anotar cada linha executada.`, linha: -1, mem: {} }].concat(passos.map((p) => {
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
        saida.innerHTML = `<figure data-clip="${idClip}" style="--alt: 380px"><figcaption>${passos.length + 1} passos anotados pelo rastreador. Use Passo para avançar no seu ritmo.</figcaption></figure>`;
        window.Clip.iniciar(saida);
        if (!el.dataset.feita) { el.dataset.feita = "1"; retorno(ret, "ok", "Pronto.", `<span>${t.ok}</span>`); aoConcluir("primeira"); }
      } catch (e) { saida.innerHTML = `<div class="lab-erro"><b>Não consegui rodar o rastreador.</b> ${esc(e.message)}</div>`; }
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
  const rolarPara = (el) => { if (el) el.scrollIntoView({ block: "start", behavior: reduz() ? "auto" : "smooth" }); };

  // ---------- cascata: cada etapa do módulo abre no lugar, uma de cada vez ----------
  // O que já foi feito fecha numa linha de resumo; o que ainda não pode ser feito fica trancado. Os corpos são
  // montados na primeira vez que abrem e nunca são refeitos: o retorno, o gráfico e o código continuam lá.
  const ICONE = {
    feito: CHECK,
    trancado: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
    seta: '<svg class="cx-seta" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
  };
  function cascata(raiz) {
    const itens = [];
    const c = {
      itens,
      add(o) {
        const it = Object.assign({ feito: false, trancado: false, aberto: false, montado: false }, o);
        const el = document.createElement("section");
        el.className = "cx-item" + (o.largo ? " cx-largo" : "");
        el.innerHTML = `<h3 class="cx-h"><button type="button" class="cx-cab" id="cxb-${o.id}" aria-expanded="false" aria-controls="cx-${o.id}"><span class="cx-marca"></span><span class="cx-tit"><small>${esc(o.rotulo)}</small><span>${esc(o.titulo)}</span></span><span class="cx-resumo"></span>${ICONE.seta}</button></h3><div class="cx-corpo" id="cx-${o.id}" role="region" aria-labelledby="cxb-${o.id}" hidden></div>`;
        raiz.appendChild(el);
        it.el = el; it.cab = el.querySelector(".cx-cab"); it.corpo = el.querySelector(".cx-corpo"); it.n = itens.length + 1;
        it.cab.addEventListener("click", () => { if (it.aberto) c.fechar(it); else if (!it.trancado) c.abrir(it, false); });
        itens.push(it);
        c.marcar(it, {});
        return it;
      },
      abrir(it, rolar) {
        if (!it || it.trancado) return;
        itens.forEach((x) => { if (x !== it && x.aberto) c.fechar(x); });
        it.aberto = true; it.corpo.hidden = false; it.el.classList.add("aberto"); it.cab.setAttribute("aria-expanded", "true");
        if (!it.montado) { it.montado = true; it.montar(it); }
        if (rolar) rolarPara(it.el);
        if (!reduz() && A()) A().animate(it.corpo, { opacity: [0, 1], y: [-6, 0], duration: 320, ease: "outQuad" });
      },
      fechar(it) { it.aberto = false; it.corpo.hidden = true; it.el.classList.remove("aberto"); it.cab.setAttribute("aria-expanded", "false"); },
      marcar(it, m) {
        Object.assign(it, m);
        it.el.classList.toggle("feito", it.feito); it.el.classList.toggle("trancado", it.trancado);
        it.cab.setAttribute("aria-disabled", String(it.trancado));
        it.el.querySelector(".cx-marca").innerHTML = it.feito ? ICONE.feito : it.trancado ? ICONE.trancado : String(it.n);
        it.el.querySelector(".cx-resumo").textContent = it.trancado ? "abre depois da anterior" : it.resumo || "";
      },
      proximaAberta(depois) { const i = itens.indexOf(depois); return itens.slice(i + 1).find((x) => !x.feito && !x.trancado) || itens.slice(i + 1).find((x) => !x.trancado); },
      // um botão no fim de um corpo que leva à próxima etapa
      seguir(it, texto) {
        if (it.corpo.querySelector(".cx-seguir")) return;
        const prox = c.proximaAberta(it);
        if (!prox) return;
        const b = document.createElement("button");
        b.type = "button"; b.className = "botao primario cx-seguir";
        b.innerHTML = `${esc(texto || `Seguir: ${prox.titulo}`)}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;
        b.addEventListener("click", () => { const p = c.proximaAberta(it); if (p) c.abrir(p, true); });
        it.corpo.appendChild(b);
      },
    };
    return c;
  }
  const RESUMO = { primeira: "certa de primeira", segunda: "certa na segunda tentativa", revelada: "feita com a solução", errada: "errada" };

  function telaInicio() {
    palco.innerHTML = `<section class="lab-bloco-lista" aria-labelledby="cd-lista-t"><h2 id="cd-lista-t" class="cd-lista-titulo">Todos os módulos</h2>
      ${C.blocos.map((b) => {
        const salas = C.salas.filter((s) => s.bloco === b.id), nivel = nivelDe(b.id);
        const nivelAberto = salaCompleta(ultimaDoBloco(b.id)) || liberada(salas[0]) || (estado.niveis[b.id] && estado.niveis[b.id].aprovado);
        return `<div class="lab-fase"><h3><span>Zona ${b.id}</span> ${esc(b.zona)} <small>${esc(b.nome)}: ${esc(b.assunto.toLowerCase())}</small></h3><ol class="lab-salas">${salas.map((s) => {
          const st = salaCompleta(s) ? "feita" : liberada(s) ? "aberta" : "fechada";
          const rotulo = `${indice(s) + 1}. ${esc(s.nome)} <em>${esc(s.conceito)}</em>`;
          return `<li class="${st}">${st === "fechada" ? `<span>${rotulo}</span><small>a montar</small>` : `<a href="#${s.id}">${rotulo}</a><small>${st === "feita" ? (estado.dominadas[s.id] ? "dominado no nivelamento" : "ligado") : "aberto"}</small>`}</li>`;
        }).join("")}${nivel ? `<li class="${estado.niveis[b.id] && estado.niveis[b.id].aprovado ? "feita" : nivelAberto ? "aberta" : "fechada"} lab-nivel-item">${nivelAberto ? `<a href="#nivel-${b.id}">Nivelamento: ${esc(nivel.nome)}</a>` : `<span>Nivelamento: ${esc(nivel.nome)}</span>`}<small>${estado.niveis[b.id] && estado.niveis[b.id].aprovado ? `aprovado (${estado.niveis[b.id].nota} de ${nivel.itens.length})` : "libera a próxima zona"}</small></li>` : ""}</ol></div>`;
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
    let sql = `-- Banco construído no Centro de Dados do Domínio em ${new Date().toLocaleDateString("pt-BR")}.\n-- Dados fictícios. Roda no PostgreSQL.\n\n`;
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
    a.download = "meu-centro-de-dados.sql";
    document.body.appendChild(a); a.click(); a.remove();
  }

  async function telaSala(s) {
    if (!liberada(s) && !salaCompleta(s)) { palco.innerHTML = `<div class="lab-cartao"><h2>O módulo ${esc(s.nome)} ainda não abriu.</h2><p>Termine o módulo anterior${primeiraDoBloco(s) ? " e o nivelamento da zona" : ""} para abrir este.</p><p><a class="botao primario" href="#">Voltar ao centro de dados</a></p></div>`; return; }
    const b = blocoDe(s.bloco), i = indice(s);
    // nova zona: a importância dela aparece antes do primeiro módulo
    if (primeiraDoBloco(s) && !estado.intros[b.id] && !salaCompleta(s)) {
      const nivel = C.niveis.find((n) => n.id === b.id);
      palco.innerHTML = `<div class="lab-cartao lab-fase-intro"><p class="sobretitulo">Nova zona do centro de dados</p><h2>Zona ${b.id}: ${esc(b.zona)}</h2><p class="lab-assunto">${esc(b.nome)}: ${esc(b.assunto.toLowerCase())}</p>
        <h3>Por que estudar isso</h3><p>${esc(b.porque)}</p>
        <div class="lab-acoes"><button type="button" class="botao primario" data-a="comecar">Começar a zona</button>${nivel ? `<a class="botao" href="#nivel-${b.id}">Já sei isso: fazer o nivelamento</a>` : ""}</div>
        ${nivel ? `<p class="lab-nota">O nivelamento é uma prova prática de ${nivel.itens.length} itens. Quem acerta ${nivel.minimo} pula os módulos desta zona; o banco é construído com as soluções oficiais.</p>` : ""}</div>`;
      palco.querySelector('[data-a="comecar"]').addEventListener("click", () => { estado.intros[b.id] = true; salvar(); render(); });
      return;
    }
    const def = window.PASSOS_LAB && window.PASSOS_LAB[s.id];
    palco.innerHTML = `<article class="lab-sala"><p class="sobretitulo">Zona ${b.id} · ${esc(b.zona)} · módulo ${i + 1} de ${C.salas.length}</p><h2>${esc(s.nome)}</h2>
      <p class="lab-conceito">${esc(s.conceito)}</p>
      <p class="lab-ferramenta">Ferramenta: <a href="${s.ferramenta.url}" target="_blank" rel="noopener">${esc(s.ferramenta.nome)}</a> (licença ${esc(s.ferramenta.licenca)}): ${esc(s.ferramenta.papel)}.</p>
      <div class="lab-aviso-banco" hidden></div><div class="cx" aria-label="Etapas do módulo"></div><div class="lab-fim-lugar"></div>
      <div class="lab-rodape"><a class="botao" href="#">Voltar ao centro de dados</a>${!salaCompleta(s) && s.desfazer ? '<button type="button" class="lab-link" data-a="desfazer">Recomeçar este módulo</button>' : ""}</div></article>${painelBanco()}`;
    ligarPainelBanco();
    const cx = cascata(palco.querySelector(".cx")), fimLugar = palco.querySelector(".lab-fim-lugar");
    const dom = !!estado.dominadas[s.id];

    // 1. Entender: a apresentação curta
    // (Entender e o passo a passo não trancam as tarefas: quem já sabe pode ir direto a elas)
    if (s.slides && s.slides.length) cx.add({ id: "entender", rotulo: "Entender", titulo: "Para que serve", resumo: `${s.slides.length} telas`, feito: dom || !!estado.slides[s.id],
      montar: (it) => it.corpo.appendChild(slides(s, () => { cx.marcar(it, { feito: true, resumo: "visto" }); pintarPainel(); const p = cx.proximaAberta(it); if (p) cx.abrir(p, true); })) });

    // 2. Ver o passo a passo, com as linhas do banco de estudo
    if (def) cx.add({ id: "passo", rotulo: "Ver o passo a passo", titulo: def.titulo, resumo: `${def.passos.length} etapas`, feito: dom || !!estado.passos[s.id], largo: true,
      montar: (it) => {
        const caixa = document.createElement("div");
        it.corpo.appendChild(caixa);
        const marcar = () => { if (!estado.passos[s.id]) { estado.passos[s.id] = true; salvar(); pintarPainel(); } cx.marcar(it, { feito: true, resumo: "visto" }); cx.seguir(it, "Ir para as tarefas"); };
        window.Passo.montar(caixa, Object.assign({}, def, { aoFim: marcar }));
        if (s.passoAPasso) {
          const extra = document.createElement("details");
          extra.className = "lab-passo-real";
          extra.innerHTML = "<summary>Rodar cada etapa no seu banco</summary>";
          extra.appendChild(passoAPasso(s.passoAPasso));
          it.corpo.appendChild(extra);
        }
        if (it.feito) cx.seguir(it, "Ir para as tarefas");
      } });

    // 3. Fazer: as tarefas, em ordem; cada uma abre quando a anterior está feita
    const chaveDe = (t) => `${s.id}.${t.id}`;
    const itTarefas = s.tarefas.map((t, k) => {
      const r = estado.tarefas[chaveDe(t)];
      const codigo = t.tipo === "sql" || t.tipo === "python";
      return cx.add({ id: "t" + k, rotulo: `Tarefa ${k + 1} de ${s.tarefas.length}`, titulo: t.titulo, feito: dom || !!r, resumo: r ? RESUMO[r] || "feita" : dom ? "dominada" : "",
        trancado: !dom && k > 0 && !estado.tarefas[chaveDe(s.tarefas[k - 1])], largo: codigo,
        montar: (it) => {
          it.corpo.insertAdjacentHTML("beforeend", `${t.enunciado ? `<p class="lab-enunciado">${t.enunciado}</p>` : ""}`);
          const corpo = document.createElement("div");
          corpo.className = "lab-tarefa-corpo";
          it.corpo.appendChild(corpo);
          montarTarefa(corpo, t, chaveDe(t), (resultado) => {
            estado.tarefas[chaveDe(t)] = resultado; salvar();
            cx.marcar(it, { feito: true, resumo: RESUMO[resultado] || "feita" });
            const prox = itTarefas[k + 1];
            if (prox && prox.trancado) cx.marcar(prox, { trancado: false });
            pintarPainel();
            if (salaCompleta(s)) concluirSala(s, fimLugar, false, cx);
            cx.seguir(it, prox ? `Próxima tarefa: ${prox.titulo}` : "Explicar com as suas palavras");
          }, "", s);
          if (it.feito) cx.seguir(it);
        } });
    });

    // 4. Explicar: uma frase, com as suas palavras
    cx.add({ id: "explicar", rotulo: "Explicar", titulo: "Com as suas palavras", feito: !!estado.explica[s.id], resumo: estado.explica[s.id] ? "salva" : "1 frase",
      montar: (it) => {
        it.corpo.innerHTML = `<p class="lab-enunciado">Em uma ou duas frases, como se fosse para um colega: o que ${esc(s.conceito)} faz, e quando você usaria isso?</p>
          <label class="visivel-leitor" for="ex-${s.id}">Sua explicação</label><textarea id="ex-${s.id}" class="lab-texto" rows="3">${esc(estado.explica[s.id] || "")}</textarea>
          <div class="lab-acoes"><button type="button" class="botao primario" data-a="salvar">Salvar a explicação</button></div><div class="retorno" hidden></div>
          <p class="lab-nota">Explicar com as próprias palavras é o que mais fixa. Fica salvo neste aparelho; leve para o /aula se quiser a correção do tutor.</p>`;
        it.corpo.querySelector('[data-a="salvar"]').addEventListener("click", () => {
          const v = it.corpo.querySelector("textarea").value.trim();
          if (!v) { it.corpo.querySelector("textarea").focus(); return; }
          estado.explica[s.id] = v; salvar();
          retorno(it.corpo.querySelector(".retorno"), "ok", "Salva.", "<span>O ciclo do módulo está completo.</span>");
          cx.marcar(it, { feito: true, resumo: "salva" });
          pintarPainel();
        });
      } });

    // abre a primeira etapa que falta; com tudo feito, deixa tudo fechado e mostra o fim
    const falta = cx.itens.find((x) => !x.feito && !x.trancado);
    if (falta && !(salaCompleta(s) && falta.id === "explicar")) cx.abrir(falta, false);
    if (salaCompleta(s)) concluirSala(s, fimLugar, true, cx);

    const desf = palco.querySelector('[data-a="desfazer"]');
    if (desf) desf.addEventListener("click", async () => {
      if (!confirm("Recomeçar este módulo? O que ele criou no banco é apagado e as tarefas voltam a ficar em aberto.")) return;
      await (await banco()).exec(s.desfazer).catch(() => {}); // o banco pode já não ter a tabela
      for (const ant of C.salas.slice(0, i)) await aplicarEstado(ant);
      s.tarefas.forEach((t) => { delete estado.tarefas[chaveDe(t)]; delete estado.codigos[chaveDe(t)]; });
      salvar(); render();
    });
    // o banco tem o que os módulos anteriores construíram?
    checarBanco(s).then((falta) => {
      if (!falta) return;
      const av = palco.querySelector(".lab-aviso-banco");
      av.hidden = false;
      av.innerHTML = `<b>O seu banco não tem tudo o que os módulos anteriores construíram</b> (falta: ${esc(falta)}). Isso acontece quando os dados do navegador são apagados. <button type="button" class="botao" data-a="refazer">Reconstruir até aqui</button>`;
      av.querySelector('[data-a="refazer"]').addEventListener("click", async () => { await reconstruir(i - 1); av.hidden = true; });
    }).catch(() => {});
  }

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

  function concluirSala(s, lugar, jaEstava) {
    if (lugar.querySelector(".lab-fim")) return;
    const i = indice(s), prox = C.salas[i + 1], fimDoBloco = ultimaDoBloco(s.bloco) === s, nivel = C.niveis.find((n) => n.id === s.bloco);
    if (!jaEstava) pintarCentro(s.id);
    const destino = fimDoBloco && nivel ? `<a class="botao primario" href="#nivel-${s.bloco}">Fazer o nivelamento: ${esc(nivel.nome)}</a>` : prox ? `<a class="botao primario" href="#${prox.id}">Próximo módulo: ${esc(prox.nome)}</a>` : '<a class="botao primario" href="#relatorio">Ver o relatório do centro de dados</a>';
    lugar.innerHTML = `<div class="lab-cartao lab-fim"><h3>${esc(s.nome)}: ligado.</h3><p>${fimDoBloco && nivel ? "Esta zona está completa. Para abrir a próxima, faça o nivelamento: uma prova prática curta." : "Mais um equipamento aceso no centro de dados."}${estado.explica[s.id] ? "" : " Antes de seguir, vale escrever a explicação, na última etapa acima."}</p><div class="lab-acoes">${destino}</div></div>`;
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
    if (porPular && !liberada(salasDoBloco[0])) { palco.innerHTML = '<div class="lab-cartao"><h2>Este nivelamento ainda está fechado.</h2><p><a class="botao primario" href="#">Voltar ao centro de dados</a></p></div>'; return; }
    palco.innerHTML = `<article class="lab-sala"><p class="sobretitulo">Nivelamento da zona ${b} · ${esc(bloco.zona)}</p><h2>${esc(nivel.nome)}</h2>
      <p class="lab-enunciado">${nivel.itens.length} itens práticos, uma entrega cada. Passa quem acertar ${nivel.minimo}. Antes de entregar, você pode rodar à vontade. Aqui não há dica nem solução: é a prova.</p>
      <div class="lab-aviso-banco" ${porPular ? "" : "hidden"}>${porPular ? "Preparando o banco com as soluções oficiais dos módulos desta zona, para a prova ter dados..." : ""}</div>
      <div class="cx" aria-label="Itens do nivelamento"></div><div class="lab-resultado" aria-live="polite"></div>
      <div class="lab-rodape"><a class="botao" href="#">Voltar ao centro de dados</a></div></article>`;
    if (porPular) { await reconstruir(indice(ultima)); palco.querySelector(".lab-aviso-banco").hidden = true; }
    const cx = cascata(palco.querySelector(".cx")), res = palco.querySelector(".lab-resultado");
    const notas = {};
    nivel.itens.forEach((t, k) => {
      cx.add({ id: "n" + k, rotulo: `Item ${k + 1} de ${nivel.itens.length}`, titulo: t.titulo, largo: t.tipo === "sql" || t.tipo === "python",
        montar: (it) => {
          if (t.enunciado) it.corpo.insertAdjacentHTML("beforeend", `<p class="lab-enunciado">${t.enunciado}</p>`);
          const corpo = document.createElement("div");
          it.corpo.appendChild(corpo);
          montarTarefa(corpo, t, `nivel-${b}.${t.id}`, (r) => {
            notas[t.id] = r === "primeira" || r === "segunda";
            cx.marcar(it, { feito: true, resumo: "entregue" });
            if (Object.keys(notas).length < nivel.itens.length) { cx.seguir(it, "Próximo item"); return; }
            const nota = Object.values(notas).filter(Boolean).length, aprovado = nota >= nivel.minimo;
            estado.niveis[b] = { aprovado: aprovado || !!(estado.niveis[b] && estado.niveis[b].aprovado), nota };
            if (aprovado && porPular) salasDoBloco.forEach((s) => { estado.dominadas[s.id] = true; });
            if (aprovado) estado.intros[b] = true;
            salvar();
            const prox = C.salas.find((s) => s.bloco === nivel.libera);
            res.innerHTML = `<div class="lab-cartao ${aprovado ? "lab-aprovado" : ""}"><h3>${aprovado ? "Aprovado" : "Ainda não"}: ${nota} de ${nivel.itens.length}.</h3><p>${aprovado ? (prox ? `A zona ${nivel.libera}, ${esc(blocoDe(nivel.libera).zona.toLowerCase())}, está aberta.` : "") : `Para passar são ${nivel.minimo}. Seu código continua nos editores: corrija os itens errados e entregue de novo.`}</p>${Object.values(notas).every(Boolean) ? "" : `<p class="lab-nota">Errados: ${esc(nivel.itens.map((x, j) => (notas[x.id] ? "" : `${j + 1}. ${x.titulo}`)).filter(Boolean).join("; "))}.</p>`}<div class="lab-acoes">${aprovado && prox ? `<a class="botao primario" href="#${prox.id}">Ir para a zona ${nivel.libera}</a>` : `<button type="button" class="botao primario" data-a="refazer">Tentar de novo</button>`}</div></div>`;
            const re = res.querySelector('[data-a="refazer"]');
            if (re) re.addEventListener("click", () => render());
            pintarCentro(aprovado ? (C.salas.find((s) => s.bloco === b && salaCompleta(s)) || {}).id : null);
            rolarPara(res);
          }, "teste");
        } });
    });
    cx.abrir(cx.itens[0], false);
  }

  async function telaRelatorio() {
    palco.innerHTML = '<article class="lab-sala"><p class="sobretitulo">O centro de dados está completo</p><h2>Relatório do centro de dados</h2><div class="lab-saida"><p class="lab-nota">Lendo o seu banco...</p></div><div class="lab-rodape"><a class="botao" href="#">Voltar ao centro de dados</a></div></article>' + painelBanco();
    ligarPainelBanco();
    const saida = palco.querySelector(".lab-saida");
    try {
      const tot = await executar("SELECT (SELECT COUNT(*) FROM materias) AS materias, (SELECT COUNT(*) FROM alunos) AS alunos, (SELECT COUNT(*) FROM questoes) AS questoes, (SELECT COUNT(*) FROM respostas) AS respostas");
      const mat = await executar("SELECT m.nome AS materia, ROUND(AVG(CASE WHEN r.acertou THEN 100.0 ELSE 0 END), 1) AS taxa FROM respostas r JOIN questoes q ON q.id = r.questao_id JOIN materias m ON m.id = q.materia_id WHERE r.resposta IS NOT NULL GROUP BY m.nome ORDER BY taxa");
      const rev = await executar("SELECT questao_id, proxima FROM revisoes ORDER BY proxima, questao_id").catch(() => null);
      const frase = Object.entries(estado.textos).map(([, v]) => v).pop();
      const expl = C.salas.filter((s) => estado.explica[s.id]);
      saida.innerHTML = `<h3>O que você construiu</h3>${tabelaHTML(tot.ultimo)}<h3>Taxa de acerto por matéria</h3>${tabelaHTML(mat.ultimo)}${rev && rev.ultimo ? `<h3>Revisões agendadas pelo FSRS</h3>${tabelaHTML(rev.ultimo)}` : ""}${frase ? `<h3>A sua análise</h3><blockquote class="lab-frase">${esc(frase)}</blockquote>` : ""}${expl.length ? `<h3>As suas explicações</h3><dl class="lab-expl">${expl.map((s) => `<dt>${indice(s) + 1}. ${esc(s.nome)}</dt><dd>${esc(estado.explica[s.id])}</dd>`).join("")}</dl>` : ""}<p class="lab-enunciado">O banco é seu: abra “Seu banco” abaixo e baixe o arquivo .sql. Ele roda em qualquer PostgreSQL.</p>`;
    } catch (e) { saida.innerHTML = `<p class="lab-erro">${esc(Cmp.traduzirErro(e, ""))}</p>`; }
  }

  function render() {
    const h = location.hash.replace(/^#/, "");
    document.body.classList.toggle("em-sala", !!h);
    const s = salaPorId(h);
    if (s) selecionado = s.id;
    pintarCentro();
    if (!h) telaInicio();
    else if (h === "relatorio") telaRelatorio();
    else if (h.startsWith("nivel-")) telaNivel(h.slice(6));
    else if (s) telaSala(s);
    else telaInicio();
    window.scrollTo(0, 0);
  }

  window.addEventListener("hashchange", render);
  // o mapa troca de arranjo (largo ou estreito) quando a largura muda bastante
  let largura = 0;
  if ("ResizeObserver" in window) new ResizeObserver(() => { const el = document.getElementById("cd-mapa"); const w = el ? el.clientWidth : 0; if (w && Math.abs(w - largura) > 40) { largura = w; desenharMapa(); } }).observe(document.body);
  window.addEventListener("tema", () => desenharMapa());
  render();
  window.Castelo = { banco, executar, dividir, reconstruir, estado: () => estado };
})();
