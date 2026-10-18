// Motor de animações passo a passo das lições.
// Cada animação é uma função do passo atual: aplicar(palco, k). Assim dá para tocar, pausar,
// voltar e avançar sem se perder. Com "reduzir movimento" ligado, nada anima sozinho.
(function () {
  "use strict";
  const defs = {};
  const reduz = () => !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  // FLIP: mede onde cada elemento estava, muda o DOM e anima do lugar antigo para o novo.
  function flip(els, mudar) {
    if (reduz() || !els.length || !els[0].animate) { mudar(); return; }
    const antes = new Map(els.map((e) => [e, e.getBoundingClientRect()]));
    mudar();
    els.forEach((e) => {
      const a = antes.get(e), d = e.getBoundingClientRect();
      const dx = a.left - d.left, dy = a.top - d.top;
      if (!dx && !dy) return;
      e.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "translate(0, 0)" }], { duration: 650, easing: "cubic-bezier(.2,0,0,1)" });
    });
  }

  function registrar(id, def) { defs[id] = def; }

  function montar(fig) {
    const def = defs[fig.dataset.clip];
    if (!def || fig.dataset.pronto) return;
    fig.dataset.pronto = "1";
    fig.classList.add("clip");
    const n = def.passos.length;
    fig.insertAdjacentHTML("afterbegin",
      `<div class="clip-palco" role="group" aria-label="${esc(def.titulo)}">${def.html()}</div>
       <p class="clip-legenda" aria-live="polite"></p>
       <div class="clip-controles">
         <button type="button" class="botao mini" data-a="ant">Voltar</button>
         <button type="button" class="botao mini primario" data-a="tocar">Tocar</button>
         <button type="button" class="botao mini" data-a="prox">Passo</button>
         <span class="clip-pontos">${def.passos.map((_, k) => `<button type="button" data-p="${k}" aria-label="Ir ao passo ${k + 1} de ${n}"></button>`).join("")}</span>
       </div>`);
    const palco = fig.querySelector(".clip-palco");
    const leg = fig.querySelector(".clip-legenda");
    const bTocar = fig.querySelector('[data-a="tocar"]');
    const bAnt = fig.querySelector('[data-a="ant"]');
    const bProx = fig.querySelector('[data-a="prox"]');
    let i = -1, t = null, tocando = false;

    const rotulo = () => { bTocar.textContent = tocando ? "Pausar" : (i >= n - 1 ? "Repetir" : "Tocar"); };
    function parar() { clearTimeout(t); tocando = false; rotulo(); }
    function ir(k) {
      k = Math.max(0, Math.min(n - 1, k));
      const antes = i; i = k;
      leg.innerHTML = `<span class="clip-passo">Passo ${k + 1} de ${n}</span> ${def.passos[k][0]}`;
      leg.classList.remove("troca"); void leg.offsetWidth; leg.classList.add("troca");
      fig.querySelectorAll("[data-p]").forEach((b, j) => { b.classList.toggle("atual", j === k); b.classList.toggle("feito", j < k); });
      def.aplicar(palco, k, antes);
      bAnt.disabled = k === 0;
      bProx.disabled = k === n - 1;
      if (k >= n - 1 && tocando) { clearTimeout(t); tocando = false; }
      rotulo();
    }
    function tocar() {
      clearTimeout(t); tocando = true;
      if (i >= n - 1) ir(0);
      rotulo();
      const passo = () => {
        t = setTimeout(() => {
          if (!tocando) return;
          ir(i + 1);
          if (tocando) passo();
        }, def.passos[i][1] || 3800);
      };
      passo();
    }
    bTocar.addEventListener("click", () => (tocando ? parar() : tocar()));
    bAnt.addEventListener("click", () => { parar(); ir(i - 1); });
    bProx.addEventListener("click", () => { parar(); ir(i + 1); });
    fig.querySelectorAll("[data-p]").forEach((b) => b.addEventListener("click", () => { parar(); ir(Number(b.dataset.p)); }));
    ir(0);

    if ("IntersectionObserver" in window) {
      let jaTocou = false;
      new IntersectionObserver((es) => es.forEach((e) => {
        if (e.isIntersecting && !jaTocou && !reduz() && fig.offsetParent !== null) { jaTocou = true; setTimeout(() => { if (i === 0 && !tocando) tocar(); }, 500); }
        if (!e.isIntersecting && tocando) parar();
      }), { threshold: 0.55 }).observe(fig);
    }
  }

  function iniciar(raiz) { (raiz || document).querySelectorAll("[data-clip]").forEach(montar); }

  // ---------- molde: fluxo de caixas (entrada → processamento → saída) ----------
  // caixas: [{ papel, titulo, linhas: [[texto, passoEmQueAparece], ...] }]
  // passos: [[legenda, ultimaCaixaAtiva, duracaoMs]]
  function fluxo(o) {
    return {
      titulo: o.titulo,
      passos: o.passos.map((s) => [s[0], s[2]]),
      html: () => `<div class="fluxo">${o.caixas.map((c, j) => `${j ? '<span class="fx-seta" aria-hidden="true"></span>' : ""}
        <div class="fx-caixa-c" data-j="${j}"><small>${esc(c.papel)}</small><b>${c.titulo}</b>
          <ul>${c.linhas.map(([txt, q]) => `<li data-q="${q}">${txt}</li>`).join("")}</ul></div>`).join("")}</div>`,
      aplicar(p, k) {
        const ativa = o.passos[k][1];
        p.querySelectorAll(".fx-caixa-c").forEach((b, j) => { b.classList.toggle("on", j <= ativa); b.classList.toggle("agora", j === ativa); });
        p.querySelectorAll(".fx-seta").forEach((s, j) => s.classList.toggle("on", j < ativa));
        p.querySelectorAll("li[data-q]").forEach((li) => li.classList.toggle("ver", Number(li.dataset.q) <= k));
      },
    };
  }

  // ---------- molde: execução de pseudocódigo com memória e, se quiser, teste de mesa ----------
  // o: { titulo, codigo:[], vars:[], teste:bool, passos:[{ l, linha, mem:{}, saida, nota, ms }] }
  function execucao(o) {
    const passos = o.passos.map((s) => [s.l, s.ms || 3800]);
    return {
      titulo: o.titulo,
      passos,
      html: () => `<div class="exec">
        <ol class="exec-codigo">${o.codigo.map((c, k) => `<li data-l="${k}"><span class="n">${k + 1}</span><code>${esc(c)}</code></li>`).join("")}</ol>
        <div class="exec-mem">
          <p class="exec-tit">Memória do computador</p>
          <div class="exec-vars">${o.vars.map((v) => `<div class="var" data-v="${v}"><small>${v}</small><b>—</b></div>`).join("")}</div>
          <div class="exec-saida"><small>saída (o que aparece na tela)</small><b>—</b></div>
        </div>
        ${o.teste ? `<div class="exec-teste rolagem"><table class="tabela"><thead><tr><th>linha</th>${o.vars.map((v) => `<th>${v}</th>`).join("")}<th>saída</th></tr></thead><tbody></tbody></table></div>` : ""}
      </div>`,
      aplicar(p, k) {
        const s = o.passos[k];
        p.querySelectorAll(".exec-codigo li").forEach((li) => li.classList.toggle("lendo", Number(li.dataset.l) === s.linha));
        p.querySelectorAll(".var").forEach((v) => {
          const b = v.querySelector("b"), novo = s.mem && s.mem[v.dataset.v] !== undefined ? String(s.mem[v.dataset.v]) : "—";
          if (b.textContent !== novo) { b.textContent = novo; v.classList.remove("muda"); void v.offsetWidth; v.classList.add("muda"); }
        });
        const sb = p.querySelector(".exec-saida b"), sn = s.saida || "—";
        if (sb.textContent !== sn) { sb.textContent = sn; sb.parentElement.classList.remove("muda"); void sb.offsetWidth; sb.parentElement.classList.add("muda"); }
        if (o.teste) {
          let ant = {}, antSaida = "", linhas = "";
          for (let j = 0; j <= k; j++) {
            const q = o.passos[j];
            if (q.linha < 0) { ant = q.mem || ant; continue; }
            const celulas = q.nota
              ? `<td colspan="${o.vars.length + 1}">${q.nota}</td>`
              : o.vars.map((v) => `<td class="m">${q.mem && q.mem[v] !== undefined && q.mem[v] !== ant[v] ? q.mem[v] : ""}</td>`).join("") + `<td class="m">${q.saida && q.saida !== antSaida ? q.saida : ""}</td>`;
            linhas += `<tr${j === k ? ' class="novo"' : ""}><td>${q.linha + 1}</td>${celulas}</tr>`;
            ant = Object.assign({}, ant, q.mem || {}); antSaida = q.saida || antSaida;
          }
          p.querySelector(".exec-teste tbody").innerHTML = linhas;
        }
      },
    };
  }

  window.Clip = { registrar, iniciar, flip, fluxo, execucao, esc, reduz };
})();
