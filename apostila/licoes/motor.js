// Motor didático das lições do Domínio.
// Um arquivo só para todas as lições. Ele lê cada exercício pelo HTML (atributos data-*) e cuida de:
//   - duas tentativas com pista antes do gabarito e feedback em três partes (doc 04, seção 3);
//   - Certo/Errado com confiança e saldo no estilo Cebraspe (doc 04, seção 9);
//   - cartões para arrastar em grupos, Parsons com linha falsa e recuo, "ache o erro";
//   - explicar em 3 linhas dentro da lição;
//   - revisão espaçada: o que você errou volta em 1, 3, 7, 14 e 30 dias (doc 04, seção 6);
//   - o passo a passo da lição (um conceito por vez, avanço depois dos exercícios).
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

  const TIPOS = ["escolha", "classificar", "preencher", "ordenar", "ache", "codigo"];
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
    return ctx.resumo ? `releia a ideia central: ${ctx.resumo}` : "releia a explicação logo acima e tente de novo.";
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
        mostrarTentativa(ex, { erro: `“${esc(b.textContent.trim())}” não é a resposta.`, passo: pista(ex, ctx, false) });
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
        mostrarCerto(ex); resolver(ex, ctx, tentativas > 1 ? "segunda" : "primeira"); return;
      }
      if (tentativas >= 2) {
        const r = respostas[0];
        itens().forEach((it) => { banco.appendChild(it.querySelector(".linha")); it.remove(); });
        r.forEach((x) => { const l = linhas.find((k) => k.textContent.trim() === x.t && k.closest("[data-banco]")); paraMontagem(l); l.closest(".p-item").dataset.nivel = String(x.n); l.closest(".p-item").classList.add("revelado"); });
        linhas.filter((l) => l.hasAttribute("data-falsa")).forEach((l) => l.classList.add("falsa-revelada"));
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
      else erro = `a linha ${i + 1} (“${esc(feitas[i] ? feitas[i].t : "")}”) não deveria estar nessa posição.`;
      if (feitas[i]) feitas[i].el.querySelector(".linha").classList.add("nao");
      mostrarTentativa(ex, { certo: i > 0 ? `as ${i} primeiras linhas estão no lugar certo.` : "", erro, passo: pista(ex, ctx, true) });
    });
  }

  function ache(ex, ctx) {
    const itens = [...ex.querySelectorAll(".ache-codigo li")];
    let tentativas = 0;
    itens.forEach((li, i) => {
      li.innerHTML = `<button type="button" class="ache-linha"><span class="n">${i + 1}</span><code>${li.innerHTML}</code></button>`;
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
          mostrarTentativa(ex, { certo: "", erro: `a linha ${i + 1} está certa.`, passo: pista(ex, ctx, false) });
        }
      });
    });
  }

  // ---------- explicar em 3 linhas, salvo no aparelho ----------
  const CHAVE_EXP = "dominio:explicacoes:v1";
  function explicar(sec, ctx) {
    const p = [...sec.querySelectorAll(".explique")].find((e) => /Explique em 3 linhas/i.test(e.textContent));
    if (!p || p.nextElementSibling && p.nextElementSibling.classList.contains("explicar")) return;
    const todos = ls.ler(CHAVE_EXP, {}), chave = `${ctx.licao}#${sec.id}`;
    p.insertAdjacentHTML("afterend", `<div class="explicar"><label class="visivel-leitor" for="exp-${sec.id}">Sua explicação em até 3 linhas</label>
      <textarea id="exp-${sec.id}" rows="3" maxlength="420" placeholder="Escreva com as suas palavras, como se explicasse para um colega.">${esc(todos[chave] || "")}</textarea>
      <div class="explicar-acoes"><button type="button" class="botao" data-salvar>Salvar e comparar</button><span class="explicar-estado" aria-live="polite"></span></div>
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
    else if (tipo === "ordenar") ordenar(ex, ctx);
    else if (tipo === "ache") ache(ex, ctx);
    else if (tipo === "codigo" && window.Laboratorio) window.Laboratorio.exercicio(ex, ctx, { mostrarCerto, mostrarTentativa, mostrarRevelado, mostrarAviso, resolver, pista });
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
      const ctx = { licao: licaoId, titulo, url, sec: sec.id, conceito: nomes[i] || sec.id, resumo: resumoDe(sec), aoResolver: (ex, r) => { Revisao.daLicao(ctx, ex, r); depois(ex, r); } };
      sec.querySelectorAll(".exercicio").forEach((ex) => montarExercicio(ex, ctx));
      explicar(sec, ctx);
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
      if (prox) prox.addEventListener("click", () => ir(i + 1));
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
      barra.innerHTML = nomes.map((n, i) => `<button type="button" data-passo="${i}" class="${i < atual ? "feito" : ""}${i === atual ? " atual" : ""}"${i > atual && !secoes.slice(0, i).every((_, k) => completo(k)) && !verTudo.checked ? " disabled" : ""}><i></i><span>${i + 1}. ${esc(n)}</span></button>`).join("");
      barra.querySelectorAll("[data-passo]").forEach((b) => b.addEventListener("click", () => ir(Number(b.dataset.passo))));
    }
    function ir(i) {
      const fazer = () => {
        atual = Math.max(0, Math.min(secoes.length - 1, i));
        secoes.forEach((s, k) => { s.hidden = !verTudo.checked && k !== atual; });
        secoes.forEach((s) => { delete s.querySelector(".estado-licao").dataset.fixo; });
        atualizar();
        if (secoes[atual].scrollIntoView) secoes[atual].scrollIntoView({ block: "start" });
      };
      if (document.startViewTransition && !reduz() && !verTudo.checked) document.startViewTransition(fazer);
      else fazer();
    }
    let espera = null;
    function depois(ex, resultado) {
      setTimeout(() => {
        atualizar();
        const i = secoes.indexOf(ex.closest(".secao"));
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
    ir(atual);
  }

  window.Motor = { licao, montarExercicio, Revisao, idDe, resumoDe, ls, esc, hoje, somaDias, mostrarCerto, mostrarTentativa, mostrarRevelado, mostrarAviso };
})();
