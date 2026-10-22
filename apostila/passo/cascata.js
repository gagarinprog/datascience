// Cascata: as etapas de uma tela abrem no lugar, uma de cada vez, para não empilhar tudo numa rolagem só.
// Usada no Centro de Dados (cada módulo) e nas lições (cada conceito). O que já foi feito fecha numa linha
// de resumo; o que ainda não pode ser feito fica trancado. Cada corpo é montado na primeira vez que abre e
// nunca é refeito: o retorno, o gráfico e o código continuam lá quando a pessoa volta.
//
// const cx = Cascata(raiz)
//   cx.add({ id, rotulo, titulo, resumo, feito, trancado, largo, montar(it), nos })
//      montar recebe o item e preenche it.corpo; ou nos: elementos já existentes, movidos para dentro do corpo
//   cx.abrir(it, rolar)   cx.fechar(it)   cx.marcar(it, { feito, trancado, resumo })
//   cx.seguir(it, texto)  põe no fim do corpo um botão que abre a próxima etapa em aberto
(function () {
  "use strict";
  const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const reduz = () => !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  const ICONE = {
    feito: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>',
    trancado: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
    seta: '<svg class="cx-seta" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
    ir: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  };

  function Cascata(raiz, opcoes) {
    const o = opcoes || {}, itens = [];
    const c = {
      itens,
      add(d) {
        const it = Object.assign({ feito: false, trancado: false, aberto: false, montado: false }, d);
        const el = document.createElement("section");
        el.className = "cx-item" + (d.largo ? " cx-largo" : "") + (d.classe ? " " + d.classe : "");
        const idc = (o.prefixo || "") + d.id;
        el.innerHTML = `<h3 class="cx-h"><button type="button" class="cx-cab" id="cxb-${idc}" aria-expanded="false" aria-controls="cx-${idc}"><span class="cx-marca"></span><span class="cx-tit"><small>${esc(d.rotulo)}</small><span>${esc(d.titulo)}</span></span><span class="cx-resumo"></span>${ICONE.seta}</button></h3><div class="cx-corpo" id="cx-${idc}" role="region" aria-labelledby="cxb-${idc}" hidden></div>`;
        raiz.appendChild(el);
        it.el = el; it.cab = el.querySelector(".cx-cab"); it.corpo = el.querySelector(".cx-corpo"); it.n = itens.length + 1;
        if (d.nos) { d.nos.forEach((n) => it.corpo.appendChild(n)); it.montado = !d.montar; }
        it.cab.addEventListener("click", () => { if (it.aberto) c.fechar(it); else if (!it.trancado) c.abrir(it, false); });
        itens.push(it);
        c.marcar(it, {});
        return it;
      },
      abrir(it, rolar) {
        if (!it || it.trancado) return;
        itens.forEach((x) => { if (x !== it && x.aberto) c.fechar(x); });
        it.aberto = true; it.corpo.hidden = false; it.el.classList.add("aberto"); it.cab.setAttribute("aria-expanded", "true");
        if (!it.montado) { it.montado = true; it.montar(it); }
        if (rolar && it.el.scrollIntoView) it.el.scrollIntoView({ block: "start", behavior: reduz() ? "auto" : "smooth" });
        if (!reduz() && window.anime) window.anime.animate(it.corpo, { opacity: [0, 1], y: [-6, 0], duration: 320, ease: "outQuad" });
        if (o.aoAbrir) o.aoAbrir(it);
      },
      fechar(it) { it.aberto = false; it.corpo.hidden = true; it.el.classList.remove("aberto"); it.cab.setAttribute("aria-expanded", "false"); },
      marcar(it, m) {
        Object.assign(it, m);
        it.el.classList.toggle("feito", it.feito); it.el.classList.toggle("trancado", it.trancado);
        it.cab.setAttribute("aria-disabled", String(it.trancado));
        it.el.querySelector(".cx-marca").innerHTML = it.feito ? ICONE.feito : it.trancado ? ICONE.trancado : String(it.n);
        it.el.querySelector(".cx-resumo").textContent = it.trancado ? "abre depois da anterior" : it.resumo || "";
      },
      proxima(depois) { const i = itens.indexOf(depois); return itens.slice(i + 1).find((x) => !x.feito && !x.trancado) || itens.slice(i + 1).find((x) => !x.trancado); },
      seguir(it, texto, aoSeguir) {
        if (it.corpo.querySelector(":scope > .cx-seguir")) return;
        const prox = c.proxima(it);
        if (!prox && !aoSeguir) return;
        const b = document.createElement("button");
        b.type = "button"; b.className = "botao primario cx-seguir b-prog";
        const pos = itens.indexOf(it) + 1;
        b.style.setProperty("--p", pos / itens.length); b.dataset.passo = `etapa ${pos} de ${itens.length}`;
        // exercício e animação aparecem pelo tipo (o título deles pode adiantar a resposta); leitura, pelo título
        const nome = prox && (prox.tipo && prox.tipo !== "leitura" ? prox.rotulo : prox.titulo);
        b.innerHTML = `${esc(texto || (prox ? `Seguir: ${nome}` : "Pronto"))}${ICONE.ir}`;
        b.addEventListener("click", () => { if (aoSeguir) aoSeguir(); const p = c.proxima(it); if (p) c.abrir(p, true); });
        it.corpo.appendChild(b);
      },
    };
    return c;
  }
  Cascata.ICONE = ICONE;
  window.Cascata = Cascata;
})();
