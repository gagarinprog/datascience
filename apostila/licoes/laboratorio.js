// "Faça no Python": o exercício em que você escreve o comando e vê a tabela mudar enquanto digita.
// O motor das lições (motor.js) chama Laboratorio.exercicio para cada .exercicio[data-codigo]. O Python roda em
// python-worker.js (Pyodide num Web Worker), com tempo limite: um laço sem fim não trava a página.
//
// <div class="exercicio" data-codigo data-pacotes="pandas" data-base="df" data-ver="aprovados n">
//   <p class="pergunta">...</p>
//   <div class="como-se-faz">o comando desta tarefa, com as partes explicadas (HTML do autor)</div>
//   <template data-preparo>código que monta os dados (não aparece no editor)</template>
//   <template data-inicial>o começo do código, com a lacuna</template>
//   <template data-solucao>a solução</template>
//   <template data-testes>assert ..., "mensagem em português"</template>
//   <template data-dica>dica 1</template> <template data-dica>dica 2</template>   (em degraus)
//   <div class="retorno" hidden data-ok-texto="..."></div>
// </div>
// Opções: data-base (a tabela mostrada em "Os dados"; as linhas que ficam no resultado se destacam), data-ver
// (variáveis mostradas em "Resultado"), data-vars (tabela de variáveis), data-rastro (com data-vars: o teste de mesa,
// uma linha por instrução executada, só com o que mudou), data-repl (mostra o valor
// da última linha, como no REPL), data-entradas="20|8.5" (o que o input() recebe), data-pacotes="pandas".
(function () {
  "use strict";
  const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const ATRASO = 450, LIMITE = 6000;
  const base = (document.currentScript && document.currentScript.src) ? document.currentScript.src.replace(/[^/]*$/, "") : "";

  // ---------- o Python: um worker, reiniciado se um código passar do tempo ----------
  let worker = null, seq = 0, pronto = false, carregando = null;
  const espera = new Map();
  const ouvintes = new Set();
  function novoWorker() {
    worker = new Worker(base + "python-worker.js", { type: "module" });
    worker.onmessage = (ev) => { const r = ev.data, f = espera.get(r.id); if (f) { espera.delete(r.id); f(r); } };
    worker.onerror = () => { espera.forEach((f) => f({ falhou: "O Python não carregou. Confira a internet: na primeira vez ele vem da rede, depois fica no aparelho." })); espera.clear(); };
  }
  function pedir(msg, limite) {
    if (!worker) novoWorker();
    const id = ++seq;
    return new Promise((ok) => {
      let t = 0;
      espera.set(id, (r) => { clearTimeout(t); ok(r); });
      if (limite) t = setTimeout(() => {
        // passou do tempo: encerra este worker (o Python carrega de novo, já guardado no aparelho)
        espera.delete(id);
        worker.terminate(); worker = null; pronto = false; carregando = null; carregados.clear();
        ouvintes.forEach((f) => f("reiniciando"));
        ok({ demorou: true });
      }, limite);
      worker.postMessage(Object.assign({ id }, msg));
    });
  }
  const carregados = new Set();
  function preparar(pacotes) {
    if (pronto && pacotes.every((p) => carregados.has(p))) return Promise.resolve(true);
    // um carregamento por vez; quem chega no meio espera o atual e confere de novo
    if (carregando) return carregando.then(() => preparar(pacotes));
    ouvintes.forEach((f) => f("carregando"));
    carregando = pedir({ tipo: "preparar", pacotes }, 0).then((r) => {
      carregando = null;
      if (r.pronto) { pronto = true; pacotes.forEach((p) => carregados.add(p)); ouvintes.forEach((f) => f("pronto")); return true; }
      ouvintes.forEach((f) => f("falhou", r.falhou));
      return false;
    });
    return carregando;
  }
  async function rodar(opcoes) {
    const ok = await preparar(opcoes.pacotes || []);
    if (!ok) return { falhou: "O Python não carregou. Confira a internet: na primeira vez ele vem da rede, depois fica no aparelho." };
    return pedir(opcoes, LIMITE);
  }

  // ---------- erros do Python em português ----------
  function erroPython(msg) {
    const ultima = String(msg || "").trim().split("\n").filter(Boolean).pop() || "";
    const linha = (String(msg).match(/line (\d+)/g) || []).pop();
    const onde = linha ? ` (linha ${linha.replace(/\D/g, "")})` : "";
    let m;
    if ((m = ultima.match(/^AssertionError: (.*)$/))) return { teste: true, texto: m[1] };
    if (/^AssertionError/.test(ultima)) return { teste: true, texto: "O resultado ainda não é o pedido." };
    if ((m = ultima.match(/^NameError: name '([^']+)' is not defined/))) return { texto: `O nome ${m[1]} não existe${onde}. Ele foi criado antes de ser usado? Confira a grafia, maiúsculas e minúsculas.` };
    if (/^IndentationError/.test(ultima)) return { texto: `Erro de recuo${onde}: as linhas de um bloco (depois de dois-pontos) começam com 4 espaços.` };
    if (/unterminated string literal|EOL while scanning/.test(ultima)) return { texto: `Aspas abertas e não fechadas${onde}. Todo texto começa e termina com aspas iguais: "assim".` };
    if (/was never closed|unexpected EOF/.test(ultima)) return { texto: `Parêntese ou colchete aberto e não fechado${onde}. Conte quantos abrem e quantos fecham.` };
    if (/^SyntaxError: invalid syntax/.test(ultima)) return { texto: `Falta completar alguma parte${onde}, ou há um sinal sobrando. Confira a lacuna, os parênteses e as aspas.` };
    if ((m = ultima.match(/^SyntaxError: (.*)$/))) return { texto: `O Python não entendeu a escrita${onde}: ${m[1]}. Confira dois-pontos, parênteses e aspas.` };
    if ((m = ultima.match(/^KeyError: '?([^']*)'?/))) return { texto: `A coluna ${m[1]} não existe nesta tabela${onde}. Os nomes das colunas estão em "Os dados", em minúsculas e sem acento.` };
    if ((m = ultima.match(/can only concatenate str \(not "(\w+)"\) to str/))) return { texto: `Texto só se junta com texto${onde}: converta o número com str() ou use vírgula no print.` };
    if ((m = ultima.match(/^TypeError: (.*)$/))) return { texto: `Tipos que não combinam${onde}: ${m[1]}.` };
    if ((m = ultima.match(/^ValueError: invalid literal for int\(\) with base 10: (.*)$/))) return { texto: `int() não converte ${m[1]}${onde}: só aceita texto com um número inteiro.` };
    if ((m = ultima.match(/^ValueError: (.*)$/))) return { texto: `Valor que não serve${onde}: ${m[1]}.` };
    if (/^ZeroDivisionError/.test(ultima)) return { texto: `Divisão por zero${onde}.` };
    if ((m = ultima.match(/^AttributeError: (.*)$/))) return { texto: `Esse comando não existe para esse valor${onde}: ${m[1]}. Confira a grafia depois do ponto.` };
    return { texto: ultima };
  }

  // ---------- desenho dos resultados ----------
  const fmt = (v) => (v === null || v === undefined ? "" : typeof v === "number" ? String(Number.isInteger(v) ? v : Math.round(v * 10000) / 10000).replace(".", ",") : typeof v === "boolean" ? (v ? "True" : "False") : String(v));
  const pyNum = (v) => (typeof v === "number" ? String(v) : fmt(v));
  function tabela(t, marcas) {
    const cab = `<tr><th class="py-idx" scope="col"><span class="visivel-leitor">índice</span></th>${t.colunas.map((c) => `<th scope="col">${esc(c)}</th>`).join("")}</tr>`;
    const corpo = t.linhas.map((l, i) => `<tr class="${marcas ? marcas(t.indice[i]) : ""}"><td class="py-idx">${esc(t.indice[i])}</td>${l.map((v) => `<td class="${typeof v === "number" ? "m" : ""}">${esc(fmt(v))}</td>`).join("")}</tr>`).join("");
    return `<div class="rolagem"><table class="tabela py-tabela"><thead>${cab}</thead><tbody>${corpo}</tbody></table></div>`;
  }
  function desenhar(v) {
    if (!v) return "";
    if (v.tipo === "tabela") return tabela(v) + `<p class="py-nota">${v.total} ${v.total === 1 ? "linha" : "linhas"} × ${v.colunas.length} ${v.colunas.length === 1 ? "coluna" : "colunas"}</p>`;
    if (v.tipo === "serie") return `<div class="rolagem"><table class="tabela py-tabela"><thead><tr><th class="py-idx"><span class="visivel-leitor">índice</span></th><th>${esc(v.nome || "valor")}</th></tr></thead><tbody>${v.indice.map((i, k) => `<tr><td class="py-idx">${esc(i)}</td><td class="${typeof v.valores[k] === "number" ? "m" : ""}">${esc(fmt(v.valores[k]))}</td></tr>`).join("")}</tbody></table></div><p class="py-nota">série com ${v.total} ${v.total === 1 ? "valor" : "valores"}, tipo ${esc(v.dtype)}</p>`;
    return `<p class="py-valor"><code>${esc(v.repr)}</code><small>${esc(v.py)}</small></p>`;
  }

  // ---------- o exercício ----------
  const tpl = (ex, nome) => { const t = ex.querySelector(`:scope > template[data-${nome}]`); return t ? t.innerHTML.replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&").replace(/^\n/, "").replace(/\s+$/, "") : ""; };
  const tpls = (ex, nome) => [...ex.querySelectorAll(`:scope > template[data-${nome}]`)].map((t) => t.innerHTML.replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&").trim());
  const lista = (s) => String(s || "").split(/\s+/).filter(Boolean);

  function exercicio(ex, ctx, h) {
    const pacotes = lista(ex.dataset.pacotes);
    const preparo = tpl(ex, "preparo"), inicial = tpl(ex, "inicial"), solucao = tpl(ex, "solucao"), testes = tpl(ex, "testes");
    const dicas = tpls(ex, "dica");
    const nomeBase = ex.dataset.base || "", ver = lista(ex.dataset.ver), vars = lista(ex.dataset.vars);
    const entradas = ex.dataset.entradas ? ex.dataset.entradas.split("|") : [];
    const repl = ex.hasAttribute("data-repl");
    const rastro = ex.hasAttribute("data-rastro");
    const idc = "py-" + Math.random().toString(36).slice(2, 8);
    const retorno = ex.querySelector(":scope > .retorno");
    const bloco = document.createElement("div");
    bloco.className = "py-lab";
    bloco.innerHTML = `
      ${nomeBase ? `<section class="py-dados" aria-label="Os dados"><p class="py-rot">Os dados: <code>${esc(nomeBase)}</code><span class="py-conta" aria-live="polite"></span></p><div class="py-base"><p class="py-nota">Carregando a tabela...</p></div></section>` : ""}
      ${entradas.length ? `<p class="py-entradas">O <code>input()</code> vai receber, nesta ordem: ${entradas.map((e) => `<code>${esc(e)}</code>`).join(", ")}</p>` : ""}
      <div class="py-editor">
        <label class="py-rot" for="${idc}">Seu código <small>o resultado muda enquanto você digita</small></label>
        <textarea id="${idc}" class="py-cod" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" rows="${Math.max(3, inicial.split("\n").length + 1)}">${esc(inicial)}</textarea>
        <div class="py-acoes"><button type="button" class="botao" data-a="dica">Pedir uma dica</button><button type="button" class="botao primario" data-verificar>Verificar</button></div>
      </div>
      <section class="py-vivo" aria-label="Resultado" aria-live="polite"><p class="py-estado">Preparando o Python: na primeira vez leva alguns segundos, depois fica no aparelho.</p><div class="py-saidas"></div></section>`;
    if (retorno) retorno.before(bloco); else ex.appendChild(bloco);
    const ta = bloco.querySelector("textarea"), estado = bloco.querySelector(".py-estado"), saidas = bloco.querySelector(".py-saidas");
    const baseEl = bloco.querySelector(".py-base"), conta = bloco.querySelector(".py-conta");
    let tabelaBase = null, tentativas = 0, dicasUsadas = 0, timer = 0, versao = 0;

    // Tab no editor põe 4 espaços (o recuo do Python); Esc devolve o foco à página
    ta.addEventListener("keydown", (e) => {
      if (e.key === "Tab" && !e.shiftKey) { e.preventDefault(); const i = ta.selectionStart; ta.setRangeText("    ", i, ta.selectionEnd, "end"); ta.dispatchEvent(new Event("input")); }
      if (e.key === "Escape") ta.blur();
    });

    function marcarBase(res) {
      if (!tabelaBase || !baseEl) return;
      const sub = ver.map((n) => res.valores[n]).find((v) => v && v.tipo === "tabela" && v.indice.every((i) => tabelaBase.indice.includes(i)));
      if (sub && sub.total < tabelaBase.total) {
        const fica = new Set(sub.indice);
        baseEl.innerHTML = tabela(tabelaBase, (i) => (fica.has(i) ? "fica" : "sai"));
        conta.textContent = ` · ${sub.total} de ${tabelaBase.total} linhas ficam`;
      } else { baseEl.innerHTML = tabela(tabelaBase); conta.textContent = ""; }
    }
    function mostrar(res) {
      if (res.falhou) { estado.textContent = res.falhou; estado.className = "py-estado py-falhou"; return; }
      if (res.demorou) { estado.textContent = "O código demorou demais e foi parado. Tem algum laço que nunca termina?"; estado.className = "py-estado py-falhou"; return; }
      estado.className = "py-estado"; estado.textContent = "";
      if (nomeBase && res.valores[nomeBase] && res.valores[nomeBase].tipo === "tabela" && !tabelaBase) { tabelaBase = res.valores[nomeBase]; }
      marcarBase(res);
      let html = "";
      if (res.erro && ta.value.trim() === inicial.trim() && /^SyntaxError/m.test(res.erro)) {
        html += `<p class="py-nota py-lacuna">Complete o código acima: o resultado aparece aqui enquanto você digita.</p>`;
      } else if (res.erro) {
        const e = erroPython(res.erro);
        html += `<p class="py-erro"><b>O Python parou.</b> ${esc(e.texto)}</p>`;
      }
      if (rastro && res.passos && res.passos.length > 1) {
        // teste de mesa: uma linha por instrução executada; só aparece o valor que mudou naquele passo
        const linhas = ta.value.split("\n"), P = res.passos, cols = vars;
        let corpo = "";
        for (let k = 0; k < P.length - 1; k++) {
          const [num, , ini] = P[k], depois = P[k + 1][1], antes = P[k][1], fim = P[k + 1][2];
          const tela = (res.saida || "").slice(ini, fim).replace(/\n$/, "");
          corpo += `<tr><td class="m">${k + 1}</td><td class="py-lin"><code>${esc((linhas[num - 1] || "").trim())}</code></td>${cols.map((n) => { const v = depois[n], mudou = v !== undefined && v !== antes[n]; return `<td class="${mudou ? "muda" : ""}"><code>${mudou ? esc(v) : ""}</code></td>`; }).join("")}<td><code>${esc(tela)}</code></td></tr>`;
        }
        html += `<p class="py-rot">Teste de mesa: uma linha por instrução executada</p><div class="rolagem"><table class="tabela py-rastro"><thead><tr><th scope="col" class="m">passo</th><th scope="col">linha</th>${cols.map((n) => `<th scope="col"><code>${esc(n)}</code></th>`).join("")}<th scope="col">tela</th></tr></thead><tbody>${corpo}</tbody></table></div>`;
      } else if (vars.length) {
        html += `<p class="py-rot">As variáveis agora</p><div class="rolagem"><table class="tabela py-vars" aria-label="As variáveis agora"><thead><tr><th scope="col">variável</th><th scope="col">valor</th><th scope="col">tipo</th></tr></thead><tbody>${vars.map((n) => { const v = res.valores[n]; return `<tr class="${v ? "" : "py-vazia"}"><td><code>${esc(n)}</code></td><td><code>${v ? esc(v.repr || "") : "ainda não existe"}</code></td><td>${v ? esc(v.py || v.tipo) : ""}</td></tr>`; }).join("")}</tbody></table></div>`;
      }
      ver.forEach((n) => { const v = res.valores[n]; if (v) html += `<div class="py-res"><p class="py-rot">Resultado: <code>${esc(n)}</code></p>${desenhar(v)}</div>`; });
      if (repl && res.ultimo) html += `<div class="py-res"><p class="py-rot">O REPL mostraria</p>${desenhar(res.ultimo)}</div>`;
      if (res.saida) html += `<div class="py-res"><p class="py-rot">Na tela (print)</p><pre class="py-saida">${esc(res.saida)}</pre></div>`;
      if (!html) html = `<p class="py-nota">Nada para mostrar ainda: complete o código acima.</p>`;
      saidas.innerHTML = html;
    }
    const pedido = (comTestes) => ({ codigo: ta.value, preparo, pacotes, mostrar: [...new Set([nomeBase, ...ver, ...vars].filter(Boolean))], entradas, repl, rastro: rastro ? vars : null, testes: comTestes ? testes : "" });
    async function aoVivo() {
      const minha = ++versao;
      const res = await rodar(pedido(false));
      if (minha === versao) mostrar(res);
    }
    ta.addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(aoVivo, ATRASO); });
    // os dados aparecem assim que o Python fica pronto (antes, só o aviso de carregamento)
    const avisar = (s, msg) => {
      if (s === "carregando") { estado.textContent = "Preparando o Python: na primeira vez leva alguns segundos, depois fica no aparelho."; estado.className = "py-estado"; }
      if (s === "falhou") { estado.textContent = msg || "O Python não carregou."; estado.className = "py-estado py-falhou"; }
    };
    ouvintes.add(avisar);
    let iniciado = false;
    const iniciar = () => { if (iniciado) return; iniciado = true; aoVivo(); };
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); iniciar(); } });
      io.observe(bloco);
    } else iniciar();
    ta.addEventListener("focus", iniciar);

    bloco.querySelector('[data-a="dica"]').addEventListener("click", () => {
      if (ex.dataset.estado === "resolvido") return;
      const d = dicas[dicasUsadas] || (h.pista ? h.pista(ex, ctx, false) : "");
      if (!d) return;
      if (window.Motor && window.Motor.dicaNoEditor(ta, d, "python")) { dicasUsadas = Math.min(dicasUsadas + 1, dicas.length); ta.focus(); }
      else ta.value = ta.value.replace(/\s+$/, "") + "\n";
      if (dicasUsadas >= dicas.length) bloco.querySelector('[data-a="dica"]').disabled = true;
    });

    ex.querySelector("[data-verificar]").addEventListener("click", async () => {
      if (ex.dataset.estado === "resolvido") return;
      const bt = ex.querySelector("[data-verificar]");
      bt.disabled = true; bt.textContent = "Rodando...";
      const res = await rodar(pedido(true));
      bt.disabled = false; bt.textContent = "Verificar";
      versao++; mostrar(res);
      if (res.falhou || res.demorou) { h.mostrarAviso(ex, res.falhou || "O código demorou demais e foi parado. Confira se há um laço que nunca termina."); return; }
      if (!res.erro && res.teste && res.teste.ok) { h.mostrarCerto(ex); h.resolver(ex, ctx, tentativas ? "segunda" : "primeira"); ta.readOnly = true; return; }
      tentativas++;
      const e = erroPython(res.erro || (res.teste && res.teste.msg) || "");
      const certo = res.erro ? "" : "o código roda sem erro.";
      if (tentativas === 1) {
        const d = dicas[dicasUsadas] || dicas[0] || h.pista(ex, ctx, false);
        const foi = window.Motor && window.Motor.dicaNoEditor(ta, d, "python");
        if (foi) dicasUsadas = Math.min(dicasUsadas + 1, dicas.length);
        h.mostrarTentativa(ex, { certo, erro: esc(e.texto), passo: foi ? "a dica está no editor, como comentário (linha com #). Ajuste e verifique de novo." : esc(d) });
        return;
      }
      h.mostrarRevelado(ex, `${esc(e.texto)} Uma solução:`, `<pre class="py-solucao"><code>${esc(solucao)}</code></pre><p><button type="button" class="botao" data-a="usar">Usar esta solução no editor</button></p>`);
      const usar = ex.querySelector('[data-a="usar"]');
      if (usar) usar.addEventListener("click", () => { ta.readOnly = false; ta.value = solucao; aoVivo(); ta.readOnly = true; });
      h.resolver(ex, ctx, "revelada");
    });
  }

  // ---------- "O comando": as partes do código acendem junto com a explicação de cada uma ----------
  function comandos(raiz) {
    (raiz || document).querySelectorAll("figure.comando").forEach((fig) => {
      if (fig.dataset.pronto) return;
      fig.dataset.pronto = "1";
      const acender = (p) => fig.querySelectorAll("[data-parte]").forEach((el) => el.classList.toggle("aceso", el.dataset.parte === p));
      fig.querySelectorAll("[data-parte]").forEach((el) => {
        if (el.tagName === "LI") { el.tabIndex = 0; }
        el.addEventListener("mouseenter", () => acender(el.dataset.parte));
        el.addEventListener("focus", () => acender(el.dataset.parte));
        el.addEventListener("click", () => acender(el.dataset.parte));
      });
      fig.addEventListener("mouseleave", () => acender(null));
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => comandos(document)); else comandos(document);

  window.Laboratorio = { exercicio, rodar, preparar, erroPython, comandos };
})();
