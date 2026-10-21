// Movimento dos guias: o guia reage ao que você faz no estudo. Oito movimentos curtos, nenhum passa de 1,6 s:
//   chegar    ao abrir o app, uma lição ou um módulo do laboratório: sobe e inclina para os dois lados
//   falar     toda fala nova do guia: a boca abre e fecha (no traço Mangá) ou a cabeça acompanha (nos outros)
//   pensar    desafio antes da leitura e "preveja antes de ver": inclina a cabeça e olha de lado
//   acerto    exercício certo: pula uma vez e sorri, com um contorno verde
//   erro      primeira tentativa errada: balança a cabeça devagar, sem cara de bronca
//   dica      dica ou gabarito na tela: chega mais perto, explicando
//   concluir  módulo dominado ou zona ligada: sobe surpreso e volta sorrindo
//   esperar   enquanto você lê: pisca de vez em quando (no traço Mangá; o Anime pisca pelo próprio desenho)
// Com "reduzir movimento", só a expressão muda.
//
// Uso declarativo: <div class="mascote" data-guia="rin" data-expr="padrao" data-mov="chegar falar"> roda os
// movimentos na primeira vez que o guia aparece na tela. Uso direto: GuiaMov.mover(el, "acerto").
// O desenho de cada expressão vem de window.GUIAS[id].expr (o traço escolhido em tracos.js).
(function () {
  "use strict";
  const reduz = () => !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  const G = () => window.GUIAS || {};
  const EXPR = { chegar: ["explica"], pensar: ["pensa"], acerto: ["feliz"], erro: ["pensa"], dica: ["explica"], concluir: ["uau", "feliz"] };
  const DUR = { chegar: 950, pensar: 1600, acerto: 650, erro: 1100, dica: 1400, concluir: 1300 };

  function guiaDe(el) {
    const id = el.dataset.guia || (window.guiaAtual ? window.guiaAtual().id : "rin");
    return G()[id] || G().rin;
  }
  function quadro(el, nome) {
    const g = guiaDe(el);
    if (!g || !g.expr) return;
    const svg = g.expr[nome] || g.expr.padrao;
    if (el.dataset.quadro === nome && el.firstElementChild) return;
    el.innerHTML = svg;
    el.dataset.quadro = nome;
  }
  const temQuadro = (el, nome) => { const g = guiaDe(el); return !!(g && g.expr && g.expr[nome]); };

  function limpar(el) {
    clearTimeout(el._gmT1); clearTimeout(el._gmT2); clearInterval(el._gmFala);
    el.classList.forEach((c) => { if (c.startsWith("gm-")) el.classList.remove(c); });
  }
  // a expressão em repouso é a do atributo data-expr (a que a página pediu)
  const base = (el) => el.dataset.expr || "padrao";

  function mover(el, nome, fim) {
    if (!el) return;
    if (nome === "falar") return falar(el);
    if (nome === "esperar") return;
    const ex = EXPR[nome];
    if (!ex) return;
    limpar(el);
    el.dataset.ocupado = "1";
    quadro(el, ex[0]);
    const terminar = () => {
      el.classList.remove("gm-" + nome);
      delete el.dataset.ocupado;
      if (fim !== undefined) { el.dataset.expr = fim; quadro(el, fim); }
      else if (nome === "chegar" || nome === "pensar" || nome === "dica") quadro(el, base(el));
    };
    if (ex[1]) el._gmT1 = setTimeout(() => quadro(el, ex[1]), reduz() ? 700 : DUR[nome] * 0.45);
    if (reduz()) { el._gmT2 = setTimeout(terminar, ex[1] ? 1400 : DUR[nome]); return; }
    void el.offsetWidth;
    el.classList.add("gm-" + nome);
    el._gmT2 = setTimeout(terminar, DUR[nome] + 80);
  }

  // falar: a duração acompanha o tamanho do texto (entre 0,9 e 2,6 s)
  function falar(el, texto) {
    if (!el) return;
    const alvo = texto || (el.parentElement && el.parentElement.querySelector(".balao, .tut-texto, figcaption, p"));
    const n = typeof alvo === "string" ? alvo.length : alvo ? alvo.textContent.length : 60;
    const ms = Math.max(900, Math.min(2600, n * 22));
    clearInterval(el._gmFala);
    if (reduz()) return;
    if (temQuadro(el, "falar")) {
      let k = 0;
      el.dataset.ocupado = "1";
      el._gmFala = setInterval(() => {
        k++;
        quadro(el, k % 2 ? "falar" : base(el));
        if (k * 150 >= ms) { clearInterval(el._gmFala); quadro(el, base(el)); delete el.dataset.ocupado; }
      }, 150);
    } else {
      el.classList.remove("gm-falando"); void el.offsetWidth; el.classList.add("gm-falando");
      clearTimeout(el._gmT2);
      el._gmT2 = setTimeout(() => el.classList.remove("gm-falando"), ms);
    }
  }

  // sequência: "chegar falar" roda um depois do outro
  function sequencia(el, lista) {
    const nomes = lista.split(/\s+/).filter(Boolean);
    let t = 0;
    nomes.forEach((nome) => {
      setTimeout(() => mover(el, nome), t);
      t += nome === "falar" ? 0 : (reduz() ? 0 : (DUR[nome] || 0) + 120);
    });
  }

  // roda data-mov quando o guia aparece na tela pela primeira vez
  const vistos = new WeakSet();
  const io = "IntersectionObserver" in window ? new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || vistos.has(e.target)) return;
    vistos.add(e.target);
    io.unobserve(e.target);
    sequencia(e.target, e.target.dataset.mov || "");
  }), { threshold: 0.4 }) : null;
  function observar(raiz) {
    (raiz || document).querySelectorAll(".mascote[data-mov], .retorno-guia[data-mov], .lab-tutor-rosto[data-mov]").forEach((el) => {
      if (el._gmObs) return;
      el._gmObs = true;
      if (io) io.observe(el); else sequencia(el, el.dataset.mov);
    });
  }
  if ("MutationObserver" in window) {
    let pend = 0;
    new MutationObserver(() => { cancelAnimationFrame(pend); pend = requestAnimationFrame(() => observar(document)); })
      .observe(document.documentElement, { childList: true, subtree: true });
  }

  // esperar: de tempos em tempos, um guia visível e parado pisca
  setInterval(() => {
    if (reduz() || document.hidden) return;
    const todos = [...document.querySelectorAll(".mascote, .retorno-guia, .lab-tutor-rosto, .pensa-guia")].filter((el) => !el.dataset.ocupado && el.offsetParent && el.firstElementChild && temQuadro(el, "piscar") && (el.dataset.quadro || base(el)) === "padrao");
    todos.forEach((el) => {
      if (Math.random() > 0.38) return;
      quadro(el, "piscar");
      setTimeout(() => { if (!el.dataset.ocupado) quadro(el, base(el)); }, 140);
    });
  }, 1700);

  window.GuiaMov = { mover, falar, quadro, observar, sequencia };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => observar(document));
  else observar(document);
})();
