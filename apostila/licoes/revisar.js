// Página "Revisão": busca na lição de origem cada exercício e o apresenta de novo, um por vez.
// Abre com o painel "Sua memória" (força de cada lembrança pelo FSRS e a calibragem da confiança) e uma ação principal:
// a revisão do dia ou, se nada vence hoje, o treino dos erros (os exercícios mais errados, vencidos ou não).
// O agendamento fica em Motor.Revisao (FSRS quando licoes/fsrs.js carrega; senão, 1, 3, 7, 14 e 30 dias).
(function () {
  "use strict";
  const M = window.Motor, R = M.Revisao, esc = M.esc;
  const palco = document.getElementById("r-palco"), contagem = document.getElementById("r-contagem"), barra = document.getElementById("r-barra");
  const paginas = {};
  const plural = (n, um, varios) => `${n} ${n === 1 ? um : varios}`;
  const dataBR = (iso) => iso.split("-").reverse().join("/");
  let fila = [], modo = "hoje", i = 0, primeira = 0, resultados = [];

  async function buscar(url) {
    if (!paginas[url]) paginas[url] = fetch(url).then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.text(); }).then((t) => new DOMParser().parseFromString(t, "text/html"));
    return paginas[url];
  }

  // calibragem: quando você diz "Certeza", acerta quanto? (os Certo ou Errado com confiança, em dominio:ce:v1)
  function calibragem() {
    const ce = Object.values(M.ls.ler("dominio:ce:v1", {}));
    const de = (conf) => { const l = ce.filter((x) => x.conf === conf); return { n: l.length, pct: l.length ? Math.round((l.filter((x) => x.acertou).length / l.length) * 100) : 0 }; };
    const cer = de("certeza"), chu = de("chute");
    if (cer.n < 3 && chu.n < 3) return "Responda alguns Certo ou Errado marcando a confiança, e aqui aparece o quanto ela bate com os acertos.";
    const partes = [];
    if (cer.n >= 3) partes.push(`Quando marca Certeza, você acerta ${cer.pct}% (${plural(cer.n, "resposta", "respostas")})${cer.pct < 80 ? ": a certeza está alta demais, vale reler antes de marcar." : ": a sua certeza é confiável."}`);
    if (chu.n >= 3) partes.push(`Nos chutes, acerta ${chu.pct}%${chu.pct >= 60 ? ": você sabe mais do que acha." : "."}`);
    return partes.join(" ");
  }

  function painel() {
    const vencem = R.vencidos(12), erros = R.erros(10), f = R.forca();
    const proxima = Object.values(R.todos()).filter((c) => c && c.proxima).sort((a, b) => (a.proxima < b.proxima ? -1 : 1))[0];
    const barraForca = f.total
      ? `<div class="r-forca" role="img" aria-label="${f.fragil} frágeis, ${f.formando} em formação, ${f.firme} firmes">${[["fragil", f.fragil], ["formando", f.formando], ["firme", f.firme]].map(([k, n]) => (n ? `<i class="${k}" style="flex:${n}"></i>` : "")).join("")}</div>
         <ul class="r-legenda"><li><i class="fragil"></i>${plural(f.fragil, "frágil", "frágeis")}</li><li><i class="formando"></i>${f.formando} em formação</li><li><i class="firme"></i>${plural(f.firme, "firme", "firmes")}</li></ul>`
      : `<p class="r-origem">Ainda não há lembranças guardadas. Elas nascem dos exercícios que você erra, acerta na segunda tentativa ou acerta no chute.</p>`;
    const acao = vencem.length
      ? `<button type="button" class="botao primario b-prog" data-iniciar="hoje" data-passo="${plural(vencem.length, "item", "itens")}" style="--p:0">Começar a revisão de hoje</button>`
      : erros.length
        ? `<button type="button" class="botao primario b-prog" data-iniciar="erros" data-passo="${plural(erros.length, "item", "itens")}" style="--p:0">Treinar meus erros</button>`
        : `<a class="botao primario" href="../index.html#mapa">Voltar ao mapa</a>`;
    const secundaria = vencem.length && erros.length ? `<button type="button" class="botao" data-iniciar="erros">Treinar meus erros (${erros.length})</button>` : "";
    palco.innerHTML = `<div class="r-painel">
        <h2>Sua memória</h2>
        <p class="r-origem">Cada exercício que voltou para a revisão é uma lembrança. A força dela cresce a cada acerto espaçado e cai quando você erra: é o que decide a data do próximo encontro.</p>
        ${barraForca}
        <h3>Sua confiança</h3>
        <p>${esc(calibragem())}</p>
      </div>
      <div class="r-agora">
        <p class="r-origem">${vencem.length ? `Hoje vencem ${plural(vencem.length, "item", "itens")}, intercalando as matérias.` : erros.length ? `Nada vence hoje${proxima ? ` (a próxima revisão é em ${dataBR(proxima.proxima)})` : ""}. Dá para treinar os exercícios que você mais errou.` : "Nada para revisar ainda. Quando você errar um exercício numa lição, ele aparece aqui no dia seguinte."}</p>
        <div class="r-acoes">${acao}${secundaria}</div>
      </div>`;
    contagem.textContent = "";
    barra.style.width = "0%";
    palco.querySelectorAll("[data-iniciar]").forEach((b) => b.addEventListener("click", () => iniciar(b.dataset.iniciar)));
  }

  function iniciar(qual) {
    modo = qual;
    fila = qual === "erros" ? R.erros(10) : R.vencidos(12);
    i = 0; primeira = 0; resultados = [];
    mostrar();
  }

  function fim() {
    barra.style.width = "100%";
    palco.innerHTML = `<div class="r-fim"><h2>${modo === "erros" ? "Treino de erros concluído." : "Revisão concluída."}</h2><p>Você acertou de primeira ${primeira} de ${resultados.length}.</p><ul>${resultados.map((r) => `<li>${esc(r.conceito)}: ${r.ok ? `volta em ${plural(r.dias, "dia", "dias")}` : "volta amanhã"}</li>`).join("")}</ul><div class="r-acoes"><button type="button" class="botao primario" data-painel>Ver sua memória</button><a class="botao" href="../index.html#mapa">Voltar ao mapa</a></div></div>`;
    palco.querySelector("[data-painel]").addEventListener("click", painel);
    contagem.textContent = "";
  }

  async function mostrar() {
    if (i >= fila.length) { fim(); return; }
    const c = fila[i];
    barra.style.width = `${(i / fila.length) * 100}%`;
    contagem.textContent = `${modo === "erros" ? "Treino de erros" : "Revisão de hoje"} · item ${i + 1} de ${fila.length}`;
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
    const chance = R.lembranca(c);
    palco.innerHTML = `<p class="r-origem">${esc(c.titulo || c.licao)} · ${esc(c.conceito || "")}${modo === "erros" ? ` · ${plural(c.erros || 0, "erro", "erros")} até aqui` : chance != null ? ` · chance estimada de lembrar hoje: ${Math.round(chance * 100)}%` : ""} · <a href="${esc(c.url)}#${esc(c.sec)}">abrir a lição</a></p>`;
    palco.appendChild(ex);
    palco.insertAdjacentHTML("beforeend", `<div class="r-acoes"><button type="button" class="botao primario b-prog" id="r-proximo" disabled data-passo="${i + 1} de ${fila.length}" style="--p:${(i + 1) / fila.length}">Próximo</button><span class="r-origem" id="r-estado" aria-live="polite"></span></div>`);
    const ctx = { licao: c.licao, titulo: c.titulo, url: c.url, sec: c.sec, conceito: c.conceito, resumo: M.resumoDe(sec),
      aoResolver: (e, r) => {
        const novo = R.daRevisao(c.id, r);
        const ok = r === "primeira";
        if (ok) primeira++;
        const dias = novo ? novo.intervalo || 1 : 1;
        resultados.push({ conceito: c.conceito || c.licao, ok, dias });
        document.getElementById("r-estado").textContent = ok ? `Volta em ${plural(dias, "dia", "dias")}.` : "Volta amanhã.";
        const b = document.getElementById("r-proximo");
        b.disabled = false; b.focus();
      } };
    M.montarExercicio(ex, ctx);
    if (window.Reacao) window.Reacao.observar(ex);
    document.getElementById("r-proximo").addEventListener("click", () => { i++; mostrar(); });
  }

  // ?modo=erros abre direto no treino de erros; ?modo=hoje, direto na revisão do dia
  const pedido = new URLSearchParams(location.search).get("modo");
  if (pedido === "erros" && R.erros(10).length) iniciar("erros");
  else if (pedido === "hoje" && R.vencidos(12).length) iniciar("hoje");
  else painel();
})();
