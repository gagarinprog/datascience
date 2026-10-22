// Baixar o curso inteiro para estudar sem internet.
// As páginas, lições e bibliotecas pequenas já entram no aparelho quando o app é instalado (sw.js). O Python
// (Pyodide com pandas, numpy e matplotlib) e o PostgreSQL do laboratório (PGlite) são grandes e, sem isto, só
// ficariam guardados no primeiro uso. Aqui eles são carregados de propósito, com o app controlado pelo service
// worker, que guarda cada arquivo pedido. No fim, confere no cache se as peças grandes ficaram.
// O registro fica fora do prefixo "dominio:" porque vale só para este aparelho (o trajeto leva tudo com o prefixo).
(function () {
  const PGLITE = "https://cdn.jsdelivr.net/npm/@electric-sql/pglite@0.5.8/dist/index.js";
  const PYODIDE = "https://cdn.jsdelivr.net/pyodide/v314.0.7/full/";
  const CHAVE = "offline-dominio:v1";

  const ETAPAS = [
    { id: "site", nome: "Páginas, lições, animações e exercícios" },
    { id: "python", nome: "Python com pandas, numpy e matplotlib" },
    { id: "postgres", nome: "PostgreSQL do Centro de Dados" },
    { id: "conferir", nome: "Conferir o que ficou no aparelho" },
  ];

  const comPrazo = (promessa, ms, msg) => Promise.race([promessa, new Promise((_, erro) => setTimeout(() => erro(new Error(msg)), ms))]);

  async function controlador() {
    if (!("serviceWorker" in navigator) || !window.caches) throw new Error("Este navegador não guarda o site para uso sem internet. Use o Chrome, o Edge ou o Safari atualizados.");
    if (!navigator.serviceWorker.controller) {
      await comPrazo(navigator.serviceWorker.ready, 20000, "O app ainda está se instalando. Recarregue a página e toque em Baixar de novo.");
      if (!navigator.serviceWorker.controller) throw new Error("O app acabou de se instalar. Recarregue a página e toque em Baixar de novo.");
    }
    return navigator.serviceWorker.controller;
  }

  // o service worker confere cada arquivo do site e baixa o que faltar
  function site(sw) {
    return comPrazo(new Promise((ok, erro) => {
      const canal = new MessageChannel();
      canal.port1.onmessage = (e) => (e.data && e.data.falhas && e.data.falhas.length ? erro(new Error(`${e.data.falhas.length} arquivo(s) não baixaram. Confira a internet e tente de novo.`)) : ok(e.data));
      sw.postMessage({ tipo: "conferir" }, [canal.port2]);
    }), 180000, "O site demorou demais para baixar. Confira a internet e tente de novo.");
  }

  // carrega o Python no mesmo worker das lições, com os pacotes que o curso usa
  function python() {
    return comPrazo(new Promise((ok, erro) => {
      const base = document.querySelector('script[src$="offline.js"]').src.replace(/offline\.js.*$/, "");
      const w = new Worker(base + "licoes/python-worker.js", { type: "module" });
      w.onmessage = (e) => { w.terminate(); if (e.data && e.data.falhou) erro(new Error("O Python não baixou: " + e.data.falhou)); else ok(); };
      w.onerror = () => { w.terminate(); erro(new Error("O Python não baixou. Confira a internet e tente de novo.")); };
      w.postMessage({ id: 1, tipo: "preparar", pacotes: ["pandas", "numpy", "matplotlib"] });
    }), 600000, "O Python demorou demais para baixar. Numa rede lenta, tente de novo: o que já veio fica guardado.");
  }

  async function postgres() {
    const m = await comPrazo(import(PGLITE), 300000, "O PostgreSQL demorou demais para baixar.");
    const db = await m.PGlite.create(); // em memória: só para buscar os arquivos; o banco do laboratório não é tocado
    await db.query("SELECT 1");
    await db.close();
  }

  async function guardados() {
    const urls = [];
    for (const nome of await caches.keys()) {
      const c = await caches.open(nome);
      (await c.keys()).forEach((r) => urls.push(r.url));
    }
    return urls;
  }
  async function conferir() {
    const urls = await guardados();
    const tem = (teste) => urls.some(teste);
    const faltam = [];
    if (!tem((u) => u === PYODIDE + "pyodide.asm.wasm")) faltam.push("o Python");
    if (!tem((u) => u.startsWith(PYODIDE) && /pandas-.*\.whl$/.test(u))) faltam.push("o pandas");
    if (!tem((u) => u.startsWith(PYODIDE) && /matplotlib-.*\.whl$/.test(u))) faltam.push("o matplotlib");
    if (!tem((u) => /pglite/.test(u) && /\.wasm$/.test(u))) faltam.push("o PostgreSQL");
    if (faltam.length) throw new Error(`Baixou, mas o aparelho não guardou ${faltam.join(", ")}. Tente de novo; se repetir, o navegador pode estar sem espaço.`);
    return urls.length;
  }

  async function baixarTudo(aviso) {
    const avisar = (id, estado, texto) => { try { aviso(id, estado, texto); } catch (e) { /* a tela de progresso é opcional */ } };
    if (navigator.storage && navigator.storage.persist) { try { await navigator.storage.persist(); } catch (e) { /* o navegador decide */ } }
    let sw;
    try { sw = await controlador(); } catch (e) { avisar("site", "falhou", e.message); return false; }
    const passos = { site: () => site(sw), python, postgres, conferir };
    for (const etapa of ETAPAS) {
      avisar(etapa.id, "andamento");
      try {
        const r = await passos[etapa.id]();
        avisar(etapa.id, "ok", etapa.id === "conferir" ? `${r} arquivos guardados neste aparelho.` : "");
      } catch (e) {
        avisar(etapa.id, "falhou", e.message);
        return false;
      }
    }
    try { localStorage.setItem(CHAVE, JSON.stringify({ em: new Date().toISOString().slice(0, 10) })); } catch (e) { /* sem armazenamento */ }
    return true;
  }

  const ultimo = () => { try { return (JSON.parse(localStorage.getItem(CHAVE) || "null") || {}).em || ""; } catch (e) { return ""; } };

  // só no site (ou no app instalado): dentro do artefato do Claude a página roda num quadro, sem service worker
  const disponivel = () => "serviceWorker" in navigator && !!window.caches && window.self === window.top && (location.protocol === "https:" || location.hostname === "localhost");

  window.Offline = { ETAPAS, baixarTudo, ultimo, disponivel };
})();
