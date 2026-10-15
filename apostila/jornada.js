// Jornada: a apostila como jogo. Três níveis de foco, um por rota:
//   #mapa                      as 16 matérias numa estrada sinuosa, em mundos
//   #trilha-SIGLA              a matéria: jornada dos módulos (abre em cascata ao selecionar)
//   #guia-SIGLA, #fontes-SIGLA a matéria: subtópicos de como funciona (um aberto por vez) e fontes
//   #estudo-COD                a lição em tela cheia, um passo por vez
//   #fontes                    todas as referências
(function () {
  const MATERIAS = window.MATERIAS;
  const GUIA = window.GUIA;
  const { F: FONTE, POR_MATERIA, GRUPOS } = window.FONTES;
  const LICOES = { "LOG.01": "licoes/LOG.01.html" };
  const POR_SIGLA = Object.fromEntries(MATERIAS.map((m) => [m.sigla, m]));
  const MODULO = {};
  MATERIAS.forEach((m) => m.modulos.forEach((mod, i) => { MODULO[mod.codigo] = { mod, materia: m, indice: i }; }));
  const ORDEM = MATERIAS.flatMap((m) => m.modulos.map((mod) => mod.codigo));
  const TOTAL = ORDEM.length;

  const EMBLEMA = {
    LOG: "flow-arrow-duotone", PY: "file-py-duotone", BD: "database-duotone", CMP: "cpu-duotone", MAT: "intersect-duotone",
    EST: "chart-bar-duotone", ED: "stack-duotone", POO: "cube-duotone", ENG: "git-branch-duotone", FMT: "file-csv-duotone",
    AD: "table-duotone", VIS: "chart-line-up-duotone", ALC: "vector-three-duotone", ML: "brain-duotone", NSQ: "graph-duotone", ETI: "shield-check-duotone",
  };
  const MUNDOS = [
    { nome: "Pensar como programador", desc: "Passos claros e a primeira linguagem.", siglas: ["LOG", "PY"], icone: "lightbulb-duotone", cenario: ["flow-arrow-duotone", "file-py-duotone"] },
    { nome: "Onde os dados moram", desc: "Bancos de dados, SQL e o que acontece dentro da máquina.", siglas: ["BD", "CMP"], icone: "database-duotone", cenario: ["table-duotone", "cpu-duotone"] },
    { nome: "Números com sentido", desc: "A matemática e a estatística que os dados pedem.", siglas: ["MAT", "EST"], icone: "chart-bar-duotone", cenario: ["intersect-duotone", "chart-bar-duotone"] },
    { nome: "Programar de verdade", desc: "Estruturas, algoritmos, objetos e as ferramentas do ofício.", siglas: ["ED", "POO", "ENG"], icone: "stack-duotone", cenario: ["stack-duotone", "git-branch-duotone"] },
    { nome: "Da planilha ao gráfico", desc: "Formatos de arquivo, análise e visualização.", siglas: ["FMT", "AD", "VIS"], icone: "chart-line-up-duotone", cenario: ["file-csv-duotone", "chart-line-up-duotone"] },
    { nome: "Modelos e mundo real", desc: "Álgebra linear, aprendizado de máquina, outros bancos e ética.", siglas: ["ALC", "ML", "NSQ", "ETI"], icone: "brain-duotone", cenario: ["brain-duotone", "shield-check-duotone"] },
  ];
  const MUNDO_DE = {};
  MUNDOS.forEach((w, i) => w.siglas.forEach((s) => { MUNDO_DE[s] = i; }));
  // ondulação da estrada: posição de cada parada em relação ao centro (-1 = esquerda, 1 = direita)
  const ONDA_MAPA = [-0.55, 0.6, -0.7, 0.55, -0.45, 0.75, -0.65, 0.35, 0.8, -0.6, 0.5, -0.8, 0.65, -0.35, 0.7, -0.55];
  const ONDA_MOD = [0, -0.65, -1, -0.65, 0, 0.65, 1, 0.65];
  const PASSOS = [
    ["Antes de começar", "flag-checkered-duotone"], ["Para que serve", "target-duotone"], ["O que você aprende", "book-open-text-duotone"],
    ["Cuidado com", "warning-duotone"], ["Pronto para avançar?", "trophy-duotone"],
  ];

  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const ic = (n, c) => window.ICONE(n, c);
  const minusc = (t) => t.charAt(0).toLowerCase() + t.slice(1);
  const doisDig = (n) => String(n).padStart(2, "0");
  const coresDe = (s) => `--cor:var(--m-${s});--cv:var(--mv-${s})`;
  const mov = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  const semMovimento = () => mov.matches;
  const centro = () => document.getElementById("conteudo");
  let idUnico = 0;
  function mascote(expr = "padrao", classe = "") {
    const n = ++idUnico;
    const svg = (window.MASCOTE && window.MASCOTE[expr]) || "";
    return `<div class="mascote ${classe}" aria-hidden="true">${svg.replace(/viewboxMask/g, "vm" + n)}</div>`;
  }

  // ---------- progresso: base de dados do artefato quando houver; navegador como reserva ----------
  const CHAVE = "dominio:progresso:v1";
  let progresso = { modulos: {} };
  try { progresso = JSON.parse(localStorage.getItem(CHAVE)) || progresso; } catch (e) { /* sem armazenamento */ }
  let refDoc = null;
  let fila = Promise.resolve();
  const estadoDe = (cod) => (progresso.modulos[cod] || {}).estado || "";
  const salvarLocal = () => { try { localStorage.setItem(CHAVE, JSON.stringify(progresso)); } catch (e) { /* sem armazenamento */ } };
  function marcar(cod, estado) {
    if (estado) progresso.modulos[cod] = { estado, em: new Date().toISOString().slice(0, 10) };
    else delete progresso.modulos[cod];
    salvarLocal();
    if (refDoc) {
      const corpo = { modulos: progresso.modulos, atualizado: new Date().toISOString() };
      fila = fila.then(() => refDoc.set(corpo)).catch(() => toast("Não deu para salvar na nuvem; ficou neste navegador.", "info-duotone"));
    }
    desenharHud();
  }
  if (window.claude && typeof window.claude.use === "function") {
    window.claude.use("db").then((db) => {
      if (!db) return;
      refDoc = db.doc("progresso/geral");
      refDoc.onSnapshot((snap) => {
        if (!snap.exists) return;
        const novos = Object.assign({}, (snap.data() || {}).modulos || {});
        if (JSON.stringify(novos) === JSON.stringify(progresso.modulos)) return;
        progresso = { modulos: novos };
        salvarLocal();
        if (rota().v !== "estudo") render(); else desenharHud();
      }, () => {});
    }).catch(() => {});
  }
  // subtópicos já vistos: conveniência deste navegador
  const CHAVE_VISTOS = "dominio:vistos:v1";
  let vistos = {};
  try { vistos = JSON.parse(localStorage.getItem(CHAVE_VISTOS)) || {}; } catch (e) { /* sem armazenamento */ }
  const salvarVistos = () => { try { localStorage.setItem(CHAVE_VISTOS, JSON.stringify(vistos)); } catch (e) { /* sem armazenamento */ } };

  const dominados = (m) => m.modulos.filter((mod) => estadoDe(mod.codigo) === "dominado").length;
  const materiaAtual = () => MATERIAS.find((m) => dominados(m) < m.modulos.length) || MATERIAS[MATERIAS.length - 1];
  const proximoModulo = (m) => m.modulos.find((mod) => estadoDe(mod.codigo) !== "dominado") || m.modulos[m.modulos.length - 1];
  const xpDe = (cod) => (MODULO[cod].mod.virada ? 30 : 20);
  const xpTotal = () => ORDEM.reduce((a, c) => a + (estadoDe(c) === "dominado" ? xpDe(c) : 0), 0);
  const nivelDe = (xp) => ({ n: Math.floor(xp / 100) + 1, resto: xp % 100 });
  function ofensiva() {
    const dias = new Set(Object.values(progresso.modulos).map((x) => x.em).filter(Boolean));
    const d = new Date();
    const iso = () => d.toISOString().slice(0, 10);
    if (!dias.has(iso())) d.setUTCDate(d.getUTCDate() - 1);
    let n = 0;
    while (dias.has(iso())) { n++; d.setUTCDate(d.getUTCDate() - 1); }
    return n;
  }

  function rota() {
    const h = decodeURIComponent(location.hash.replace("#", "")) || "mapa";
    const [v, a, b] = h.split("-");
    if (v === "estudo" && MODULO[a]) return { v: "estudo", cod: a, sigla: MODULO[a].materia.sigla };
    if (v === "trilha" && POR_SIGLA[a] && MODULO[b]) return { v: "estudo", cod: b, sigla: a };
    if ((v === "trilha" || v === "guia") && POR_SIGLA[a]) return { v: "materia", aba: v === "trilha" ? "jornada" : "guia", sigla: a };
    if (v === "trilha" || v === "guia") return { v: "materia", aba: v === "trilha" ? "jornada" : "guia", sigla: materiaAtual().sigla };
    if (v === "fontes" && POR_SIGLA[a]) return { v: "materia", aba: "fontes", sigla: a };
    if (v === "fontes") return { v: "fontes" };
    return { v: "mapa" };
  }

  // número que sobe até o valor novo e dá um pulinho no cartão; sem movimento, troca direto
  function contar(el, para) {
    const antes = Number(el.dataset.v);
    el.dataset.v = para;
    if (!el.dataset.pronto || semMovimento() || antes === para) { el.textContent = para; el.dataset.pronto = "1"; return; }
    const t0 = performance.now();
    const passo = (t) => {
      const f = Math.min(1, (t - t0) / 700);
      el.textContent = Math.round(antes + (para - antes) * (1 - Math.pow(1 - f, 3)));
      if (f < 1) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
    const cartao = el.closest(".stat");
    if (cartao) { cartao.classList.remove("salta"); void cartao.offsetWidth; cartao.classList.add("salta"); }
  }

  // ---------- HUD ----------
  function desenharHud() {
    const r = rota();
    document.body.classList.toggle("foco", r.v === "estudo");
    document.querySelectorAll(".hud-nav a").forEach((a) => {
      const ativo = a.dataset.v === r.v || (a.dataset.v === "materia" && r.v === "materia");
      if (ativo) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    const xp = xpTotal();
    const nv = nivelDe(xp);
    const of = ofensiva();
    contar(document.getElementById("hud-xp"), xp);
    contar(document.getElementById("hud-ofensiva"), of);
    document.querySelector(".stat.ofensiva").classList.toggle("apagada", of === 0);
    document.querySelector(".stat.ofensiva").title = of ? `${of} ${of === 1 ? "dia seguido" : "dias seguidos"} estudando` : "Domine um módulo hoje para acender a ofensiva";
    const anel = document.getElementById("hud-nivel");
    anel.style.setProperty("--p", `${nv.resto}%`);
    anel.querySelector("span").textContent = nv.n;
    anel.parentElement.title = `Nível ${nv.n}: ${nv.resto} de 100 XP para o próximo`;
  }

  // ---------- estrada (SVG desenhado a partir da posição real dos nós) ----------
  function caminho(pts) {
    if (pts.length < 2) return "";
    let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i], my = (a.y + b.y) / 2;
      d += ` C${a.x.toFixed(1)},${my.toFixed(1)} ${b.x.toFixed(1)},${my.toFixed(1)} ${b.x.toFixed(1)},${b.y.toFixed(1)}`;
    }
    return d;
  }
  let observador = null;
  const observadores = [];
  function estrada(raiz, seletor, feitoAte, animar) {
    const svg = raiz.querySelector(":scope > svg.estrada");
    let primeira = animar;
    const desenhar = () => {
      const caixa = raiz.getBoundingClientRect();
      const nos = [...raiz.querySelectorAll(seletor)];
      if (!nos.length || !caixa.width) return;
      const pts = nos.map((n) => {
        const r = n.getBoundingClientRect();
        return { x: r.left + r.width / 2 - caixa.left, y: r.top + r.height / 2 - caixa.top, cor: getComputedStyle(n).getPropertyValue("--cv").trim() };
      });
      svg.setAttribute("viewBox", `0 0 ${caixa.width} ${caixa.height}`);
      const d = caminho(pts);
      const feito = caminho(pts.slice(0, feitoAte + 1));
      const y0 = pts[0].y, y1 = Math.max(pts[pts.length - 1].y, y0 + 1);
      const paradas = pts.map((p) => `<stop offset="${((p.y - y0) / (y1 - y0)).toFixed(3)}" stop-color="${p.cor || "currentColor"}"/>`).join("");
      svg.innerHTML = `<defs><linearGradient id="grad-estrada" gradientUnits="userSpaceOnUse" x1="0" y1="${y0}" x2="0" y2="${y1}">${paradas}</linearGradient></defs>
        <path class="estrada-leito" d="${d}"/><path class="estrada-faixa" d="${d}"/>${feito ? `<path class="estrada-feita" stroke="url(#grad-estrada)" d="${feito}"/>` : ""}`;
      const pf = svg.querySelector(".estrada-feita");
      if (pf && primeira && !semMovimento()) {
        const L = pf.getTotalLength();
        pf.style.strokeDasharray = `${L} ${L}`;
        pf.style.strokeDashoffset = L;
        pf.getBoundingClientRect();
        pf.style.transition = "stroke-dashoffset 1500ms cubic-bezier(.6,0,.2,1) 200ms";
        pf.style.strokeDashoffset = 0;
      }
      primeira = false;
    };
    let pedido = 0;
    const agendar = () => { cancelAnimationFrame(pedido); pedido = requestAnimationFrame(desenhar); };
    if (observador) observador.disconnect();
    if ("ResizeObserver" in window) { observador = new ResizeObserver(agendar); observador.observe(raiz); }
    window.addEventListener("resize", agendar, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(agendar);
    desenhar();
  }

  // ---------- MAPA ----------
  function anel(d, n) {
    const p = n ? Math.round((d / n) * 100) : 0;
    return `<svg class="anel-prog" viewBox="0 0 120 120" aria-hidden="true"><circle class="trilho-anel" cx="60" cy="60" r="56" pathLength="100"/>${p ? `<circle class="feito-anel" cx="60" cy="60" r="56" pathLength="100" stroke-dasharray="${p} 100"/>` : ""}</svg>`;
  }
  function logosMini(lista) {
    return (lista || []).filter((n) => window.LOGOS && window.LOGOS[n]).slice(0, 4).map((n) => `<img src="${window.LOGOS[n].uri}" alt="${esc(window.LOGOS[n].nome)}" title="${esc(window.LOGOS[n].nome)}" width="18" height="18">`).join("");
  }
  function vistaMapa() {
    const aqui = materiaAtual();
    const prox = proximoModulo(aqui);
    const xp = xpTotal(), nv = nivelDe(xp), of = ofensiva();
    const total = MATERIAS.reduce((a, m) => a + dominados(m), 0);
    let g = 0;
    const zonas = MUNDOS.map((w, wi) => {
      const cr = `var(--mv-${w.siglas[0]})`;
      const paradas = w.siglas.map((s) => {
        const m = POR_SIGLA[s];
        const i = MATERIAS.indexOf(m);
        const k = ONDA_MAPA[g++ % ONDA_MAPA.length];
        const d = dominados(m), n = m.modulos.length;
        const estado = d === n ? "concluida" : m === aqui ? "aqui" : i > MATERIAS.indexOf(aqui) ? "futura" : "andamento";
        const situacao = { concluida: "concluída", aqui: "você está aqui", futura: "a seguir", andamento: "em andamento" }[estado];
        const selo = estado === "concluida" ? ic("star-duotone") : estado === "futura" ? ic("lock-simple-duotone") : "";
        return `<div class="parada ${k <= 0 ? "lado-esq" : "lado-dir"} ${estado}" style="--k:${k};${coresDe(s)}">
          ${estado === "aqui" ? `<div class="voce-aqui">${mascote("padrao")}<span>você está aqui</span></div>` : ""}
          <a class="no" href="#trilha-${s}" aria-label="${esc(m.nome)}: ${d} de ${n} módulos, ${situacao}">${anel(d, n)}${ic(EMBLEMA[s])}${selo ? `<span class="selo-no">${selo}</span>` : ""}</a>
          <a class="parada-info" href="#trilha-${s}" tabindex="-1" aria-hidden="true">
            <small>matéria ${doisDig(i + 1)} · ${situacao}</small>
            <b>${esc(m.nome)}</b>
            <span class="barrinha"><i style="width:${(d / n) * 100}%"></i></span>
            <span class="linha-meta"><span>${d}/${n} módulos</span><span class="logos-mini">${logosMini(m.logos)}</span></span>
          </a>
        </div>`;
      }).join("");
      return `<section class="zona" id="mundo-${wi}" style="--cr:${cr}" aria-label="Mundo ${wi + 1}: ${esc(w.nome)}">
        <span class="cenario e" aria-hidden="true">${ic(w.cenario[0])}</span><span class="cenario d" aria-hidden="true">${ic(w.cenario[1])}</span>
        <div class="regiao"><div class="regiao-placa"><span class="chip">${ic(w.icone)}Mundo ${wi + 1}</span><h2>${esc(w.nome)}</h2><p>${esc(w.desc)}</p></div></div>
        ${paradas}
      </section>`;
    }).join("");
    const iAqui = MATERIAS.indexOf(aqui);
    centro().innerHTML = `
      <section class="mapa-hero">
        <div class="hero-texto">
          <span class="chip">${ic("sparkle-duotone")}Sua jornada em ciência de dados</span>
          <h1>16 matérias. <span class="grad">Um caminho.</span></h1>
          <p>Da lógica ao aprendizado de máquina, na ordem em que uma coisa prepara a outra. Siga a estrada; cada parada abre a matéria.</p>
          <div class="hero-acoes">
            <a class="btn btn-3d btn-grande" href="#estudo-${prox.codigo}" style="${coresDe(aqui.sigla)}" data-principal>${ic("play-bold")}Continuar: ${esc(prox.nome)}</a>
            <span class="hero-onde">${esc(aqui.nome)} · módulo ${MODULO[prox.codigo].indice + 1} de ${aqui.modulos.length}</span>
          </div>
        </div>
        <div class="hero-mascote" style="${coresDe(aqui.sigla)}">
          <div class="balao cor">${total ? `Você já dominou <b>${total}</b> ${total === 1 ? "módulo" : "módulos"}. ` : "Oi! Eu sou o Dado e vou com você. "}Próxima parada: <b>${esc(prox.nome)}</b>.</div>
          ${mascote(total ? "feliz" : "explica", "flutua")}
        </div>
        <div class="hero-stats">
          <div class="cartao-stat"><span class="ic-grande ic-tinta">${ic("map-trifold-duotone")}</span><div style="flex:1"><b>${total}<small> / ${TOTAL}</small></b><small>módulos dominados</small><div class="barrinha"><i style="width:${(total / TOTAL) * 100}%"></i></div></div></div>
          <div class="cartao-stat"><span class="ic-grande ic-chama">${ic("flame-duotone")}</span><div><b>${of} ${of === 1 ? "dia" : "dias"}</b><small>${of ? "seguidos estudando" : "domine um módulo hoje para acender"}</small></div></div>
          <div class="cartao-stat"><span class="ic-grande ic-ouro">${ic("lightning-duotone")}</span><div style="flex:1"><b>Nível ${nv.n}</b><small>${xp} XP · faltam ${100 - nv.resto} para o nível ${nv.n + 1}</small><div class="barrinha" style="--cv:var(--ouro)"><i style="width:${nv.resto}%"></i></div></div></div>
        </div>
      </section>
      <nav class="mundos-nav" aria-label="Ir para um mundo">${MUNDOS.map((w, wi) => {
        const ms = w.siglas.map((s) => POR_SIGLA[s]);
        const dd = ms.reduce((a, mm) => a + dominados(mm), 0), nn = ms.reduce((a, mm) => a + mm.modulos.length, 0);
        const atual = w.siglas.includes(aqui.sigla);
        return `<button type="button" class="mundo-chip${atual ? " atual" : ""}${dd === nn ? " feito" : ""}" data-mundo="${wi}" style="--cv:var(--mv-${w.siglas[0]})">${ic(dd === nn ? "check-circle-duotone" : w.icone)}<span><b>${wi + 1}. ${esc(w.nome)}</b><small>${dd}/${nn} módulos</small></span></button>`;
      }).join("")}</nav>
      <div class="mundo" id="mundo">
        <svg class="estrada" aria-hidden="true"></svg>
        ${zonas}
        <div class="fim-jornada"><span class="trofeu">${ic("trophy-duotone")}</span><b>Fim da jornada</b><small>${TOTAL} módulos, ${ORDEM.filter((c) => MODULO[c].mod.virada).length} pontos de virada</small></div>
      </div>`;
    const mundoEl = document.getElementById("mundo");
    estrada(mundoEl, ".no", iAqui, true);
    // os mundos entram na tela conforme você rola; a barra de mundos acompanha onde você está
    if ("IntersectionObserver" in window) {
      if (!semMovimento()) {
        mundoEl.classList.add("rev");
        const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("vis"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -6% 0px" });
        mundoEl.querySelectorAll(".parada, .regiao, .fim-jornada").forEach((el) => io.observe(el));
        observadores.push(io);
      }
      const chips = [...document.querySelectorAll(".mundo-chip")];
      const io2 = new IntersectionObserver((es) => es.forEach((e) => {
        if (!e.isIntersecting) return;
        chips.forEach((c) => c.classList.toggle("atual", c.dataset.mundo === e.target.id.replace("mundo-", "")));
      }), { rootMargin: "-35% 0px -60% 0px" });
      mundoEl.querySelectorAll(".zona").forEach((z) => io2.observe(z));
      observadores.push(io2);
    }
    document.querySelectorAll(".mundo-chip").forEach((c) => c.addEventListener("click", () => {
      document.getElementById("mundo-" + c.dataset.mundo).scrollIntoView({ behavior: semMovimento() ? "auto" : "smooth", block: "start" });
    }));
    teclas = (e) => { if (e.key === "Enter" && e.target === document.body) document.querySelector("[data-principal]").click(); };
  }

  // ---------- MATÉRIA ----------
  function dependencias(m) {
    const precisa = new Set(), prepara = new Set();
    m.modulos.forEach((mod) => mod.antes.forEach((a) => { if (a.materia !== m.sigla) precisa.add(a.materia); }));
    MATERIAS.forEach((o) => o.modulos.forEach((mod) => mod.antes.forEach((a) => { if (a.materia === m.sigla && o.sigla !== m.sigla) prepara.add(o.sigla); })));
    const ord = (s) => [...s].sort((a, b) => MATERIAS.indexOf(POR_SIGLA[a]) - MATERIAS.indexOf(POR_SIGLA[b]));
    return { precisa: ord(precisa), prepara: ord(prepara) };
  }
  const seloMat = (s, v = "trilha") => `<li><a class="selo-mat" href="#${v}-${s}" style="--c:var(--mv-${s})"><i></i>${esc(POR_SIGLA[s].nome)}</a></li>`;

  function vistaMateria(sigla, aba) {
    const m = POR_SIGLA[sigla];
    const i = MATERIAS.indexOf(m);
    const d = dominados(m), n = m.modulos.length;
    const prox = proximoModulo(m);
    const xpM = m.modulos.reduce((a, mod) => a + (estadoDe(mod.codigo) === "dominado" ? xpDe(mod.codigo) : 0), 0);
    const g = GUIA[sigla] || {};
    const abas = [["jornada", "trilha", "Jornada", "path-duotone"], ["guia", "guia", "Como funciona", "lightbulb-duotone"], ["fontes", "fontes", "Fontes", "books-duotone"]];
    centro().innerHTML = `
      <section class="mat-hero" style="${coresDe(sigla)}">
        <a class="voltar-mapa" href="#mapa">${ic("arrow-left-bold")}Mapa</a>
        <div class="emblema"><span class="no" aria-hidden="true">${anel(d, n)}${ic(EMBLEMA[sigla])}</span></div>
        <div class="mat-titulo">
          <span class="chip">Mundo ${MUNDO_DE[sigla] + 1} · matéria ${i + 1} de ${MATERIAS.length}</span>
          <h1>${esc(m.nome)}</h1>
          <div class="mat-meta"><span class="barrinha"><i style="width:${(d / n) * 100}%"></i></span><span><b>${d}/${n}</b> módulos</span><span><b>${xpM}</b> XP</span>${m.logos.length ? `<span class="logos-mini">${logosMini(m.logos)}</span>` : ""}</div>
        </div>
        <div class="mat-cta"><a class="btn btn-3d btn-grande" href="#estudo-${prox.codigo}" data-principal>${ic("play-bold")}${d === n ? "Revisar" : d ? "Continuar" : "Começar"}: ${esc(prox.nome)}</a><small>módulo ${MODULO[prox.codigo].indice + 1} de ${n} · +${xpDe(prox.codigo)} XP</small></div>
        ${g.frase ? `<div class="mat-fala">${mascote("explica")}<p class="balao cor glossavel">${esc(g.frase)}</p></div>` : ""}
      </section>
      <nav class="abas" aria-label="Partes da matéria" style="${coresDe(sigla)}">
        ${abas.map(([id, rotaAba, nome, icone]) => `<a class="aba" href="#${rotaAba}-${sigla}"${id === aba ? ' aria-current="page"' : ""}>${ic(icone)}${nome}</a>`).join("")}
      </nav>
      <div id="aba" style="${coresDe(sigla)}"></div>`;
    if (aba === "jornada") abaJornada(m);
    else if (aba === "guia") abaGuia(m);
    else abaFontes(m);
    glossar(document.querySelector(".mat-fala"), sigla, 2);
    teclas = (e) => {
      if (e.key === "Escape") fecharCascata(true);
      if (e.key === "Enter" && e.target === document.body) document.querySelector("[data-principal]").click();
    };
  }

  // jornada: os módulos como nós; selecionar um abre a cascata
  let cascataAberta = null;
  function abaJornada(m) {
    const prox = proximoModulo(m);
    const dep = dependencias(m);
    const ant = MATERIAS[MATERIAS.indexOf(m) - 1], seg = MATERIAS[MATERIAS.indexOf(m) + 1];
    const iProx = m.modulos.indexOf(prox);
    const nos = m.modulos.map((mod, k) => {
      const est = estadoDe(mod.codigo);
      const classe = est === "dominado" ? "dominado" : est === "rever" ? "rever" : mod === prox ? "proximo" : "nova";
      const kk = ONDA_MOD[k % ONDA_MOD.length];
      const miolo = est === "dominado" ? ic("check-bold") : est === "rever" ? ic("arrow-counter-clockwise-bold") : mod === prox ? ic("play-bold") : k + 1;
      const rotulo = est === "dominado" ? "dominado" : est === "rever" ? "rever" : mod === prox ? "próximo" : "";
      return `<div class="etapa ${classe} ${kk <= 0 ? "lado-esq" : "lado-dir"}${mod.virada ? " virada" : ""}" style="--k:${kk};--n:${k}" data-cod="${mod.codigo}">
        ${mod === prox && est !== "dominado" ? `<span class="comece-aqui">${d0(m) ? "continue aqui" : "comece aqui"}</span>` : ""}
        <button type="button" class="no-mod" aria-expanded="false" aria-controls="cascata" aria-label="Módulo ${k + 1}: ${esc(mod.nome)}${rotulo ? ", " + rotulo : ""}${mod.virada ? ", ponto de virada" : ""}">${miolo}${mod.virada ? `<span class="raio-virada">${ic("lightning-duotone")}</span>` : ""}</button>
        <span class="etapa-nome"><b>${esc(mod.nome)}</b><small>${mod.conceitos.length} conceitos${mod.virada ? " · ponto de virada" : ""}${rotulo ? " · " + rotulo : ""}</small></span>
      </div>`;
    }).join("");
    document.getElementById("aba").innerHTML = `
      <div class="jornada">
        <div class="trilha-nos" id="trilha-nos"><svg class="estrada" aria-hidden="true"></svg>${nos}</div>
        <aside class="jornada-lado">
          <div class="painel"><h3>${ic("hand-waving-duotone")}Como jogar</h3><p>Toque num módulo para abrir o que ele ensina. O brilho marca o próximo; o raio, um ponto de virada (vá devagar).</p></div>
          <div class="painel"><h3>${ic("path-duotone")}Usa o que veio de</h3><ul>${dep.precisa.map((s) => seloMat(s)).join("") || "<li>Nada: é um começo.</li>"}</ul></div>
          <div class="painel"><h3>${ic("rocket-launch-duotone")}Prepara para</h3><ul>${dep.prepara.map((s) => seloMat(s)).join("") || "<li>O fim da jornada.</li>"}</ul></div>
          <div class="painel"><h3>${ic("compass-duotone")}Vizinhas</h3><ul>${ant ? seloMat(ant.sigla) : ""}${seg ? seloMat(seg.sigla) : ""}</ul></div>
        </aside>
      </div>`;
    function d0(mm) { return dominados(mm) > 0; }
    const trilha = document.getElementById("trilha-nos");
    estrada(trilha, ".no-mod", Math.max(0, iProx), true);
    trilha.addEventListener("click", (e) => {
      const b = e.target.closest(".no-mod");
      if (b) { const cod = b.closest(".etapa").dataset.cod; if (cascataAberta === cod) fecharCascata(); else abrirCascata(cod); }
      if (e.target.closest("[data-fechar]")) fecharCascata(true);
    });
    cascataAberta = null;
  }
  function htmlCascata(cod) {
    const { mod, materia: m, indice } = MODULO[cod];
    const est = estadoDe(cod);
    let i = 0;
    const iv = () => `style="--i:${i++}"`;
    return `<div class="cascata" role="region" aria-label="Módulo ${indice + 1}: ${esc(mod.nome)}">
      <div class="cascata-cab" ${iv()}>
        <div class="tags"><span class="chip">módulo ${indice + 1} de ${m.modulos.length}</span>${mod.virada ? `<span class="chip virada">${ic("lightning-duotone")}ponto de virada</span>` : ""}${est === "dominado" ? `<span class="chip" style="--cor:var(--certo)">${ic("check-circle-duotone")}dominado</span>` : ""}</div>
        <h3>${esc(mod.nome)}</h3>
        <button type="button" class="btn btn-redondo btn-fantasma" data-fechar aria-label="Fechar">${ic("x-bold")}</button>
      </div>
      <div class="fala" ${iv()}>${mascote("explica")}<p class="balao cor glossavel">${esc(mod.dia)}</p></div>
      <div class="bloco-c" ${iv()}><h4>${ic("target-duotone")}Ao final, você consegue</h4><p class="glossavel">${esc(mod.dominio)}.</p></div>
      <div class="bloco-c" ${iv()}><h4>${ic("book-open-text-duotone")}Conceitos, em ordem</h4><ol class="chips-conceitos">${mod.conceitos.map((c, j) => `<li style="--j:${j}"><span>${esc(c)}</span></li>`).join("")}</ol></div>
      <div class="bloco-c" ${iv()}><h4>${ic("path-duotone")}Antes deste</h4>${mod.antes.length ? `<ul class="lista-antes">${mod.antes.map((a) => `<li class="${estadoDe(a.codigo) === "dominado" ? "ok" : ""}">${ic(estadoDe(a.codigo) === "dominado" ? "check-circle-duotone" : "question-duotone")}<a href="#estudo-${a.codigo}">${esc(a.nome)}</a>${a.materia !== m.sigla ? `<small>${esc(POR_SIGLA[a.materia].nome)}</small>` : ""}</li>`).join("")}</ul>` : "<p>Nada: dá para começar direto.</p>"}</div>
      <div class="cascata-pe" ${iv()}><span class="chip ouro">${ic("lightning-duotone")}+${xpDe(cod)} XP</span><a class="btn btn-3d" href="#estudo-${cod}">${ic("play-bold")}${est === "dominado" ? "Revisar" : "Começar a lição"}</a></div>
    </div>`;
  }
  function abrirCascata(cod) {
    const trilha = document.getElementById("trilha-nos");
    if (!trilha) return;
    fecharCascata(false, true);
    const etapa = trilha.querySelector(`.etapa[data-cod="${cod}"]`);
    const wrap = document.createElement("div");
    wrap.className = "cascata-wrap";
    wrap.id = "cascata";
    wrap.style.setProperty("--desloc", getComputedStyle(etapa).getPropertyValue("--desloc"));
    wrap.innerHTML = `<div class="cascata-dentro">${htmlCascata(cod)}</div>`;
    etapa.after(wrap);
    etapa.classList.add("aberta");
    trilha.classList.add("focando");
    etapa.querySelector(".no-mod").setAttribute("aria-expanded", "true");
    glossar(wrap, MODULO[cod].materia.sigla, 3);
    cascataAberta = cod;
    requestAnimationFrame(() => requestAnimationFrame(() => wrap.classList.add("aberta")));
    // se a cascata não couber na tela, rola até o nó selecionado, com a cascata logo abaixo
    setTimeout(() => {
      const r = wrap.getBoundingClientRect();
      if (r.bottom > window.innerHeight || r.top < 70) etapa.scrollIntoView({ behavior: semMovimento() ? "auto" : "smooth", block: "start" });
    }, semMovimento() ? 0 : 480);
  }
  function fecharCascata(focarNo, imediato) {
    const trilha = document.getElementById("trilha-nos");
    if (!trilha || !cascataAberta) return;
    const cod = cascataAberta;
    cascataAberta = null;
    const wrap = trilha.querySelector(".cascata-wrap");
    const etapa = trilha.querySelector(`.etapa[data-cod="${cod}"]`);
    if (etapa) { etapa.classList.remove("aberta"); etapa.querySelector(".no-mod").setAttribute("aria-expanded", "false"); if (focarNo) etapa.querySelector(".no-mod").focus(); }
    trilha.classList.remove("focando");
    if (!wrap) return;
    if (imediato || semMovimento()) { wrap.remove(); return; }
    wrap.classList.remove("aberta");
    wrap.querySelector(".cascata-dentro").style.overflow = "hidden";
    setTimeout(() => wrap.remove(), 460);
  }

  // como funciona: subtópicos em sanfona, um aberto por vez
  function secoesDe(m) {
    const s = m.sigla, g = GUIA[s];
    const lista = [];
    lista.push({ id: "ideia", icone: "lightbulb-duotone", titulo: "A ideia", dica: "o essencial, em poucas linhas", html: () => `<p class="frase-destaque">${esc(g.frase)}</p><div class="prosa-jogo glossavel">${g.texto.map((p) => `<p>${p}</p>`).join("")}</div>` });
    lista.push({ id: "desenho", icone: "image-duotone", titulo: "Veja o desenho", dica: g.figuras.length > 1 ? `${g.figuras.length} ilustrações; toque para ampliar` : "a ilustração; toque para ampliar", html: () => g.figuras.map(([chave, legenda]) => figura(chave, legenda)).join("") });
    const clipes = (window.CLIPES && window.CLIPES[s]) || [];
    if (clipes.length) lista.push({ id: "assista", icone: "film-strip-duotone", titulo: "Assista", dica: clipes.length > 1 ? `${clipes.length} clipes curtos, com legenda` : `clipe de ${Math.round(clipes[0].fim)} segundos, com legenda`, html: () => `<div class="clipes">${clipes.map((c, k) => `<div class="clipe" data-clipe="${k}"></div>`).join("")}</div><p class="mini-legenda">Use a barra para voltar e avançar, e o botão 1x para deixar mais devagar.</p>`, montar: (el) => el.querySelectorAll("[data-clipe]").forEach((c) => window.CLIPE_PLAYER(c, clipes[Number(c.dataset.clipe)])) });
    const exp = window.EXPERIMENTE && window.EXPERIMENTE[s];
    if (exp) lista.push({ id: "experimente", icone: "cursor-click-duotone", titulo: "Experimente", dica: "mude os valores e veja o resultado na hora", html: () => `${s === "LOG" ? figura(g.figuras[0][0], "O caminho que acende é o que o algoritmo segue com o valor que você digitou.") : ""}<section class="experimente"><header><b>experimente</b><span>${esc(exp.titulo)}</span></header><div class="area-exp"></div></section>`, montar: (el) => exp.montar(el.querySelector(".area-exp"), el.querySelector("figure")) });
    lista.push({ id: "dia", icone: "coffee-duotone", titulo: "No dia a dia", dica: "onde você já usa isso sem perceber", html: () => `<div class="fala">${mascote("feliz")}<p class="balao cor glossavel">${esc(g.dia)}</p></div>` });
    lista.push({ id: "codigo", icone: "code-duotone", titulo: "No computador", dica: "a mesma ideia escrita em código", html: () => `<div class="duo"><pre><code class="language-${g.lang || "python"}">${esc(g.codigo)}</code></pre>${g.codigo2 ? `<pre><code class="language-${g.lang || "python"}">${esc(g.codigo2)}</code></pre>` : ""}</div>` });
    lista.push({ id: "onde", icone: "graduation-cap-duotone", titulo: "Onde isso cai", dica: "faculdade, concursos e trabalho", html: () => `<div class="onde-lista">${g.onde.map(([a, b]) => `<div><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join("")}</div>${m.logos.length ? `<div class="logo-lista">${m.logos.filter((l) => window.LOGOS[l]).map((l) => `<span><img src="${window.LOGOS[l].uri}" alt="" width="26" height="26">${esc(window.LOGOS[l].nome)}</span>`).join("")}</div>` : ""}` });
    return lista;
  }
  function figura(chave, legenda) {
    return `<figure class="figura-jogo" data-fig="${chave}"><button class="ampliar" type="button">${ic("magnifying-glass-duotone")} Ampliar</button><div class="rolagem">${window.FIG[chave]()}</div><figcaption>${esc(legenda)}</figcaption></figure>`;
  }
  function abaGuia(m) {
    const s = m.sigla;
    const secoes = secoesDe(m);
    const visto = new Set(vistos[s] || []);
    const abrirPrimeiro = (secoes.find((x) => !visto.has(x.id)) || secoes[0]).id;
    document.getElementById("aba").innerHTML = `
      <div class="subtopicos">
        <div class="vistos"><span id="conta-vistos"></span><span class="barrinha" aria-hidden="true"><i id="barra-vistos"></i></span></div>
        ${secoes.map((x, k) => `<section class="sub" data-sub="${x.id}">
          <button type="button" class="sub-cab" aria-expanded="false" aria-controls="corpo-${x.id}">
            <span class="medalha">${ic(x.icone)}<em>${k + 1}</em></span>
            <span class="sub-txt"><b>${x.titulo}</b><small>${esc(x.dica)}</small></span>
            <span class="sub-estado"><span class="visto-slot"></span>${ic("caret-down-bold", "ic seta")}</span>
          </button>
          <div class="sub-corpo-wrap"><div class="sub-corpo" id="corpo-${x.id}" role="region" aria-label="${x.titulo}"><div></div></div></div>
        </section>`).join("")}
        <div style="display:flex;justify-content:center;margin-top:8px"><a class="btn btn-3d btn-grande" href="#trilha-${s}">${ic("path-duotone")}Ir para a jornada dos módulos</a></div>
      </div>`;
    const atualizarVistos = () => {
      const v = new Set(vistos[s] || []);
      document.getElementById("conta-vistos").innerHTML = `Subtópicos vistos: <b>${secoes.filter((x) => v.has(x.id)).length} de ${secoes.length}</b>`;
      document.getElementById("barra-vistos").style.width = `${(secoes.filter((x) => v.has(x.id)).length / secoes.length) * 100}%`;
      document.querySelectorAll(".sub").forEach((el) => { el.querySelector(".visto-slot").innerHTML = v.has(el.dataset.sub) ? ic("check-circle-duotone", "ic visto") : ""; });
    };
    const montados = new Set();
    const abrir = (id, rolar) => {
      document.querySelectorAll(".sub").forEach((el) => {
        const aberto = el.dataset.sub === id && !el.classList.contains("aberto");
        el.classList.toggle("aberto", aberto);
        el.querySelector(".sub-cab").setAttribute("aria-expanded", String(aberto));
        if (!aberto) return;
        const x = secoes.find((q) => q.id === id);
        const alvo = el.querySelector(".sub-corpo > div");
        if (!montados.has(id)) {
          alvo.innerHTML = x.html();
          [...alvo.children].forEach((c, k) => c.style.setProperty("--i", k));
          if (x.montar) x.montar(alvo);
          if (window.hljs) alvo.querySelectorAll("pre code").forEach((b) => window.hljs.highlightElement(b));
          alvo.querySelectorAll("figure").forEach(ampliavel);
          glossar(alvo, s, 6);
          montados.add(id);
        }
        vistos[s] = [...new Set([...(vistos[s] || []), id])];
        salvarVistos();
        if (rolar) setTimeout(() => el.scrollIntoView({ behavior: semMovimento() ? "auto" : "smooth", block: "start" }), semMovimento() ? 0 : 140);
      });
      atualizarVistos();
    };
    document.querySelectorAll(".sub-cab").forEach((b) => b.addEventListener("click", () => abrir(b.closest(".sub").dataset.sub, true)));
    abrir(abrirPrimeiro, false);
  }
  function ampliavel(fig) {
    const abrirAmp = () => {
      document.getElementById("conteudo-ampliado").innerHTML = fig.querySelector(".rolagem").innerHTML + `<p>${esc(fig.querySelector("figcaption").textContent)}</p>`;
      const dlg = document.getElementById("ampliado");
      const aba = fig.closest("#aba");
      dlg.style.cssText = aba ? aba.getAttribute("style") : "";
      if (typeof dlg.showModal === "function") dlg.showModal();
    };
    fig.querySelector(".ampliar").addEventListener("click", abrirAmp);
    fig.querySelector(".rolagem").addEventListener("click", (e) => { if (!e.target.closest("input,button,select")) abrirAmp(); });
  }
  const ICONE_FONTE = (url) => /github\.com/.test(url) ? "git-branch-duotone" : /youtube|video/.test(url) ? "film-strip-duotone" : /doi\.org|acm\.org|arxiv|springer|ieee|scielo/.test(url) ? "graduation-cap-duotone" : "book-open-text-duotone";
  function cartaoFonte(k, extra = "") {
    const [titulo, url, desc] = FONTE[k];
    return `<a class="fonte" href="${url}" target="_blank" rel="noopener"><span class="ic-f">${ic(ICONE_FONTE(url))}</span><span><b>${esc(titulo)}</b><small>${esc(desc)}${extra}</small></span></a>`;
  }
  function abaFontes(m) {
    document.getElementById("aba").innerHTML = `<div class="subtopicos"><p class="mini-legenda">De onde vêm a ordem, os exemplos e os tropeços desta matéria. Abre em outra aba.</p><div class="fontes-cartoes">${(POR_MATERIA[m.sigla] || []).map((k) => cartaoFonte(k)).join("")}</div><p class="mini-legenda"><a href="#fontes">Ver todas as fontes da apostila</a></p></div>`;
  }

  // ---------- FONTES (todas) ----------
  function vistaFontes() {
    const usadoEm = {};
    Object.entries(POR_MATERIA).forEach(([s, ks]) => ks.forEach((k) => { (usadoEm[k] = usadoEm[k] || []).push(s); }));
    centro().innerHTML = `
      <div class="cabeca-pagina"><span class="chip">${ic("books-duotone")}Referências</span><h1>Fontes</h1><p>De onde vêm a ordem das matérias, os pré-requisitos, os tropeços comuns e o material de estudo. A pesquisa completa está no repositório, em docs/05 e docs/06. Os logos vêm do Devicon e do Simple Icons; as marcas pertencem aos donos.</p></div>
      ${GRUPOS.map(([titulo, ks]) => `<section class="fontes-grupo-j"><h2>${esc(titulo)}</h2><div class="fontes-cartoes">${ks.map((k) => cartaoFonte(k, usadoEm[k] ? " · " + usadoEm[k].map((s) => POR_SIGLA[s].nome).join(", ") : "")).join("")}</div></section>`).join("")}`;
    teclas = null;
  }

  // ---------- LIÇÃO ----------
  let estudo = { cod: null, passo: 0, liberado: [true, true, true, false, false], direcao: 1 };
  let autoAvanco = 0;
  function vistaEstudo(cod) {
    if (estudo.cod !== cod) estudo = { cod, passo: 0, liberado: [true, true, true, false, false], direcao: 1 };
    clearTimeout(autoAvanco);
    const { mod, materia: m, indice } = MODULO[cod];
    const p = estudo.passo;
    const seguinte = ORDEM[ORDEM.indexOf(cod) + 1];
    let i = 0;
    const iv = () => `style="--i:${i++}"`;
    const rotulo = `<div class="passo-rotulo" ${iv()}><span class="chip">${ic(PASSOS[p][1])}passo ${p + 1} de 5 · ${PASSOS[p][0]}</span>${mod.virada ? `<span class="chip virada">${ic("lightning-duotone")}ponto de virada</span>` : ""}</div>`;
    let corpo = "";
    if (p === 0) {
      const falta = mod.antes.filter((a) => estadoDe(a.codigo) !== "dominado");
      corpo = `${rotulo}<h1 class="passo-titulo" ${iv()}>${esc(mod.nome)}</h1><p class="passo-sub" ${iv()}>${esc(m.nome)} · módulo ${indice + 1} de ${m.modulos.length}${estadoDe(cod) === "dominado" ? " · já dominado" : ""}</p>
        <div class="fala" ${iv()}>${mascote(mod.antes.length ? "explica" : "feliz", "flutua")}<p class="balao cor">${mod.antes.length ? `Este módulo usa ${mod.antes.length === 1 ? "uma coisa" : mod.antes.length + " coisas"} que vieram antes. ${falta.length ? "Se travar, volte nelas." : "Você já dominou tudo. Bora!"}` : "Este módulo não exige nada antes. É um começo. Bora!"}${mod.virada ? " <b>É um ponto de virada:</b> demora um pouco a fazer sentido, e depois muda tudo." : ""}</p></div>
        ${mod.antes.length ? `<ul class="lista-pre-j" ${iv()}>${mod.antes.map((a) => `<li class="${estadoDe(a.codigo) === "dominado" ? "ok" : ""}"><a href="#estudo-${a.codigo}"><span class="bolinha">${ic(estadoDe(a.codigo) === "dominado" ? "check-bold" : "question-duotone")}</span><span><b>${esc(a.nome)}</b><br><small>${esc(POR_SIGLA[a.materia].nome)}</small></span><small>${estadoDe(a.codigo) === "dominado" ? "dominado" : "não marcado"}</small></a></li>`).join("")}</ul>` : ""}
        ${falta.length ? `<p class="aviso-j" ${iv()}>Você ainda não marcou ${falta.length === 1 ? "esse pré-requisito" : "esses pré-requisitos"} como dominado. Pode seguir; se travar, volte ${falta.length === 1 ? "nele" : "neles"} primeiro.</p>` : ""}`;
    }
    if (p === 1) corpo = `${rotulo}<h1 class="passo-titulo" ${iv()}>Para que serve</h1>
      <div class="fala" ${iv()}>${mascote("explica", "flutua")}<p class="balao cor texto-grande glossavel">${esc(mod.dia)}</p></div>
      <div class="alvo" ${iv()}><span class="ic-a">${ic("target-duotone")}</span><div><small>ao final, você consegue</small><p class="glossavel">${esc(mod.dominio)}.</p></div></div>`;
    if (p === 2) corpo = `${rotulo}<h1 class="passo-titulo" ${iv()}>O que você aprende</h1><p class="passo-sub" ${iv()}>${mod.conceitos.length} conceitos, nesta ordem. Toque nos termos sublinhados para ver o que significam.</p>
      <ol class="conceito-cards glossavel" ${iv()}>${mod.conceitos.map((c, j) => `<li style="--j:${j}"><span>${esc(c.charAt(0).toUpperCase() + c.slice(1))}</span></li>`).join("")}</ol>
      ${LICOES[cod] ? `<a class="cartao-link" href="${LICOES[cod]}" ${iv()}><span class="ic-a">${ic("play-duotone")}</span><span><b>Lição ilustrada deste módulo</b><small>exercícios com correção na hora, um conceito por vez</small></span>${ic("arrow-right-bold")}</a>` : ""}
      <a class="cartao-link" href="#guia-${m.sigla}" ${iv()}><span class="ic-a">${ic("film-strip-duotone")}</span><span><b>Ver o desenho, o clipe e a caixa interativa</b><small>${esc(m.nome)}: como funciona</small></span>${ic("arrow-right-bold")}</a>
      <p class="passo-sub" ${iv()}>A aula de cada conceito, com exercícios corrigidos, também está no tutor: no Claude Code, digite <code>/aula</code>.</p>`;
    if (p === 3) corpo = `${rotulo}<h1 class="passo-titulo" ${iv()}>Cuidado com</h1>
      <div class="cuidado" ${iv()}><span class="ic-a">${ic("warning-duotone")}</span><p class="glossavel">${esc(mod.tropeco)}</p></div>
      <div class="fala" ${iv()}>${mascote("pensa")}<p class="balao">É o erro mais comum nesta etapa. Saber dele antes já evita metade das vezes.</p></div>`;
    if (p === 4) corpo = `${rotulo}<h1 class="passo-titulo" ${iv()}>Pronto para avançar?</h1>
      <div class="fala" ${iv()}>${mascote("pensa", "flutua")}<p class="balao cor texto-grande">${esc(mod.pergunta)}</p></div>
      <label class="resposta-campo" ${iv()}><span>Escreva a sua resposta antes de ver a nossa</span><textarea id="resp" rows="4"></textarea></label>
      <div class="botoes-j" ${iv()}><button type="button" class="btn btn-3d" data-comparar disabled>${ic("check-bold")}Comparar com a resposta</button><button type="button" class="btn" data-naosei>Ainda não sei</button></div>
      <div data-resposta hidden></div>`;
    const pe = p < 3
      ? `<button type="button" class="btn btn-3d btn-grande" data-continuar>Continuar${ic("arrow-right-bold")}</button>`
      : p === 3
        ? `<button type="button" class="btn btn-3d btn-grande" data-continuar>${ic("check-bold")}Entendi, seguir</button>`
        : seguinte ? `<a class="btn btn-fantasma" href="#estudo-${seguinte}">Pular para o próximo módulo</a>` : "";
    const segs = PASSOS.map(([nome], k) => `<button type="button" class="seg ${k < p ? "feito" : k === p ? "atual" : ""}" data-ir="${k}" aria-label="Passo ${k + 1}: ${nome}${k < p ? ", feito" : k === p ? ", atual" : ""}"${k > p && !estudo.liberado.slice(0, k + 1).every(Boolean) ? " disabled" : ""}></button>`).join("");
    centro().innerHTML = `
      <div class="licao" style="${coresDe(m.sigla)}">
        <header class="licao-topo">
          <a class="btn btn-redondo btn-fantasma" href="#trilha-${m.sigla}" aria-label="Sair da lição e voltar para ${esc(m.nome)}">${ic("x-bold")}</a>
          <nav class="segmentos" aria-label="Passos da lição">${segs}</nav>
          <span class="licao-xp" title="XP ao dominar este módulo">${ic("lightning-duotone")}+${xpDe(cod)}</span>
        </header>
        <main class="licao-palco"><div class="cartao-passo ${estudo.direcao < 0 ? "entra-volta" : "entra"}">${corpo}</div></main>
        <footer class="licao-pe"><div>
          <button type="button" class="btn btn-fantasma" data-voltar${p === 0 ? " disabled" : ""}>${ic("arrow-left-bold")}Voltar</button>
          <span class="dica">${p < 3 ? "Enter ou seta para a direita: continuar" : p === 3 ? "Leia o tropeço e confirme para seguir" : "Acertou: o módulo fica dominado e você segue"}</span>
          ${pe}
        </div></footer>
      </div>`;
    glossar(document.querySelector(".cartao-passo"), m.sigla, 5);

    const ir = (k) => {
      estudo.direcao = k >= estudo.passo ? 1 : -1;
      estudo.passo = Math.max(0, Math.min(4, k));
      vistaEstudo(cod);
      window.scrollTo(0, 0);
    };
    const avancar = () => {
      if (estudo.passo === 3) { estudo.liberado[3] = true; estudo.liberado[4] = true; ir(4); return; }
      if (estudo.passo < 3) { estudo.liberado[estudo.passo + 1] = true; ir(estudo.passo + 1); }
    };
    document.querySelectorAll("[data-ir]").forEach((b) => b.addEventListener("click", () => ir(Number(b.dataset.ir))));
    document.querySelector("[data-voltar]").addEventListener("click", () => ir(estudo.passo - 1));
    const cont = document.querySelector("[data-continuar]");
    if (cont) cont.addEventListener("click", avancar);
    if (p === 4) montarPergunta(cod, mod, seguinte);
    teclas = (e) => {
      if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
      if (e.key === "Escape") { location.hash = `#trilha-${m.sigla}`; return; }
      if ((e.key === "ArrowRight" || e.key === "Enter") && estudo.passo < 4 && !e.target.closest("a,button:not([data-continuar])")) { e.preventDefault(); avancar(); }
      if (e.key === "ArrowLeft" && estudo.passo > 0) { e.preventDefault(); ir(estudo.passo - 1); }
    };
  }
  function montarPergunta(cod, mod, seguinte) {
    const area = document.getElementById("resp");
    const comparar = document.querySelector("[data-comparar]");
    const caixa = document.querySelector("[data-resposta]");
    const mostrar = (podeAcertar) => {
      const pf = document.querySelector(".cartao-passo .mascote");
      if (pf) pf.innerHTML = window.MASCOTE[podeAcertar ? "explica" : "padrao"].replace(/viewboxMask/g, "vmx");
      caixa.hidden = false;
      caixa.innerHTML = `<div class="resposta-j">${ic("check-circle-duotone")}<div><small>a nossa resposta</small><p>${esc(mod.resposta)}</p></div></div>
        <div class="botoes-j" style="margin-top:14px">${podeAcertar ? `<button type="button" class="btn btn-3d sucesso btn-grande" data-acertei>${ic("trophy-duotone")}Acertei: dominar módulo</button>` : ""}<button type="button" class="btn" data-rever>${ic("arrow-counter-clockwise-bold")}Ainda não: rever os conceitos</button></div>`;
      const ac = caixa.querySelector("[data-acertei]");
      if (ac) { ac.addEventListener("click", () => vitoria(cod, seguinte)); ac.focus({ preventScroll: true }); }
      caixa.querySelector("[data-rever]").addEventListener("click", () => { marcar(cod, "rever"); toast("Marcado para rever. Volte aos conceitos com calma.", "arrow-counter-clockwise-bold"); estudo.direcao = -1; estudo.passo = 2; vistaEstudo(cod); window.scrollTo(0, 0); });
      caixa.scrollIntoView({ behavior: semMovimento() ? "auto" : "smooth", block: "nearest" });
    };
    area.addEventListener("input", () => { comparar.disabled = area.value.trim().length < 3; });
    comparar.addEventListener("click", () => mostrar(true));
    document.querySelector("[data-naosei]").addEventListener("click", () => mostrar(false));
    area.focus({ preventScroll: true });
  }
  function vitoria(cod, seguinte) {
    const antes = nivelDe(xpTotal()).n;
    const jaEra = estadoDe(cod) === "dominado";
    marcar(cod, "dominado");
    const depois = nivelDe(xpTotal());
    const { materia: m } = MODULO[cod];
    const fimMateria = MODULO[cod].indice === m.modulos.length - 1;
    const dur = 2.8;
    const el = document.createElement("div");
    el.className = "vitoria";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-label", "Módulo dominado");
    el.style.cssText = coresDe(m.sigla);
    el.innerHTML = `<div class="vitoria-cartao">
      ${mascote(fimMateria ? "uau" : "feliz")}
      <h2>${fimMateria ? "Matéria concluída!" : "Módulo dominado!"}</h2>
      <span class="ganho-xp">${ic("lightning-duotone")}<span>+<span data-xp>0</span> XP</span></span>
      <p>${jaEra ? "Revisão feita. " : ""}Nível ${depois.n} · ${depois.resto} de 100 XP${depois.n > antes ? ". Você subiu de nível!" : ""}</p>
      ${seguinte ? `<p>Próximo: <b>${esc(MODULO[seguinte].mod.nome)}</b></p><div class="contagem" style="--dur:${dur}s"><i></i></div>` : "<p>Você terminou a jornada inteira.</p>"}
      <div class="vitoria-acoes">${seguinte ? `<button type="button" class="btn btn-3d" data-seguir>${ic("arrow-right-bold")}Seguir agora</button><button type="button" class="btn" data-ficar>Ficar aqui</button>` : `<a class="btn btn-3d" href="#mapa">${ic("map-trifold-duotone")}Ver o mapa</a>`}</div>
    </div>`;
    document.body.appendChild(el);
    const rc = el.querySelector(".vitoria-cartao").getBoundingClientRect();
    confete(rc.left + rc.width / 2, rc.top + rc.height * 0.3, m.sigla);
    const ganho = xpDe(cod);
    const alvoXp = el.querySelector("[data-xp]");
    if (semMovimento()) alvoXp.textContent = ganho;
    else { const t0 = performance.now(); const passo = (t) => { const f = Math.min(1, (t - t0) / 700); alvoXp.textContent = Math.round(ganho * (1 - Math.pow(1 - f, 3))); if (f < 1) requestAnimationFrame(passo); }; requestAnimationFrame(passo); }
    if (depois.n > antes) setTimeout(() => toast(`Nível ${depois.n}!`, "crown-duotone"), 600);
    const fechar = () => { clearTimeout(autoAvanco); el.remove(); };
    const seguir = () => { fechar(); location.hash = "#estudo-" + seguinte; };
    if (seguinte) {
      el.querySelector("[data-seguir]").addEventListener("click", seguir);
      el.querySelector("[data-ficar]").addEventListener("click", () => { fechar(); render(); });
      el.querySelector("[data-seguir]").focus();
      autoAvanco = setTimeout(() => { if (document.body.contains(el)) seguir(); }, dur * 1000);
    } else el.querySelector("a").addEventListener("click", fechar);
    el.addEventListener("keydown", (e) => { if (e.key === "Escape") { fechar(); render(); } });
  }

  // ---------- confete (sem biblioteca) ----------
  function confete(x, y, sigla) {
    if (semMovimento()) return;
    const cv = document.getElementById("confete");
    const ctx = cv.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const tela = cv.getBoundingClientRect();
    const W = tela.width, H = tela.height;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    const limpar = () => { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    const css = getComputedStyle(document.documentElement);
    const cores = [`--mv-${sigla}`, "--ouro", "--mv-ED", "--mv-CMP", "--mv-MAT", "--tinta"].map((v) => css.getPropertyValue(v).trim() || "#ffd166");
    const ps = Array.from({ length: 140 }, () => {
      const a = Math.random() * Math.PI * 2, v = 6 + Math.random() * 10;
      return { x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 7, r: 4 + Math.random() * 5, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.35, cor: cores[(Math.random() * cores.length) | 0], forma: Math.random() < 0.55, vida: 1 };
    });
    const quadro = () => {
      limpar();
      let vivos = 0;
      for (const q of ps) {
        q.vy += 0.36; q.vx *= 0.985; q.x += q.vx; q.y += q.vy; q.rot += q.vr; q.vida -= 0.009;
        if (q.vida <= 0 || q.y > H + 30) continue;
        vivos++;
        ctx.save(); ctx.globalAlpha = Math.min(1, q.vida * 1.6); ctx.translate(q.x, q.y); ctx.rotate(q.rot); ctx.fillStyle = q.cor;
        if (q.forma) ctx.fillRect(-q.r, -q.r / 2.4, q.r * 2, q.r / 1.2); else { ctx.beginPath(); ctx.arc(0, 0, q.r / 1.5, 0, 7); ctx.fill(); }
        ctx.restore();
      }
      if (vivos) requestAnimationFrame(quadro); else limpar();
    };
    requestAnimationFrame(quadro);
  }
  let tToast = 0;
  function toast(texto, icone = "sparkle-duotone") {
    document.querySelectorAll(".toast").forEach((t) => t.remove());
    const t = document.createElement("div");
    t.className = "toast";
    t.setAttribute("role", "status");
    t.innerHTML = `${ic(icone)}<span>${esc(texto)}</span>`;
    document.body.appendChild(t);
    clearTimeout(tToast);
    tToast = setTimeout(() => t.remove(), 3300);
  }

  // ---------- balões do glossário ----------
  const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const TERMOS = (window.GLOSSARIO || []).map(([formas, def, en, onde], i) => ({ formas, def, en, onde, i }));
  const FORMA = new Map();
  TERMOS.forEach((t) => t.formas.forEach((f) => FORMA.set(f.toLowerCase(), t)));
  let RE = null;
  try { RE = new RegExp(`(?<![\\p{L}\\p{N}-])(${[...FORMA.keys()].sort((a, b) => b.length - a.length).map(escRe).join("|")})(?![\\p{L}\\p{N}-])`, "giu"); } catch (e) { RE = null; }
  function glossar(raiz, sigla, max = 6) {
    if (!raiz || !RE) return;
    const alvos = raiz.classList && raiz.classList.contains("glossavel") ? [raiz] : [...raiz.querySelectorAll(".glossavel")];
    const usados = new Set();
    let n = 0;
    alvos.forEach((alvo) => {
      const andar = document.createTreeWalker(alvo, NodeFilter.SHOW_TEXT, { acceptNode: (no) => (no.parentElement.closest("code,pre,a,button,svg,textarea,label") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT) });
      const textos = [];
      while (andar.nextNode()) textos.push(andar.currentNode);
      for (const no of textos) {
        if (n >= max) return;
        const s = no.nodeValue;
        RE.lastIndex = 0;
        let mm, ultimo = 0, frag = null;
        while ((mm = RE.exec(s)) && n < max) {
          const t = FORMA.get(mm[1].toLowerCase());
          if (!t || usados.has(t.i) || (t.onde && sigla && !t.onde.includes(sigla))) continue;
          usados.add(t.i); n++;
          frag = frag || document.createDocumentFragment();
          frag.append(s.slice(ultimo, mm.index));
          const b = document.createElement("button");
          b.type = "button"; b.className = "termo"; b.dataset.t = t.i; b.textContent = mm[1]; b.setAttribute("aria-expanded", "false");
          frag.append(b);
          ultimo = mm.index + mm[1].length;
        }
        if (frag) { frag.append(s.slice(ultimo)); no.replaceWith(frag); }
      }
    });
  }
  const balao = document.getElementById("balao");
  let termoAtivo = null, fixo = false;
  function mostrarBalao(b, fixar) {
    const t = TERMOS[Number(b.dataset.t)];
    if (!t) return;
    if (termoAtivo && termoAtivo !== b) termoAtivo.setAttribute("aria-expanded", "false");
    termoAtivo = b; fixo = fixar;
    balao.innerHTML = `<b>${esc(t.formas[0])}</b><small>em inglês: ${esc(t.en)}</small><p>${esc(t.def)}</p>`;
    balao.hidden = false;
    balao.classList.remove("acima");
    const r = b.getBoundingClientRect();
    const w = balao.offsetWidth, h = balao.offsetHeight;
    const meio = r.left + r.width / 2;
    const esq = Math.max(12, Math.min(innerWidth - w - 12, meio - w / 2));
    let topo = r.bottom + 12;
    if (topo + h > innerHeight - 8 && r.top - h - 12 > 8) { topo = r.top - h - 12; balao.classList.add("acima"); }
    balao.style.left = `${esq + scrollX}px`;
    balao.style.top = `${topo + scrollY}px`;
    balao.style.setProperty("--seta", `${Math.max(18, Math.min(w - 18, meio - esq))}px`);
    b.setAttribute("aria-expanded", "true");
    b.setAttribute("aria-describedby", "balao");
  }
  function esconderBalao() {
    balao.hidden = true;
    if (termoAtivo) { termoAtivo.setAttribute("aria-expanded", "false"); termoAtivo.removeAttribute("aria-describedby"); }
    termoAtivo = null; fixo = false;
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest(".termo");
    if (b) { if (termoAtivo === b && fixo) esconderBalao(); else mostrarBalao(b, true); return; }
    if (!e.target.closest("#balao")) esconderBalao();
  });
  document.addEventListener("mouseover", (e) => { const b = e.target.closest(".termo"); if (b && !fixo) mostrarBalao(b, false); });
  document.addEventListener("mouseout", (e) => { const b = e.target.closest(".termo"); if (b && !fixo && !(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest(".termo") === b)) esconderBalao(); });
  document.addEventListener("focusin", (e) => { const b = e.target.closest && e.target.closest(".termo"); if (b) mostrarBalao(b, false); else if (!fixo) esconderBalao(); });
  window.addEventListener("scroll", () => { if (!fixo) esconderBalao(); }, { passive: true });
  window.addEventListener("resize", esconderBalao, { passive: true });

  // ---------- roteamento ----------
  function transicao(fazer) {
    if (!document.startViewTransition || semMovimento()) { fazer(); return; }
    // a transição pode ser abortada (por exemplo, quando a barra do navegador do celular muda a altura da tela); a troca acontece mesmo assim
    const t = document.startViewTransition(fazer);
    [t.ready, t.finished, t.updateCallbackDone].forEach((pr) => pr && pr.catch(() => {}));
  }
  let teclas = null;
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !balao.hidden) { esconderBalao(); return; }
    if (teclas && !e.ctrlKey && !e.metaKey && !e.altKey) teclas(e);
  });
  function render() {
    const r = rota();
    esconderBalao();
    if (observador) { observador.disconnect(); observador = null; }
    observadores.splice(0).forEach((o) => o.disconnect());
    clearTimeout(autoAvanco);
    document.querySelectorAll(".vitoria").forEach((v) => v.remove());
    desenharHud();
    if (r.v === "mapa") vistaMapa();
    else if (r.v === "materia") vistaMateria(r.sigla, r.aba);
    else if (r.v === "estudo") vistaEstudo(r.cod);
    else vistaFontes();
    const titulo = r.v === "mapa" ? "Mapa" : r.v === "fontes" ? "Fontes" : r.v === "estudo" ? MODULO[r.cod].mod.nome : POR_SIGLA[r.sigla].nome;
    document.title = `${titulo} · Domínio`;
  }
  document.querySelector(".hud-nav [data-v='materia']").addEventListener("click", (e) => { e.preventDefault(); location.hash = "#trilha-" + materiaAtual().sigla; });
  document.getElementById("fechar-ampliado").addEventListener("click", () => document.getElementById("ampliado").close());
  document.body.insertAdjacentHTML("afterbegin", window.FIG_DEFS);
  window.addEventListener("hashchange", () => transicao(() => { render(); window.scrollTo(0, 0); }));
  render();
})();
