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
    // "preveja antes de ver": data-preveja="Pergunta|opção|*opção certa|opção" trava a animação até a aposta
    const prev = fig.dataset.preveja ? fig.dataset.preveja.split("|") : null;
    let aposta = null, julgado = false;
    if (prev) {
      const ops = prev.slice(1).map((o) => ({ t: o.replace(/^\*/, ""), ok: o.startsWith("*") }));
      fig.insertAdjacentHTML("afterbegin", `<div class="preveja"><p>Antes de ver: ${esc(prev[0])}</p><div class="opcoes">${ops.map((o, i) => `<button type="button" class="botao" data-aposta="${i}">${esc(o.t)}</button>`).join("")}</div><p class="preveja-veredito" aria-live="polite"></p></div>`);
      fig.querySelectorAll("[data-aposta]").forEach((b) => b.addEventListener("click", () => {
        if (aposta !== null) return;
        aposta = ops[Number(b.dataset.aposta)];
        fig.querySelectorAll("[data-aposta]").forEach((x) => { x.disabled = true; x.setAttribute("aria-pressed", String(x === b)); });
        fig.querySelector(".preveja-veredito").textContent = `Sua aposta: ${aposta.t}. Agora veja a animação até o fim.`;
        fig.querySelectorAll(".clip-controles button").forEach((x) => { x.disabled = false; });
        ir(0); tocar();
      }));
    }
    function julgar() {
      if (!prev || aposta === null || julgado) return;
      julgado = true;
      const certa = prev.slice(1).find((o) => o.startsWith("*")).slice(1);
      const v = fig.querySelector(".preveja-veredito");
      v.className = "preveja-veredito " + (aposta.ok ? "ok" : "nao");
      v.textContent = aposta.ok ? `Você previu certo: ${certa}.` : `A resposta era: ${certa}. Compare com a sua aposta e veja na animação onde ela muda.`;
      fig.querySelectorAll("[data-aposta]").forEach((x) => { if (x.textContent === certa) x.classList.add("certo"); else if (x.getAttribute("aria-pressed") === "true") x.classList.add("errado"); });
    }
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
      bProx.classList.add("b-prog"); bProx.style.setProperty("--p", (k + 1) / n); bProx.dataset.passo = `${k + 1} de ${n}`;
      if (k >= n - 1 && tocando) { clearTimeout(t); tocando = false; }
      if (k >= n - 1) julgar();
      rotulo();
      if (prev && aposta === null) fig.querySelectorAll(".clip-controles button").forEach((x) => { x.disabled = true; });
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
        if (e.isIntersecting && !jaTocou && !reduz() && fig.offsetParent !== null && !(prev && aposta === null)) { jaTocou = true; setTimeout(() => { if (i === 0 && !tocando) tocar(); }, 500); }
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
        <ol class="exec-codigo">${o.codigo.map((c, k) => `<li data-l="${k}"${/^\s*#/.test(c) ? ' class="coment"' : ""}><span class="n">${k + 1}</span><code>${esc(c)}</code></li>`).join("")}</ol>
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

  // ---------- molde: tabela que revela uma linha por passo ----------
  // o: { titulo, colunas:[html], linhas:[{ celulas:[html], tom?: "ok" | "erro" }], passos:[[legenda, ms]] }
  // o passo k mostra as linhas 1..k (o passo 0 apresenta a tabela vazia); as células aceitam <code>.
  function tabela(o) {
    return {
      titulo: o.titulo,
      passos: o.passos,
      html: () => `<table class="conv"><thead><tr>${o.colunas.map((c) => `<th>${c}</th>`).join("")}</tr></thead><tbody>${o.linhas.map((l, i) => `<tr data-q="${i + 1}" class="${l.tom || ""}">${l.celulas.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table>`,
      aplicar(p, k) {
        p.querySelectorAll("tr[data-q]").forEach((tr) => { const q = Number(tr.dataset.q); tr.classList.toggle("ver", q <= k); tr.classList.toggle("agora", q === k); });
      },
    };
  }

  // ---------- molde: expressão que encolhe uma operação por vez ----------
  // o: { titulo, etapas:[{ exp, foco, l, ms? }], ordem?: [rótulos] } — foco = trecho destacado (o próximo a ser resolvido)
  function reducao(o) {
    return {
      titulo: o.titulo,
      passos: o.etapas.map((e) => [e.l, e.ms || 4200]),
      html: () => `<div class="pr"><p class="pr-exp"><code></code></p>${o.ordem ? `<ol class="pr-ordem">${o.ordem.map((r) => `<li>${esc(r)}</li>`).join("")}</ol>` : ""}</div>`,
      aplicar(p, k) {
        const e = o.etapas[k], code = p.querySelector(".pr-exp code");
        const html = e.foco ? esc(e.exp).replace(esc(e.foco), `<mark>${esc(e.foco)}</mark>`) : `<b>${esc(e.exp)}</b>`;
        if (code.innerHTML !== html) { code.innerHTML = html; code.classList.remove("troca"); void code.offsetWidth; code.classList.add("troca"); }
        p.querySelectorAll(".pr-ordem li").forEach((li, j) => { li.classList.toggle("feito", j < k); li.classList.toggle("agora", j === k); });
      },
    };
  }

  // ---------- molde: antes e depois (o mesmo trecho em versões) ----------
  // o: { titulo, rotulos:[antes, depois], versoes:[html com <mark> no que mudou], passos:[[legenda, versao, ms]] }
  function antesDepois(o) {
    const ult = o.versoes.length - 1;
    return {
      titulo: o.titulo,
      passos: o.passos.map((s) => [s[0], s[2]]),
      html: () => `<div class="pep"><div class="pep-rotulo" aria-hidden="true"><span class="p-ant">${esc(o.rotulos[0])}</span><span class="p-dep">${esc(o.rotulos[1])}</span></div><pre class="pep-cod"><code></code></pre></div>`,
      aplicar(p, k) {
        const v = o.passos[k][1], code = p.querySelector(".pep-cod code");
        if (code.dataset.v !== String(v)) { code.dataset.v = String(v); code.innerHTML = o.versoes[v]; code.classList.remove("troca"); void code.offsetWidth; code.classList.add("troca"); }
        p.querySelector(".p-ant").classList.toggle("on", v === 0);
        p.querySelector(".p-dep").classList.toggle("on", v === ult);
        p.querySelector(".pep").classList.toggle("pronto", v === ult);
      },
    };
  }

  // ---------- molde: itens que vão para gavetas (classificar) ----------
  // o: { titulo, gavetas:[{ id, nome, desc }], itens:[{ t, g }], passos:[[legenda, ms]] } — o passo k guarda os itens das k primeiras gavetas
  function gavetas(o) {
    return {
      titulo: o.titulo,
      passos: o.passos,
      html: () => `<div class="tp"><div class="tp-banco">${o.itens.map((it, i) => `<span class="tp-v" data-i="${i}" data-t="${esc(it.g)}">${esc(it.t)}</span>`).join("")}</div>
        <div class="tp-gavetas">${o.gavetas.map((g) => `<div class="tp-g" data-t="${esc(g.id)}"><b>${esc(g.nome)}</b><small>${esc(g.desc || "")}</small><div class="tp-itens"></div></div>`).join("")}</div></div>`,
      aplicar(p, k) {
        const ordem = o.gavetas.map((g) => g.id), vs = [...p.querySelectorAll(".tp-v")];
        flip(vs, () => vs.forEach((v) => {
          const dentro = ordem.indexOf(v.dataset.t) < k;
          const alvo = dentro ? [...p.querySelectorAll(".tp-g")].find((g) => g.dataset.t === v.dataset.t).querySelector(".tp-itens") : p.querySelector(".tp-banco");
          if (v.parentElement !== alvo) alvo.appendChild(v);
        }));
        p.querySelectorAll(".tp-g").forEach((g) => g.classList.toggle("ativa", ordem.indexOf(g.dataset.t) === k - 1));
      },
    };
  }

  // ---------- molde: barras que crescem, com destaque e linha da média ----------
  // o: { titulo, dados:[{ rotulo, valor }], unidade?, passos:[{ l, ver, destaque?:[índices], media?:bool, ms? }] }
  function barras(o) {
    const max = Math.max(...o.dados.map((d) => d.valor)) * 1.1;
    const media = o.dados.reduce((a, d) => a + d.valor, 0) / o.dados.length;
    const fmt = (n) => (Math.round(n * 10) / 10).toString().replace(".", ",");
    return {
      titulo: o.titulo,
      passos: o.passos.map((s) => [s.l, s.ms || 4000]),
      html: () => `<div class="mb"><div class="mb-area">${o.dados.map((d, i) => `<div class="mb-col" data-i="${i}"><span class="mb-val">${fmt(d.valor)}${o.unidade || ""}</span><span class="mb-barra" style="--h:${(d.valor / max) * 100}%"></span><small>${esc(d.rotulo)}</small></div>`).join("")}
        <div class="mb-media" style="bottom:${(media / max) * 194}px"></div></div><p class="mb-leg">Linha tracejada: média de ${fmt(media)}${o.unidade || ""}</p></div>`,
      aplicar(p, k) {
        const s = o.passos[k];
        p.querySelectorAll(".mb-col").forEach((c, i) => { c.classList.toggle("ver", i < s.ver); c.classList.toggle("destaque", !!(s.destaque && s.destaque.includes(i))); });
        p.querySelector(".mb-media").classList.toggle("ver", !!s.media);
        p.querySelector(".mb-leg").classList.toggle("ver", !!s.media);
      },
    };
  }

  window.Clip = { tituloDe: (id) => (defs[id] && defs[id].titulo) || "", registrar, iniciar, flip, fluxo, execucao, tabela, reducao, antesDepois, gavetas, barras, esc, reduz };
})();
