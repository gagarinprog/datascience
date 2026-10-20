// Reação do guia ao resultado de cada exercício: feliz no acerto, pensativo no erro.
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
    const ok = r.classList.contains("ok"), nao = r.classList.contains("nao");
    if (!ok && !nao) return;
    const expr = ok ? "feliz" : "pensa";
    const atual = r.querySelector(":scope > .retorno-guia");
    if (atual && atual.dataset.e === expr) return;
    if (atual) atual.remove();
    r.insertAdjacentHTML("afterbegin", `<span class="retorno-guia${guia.id === "panda" ? "" : " retrato"} ${ok ? "comemora" : "pondera"}" data-e="${expr}" aria-hidden="true">${guia.expr[expr] || guia.expr.padrao}</span>`);
  }

  function iniciar() {
    document.querySelectorAll(".retorno").forEach((r) => {
      new MutationObserver(() => decorar(r)).observe(r, { attributes: true, attributeFilter: ["class", "hidden"], childList: true });
      decorar(r);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();
