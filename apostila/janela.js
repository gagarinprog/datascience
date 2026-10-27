// Janela de explicação: no celular, uma folha que sobe de baixo (arrastar a alça para baixo fecha); no computador,
// um painel ao lado. É um <dialog> modal: o foco fica dentro, Esc fecha e o foco volta ao botão que abriu.
// Uso: Janela.abrir({ origem (o botão que abriu, para onde o foco volta), rotulo, titulo, carimbo, abas: [{ id, nome, html, aoAbrir(el) }], acoes: [{ texto, classe, href, aoClicar(fechar) }], aoFechar })
(function () {
  "use strict";
  const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const reduz = () => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let seq = 0;

  function abrir(o) {
    const id = "jn-" + ++seq;
    const voltarFoco = o.origem || document.activeElement;
    const dlg = document.createElement("dialog");
    dlg.className = "jn";
    dlg.setAttribute("aria-labelledby", id + "-t");
    const abas = o.abas || [];
    dlg.innerHTML = `<div class="jn-corpo">
      <div class="jn-alca" aria-hidden="true"><i></i></div>
      <header class="jn-cab">
        <div class="jn-tit">${o.rotulo ? `<p class="jn-rotulo">${esc(o.rotulo)}</p>` : ""}<h2 id="${id}-t">${esc(o.titulo)}</h2></div>
        ${o.carimbo ? `<div class="jn-carimbo" aria-hidden="true">${o.carimbo}</div>` : ""}
        <button type="button" class="jn-fechar" aria-label="Fechar">&#x2715;</button>
      </header>
      ${abas.length > 1 ? `<div class="jn-abas" role="tablist" aria-label="Partes da explicação">${abas.map((a, i) => `<button type="button" role="tab" id="${id}-a${i}" aria-controls="${id}-p${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(a.nome)}</button>`).join("")}</div>` : ""}
      <div class="jn-paineis">${abas.map((a, i) => `<section class="jn-painel" id="${id}-p${i}" role="tabpanel" aria-labelledby="${id}-a${i}" tabindex="0"${i ? " hidden" : ""}>${a.html}</section>`).join("")}</div>
      ${o.acoes && o.acoes.length ? `<footer class="jn-acoes">${o.acoes.map((a, i) => a.href ? `<a class="botao ${a.classe || ""}" href="${esc(a.href)}" data-acao="${i}">${a.texto}</a>` : `<button type="button" class="botao ${a.classe || ""}" data-acao="${i}">${a.texto}</button>`).join("")}</footer>` : ""}
    </div>`;
    document.body.appendChild(dlg);
    const montadas = new Set();
    const ativar = (i, focar) => {
      dlg.querySelectorAll('[role="tab"]').forEach((t, j) => { t.setAttribute("aria-selected", String(j === i)); t.tabIndex = j === i ? 0 : -1; if (j === i && focar) t.focus(); });
      dlg.querySelectorAll(".jn-painel").forEach((p, j) => { p.hidden = j !== i; });
      const p = dlg.querySelectorAll(".jn-painel")[i];
      if (abas[i] && abas[i].aoAbrir && !montadas.has(i)) { montadas.add(i); abas[i].aoAbrir(p); }
      p.scrollTop = 0;
    };
    const tabs = [...dlg.querySelectorAll('[role="tab"]')];
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => ativar(i));
      t.addEventListener("keydown", (e) => {
        const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (e.key === "Home") { e.preventDefault(); ativar(0, true); }
        else if (e.key === "End") { e.preventDefault(); ativar(tabs.length - 1, true); }
        else if (d) { e.preventDefault(); ativar((i + d + tabs.length) % tabs.length, true); }
      });
    });
    let fechado = false;
    const fechar = () => {
      if (fechado) return;
      fechado = true;
      const fim = () => { dlg.close(); dlg.remove(); if (voltarFoco && voltarFoco.focus) voltarFoco.focus({ preventScroll: true }); if (o.aoFechar) o.aoFechar(); };
      if (reduz()) fim();
      else { dlg.classList.add("saindo"); setTimeout(fim, 180); }
    };
    dlg.querySelector(".jn-fechar").addEventListener("click", fechar);
    dlg.addEventListener("cancel", (e) => { e.preventDefault(); fechar(); });
    // tocar fora do conteúdo (no véu) fecha
    dlg.addEventListener("click", (e) => { if (e.target === dlg) fechar(); });
    (o.acoes || []).forEach((a, i) => {
      const b = dlg.querySelector(`[data-acao="${i}"]`);
      if (b && a.aoClicar) b.addEventListener("click", (e) => a.aoClicar(fechar, b, e));
    });
    // arrastar a alça para baixo fecha a folha (celular)
    const alca = dlg.querySelector(".jn-alca"), corpo = dlg.querySelector(".jn-corpo");
    let y0 = null;
    alca.addEventListener("pointerdown", (e) => { y0 = e.clientY; alca.setPointerCapture(e.pointerId); });
    alca.addEventListener("pointermove", (e) => { if (y0 == null) return; const d = Math.max(0, e.clientY - y0); corpo.style.transform = d ? `translateY(${d}px)` : ""; });
    const soltar = (e) => { if (y0 == null) return; const d = e.clientY - y0; y0 = null; corpo.style.transform = ""; if (d > 90) fechar(); };
    alca.addEventListener("pointerup", soltar);
    alca.addEventListener("pointercancel", soltar);
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
    ativar(0);
    const primeiro = dlg.querySelector('[role="tab"]') || dlg.querySelector(".jn-fechar");
    primeiro.focus({ preventScroll: true });
    return { el: dlg, fechar, ativar };
  }

  window.Janela = { abrir };
})();
