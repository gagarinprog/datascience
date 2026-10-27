// Desenhos de planta técnica: as figuras das janelas de explicação, que andam por etapas (Voltar, Passo, pontos),
// e os mini desenhos dos cartões de cada ideia. Tudo é montado a partir de dados (conceitos-*.js), sem imagem pronta.
// Modelos: fluxo (caixas ligadas por setas), decisao (losango com dois caminhos), codigo (linhas que acendem),
// tabela (linhas que acendem; serve ao teste de mesa), memoria (variáveis como etiquetas presas a caixas),
// lista (itens com índice positivo e negativo; fatias acendem), comparar (jeito errado ao lado do jeito certo).
// Com reduzir movimento, a etapa troca sem transição.
(function () {
  "use strict";
  const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const reduz = () => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- mini desenhos dos cartões (150 x 52) ----------
  const GLIFOS = {
    fluxo: '<rect x="4" y="14" width="38" height="24" rx="4" class="g-e"/><rect x="56" y="14" width="38" height="24" rx="4" class="g-p"/><rect x="108" y="14" width="38" height="24" rx="4" class="g-s"/><path d="M42 26h14M94 26h14" class="g-l"/>',
    decisao: '<rect x="55" y="2" width="40" height="11" rx="5.5" class="g-l"/><path d="M75 13v6" class="g-l"/><path d="M75 19l14 9-14 9-14-9z" class="g-p"/><path d="M89 28h30v12M61 28H31v12" class="g-l"/><rect x="105" y="40" width="28" height="10" rx="2" class="g-s"/><rect x="17" y="40" width="28" height="10" rx="2" class="g-e"/>',
    codigo: '<rect x="6" y="4" width="138" height="44" rx="5" class="g-l"/><path d="M16 15h40M16 26h70M26 37h54" class="g-e"/><path d="M62 15h30" class="g-p"/><path d="M92 26h30" class="g-s"/>',
    tabela: '<rect x="6" y="4" width="138" height="44" rx="4" class="g-l"/><path d="M6 15h138M6 26h138M6 37h138M52 4v44M98 4v44" class="g-l"/><rect x="7" y="27" width="136" height="9" class="g-acesa"/>',
    memoria: '<rect x="10" y="10" width="34" height="14" rx="7" class="g-e"/><path d="M44 17h18" class="g-l"/><rect x="62" y="6" width="34" height="22" rx="3" class="g-s"/><rect x="10" y="32" width="34" height="14" rx="7" class="g-e"/><path d="M44 39h66" class="g-l"/><rect x="110" y="28" width="34" height="22" rx="3" class="g-p"/>',
    lista: '<rect x="4" y="16" width="26" height="22" rx="3" class="g-l"/><rect x="33" y="16" width="26" height="22" rx="3" class="g-acesa-b"/><rect x="62" y="16" width="26" height="22" rx="3" class="g-acesa-b"/><rect x="91" y="16" width="26" height="22" rx="3" class="g-l"/><rect x="120" y="16" width="26" height="22" rx="3" class="g-l"/><path d="M33 44h55" class="g-p"/>',
    comparar: '<rect x="4" y="6" width="66" height="40" rx="5" class="g-erro"/><path d="M14 18h40M14 28h30" class="g-erro"/><rect x="80" y="6" width="66" height="40" rx="5" class="g-s"/><path d="M90 18h40M90 28h30" class="g-s"/>',
    laco: '<path d="M40 26a22 18 0 1 1 44 0a22 18 0 1 1 -44 0" class="g-p"/><path d="M84 26l-5-6M84 26l6-5" class="g-p"/><rect x="100" y="14" width="44" height="24" rx="4" class="g-s"/><path d="M6 26h28" class="g-e"/>',
    ideia: '<circle cx="75" cy="22" r="14" class="g-p"/><path d="M68 40h14M70 46h10" class="g-l"/><path d="M75 4v-2M55 22h-4M99 22h-4" class="g-e"/>',
  };
  function glifo(tipo) {
    return `<svg class="pl-glifo" viewBox="0 0 150 52" aria-hidden="true" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${GLIFOS[tipo] || GLIFOS.ideia}</svg>`;
  }

  // ---------- figuras grandes ----------
  const COR = { e: "pl-e", p: "pl-p", s: "pl-s", n: "pl-n", x: "pl-x" };
  function fluxo(f, k) {
    const n = f.caixas.length;
    return `<div class="pl-fluxo" style="--n:${n}">${f.caixas.map((c, i) => `${i ? `<span class="pl-seta" aria-hidden="true"></span>` : ""}<div class="pl-caixa ${COR[c.c || "n"]}${k >= 0 && i === k ? " acesa" : ""}${k >= 0 && i > k ? " apagada" : ""}"><b>${esc(c.r)}</b>${(c.v || []).map((v) => `<span>${esc(v)}</span>`).join("")}</div>`).join("")}</div>`;
  }
  function decisao(f, k) {
    // k: 0 pergunta, 1 caminho escolhido
    const lado = f.vai === "nao" ? "nao" : "sim";
    return `<div class="pl-decisao">
      <div class="pl-losango pl-p${k === 0 ? " acesa" : ""}"><span>${esc(f.pergunta)}</span></div>
      <div class="pl-ramos">
        <div class="pl-ramo pl-s${k >= 1 && lado === "sim" ? " acesa" : ""}${k >= 1 && lado !== "sim" ? " apagada" : ""}"><small>sim</small><b>${esc(f.sim)}</b></div>
        <div class="pl-ramo pl-e${k >= 1 && lado === "nao" ? " acesa" : ""}${k >= 1 && lado !== "nao" ? " apagada" : ""}"><small>não</small><b>${esc(f.nao)}</b></div>
      </div></div>`;
  }
  function codigo(f, k) {
    const linhaAcesa = k >= 0 && f.passos && f.passos[k] ? f.passos[k].l : -1;
    const ate = k >= 0 && f.passos && f.passos[k] && f.passos[k].saida != null ? f.passos[k].saida : null;
    return `<div class="pl-codigo"><pre><code>${f.linhas.map((l, i) => `<span class="pl-linha${(Array.isArray(linhaAcesa) ? linhaAcesa.includes(i) : i === linhaAcesa) ? " acesa" : ""}"><i>${i + 1}</i>${esc(l) || " "}</span>`).join("")}</code></pre>${f.saida != null || ate != null ? `<div class="pl-saida"><small>saída</small><pre>${esc(ate != null ? ate : f.saida)}</pre></div>` : ""}</div>`;
  }
  function tabela(f, k) {
    const acesa = k >= 0 && f.passos && f.passos[k] ? f.passos[k].l : -1;
    const ate = f.revelar ? (k >= 0 && f.passos && f.passos[k] ? f.passos[k].l : -1) : Infinity;
    return `<div class="pl-tabela-rolagem"><table class="pl-tabela"><thead><tr>${f.cab.map((c) => `<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>${f.linhas.map((l, i) => `<tr class="${i === acesa ? "acesa" : ""}${i > ate ? " escondida" : ""}">${l.map((v) => `<td>${esc(v)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  }
  function memoria(f, k) {
    const e = f.estados[Math.max(0, k)] || f.estados[0];
    const ant = k > 0 ? f.estados[k - 1].vars : {};
    return `<div class="pl-memoria">${f.laco ? `<div class="pl-volta pl-p" aria-hidden="true"><span>volta ${esc(e.volta != null ? e.volta : Math.max(0, k))}</span></div>` : ""}${Object.entries(e.vars).map(([n, v]) => `<div class="pl-var${String(ant[n]) !== String(v) && k > 0 ? " mudou" : ""}"><span class="pl-nome pl-e">${esc(n)}</span><span class="pl-fio" aria-hidden="true"></span><span class="pl-valor pl-s">${esc(v)}</span>${e.tipos && e.tipos[n] ? `<small>${esc(e.tipos[n])}</small>` : ""}</div>`).join("")}</div>`;
  }
  function lista(f, k) {
    const sel = k >= 0 && f.passos && f.passos[k] ? f.passos[k].sel || [] : [];
    const neg = f.passos && f.passos[k] && f.passos[k].neg;
    return `<div class="pl-lista-rolagem"><ol class="pl-lista">${f.itens.map((v, i) => `<li class="${sel.includes(i) ? "acesa" : ""}"><span class="pl-item">${esc(v)}</span><small>${neg ? i - f.itens.length : i}</small></li>`).join("")}</ol></div>`;
  }
  function comparar(f) {
    const lado = (x, cls, rot) => `<div class="pl-lado ${cls}"><small>${rot}</small><b>${esc(x.titulo || "")}</b>${x.codigo ? `<pre><code>${esc(x.codigo)}</code></pre>` : ""}${x.texto ? `<p>${esc(x.texto)}</p>` : ""}</div>`;
    return `<div class="pl-comparar">${lado(f.errado, "pl-x", "assim, não")}${lado(f.certo, "pl-s", "assim, sim")}</div>`;
  }
  const MODELOS = { fluxo, decisao, codigo, tabela, memoria, lista, comparar };
  // quantas etapas cada figura tem
  function etapasDe(f) {
    if (f.passos && f.passos.length) return f.passos.length;
    if (f.t === "fluxo") return f.caixas.length;
    if (f.t === "decisao") return 2;
    if (f.t === "memoria") return f.estados.length;
    return 0;
  }
  function notaDe(f, k) {
    if (k < 0) return f.legenda || "";
    if (f.passos && f.passos[k]) return f.passos[k].nota || f.passos[k];
    if (f.t === "memoria") return (f.estados[k] && f.estados[k].nota) || "";
    if (f.t === "decisao") return k === 0 ? (f.notas && f.notas[0]) || "Primeiro, a pergunta." : (f.notas && f.notas[1]) || "A resposta escolhe o caminho.";
    return "";
  }

  // monta a figura com os controles de etapa dentro de el
  function montar(el, f) {
    const n = etapasDe(f);
    let k = n ? 0 : -1;
    el.classList.add("pl-figura");
    el.innerHTML = `${f.titulo ? `<p class="pl-cota"><span>${esc(f.titulo)}</span></p>` : ""}<div class="pl-palco"></div><p class="pl-nota" aria-live="polite"></p>${n > 1 ? `<div class="pl-controles"><button type="button" class="botao" data-pl="voltar">Voltar</button><span class="pl-pontos" aria-hidden="true">${Array.from({ length: n }, () => "<i></i>").join("")}</span><button type="button" class="botao primario b-prog" data-pl="passo">Passo</button></div>` : ""}`;
    const palco = el.querySelector(".pl-palco"), nota = el.querySelector(".pl-nota");
    const pintar = () => {
      const html = (MODELOS[f.t] || (() => ""))(f, k);
      if (!reduz() && palco.firstChild) { palco.classList.remove("troca"); void palco.offsetWidth; palco.classList.add("troca"); }
      palco.innerHTML = html;
      const t = notaDe(f, k);
      nota.innerHTML = t ? `${n > 1 ? `<b>${k + 1}/${n}</b> ` : ""}${esc(t)}` : "";
      nota.hidden = !t;
      const v = el.querySelector('[data-pl="voltar"]'), p = el.querySelector('[data-pl="passo"]');
      if (v) v.disabled = k <= 0;
      if (p) { p.disabled = k >= n - 1; p.style.setProperty("--p", (k + 1) / n); p.dataset.passo = `${k + 1} de ${n}`; p.textContent = k >= n - 1 ? "Fim" : "Passo"; }
      el.querySelectorAll(".pl-pontos i").forEach((i, j) => i.classList.toggle("on", j <= k));
    };
    el.addEventListener("click", (e) => {
      const b = e.target.closest("[data-pl]");
      if (!b) return;
      k = b.dataset.pl === "passo" ? Math.min(n - 1, k + 1) : Math.max(0, k - 1);
      pintar();
    });
    pintar();
    return el;
  }

  window.Planta = { glifo, montar, etapasDe, GLIFOS: Object.keys(GLIFOS) };
})();
