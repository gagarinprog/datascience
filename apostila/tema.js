// Tema da apostila, escolhido no menu do guia e salvo neste aparelho. Carregado no <head> de toda página, antes do
// primeiro desenho, para a tela não piscar no tema errado.
//   planta   (o padrão desde 27/10/2026) azul técnico escuro, com a grade de projeto ao fundo
//   caderno  claro, papel quadriculado e tinta azul
//   terminal escuro, verde e âmbar, com as linhas de monitor
//   grafite  o anterior: segue o claro ou o escuro do aparelho
//   impresso papel claro, duas tintas, grão de impressão e sombra deslocada
(function () {
  "use strict";
  var CHAVE = "dominio:tema:v1";
  var raiz = document.documentElement;
  // a página publicada como artefato não traz <html lang>: a língua fica marcada aqui, para leitores de tela
  if (!raiz.getAttribute("lang")) raiz.setAttribute("lang", "pt-BR");
  var TEMAS = {
    planta: { modo: "dark", cor: "#08111f" },
    caderno: { modo: "light", cor: "#f5f3ec" },
    terminal: { modo: "dark", cor: "#0a0f0c" },
    grafite: { modo: "", cor: "#0d1017" },
    impresso: { modo: "light", cor: "#eceef2" },
  };
  var PADRAO = "planta";
  var valido = function (v) { return Object.prototype.hasOwnProperty.call(TEMAS, v) ? v : PADRAO; };
  function aplicar(v) {
    v = valido(v);
    var t = TEMAS[v];
    if (v === "grafite") raiz.removeAttribute("data-tema"); else raiz.setAttribute("data-tema", v);
    if (t.modo) raiz.setAttribute("data-theme", t.modo); else raiz.removeAttribute("data-theme");
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", t.cor);
  }
  var salvo = null;
  try { salvo = localStorage.getItem(CHAVE); } catch (e) { /* sem armazenamento: fica o padrão */ }
  aplicar(salvo);
  window.Tema = {
    LISTA: [
      { id: "planta", nome: "Planta", desc: "azul técnico com grade de projeto (padrão)" },
      { id: "caderno", nome: "Caderno", desc: "claro, papel quadriculado e tinta azul" },
      { id: "terminal", nome: "Terminal", desc: "escuro, verde e âmbar, linhas de monitor" },
      { id: "grafite", nome: "Grafite", desc: "claro ou escuro, como o aparelho" },
      { id: "impresso", nome: "Impresso", desc: "papel, duas tintas e grão" },
    ],
    atual: function () { return raiz.getAttribute("data-tema") || "grafite"; },
    definir: function (v) {
      v = valido(v);
      try { localStorage.setItem(CHAVE, v); } catch (e) { /* segue só nesta aba */ }
      aplicar(v);
      window.dispatchEvent(new CustomEvent("tema", { detail: v }));
    },
  };
  // a meta de cor pode vir depois deste script: reaplica quando a página terminar de montar
  document.addEventListener("DOMContentLoaded", function () { aplicar(window.Tema.atual()); });
})();
