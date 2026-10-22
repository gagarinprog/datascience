// Bancadas interativas das estruturas de dados (lição ED.01). Cada uma é um quadro para mexer, sem escrever código:
// <div class="bancada" data-bancada="corrida|vetor-lista|pilha-fila|hash|arvore"></div>
// Arrastar sempre tem alternativa: tocar no item e depois no lugar (ou Enter no teclado). Com "reduzir movimento",
// as peças vão direto para o lugar. As funções de desenho (svgArvore, AVL) também servem aos clipes (clipes-ed.js).
(function () {
  "use strict";
  const reduz = () => !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const num = (n) => Number(n).toLocaleString("pt-BR");
  const flip = (els, mudar) => (window.Clip && window.Clip.flip ? window.Clip.flip(els, mudar) : mudar());
  const espera = (ms) => new Promise((r) => setTimeout(r, reduz() ? 0 : ms));

  // ---------- arrastar, com alternativa por toque e teclado ----------
  // pegavel(el, { alvos: () => [elementos que aceitam], soltar: (alvo, el) => void })
  // Tocar (ou Enter) seleciona; tocar num alvo solta ali. Arrastar faz o mesmo direto.
  let selecionado = null;
  function marcarAlvos(op, ligado) {
    op.alvos().forEach((a) => a.classList.toggle("ed-alvo", ligado));
  }
  function pegavel(el, op) {
    el.classList.add("ed-pega");
    let arrastou = false;
    el.addEventListener("pointerdown", (e) => {
      if (el.disabled || (e.button !== undefined && e.button !== 0)) return;
      const x0 = e.clientX, y0 = e.clientY;
      let fantasma = null, sobre = null;
      const r = el.getBoundingClientRect();
      arrastou = false;
      const mover = (ev) => {
        if (!arrastou && Math.hypot(ev.clientX - x0, ev.clientY - y0) < 7) return;
        ev.preventDefault();
        if (!arrastou) {
          arrastou = true;
          fantasma = el.cloneNode(true);
          fantasma.classList.add("ed-fantasma");
          fantasma.style.width = r.width + "px";
          document.body.appendChild(fantasma);
          el.classList.add("ed-levantado");
          marcarAlvos(op, true);
        }
        fantasma.style.transform = `translate(${ev.clientX - r.width / 2}px, ${ev.clientY - r.height / 2}px)`;
        const baixo = document.elementFromPoint(ev.clientX, ev.clientY);
        const alvo = baixo && op.alvos().find((a) => a === baixo || a.contains(baixo));
        if (sobre && sobre !== alvo) sobre.classList.remove("ed-sobre");
        sobre = alvo || null;
        if (sobre) sobre.classList.add("ed-sobre");
      };
      const fim = () => {
        window.removeEventListener("pointermove", mover);
        if (!arrastou) return;
        if (fantasma) fantasma.remove();
        el.classList.remove("ed-levantado");
        marcarAlvos(op, false);
        if (sobre) { sobre.classList.remove("ed-sobre"); op.soltar(sobre, el); }
        setTimeout(() => { arrastou = false; }, 0);
      };
      window.addEventListener("pointermove", mover, { passive: false });
      window.addEventListener("pointerup", fim, { once: true });
      window.addEventListener("pointercancel", fim, { once: true });
    });
    el.addEventListener("click", () => {
      if (arrastou || el.disabled) return;
      if (op.direto) { op.direto(el); return; }
      const ja = selecionado && selecionado.el === el;
      if (selecionado) { selecionado.el.setAttribute("aria-pressed", "false"); marcarAlvos(selecionado.op, false); }
      selecionado = ja ? null : { el, op };
      if (selecionado) { el.setAttribute("aria-pressed", "true"); marcarAlvos(op, true); }
    });
  }
  // um alvo recebe o item selecionado por toque ou teclado
  function alvo(el, op) {
    el.addEventListener("click", () => {
      if (!selecionado || selecionado.op !== op || !op.alvos().includes(el)) return;
      const item = selecionado.el;
      item.setAttribute("aria-pressed", "false");
      marcarAlvos(op, false);
      selecionado = null;
      op.soltar(el, item);
    });
  }

  // contador que sobe até o valor (ou salta, com reduzir movimento)
  function contar(el, ate, ms = 1100) {
    if (reduz() || !ate) { el.textContent = num(ate); return Promise.resolve(); }
    return new Promise((ok) => {
      const t0 = performance.now();
      const passo = (t) => {
        const f = Math.min(1, (t - t0) / ms), v = Math.round(ate * (1 - Math.pow(1 - f, 3)));
        el.textContent = num(v);
        if (f < 1) requestAnimationFrame(passo); else ok();
      };
      requestAnimationFrame(passo);
    });
  }

  // =================== 1. a corrida: achar um aluno ===================
  const TAMANHOS = [10, 100, 1000, 100000, 1000000];
  function corrida(b) {
    b.innerHTML = `<p class="ed-instr">Escolha quantos alunos há no cadastro e procure o último deles. Compare quantos passos cada organização precisa.</p>
      <label class="ed-campo"><span>Alunos no cadastro: <b data-n>1.000</b></span><input type="range" min="0" max="4" step="1" value="2" aria-valuetext="1.000 alunos"></label>
      <div class="ed-pistas">
        ${[["lista", "Lista sem ordem", "olha um por um, do começo ao fim"], ["arvore", "Árvore equilibrada (ou busca binária)", "descarta metade a cada passo"], ["dict", "Dicionário (tabela hash)", "calcula a gaveta e vai direto"]]
          .map(([id, nome, como]) => `<div class="ed-pista" data-p="${id}"><div class="ed-pista-cab"><b>${nome}</b><small>${como}</small></div><div class="ed-trilho"><i></i></div><p class="ed-passos"><span data-c>0</span> <small>passos</small></p></div>`).join("")}
      </div>
      <div class="ed-acoes"><button type="button" class="botao primario" data-procurar>Procurar o último aluno</button></div>
      <p class="ed-nota" aria-live="polite"></p>`;
    const range = b.querySelector("input"), nEl = b.querySelector("[data-n]"), nota = b.querySelector(".ed-nota");
    const n = () => TAMANHOS[Number(range.value)];
    const zerar = () => {
      nEl.textContent = num(n()); range.setAttribute("aria-valuetext", `${num(n())} alunos`);
      b.querySelectorAll(".ed-pista").forEach((p) => { p.querySelector("[data-c]").textContent = "0"; p.querySelector(".ed-trilho i").style.width = "0"; p.classList.remove("chegou"); });
      nota.textContent = "";
    };
    range.addEventListener("input", zerar);
    b.querySelector("[data-procurar]").addEventListener("click", async () => {
      const N = n(), passos = { lista: N, arvore: Math.ceil(Math.log2(N + 1)), dict: 1 };
      zerar();
      await Promise.all(Object.entries(passos).map(async ([id, v]) => {
        const p = b.querySelector(`[data-p="${id}"]`);
        p.querySelector(".ed-trilho i").style.width = `${Math.max(2, (v / N) * 100)}%`;
        await contar(p.querySelector("[data-c]"), v, id === "lista" ? 1400 : 700);
        p.querySelector(".ed-passos small").textContent = v === 1 ? "passo" : "passos";
        p.classList.add("chegou");
      }));
      nota.textContent = N >= 100000
        ? `Com ${num(N)} alunos, a lista precisou de ${num(N)} passos; a árvore, ${passos.arvore}; o dicionário, 1. Os dados são os mesmos: só a organização mudou.`
        : `Com ${num(N)} alunos: lista ${num(N)} passos, árvore ${passos.arvore}, dicionário 1. Aumente o cadastro e veja quem sofre.`;
    });
    zerar();
  }

  // =================== 2. vetor e lista ligada: inserir ===================
  function vetorLista(b) {
    const INICIAIS = ["Ana", "Bia", "Caio", "Davi", "Eva"], NOVOS = ["Zé", "Lia", "Rui"];
    let itens = [...INICIAIS], novos = [...NOVOS], ultimo = null;
    b.innerHTML = `<p class="ed-instr">Arraste o novo aluno para uma posição do vetor (ou toque nele e depois na posição). A mesma inserção acontece nas duas estruturas.</p>
      <div class="ed-bandeja" aria-label="Alunos para inserir"></div>
      <div class="ed-linha-est"><p class="ed-rot">Vetor: lado a lado, com posição numerada</p><div class="ed-vetor" role="group" aria-label="Vetor" tabindex="0"></div><p class="ed-conta" data-cv>&nbsp;</p></div>
      <div class="ed-linha-est"><p class="ed-rot">Lista ligada: cada um aponta para o próximo</p><div class="ed-lista" role="group" aria-label="Lista ligada" tabindex="0"></div><p class="ed-conta" data-cl>&nbsp;</p></div>
      <div class="ed-acoes"><button type="button" class="botao" data-pegar>Pegar o 4º aluno</button><button type="button" class="botao" data-recomecar>Recomeçar</button></div>`;
    const bandeja = b.querySelector(".ed-bandeja"), vet = b.querySelector(".ed-vetor"), lis = b.querySelector(".ed-lista");
    const op = { alvos: () => [...vet.querySelectorAll(".ed-vaga")], soltar: (vaga, chip) => inserir(Number(vaga.dataset.i), chip.dataset.nome) };
    function desenharBandeja() {
      bandeja.innerHTML = novos.length ? `<button type="button" class="ed-chip" data-nome="${esc(novos[0])}" aria-pressed="false">Novo: ${esc(novos[0])}</button>` : `<span class="ed-nota">Todos os novos já entraram. Recomece para ver de novo.</span>`;
      const c = bandeja.querySelector(".ed-chip");
      if (c) pegavel(c, op);
    }
    function desenhar(mudou) {
      const celulas = itens.map((t, i) => `<span class="ed-cel${t === ultimo ? " novo" : ""}" data-nome="${esc(t)}"><b>${esc(t)}</b><small>${i}</small></span>`);
      vet.innerHTML = itens.map((t, i) => `<button type="button" class="ed-vaga" data-i="${i}" aria-label="Inserir na posição ${i}"></button>${celulas[i]}`).join("") + `<button type="button" class="ed-vaga" data-i="${itens.length}" aria-label="Inserir na posição ${itens.length}, no fim"></button>`;
      vet.querySelectorAll(".ed-vaga").forEach((v) => alvo(v, op));
      lis.innerHTML = `<span class="ed-ini">início</span>` + itens.map((t, i) => `<span class="ed-no${t === ultimo ? " novo" : ""}" data-nome="${esc(t)}"><b>${esc(t)}</b></span><span class="ed-seta${mudou && mudou.includes(i) ? " mudou" : ""}" aria-hidden="true">→</span>`).join("") + `<span class="ed-fim">fim</span>`;
    }
    function inserir(pos, nome) {
      const antes = [...vet.querySelectorAll(".ed-cel"), ...lis.querySelectorAll(".ed-no")];
      const andaram = itens.length - pos;
      itens.splice(pos, 0, nome); novos.shift(); ultimo = nome;
      // na lista, mudam a seta do anterior (ou o início) e a do novo
      const mudou = pos === 0 ? [0] : [pos - 1, pos];
      flip(antes, () => desenhar(mudou));
      b.querySelector("[data-cv]").innerHTML = `<b>${andaram}</b> ${andaram === 1 ? "aluno andou" : "alunos andaram"} uma casa para abrir espaço${andaram ? "" : " (no fim, ninguém anda)"}.`;
      b.querySelector("[data-cl]").innerHTML = `<b>${pos === 0 ? 2 : pos === itens.length - 1 ? 1 : 2}</b> ${pos === itens.length - 1 ? "seta mudou" : "setas mudaram"}, sem ninguém andar; mas para chegar à posição ${pos} a lista percorreu ${pos} ${pos === 1 ? "nó" : "nós"}.`;
      desenharBandeja();
    }
    b.querySelector("[data-pegar]").addEventListener("click", async () => {
      const cels = vet.querySelectorAll(".ed-cel"), nos = lis.querySelectorAll(".ed-no");
      if (cels.length < 4) return;
      cels.forEach((c) => c.classList.remove("acesa")); nos.forEach((c) => c.classList.remove("acesa"));
      cels[3].classList.add("acesa");
      b.querySelector("[data-cv]").innerHTML = `Posição 3: o vetor vai <b>direto</b>, em <b>1 passo</b> (é só fazer a conta do endereço).`;
      b.querySelector("[data-cl]").innerHTML = "Andando de nó em nó...";
      for (let i = 0; i < 4; i++) { nos.forEach((c) => c.classList.remove("acesa")); nos[i].classList.add("acesa"); await espera(420); }
      b.querySelector("[data-cl]").innerHTML = `A lista precisou de <b>4 passos</b>: do início, seguindo as setas, até o 4º.`;
    });
    b.querySelector("[data-recomecar]").addEventListener("click", () => {
      itens = [...INICIAIS]; novos = [...NOVOS]; ultimo = null;
      desenhar(); desenharBandeja();
      b.querySelector("[data-cv]").innerHTML = "&nbsp;"; b.querySelector("[data-cl]").innerHTML = "&nbsp;";
    });
    desenhar(); desenharBandeja();
  }

  // =================== 3. pilha e fila: entrar, apostar, sair ===================
  function pilhaFila(b) {
    const PRATOS = ["azul", "verde", "amarelo", "vermelho"], PEDIDOS = ["#101 pizza", "#102 açaí", "#103 lanche", "#104 sushi"];
    const est = { pilha: { itens: [], fonte: [...PRATOS] }, fila: { itens: [], fonte: [...PEDIDOS] } };
    const aposta = { pilha: null, fila: null };
    b.innerHTML = `<p class="ed-instr">Arraste (ou toque) os pratos para a pilha e os pedidos para a fila. Com dois ou mais, toque no item que você acha que sai primeiro e depois em Tirar.</p>
      <div class="ed-pf">
        ${[["pilha", "Pilha de pratos", "o último que entra é o primeiro que sai"], ["fila", "Fila do delivery", "o primeiro que entra é o primeiro que sai"]]
          .map(([id, nome, regra]) => `<div class="ed-pf-col" data-e="${id}"><p class="ed-rot">${nome}<small>${regra}</small></p><div class="ed-bandeja" data-b="${id}"></div>
          <div class="ed-${id}" data-area="${id}" role="group" aria-label="${nome}"></div>
          <div class="ed-acoes"><button type="button" class="botao" data-tirar="${id}" disabled>Tirar ${id === "pilha" ? "o de cima" : "o da frente"}</button></div>
          <p class="ed-veredito" data-v="${id}" aria-live="polite"></p></div>`).join("")}
      </div>`;
    const area = (id) => b.querySelector(`[data-area="${id}"]`);
    function desenhar(id) {
      const e = est[id], bd = b.querySelector(`[data-b="${id}"]`);
      bd.innerHTML = e.fonte.length ? `<button type="button" class="ed-chip ${id === "pilha" ? `prato p-${e.fonte[0]}` : "pedido"}" data-nome="${esc(e.fonte[0])}">${id === "pilha" ? `prato ${esc(e.fonte[0])}` : esc(e.fonte[0])}</button>` : `<span class="ed-nota">Acabaram. Tire alguns para ver a ordem.</span>`;
      const chip = bd.querySelector(".ed-chip");
      if (chip) pegavel(chip, { alvos: () => [area(id)], soltar: () => entrar(id), direto: () => entrar(id) });
      const ordem = id === "pilha" ? [...e.itens].reverse() : e.itens;
      area(id).innerHTML = ordem.map((t) => `<button type="button" class="ed-item ${id === "pilha" ? `prato p-${t}` : "pedido"}${aposta[id] === t ? " apostado" : ""}" data-nome="${esc(t)}" aria-pressed="${aposta[id] === t}" aria-label="${id === "pilha" ? `prato ${t}` : t}: apostar que sai primeiro">${id === "pilha" ? `prato ${esc(t)}` : esc(t)}</button>`).join("") || `<span class="ed-vazio">vazia</span>`;
      area(id).querySelectorAll(".ed-item").forEach((it) => it.addEventListener("click", () => {
        if (e.itens.length < 2) return;
        aposta[id] = it.dataset.nome; desenhar(id);
        b.querySelector(`[data-v="${id}"]`).textContent = `Sua aposta: ${id === "pilha" ? "prato " : ""}${it.dataset.nome}. Agora toque em Tirar.`;
      }));
      b.querySelector(`[data-tirar="${id}"]`).disabled = !e.itens.length;
    }
    function entrar(id) {
      const e = est[id]; if (!e.fonte.length) return;
      const nome = e.fonte.shift();
      const antes = [...area(id).querySelectorAll(".ed-item")];
      e.itens.push(nome);
      flip(antes, () => desenhar(id));
      const novo = area(id).querySelector(`[data-nome="${CSS.escape(nome)}"]`);
      if (novo && !reduz() && novo.animate) novo.animate([{ opacity: 0, transform: id === "pilha" ? "translateY(-18px)" : "translateX(18px)" }, { opacity: 1, transform: "none" }], { duration: 380, easing: "cubic-bezier(.2,0,0,1)" });
      b.querySelector(`[data-v="${id}"]`).textContent = "";
    }
    async function tirar(id) {
      const e = est[id]; if (!e.itens.length) return;
      const sai = id === "pilha" ? e.itens[e.itens.length - 1] : e.itens[0];
      const el = area(id).querySelector(`[data-nome="${CSS.escape(sai)}"]`);
      el.classList.add("saindo");
      await espera(380);
      if (id === "pilha") e.itens.pop(); else e.itens.shift();
      const v = b.querySelector(`[data-v="${id}"]`);
      const nome = `${id === "pilha" ? "prato " : ""}${sai}`;
      v.textContent = aposta[id] == null ? `Saiu ${nome}: ${id === "pilha" ? "o último que entrou" : "o primeiro que entrou"}.`
        : aposta[id] === sai ? `Acertou: saiu ${nome}, ${id === "pilha" ? "o último que entrou (LIFO)" : "o primeiro que entrou (FIFO)"}.`
          : `Não foi desta vez: saiu ${nome}. ${id === "pilha" ? "Na pilha, sai o último que entrou (LIFO)." : "Na fila, sai o primeiro que entrou (FIFO)."}`;
      v.className = "ed-veredito" + (aposta[id] == null ? "" : aposta[id] === sai ? " ok" : " nao");
      aposta[id] = null;
      const resto = [...area(id).querySelectorAll(".ed-item")].filter((x) => x !== el);
      flip(resto, () => desenhar(id));
    }
    ["pilha", "fila"].forEach((id) => { desenhar(id); b.querySelector(`[data-tirar="${id}"]`).addEventListener("click", () => tirar(id)); });
  }

  // =================== 4. tabela hash: cada chave na sua gaveta ===================
  const CHAVES = [1000, 1050, 1100, 1150, 1200, 1250, 1300];
  function hash(b) {
    let M = 50, onde = {};
    b.innerHTML = `<p class="ed-instr">A gaveta de cada chave é o resto da divisão por M (<code>k % M</code>). Arraste cada chave para a gaveta certa (ou toque na chave e depois na gaveta). Depois troque M e compare.</p>
      <div class="ed-ms" role="radiogroup" aria-label="Tamanho da tabela (M)">${[50, 53].map((m) => `<button type="button" role="radio" class="ed-m" data-m="${m}" aria-checked="${m === M}">M = ${m}${m === 53 ? " (primo)" : ""}</button>`).join("")}</div>
      <div class="ed-bandeja ed-chaves" aria-label="Chaves para guardar"></div>
      <div class="ed-gavetas" role="group" aria-label="Gavetas da tabela"></div>
      <div class="ed-acoes"><button type="button" class="botao" data-todas>Guardar todas (o computador calcula)</button><button type="button" class="botao" data-procurar>Procurar 1300</button></div>
      <div class="ed-placar" aria-live="polite"></div>
      <ul class="ed-cadeias"></ul>`;
    const bandeja = b.querySelector(".ed-chaves"), gav = b.querySelector(".ed-gavetas"), placar = b.querySelector(".ed-placar"), cadeias = b.querySelector(".ed-cadeias");
    const op = { alvos: () => [...gav.querySelectorAll(".ed-gav")], soltar: (g, chip) => guardar(Number(chip.dataset.k), Number(g.dataset.i), chip) };
    function desenhar() {
      const livres = CHAVES.filter((k) => onde[k] === undefined);
      bandeja.innerHTML = livres.map((k) => `<button type="button" class="ed-chip chave" data-k="${k}" aria-pressed="false">${k}</button>`).join("") || `<span class="ed-nota">Todas guardadas.</span>`;
      bandeja.querySelectorAll(".ed-chip").forEach((c) => pegavel(c, op));
      const cont = {};
      Object.entries(onde).forEach(([k, g]) => { (cont[g] = cont[g] || []).push(Number(k)); });
      gav.innerHTML = Array.from({ length: M }, (_, i) => { const q = (cont[i] || []).length; return `<button type="button" class="ed-gav${q > 1 ? " colide" : q ? " ocupada" : ""}" data-i="${i}" aria-label="Gaveta ${i}${q ? `, ${q} ${q === 1 ? "chave" : "chaves"}` : ", vazia"}"><small>${i}</small>${q ? `<b>${q > 1 ? q : "•"}</b>` : ""}</button>`; }).join("");
      gav.querySelectorAll(".ed-gav").forEach((g) => alvo(g, op));
      const ocupadas = Object.keys(cont).length, maior = Math.max(0, ...Object.values(cont).map((l) => l.length)), guardadas = Object.keys(onde).length;
      placar.innerHTML = guardadas ? `<span><b>${guardadas}</b> chaves guardadas</span><span><b>${ocupadas}</b> ${ocupadas === 1 ? "gaveta ocupada" : "gavetas ocupadas"}</span><span class="${maior > 1 ? "alerta" : ""}"><b>${maior}</b> na gaveta mais cheia${maior > 1 ? ": colisão" : ""}</span>` : "";
      cadeias.innerHTML = Object.entries(cont).sort((a, z) => z[1].length - a[1].length).slice(0, 3).map(([g, l]) => `<li><b>Gaveta ${g}:</b> ${l.join(" → ")}</li>`).join("");
    }
    function guardar(k, g, chip) {
      const certa = k % M;
      if (g !== certa) {
        placar.innerHTML = `<span class="alerta">${k} % ${M} = ${certa}: a chave ${k} vai para a gaveta <b>${certa}</b>, não para a ${g}. (${k} = ${M} × ${Math.floor(k / M)} + ${certa})</span>`;
        if (chip && !reduz() && chip.animate) chip.animate([{ transform: "translateX(0)" }, { transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "translateX(0)" }], { duration: 300 });
        return;
      }
      onde[k] = g; desenhar();
      const alvoG = gav.querySelector(`[data-i="${g}"]`);
      if (alvoG && !reduz() && alvoG.animate) alvoG.animate([{ transform: "scale(1.25)" }, { transform: "scale(1)" }], { duration: 320 });
    }
    b.querySelectorAll(".ed-m").forEach((x) => x.addEventListener("click", () => {
      M = Number(x.dataset.m); onde = {};
      b.querySelectorAll(".ed-m").forEach((y) => y.setAttribute("aria-checked", String(y === x)));
      desenhar();
    }));
    b.querySelector("[data-todas]").addEventListener("click", async () => {
      for (const k of CHAVES) if (onde[k] === undefined) { guardar(k, k % M); await espera(160); }
    });
    b.querySelector("[data-procurar]").addEventListener("click", async () => {
      const g = 1300 % M;
      if (onde[1300] === undefined) { placar.innerHTML = `<span>Guarde a chave 1300 primeiro.</span>`; return; }
      const fila = Object.entries(onde).filter(([, x]) => x === g).map(([k]) => Number(k)).sort((a, z) => a - z);
      const pos = fila.indexOf(1300) + 1;
      const el = gav.querySelector(`[data-i="${g}"]`);
      el.classList.add("acesa"); await espera(700); el.classList.remove("acesa");
      placar.innerHTML = `<span>1300 % ${M} = ${g}: vai direto à gaveta ${g}${pos > 1 ? ` e confere ${pos} chaves da fila até achar: <b class="alerta">${pos} comparações</b>` : `, e acha na primeira: <b>1 comparação</b>`}.</span>`;
    });
    desenhar();
  }

  // =================== 5. árvores: ABB e AVL ===================
  const alt = (n) => (n ? n.h : -1);
  const atual = (n) => { n.h = 1 + Math.max(alt(n.e), alt(n.d)); return n; };
  const fb = (n) => alt(n.e) - alt(n.d);
  const copiar = (n) => (n ? { k: n.k, h: n.h, e: copiar(n.e), d: copiar(n.d) } : null);
  function rotEsq(n) { const r = n.d; n.d = r.e; r.e = n; atual(n); atual(r); return r; }
  function rotDir(n) { const l = n.e; n.e = l.d; l.d = n; atual(n); atual(l); return l; }
  function insAbb(n, k) {
    if (!n) return { k, h: 0, e: null, d: null };
    if (k < n.k) n.e = insAbb(n.e, k); else if (k > n.k) n.d = insAbb(n.d, k);
    return atual(n);
  }
  // AVL com a regra dos sinais dos slides da UFMS: fb = h(esq) − h(dir)
  function insAvl(n, k, log) {
    if (!n) return { k, h: 0, e: null, d: null };
    if (k < n.k) n.e = insAvl(n.e, k, log); else if (k > n.k) n.d = insAvl(n.d, k, log); else return n;
    atual(n);
    const b = fb(n);
    if (b === -2) {
      if (fb(n.d) <= 0) { log.push({ tipo: "RE", no: n.k, nome: "rotação simples à esquerda" }); return rotEsq(n); }
      log.push({ tipo: "RDE", no: n.k, nome: "rotação dupla direita-esquerda" }); n.d = rotDir(n.d); return rotEsq(n);
    }
    if (b === 2) {
      if (fb(n.e) >= 0) { log.push({ tipo: "RD", no: n.k, nome: "rotação simples à direita" }); return rotDir(n); }
      log.push({ tipo: "RED", no: n.k, nome: "rotação dupla esquerda-direita" }); n.e = rotEsq(n.e); return rotDir(n);
    }
    return n;
  }
  const altura = (n) => alt(n);
  function nos(n, arr = []) { if (n) { nos(n.e, arr); arr.push(n); nos(n.d, arr); } return arr; }
  function caminho(n, k) { const c = []; while (n) { c.push(n.k); if (k === n.k) break; n = k < n.k ? n.e : n.d; } return c; }
  function posicoes(raiz, W, H) {
    const lista = [], pos = {};
    (function em(n, d) { if (!n) return; em(n.e, d + 1); lista.push([n, d]); em(n.d, d + 1); })(raiz, 0);
    const passo = Math.min(64, (W - 40) / Math.max(1, lista.length - 1 || 1));
    const larg = passo * Math.max(0, lista.length - 1), x0 = (W - larg) / 2;
    lista.forEach(([n, d], i) => { pos[n.k] = { x: lista.length === 1 ? W / 2 : x0 + i * passo, y: 30 + d * H }; });
    return pos;
  }
  // desenho estático (usado pelos clipes e como quadro de cada passo da animação)
  function svgArvore(raiz, o = {}) {
    const W = o.largura || 420, H = o.passoY || 62;
    const prof = Math.max(0, altura(raiz)), alto = 30 + prof * H + 50;
    const pos = o.pos || posicoes(raiz, W, H);
    const marca = o.marcas || {};
    let linhas = "", circs = "";
    (function anda(n) {
      if (!n) return;
      [n.e, n.d].forEach((f) => { if (f && pos[f.k]) linhas += `<line x1="${pos[n.k].x}" y1="${pos[n.k].y}" x2="${pos[f.k].x}" y2="${pos[f.k].y}" class="ed-aresta${marca[f.k] === "caminho" && marca[n.k] === "caminho" ? " caminho" : ""}"/>`; });
      anda(n.e); anda(n.d);
    })(raiz);
    nos(raiz).forEach((n) => {
      const p = pos[n.k], f = fb(n), cls = marca[n.k] || (Math.abs(f) > 1 ? "pesado" : "");
      circs += `<g class="ed-nos ${cls}" transform="translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})"><circle r="23"/><text y="5" text-anchor="middle">${n.k}</text>${o.fb === false ? "" : `<text class="ed-fb" y="39" text-anchor="middle">${f > 0 ? "+" : ""}${f}</text>`}</g>`;
    });
    // ajustar: o desenho ocupa só a largura da árvore (nas animações); sem isso, a largura é fixa (na bancada, sem pular de escala)
    let vx = 0, vw = W;
    if (o.ajustar) { const xs = Object.values(pos).map((q) => q.x); const a = Math.min(...xs) - 36, z = Math.max(...xs) + 36; vw = Math.max(240, z - a); vx = (a + z) / 2 - vw / 2; }
    return `<svg class="ed-arvore-svg" viewBox="${vx.toFixed(1)} 0 ${vw.toFixed(1)} ${Math.max(alto, 90)}" role="img" aria-label="${esc(o.rotulo || "Árvore com " + nos(raiz).length + " nós e altura " + Math.max(0, altura(raiz)))}">${linhas}${circs}</svg>`;
  }
  // anima de um desenho para outro (posições interpoladas); com reduzir movimento, só troca
  function animarArvore(caixa, raiz, o, antes) {
    const W = o.largura || 420, H = o.passoY || 62;
    const alvo = posicoes(raiz, W, H);
    if (reduz() || !antes) { caixa.innerHTML = svgArvore(raiz, { ...o, pos: alvo }); return Promise.resolve(alvo); }
    return new Promise((ok) => {
      const t0 = performance.now(), ms = 520;
      const quadro = (t) => {
        const f = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - f, 3), pos = {};
        Object.entries(alvo).forEach(([k, p]) => { const a = antes[k] || alvo[o.pai && o.pai[k]] || p; pos[k] = { x: a.x + (p.x - a.x) * e, y: a.y + (p.y - a.y) * e }; });
        caixa.innerHTML = svgArvore(raiz, { ...o, pos });
        if (f < 1) requestAnimationFrame(quadro); else ok(alvo);
      };
      requestAnimationFrame(quadro);
    });
  }
  function arvore(b) {
    const ORDENADA = [1000, 1050, 1100, 1150, 1200, 1250, 1300];
    let modo = "abb", raiz = null, pos = null, ocupado = false;
    b.innerHTML = `<p class="ed-instr">As leituras da telemetria chegam em ordem: 1000, 1050, 1100... Toque (ou arraste) cada chave para a árvore. Compare a ABB comum com a AVL, que gira para se equilibrar. O número embaixo de cada nó é o fator de balanceamento.</p>
      <div class="ed-ms" role="radiogroup" aria-label="Tipo de árvore">${[["abb", "ABB comum"], ["avl", "AVL (equilibra)"]].map(([m, t]) => `<button type="button" role="radio" class="ed-m" data-m="${m}" aria-checked="${m === modo}">${t}</button>`).join("")}</div>
      <div class="ed-bandeja ed-chaves" aria-label="Chaves para inserir"></div>
      <div class="ed-arvore" data-area tabindex="-1"><span class="ed-vazio">árvore vazia</span></div>
      <div class="ed-placar" aria-live="polite"></div>
      <div class="ed-acoes"><button type="button" class="botao" data-todas>Inserir todas</button><button type="button" class="botao" data-buscar>Procurar 1300</button><button type="button" class="botao" data-recomecar>Recomeçar</button></div>`;
    const caixa = b.querySelector("[data-area]"), bandeja = b.querySelector(".ed-chaves"), placar = b.querySelector(".ed-placar");
    const op = { alvos: () => [caixa], soltar: (_a, chip) => inserir(Number(chip.dataset.k)), direto: (chip) => inserir(Number(chip.dataset.k)) };
    const restam = () => ORDENADA.filter((k) => !nos(raiz).some((n) => n.k === k));
    function desenharBandeja() {
      const r = restam();
      bandeja.innerHTML = r.length ? `<button type="button" class="ed-chip chave" data-k="${r[0]}">${r[0]}</button>${r.slice(1).map((k) => `<span class="ed-chip chave espera">${k}</span>`).join("")}` : `<span class="ed-nota">Todas inseridas.</span>`;
      const c = bandeja.querySelector("button.ed-chip");
      if (c) pegavel(c, op);
    }
    function contarPlacar(extra) {
      const n = nos(raiz).length, h = Math.max(0, altura(raiz));
      placar.innerHTML = n ? `<span><b>${n}</b> ${n === 1 ? "nó" : "nós"}</span><span class="${modo === "abb" && n > 2 && h === n - 1 ? "alerta" : ""}"><b>${h}</b> de altura</span><span>até <b>${h + 1}</b> comparações para achar uma chave</span>${extra ? `<span class="ed-evento">${extra}</span>` : ""}` : "";
    }
    async function inserir(k) {
      if (ocupado || !restam().includes(k)) return;
      ocupado = true;
      const paiDe = {}; let p = raiz;
      while (p) { paiDe[k] = p.k; p = k < p.k ? p.e : p.d; }
      if (modo === "abb") {
        raiz = insAbb(raiz, k);
        pos = await animarArvore(caixa, raiz, { pai: paiDe, marcas: { [k]: "novo" } }, pos);
        contarPlacar(nos(raiz).length > 2 && altura(raiz) === nos(raiz).length - 1 ? "Chaves em ordem: a ABB virou uma fila, e a busca ficou O(n)." : "");
      } else {
        // primeiro entra como na ABB (pode desequilibrar); depois a AVL gira
        const desequ = insAbb(copiar(raiz), k), log = [];
        pos = await animarArvore(caixa, desequ, { pai: paiDe, marcas: { [k]: "novo" } }, pos);
        const novo = insAvl(copiar(raiz), k, log);
        if (log.length) {
          const r = log[0];
          contarPlacar(`O nó ${r.no} ficou com fator ${fb(nos(desequ).find((n) => n.k === r.no))}: ${r.nome} (${r.tipo}).`);
          await espera(1100);
          raiz = novo;
          pos = await animarArvore(caixa, raiz, { marcas: { [k]: "novo" } }, pos);
          contarPlacar(`Depois da ${r.nome}, todos os fatores voltaram a −1, 0 ou +1.`);
        } else { raiz = novo; contarPlacar("Equilibrada: nenhum fator passou de 1, nada a girar."); }
      }
      desenharBandeja();
      ocupado = false;
    }
    b.querySelectorAll(".ed-m").forEach((x) => x.addEventListener("click", () => {
      if (ocupado) return;
      modo = x.dataset.m; raiz = null; pos = null;
      b.querySelectorAll(".ed-m").forEach((y) => y.setAttribute("aria-checked", String(y === x)));
      caixa.innerHTML = `<span class="ed-vazio">árvore vazia</span>`; contarPlacar(); desenharBandeja();
    }));
    b.querySelector("[data-todas]").addEventListener("click", async () => { for (const k of restam()) { await inserir(k); await espera(250); } });
    b.querySelector("[data-recomecar]").addEventListener("click", () => { if (ocupado) return; raiz = null; pos = null; caixa.innerHTML = `<span class="ed-vazio">árvore vazia</span>`; contarPlacar(); desenharBandeja(); });
    b.querySelector("[data-buscar]").addEventListener("click", async () => {
      if (ocupado || !nos(raiz).some((n) => n.k === 1300)) { placar.innerHTML = `<span>Insira a chave 1300 primeiro.</span>`; return; }
      ocupado = true;
      const c = caminho(raiz, 1300), marcas = {};
      for (const k of c) { marcas[k] = "caminho"; caixa.innerHTML = svgArvore(raiz, { pos, marcas }); await espera(380); }
      contarPlacar(`Para achar 1300: ${c.join(" → ")}, ${c.length} ${c.length === 1 ? "comparação" : "comparações"}.`);
      ocupado = false;
    });
    contarPlacar(); desenharBandeja();
  }

  const BANCADAS = { corrida, "vetor-lista": vetorLista, "pilha-fila": pilhaFila, hash, arvore };
  function iniciar(raiz) {
    (raiz || document).querySelectorAll("[data-bancada]").forEach((b) => {
      if (b.dataset.pronto || !BANCADAS[b.dataset.bancada]) return;
      b.dataset.pronto = "1";
      b.classList.add("bancada");
      BANCADAS[b.dataset.bancada](b);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => iniciar()); else iniciar();
  window.Estruturas = { iniciar, svgArvore, insAbb, insAvl, copiar, fb, altura, nos, caminho, posicoes };
})();
