// A aula de um módulo que ainda não tem lição ilustrada (AULA.html#CÓDIGO, por exemplo AULA.html#LOG.04 ou
// AULA.html#LOG.04-c2 para abrir no conceito 2). Monta um conceito por seção, no mesmo formato das lições, e entrega
// ao motor (Motor.licao), que divide cada conceito em Entenda, Pratique e Avance.
// Com conteúdo escrito (conceitos-log.js e conceitos-py.js): a ideia, o desenho que anda por etapas (planta.js), o
// exemplo do dia a dia, o código que roda e o teste corrigido; no último conceito, o tropeço do módulo vira exercício.
// Sem conteúdo escrito ainda: o significado do termo (glossário) e para que o módulo serve, avisando que a aula
// completa está a caminho.
(function () {
  "use strict";
  const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const maiusc = (t) => (t ? t.charAt(0).toUpperCase() + t.slice(1) : "");
  const normal = (t) => String(t).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/["'`\s]/g, "");
  const MATERIAS = window.MATERIAS || [];
  const MODULO = {};
  MATERIAS.forEach((m) => m.modulos.forEach((mod, i) => { MODULO[mod.codigo] = { mod, materia: m, indice: i }; }));
  const TERMOS = (window.GLOSSARIO || []).map(([formas, def, en]) => ({ formas, def, en }));
  const termoDe = (texto) => { const t = normal(texto); return TERMOS.find((x) => x.formas.some((f) => normal(f).length >= 4 && t.includes(normal(f)))); };

  const [cod, conc] = decodeURIComponent(location.hash.replace("#", "")).split("-");
  window.addEventListener("hashchange", () => { if (decodeURIComponent(location.hash.replace("#", "")).split("-")[0] !== cod) location.reload(); });
  const coluna = document.getElementById("aula-gerada");
  const alvo = MODULO[cod];
  if (!alvo) {
    coluna.innerHTML = `<header class="bloco"><h1 class="titulo-pagina">Aula não encontrada</h1><p class="lede">Este endereço não aponta para um módulo do curso.</p><p><a class="botao primario" href="../index.html#mapa">Ir para o mapa</a></p></header>`;
    return;
  }
  const { mod, materia: m, indice } = alvo;
  const dados = (window.CONCEITOS || {})[cod] || null;
  document.title = `${mod.nome} · ${m.nome}`;
  const cab = coluna.querySelector("header.bloco");
  cab.querySelector(".sobretitulo").textContent = `${m.nome} · Módulo ${indice + 1} de ${m.modulos.length}`;
  cab.querySelector("h1").textContent = mod.nome;
  cab.querySelector(".lede").textContent = mod.dia;
  if (mod.dominio) cab.insertAdjacentHTML("beforeend", `<p class="simples"><b>Ao final, você consegue</b>${esc(mod.dominio)}.</p>`);

  const n = mod.conceitos.length;
  // o tropeço do módulo, do jeito errado e do jeito certo, vira a última pergunta da aula
  function itemTropeco(ev) {
    const lado = (k) => `<b>${esc(ev[k].titulo)}</b>${ev[k].codigo ? `<pre><code>${esc(ev[k].codigo)}</code></pre>` : `<br>${esc(ev[k].texto)}`}`;
    return window.Motor.criar({ f: "escolha", r: "O tropeço do módulo", p: "Qual destes dois jeitos está certo?", o: [[lado("certo"), true, `É o jeito que funciona. ${mod.tropeco || ""}`], [lado("errado"), false, `É o tropeço mais comum neste módulo. ${mod.tropeco || ""}`]] });
  }
  const secoes = mod.conceitos.map((nome, j) => {
    const d = dados && dados.ideias ? dados.ideias[j] : null;
    let corpo = "";
    if (d) {
      corpo += `<h3>A ideia</h3><p class="simples"><b>Em palavras simples</b>${esc(d.ideia)}</p>`;
      if (d.fig) corpo += `<figure class="pl-figura aula-fig" data-fig="${j}"></figure>`;
      if (d.dia) corpo += `<p class="cotidiano"><b>${esc(d.dia.titulo)}</b>${esc(d.dia.texto)}</p>`;
      if (d.codigo) corpo += `<h3>O comando em Python</h3><figure class="aula-fig" data-cod="${j}"></figure>`;
      if (d.teste) corpo += `<h3>Pratique</h3>${window.Motor.criar(Object.assign({ r: "Exercício" }, d.teste))}`;
      if (j === n - 1 && dados.evitar) corpo += `<h3>Para fechar: o tropeço do módulo</h3>${itemTropeco(dados.evitar)}`;
      if (d.r) corpo += `<p class="resumo"><b>Resumo em uma frase</b>${esc(maiusc(d.r))}.</p>`;
    } else {
      const t = termoDe(nome);
      corpo += `<h3>A ideia</h3><p class="simples"><b>Em palavras simples</b>${t ? `${esc(maiusc(t.formas[0]))}${t.en ? ` (em inglês, ${esc(t.en)})` : ""}: ${esc(t.def)}` : esc(mod.dia)}</p>`;
      corpo += `<p class="cotidiano aula-em-obra"><b>Aula em produção</b>A explicação completa deste conceito, com desenho, exemplo e exercícios, está sendo escrita. Por enquanto, leia o significado acima e siga.</p>`;
    }
    corpo += `<button class="botao" type="button" data-marcar="c${j + 1}" hidden>Marcar como estudado</button>`;
    return `<section class="secao" id="c${j + 1}"><p class="rotulo">Conceito ${j + 1} de ${n}</p><h2>${esc(maiusc(nome))}</h2>${corpo}</section>`;
  });
  coluna.insertAdjacentHTML("beforeend", secoes.join(""));
  // os desenhos que andam por etapas e o código que roda (o mesmo desenho das janelas de explicação)
  if (window.Planta && dados && dados.ideias) {
    coluna.querySelectorAll("[data-fig]").forEach((el) => window.Planta.montar(el, dados.ideias[Number(el.dataset.fig)].fig));
    coluna.querySelectorAll("[data-cod]").forEach((el) => { const c = dados.ideias[Number(el.dataset.cod)].codigo; window.Planta.montar(el, { t: "codigo", titulo: "em Python", linhas: c.linhas, saida: c.saida }); });
  }
  const k = conc && /^c\d+$/.test(conc) ? Number(conc.slice(1)) - 1 : null;
  window.Motor.licao({ chave: "dominio:licao:" + cod, trilha: m.sigla, nomes: mod.conceitos.map(maiusc), modulo: mod.nome, inicio: k });
})();
