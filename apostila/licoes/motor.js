// Motor didático das lições do Domínio.
// Um arquivo só para todas as lições. Ele lê cada exercício pelo HTML (atributos data-*) e cuida de:
//   - duas tentativas com pista antes do gabarito e feedback em três partes (doc 04, seção 3);
//   - Certo/Errado com confiança e saldo no estilo Cebraspe (doc 04, seção 9);
//   - cartões para arrastar em grupos, Parsons com linha falsa e recuo, "ache o erro";
//   - explicar em 3 linhas dentro da lição;
//   - revisão espaçada: o que você errou volta em 1, 3, 7, 14 e 30 dias (doc 04, seção 6);
//   - o passo a passo da lição (um conceito por vez, avanço depois dos exercícios);
//   - a cascata de cada conceito: desafio, leitura, animação, cada exercício e o fechamento abrem um de cada vez.
// Tipos de exercício (atributo na div .exercicio):
//   data-escolha      botões em .opcoes; o certo tem data-ok. Com só "Certo" e "Errado", vira item C/E.
//   data-classificar  linhas .linha-classifica com <select data-resposta>; vira cartões para arrastar.
//   data-preencher    campos <input>/<select> com data-resposta (respostas aceitas separadas por |).
//   data-ordenar      linhas .linha para montar; data-resposta na ordem certa (|); data-alternativas
//                     com outras ordens aceitas (||); .linha[data-falsa] é distrator; data-recuo cobra o recuo
//                     (4 espaços no começo da linha da resposta = um nível).
//   data-ache         lista .ache-codigo; o item errado tem data-erro.
//   data-codigo       exercício de código; precisa de laboratorio.js (SQL e Python no navegador).
// No .retorno: data-ok-texto, data-nao-texto e, opcional, data-pista (a pista da segunda tentativa).
(function () {
  "use strict";

  // ---------- utilidades ----------
  const ls = {
    ler(chave, padrao) { try { const v = localStorage.getItem(chave); return v ? JSON.parse(v) : padrao; } catch (e) { return padrao; } },
    gravar(chave, valor) { try { localStorage.setItem(chave, JSON.stringify(valor)); } catch (e) { /* sem armazenamento: vale só nesta visita */ } },
  };
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const normalizar = (v) => String(v).trim().toLowerCase().replace(/["“”']/g, "").replace(",", ".").replace("não", "nao");
  const hash = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36); };
  const pad = (n) => String(n).padStart(2, "0");
  const dataISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const hoje = () => dataISO(new Date());
  const somaDias = (iso, n) => { const [a, m, d] = iso.split("-").map(Number); return dataISO(new Date(a, m - 1, d + n)); };
  const reduz = () => !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const flip = (els, mudar) => (window.Clip && window.Clip.flip ? window.Clip.flip(els, mudar) : mudar());

  const TIPOS = ["escolha", "classificar", "preencher", "ordenar", "ache", "lacunas", "codigo"];
  const tipoDe = (ex) => TIPOS.find((t) => ex.hasAttribute("data-" + t));
  function idDe(ex) {
    if (ex.dataset.id) return ex.dataset.id;
    const p = ex.querySelector(".pergunta");
    return tipoDe(ex) + "-" + hash((p ? p.textContent : ex.textContent).replace(/\s+/g, " ").trim());
  }

  // ---------- retorno (feedback) ----------
  const retornoDe = (ex) => ex.querySelector(":scope > .retorno") || ex.querySelector(".retorno");
  function mostrarCerto(ex, extra) {
    const r = retornoDe(ex);
    r.hidden = false;
    r.className = "retorno ok";
    r.innerHTML = `<span class="cab">Certo.</span><span>${r.dataset.okTexto || ""}</span>${extra || ""}`;
  }
  function mostrarTentativa(ex, partes) {
    const r = retornoDe(ex);
    r.hidden = false;
    r.className = "retorno nao tentativa";
    r.innerHTML = `<span class="cab">Ainda não. Você tem mais uma tentativa.</span><ul class="tres-partes">${
      partes.certo ? `<li><b>Certo até aqui:</b> ${partes.certo}</li>` : ""}<li><b>O erro:</b> ${partes.erro}</li><li><b>Próximo passo:</b> ${partes.passo}</li></ul>`;
  }
  function mostrarRevelado(ex, texto, extra) {
    const r = retornoDe(ex);
    r.hidden = false;
    r.className = "retorno revelado";
    r.innerHTML = `<span class="cab">Veja a resposta.</span><span>${texto}</span>${extra || ""}`;
  }
  const semAbertura = (t) => String(t || "").replace(/^(Tudo certo|Certo|Isso)\.\s*/, "");
  function mostrarAviso(ex, texto) {
    const r = retornoDe(ex);
    r.hidden = false;
    r.className = "retorno aviso";
    r.innerHTML = `<span>${texto}</span>`;
  }
  // a pista vem do autor (data-pista); sem ela, usa o texto de erro sem a frase sobre os campos, ou o resumo do conceito
  function pista(ex, ctx, usarNao) {
    const r = retornoDe(ex);
    if (ex.dataset.pista || r.dataset.pista) return ex.dataset.pista || r.dataset.pista;
    if (usarNao && r.dataset.naoTexto) {
      const t = r.dataset.naoTexto.replace(/^(Os campos em vermelho[^.]*|Confira os campos em vermelho[^.]*|Ainda não[^.]*)\.\s*/, "");
      if (t) return t;
    }
    return "releia o bloco de leitura logo acima e compare cada alternativa com ele.";
  }

  // ---------- revisão espaçada ----------
  const CHAVE_REV = "dominio:revisao:v1";
  const INTERVALOS = [1, 3, 7, 14, 30];
  const Revisao = {
    todos: () => ls.ler(CHAVE_REV, {}),
    // na lição: o que não saiu de primeira (ou saiu no chute) vira cartão para amanhã
    daLicao(ctx, ex, resultado) {
      // o desafio é pré-pergunta: errar ali é esperado e não pesa (doc 04, seção 2)
      if (resultado === "primeira" || ex.classList.contains("desafio")) return;
      const cartoes = this.todos(), id = idDe(ex), antes = cartoes[id] || {};
      cartoes[id] = { id, licao: ctx.licao, titulo: ctx.titulo, url: ctx.url, sec: ctx.sec, conceito: ctx.conceito,
        caixa: 0, proxima: somaDias(hoje(), 1), erros: (antes.erros || 0) + 1, acertos: antes.acertos || 0, criado: antes.criado || hoje() };
      ls.gravar(CHAVE_REV, cartoes);
    },
    // na revisão: acerto de primeira sobe uma caixa; o resto volta para amanhã
    daRevisao(id, resultado) {
      const cartoes = this.todos(), c = cartoes[id];
      if (!c) return null;
      if (resultado === "primeira") { c.caixa = Math.min(c.caixa + 1, INTERVALOS.length - 1); c.acertos += 1; c.proxima = somaDias(hoje(), INTERVALOS[c.caixa]); }
      else { c.caixa = 0; c.erros += 1; c.proxima = somaDias(hoje(), 1); }
      ls.gravar(CHAVE_REV, cartoes);
      return c;
    },
    // vencidos hoje, intercalando as matérias (um de cada por vez)
    vencidos(limite) {
      const lista = Object.values(this.todos()).filter((c) => c.proxima <= hoje()).sort((a, b) => (a.proxima < b.proxima ? -1 : 1));
      const grupos = {};
      lista.forEach((c) => { const m = String(c.licao).split(".")[0]; (grupos[m] = grupos[m] || []).push(c); });
      const filas = Object.values(grupos), saida = [];
      while (saida.length < lista.length) filas.forEach((f) => { if (f.length) saida.push(f.shift()); });
      return saida.slice(0, limite || 12);
    },
    remover(id) { const c = this.todos(); delete c[id]; ls.gravar(CHAVE_REV, c); },
    INTERVALOS,
  };

  // ---------- Certo/Errado com confiança ----------
  const CHAVE_CE = "dominio:ce:v1";
  function registrarCE(ctx, id, acertou, conf) {
    const todos = ls.ler(CHAVE_CE, {});
    todos[id] = { licao: ctx.licao, acertou, conf: conf || "sem", em: hoje() };
    ls.gravar(CHAVE_CE, todos);
    const daqui = Object.values(todos).filter((x) => x.licao === ctx.licao);
    const saldo = daqui.reduce((a, x) => a + (x.acertou ? 1 : -1), 0);
    const porConf = ["certeza", "acho", "chute"].map((k) => { const g = daqui.filter((x) => x.conf === k); return g.length ? `${{ certeza: "certeza", acho: "acho que sim", chute: "chute" }[k]}: ${g.filter((x) => x.acertou).length} de ${g.length}` : ""; }).filter(Boolean);
    return `<p class="saldo-ce"><b>Saldo Cebraspe nesta lição: ${saldo > 0 ? "+" : ""}${saldo}</b> em ${daqui.length} ${daqui.length === 1 ? "item" : "itens"} (+1 no acerto, −1 no erro).${porConf.length ? ` Acertos por confiança: ${porConf.join(" · ")}.` : ""}</p>`;
  }

  // ---------- tipos de exercício ----------
  function resolver(ex, ctx, resultado) {
    ex.dataset.estado = "resolvido";
    ex.dataset.resultado = resultado;
    if (ctx.aoResolver) ctx.aoResolver(ex, resultado);
  }

  function escolha(ex, ctx) {
    const botoes = [...ex.querySelectorAll(".opcoes .botao")];
    const ce = botoes.length === 2 && botoes.every((b) => /^(certo|errado)$/i.test(b.textContent.trim()));
    const binario = botoes.length <= 2;
    let tentativas = 0, conf = null;
    if (ce) {
      ex.querySelector(".opcoes").insertAdjacentHTML("beforebegin", `<div class="confianca" role="group" aria-label="Sua confiança antes de responder"><span>Antes de responder, sua confiança:</span><button type="button" data-conf="certeza" aria-pressed="false">Certeza</button><button type="button" data-conf="acho" aria-pressed="false">Acho que sim</button><button type="button" data-conf="chute" aria-pressed="false">Chute</button></div>`);
      ex.querySelectorAll("[data-conf]").forEach((c) => c.addEventListener("click", () => {
        if (ex.dataset.estado === "resolvido") return;
        conf = c.dataset.conf;
        ex.querySelectorAll("[data-conf]").forEach((x) => x.setAttribute("aria-pressed", String(x === c)));
      }));
    }
    botoes.forEach((b) => b.addEventListener("click", () => {
      if (ex.dataset.estado === "resolvido") return;
      tentativas++;
      const ok = b.hasAttribute("data-ok");
      const fechar = () => { botoes.forEach((x) => { x.disabled = true; if (x.hasAttribute("data-ok")) x.classList.add("certo"); }); ex.querySelectorAll("[data-conf]").forEach((x) => { x.disabled = true; }); };
      if (ok) {
        fechar();
        b.setAttribute("aria-pressed", "true");
        const extra = ce ? registrarCE(ctx, idDe(ex), true, conf) : "";
        mostrarCerto(ex, extra);
        resolver(ex, ctx, tentativas > 1 ? "segunda" : ce && conf === "chute" ? "chute" : "primeira");
      } else if (binario || tentativas >= 2) {
        fechar();
        b.classList.add("errado");
        b.setAttribute("aria-pressed", "true");
        const extra = ce ? registrarCE(ctx, idDe(ex), false, conf) : "";
        mostrarRevelado(ex, retornoDe(ex).dataset.naoTexto || "", extra);
        resolver(ex, ctx, "revelada");
      } else {
        b.classList.add("errado");
        b.disabled = true;
        mostrarTentativa(ex, { certo: `uma alternativa a menos: sobram ${botoes.filter((x) => !x.disabled).length} para escolher.`, erro: b.dataset.porque ? esc(b.dataset.porque) : `“${esc(b.textContent.trim())}” não responde ao que a pergunta pede.`, passo: pista(ex, ctx, false) });
      }
    }));
  }

  // cartões para arrastar em grupos (substitui as listas de escolha de data-classificar)
  function classificar(ex, ctx) {
    const linhas = [...ex.querySelectorAll(".linha-classifica")];
    if (!linhas.length) return;
    const selects = linhas.map((l) => l.querySelector("select"));
    const grupos = [...selects[0].options].filter((o) => o.value).map((o) => ({ v: o.value, t: o.textContent }));
    linhas[0].parentElement.hidden = true;
    const cat = document.createElement("div");
    cat.className = "cat";
    cat.innerHTML = `<p class="cat-ajuda">Toque num cartão e depois no grupo certo. No computador, também dá para arrastar.</p>
      <div class="cat-banco" data-alvo="banco" aria-label="Cartões ainda sem grupo">${linhas.map((l, i) => `<button type="button" class="cat-cartao" data-i="${i}" aria-pressed="false">${l.querySelector("span").innerHTML}</button>`).join("")}</div>
      <div class="cat-grupos">${grupos.map((g) => `<div class="cat-grupo" data-alvo="${esc(g.v)}"><button type="button" class="cat-nome">${esc(g.t)}</button><div class="cat-itens"></div></div>`).join("")}</div>`;
    linhas[0].parentElement.insertAdjacentElement("afterend", cat);
    const banco = cat.querySelector(".cat-banco");
    const cartoes = [...cat.querySelectorAll(".cat-cartao")];
    let selecionado = null, tentativas = 0, arrastou = false;

    const marcar = (c) => { selecionado = c; cartoes.forEach((x) => x.setAttribute("aria-pressed", String(x === c))); cat.classList.toggle("escolhendo", !!c); };
    function colocar(c, alvo) {
      if (!c || c.classList.contains("travado")) return;
      const grupo = [...cat.querySelectorAll(".cat-grupo")].find((g) => g.dataset.alvo === alvo);
      const destino = alvo === "banco" ? banco : grupo && grupo.querySelector(".cat-itens");
      if (!destino) return;
      flip(cartoes, () => destino.appendChild(c));
      c.classList.remove("nao");
      selects[Number(c.dataset.i)].value = alvo === "banco" ? "" : alvo;
      marcar(null);
    }
    cartoes.forEach((c) => c.addEventListener("click", () => {
      if (arrastou) { arrastou = false; return; }
      if (ex.dataset.estado === "resolvido" || c.classList.contains("travado")) return;
      marcar(selecionado === c ? null : c);
    }));
    cat.querySelectorAll("[data-alvo]").forEach((alvo) => alvo.addEventListener("click", (e) => {
      if (!selecionado || e.target.closest(".cat-cartao")) return;
      colocar(selecionado, alvo.dataset.alvo);
    }));
    // arrastar com o dedo ou o mouse (pointer events funcionam no celular e no computador)
    cartoes.forEach((c) => c.addEventListener("pointerdown", (e) => {
      if (ex.dataset.estado === "resolvido" || c.classList.contains("travado") || e.button > 0) return;
      const x0 = e.clientX, y0 = e.clientY;
      let fantasma = null;
      const mover = (m) => {
        if (!fantasma && Math.hypot(m.clientX - x0, m.clientY - y0) < 8) return;
        if (!fantasma) { fantasma = c.cloneNode(true); fantasma.classList.add("cat-fantasma"); document.body.appendChild(fantasma); c.classList.add("arrastando"); }
        fantasma.style.left = m.clientX + "px"; fantasma.style.top = m.clientY + "px";
        m.preventDefault();
      };
      const soltar = (u) => {
        document.removeEventListener("pointermove", mover);
        document.removeEventListener("pointerup", soltar);
        if (!fantasma) return;
        fantasma.remove(); c.classList.remove("arrastando");
        arrastou = true;
        const sob = document.elementFromPoint(u.clientX, u.clientY);
        const alvo = sob && sob.closest(".cat [data-alvo]");
        if (alvo && cat.contains(alvo)) colocar(c, alvo.dataset.alvo);
        setTimeout(() => { arrastou = false; }, 0);
      };
      document.addEventListener("pointermove", mover, { passive: false });
      document.addEventListener("pointerup", soltar);
    }));

    ex.querySelector("[data-verificar]").addEventListener("click", () => {
      if (ex.dataset.estado === "resolvido") return;
      if (banco.querySelector(".cat-cartao")) { mostrarAviso(ex, "Coloque todos os cartões num grupo antes de verificar."); return; }
      tentativas++;
      let certos = 0;
      cartoes.forEach((c) => {
        const ok = (selects[Number(c.dataset.i)].dataset.resposta || "").split("|").includes(selects[Number(c.dataset.i)].value);
        c.classList.toggle("ok", ok); c.classList.toggle("nao", !ok); c.classList.toggle("travado", ok);
        if (ok) certos++;
      });
      if (certos === cartoes.length) { mostrarCerto(ex); resolver(ex, ctx, tentativas > 1 ? "segunda" : "primeira"); return; }
      if (tentativas >= 2) {
        const errados = cartoes.filter((c) => !c.classList.contains("ok"));
        flip(cartoes, () => errados.forEach((c) => {
          const certo = selects[Number(c.dataset.i)].dataset.resposta.split("|")[0];
          [...cat.querySelectorAll(".cat-grupo")].find((g) => g.dataset.alvo === certo).querySelector(".cat-itens").appendChild(c);
          selects[Number(c.dataset.i)].value = certo;
          c.classList.remove("nao"); c.classList.add("revelado", "travado");
        }));
        mostrarRevelado(ex, `Os cartões em destaque foram para o grupo certo. ${semAbertura(retornoDe(ex).dataset.okTexto)}`);
        resolver(ex, ctx, "revelada");
        return;
      }
      mostrarTentativa(ex, { certo: certos ? `${certos} de ${cartoes.length} cartões estão no grupo certo (ficaram verdes e travados).` : "", erro: "os cartões vermelhos estão no grupo errado.", passo: pista(ex, ctx, true) });
    });
  }

  function preencher(ex, ctx) {
    const campos = [...ex.querySelectorAll("[data-resposta]")];
    let tentativas = 0;
    ex.querySelector("[data-verificar]").addEventListener("click", () => {
      if (ex.dataset.estado === "resolvido") return;
      tentativas++;
      let certos = 0;
      campos.forEach((c) => {
        const ok = c.dataset.resposta.split("|").includes(normalizar(c.value));
        c.classList.toggle("ok", ok); c.classList.toggle("nao", !ok);
        if (ok) { certos++; c.readOnly = true; if (c.tagName === "SELECT") c.disabled = true; }
      });
      if (certos === campos.length) { mostrarCerto(ex); resolver(ex, ctx, tentativas > 1 ? "segunda" : "primeira"); return; }
      if (tentativas >= 2) {
        campos.filter((c) => !c.classList.contains("ok")).forEach((c) => {
          c.value = c.dataset.resposta.split("|")[0];
          c.classList.remove("nao"); c.classList.add("revelado"); c.readOnly = true; if (c.tagName === "SELECT") c.disabled = true;
        });
        mostrarRevelado(ex, `Os campos em destaque receberam a resposta certa. ${semAbertura(retornoDe(ex).dataset.okTexto)}`);
        resolver(ex, ctx, "revelada");
        return;
      }
      mostrarTentativa(ex, { certo: certos ? `${certos} de ${campos.length} campos estão certos (ficaram verdes).` : "", erro: "os campos vermelhos ainda não estão certos.", passo: pista(ex, ctx, true) });
    });
  }

  // Parsons: montar o programa com as linhas, ignorando as falsas e, se pedido, acertando o recuo
  function ordenar(ex, ctx) {
    const banco = ex.querySelector("[data-banco]"), montagem = ex.querySelector("[data-montagem]");
    if (montagem.hasAttribute("aria-label") && !montagem.hasAttribute("role")) montagem.setAttribute("role", "group");
    const comRecuo = ex.hasAttribute("data-recuo");
    const respostas = [ex.dataset.resposta, ...(ex.dataset.alternativas ? ex.dataset.alternativas.split("||") : [])]
      .map((r) => r.split("|").map((l) => ({ t: l.trim(), n: Math.floor((l.match(/^ */)[0].length) / 4) })));
    const linhas = [...ex.querySelectorAll(".linha")];
    let tentativas = 0;
    const itens = () => [...montagem.children].filter((e) => e.classList.contains("p-item"));
    function paraMontagem(l) {
      const item = document.createElement("div");
      item.className = "p-item";
      item.dataset.nivel = "0";
      if (comRecuo) item.insertAdjacentHTML("beforeend", `<button type="button" class="p-recuo" data-d="-1" aria-label="Recuar a linha">←</button><button type="button" class="p-recuo" data-d="1" aria-label="Avançar a linha">→</button>`);
      item.prepend(l);
      montagem.appendChild(item);
    }
    linhas.forEach((l) => l.addEventListener("click", () => {
      if (ex.dataset.estado === "resolvido" || l.classList.contains("travado")) return;
      const item = l.closest(".p-item");
      if (item) { banco.appendChild(l); item.remove(); } else paraMontagem(l);
      l.classList.remove("nao");
    }));
    montagem.addEventListener("click", (e) => {
      const b = e.target.closest(".p-recuo");
      if (!b || ex.dataset.estado === "resolvido") return;
      const item = b.closest(".p-item");
      item.dataset.nivel = String(Math.max(0, Math.min(4, Number(item.dataset.nivel) + Number(b.dataset.d))));
    });
    ex.querySelector("[data-verificar]").addEventListener("click", () => {
      if (ex.dataset.estado === "resolvido") return;
      const feitas = itens().map((it) => ({ t: it.querySelector(".linha").textContent.trim(), n: Number(it.dataset.nivel), el: it }));
      if (!feitas.length) { mostrarAviso(ex, "Toque nas linhas para montar o programa antes de verificar."); return; }
      tentativas++;
      const confere = (r) => r.length === feitas.length && r.every((x, i) => x.t === feitas[i].t && (!comRecuo || x.n === feitas[i].n));
      if (respostas.some(confere)) {
        feitas.forEach((f) => f.el.classList.add("ok"));
        ex.querySelector("[data-verificar]").disabled = true;
        mostrarCerto(ex); resolver(ex, ctx, tentativas > 1 ? "segunda" : "primeira"); return;
      }
      if (tentativas >= 2) {
        const r = respostas[0];
        itens().forEach((it) => { banco.appendChild(it.querySelector(".linha")); it.remove(); });
        r.forEach((x) => { const l = linhas.find((k) => k.textContent.trim() === x.t && k.closest("[data-banco]")); paraMontagem(l); l.closest(".p-item").dataset.nivel = String(x.n); l.closest(".p-item").classList.add("revelado"); });
        linhas.filter((l) => l.hasAttribute("data-falsa")).forEach((l) => l.classList.add("falsa-revelada"));
        ex.querySelector("[data-verificar]").disabled = true;
        mostrarRevelado(ex, `O programa certo foi montado acima${linhas.some((l) => l.hasAttribute("data-falsa")) ? "; as linhas riscadas não fazem parte dele" : ""}. ${semAbertura(retornoDe(ex).dataset.okTexto)}`);
        resolver(ex, ctx, "revelada");
        return;
      }
      // diagnóstico da primeira diferença, contra a resposta principal
      const r = respostas[0];
      let i = 0;
      while (i < feitas.length && i < r.length && feitas[i].t === r[i].t && (!comRecuo || feitas[i].n === r[i].n)) i++;
      const falsa = feitas.find((f) => linhas.find((l) => l.textContent.trim() === f.t && l.hasAttribute("data-falsa")));
      let erro;
      if (falsa) erro = `a linha “${esc(falsa.t)}” não faz parte do programa.`;
      else if (i < feitas.length && i < r.length && feitas[i].t === r[i].t) erro = `o recuo da linha “${esc(feitas[i].t)}” está errado: ela está dentro do bloco certo?`;
      else if (feitas.length < r.length && i === feitas.length) erro = `faltam ${r.length - feitas.length} ${r.length - feitas.length === 1 ? "linha" : "linhas"} no programa.`;
      else erro = `${ex.classList.contains("ex-texto") ? "o passo" : "a linha"} ${i + 1} (“${esc(feitas[i] ? feitas[i].t : "")}”) não deveria estar nessa posição.`;
      if (feitas[i]) feitas[i].el.querySelector(".linha").classList.add("nao");
      mostrarTentativa(ex, { certo: i > 0 ? (ex.classList.contains("ex-texto") ? `os ${i} primeiros passos estão no lugar certo.` : `as ${i} primeiras linhas estão no lugar certo.`) : "", erro, passo: pista(ex, ctx, true) });
    });
  }

  function ache(ex, ctx) {
    const itens = [...ex.querySelectorAll(".ache-codigo li")];
    let tentativas = 0;
    itens.forEach((li, i) => {
      const texto = li.closest(".ache-texto");
      li.innerHTML = `<button type="button" class="ache-linha"><span class="n">${i + 1}</span>${texto ? `<span class="ache-frase">${li.innerHTML}</span>` : `<code>${li.innerHTML}</code>`}</button>`;
      li.querySelector("button").addEventListener("click", () => {
        if (ex.dataset.estado === "resolvido") return;
        tentativas++;
        if (li.hasAttribute("data-erro")) {
          li.classList.add("ok");
          itens.forEach((x) => { x.querySelector("button").disabled = true; });
          mostrarCerto(ex); resolver(ex, ctx, tentativas > 1 ? "segunda" : "primeira");
        } else if (tentativas >= 2) {
          li.classList.add("nao");
          itens.forEach((x) => { x.querySelector("button").disabled = true; if (x.hasAttribute("data-erro")) x.classList.add("revelado"); });
          mostrarRevelado(ex, retornoDe(ex).dataset.naoTexto || "");
          resolver(ex, ctx, "revelada");
        } else {
          li.classList.add("nao");
          li.querySelector("button").disabled = true;
          mostrarTentativa(ex, { certo: `${ex.querySelector(".ache-texto") ? "a frase" : "a linha"} ${i + 1} está certa: uma a menos para conferir.`, erro: "o trecho com problema é outro.", passo: pista(ex, ctx, false) });
        }
      });
    });
  }


  // ---------- completar com palavras: lacunas no texto e um banco de palavras (algumas confundem) ----------
  function lacunas(ex, ctx) {
    const vagas = [...ex.querySelectorAll("[data-lacuna]")];
    const banco = ex.querySelector(".lacunas-banco");
    const chips = [...banco.querySelectorAll("button")];
    // embaralha o banco a cada montagem, para a ordem das palavras não entregar a resposta
    for (let i = chips.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); banco.appendChild(chips[j]); [chips[i], chips[j]] = [chips[j], chips[i]]; }
    const norm = (t) => String(t || "").replace(/\s+/g, " ").trim().toLowerCase();
    let tentativas = 0, alvo = 0;
    vagas.forEach((v, i) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "lacuna"; b.dataset.lacuna = v.dataset.lacuna; b.dataset.i = String(i);
      v.replaceWith(b);
      vagas[i] = b;
    });
    const rotular = () => vagas.forEach((v, i) => {
      v.classList.toggle("alvo", i === alvo && ex.dataset.estado !== "resolvido");
      v.setAttribute("aria-label", `Lacuna ${i + 1}${v.dataset.palavra ? `: ${v.dataset.palavra}. Toque para devolver a palavra` : ", vazia. Escolha uma palavra abaixo"}`);
      v.textContent = v.dataset.palavra || "";
    });
    const proximaVazia = () => { const k = vagas.findIndex((v) => !v.dataset.palavra); return k < 0 ? alvo : k; };
    function devolver(v) {
      const chip = chips.find((c) => c.dataset.usado === v.dataset.i);
      if (chip) { chip.disabled = false; delete chip.dataset.usado; }
      delete v.dataset.palavra; v.classList.remove("nao");
    }
    vagas.forEach((v, i) => v.addEventListener("click", () => {
      if (ex.dataset.estado === "resolvido") return;
      if (v.dataset.palavra) devolver(v);
      alvo = i; rotular();
    }));
    chips.forEach((c) => c.addEventListener("click", () => {
      if (ex.dataset.estado === "resolvido" || c.disabled) return;
      const v = vagas[alvo];
      if (v.dataset.palavra) devolver(v);
      v.dataset.palavra = c.textContent.trim(); c.dataset.usado = String(alvo); c.disabled = true; v.classList.remove("nao");
      alvo = proximaVazia(); rotular();
    }));
    rotular();
    ex.querySelector("[data-verificar]").addEventListener("click", () => {
      if (ex.dataset.estado === "resolvido") return;
      if (vagas.some((v) => !v.dataset.palavra)) { mostrarAviso(ex, "Preencha todas as lacunas antes de verificar: toque numa lacuna e depois numa palavra."); return; }
      tentativas++;
      const erradas = vagas.filter((v) => norm(v.dataset.palavra) !== norm(v.dataset.lacuna));
      const fechar = () => { chips.forEach((c) => { c.disabled = true; }); vagas.forEach((v) => { v.disabled = true; }); ex.querySelector("[data-verificar]").disabled = true; };
      if (!erradas.length) {
        vagas.forEach((v) => { v.classList.remove("nao"); v.classList.add("ok"); }); fechar(); ex.dataset.estado = "resolvido"; rotular();
        mostrarCerto(ex); resolver(ex, ctx, tentativas > 1 ? "segunda" : "primeira"); return;
      }
      if (tentativas >= 2) {
        vagas.forEach((v) => { v.classList.remove("nao"); if (norm(v.dataset.palavra) !== norm(v.dataset.lacuna)) { v.dataset.palavra = v.dataset.lacuna; v.classList.add("revelado"); } else v.classList.add("ok"); });
        fechar(); ex.dataset.estado = "resolvido"; rotular();
        mostrarRevelado(ex, retornoDe(ex).dataset.naoTexto || semAbertura(retornoDe(ex).dataset.okTexto));
        resolver(ex, ctx, "revelada"); return;
      }
      const certas = vagas.length - erradas.length;
      const lista = erradas.map((v) => `a lacuna ${Number(v.dataset.i) + 1} não leva “${esc(v.dataset.palavra)}”`);
      erradas.forEach((v) => { devolver(v); v.classList.add("nao"); });
      alvo = proximaVazia(); rotular();
      mostrarTentativa(ex, { certo: certas ? `${certas} de ${vagas.length} ${vagas.length === 1 ? "lacuna está certa" : "lacunas estão certas"} e ficaram no lugar.` : "", erro: lista.join("; ") + ".", passo: pista(ex, ctx, true) });
    });
  }

  // ---------- montar um exercício a partir de dados (estudo em 5 passos, trilha, Centro de Dados) ----------
  // { f: "escolha", p, o: [[texto, certo, porque], ...] } · { f: "lacunas", p, t: "texto com {{palavra}}", x: [palavras que confundem], por }
  // { f: "erro", p, t: [frase, ...], e: índice da errada, por } · { f: "ordem", p, t: [passos na ordem certa], por }
  // Opcional em todos: r, o rótulo acima da pergunta (sem ele, o do formato).
  const ROTULOS = { escolha: "Escolha a explicação", lacunas: "Complete a explicação", erro: "Ache o erro", ordem: "Ponha na ordem" };
  const embaralhar = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const at = (t) => esc(t).replace(/"/g, "&quot;");
  function criar(d) {
    const cab = `<p class="rotulo">${d.r || ROTULOS[d.f] || ""}</p><p class="pergunta">${d.p}</p>`;
    if (d.f === "escolha") {
      const certo = d.o.find((o) => o[1]);
      return `<div class="exercicio" data-escolha>${cab}<div class="opcoes opcoes-texto">${embaralhar(d.o).map(([t, ok, por]) => `<button class="botao" type="button"${ok ? " data-ok" : ""} data-porque="${at(por || "")}">${t}</button>`).join("")}</div><div class="retorno" hidden data-ok-texto="${at(certo[2] || "")}" data-nao-texto="${at(`A certa é: “${certo[0]}”. ${certo[2] || ""}`)}"></div></div>`;
    }
    if (d.f === "lacunas") {
      const palavras = [];
      const texto = d.t.replace(/\{\{([^}]+)\}\}/g, (_, w) => { palavras.push(w); return `<span data-lacuna="${at(w)}"></span>`; });
      return `<div class="exercicio" data-lacunas>${cab}<p class="lacunas-texto">${texto}</p><div class="lacunas-banco" role="group" aria-label="Palavras para as lacunas">${[...palavras, ...(d.x || [])].map((w) => `<button class="botao chip-l" type="button">${esc(w)}</button>`).join("")}</div><div><button class="botao primario" type="button" data-verificar>Verificar</button></div><div class="retorno" hidden data-ok-texto="${at(d.por || "")}" data-pista="${at(d.pista || "leia a frase inteira com a palavra no lugar: ela fica verdadeira?")}"></div></div>`;
    }
    if (d.f === "erro") {
      return `<div class="exercicio" data-ache>${cab}<ol class="ache-codigo ache-texto">${d.t.map((t, i) => `<li${i === d.e ? " data-erro" : ""}>${t}</li>`).join("")}</ol><div class="retorno" hidden data-ok-texto="${at(d.por || "")}" data-nao-texto="${at(`O trecho errado é o ${d.e + 1}. ${d.por || ""}`)}" data-pista="${at(d.pista || "leia cada trecho e compare com o que o enunciado pede: só um deles não cumpre.")}"></div></div>`;
    }
    if (d.f === "ordem") {
      return `<div class="exercicio ex-texto" data-ordenar data-resposta="${at(d.t.join("|"))}">${cab.replace("</p>", "</p>")}<div class="ordenar" data-banco>${embaralhar(d.t).map((t) => `<button class="botao linha" type="button">${esc(t)}</button>`).join("")}</div><div class="montagem" data-montagem aria-label="Sua ordem"></div><div><button class="botao primario" type="button" data-verificar>Verificar</button></div><div class="retorno" hidden data-ok-texto="${at(d.por || "")}" data-pista="${at(d.pista || "pergunte de cada passo: ele precisa de algo que outro passo prepara?")}"></div></div>`;
    }
    return "";
  }

  // ---------- explicar em 3 linhas, salvo no aparelho ----------
  const CHAVE_EXP = "dominio:explicacoes:v1";
  function explicar(sec, ctx) {
    const p = [...sec.querySelectorAll(".explique")].find((e) => /Explique em 3 linhas|Com suas palavras/i.test(e.textContent));
    if (!p || p.nextElementSibling && p.nextElementSibling.classList.contains("explicar")) return;
    const todos = ls.ler(CHAVE_EXP, {}), chave = `${ctx.licao}#${sec.id}`;
    p.insertAdjacentHTML("afterend", `<div class="explicar"><label class="visivel-leitor" for="exp-${sec.id}">Sua explicação em até 3 linhas</label>
      <textarea id="exp-${sec.id}" rows="3" maxlength="420" placeholder="Escreva com as suas palavras, como se explicasse para um colega.">${esc(todos[chave] || "")}</textarea>
      <div class="explicar-acoes"><button type="button" class="botao" data-salvar>Salvar</button><span class="explicar-estado" aria-live="polite"></span></div>
      <p class="explicar-modelo" hidden></p></div>`);
    const caixa = p.nextElementSibling;
    caixa.querySelector("[data-salvar]").addEventListener("click", () => {
      const texto = caixa.querySelector("textarea").value.trim();
      const t = ls.ler(CHAVE_EXP, {});
      t[chave] = texto; ls.gravar(CHAVE_EXP, t);
      caixa.querySelector(".explicar-estado").textContent = texto ? "Salvo neste aparelho." : "Escreva algo antes de salvar.";
      if (texto && ctx.resumo) { const m = caixa.querySelector(".explicar-modelo"); m.hidden = false; m.innerHTML = `<b>Compare com o resumo da lição:</b> ${esc(ctx.resumo)} A sua versão cobre a mesma ideia? Para receber correção, mande no <code>/aula</code>.`; }
    });
  }

  // ---------- montagem de um exercício (lição, revisão ou exemplos) ----------
  function montarExercicio(ex, ctx) {
    if (ex.dataset.montado) return;
    ex.dataset.montado = "1";
    const tipo = tipoDe(ex);
    if (tipo === "escolha") escolha(ex, ctx);
    else if (tipo === "classificar") classificar(ex, ctx);
    else if (tipo === "preencher") preencher(ex, ctx);
    else if (tipo === "lacunas") lacunas(ex, ctx);
    else if (tipo === "ordenar") ordenar(ex, ctx);
    else if (tipo === "ache") ache(ex, ctx);
    else if (tipo === "codigo" && window.Laboratorio) window.Laboratorio.exercicio(ex, ctx, { mostrarCerto, mostrarTentativa, mostrarRevelado, mostrarAviso, resolver, pista });
  }

  // ---------- cascata do conceito: cada ambiente abre no lugar, um de cada vez ----------
  // Divide a seção em etapas: o desafio, cada bloco de leitura (pelos títulos h3), cada animação passo a passo,
  // cada exercício e o fechamento (resumo e explicar). Os elementos são só movidos para dentro da cascata
  // (../passo/cascata.js); nada do conteúdo muda. Sem a cascata carregada, a lição continua como antes.
  const curto = (t, n) => { t = String(t || "").replace(/\s+/g, " ").trim(); return t.length > n ? t.slice(0, n - 1).replace(/\s+\S*$/, "") + "..." : t; };
  const RESULTADO = { primeira: "certo de primeira", segunda: "certo na segunda tentativa", revelada: "com o gabarito", errada: "errado" };
  function cascataSecao(sec) {
    // só nos conceitos no formato padrão (que começam pelo desafio); a tarefa de domínio fica inteira, numa tela
    if (!window.Cascata || sec.querySelector(":scope > .cx") || !sec.querySelector(".exercicio.desafio")) return null;
    const h2 = sec.querySelector(":scope > h2");
    const filhos = [...sec.children], ini = h2 ? filhos.indexOf(h2) + 1 : 0;
    const grupos = [];
    let atual = null, pratica = null;
    const novo = (g) => { atual = Object.assign({ nos: [] }, g); grupos.push(atual); return atual; };
    filhos.slice(ini).forEach((el) => {
      if (el.tagName === "H3") { pratica = null; novo({ tipo: "leitura", rotulo: "Leitura", titulo: el.textContent, vazio: el }); return; }
      if (el.matches(".exercicio")) {
        const pergunta = el.querySelector(".pergunta"), rot = el.querySelector(":scope > .rotulo");
        if (el.classList.contains("desafio")) { novo({ tipo: "exercicio", rotulo: "Desafio", titulo: "Responda antes de ler: errar aqui faz parte", ex: el }); atual.nos.push(el); return; }
        if (atual && atual.tipo === "leitura" && !atual.nos.length) { pratica = atual.titulo; grupos.pop(); if (atual.vazio) atual.vazio.remove(); }
        novo({ tipo: "exercicio", rotulo: pratica || (rot ? curto(rot.textContent, 40) : "Exercício"), titulo: curto(pergunta ? pergunta.textContent : el.textContent, 90), ex: el, pratica });
        atual.nos.push(el); return;
      }
      if (el.matches("figure[data-clip]")) {
        const cap = el.querySelector("figcaption");
        // o título vem do clipe (neutro); a legenda costuma trazer a conclusão, que o "preveja" pede para apostar antes
        const tc = window.Clip && window.Clip.tituloDe ? window.Clip.tituloDe(el.dataset.clip) : "";
        novo({ tipo: "animacao", rotulo: "Ver o passo a passo", titulo: curto(tc || (el.hasAttribute("data-preveja") ? "Aposte antes e depois veja" : cap ? cap.textContent : "A animação"), 90) }); atual.nos.push(el); atual = null; return;
      }
      if (el.matches(".resumo, .explique, .explicar, [data-marcar]")) {
        if (!atual || atual.tipo !== "fecho") novo({ tipo: "fecho", rotulo: "Fechar o conceito", titulo: "Resumo e explicação com as suas palavras" });
        atual.nos.push(el); return;
      }
      if (!atual || atual.tipo !== "leitura") novo({ tipo: "leitura", rotulo: "Leitura", titulo: "Continuação" });
      atual.nos.push(el);
    });
    // grupos de prática numerados: "Pratique · 1 de 2"
    const porPratica = {};
    grupos.forEach((g) => { if (g.pratica) (porPratica[g.pratica] = porPratica[g.pratica] || []).push(g); });
    Object.values(porPratica).forEach((gs) => { if (gs.length > 1) gs.forEach((g, k) => { g.rotulo = `${g.pratica} · ${k + 1} de ${gs.length}`; }); });
    const usados = grupos.filter((g) => g.nos.length);
    if (usados.length < 2) return null;
    grupos.forEach((g) => { if (g.vazio) g.vazio.remove(); });
    const raiz = document.createElement("div");
    raiz.className = "cx";
    raiz.setAttribute("aria-label", "Etapas do conceito");
    if (h2) h2.after(raiz); else sec.prepend(raiz);
    const cx = window.Cascata(raiz, { prefixo: sec.id + "-" });
    const porEx = new Map();
    usados.forEach((g, k) => {
      const it = cx.add({ id: "e" + k, rotulo: g.rotulo, titulo: g.titulo, nos: g.nos, classe: "cx-" + g.tipo });
      it.tipo = g.tipo; it.grupo = g;
      if (g.ex) porEx.set(g.ex, it);
    });
    // o botão de seguir vem depois de todas as etapas existirem, para saber o nome da próxima
    cx.itens.forEach((it) => {
      const g = it.grupo;
      if (!g.ex) cx.seguir(it, g.tipo === "fecho" ? "Fechei este conceito" : null, () => {
        // fechar o conceito também o marca como estudado (o botão de marcar fica escondido dentro da cascata)
        if (g.tipo === "fecho") { const mk = it.corpo && it.corpo.querySelector("[data-marcar]"); if (mk && !mk.classList.contains("certo")) mk.click(); }
        cx.marcar(it, { feito: true, resumo: g.tipo === "animacao" ? "vista" : g.tipo === "fecho" ? "fechado" : "lido" });
      });
    });
    cx.porEx = porEx;
    cx.abrir(cx.itens[0], false);
    return cx;
  }
  function marcarNaCascata(ex, resultado) {
    const sec = ex.closest(".secao"), cx = sec && sec._cx;
    const it = cx && cx.porEx.get(ex);
    if (!it) return;
    cx.marcar(it, { feito: true, resumo: RESULTADO[resultado] || "feito" });
    cx.seguir(it);
  }
  // a dica de um exercício de código vai para dentro do editor, como comentário abaixo do código da pessoa
  // (o mesmo comportamento do Centro de Dados; para os exercícios data-codigo das lições)
  function dicaNoEditor(ta, pistaTexto, lingua) {
    const d = document.createElement("div"); d.innerHTML = pistaTexto || "";
    const texto = d.textContent.replace(/\s+/g, " ").trim();
    if (!texto || /^\s*(--|#) Dica:/m.test(ta.value)) return false;
    const marca = /python/i.test(lingua) ? "#" : "--", linhas = [];
    let l = "Dica:";
    texto.split(" ").forEach((p) => { if ((l + " " + p).length > 44) { linhas.push(l); l = "  " + p; } else l += " " + p; });
    linhas.push(l);
    ta.value = ta.value.replace(/\s+$/, "") + "\n\n" + linhas.map((x) => `${marca} ${x}`).join("\n") + "\n";
    ta.dispatchEvent(new Event("input"));
    ta.scrollLeft = 0;
    return true;
  }

  const resumoDe = (sec) => { const r = sec && sec.querySelector(".resumo"); return r ? r.textContent.replace(/^Resumo em uma frase/i, "").trim() : ""; };

  // ---------- a lição: passo a passo, marcar estudado, revisão ----------
  function licao(cfg) {
    const licaoId = cfg.chave.replace(/^dominio:licao:/, "");
    const url = location.pathname.split("/").pop() || licaoId + ".html";
    const titulo = (document.querySelector("h1") || {}).textContent || licaoId;
    if (window.FIG_DEFS && window.FIG) {
      document.body.insertAdjacentHTML("afterbegin", window.FIG_DEFS);
      document.querySelectorAll("[data-figura]").forEach((el) => { el.innerHTML = window.FIG[el.dataset.figura](); });
    }
    if (window.Clip) window.Clip.iniciar();
    const secoes = [...document.querySelectorAll(".secao")];
    const nomes = cfg.nomes;
    secoes.forEach((sec, i) => {
      const ctx = { licao: licaoId, titulo, url, sec: sec.id, conceito: nomes[i] || sec.id, resumo: resumoDe(sec), aoResolver: (ex, r) => { Revisao.daLicao(ctx, ex, r); marcarNaCascata(ex, r); depois(ex, r); } };
      sec.querySelectorAll(".exercicio").forEach((ex) => montarExercicio(ex, ctx));
      explicar(sec, ctx);
      sec._cx = cascataSecao(sec);
    });

    // marcar como estudado
    let feitos = ls.ler(cfg.chave, []);
    function pintar() {
      document.querySelectorAll("[data-conceito]").forEach((a) => a.classList.toggle("feito", feitos.includes(a.dataset.conceito)));
      document.querySelectorAll("[data-marcar]").forEach((b) => { if (feitos.includes(b.dataset.marcar)) { b.textContent = "Estudado"; b.classList.add("certo"); } });
    }
    document.querySelectorAll("[data-marcar]").forEach((b) => b.addEventListener("click", () => {
      if (!feitos.includes(b.dataset.marcar)) feitos.push(b.dataset.marcar);
      ls.gravar(cfg.chave, feitos);
      pintar();
    }));
    pintar();

    const links = [...document.querySelectorAll("[data-conceito]")];
    if ("IntersectionObserver" in window) {
      const obs = new IntersectionObserver((es) => es.forEach((e) => {
        if (e.isIntersecting) links.forEach((a) => a.classList.toggle("ativo", a.getAttribute("href") === "#" + e.target.id));
      }), { rootMargin: "-20% 0px -70% 0px" });
      secoes.forEach((s) => obs.observe(s));
    }

    // passo a passo: um conceito por vez
    const verTudo = document.getElementById("ver-tudo");
    const barra = document.getElementById("passos-licao");
    let atual = Math.max(0, secoes.findIndex((s) => "#" + s.id === location.hash));
    const feito = (ex) => ex.dataset.estado === "resolvido";
    const completo = (i) => [...secoes[i].querySelectorAll(".exercicio")].every(feito);
    secoes.forEach((s, i) => {
      s.insertAdjacentHTML("beforeend", `<div class="nav-licao"><button type="button" class="botao" data-anterior${i === 0 ? " disabled" : ""}>Conceito anterior</button><span class="estado-licao" aria-live="polite"></span>${i < secoes.length - 1 ? '<button type="button" class="botao primario" data-proximo>Próximo: ' + esc(nomes[i + 1] || "") + "</button>" : `<a class="botao primario" href="../index.html#trilha-${esc(cfg.trilha || "LOG")}">Voltar para a trilha</a>`}</div>`);
      s.querySelector("[data-anterior]").addEventListener("click", () => ir(i - 1));
      const prox = s.querySelector("[data-proximo]");
      if (prox) {
        prox.addEventListener("click", () => ir(i + 1));
        prox.classList.add("b-prog"); prox.style.setProperty("--p", (i + 1) / secoes.length); prox.dataset.passo = `conceito ${i + 1} de ${secoes.length}`;
      }
    });
    function atualizar() {
      secoes.forEach((s, i) => {
        const ok = completo(i);
        const prox = s.querySelector("[data-proximo]");
        if (prox) prox.disabled = !ok && !verTudo.checked;
        const est = s.querySelector(".estado-licao");
        const exs = [...s.querySelectorAll(".exercicio")];
        const prontos = exs.filter(feito).length;
        if (!est.dataset.fixo) est.textContent = exs.length ? (ok ? "Exercícios concluídos" : `Exercícios: ${prontos} de ${exs.length}`) : "";
        est.classList.toggle("ok", ok && exs.length > 0);
      });
      if (!barra) return;
      barra.innerHTML = nomes.map((n, i) => `<button type="button" data-passo="${i}" aria-label="Conceito ${i + 1}: ${esc(n)}" class="${i < atual ? "feito" : ""}${i === atual ? " atual" : ""}"${i > atual && !secoes.slice(0, i).every((_, k) => completo(k)) && !verTudo.checked ? " disabled" : ""}><i></i><span>${i + 1}. ${esc(n)}</span></button>`).join("");
      barra.querySelectorAll("[data-passo]").forEach((b) => b.addEventListener("click", () => ir(Number(b.dataset.passo))));
    }
    function ir(i, rolar = true) {
      const fazer = () => {
        atual = Math.max(0, Math.min(secoes.length - 1, i));
        secoes.forEach((s, k) => { s.hidden = !verTudo.checked && k !== atual; });
        secoes.forEach((s) => { delete s.querySelector(".estado-licao").dataset.fixo; });
        atualizar();
        if (rolar && secoes[atual].scrollIntoView) secoes[atual].scrollIntoView({ block: "start" });
      };
      if (document.startViewTransition && !reduz() && !verTudo.checked) {
        // se o navegador adiar a transição (troca vinda de temporizador), a tela troca sem animação
        let feito = false;
        const uma = () => { if (feito) return; feito = true; fazer(); };
        const t = document.startViewTransition(uma);
        [t.ready, t.finished, t.updateCallbackDone].forEach((pr) => pr && pr.catch(() => {}));
        setTimeout(() => { if (!feito) { if (t.skipTransition) t.skipTransition(); uma(); } }, 350);
      } else fazer();
    }
    let espera = null;
    function depois(ex, resultado) {
      setTimeout(() => {
        atualizar();
        const i = secoes.indexOf(ex.closest(".secao"));
        const cx = secoes[i] && secoes[i]._cx, fecho = cx && cx.itens.find((x) => x.tipo === "fecho" && !x.feito);
        if (fecho && i === atual && completo(i)) { const est = secoes[i].querySelector(".estado-licao"); est.textContent = "Exercícios concluídos. Falta fechar o conceito, na última etapa."; est.dataset.fixo = "1"; return; }
        if (!verTudo.checked && i === atual && completo(i) && resultado !== "revelada" && i < secoes.length - 1) {
          const est = secoes[i].querySelector(".estado-licao");
          est.textContent = "Tudo certo. Indo para o próximo conceito...";
          est.dataset.fixo = "1";
          clearTimeout(espera);
          espera = setTimeout(() => ir(i + 1), 2200);
        }
      }, 0);
    }
    window.addEventListener("hashchange", () => { const k = secoes.findIndex((s) => "#" + s.id === location.hash); if (k >= 0) ir(k); });
    verTudo.addEventListener("change", () => ir(atual));
    // na primeira abertura a página fica no topo (Como usar e Voltar ao mapa); só rola quem volta no meio da lição
    ir(atual, atual > 0 || secoes.some((s) => "#" + s.id === location.hash));
  }

  window.Motor = { licao, montarExercicio, criar, Revisao, idDe, resumoDe, ls, esc, hoje, somaDias, mostrarCerto, mostrarTentativa, mostrarRevelado, mostrarAviso, dicaNoEditor, cascataSecao };
})();
