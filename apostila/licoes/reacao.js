// Reação do guia ao resultado de cada exercício: feliz no acerto, pensativo no erro e explicando quando mostra a resposta.
// O movimento acompanha a resposta (doc 04, seção 11) e some com "reduzir movimento".
// Usa o guia escolhido no mapa (chave dominio:guia:v1) e os desenhos de personagens.js e mascote.js.
(function () {
  "use strict";
  const G = window.GUIAS || {};
  let id = "rin";
  try { const salvo = localStorage.getItem("dominio:guia:v1"); if (salvo && G[salvo]) id = salvo; } catch (e) { /* sem armazenamento */ }
  const guia = G[id] || G.rin;
  if (!guia) return;

  function decorar(r) {
    if (r.hidden) return;
    const ok = r.classList.contains("ok"), nao = r.classList.contains("nao"), revelado = r.classList.contains("revelado");
    if (!ok && !nao && !revelado) return;
    const expr = ok ? "feliz" : revelado ? "explica" : "pensa";
    const atual = r.querySelector(":scope > .retorno-guia");
    if (atual && atual.dataset.e === expr) return;
    if (atual) atual.remove();
    const mov = ok ? "acerto" : revelado ? "dica" : "erro";
    // com o motor de movimento (guia-mov.js), o guia se mexe; sem ele, fica o pulinho de antes
    const classe = window.GuiaMov ? "" : ok ? " comemora" : revelado ? "" : " pondera";
    r.insertAdjacentHTML("afterbegin", `<span class="retorno-guia${guia.id === "panda" ? "" : " retrato"}${classe}" data-e="${expr}" data-guia="${guia.id}" data-expr="${expr}" aria-hidden="true">${guia.expr[expr] || guia.expr.padrao}</span>`);
    if (window.GuiaMov) window.GuiaMov.mover(r.firstElementChild, mov, expr);
  }

  // no desafio (pergunta antes da leitura) e no "preveja antes de ver", o guia aparece pensando
  function pensativos(raiz) {
    (raiz || document).querySelectorAll(".exercicio.desafio > .pergunta, figure[data-preveja] .preveja > p").forEach((p) => {
      if (p.querySelector(".pensa-guia")) return;
      p.insertAdjacentHTML("afterbegin", `<span class="pensa-guia${guia.id === "panda" ? "" : " retrato"}" data-guia="${guia.id}" data-expr="pensa" aria-hidden="true">${guia.expr.pensa || guia.expr.padrao}</span>`);
      const el = p.firstElementChild;
      if (window.GuiaMov && "IntersectionObserver" in window) {
        const io = new IntersectionObserver((es) => { if (es[0].isIntersecting) { io.disconnect(); window.GuiaMov.mover(el, "pensar", "pensa"); } }, { threshold: 0.6 });
        io.observe(el);
      }
    });
  }

  function observar(raiz) {
    (raiz || document).querySelectorAll(".retorno").forEach((r) => {
      if (r.dataset.reage) return;
      r.dataset.reage = "1";
      new MutationObserver(() => decorar(r)).observe(r, { attributes: true, attributeFilter: ["class", "hidden"], childList: true });
      decorar(r);
    });
  }
  window.Reacao = { observar, pensativos };
  function iniciar() { observar(document); setTimeout(() => pensativos(document), 0); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();
