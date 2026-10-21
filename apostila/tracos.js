// Traço dos guias: os mesmos nove guias em três traços, à escolha no seletor de guia (e na galeria).
//   manga     Lorelei, de Lisa Wischofsky (CC0), em avatares-manga.js; tem os quadros piscar e falar
//   anime     os desenhos feitos para o projeto, em personagens.js
//   aventura  Adventurer, de Lisa Wischofsky (CC BY 4.0), em avatares.js (o traço escolhido em 21/10/2026)
// Carregar depois de personagens.js, avatares.js e avatares-manga.js. A escolha fica no aparelho (dominio:traco:v1)
// e vale para todas as páginas: cada guia passa a ter expr igual ao conjunto do traço escolhido.
(function () {
  "use strict";
  const CHAVE = "dominio:traco:v1";
  const LISTA = [
    { id: "manga", nome: "Mangá", desc: "linha preta e cor chapada", credito: "Lorelei · Lisa Wischofsky · CC0" },
    { id: "anime", nome: "Anime próprio", desc: "desenho do projeto, com corpo", credito: "desenho do projeto" },
    { id: "aventura", nome: "Aventura", desc: "rosto redondo, cores fortes", credito: "Adventurer · Lisa Wischofsky · CC BY 4.0" },
  ];
  const PADRAO = "aventura";
  const G = window.GUIAS || {};
  // guarda os três conjuntos de cada guia antes de escolher (avatares.js já pôs o Adventurer em expr)
  Object.keys(G).forEach((id) => {
    const g = G[id];
    if (id === "panda" || g.tracos) return;
    g.tracos = { aventura: g.expr, anime: g.exprAnime || g.expr, manga: g.exprManga || g.expr };
  });
  function ler() { try { const v = localStorage.getItem(CHAVE); return LISTA.some((t) => t.id === v) ? v : PADRAO; } catch (e) { return PADRAO; } }
  let atual = ler();
  function aplicar(id) {
    Object.keys(G).forEach((k) => {
      const g = G[k];
      if (!g.tracos) return;
      g.expr = g.tracos[id] || g.tracos.aventura;
      g.estilo = id;
    });
    if (document.documentElement) document.documentElement.dataset.traco = id;
  }
  aplicar(atual);
  window.Tracos = {
    LISTA,
    atual: () => atual,
    definir(id) {
      if (!LISTA.some((t) => t.id === id)) return;
      atual = id;
      try { localStorage.setItem(CHAVE, id); } catch (e) { /* sem armazenamento: vale só nesta visita */ }
      aplicar(id);
    },
    // o traço com corpo inteiro (anime) usa a moldura alta; os rostos usam a quadrada
    alto: () => atual === "anime",
  };
})();
