// Tema da apostila: "grafite" (o padrão, segue o claro ou escuro do aparelho) ou "impresso" (papel claro,
// duas tintas, grão de impressão e sombra deslocada). Carregado no <head> de toda página, antes do primeiro
// desenho, para a tela não piscar no tema errado. A escolha fica salva neste aparelho.
(function () {
  "use strict";
  var CHAVE = "dominio:tema:v1";
  var raiz = document.documentElement;
  // a página publicada como artefato não traz <html lang>: a língua fica marcada aqui, para leitores de tela
  if (!raiz.getAttribute("lang")) raiz.setAttribute("lang", "pt-BR");
  function aplicar(v) {
    if (v === "impresso") { raiz.setAttribute("data-tema", "impresso"); raiz.setAttribute("data-theme", "light"); }
    else { raiz.removeAttribute("data-tema"); raiz.removeAttribute("data-theme"); }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", v === "impresso" ? "#eceef2" : "#0d1017");
  }
  var salvo = null;
  try { salvo = localStorage.getItem(CHAVE); } catch (e) { /* sem armazenamento: fica o padrão */ }
  aplicar(salvo);
  window.Tema = {
    atual: function () { return raiz.getAttribute("data-tema") || "grafite"; },
    definir: function (v) {
      try { localStorage.setItem(CHAVE, v); } catch (e) { /* segue só nesta aba */ }
      aplicar(v);
      window.dispatchEvent(new CustomEvent("tema", { detail: v }));
    },
  };
  // a meta de cor pode vir depois deste script: reaplica quando a página terminar de montar
  document.addEventListener("DOMContentLoaded", function () { aplicar(window.Tema.atual() === "impresso" ? "impresso" : null); });
})();
