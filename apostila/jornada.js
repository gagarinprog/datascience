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
  const LICOES = { "LOG.01": "licoes/LOG.01.html", "PY.01": "licoes/PY.01.html", "LOG.02": "licoes/LOG.02.html", "LOG.03": "licoes/LOG.03.html", "ED.01": "licoes/ED.01.html" };
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
  // nas telas de explicação a cor de destaque é o azul metálico (o mapa mantém as cores das matérias)
  const coresExp = () => "--cor:var(--azul-cor);--cv:var(--azul-cv)";
  const mov = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  const semMovimento = () => mov.matches;
  const centro = () => document.getElementById("conteudo");
  // guia (personagem): o elenco original de personagens.js e o panda; a escolha fica neste navegador
  const CHAVE_GUIA = "dominio:guia:v1";
  let guiaId = "rin";
  try { const salvo = localStorage.getItem(CHAVE_GUIA); if (salvo && window.GUIAS && window.GUIAS[salvo]) guiaId = salvo; } catch (e) { /* sem armazenamento */ }
  const guia = () => window.GUIAS[guiaId] || window.GUIAS.rin;
  window.guiaAtual = guia;
  // mov: movimentos de guia-mov.js que rodam quando o guia aparece (por exemplo "chegar falar")
  function mascote(expr = "padrao", classe = "", mov = "") {
    const g = guia();
    return `<div class="mascote${g.id === "panda" ? "" : " retrato"} ${classe}" data-guia="${g.id}" data-expr="${expr}"${mov ? ` data-mov="${mov}"` : ""} aria-hidden="true">${g.expr[expr] || g.expr.padrao}</div>`;
  }

  // ---------- progresso: base de dados do artefato quando houver; navegador como reserva ----------
  // Um documento só (progresso/geral) guarda tudo: módulos dominados, o passo em que cada lição parou,
  // conceitos marcados, respostas escritas, trilhas de explicação, clipes vistos, previsões e tentativas.
  const CHAVE = "dominio:progresso:v1";
  const CAMPOS = ["modulos", "passos", "conceitos", "respostas", "trilhas", "notas", "clipes", "previsoes", "interacoes", "verificados"];
  const normalizar = (d) => Object.fromEntries(CAMPOS.map((k) => [k, d && d[k] && typeof d[k] === "object" && !Array.isArray(d[k]) ? d[k] : {}]));
  let progresso = normalizar(null);
  try { progresso = normalizar(JSON.parse(localStorage.getItem(CHAVE))); } catch (e) { /* sem armazenamento */ }
  let refDoc = null;
  let fila = Promise.resolve();
  let enviando = 0, tSalvar = 0, esperando = false;
  const hoje = () => new Date().toISOString().slice(0, 10);
  const estadoDe = (cod) => (progresso.modulos[cod] || {}).estado || "";
  const salvarLocal = () => { try { localStorage.setItem(CHAVE, JSON.stringify(progresso)); } catch (e) { /* sem armazenamento */ } };
  const textoSalvo = () => (refDoc ? "Progresso salvo na nuvem" : "Progresso salvo neste navegador");
  function enviar() {
    esperando = false;
    if (!refDoc) return;
    enviando++;
    const corpo = Object.assign({}, progresso, { atualizado: new Date().toISOString() });
    fila = fila.then(() => refDoc.set(corpo)).catch(() => toast("Não deu para salvar na nuvem; ficou neste navegador.", "info-duotone")).then(() => { enviando--; });
  }
  // grava já no navegador e, logo depois, na nuvem (sem gravar a cada tecla)
  function salvar(imediato) {
    salvarLocal();
    clearTimeout(tSalvar);
    if (imediato) enviar();
    else { esperando = true; tSalvar = setTimeout(enviar, 700); }
    document.querySelectorAll(".salvo").forEach((el) => { el.textContent = textoSalvo(); el.classList.remove("pisca"); void el.offsetWidth; el.classList.add("pisca"); });
  }
  function marcar(cod, estado) {
    if (estado) progresso.modulos[cod] = { estado, em: hoje() };
    else delete progresso.modulos[cod];
    salvar(true);
    desenharHud();
  }
  // junta o que está na nuvem com o que está neste navegador; em conflito, vale a nuvem
  const mesclar = (local, nuvem) => Object.fromEntries(CAMPOS.map((k) => [k, Object.assign({}, local[k], nuvem[k])]));
  if (window.claude && typeof window.claude.use === "function") {
    window.claude.use("db").then((db) => {
      if (!db) return;
      refDoc = db.doc("progresso/geral");
      document.querySelectorAll(".salvo").forEach((el) => { el.textContent = textoSalvo(); });
      refDoc.onSnapshot((snap) => {
        if (enviando || esperando) return;
        if (!snap.exists) { enviar(); return; }
        const nuvem = normalizar(snap.data());
        const junto = mesclar(progresso, nuvem);
        const mudouAqui = JSON.stringify(junto) !== JSON.stringify(progresso);
        progresso = junto;
        salvarLocal();
        if (JSON.stringify(junto) !== JSON.stringify(nuvem)) enviar();
        if (!mudouAqui) return;
        const digitando = document.activeElement && /INPUT|TEXTAREA/.test(document.activeElement.tagName);
        if (!digitando && rota().v !== "estudo") render(); else desenharHud();
      }, () => {});
    }).catch(() => {});
  }

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
    const h = decodeURIComponent(location.hash.replace("#", "")) || "inicio";
    const [v, a, b] = h.split("-");
    if (v === "estudo" && MODULO[a]) return { v: "estudo", cod: a, sigla: MODULO[a].materia.sigla };
    if (v === "trilha" && POR_SIGLA[a] && MODULO[b]) return { v: "estudo", cod: b, sigla: a };
    if ((v === "trilha" || v === "guia") && POR_SIGLA[a]) return { v: "materia", aba: v === "trilha" ? "jornada" : "guia", sigla: a };
    if (v === "trilha" || v === "guia") return { v: "materia", aba: v === "trilha" ? "jornada" : "guia", sigla: materiaAtual().sigla };
    if (v === "fontes" && POR_SIGLA[a]) return { v: "materia", aba: "fontes", sigla: a };
    if (v === "fontes") return { v: "fontes" };
    if (v === "mapa") return { v: "mapa" };
    return { v: "inicio" };
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
    document.body.classList.toggle("no-inicio", r.v === "inicio");
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

  // ---------- MAPA: diagrama de linhas, como um mapa de metrô ----------
  const colunasMetro = () => (innerWidth >= 1000 ? 4 : innerWidth >= 640 ? 3 : 2);
  let observador = null;
  const observadores = [];
  function logosMini(lista) {
    return (lista || []).filter((n) => window.LOGOS && window.LOGOS[n]).slice(0, 4).map((n) => `<img src="${window.LOGOS[n].uri}" alt="${esc(window.LOGOS[n].nome)}" title="${esc(window.LOGOS[n].nome)}" width="18" height="18">`).join("");
  }
  // polilinha com cantos arredondados
  function arredondar(pts, r) {
    let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const a = pts[i - 1], b = pts[i], c = pts[i + 1];
      const l1 = Math.hypot(b.x - a.x, b.y - a.y), l2 = Math.hypot(c.x - b.x, c.y - b.y);
      const rr = Math.min(r, l1 / 2, l2 / 2);
      const p1 = { x: b.x + ((a.x - b.x) / l1) * rr, y: b.y + ((a.y - b.y) / l1) * rr };
      const p2 = { x: b.x + ((c.x - b.x) / l2) * rr, y: b.y + ((c.y - b.y) / l2) * rr };
      d += ` L${p1.x.toFixed(1)},${p1.y.toFixed(1)} Q${b.x.toFixed(1)},${b.y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
    }
    const u = pts[pts.length - 1];
    return d + ` L${u.x.toFixed(1)},${u.y.toFixed(1)}`;
  }
  function desenharLinhas(raiz) {
    const svg = raiz.querySelector(".metro-linhas");
    const colunas = colunasMetro();
    let primeira = true;
    const desenhar = () => {
      const cx = raiz.getBoundingClientRect();
      if (!cx.width) return;
      if (colunasMetro() !== colunas && rota().v === "mapa") { render(); return; }
      const marc = [...raiz.querySelectorAll(".estacao .marcador")].map((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2 - cx.left, y: r.top + r.height / 2 - cx.top };
      });
      svg.setAttribute("viewBox", `0 0 ${cx.width} ${cx.height}`);
      let html = "";
      for (let i = 1; i < marc.length; i++) {
        const a = marc[i - 1], b = marc[i];
        const x = Math.floor((i - 1) / colunas) % 2 === 0 ? cx.width - 12 : 12;
        const pts = Math.abs(a.y - b.y) < 2 ? [a, b] : [a, { x, y: a.y }, { x, y: b.y }, b];
        const origem = MATERIAS[i - 1];
        const feito = dominados(origem) === origem.modulos.length;
        html += `<path class="trecho${feito ? " feito" : ""}" data-w="${MUNDO_DE[MATERIAS[i].sigla]}" style="--cv:var(--mv-${MATERIAS[i].sigla})" d="${arredondar(pts, 34)}"/>`;
      }
      svg.innerHTML = html;
      if (primeira && !semMovimento() && svg.animate) {
        svg.querySelectorAll(".trecho.feito").forEach((p, k) => {
          const L = p.getTotalLength();
          p.style.strokeDasharray = L;
          p.animate([{ strokeDashoffset: L }, { strokeDashoffset: 0 }], { duration: 650, delay: 150 + k * 90, easing: "cubic-bezier(.4,0,.2,1)", fill: "backwards" });
        });
      }
      primeira = false;
    };
    let pedido = 0;
    if (observador) observador.disconnect();
    if ("ResizeObserver" in window) { observador = new ResizeObserver(() => { cancelAnimationFrame(pedido); pedido = requestAnimationFrame(desenhar); }); observador.observe(raiz); }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => requestAnimationFrame(desenhar));
    desenhar();
  }

  function vistaMapa() {
    const aqui = materiaAtual();
    const prox = proximoModulo(aqui);
    const xp = xpTotal(), nv = nivelDe(xp), of = ofensiva();
    const total = MATERIAS.reduce((a, m) => a + dominados(m), 0);
    const cols = colunasMetro();
    const g = guia();
    const estacoes = MATERIAS.map((m, i) => {
      const s = m.sigla, d = dominados(m), n = m.modulos.length;
      const est = d === n ? "feita" : m === aqui ? "atual" : d > 0 ? "iniciada" : "futura";
      const linha = Math.floor(i / cols), pos = i % cols;
      const col = linha % 2 === 0 ? pos : cols - 1 - pos;
      const situacao = { feita: "concluída", atual: "em curso", iniciada: "iniciada", futura: "a estudar" }[est];
      return `<li class="estacao ${est}" data-s="${s}" data-w="${MUNDO_DE[s]}" style="${coresDe(s)};grid-row:${linha + 1};grid-column:${col + 1}">
        <a class="est-link" href="#trilha-${s}" aria-label="${doisDig(i + 1)}. ${esc(m.nome)}: ${d} de ${n} módulos, ${situacao}">
          ${est === "atual" ? `<span class="aqui-tag">Você está aqui</span>` : ""}
          <span class="marcador" aria-hidden="true">${est === "feita" ? ic("check-bold") : ""}</span>
          <span class="est-cod">${doisDig(i + 1)} · ${s}</span>
          <span class="est-nome">${esc(m.nome)}</span>
          <span class="est-meta">${d}/${n} módulos</span>
          <span class="est-barra" aria-hidden="true"><i style="width:${(d / n) * 100}%"></i></span>
        </a>
      </li>`;
    }).join("");
    const linhas = MUNDOS.map((w, wi) => {
      const ms = w.siglas.map((s) => POR_SIGLA[s]);
      const dd = ms.reduce((a, mm) => a + dominados(mm), 0), nn = ms.reduce((a, mm) => a + mm.modulos.length, 0);
      return `<button type="button" class="linha-chip" data-linha="${wi}" aria-pressed="false" style="--cv:var(--mv-${w.siglas[0]})"><i aria-hidden="true"></i><span><b>${esc(w.nome)}</b><small>${dd}/${nn} módulos</small></span></button>`;
    }).join("");
    const revisaoHoje = () => { try { const c = JSON.parse(localStorage.getItem("dominio:revisao:v1") || "{}"); const d = new Date(), h = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; return Object.values(c).filter((x) => x.proxima <= h).length; } catch (e) { return 0; } };
    const nRevisao = revisaoHoje();
    const casteloFeito = () => { try { const v = JSON.parse(localStorage.getItem("dominio:castelo:v1") || "null"); return v && v.feitas ? ` · ${v.feitas} de 17 módulos` : ""; } catch (e) { return ""; } };
    const inicioFeito = () => { try { const v = JSON.parse(localStorage.getItem("dominio:licao:INICIO") || "null"); return !!v && Object.keys(v).length > 0; } catch (e) { return false; } };
    const fala = total ? `Você domina ${total} de ${TOTAL} módulos. A próxima estação é ${prox.nome}.` : `Vamos começar por ${prox.nome}. São cinco passos curtos.`;
    centro().innerHTML = `
      <section class="mapa-cab">
        <div class="mapa-cab-txt">
          <p class="eyebrow">Mapa de formação · Ciência de Dados</p>
          <h1>Do raciocínio lógico ao aprendizado de máquina</h1>
          <p class="mapa-sub">${MATERIAS.length} matérias e ${TOTAL} módulos, em sequência. Cada estação só pede o que as anteriores ensinaram.</p>
          <div class="mapa-acoes"><a class="btn btn-3d btn-grande" href="#estudo-${prox.codigo}" style="${coresDe(aqui.sigla)}" data-principal>${ic("play-bold")}<span>Continuar: ${esc(prox.nome)}<small>${esc(aqui.nome)} · módulo ${MODULO[prox.codigo].indice + 1} de ${aqui.modulos.length}</small></span></a></div>
          <a class="cartao-link cartao-inicio" href="licoes/INICIO.html" style="--cor:var(--azul-cor);--cv:var(--azul-cv)"><span class="ic-a">${ic("sparkle-duotone")}</span><span><b>Comece por aqui: a lista de aprovados${inicioFeito() ? " · concluída" : ""}</b><small>5 passos curtos com animações · dados de um concurso fictício</small></span>${ic("arrow-right-bold")}</a>
          <a class="cartao-link cartao-inicio" href="castelo/index.html" style="--cor:var(--azul-cor);--cv:var(--azul-cv)"><span class="ic-a">${ic("database-duotone")}</span><span><b>Laboratório: Centro de Dados${casteloFeito()}</b><small>monte um banco PostgreSQL de verdade, módulo por módulo, vendo cada passo acontecer</small></span>${ic("arrow-right-bold")}</a>
          <a class="cartao-link cartao-inicio" href="licoes/LOGICA-SIMPLES.html" style="--cor:var(--azul-cor);--cv:var(--azul-cv)"><span class="ic-a">${ic("list-numbers-duotone")}</span><span><b>Revisão de conceitos simples</b><small>escolher na lista, digitar valores e contar linhas, sem escrever código</small></span>${ic("arrow-right-bold")}</a>
          ${nRevisao ? `<a class="cartao-link cartao-inicio" href="licoes/REVISAR.html" style="--cor:var(--azul-cor);--cv:var(--azul-cv)"><span class="ic-a">${ic("brain-duotone")}</span><span><b>Revisão de hoje: ${nRevisao} ${nRevisao === 1 ? "item" : "itens"}</b><small>o que você errou volta em 1, 3, 7, 14 e 30 dias</small></span>${ic("arrow-right-bold")}</a>` : ""}
        </div>
        <figure class="mentor" style="${coresDe(aqui.sigla)}">
          <div class="mascote retrato">${g.expr[total ? "feliz" : "padrao"]}</div>
          <figcaption><b>${esc(g.nome)}</b><span>${esc(g.funcao)}</span><p>${esc(fala)}</p></figcaption>
        </figure>
        <dl class="metricas">
          <div><dt>Módulos dominados</dt><dd>${total}<small> / ${TOTAL}</small></dd><dd class="m-extra"><span class="barra-fina"><i style="width:${(total / TOTAL) * 100}%"></i></span></dd></div>
          <div><dt>Nível</dt><dd>${nv.n}<small> · ${xp} XP</small></dd><dd class="m-extra"><span class="barra-fina"><i style="width:${nv.resto}%"></i></span></dd></div>
          <div><dt>Ofensiva</dt><dd>${of}<small> ${of === 1 ? "dia" : "dias"}</small></dd><dd class="m-extra"><span class="nota">${of ? "estudando em dias seguidos" : "domine um módulo hoje"}</span></dd></div>
        </dl>
      </section>
      <section class="metro-bloco" aria-label="Diagrama das matérias">
        <div class="legenda-linhas" role="group" aria-label="Destacar uma linha">${linhas}</div>
        <p class="metro-dica" id="metro-dica" aria-live="polite">Passe o mouse numa estação para ver o que ela usa e o que ela prepara.</p>
        <div class="metro" id="metro" data-cols="${cols}">
          <svg class="metro-linhas" aria-hidden="true"></svg>
          <ol class="estacoes" style="--cols:${cols}">${estacoes}</ol>
        </div>
      </section>`;
    const metro = document.getElementById("metro");
    desenharLinhas(metro);
    const dica = document.getElementById("metro-dica");
    const padrao = dica.textContent;
    const lis = [...metro.querySelectorAll(".estacao")];
    const limpar = () => { metro.classList.remove("relacionando"); lis.forEach((l) => l.classList.remove("rel-pre", "rel-dep", "rel-este")); dica.textContent = padrao; };
    const relacionar = (li) => {
      const m = POR_SIGLA[li.dataset.s];
      const dep = dependencias(m);
      metro.classList.add("relacionando");
      lis.forEach((l) => {
        l.classList.toggle("rel-este", l === li);
        l.classList.toggle("rel-pre", dep.precisa.includes(l.dataset.s));
        l.classList.toggle("rel-dep", dep.prepara.includes(l.dataset.s));
      });
      const nomes = (a) => a.map((s) => POR_SIGLA[s].nome).join(", ");
      dica.textContent = `${m.nome}${m.etapa ? ` (no trabalho: ${m.etapa.toLowerCase()})` : ""}: ${dep.precisa.length ? "usa " + nomes(dep.precisa) : "não usa nenhuma matéria anterior"}. ${dep.prepara.length ? "Prepara " + nomes(dep.prepara) + "." : "Fecha o percurso."}`;
    };
    lis.forEach((li) => {
      li.addEventListener("mouseenter", () => relacionar(li));
      li.addEventListener("mouseleave", limpar);
      li.querySelector("a").addEventListener("focus", () => relacionar(li));
      li.querySelector("a").addEventListener("blur", limpar);
    });
    let linhaAtiva = null;
    document.querySelectorAll(".linha-chip").forEach((b) => b.addEventListener("click", () => {
      linhaAtiva = linhaAtiva === b.dataset.linha ? null : b.dataset.linha;
      document.querySelectorAll(".linha-chip").forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.linha === linhaAtiva)));
      metro.classList.toggle("com-linha", linhaAtiva !== null);
      lis.forEach((l) => l.classList.toggle("da-linha", l.dataset.w === linhaAtiva));
      metro.querySelectorAll(".trecho").forEach((p) => p.classList.toggle("da-linha", p.dataset.w === linhaAtiva));
    }));
    teclas = (e) => { if (e.key === "Enter" && e.target === document.body) document.querySelector("[data-principal]").click(); };
  }

  // ---------- INÍCIO: uma tela, sem rolagem, uma ação principal ----------
  // Primeira visita: o guia apresenta o programa e o botão abre o tutorial. Dia a dia: Continuar de onde parou,
  // e três atalhos (mapa, laboratório, revisão). O mapa fica em #mapa.
  function lerLocal(chave, padrao) { try { const v = JSON.parse(localStorage.getItem(chave) || "null"); return v == null ? padrao : v; } catch (e) { return padrao; } }
  // no Início, um lembrete discreto: só aparece quando há progresso que ainda não foi para um arquivo há 7 dias
  function lembreteTrajeto(primeira) {
    const T = window.Trajeto;
    if (!T || primeira) return "";
    const ultimo = T.ultimoSalvo();
    const dias = ultimo ? (Date.now() - new Date(ultimo).getTime()) / 864e5 : Infinity;
    if (dias < 7) return "";
    return `<p class="ini-trajeto">${ic("download-duotone")}<span>${ultimo ? `Último arquivo do trajeto em ${dataBR(ultimo)}.` : "Seu trajeto está só neste aparelho."}</span><button type="button" class="ini-trajeto-btn" data-ini-trajeto>Salvar arquivo</button></p>`;
  }
  function vistaInicio() {
    const g = guia();
    const aqui = materiaAtual(), prox = proximoModulo(aqui);
    const total = MATERIAS.reduce((a, m) => a + dominados(m), 0);
    const tut = lerTut();
    const primeira = total === 0 && !Object.keys(progresso.passos).length && !tut.feito && !tut.visto;
    const d = new Date();
    const hojeLocal = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const nRev = Object.values(lerLocal("dominio:revisao:v1", {})).filter((x) => x && x.proxima <= hojeLocal).length;
    const lab = lerLocal("dominio:castelo:v1", null);
    const labFeitas = lab && lab.feitas ? lab.feitas : 0;
    const pct = Math.round((total / TOTAL) * 100);
    const passo = estadoDe(prox.codigo) === "dominado" ? 0 : Math.min(4, progresso.passos[prox.codigo] || 0);
    const saudacao = d.getHours() < 12 ? "Bom dia" : d.getHours() < 18 ? "Boa tarde" : "Boa noite";
    const plural = (n, um, varios) => `${n} ${n === 1 ? um : varios}`;
    const fala = primeira
      ? `Oi, eu sou ${g.nome}. Vou guiar você do zero até analisar dados de verdade: ${MATERIAS.length} matérias em ordem, lições curtas com exercício corrigido na hora e um laboratório onde você monta um banco de dados.`
      : `${saudacao}! ${passo ? `Você parou no passo ${passo + 1} de 5 de ${prox.nome}.` : `O próximo módulo é ${prox.nome}.`} ${nRev ? `Depois, ${plural(nRev, "revisão te espera", "revisões te esperam")}.` : total ? `Você já domina ${plural(total, "módulo", "módulos")}.` : "São cinco passos curtos."}`;
    const acao = primeira
      ? `<div class="ini-acao"><p class="ini-meta">Começo</p><h1 class="ini-titulo">Conheça o Domínio em um minuto</h1>
          <ol class="ini-pilares"><li>O mapa com as ${MATERIAS.length} matérias, na ordem em que uma prepara a outra</li><li>Lições de 5 minutos, com exercício corrigido na hora</li><li>O laboratório: um banco de dados que você constrói e apresenta</li></ol>
          <button type="button" class="btn btn-3d b-prog ini-botao" data-ini-tutorial style="--p:0" data-passo="7 paradas">Começar o tutorial</button>
          <a class="ini-pular" href="licoes/INICIO.html" data-pular-tutorial>Pular e ir direto para a primeira lição</a></div>`
      : `<div class="ini-acao"><p class="ini-meta">${esc(aqui.nome)} · módulo ${MODULO[prox.codigo].indice + 1} de ${aqui.modulos.length}</p><h1 class="ini-titulo">${esc(prox.nome)}</h1>
          <a class="btn btn-3d b-prog ini-botao" href="#estudo-${prox.codigo}" style="--p:${passo / 5}" data-passo="passo ${passo + 1} de 5">${passo ? "Continuar" : "Começar"}</a></div>`;
    const atalho = (href, icone, titulo, sub, num) => `<a class="ini-atalho" href="${href}"><span class="ini-ic">${ic(icone)}</span><b>${titulo}</b><small>${sub}</small><span class="ini-num">${num}</span></a>`;
    const terceiro = primeira
      ? atalho("licoes/INICIO.html", "sparkle-duotone", "Comece por aqui", "a lista de aprovados", "5 passos")
      : atalho("licoes/REVISAR.html", "brain-duotone", "Revisão de hoje", "o que você errou", nRev ? plural(nRev, "item", "itens") : "nada hoje");
    centro().innerHTML = `<div class="inicio${primeira ? " primeira" : ""}" style="${coresDe(aqui.sigla)}">
      <div class="ini-guia">${mascote(primeira ? "explica" : "padrao", "ini-rosto", "chegar falar")}<p class="balao cor ini-fala"><small>${esc(g.nome)}</small>${esc(fala)}</p></div>
      <div class="ini-lado">${acao}
        <nav class="ini-atalhos" aria-label="Atalhos">
          ${atalho("#mapa", "map-trifold-duotone", "Mapa de formação", `${MATERIAS.length} matérias`, `${pct}%`)}
          ${atalho("castelo/index.html", "database-duotone", "Centro de Dados", "laboratório", labFeitas ? `${labFeitas} de 17` : "17 módulos")}
          ${terceiro}
        </nav>
        ${lembreteTrajeto(primeira || !(total || Object.keys(progresso.passos).length))}
      </div>
    </div>`;
    const btT = document.querySelector("[data-ini-trajeto]");
    if (btT) btT.addEventListener("click", () => acaoTrajeto("salvar"));
    const bt = document.querySelector("[data-ini-tutorial]");
    if (bt) bt.addEventListener("click", () => abrirTutorial(0));
    // quem pula o tutorial não o recebe de novo ao abrir o mapa (fica no botão Tutorial do topo)
    const pl = document.querySelector("[data-pular-tutorial]");
    if (pl) pl.addEventListener("click", () => gravarTut(Object.assign(lerTut(), { visto: true })));
    teclas = null;
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
    const gd = guia();
    const abas = [["jornada", "trilha", "Módulos", "path-duotone"], ["guia", "guia", "Como funciona", "lightbulb-duotone"], ["fontes", "fontes", "Fontes", "books-duotone"]];
    centro().innerHTML = `
      <section class="mat-cab tema-exp" style="${coresExp()}">
        <a class="voltar" href="#mapa">${ic("arrow-left-bold")}Mapa de formação</a>
        <div class="mat-linha">
          <span class="mat-icone" aria-hidden="true">${ic(EMBLEMA[sigla])}</span>
          <div class="mat-titulo">
            <p class="eyebrow">Linha ${MUNDO_DE[sigla] + 1} · estação ${i + 1} de ${MATERIAS.length}</p>
            <h1>${esc(m.nome)}</h1>
            <div class="mat-meta"><span class="barra-fina"><i style="width:${(d / n) * 100}%"></i></span><span><b>${d}/${n}</b> módulos</span><span><b>${xpM}</b> XP</span>${m.logos.length ? `<span class="logos-mini">${logosMini(m.logos)}</span>` : ""}</div>
          </div>
          <div class="mat-cta"><a class="btn btn-3d btn-grande" href="#estudo-${prox.codigo}" data-principal>${ic("play-bold")}<span>${d === n ? "Revisar" : d ? "Continuar" : "Começar"}: ${esc(prox.nome)}<small>módulo ${MODULO[prox.codigo].indice + 1} de ${n} · +${xpDe(prox.codigo)} XP</small></span></a></div>
        </div>
        ${g.frase ? `<figure class="resumo"><div class="mascote retrato">${gd.expr.explica}</div><p class="glossavel">${esc(g.frase)}</p></figure>` : ""}
        ${m.trabalho ? `<div class="alvo no-trabalho"><span class="ic-a">${ic("graduation-cap-duotone")}</span><div><small>No trabalho do cientista de dados · ${esc(m.etapa)}</small><p class="glossavel">${esc(m.trabalho)}</p></div></div>` : ""}
      </section>
      <nav class="abas tema-exp" aria-label="Partes da matéria" style="${coresExp()}">
        ${abas.map(([id, rotaAba, nome, icone]) => `<a class="aba" href="#${rotaAba}-${sigla}"${id === aba ? ' aria-current="page"' : ""}>${ic(icone)}${nome}${id === "guia" ? `<small class="aba-n">${concluidas(sigla).length}/${secoesDe(m).length}</small>` : ""}</a>`).join("")}
      </nav>
      <div id="aba" class="tema-exp" style="${coresExp()}"></div>`;
    if (aba === "jornada") abaJornada(m);
    else if (aba === "guia") abaGuia(m);
    else abaFontes(m);
    glossar(document.querySelector(".resumo"), sigla, 2);
    teclas = (e) => {
      if (e.key === "Enter" && e.target === document.body) document.querySelector("[data-principal]").click();
    };
  }

  // módulos: linha do tempo vertical; um módulo aberto por vez
  function htmlModulo(cod) {
    const { mod, materia: m } = MODULO[cod];
    const est = estadoDe(cod);
    return `<div class="mod-detalhe">
      <div class="mod-col">
        <h4>Para que serve</h4><p class="glossavel">${esc(mod.dia)}</p>
        <h4>Ao final, você consegue</h4><p class="glossavel">${esc(mod.dominio)}.</p>
      </div>
      <div class="mod-col">
        <h4>Conceitos, em ordem</h4>
        <ol class="conceitos-ol">${mod.conceitos.map((c) => `<li>${esc(c)}</li>`).join("")}</ol>
        <h4>Antes deste</h4>
        ${mod.antes.length ? `<ul class="lista-antes">${mod.antes.map((a) => `<li class="${estadoDe(a.codigo) === "dominado" ? "ok" : ""}">${ic(estadoDe(a.codigo) === "dominado" ? "check-circle-duotone" : "question-duotone")}<a href="#estudo-${a.codigo}">${esc(a.nome)}</a>${a.materia !== m.sigla ? `<small>${esc(POR_SIGLA[a.materia].nome)}</small>` : ""}</li>`).join("")}</ul>` : "<p>Nada: dá para começar direto.</p>"}
      </div>
    </div>
    <div class="mod-pe"><span class="chip ouro">${ic("lightning-duotone")}+${xpDe(cod)} XP${mod.virada ? " · ponto de virada" : ""}</span><a class="btn btn-3d" href="#estudo-${cod}">${ic("play-bold")}${est === "dominado" ? "Revisar a lição" : progresso.passos[cod] ? `Continuar do passo ${progresso.passos[cod] + 1}` : "Começar a lição"}</a></div>`;
  }
  function abaJornada(m) {
    const prox = proximoModulo(m);
    const dep = dependencias(m);
    const ant = MATERIAS[MATERIAS.indexOf(m) - 1], seg = MATERIAS[MATERIAS.indexOf(m) + 1];
    const itens = m.modulos.map((mod, k) => {
      const est = estadoDe(mod.codigo);
      const classe = est === "dominado" ? "dominado" : est === "rever" ? "rever" : mod === prox ? "proximo" : "nova";
      const rotulo = est === "dominado" ? "Dominado" : est === "rever" ? "Rever" : mod === prox ? "Próximo" : "";
      return `<li class="mod ${classe}${mod.virada ? " virada" : ""}" data-cod="${mod.codigo}">
        <button type="button" class="mod-cab" aria-expanded="false" aria-controls="mod-${mod.codigo}">
          <span class="mod-marca" aria-hidden="true">${est === "dominado" ? ic("check-bold") : mod.virada ? ic("lightning-duotone") : ""}</span>
          <span class="mod-num">${doisDig(k + 1)}</span>
          <span class="mod-nome"><b>${esc(mod.nome)}</b><small>${mod.conceitos.length} conceitos${mod.virada ? " · ponto de virada" : ""}${est !== "dominado" && progresso.passos[mod.codigo] ? ` · parou no passo ${progresso.passos[mod.codigo] + 1} de 5` : ""}</small></span>
          <span class="mod-estado">${rotulo}</span>
          ${ic("caret-down-bold", "ic seta")}
        </button>
        <div class="mod-corpo-wrap"><div class="mod-corpo" id="mod-${mod.codigo}" role="region" aria-label="Módulo ${k + 1}: ${esc(mod.nome)}"></div></div>
      </li>`;
    }).join("");
    document.getElementById("aba").innerHTML = `
      <div class="jornada">
        <ol class="modulos-lista" id="modulos-lista">${itens}</ol>
        <aside class="jornada-lado">
          <div class="painel"><h3>${ic("path-duotone")}Usa o que veio de</h3><ul>${dep.precisa.map((s) => seloMat(s)).join("") || "<li>Nada: é um começo.</li>"}</ul></div>
          <div class="painel"><h3>${ic("rocket-launch-duotone")}Prepara para</h3><ul>${dep.prepara.map((s) => seloMat(s)).join("") || "<li>O fim do percurso.</li>"}</ul></div>
          <div class="painel"><h3>${ic("compass-duotone")}Estações vizinhas</h3><ul>${ant ? seloMat(ant.sigla) : ""}${seg ? seloMat(seg.sigla) : ""}</ul></div>
        </aside>
      </div>`;
    const lista = document.getElementById("modulos-lista");
    const alternar = (li, abrir) => {
      const aberto = abrir !== undefined ? abrir : !li.classList.contains("aberto");
      lista.querySelectorAll(".mod.aberto").forEach((o) => { if (o !== li) { o.classList.remove("aberto"); o.querySelector(".mod-cab").setAttribute("aria-expanded", "false"); } });
      li.classList.toggle("aberto", aberto);
      li.querySelector(".mod-cab").setAttribute("aria-expanded", String(aberto));
      const corpo = li.querySelector(".mod-corpo");
      if (aberto && !corpo.firstChild) { corpo.innerHTML = htmlModulo(li.dataset.cod); glossar(corpo, m.sigla, 3); }
    };
    lista.addEventListener("click", (e) => { const b = e.target.closest(".mod-cab"); if (b) alternar(b.closest(".mod")); });
    const inicial = lista.querySelector(`.mod[data-cod="${prox.codigo}"]`);
    if (inicial) alternar(inicial, true);
    teclas = (e) => {
      if (e.key === "Escape") { const o = lista.querySelector(".mod.aberto"); if (o) { alternar(o, false); o.querySelector(".mod-cab").focus(); } }
      if (e.key === "Enter" && e.target === document.body) document.querySelector("[data-principal]").click();
    };
  }

  // ---------- como funciona: a trilha de explicação ----------
  // Cada subtópico tem uma tarefa curta. Ao concluir, ele fica marcado (salvo na nuvem) e o próximo abre.
  const normal = (t) => String(t).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/["'`\s]/g, "");
  function revelado(marca, saida, palpite) {
    const nucleo = normal(saida).split(/[:,(]/)[0];
    const bateu = palpite && normal(palpite).length > 0 && (normal(saida).includes(normal(palpite)) || (nucleo.length > 0 && normal(palpite).includes(nucleo)));
    return `<span class="saida">${esc(marca)} ${esc(saida)}</span>${palpite ? `<span class="palpite${bateu ? " ok" : ""}">${bateu ? "acertou: " : "seu palpite: "}${esc(palpite)}</span>` : ""}`;
  }
  // mostra o código e esconde cada saída (o comentário que diz o que aparece na tela) atrás de um "prever"
  function codigoInterativo(texto, lang, base) {
    const linhas = texto.split("\n");
    const hl = (t) => { try { return window.hljs && window.hljs.getLanguage(lang) ? window.hljs.highlight(t, { language: lang }).value : esc(t); } catch (e) { return esc(t); } };
    const aspasPares = (t) => (t.match(/"/g) || []).length % 2 === 0 && (t.match(/'/g) || []).length % 2 === 0;
    let n = 0;
    const slot = (marca, saida) => {
      const k = n++;
      const salvo = progresso.previsoes[`${base}:${k}`];
      return `<span class="prever${salvo ? " revelado" : ""}" data-k="${k}" data-marca="${esc(marca)}" data-saida="${esc(saida)}">${salvo ? revelado(marca, saida, salvo.palpite) : `<button type="button" class="prever-btn">${ic("question-duotone")}prever a saída</button>`}</span>`;
    };
    const html = linhas.map((l, i) => {
      const so = l.match(/^\s*(#|--)\s+(.+)$/);
      if (so) {
        const ant = linhas[i - 1] || "";
        return /print\(|git log|;\s*$/.test(ant) && !/\s(#|--)\s/.test(ant) ? slot(so[1], so[2]) : hl(l);
      }
      const inl = l.match(/^(.*?\S)(\s+)(#|--)\s+(.+)$/);
      if (inl && aspasPares(inl[1])) return `${hl(inl[1])}${inl[2]}${slot(inl[3], inl[4])}`;
      return hl(l);
    }).join("\n");
    return { html, total: n };
  }

  function secoesDe(m) {
    const s = m.sigla, g = GUIA[s];
    const lang = g.lang || "python";
    const lista = [];
    const nota = (id, rotulo, linhas = 3) => `<label class="nota-campo"><span>${rotulo}</span><textarea rows="${linhas}" data-nota="${id}">${esc(progresso.notas[`${s}:${id}`] || "")}</textarea></label>`;
    const ligarNota = (el, id, minimo, liberar) => {
      const t = el.querySelector(`[data-nota="${id}"]`);
      const checar = () => { if (t.value.trim().length >= minimo) liberar(); };
      t.addEventListener("input", () => { progresso.notas[`${s}:${id}`] = t.value; salvar(); checar(); });
      checar();
    };
    const itemIdeia = (window.VERIFICA_MATERIAS || {})[s];
    lista.push({
      id: "ideia", icone: "lightbulb-duotone", titulo: "A ideia", dica: "o essencial, em poucas linhas",
      tarefa: itemIdeia && window.Motor ? "Acerte a pergunta para concluir. Escrever com suas palavras é opcional." : "Explique com suas palavras para concluir.",
      pronto: () => itemIdeia && window.Motor ? !!progresso.verificados[`${s}:ideia`] || (progresso.notas[`${s}:ideia`] || "").trim().length >= 10 : (progresso.notas[`${s}:ideia`] || "").trim().length >= 10,
      html: () => `<p class="frase-destaque">${esc(g.frase)}</p><div class="prosa-jogo glossavel">${g.texto.map((p) => `<p>${p}</p>`).join("")}</div>${itemIdeia && window.Motor ? `<div class="verifica-ideia">${window.Motor.criar(itemIdeia)}</div>${nota("ideia", "Com suas palavras (opcional): explique a ideia em uma ou duas frases, como se contasse a um amigo.", 2)}` : nota("ideia", "Agora com suas palavras: explique a ideia em uma ou duas frases, como se contasse a um amigo.")}`,
      montar: (el, liberar) => {
        if (!(itemIdeia && window.Motor)) { ligarNota(el, "ideia", 10, liberar); return; }
        const ex = el.querySelector(".verifica-ideia .exercicio");
        window.Motor.montarExercicio(ex, { licao: s, titulo: m.nome, conceito: "A ideia", resumo: g.frase, aoResolver: (e, r) => { progresso.verificados[`${s}:ideia`] = { r, em: hoje() }; salvar(); liberar(); } });
        if (window.Reacao) window.Reacao.observar(ex);
        const t = el.querySelector('[data-nota="ideia"]');
        t.addEventListener("input", () => { progresso.notas[`${s}:ideia`] = t.value; salvar(); });
      },
    });
    lista.push({
      id: "desenho", icone: "image-duotone", titulo: "Veja o desenho", dica: g.figuras.length > 1 ? `${g.figuras.length} ilustrações; toque para ampliar` : "a ilustração; toque para ampliar",
      tarefa: "Olhe a ilustração com calma e conclua.", pronto: () => true,
      html: () => g.figuras.map(([chave, legenda]) => figura(chave, legenda)).join(""),
    });
    const clipes = (window.CLIPES && window.CLIPES[s]) || [];
    if (clipes.length) {
      const vistosTodos = () => clipes.every((c, k) => progresso.clipes[`${s}:${k}`]);
      lista.push({
        id: "assista", icone: "film-strip-duotone", titulo: "Assista", dica: clipes.length > 1 ? `${clipes.length} clipes curtos, com legenda` : `clipe de ${Math.round(clipes[0].fim)} segundos, com legenda`,
        tarefa: clipes.length > 1 ? "Assista aos clipes até o fim para concluir." : "Assista ao clipe até o fim para concluir.",
        pronto: vistosTodos,
        html: () => `<div class="clipes">${clipes.map((c, k) => `<div class="clipe-bloco"><span class="clipe-status${progresso.clipes[`${s}:${k}`] ? " visto" : ""}" data-status="${k}">${progresso.clipes[`${s}:${k}`] ? `${ic("check-circle-duotone")}assistido` : `clipe ${k + 1} de ${clipes.length}`}</span><div class="clipe" data-clipe="${k}"></div></div>`).join("")}</div><p class="mini-legenda">Use a barra para voltar e avançar, e o botão 1x para deixar mais devagar.</p>`,
        montar: (el, liberar) => el.querySelectorAll("[data-clipe]").forEach((c) => {
          const k = Number(c.dataset.clipe);
          window.CLIPE_PLAYER(c, clipes[k], { aoTerminar: () => {
            if (!progresso.clipes[`${s}:${k}`]) { progresso.clipes[`${s}:${k}`] = hoje(); salvar(true); }
            const st = el.querySelector(`[data-status="${k}"]`);
            st.classList.add("visto"); st.innerHTML = `${ic("check-circle-duotone")}assistido`;
            if (vistosTodos()) liberar();
          } });
        }),
      });
    }
    const exp = window.EXPERIMENTE && window.EXPERIMENTE[s];
    if (exp) {
      // caixa em Python: conclui com as metas cumpridas; as outras, com tentativas diferentes
      const META = 3, py = !!exp.python, unidade = py ? "metas" : "tentativas";
      const contagem = () => `${Math.min(META, progresso.interacoes[s] || 0)} de ${META} ${unidade}`;
      lista.push({
        id: "experimente", icone: "cursor-click-duotone", titulo: "Experimente",
        dica: py ? "escreva o comando e veja o resultado na hora" : "mude os valores e veja o resultado na hora",
        tarefa: py ? `Cumpra as ${META} metas do quadro para concluir.` : `Faça ${META} tentativas diferentes para concluir.`,
        pronto: () => (progresso.interacoes[s] || 0) >= META,
        html: () => `${s === "LOG" ? figura(g.figuras[0][0], "O caminho que acende é o que o algoritmo segue com o valor que você digitou.") : ""}<section class="experimente${py ? " exp-python" : ""}"><header><b>experimente</b><span>${esc(exp.titulo)}</span><span class="tentativas" data-tentativas>${contagem()}</span></header><div class="area-exp"></div></section>`,
        montar: (el, liberar) => {
          const area = el.querySelector(".area-exp");
          const mostrarConta = () => { el.querySelector("[data-tentativas]").textContent = contagem(); if ((progresso.interacoes[s] || 0) >= META) liberar(); };
          if (py) {
            exp.montar(area, el.querySelector("figure"), (n) => {
              if (n > (progresso.interacoes[s] || 0)) { progresso.interacoes[s] = n; salvar(); }
              mostrarConta();
            });
            return;
          }
          exp.montar(area, el.querySelector("figure"));
          let t = 0;
          const contar = () => {
            clearTimeout(t);
            t = setTimeout(() => {
              progresso.interacoes[s] = (progresso.interacoes[s] || 0) + 1;
              salvar();
              mostrarConta();
            }, 650);
          };
          area.addEventListener("input", contar);
          area.addEventListener("click", (e) => { if (e.target.closest("button")) contar(); });
        },
      });
    }
    lista.push({
      id: "dia", icone: "coffee-duotone", titulo: "No dia a dia", dica: "onde você já usa isso sem perceber",
      tarefa: "Se quiser, escreva um exemplo seu; ele fica salvo.", pronto: () => true,
      html: () => `<div class="fala">${mascote("feliz", "", "falar")}<p class="balao cor glossavel">${esc(g.dia)}</p></div>${nota("dia", "Onde você já viu isso no seu dia? Um exemplo seu (opcional).", 2)}`,
      montar: (el, liberar) => ligarNota(el, "dia", 0, liberar),
    });
    const blocos = [g.codigo, g.codigo2].filter(Boolean).map((c, k) => codigoInterativo(c, lang, `${s}:cod${k}`));
    const totalPrev = blocos.reduce((a, b) => a + b.total, 0);
    const previstos = () => blocos.every((b, k) => Array.from({ length: b.total }, (x, j) => progresso.previsoes[`${s}:cod${k}:${j}`]).every(Boolean));
    lista.push({
      id: "codigo", icone: "code-duotone", titulo: "No computador", dica: totalPrev ? `a mesma ideia em código; preveja ${totalPrev === 1 ? "a saída" : `as ${totalPrev} saídas`}` : "a mesma ideia escrita em código",
      tarefa: totalPrev ? "Antes de ver cada saída, escreva o que você acha que aparece." : "Leia o código com calma e conclua.",
      pronto: () => !totalPrev || previstos(),
      html: () => `<div class="duo">${blocos.map((b, k) => `<pre class="codigo-prever" data-bloco="${k}" tabindex="0"><code class="hljs language-${lang}">${b.html}</code></pre>`).join("")}</div>`,
      montar: (el, liberar) => {
        el.addEventListener("click", (e) => {
          const btn = e.target.closest(".prever-btn");
          if (btn) {
            const slot = btn.closest(".prever");
            slot.innerHTML = `<input class="prever-in" aria-label="Seu palpite da saída" placeholder="o que aparece?" autocomplete="off"><button type="button" class="prever-ver">ver</button>`;
            slot.querySelector("input").focus();
            return;
          }
          const ver = e.target.closest(".prever-ver");
          if (ver) revelar(ver.closest(".prever"));
        });
        el.addEventListener("keydown", (e) => { if (e.key === "Enter" && e.target.matches(".prever-in")) { e.preventDefault(); revelar(e.target.closest(".prever")); } });
        function revelar(slot) {
          const bloco = slot.closest("[data-bloco]").dataset.bloco;
          const palpite = slot.querySelector("input").value.trim();
          progresso.previsoes[`${s}:cod${bloco}:${slot.dataset.k}`] = { palpite, em: hoje() };
          salvar();
          slot.classList.add("revelado");
          slot.innerHTML = revelado(slot.dataset.marca, slot.dataset.saida, palpite);
          if (previstos()) liberar();
        }
      },
    });
    lista.push({
      id: "onde", icone: "graduation-cap-duotone", titulo: "Onde isso cai", dica: "faculdade, concursos e trabalho",
      tarefa: "Veja onde isso aparece e conclua a trilha.", pronto: () => true,
      html: () => `<div class="onde-lista">${g.onde.map(([a, b]) => `<div><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join("")}</div>${m.logos.length ? `<div class="logo-lista">${m.logos.filter((l) => window.LOGOS[l]).map((l) => `<span><img src="${window.LOGOS[l].uri}" alt="" width="26" height="26">${esc(window.LOGOS[l].nome)}</span>`).join("")}</div>` : ""}`,
    });
    return lista;
  }
  const concluidas = (s) => progresso.trilhas[s] || [];
  function figura(chave, legenda) {
    return `<figure class="figura-jogo" data-fig="${chave}"><button class="ampliar" type="button">${ic("magnifying-glass-duotone")} Ampliar</button><div class="rolagem" tabindex="0" role="group" aria-label="Figura: role para os lados se não couber">${window.FIG[chave]()}</div><figcaption>${esc(legenda)}</figcaption></figure>`;
  }
  function abaGuia(m) {
    const s = m.sigla;
    const secoes = secoesDe(m);
    const feitas = () => new Set(concluidas(s));
    const primeiraPendente = () => secoes.find((x) => !feitas().has(x.id));
    document.getElementById("aba").innerHTML = `
      <div class="subtopicos">
        <div class="trilha-cab">
          <div><p class="eyebrow">Trilha de explicação</p><b id="trilha-conta"></b></div>
          <span class="barra-fina" aria-hidden="true"><i id="trilha-barra"></i></span>
          <span class="salvo" aria-live="polite">${textoSalvo()}</span>
        </div>
        ${secoes.map((x, k) => `<section class="sub" data-sub="${x.id}">
          <button type="button" class="sub-cab" aria-expanded="false" aria-controls="corpo-${x.id}">
            <span class="medalha">${ic(x.icone)}<em>${k + 1}</em></span>
            <span class="sub-txt"><b>${x.titulo}</b><small>${esc(x.dica)}</small></span>
            <span class="sub-estado"><span class="visto-slot"></span>${ic("caret-down-bold", "ic seta")}</span>
          </button>
          <div class="sub-corpo-wrap"><div class="sub-corpo" id="corpo-${x.id}" role="region" aria-label="${x.titulo}"><div></div></div></div>
        </section>`).join("")}
        <div class="trilha-fim" hidden>${mascote("feliz", "", "concluir")}<div><b>Trilha de ${esc(m.nome)} concluída</b><p>Agora é praticar: cada módulo tem uma lição de cinco passos, e o passo em que você parar fica salvo.</p></div><a class="btn btn-3d" href="#trilha-${s}">${ic("path-duotone")}Ir para os módulos</a></div>
      </div>`;
    const atualizar = () => {
      const f = feitas();
      const n = secoes.filter((x) => f.has(x.id)).length;
      document.getElementById("trilha-conta").textContent = `${n} de ${secoes.length} subtópicos concluídos`;
      document.getElementById("trilha-barra").style.width = `${(n / secoes.length) * 100}%`;
      document.querySelectorAll(".sub").forEach((el) => {
        const ok = f.has(el.dataset.sub);
        el.classList.toggle("feita", ok);
        el.querySelector(".visto-slot").innerHTML = ok ? `${ic("check-circle-duotone", "ic visto")}<span class="visivel-leitor">concluído</span>` : "";
      });
      document.querySelector(".trilha-fim").hidden = n < secoes.length;
    };
    const montados = new Set();
    const abrir = (id, rolar) => {
      document.querySelectorAll(".sub").forEach((el) => {
        const aberto = el.dataset.sub === id && !el.classList.contains("aberto");
        el.classList.toggle("aberto", aberto);
        el.querySelector(".sub-cab").setAttribute("aria-expanded", String(aberto));
        if (!aberto) return;
        if (!montados.has(id)) montar(el, secoes.find((q) => q.id === id));
        if (rolar) setTimeout(() => el.scrollIntoView({ behavior: semMovimento() ? "auto" : "smooth", block: "start" }), semMovimento() ? 0 : 140);
      });
    };
    function montar(el, x) {
      const alvo = el.querySelector(".sub-corpo > div");
      const feita = feitas().has(x.id);
      alvo.innerHTML = x.html() + `<div class="sub-pe"><span class="sub-tarefa">${ic(feita ? "check-circle-duotone" : "target-duotone")}<span data-tarefa>${feita ? "Concluído. Pode rever quando quiser." : esc(x.tarefa)}</span></span><button type="button" class="btn btn-3d" data-concluir${feita || x.pronto() ? "" : " disabled"}>${feita ? "Próximo subtópico" : "Concluir e seguir"}${ic("arrow-right-bold")}</button></div>`;
      [...alvo.children].forEach((c, k) => c.style.setProperty("--i", k));
      const botao = alvo.querySelector("[data-concluir]");
      const liberar = () => { botao.disabled = false; };
      if (x.montar) x.montar(alvo, liberar);
      if (window.hljs) alvo.querySelectorAll("pre code:not(.hljs)").forEach((b) => window.hljs.highlightElement(b));
      alvo.querySelectorAll("figure").forEach(ampliavel);
      glossar(alvo, s, 6);
      botao.addEventListener("click", () => {
        if (!feitas().has(x.id)) {
          progresso.trilhas[s] = [...concluidas(s), x.id];
          salvar(true);
          alvo.querySelector("[data-tarefa]").textContent = "Concluído. Pode rever quando quiser.";
          botao.innerHTML = `Próximo subtópico${ic("arrow-right-bold")}`;
        }
        atualizar();
        const idx = secoes.indexOf(x);
        const prox = secoes.slice(idx + 1).find((q) => !feitas().has(q.id)) || primeiraPendente() || secoes[idx + 1];
        if (prox) abrir(prox.id, true);
        else { abrir(x.id, false); document.querySelector(".trilha-fim").scrollIntoView({ behavior: semMovimento() ? "auto" : "smooth", block: "center" }); }
      });
      montados.add(x.id);
    }
    document.querySelectorAll(".sub-cab").forEach((b) => b.addEventListener("click", () => abrir(b.closest(".sub").dataset.sub, true)));
    atualizar();
    abrir((primeiraPendente() || secoes[0]).id, false);
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
    if (estudo.cod !== cod) {
      const salvo = estadoDe(cod) === "dominado" ? 0 : Math.min(4, progresso.passos[cod] || 0);
      estudo = { cod, passo: salvo, liberado: [0, 1, 2, 3, 4].map((k) => k < 3 || k <= salvo), direcao: 1, retomado: salvo > 0 };
    }
    clearTimeout(autoAvanco);
    const { mod, materia: m, indice } = MODULO[cod];
    const p = estudo.passo;
    const seguinte = ORDEM[ORDEM.indexOf(cod) + 1];
    let i = 0;
    const iv = () => `style="--i:${i++}"`;
    const rotulo = `<div class="passo-rotulo" ${iv()}><span class="chip">${ic(PASSOS[p][1])}passo ${p + 1} de 5 · ${PASSOS[p][0]}</span>${mod.virada ? `<span class="chip virada">${ic("lightning-duotone")}ponto de virada</span>` : ""}${estudo.retomado ? `<span class="chip">${ic("arrow-counter-clockwise-bold")}continuando de onde parou</span>` : ""}</div>`;
    let corpo = "";
    if (p === 0) {
      const falta = mod.antes.filter((a) => estadoDe(a.codigo) !== "dominado");
      corpo = `${rotulo}<h1 class="passo-titulo" ${iv()}>${esc(mod.nome)}</h1><p class="passo-sub" ${iv()}>${esc(m.nome)} · módulo ${indice + 1} de ${m.modulos.length}${estadoDe(cod) === "dominado" ? " · já dominado" : ""}</p>
        <div class="fala" ${iv()}>${mascote(mod.antes.length ? "explica" : "feliz", "flutua", "chegar falar")}<p class="balao cor">${mod.antes.length ? `Este módulo usa ${mod.antes.length === 1 ? "uma coisa" : mod.antes.length + " coisas"} que vieram antes. ${falta.length ? "Se travar, volte nelas." : "Você já dominou tudo. Bora!"}` : "Este módulo não exige nada antes. É um começo. Bora!"}${mod.virada ? " <b>É um ponto de virada:</b> demora um pouco a fazer sentido, e depois muda tudo." : ""}</p></div>
        ${mod.antes.length ? `<ul class="lista-pre-j" ${iv()}>${mod.antes.map((a) => `<li class="${estadoDe(a.codigo) === "dominado" ? "ok" : ""}"><a href="#estudo-${a.codigo}"><span class="bolinha">${ic(estadoDe(a.codigo) === "dominado" ? "check-bold" : "question-duotone")}</span><span><b>${esc(a.nome)}</b><br><small>${esc(POR_SIGLA[a.materia].nome)}</small></span><small>${estadoDe(a.codigo) === "dominado" ? "dominado" : "não marcado"}</small></a></li>`).join("")}</ul>` : ""}
        ${falta.length ? `<p class="aviso-j" ${iv()}>Você ainda não marcou ${falta.length === 1 ? "esse pré-requisito" : "esses pré-requisitos"} como dominado. Pode seguir; se travar, volte ${falta.length === 1 ? "nele" : "neles"} primeiro.</p>` : ""}`;
    }
    if (p === 1) corpo = `${rotulo}<h1 class="passo-titulo" ${iv()}>Para que serve</h1>
      <div class="fala" ${iv()}>${mascote("explica", "flutua", "falar")}<p class="balao cor texto-grande glossavel">${esc(mod.dia)}</p></div>
      <div class="alvo" ${iv()}><span class="ic-a">${ic("target-duotone")}</span><div><small>ao final, você consegue</small><p class="glossavel">${esc(mod.dominio)}.</p></div></div>
      ${m.trabalho ? `<div class="alvo no-trabalho" ${iv()}><span class="ic-a">${ic("graduation-cap-duotone")}</span><div><small>${esc(m.nome)} no trabalho do cientista de dados · ${esc(m.etapa)}</small><p class="glossavel">${esc(m.trabalho)}</p></div></div>` : ""}`;
    const marcados = new Set(progresso.conceitos[cod] || []);
    if (p === 2) corpo = `${rotulo}<h1 class="passo-titulo" ${iv()}>O que você aprende</h1><p class="passo-sub" ${iv()}>${mod.conceitos.length} conceitos, nesta ordem. Marque cada um quando sentir que entendeu; a marcação fica salva. Toque nos termos sublinhados para ver o que significam.</p>
      <p class="conta-conceitos" id="conta-conceitos" ${iv()}>${marcados.size} de ${mod.conceitos.length} marcados como entendidos</p>
      <ol class="conceito-cards" ${iv()}>${mod.conceitos.map((c, j) => `<li style="--j:${j}" class="${marcados.has(j) ? "entendido" : ""}"><span class="glossavel">${esc(c.charAt(0).toUpperCase() + c.slice(1))}</span><button type="button" class="c-ok" data-c="${j}" aria-pressed="${marcados.has(j)}">${ic("check-bold")}<span>${marcados.has(j) ? "entendi" : "marcar"}</span></button></li>`).join("")}</ol>
      ${LICOES[cod] ? `<a class="cartao-link" href="${LICOES[cod]}" ${iv()}><span class="ic-a">${ic("play-duotone")}</span><span><b>Lição ilustrada deste módulo</b><small>exercícios com correção na hora, um conceito por vez</small></span>${ic("arrow-right-bold")}</a>` : ""}
      <a class="cartao-link" href="#guia-${m.sigla}" ${iv()}><span class="ic-a">${ic("film-strip-duotone")}</span><span><b>Ver o desenho, o clipe e a caixa interativa</b><small>${esc(m.nome)}: como funciona</small></span>${ic("arrow-right-bold")}</a>
      <p class="passo-sub" ${iv()}>Opcional: para tirar dúvidas com um tutor, abra o Claude e digite <code>/aula</code>.</p>`;
    if (p === 3) corpo = `${rotulo}<h1 class="passo-titulo" ${iv()}>Cuidado com</h1>
      <div class="cuidado" ${iv()}><span class="ic-a">${ic("warning-duotone")}</span><p class="glossavel">${esc(mod.tropeco)}</p></div>
      <div class="fala" ${iv()}>${mascote("pensa", "", "pensar")}<p class="balao">É o erro mais comum nesta etapa. Saber dele antes já evita metade das vezes.</p></div>`;
    if (p === 4) corpo = (window.VERIFICA_MODULOS || {})[cod] && window.Motor
      ? `${rotulo}<h1 class="passo-titulo" ${iv()}>Pronto para avançar?</h1>
      <div class="fala" ${iv()}>${mascote("pensa", "flutua", "pensar")}<p class="balao cor">Confira se entendeu. Tem duas tentativas, e o erro vem explicado.</p></div>
      <div class="verifica-estudo" ${iv()} data-verifica></div>
      <div class="botoes-j" ${iv()}><button type="button" class="btn" data-naosei>Ainda não sei: rever os conceitos</button></div>
      <div data-resposta hidden></div>`
      : `${rotulo}<h1 class="passo-titulo" ${iv()}>Pronto para avançar?</h1>
      <div class="fala" ${iv()}>${mascote("pensa", "flutua", "pensar")}<p class="balao cor texto-grande">${esc(mod.pergunta)}</p></div>
      <label class="resposta-campo" ${iv()}><span>Escreva a sua resposta antes de ver a nossa. Ela fica salva${progresso.respostas[cod] ? ` (última edição em ${progresso.respostas[cod].em.split("-").reverse().join("/")})` : ""}.</span><textarea id="resp" rows="4">${esc((progresso.respostas[cod] || {}).texto || "")}</textarea></label>
      <div class="botoes-j" ${iv()}><button type="button" class="btn btn-3d" data-comparar disabled>${ic("check-bold")}Comparar com a resposta</button><button type="button" class="btn" data-naosei>Ainda não sei</button></div>
      <div data-resposta hidden></div>`;
    const pe = p < 3
      ? `<button type="button" class="btn btn-3d btn-grande" data-continuar>Continuar${ic("arrow-right-bold")}</button>`
      : p === 3
        ? `<button type="button" class="btn btn-3d btn-grande" data-continuar>${ic("check-bold")}Entendi, seguir</button>`
        : seguinte ? `<a class="btn btn-fantasma" href="#estudo-${seguinte}">Pular para o próximo módulo</a>` : "";
    const segs = PASSOS.map(([nome], k) => `<button type="button" class="seg ${k < p ? "feito" : k === p ? "atual" : ""}" data-ir="${k}" aria-label="Passo ${k + 1}: ${nome}${k < p ? ", feito" : k === p ? ", atual" : ""}"${k > p && !estudo.liberado.slice(0, k + 1).every(Boolean) ? " disabled" : ""}></button>`).join("");
    centro().innerHTML = `
      <div class="licao tema-exp" style="${coresExp()}">
        <header class="licao-topo">
          <a class="btn btn-redondo btn-fantasma" href="#trilha-${m.sigla}" aria-label="Sair da lição e voltar para ${esc(m.nome)}">${ic("x-bold")}</a>
          <nav class="segmentos" aria-label="Passos da lição">${segs}</nav>
          <span class="salvo" aria-live="polite">${textoSalvo()}</span>
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
      estudo.retomado = false;
      if ((progresso.passos[cod] || 0) < estudo.passo) { progresso.passos[cod] = estudo.passo; salvar(); }
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
    if (cont) {
      cont.addEventListener("click", avancar);
      // botão com progresso: a barra mostra em que passo da lição você está
      cont.classList.add("b-prog"); cont.style.setProperty("--p", (p + 1) / PASSOS.length); cont.dataset.passo = `passo ${p + 1} de ${PASSOS.length}`;
    }
    if (p === 4) montarPergunta(cod, mod, seguinte);
    if (p === 2) document.querySelectorAll(".c-ok").forEach((b) => b.addEventListener("click", () => {
      const j = Number(b.dataset.c);
      const set = new Set(progresso.conceitos[cod] || []);
      if (set.has(j)) set.delete(j); else set.add(j);
      progresso.conceitos[cod] = [...set].sort((a, c) => a - c);
      salvar();
      const on = set.has(j);
      b.setAttribute("aria-pressed", String(on));
      b.querySelector("span").textContent = on ? "entendi" : "marcar";
      b.closest("li").classList.toggle("entendido", on);
      document.getElementById("conta-conceitos").textContent = `${set.size} de ${mod.conceitos.length} marcados como entendidos`;
    }));
    teclas = (e) => {
      if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
      if (e.key === "Escape") { location.hash = `#trilha-${m.sigla}`; return; }
      if ((e.key === "ArrowRight" || e.key === "Enter") && estudo.passo < 4 && !e.target.closest("a,button:not([data-continuar])")) { e.preventDefault(); avancar(); }
      if (e.key === "ArrowLeft" && estudo.passo > 0) { e.preventDefault(); ir(estudo.passo - 1); }
    };
  }
  function montarPergunta(cod, mod, seguinte) {
    const alvo = document.querySelector("[data-verifica]");
    if (alvo) { montarVerificacao(alvo, cod, mod, seguinte); return; }
    const area = document.getElementById("resp");
    const comparar = document.querySelector("[data-comparar]");
    const caixa = document.querySelector("[data-resposta]");
    const mostrar = (podeAcertar) => {
      const pf = document.querySelector(".cartao-passo .mascote");
      if (pf && window.GuiaMov) window.GuiaMov.mover(pf, "dica", podeAcertar ? "explica" : "padrao");
      else if (pf) pf.innerHTML = guia().expr[podeAcertar ? "explica" : "padrao"];
      caixa.hidden = false;
      caixa.innerHTML = `<div class="resposta-j">${ic("check-circle-duotone")}<div><small>a nossa resposta</small><p>${esc(mod.resposta)}</p></div></div>
        <div class="botoes-j" style="margin-top:14px">${podeAcertar ? `<button type="button" class="btn btn-3d sucesso btn-grande" data-acertei>${ic("trophy-duotone")}Acertei: dominar módulo</button>` : ""}<button type="button" class="btn" data-rever>${ic("arrow-counter-clockwise-bold")}Ainda não: rever os conceitos</button></div>`;
      const ac = caixa.querySelector("[data-acertei]");
      if (ac) { ac.addEventListener("click", () => vitoria(cod, seguinte)); ac.focus({ preventScroll: true }); }
      caixa.querySelector("[data-rever]").addEventListener("click", () => { marcar(cod, "rever"); toast("Marcado para rever. Volte aos conceitos com calma.", "arrow-counter-clockwise-bold"); estudo.direcao = -1; estudo.passo = 2; vistaEstudo(cod); window.scrollTo(0, 0); });
      caixa.scrollIntoView({ behavior: semMovimento() ? "auto" : "smooth", block: "nearest" });
    };
    area.addEventListener("input", () => {
      comparar.disabled = area.value.trim().length < 3;
      progresso.respostas[cod] = { texto: area.value, em: hoje() };
      salvar();
    });
    comparar.disabled = area.value.trim().length < 3;
    comparar.addEventListener("click", () => mostrar(true));
    document.querySelector("[data-naosei]").addEventListener("click", () => mostrar(false));
    area.focus({ preventScroll: true });
  }

  // a pergunta final que corrige: escolher, completar, achar o erro ou ordenar (window.VERIFICA_MODULOS, verifica-modulos.js).
  // Acertou (de primeira ou na segunda), pode dominar o módulo; com a resposta revelada, revê os conceitos ou tenta de novo.
  // A tarefa de domínio continua como prática opcional, com o texto salvo como antes.
  function montarVerificacao(alvo, cod, mod, seguinte) {
    const caixa = document.querySelector("[data-resposta]");
    alvo.innerHTML = window.Motor.criar(window.VERIFICA_MODULOS[cod]);
    const ex = alvo.querySelector(".exercicio");
    const rever = () => { marcar(cod, "rever"); toast("Marcado para rever. Volte aos conceitos com calma.", "arrow-counter-clockwise-bold"); estudo.direcao = -1; estudo.passo = 2; vistaEstudo(cod); window.scrollTo(0, 0); };
    window.Motor.montarExercicio(ex, { licao: cod, titulo: mod.nome, conceito: mod.nome, resumo: mod.resposta, aoResolver: (e, r) => {
      progresso.verificados[cod] = { r, em: hoje() }; salvar();
      const acertou = r !== "revelada";
      const pf = document.querySelector(".cartao-passo .mascote");
      if (pf && window.GuiaMov) window.GuiaMov.mover(pf, acertou ? "acerto" : "erro", acertou ? "feliz" : "pensa");
      const resp = progresso.respostas[cod] || {};
      caixa.hidden = false;
      const ns0 = document.querySelector("[data-naosei]");
      if (ns0) ns0.closest(".botoes-j").hidden = true;
      caixa.innerHTML = `<div class="botoes-j">${acertou ? `<button type="button" class="btn btn-3d sucesso btn-grande" data-acertei>${ic("trophy-duotone")}Dominar o módulo</button><button type="button" class="btn" data-rever>${ic("arrow-counter-clockwise-bold")}Rever os conceitos</button>` : `<button type="button" class="btn btn-3d" data-rever>${ic("arrow-counter-clockwise-bold")}Rever os conceitos</button><button type="button" class="btn" data-de-novo>Tentar de novo</button>`}</div>
        <details class="pratica-j"><summary>Praticar com a tarefa do módulo (opcional)</summary>
          <label class="resposta-campo"><span>${esc(mod.pergunta)} O que você escrever fica salvo.</span><textarea id="resp" rows="3">${esc(resp.texto || "")}</textarea></label>
          <details class="resposta-ver"><summary>Ver a nossa resposta</summary><div class="resposta-j">${ic("check-circle-duotone")}<div><small>a nossa resposta</small><p>${esc(mod.resposta)}</p></div></div></details>
        </details>`;
      const t = caixa.querySelector("#resp");
      t.addEventListener("input", () => { progresso.respostas[cod] = { texto: t.value, em: hoje() }; salvar(); });
      const ac = caixa.querySelector("[data-acertei]");
      if (ac) { ac.addEventListener("click", () => vitoria(cod, seguinte)); ac.focus({ preventScroll: true }); }
      caixa.querySelector("[data-rever]").addEventListener("click", rever);
      const dn = caixa.querySelector("[data-de-novo]");
      if (dn) dn.addEventListener("click", () => { caixa.hidden = true; caixa.innerHTML = ""; montarVerificacao(alvo, cod, mod, seguinte); });
      caixa.scrollIntoView({ behavior: semMovimento() ? "auto" : "smooth", block: "nearest" });
    } });
    if (window.Reacao) window.Reacao.observar(ex);
    const ns = document.querySelector("[data-naosei]");
    if (ns && !ns.dataset.ligado) { ns.dataset.ligado = "1"; ns.addEventListener("click", rever); }
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
    el.style.cssText = coresExp();
    el.classList.add("tema-exp");
    el.innerHTML = `<div class="vitoria-cartao">
      ${mascote(fimMateria ? "uau" : "feliz", "", "concluir")}
      <h2>${fimMateria ? "Matéria concluída!" : "Módulo dominado!"}</h2>
      <span class="ganho-xp">${ic("lightning-duotone")}<span>+<span data-xp>0</span> XP</span></span>
      <p>${jaEra ? "Revisão feita. " : ""}Nível ${depois.n} · ${depois.resto} de 100 XP${depois.n > antes ? ". Você subiu de nível!" : ""}</p>
      ${seguinte ? `<p>Próximo: <b>${esc(MODULO[seguinte].mod.nome)}</b></p><div class="contagem" style="--dur:${dur}s"><i></i></div>` : "<p>Você terminou a jornada inteira.</p>"}
      <div class="vitoria-acoes">${seguinte ? `<button type="button" class="btn btn-3d" data-seguir>${ic("arrow-right-bold")}Seguir agora</button><button type="button" class="btn" data-ficar>Ficar aqui</button>` : `<a class="btn btn-3d" href="#mapa">${ic("map-trifold-duotone")}Ver o mapa</a>`}</div>
    </div>`;
    document.body.appendChild(el);
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
    // quando a troca nasce de um temporizador (avanço automático, tutorial), o navegador pode adiar a transição
    // até o próximo quadro desenhado; se ela não rodar logo, a tela troca sem animação
    let feito = false;
    const uma = () => { if (feito) return; feito = true; fazer(); };
    const t = document.startViewTransition(uma);
    [t.ready, t.finished, t.updateCallbackDone].forEach((pr) => pr && pr.catch(() => {}));
    setTimeout(() => { if (!feito) { if (t.skipTransition) t.skipTransition(); uma(); } }, 350);
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
    if (r.v === "inicio") vistaInicio();
    else if (r.v === "mapa") {
      vistaMapa();
      const t = lerTut();
      if (!t.feito && !t.visto) setTimeout(() => abrirTutorial(t.parada || 0), 700);
    }
    else if (r.v === "materia") vistaMateria(r.sigla, r.aba);
    else if (r.v === "estudo") vistaEstudo(r.cod);
    else vistaFontes();
    const titulo = r.v === "inicio" ? "Início" : r.v === "mapa" ? "Mapa" : r.v === "fontes" ? "Fontes" : r.v === "estudo" ? MODULO[r.cod].mod.nome : POR_SIGLA[r.sigla].nome;
    document.title = `${titulo} · Domínio`;
  }
  // ---------- tutorial: o guia apresenta o Domínio, parando na parte real da tela de que fala ----------
  const CHAVE_TUT = "dominio:tutorial:v1";
  const lerTut = () => { try { return JSON.parse(localStorage.getItem(CHAVE_TUT) || "{}") || {}; } catch (e) { return {}; } };
  const gravarTut = (v) => { try { localStorage.setItem(CHAVE_TUT, JSON.stringify(v)); } catch (e) { /* vale só nesta visita */ } };
  const CICLO_CD = ["Perguntar", "Coletar", "Guardar", "Limpar", "Analisar", "Modelar", "Comunicar", "Cuidar dos dados"];
  function paradasTutorial() {
    const prox = proximoModulo(materiaAtual());
    const lista = (itens, ordem) => `<${ordem ? "ol" : "ul"} class="tut-lista">${itens.map((x) => `<li>${x}</li>`).join("")}</${ordem ? "ol" : "ul"}>`;
    return [
      { alvo: null, expr: "feliz", t: `Oi, eu sou ${esc(guia().nome)}`, h: `<p>Vou acompanhar você do primeiro algoritmo ao primeiro modelo. Antes, o que faz um cientista de dados: ele percorre este ciclo, de novo e de novo, em cada projeto.</p>${lista(CICLO_CD, true)}<p>Cada matéria do Domínio treina uma ou mais etapas desse ciclo, e eu sempre aviso qual.</p>` },
      { alvo: ".legenda-linhas", expr: "explica", t: "O mapa: 16 matérias em 6 linhas", h: `<p>Cada linha junta matérias que treinam as mesmas etapas do trabalho:</p>${lista(MUNDOS.map((w) => `<b>${esc(w.nome)}</b>: ${w.siglas.map((sg) => esc((POR_SIGLA[sg].etapa || "").toLowerCase())).join(", ")}`))}<p>Passe o mouse ou toque numa estação: eu digo o que ela usa, o que ela prepara e onde ela entra no trabalho.</p>` },
      { alvo: "[data-principal]", expr: "explica", t: "Um botão para seguir", h: `<p>O Continuar leva sempre ao próximo módulo da sequência, agora <b>${esc(prox.nome)}</b>. Não precisa escolher nada: a ordem já respeita o que cada matéria pede antes.</p>` },
      { alvo: null, expr: "explica", t: "Cada módulo em 5 passos", h: `${lista(PASSOS.map(([n]) => esc(n)), true)}<p>No passo “Para que serve” eu conto onde aquilo aparece no trabalho. No último, você responde uma pergunta que se corrige na hora (escolher, completar, achar o erro ou pôr na ordem); acertou, o módulo fica dominado.</p>` },
      { alvo: 'a[href="licoes/INICIO.html"]', expr: "uau", t: "Lições com animação e prática", h: "<p>Nas lições ilustradas, cada conceito abre em etapas, uma de cada vez: um desafio antes de ler, a animação passo a passo, os exercícios e a sua explicação. Errou? Na primeira vez vem a dica; na segunda, a resposta comentada. O melhor começo é a lista de aprovados.</p>" },
      { alvo: 'a[href="castelo/index.html"]', expr: "feliz", t: "O laboratório: a prática que fixa", h: "<p>No Centro de Dados você monta um banco PostgreSQL do zero, como num projeto real: cria as tabelas, carrega os dados, consulta, analisa com Python, administra o banco e apresenta os resultados. Cada módulo começa dizendo em que momento do trabalho aquilo acontece.</p>" },
      { alvo: "#guia-btn", expr: "padrao", t: "Seu guia, o tema e este tutorial", h: "<p>Aqui você troca o guia e o tema e salva o seu trajeto num arquivo, para levar a outro aparelho. O tutorial fica no botão ao lado, para rever quando quiser. O que você errar volta para revisão em 1, 3, 7, 14 e 30 dias, e o mapa avisa quando há revisão.</p>" },
    ];
  }
  let tutAberto = null;
  function abrirTutorial(inicio) {
    if (tutAberto) return;
    if (rota().v !== "mapa") { location.hash = "#mapa"; setTimeout(() => abrirTutorial(inicio), 450); return; }
    const paradas = paradasTutorial(), n = paradas.length;
    let k = Math.max(0, Math.min(n - 1, inicio || 0));
    const voltarFoco = document.activeElement;
    const el = document.createElement("div");
    el.className = "tut";
    el.innerHTML = `<div class="tut-fundo"></div><div class="tut-foco" aria-hidden="true"></div>
      <section class="tut-cartao" role="dialog" aria-modal="true" aria-labelledby="tut-t" aria-describedby="tut-texto">
        <div class="tut-guia"></div>
        <div class="tut-corpo"><p class="tut-n"></p><h2 id="tut-t" tabindex="-1"></h2><div class="tut-texto" id="tut-texto"></div>
          <div class="tut-acoes"><button type="button" class="btn btn-fantasma" data-tut="pular">Pular o tutorial</button><span class="tut-dir"><button type="button" class="btn" data-tut="voltar">Voltar</button><button type="button" class="btn btn-3d b-prog" data-tut="prox">Próximo</button></span></div></div>
      </section>`;
    document.body.appendChild(el);
    tutAberto = el;
    const foco = el.querySelector(".tut-foco");
    const posicionar = () => {
      const alvo = paradas[k].alvo && document.querySelector(paradas[k].alvo);
      el.classList.toggle("com-foco", !!alvo);
      if (!alvo) return;
      const r = alvo.getBoundingClientRect(), m = 6;
      Object.assign(foco.style, { left: r.left - m + "px", top: r.top - m + "px", width: r.width + m * 2 + "px", height: r.height + m * 2 + "px" });
    };
    const pintar = () => {
      const P = paradas[k], alvo = P.alvo && document.querySelector(P.alvo);
      gravarTut(Object.assign(lerTut(), { parada: k }));
      el.querySelector(".tut-guia").innerHTML = mascote(P.expr, "", k === inicio ? "chegar falar" : "falar");
      el.querySelector(".tut-n").textContent = `Tutorial · ${k + 1} de ${n}`;
      el.querySelector("#tut-t").textContent = P.t;
      el.querySelector(".tut-texto").innerHTML = P.h;
      el.querySelector('[data-tut="voltar"]').disabled = k === 0;
      const bp = el.querySelector('[data-tut="prox"]');
      bp.textContent = k === n - 1 ? "Começar a estudar" : "Próximo";
      bp.style.setProperty("--p", (k + 1) / n); bp.dataset.passo = `${k + 1} de ${n}`;
      if (alvo) {
        // o alvo fica no espaço entre o topo e o cartão do guia, centrado quando cabe (no celular o cartão ocupa a metade de baixo)
        const ra = alvo.getBoundingClientRect(), cartao = el.querySelector(".tut-cartao").getBoundingClientRect();
        const cabeca = 70, livre = (cartao.top > cabeca ? cartao.top : window.innerHeight) - cabeca;
        const folga = ra.height < livre ? Math.min(40, (livre - ra.height) / 2) : 0;
        const topo = ra.top + window.scrollY - cabeca - folga;
        window.scrollTo({ top: Math.max(0, topo), behavior: semMovimento() ? "auto" : "smooth" });
      }
      posicionar();
      setTimeout(posicionar, 420);
      el.querySelector("#tut-t").focus({ preventScroll: true });
    };
    const fechar = (feito) => {
      gravarTut(Object.assign(lerTut(), feito ? { feito: true, parada: 0 } : { visto: true }));
      window.removeEventListener("scroll", posicionar); window.removeEventListener("resize", posicionar);
      el.remove(); tutAberto = null;
      if (voltarFoco && voltarFoco.focus) voltarFoco.focus({ preventScroll: true });
      // ao terminar, a ação principal do mapa fica à vista
      const principal = document.querySelector("[data-principal]");
      if (principal && principal.scrollIntoView) principal.scrollIntoView({ block: "center", behavior: semMovimento() ? "auto" : "smooth" });
    };
    el.addEventListener("click", (e) => {
      const b = e.target.closest("[data-tut]");
      if (!b) return;
      if (b.dataset.tut === "pular") fechar(true);
      else if (b.dataset.tut === "voltar" && k > 0) { k--; pintar(); }
      else if (b.dataset.tut === "prox") { if (k < n - 1) { k++; pintar(); } else fechar(true); }
    });
    el.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { e.stopPropagation(); fechar(false); }
      else if (e.key === "ArrowRight" && k < n - 1) { k++; pintar(); }
      else if (e.key === "ArrowLeft" && k > 0) { k--; pintar(); }
      else if (e.key === "Tab") {
        const fs = [...el.querySelectorAll("button:not(:disabled)")];
        const i = fs.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); fs[fs.length - 1].focus(); }
        else if (!e.shiftKey && i === fs.length - 1) { e.preventDefault(); fs[0].focus(); }
      }
    });
    window.addEventListener("scroll", posicionar, { passive: true }); window.addEventListener("resize", posicionar, { passive: true });
    pintar();
  }
  window.Tutorial = { abrir: abrirTutorial };

  // seletor de guia no topo
  // ---------- trajeto: salvar num arquivo e carregar de um arquivo (trajeto.js) ----------
  const dataBR = (iso) => { const d = new Date(iso); return isNaN(d) ? "" : `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`; };
  function acaoTrajeto(acao) {
    const T = window.Trajeto;
    if (!T) return;
    if (acao === "salvar") {
      T.baixar();
      toast("Trajeto salvo no arquivo. Guarde-o: é ele que leva seu progresso para outro aparelho.", "download-duotone");
      if (rota().v === "inicio") render();
      return;
    }
    if (acao === "desfazer") {
      if (T.desfazer()) { try { sessionStorage.setItem("dominio-aviso", "Carregamento desfeito: voltou o trajeto de antes."); } catch (e) { /* sem armazenamento */ } location.reload(); }
      return;
    }
    // carregar: escolhe o arquivo, mostra o que ele traz e só troca depois da confirmação
    const entrada = document.createElement("input");
    entrada.type = "file"; entrada.accept = ".json,application/json"; entrada.hidden = true;
    document.body.appendChild(entrada);
    entrada.addEventListener("change", () => {
      const arq = entrada.files && entrada.files[0];
      entrada.remove();
      if (!arq) return;
      arq.text().then((texto) => dialogoTrajeto(texto));
    });
    entrada.click();
  }
  // baixar o curso inteiro: o Python, o PostgreSQL e tudo o que o site usa ficam guardados no aparelho
  function dialogoOffline(depois) {
    const O = window.Offline;
    if (!O) return;
    const dlg = document.createElement("dialog");
    dlg.className = "trajeto-dlg offline-dlg";
    dlg.setAttribute("aria-labelledby", "offline-t");
    const feito = O.ultimo();
    dlg.innerHTML = `<h2 id="offline-t">Baixar o curso inteiro</h2>
      <p>${feito ? `Já baixado em ${esc(dataBR(feito))}. Baixar de novo confere tudo e completa o que faltar.` : "Guarda neste aparelho tudo o que o curso usa, inclusive o Python e o PostgreSQL. São cerca de 50 MB: prefira o Wi-Fi."}</p>
      <ol class="offline-etapas">${O.ETAPAS.map((x) => `<li data-etapa="${x.id}"><span class="offline-marca" aria-hidden="true"></span><span><b>${esc(x.nome)}</b><small></small></span></li>`).join("")}</ol>
      <p class="offline-fim" role="status" aria-live="polite"></p>
      <div class="trajeto-acoes"><button type="button" class="btn" data-fechar>Fechar</button><button type="button" class="btn btn-3d" data-baixar>${feito ? "Conferir e completar" : "Baixar agora"}</button></div>`;
    document.body.appendChild(dlg);
    let rodando = false;
    const sair = () => { if (rodando) return; dlg.close(); dlg.remove(); if (depois) depois(); };
    dlg.querySelector("[data-fechar]").addEventListener("click", sair);
    dlg.addEventListener("cancel", (e) => { e.preventDefault(); sair(); });
    const bt = dlg.querySelector("[data-baixar]"), fim = dlg.querySelector(".offline-fim");
    bt.addEventListener("click", async () => {
      rodando = true; bt.disabled = true; dlg.querySelector("[data-fechar]").disabled = true; fim.textContent = "Baixando. Deixe esta tela aberta: o Python leva alguns minutos numa rede lenta.";
      dlg.querySelectorAll("[data-etapa]").forEach((li) => { li.className = ""; li.querySelector("small").textContent = ""; });
      const rotulo = { andamento: "baixando...", ok: "pronto", falhou: "não deu" };
      const ok = await O.baixarTudo((id, estado, texto) => {
        const li = dlg.querySelector(`[data-etapa="${id}"]`);
        if (!li) return;
        li.className = estado;
        li.querySelector("small").textContent = texto || rotulo[estado] || "";
      });
      rodando = false; bt.disabled = false; dlg.querySelector("[data-fechar]").disabled = false;
      fim.textContent = ok ? "Pronto. O curso inteiro está neste aparelho: pode estudar sem internet, inclusive o Python e o Centro de Dados." : "Parou no item marcado. O que já veio fica guardado: toque de novo para continuar.";
      bt.textContent = ok ? "Conferir de novo" : "Tentar de novo";
      if (ok) { toast("Curso baixado: pode estudar sem internet.", "check-circle-duotone"); dlg.querySelector("[data-fechar]").focus(); }
    });
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
    bt.focus();
  }
  function dialogoTrajeto(texto) {
    const T = window.Trajeto;
    let pacote = null, erro = "";
    try { pacote = T.validar(texto); } catch (e) { erro = e.message; }
    const dlg = document.createElement("dialog");
    dlg.className = "trajeto-dlg";
    dlg.setAttribute("aria-labelledby", "trajeto-t");
    if (erro) {
      dlg.innerHTML = `<h2 id="trajeto-t">Não deu para carregar</h2><p>${esc(erro)}</p><div class="trajeto-acoes"><button type="button" class="btn btn-3d" data-fechar>Entendi</button></div>`;
    } else {
      const r = T.resumo(pacote);
      dlg.innerHTML = `<h2 id="trajeto-t">Carregar este trajeto?</h2>
        <p class="trajeto-data">Salvo em ${esc(dataBR(r.salvo_em) || "data desconhecida")}</p>
        <ul class="trajeto-resumo"><li><b>${r.modulos}</b> ${r.modulos === 1 ? "módulo dominado" : "módulos dominados"}</li><li><b>${r.licoes}</b> ${r.licoes === 1 ? "lição ilustrada" : "lições ilustradas"}</li><li><b>${r.revisoes}</b> ${r.revisoes === 1 ? "item de revisão" : "itens de revisão"}</li><li><b>${r.laboratorio}</b> de 17 módulos do laboratório</li></ul>
        <p>O trajeto deste aparelho é trocado pelo do arquivo. Se mudar de ideia, o menu do guia oferece desfazer.</p>
        <div class="trajeto-acoes"><button type="button" class="btn" data-fechar>Cancelar</button><button type="button" class="btn btn-3d" data-trocar>Trocar pelo do arquivo</button></div>`;
    }
    document.body.appendChild(dlg);
    const sair = () => { dlg.close(); dlg.remove(); };
    dlg.querySelector("[data-fechar]").addEventListener("click", sair);
    dlg.addEventListener("cancel", (e) => { e.preventDefault(); sair(); });
    const trocar = dlg.querySelector("[data-trocar]");
    if (trocar) trocar.addEventListener("click", () => {
      try { T.aplicar(pacote); } catch (e) { dlg.querySelector("p:last-of-type").textContent = e.message; return; }
      try { sessionStorage.setItem("dominio-aviso", `Trajeto carregado: ${T.resumo(pacote).modulos} ${T.resumo(pacote).modulos === 1 ? "módulo dominado" : "módulos dominados"}.`); } catch (e) { /* sem armazenamento */ }
      location.reload();
    });
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
    (trocar || dlg.querySelector("[data-fechar]")).focus();
  }

  function montarSeletorGuia() {
    const btn = document.getElementById("guia-btn"), menu = document.getElementById("guia-menu"), mini = document.getElementById("guia-mini");
    const ordem = ["rin", "takumi", "mei", "bia", "davi", "lia", "kenji", "sol", "rafa", "panda"].filter((id) => window.GUIAS[id]);
    const atualizar = () => {
      mini.innerHTML = guia().expr.padrao;
      mini.className = "guia-mini" + (guia().id === "panda" ? "" : " retrato");
      const tema = window.Tema ? window.Tema.atual() : "grafite";
      menu.innerHTML = (window.Offline && window.Offline.disponivel() ? `<p>Sem internet</p><button type="button" data-offline><span class="trajeto-ic">${ic("download-duotone")}</span><span><b>Baixar o curso inteiro</b><small>${window.Offline.ultimo() ? "baixado em " + dataBR(window.Offline.ultimo()) + "; toque para conferir" : "para estudar tudo sem internet"}</small></span><span></span></button>` : "") + (window.Trajeto ? `<p>Seu trajeto</p><button type="button" data-trajeto="salvar"><span class="trajeto-ic">${ic("download-duotone")}</span><span><b>Salvar meu trajeto</b><small>${window.Trajeto.ultimoSalvo() ? "último arquivo em " + dataBR(window.Trajeto.ultimoSalvo()) : "baixa um arquivo com tudo"}</small></span><span></span></button><button type="button" data-trajeto="carregar"><span class="trajeto-ic">${ic("upload-duotone")}</span><span><b>Carregar trajeto</b><small>de um arquivo salvo antes</small></span><span></span></button>${window.Trajeto.temAnterior() ? `<button type="button" data-trajeto="desfazer"><span class="trajeto-ic">${ic("history-duotone")}</span><span><b>Desfazer o carregamento</b><small>volta ao trajeto de antes</small></span><span></span></button>` : ""}` : "") + `<p>Tema</p>` + [["grafite", "Grafite", "o padrão, claro ou escuro como o aparelho"], ["impresso", "Impresso", "papel, duas tintas e grão"]].map(([id, nome, desc]) => `<button type="button" aria-pressed="${id === tema}" data-tema-opcao="${id}"><span class="tema-amostra tema-amostra-${id}" aria-hidden="true"></span><span><b>${nome}</b><small>${desc}</small></span>${id === tema ? ic("check-bold") : ""}</button>`).join("") + (window.Tracos ? `<p>Traço dos guias</p>` + window.Tracos.LISTA.map((t) => `<button type="button" aria-pressed="${t.id === window.Tracos.atual()}" data-traco-opcao="${t.id}"><span class="guia-mini retrato">${(window.GUIAS[guia().id === "panda" ? "rin" : guia().id].tracos || {})[t.id] ? window.GUIAS[guia().id === "panda" ? "rin" : guia().id].tracos[t.id].padrao : ""}</span><span><b>${esc(t.nome)}</b><small>${esc(t.desc)}</small></span>${t.id === window.Tracos.atual() ? ic("check-bold") : ""}</button>`).join("") : "") + `<p>Seu guia</p>` + ordem.map((id) => { const g = window.GUIAS[id]; return `<button type="button" aria-pressed="${id === guia().id}" data-guia="${id}"><span class="guia-mini${id === "panda" ? "" : " retrato"}">${g.expr.padrao}</span><span><b>${esc(g.nome)}</b><small>${esc(g.funcao)}</small></span>${id === guia().id ? ic("check-bold") : ""}</button>`; }).join("") + `<a class="guia-galeria" href="licoes/GALERIA.html">Ver todos os guias e animações</a>`;
    };
    const fechar = () => { menu.hidden = true; btn.setAttribute("aria-expanded", "false"); };
    btn.addEventListener("click", () => { const abrir = menu.hidden; menu.hidden = !abrir; btn.setAttribute("aria-expanded", String(abrir)); });
    menu.addEventListener("click", (e) => {
      const t = e.target.closest("[data-tema-opcao]");
      if (t && window.Tema) { window.Tema.definir(t.dataset.temaOpcao); atualizar(); return; }
      const tj = e.target.closest("[data-trajeto]");
      if (tj) { fechar(); acaoTrajeto(tj.dataset.trajeto); return; }
      if (e.target.closest("[data-offline]")) { fechar(); dialogoOffline(atualizar); return; }
      const tr = e.target.closest("[data-traco-opcao]");
      if (tr && window.Tracos) { window.Tracos.definir(tr.dataset.tracoOpcao); atualizar(); render(); return; }
      const b = e.target.closest("[data-guia]");
      if (!b) return;
      guiaId = b.dataset.guia;
      try { localStorage.setItem(CHAVE_GUIA, guiaId); } catch (err) { /* sem armazenamento */ }
      atualizar(); fechar(); render();
    });
    document.addEventListener("click", (e) => { if (!e.target.closest(".guia-seletor")) fechar(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !menu.hidden) { fechar(); btn.focus(); } });
    atualizar();
  }
  montarSeletorGuia();
  const btTut = document.getElementById("tutorial-btn");
  if (btTut) { btTut.innerHTML = ic("question-duotone") + "<span>Tutorial</span>"; btTut.addEventListener("click", () => abrirTutorial(0)); }
  document.querySelector(".hud-nav [data-v='materia']").addEventListener("click", (e) => { e.preventDefault(); location.hash = "#trilha-" + materiaAtual().sigla; });
  document.getElementById("fechar-ampliado").addEventListener("click", () => document.getElementById("ampliado").close());
  document.body.insertAdjacentHTML("afterbegin", window.FIG_DEFS);
  window.addEventListener("hashchange", () => transicao(() => { render(); window.scrollTo(0, 0); }));
  render();
  // aviso que sobrevive ao recarregar (depois de carregar ou desfazer um trajeto)
  try { const aviso = sessionStorage.getItem("dominio-aviso"); if (aviso) { sessionStorage.removeItem("dominio-aviso"); setTimeout(() => toast(aviso, "check-circle-duotone"), 400); } } catch (e) { /* sem armazenamento */ }

  // "Pular para o conteúdo": leva o foco ao conteúdo sem trocar a rota (o endereço com # é a rota desta página)
  document.querySelectorAll("a.pular, a.lab-pular-conteudo").forEach((a) => a.addEventListener("click", (e) => {
    const alvo = document.getElementById(a.getAttribute("href").slice(1));
    if (!alvo) return;
    e.preventDefault();
    if (!alvo.hasAttribute("tabindex")) alvo.setAttribute("tabindex", "-1");
    alvo.focus({ preventScroll: true });
    alvo.scrollIntoView({ block: "start" });
  }));
})();
