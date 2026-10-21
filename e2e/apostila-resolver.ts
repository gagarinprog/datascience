/**
 * Resolve um exercício da apostila como o aluno faria, lendo a resposta certa do próprio HTML (data-ok,
 * data-resposta, data-erro). Com errar = true, erra de propósito na primeira tentativa para conferir a dica e o
 * retorno. Roda dentro da página: é um texto de função, passado ao page.evaluate.
 */
export const RESOLVER = `async ([exId, errar]) => {
  const ex = document.querySelector(\`[data-vid="\${exId}"]\`);
  const clicar = (el) => { el.scrollIntoView({block: "center"}); el.click(); };
  const espera = (ms) => new Promise((r) => setTimeout(r, ms));
  const tipo = ["escolha","classificar","preencher","ordenar","ache"].find((t) => ex.hasAttribute("data-" + t));
  const log = [];
  const ret = () => { const r = ex.querySelector(".retorno"); return r && !r.hidden ? r.textContent.replace(/\\s+/g, " ").trim().slice(0, 140) : ""; };
  if (tipo === "escolha") {
    const bs = [...ex.querySelectorAll(".opcoes .botao")];
    const conf = ex.querySelector("[data-conf]"); if (conf) clicar(conf);
    const certo = bs.find((b) => b.hasAttribute("data-ok"));
    const errado = bs.find((b) => !b.hasAttribute("data-ok"));
    if (errar && errado && bs.length > 2) { clicar(errado); await espera(80); log.push("1a: " + ret()); }
    clicar(certo);
  } else if (tipo === "classificar") {
    const cat = ex.querySelector(".cat");
    const cartoes = [...cat.querySelectorAll(".cat-cartao")];
    const sels = [...ex.querySelectorAll(".linha-classifica select")];
    const grupos = [...cat.querySelectorAll(".cat-grupo")];
    const por = (c, certo) => { const resp = sels[Number(c.dataset.i)].dataset.resposta.split("|")[0]; const g = certo ? grupos.find((x) => x.dataset.alvo === resp) : grupos.find((x) => x.dataset.alvo !== resp); clicar(c); clicar(g.querySelector(".cat-nome")); };
    if (errar) { cartoes.forEach((c, k) => por(c, k > 0)); clicar(ex.querySelector("[data-verificar]")); await espera(400); log.push("1a: " + ret());
      cartoes.filter((c) => !c.classList.contains("travado")).forEach((c) => por(c, true)); }
    else cartoes.forEach((c) => por(c, true));
    await espera(350);
    clicar(ex.querySelector("[data-verificar]"));
  } else if (tipo === "preencher") {
    const campos = [...ex.querySelectorAll("[data-resposta]")];
    const por = (c, v) => { c.value = v; c.dispatchEvent(new Event("input", {bubbles: true})); c.dispatchEvent(new Event("change", {bubbles: true})); };
    if (errar) { campos.forEach((c) => { if (c.tagName === "SELECT") { const o = [...c.options].find((o) => o.value && !c.dataset.resposta.split("|").includes(o.value)); por(c, o ? o.value : ""); } else por(c, "zzz"); }); clicar(ex.querySelector("[data-verificar]")); await espera(80); log.push("1a: " + ret()); }
    campos.forEach((c) => { if (!c.readOnly) por(c, c.dataset.resposta.split("|")[0]); });
    clicar(ex.querySelector("[data-verificar]"));
  } else if (tipo === "ordenar") {
    const resp = ex.dataset.resposta.split("|").map((l) => ({ t: l.trim(), n: Math.floor(l.match(/^ */)[0].length / 4) }));
    const linhas = () => [...ex.querySelectorAll("[data-banco] .linha")];
    if (errar) { const l = linhas().find((x) => x.textContent.trim() === resp[resp.length - 1].t); clicar(l); clicar(ex.querySelector("[data-verificar]")); await espera(80); log.push("1a: " + ret());
      [...ex.querySelectorAll("[data-montagem] .linha")].forEach((x) => clicar(x)); }
    for (const r of resp) {
      const l = linhas().find((x) => x.textContent.trim() === r.t);
      if (!l) { log.push("linha não encontrada: " + r.t); continue; }
      clicar(l);
      const item = l.closest(".p-item");
      for (let k = 0; k < r.n; k++) clicar(item.querySelector('.p-recuo[data-d="1"]'));
    }
    clicar(ex.querySelector("[data-verificar]"));
  } else if (tipo === "ache") {
    const lis = [...ex.querySelectorAll(".ache-codigo li")];
    if (errar) { clicar(lis.find((l) => !l.hasAttribute("data-erro")).querySelector("button")); await espera(80); log.push("1a: " + ret()); }
    clicar(lis.find((l) => l.hasAttribute("data-erro")).querySelector("button"));
  } else log.push("tipo desconhecido");
  await espera(150);
  return { tipo, estado: ex.dataset.estado || "", retorno: ret(), log };
}`;
