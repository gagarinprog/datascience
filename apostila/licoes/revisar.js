// Página "Revisão de hoje": busca na lição de origem cada exercício vencido e o apresenta de novo, um por vez.
// O agendamento (1, 3, 7, 14 e 30 dias) fica em Motor.Revisao, no aparelho.
(function () {
  "use strict";
  const M = window.Motor, R = M.Revisao, esc = M.esc;
  const palco = document.getElementById("r-palco"), contagem = document.getElementById("r-contagem"), barra = document.getElementById("r-barra");
  const fila = R.vencidos(12);
  const paginas = {};
  let i = 0, primeira = 0;
  const resultados = [];

  async function buscar(url) {
    if (!paginas[url]) paginas[url] = fetch(url).then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.text(); }).then((t) => new DOMParser().parseFromString(t, "text/html"));
    return paginas[url];
  }

  function vazio() {
    palco.innerHTML = `<div class="r-vazio"><h2>Nada para revisar hoje.</h2><p>Quando você errar um exercício numa lição, acertar só na segunda tentativa ou responder no chute, ele aparece aqui no dia seguinte.</p><p><a class="botao primario" href="../index.html#mapa">Voltar ao mapa</a></p></div>`;
    contagem.textContent = "";
  }

  function fim() {
    barra.style.width = "100%";
    const prox = Object.values(R.todos()).sort((a, b) => (a.proxima < b.proxima ? -1 : 1))[0];
    palco.innerHTML = `<div class="r-fim"><h2>Revisão concluída.</h2><p>Você acertou de primeira ${primeira} de ${resultados.length}.</p><ul>${resultados.map((r) => `<li>${esc(r.conceito)}: ${r.ok ? `volta em ${R.INTERVALOS[r.caixa]} ${R.INTERVALOS[r.caixa] === 1 ? "dia" : "dias"}` : "volta amanhã"}</li>`).join("")}</ul>${prox ? `<p>Próxima revisão: ${prox.proxima.split("-").reverse().join("/")}.</p>` : ""}<p><a class="botao primario" href="../index.html#mapa">Voltar ao mapa</a></p></div>`;
    contagem.textContent = "";
  }

  async function mostrar() {
    if (i >= fila.length) { fim(); return; }
    const c = fila[i];
    barra.style.width = `${(i / fila.length) * 100}%`;
    contagem.textContent = `Item ${i + 1} de ${fila.length}`;
    palco.innerHTML = `<p class="r-origem">Carregando o exercício...</p>`;
    let doc;
    try { doc = await buscar(c.url); } catch (e) {
      palco.innerHTML = `<div class="r-vazio"><p>Não consegui abrir a lição ${esc(c.licao)} agora. A revisão funciona pelo site, e sem internet depois que a lição foi aberta uma vez.</p><div class="r-acoes"><button type="button" class="botao primario" id="r-pular">Pular este</button></div></div>`;
      document.getElementById("r-pular").addEventListener("click", () => { i++; mostrar(); });
      return;
    }
    const sec = doc.getElementById(c.sec);
    const original = sec && [...sec.querySelectorAll(".exercicio")].find((e) => M.idDe(e) === c.id);
    if (!original) { R.remover(c.id); i++; mostrar(); return; }
    const ex = document.importNode(original, true);
    const rot = ex.querySelector(".rotulo");
    if (rot) rot.textContent = "Revisão: responda sem abrir a lição";
    palco.innerHTML = `<p class="r-origem">${esc(c.titulo || c.licao)} · ${esc(c.conceito || "")} · <a href="${esc(c.url)}#${esc(c.sec)}">abrir a lição</a></p>`;
    palco.appendChild(ex);
    palco.insertAdjacentHTML("beforeend", `<div class="r-acoes"><button type="button" class="botao primario" id="r-proximo" disabled>Próximo</button><span class="r-origem" id="r-estado"></span></div>`);
    const ctx = { licao: c.licao, titulo: c.titulo, url: c.url, sec: c.sec, conceito: c.conceito, resumo: M.resumoDe(sec),
      aoResolver: (e, r) => {
        const novo = R.daRevisao(c.id, r);
        const ok = r === "primeira";
        if (ok) primeira++;
        resultados.push({ conceito: c.conceito || c.licao, ok, caixa: novo ? novo.caixa : 0 });
        document.getElementById("r-estado").textContent = ok ? `Volta em ${R.INTERVALOS[novo.caixa]} dias.` : "Volta amanhã.";
        const b = document.getElementById("r-proximo");
        b.disabled = false; b.focus();
      } };
    M.montarExercicio(ex, ctx);
    if (window.Reacao) window.Reacao.observar(ex);
    document.getElementById("r-proximo").addEventListener("click", () => { i++; mostrar(); });
  }

  if (!fila.length) vazio(); else mostrar();
})();
