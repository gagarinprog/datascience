// Passo a passo: explica um mecanismo movendo as mesmas peças etapa por etapa (linhas de tabela, valores,
// variáveis), com a parte do código que está trabalhando acesa. Usado no Centro de Dados e nas lições.
// A animação usa o Anime.js (github.com/juliangarnier/anime, MIT), carregado pela página; sem ele, ou com
// "reduzir movimento", as peças vão direto para o lugar.
//
// Passo.montar(elemento, def)
//   def.titulo        nome do passo a passo (para leitores de tela)
//   def.codigo        { partes: [{ id, texto }] }: o código, em pedaços; "\n" no começo de um pedaço quebra a linha
//   def.ordem         [{ id, rotulo }]: a ordem em que as partes executam (opcional)
//   def.pecas         [{ id, html, tipo }]: tipo "ficha" (padrão), "rotulo", "chip", "caixa" ou "seta"
//   def.altura(W)     altura do palco para a largura W
//   def.passos        [{ t, d, foco, feitos, layout(W, H) }]: layout devolve { idDaPeca: { x, y, w, h, o, html, c } }
//                     (o = opacidade; c = classes extras; seta usa { x1, y1, x2, y2 }); o que não muda pode ficar de fora
//   def.aoFim()       chamado quando a pessoa chega à última etapa
(function () {
  "use strict";
  const A = () => window.anime;
  const reduz = () => !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  function montar(raiz, def) {
    if (raiz.dataset.passoPronto) return raiz._passo;
    raiz.dataset.passoPronto = "1";
    raiz.classList.add("passo-a-passo");
    const temCodigo = def.codigo && def.codigo.partes && def.codigo.partes.length;
    raiz.innerHTML = `${temCodigo ? `<div class="pp-codigo"><p class="pp-rotulo">${esc(def.rotuloCodigo || "O código")}</p><pre class="pp-pre">${def.codigo.partes.map((p) => {
        const quebras = p.texto.match(/^\n*/)[0];
        return `${quebras}<span data-parte="${p.id}">${esc(p.texto.slice(quebras.length))}</span>`;
      }).join("")}</pre>${def.ordem ? `<p class="pp-rotulo">A ordem em que roda</p><div class="pp-ordem">${def.ordem.map((o) => `<span data-ordem="${o.id}">${esc(o.rotulo)}</span>`).join("")}</div>` : ""}</div>` : ""}
      <div class="pp-cena">
        <div class="pp-legenda" aria-live="polite"><b></b><span></span></div>
        <div class="pp-palco" aria-hidden="true"></div>
        <div class="pp-controles">
          <button type="button" class="botao" data-pp="voltar">Voltar</button>
          <button type="button" class="botao" data-pp="tocar">Tocar</button>
          <button type="button" class="botao primario" data-pp="passo">Passo</button>
          <span class="pp-pontos">${def.passos.map((_, k) => `<button type="button" data-ir="${k}" aria-label="Ir à etapa ${k + 1} de ${def.passos.length}"></button>`).join("")}</span>
        </div>
      </div>`;
    if (!temCodigo) raiz.classList.add("pp-sem-codigo");
    const palco = raiz.querySelector(".pp-palco");
    palco.innerHTML = def.pecas.map((p) => `<div class="pp-peca pp-${p.tipo || "ficha"}" data-peca="${p.id}">${p.html || ""}</div>`).join("");
    const pecas = {};
    palco.querySelectorAll("[data-peca]").forEach((el) => { pecas[el.dataset.peca] = el; });

    // estado de cada peça na etapa k: soma das etapas 0..k (o que não muda herda da etapa anterior)
    function estadoEm(k, W, H) {
      const est = {};
      def.pecas.forEach((p) => { est[p.id] = { x: 0, y: 0, o: 0 }; });
      for (let j = 0; j <= k; j++) {
        const l = def.passos[j].layout ? def.passos[j].layout(W, H) : {};
        for (const id in l) est[id] = Object.assign({}, est[id], l[id]);
      }
      return est;
    }
    function aplicarSeta(el, s) {
      const dx = s.x2 - s.x1, dy = s.y2 - s.y1, comp = Math.max(0, Math.hypot(dx, dy)), ang = Math.atan2(dy, dx) * 180 / Math.PI;
      return { x: s.x1, y: s.y1, width: comp, rotate: ang };
    }
    let atual = -1, timer = null;
    function ir(k, animar) {
      k = Math.max(0, Math.min(def.passos.length - 1, k));
      const W = palco.clientWidth || 320, H = def.altura ? def.altura(W) : 360;
      palco.style.height = H + "px";
      const est = estadoEm(k, W, H), anima = animar && !reduz() && A();
      const desta = def.passos[k].layout ? def.passos[k].layout(W, H) : {};
      const ease = def.passos[k].ease || "outExpo", dur = def.passos[k].dur || 650;
      let ordemAnim = 0;
      for (const id in est) {
        const el = pecas[id], s = est[id];
        if (!el) continue;
        if (s.html !== undefined && el.dataset.html !== String(s.html)) { el.innerHTML = s.html; el.dataset.html = String(s.html); }
        el.className = `pp-peca pp-${(def.pecas.find((p) => p.id === id) || {}).tipo || "ficha"}${s.c ? " " + s.c : ""}`;
        const alvo = s.x1 !== undefined ? aplicarSeta(el, s) : { x: s.x, y: s.y };
        if (s.w !== undefined && s.x1 === undefined) alvo.width = s.w;
        if (s.h !== undefined) alvo.height = s.h;
        alvo.opacity = s.o === undefined ? 1 : s.o;
        if (anima) {
          const atraso = s.atraso !== undefined ? s.atraso : (def.passos[k].escalonar ? (ordemAnim++) * def.passos[k].escalonar : 0);
          A().animate(el, Object.assign({}, alvo, { duration: dur, delay: atraso, ease }));
        } else {
          const t = `translate(${alvo.x}px, ${alvo.y}px)${alvo.rotate !== undefined ? ` rotate(${alvo.rotate}deg)` : ""}`;
          if (A()) A().utils.set(el, alvo); else Object.assign(el.style, { transform: t, width: alvo.width !== undefined ? alvo.width + "px" : "", height: alvo.height !== undefined ? alvo.height + "px" : "", opacity: alvo.opacity });
        }
        // o pulso vale só na etapa que pediu, e só quando se chega nela andando para a frente
        if (anima && desta[id] && desta[id].pulso && atual === k - 1) A().animate(el, { scale: [1, 1.08, 1], duration: 420, delay: dur * 0.5 });
      }
      atual = k;
      const P = def.passos[k];
      raiz.querySelector(".pp-legenda b").textContent = P.t;
      raiz.querySelector(".pp-legenda span").innerHTML = P.d;
      const feitos = P.feitos || [];
      raiz.querySelectorAll("[data-parte]").forEach((s) => { s.classList.toggle("aceso", s.dataset.parte === P.foco); s.classList.toggle("feito", feitos.includes(s.dataset.parte) && s.dataset.parte !== P.foco); });
      raiz.querySelectorAll("[data-ordem]").forEach((s) => { s.classList.toggle("aceso", s.dataset.ordem === P.foco); s.classList.toggle("feito", feitos.includes(s.dataset.ordem) && s.dataset.ordem !== P.foco); });
      raiz.querySelectorAll("[data-ir]").forEach((b, j) => { b.classList.toggle("atual", j === k); b.classList.toggle("feito", j < k); b.setAttribute("aria-current", j === k ? "step" : "false"); });
      raiz.querySelector('[data-pp="voltar"]').disabled = k === 0;
      raiz.querySelector('[data-pp="passo"]').disabled = k === def.passos.length - 1;
      if (k === def.passos.length - 1 && def.aoFim && !raiz.dataset.visto) { raiz.dataset.visto = "1"; def.aoFim(); }
    }
    const btTocar = raiz.querySelector('[data-pp="tocar"]');
    function parar() { clearInterval(timer); timer = null; btTocar.textContent = "Tocar"; }
    raiz.querySelector('[data-pp="passo"]').addEventListener("click", () => { parar(); ir(atual + 1, true); });
    raiz.querySelector('[data-pp="voltar"]').addEventListener("click", () => { parar(); ir(atual - 1, false); });
    btTocar.addEventListener("click", () => {
      if (timer) return parar();
      if (atual >= def.passos.length - 1) ir(0, false);
      btTocar.textContent = "Pausar";
      timer = setInterval(() => { if (atual >= def.passos.length - 1) return parar(); ir(atual + 1, true); }, def.intervalo || 3400);
    });
    raiz.querySelectorAll("[data-ir]").forEach((b) => b.addEventListener("click", () => { parar(); ir(Number(b.dataset.ir), false); }));
    raiz.addEventListener("keydown", (e) => {
      if (e.target.closest("textarea, input")) return;
      if (e.key === "ArrowRight") { e.preventDefault(); parar(); ir(atual + 1, true); }
      if (e.key === "ArrowLeft") { e.preventDefault(); parar(); ir(atual - 1, false); }
    });
    // a largura muda (girar o celular, abrir a cascata): refaz o lugar das peças sem animar
    let larg = 0;
    if ("ResizeObserver" in window) new ResizeObserver(() => { const w = palco.clientWidth; if (w && Math.abs(w - larg) > 4) { larg = w; if (atual >= 0) ir(atual, false); } }).observe(palco);
    ir(0, false);
    raiz._passo = { ir: (k) => ir(k, true), parar };
    return raiz._passo;
  }

  // ajudas para montar layouts
  const ajuda = {
    // linhas de tabela empilhadas
    pilha(ids, x, y, w, alt = 30, gap = 4) { const o = {}; ids.forEach((id, i) => { o[id] = { x, y: y + i * (alt + gap), w, o: 1 }; }); return o; },
    // n colunas iguais dentro de W
    colunas(W, n, margem = 10, gap = 10) { const w = (W - margem * 2 - gap * (n - 1)) / n; return Array.from({ length: n }, (_, i) => ({ x: margem + i * (w + gap), w })); },
    // esconder para a direita
    sair(W, y) { return { x: W + 30, y, o: 0 }; },
  };
  window.Passo = { montar, ajuda };
})();
