// Clipes: pequenos vídeos animados (GSAP, github.com/greensock/GSAP) com legenda, play, pausa, barra de tempo e velocidade.
// Cada clipe é um palco SVG de 640 x 360 e uma linha do tempo. A legenda muda conforme o tempo, inclusive ao arrastar a barra.
(function () {
  const C = {};
  const caixa = (x, y, w, h, cls = "cl-caixa", r = 12) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" class="${cls}"/>`;
  const texto = (x, y, t, cls = "cl-t", extra = "") => `<text x="${x}" y="${y}" class="${cls}" text-anchor="middle" dominant-baseline="central" ${extra}>${t}</text>`;

  // traça uma linha do começo ao fim (efeito de desenho), reversível ao voltar na barra
  function tracar(t, el, dur, pos) {
    const L = el.getTotalLength();
    el.style.strokeDasharray = `${L} ${L}`;
    el.style.strokeDashoffset = L;
    t.to(el, { strokeDashoffset: 0, duration: dur, ease: "power1.inOut" }, pos);
  }
  // move um objeto por uma sequência de pontos
  function percorrer(t, el, pontos, durCada, pos) {
    pontos.forEach(([x, y], i) => t.to(el, { x, y, duration: durCada, ease: "power1.inOut" }, i === 0 ? pos : ">"));
  }
  const surgir = { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(1.8)", transformOrigin: "50% 50%" };

  // ---------- LOG: o caminho do frete ----------
  C.LOG = [{
    titulo: "O caminho do frete grátis",
    fim: 12.6,
    legendas: [
      [0, "Um algoritmo de frete grátis, desenhado como fluxograma."],
      [1.6, "Entra o valor do carrinho: R$ 120."],
      [3.2, "A decisão pergunta: 120 é maior ou igual a 100? Sim."],
      [4.4, "Pelo caminho do sim, o frete fica zero."],
      [5.8, "Sai o total: R$ 120."],
      [7.2, "Agora o mesmo algoritmo com R$ 80."],
      [8.8, "80 é maior ou igual a 100? Não."],
      [9.6, "Pelo caminho do não, entra R$ 15 de frete."],
      [11.0, "Sai o total: R$ 95. Mesmo algoritmo, caminhos diferentes."],
    ],
    svg: `
      <g class="cl-linhas" opacity="0">
        <path class="cl-linha" d="M150,180 H175"/><path class="cl-linha" d="M250,130 V65 H340"/><path class="cl-linha" d="M250,230 V295 H340"/>
        <path class="cl-linha" d="M470,65 H567 V150"/><path class="cl-linha" d="M470,295 H567 V210"/>
      </g>
      <path class="cl-luz" id="luz-sim" d="M250,130 V65 H340"/><path class="cl-luz" id="luz-sim2" d="M470,65 H567 V150"/>
      <path class="cl-luz" id="luz-nao" d="M250,230 V295 H340"/><path class="cl-luz" id="luz-nao2" d="M470,295 H567 V210"/>
      <g class="peca" opacity="0">${caixa(20, 140, 130, 80)}${texto(85, 165, "entrada", "cl-t2")}
        <g id="ent-120">${texto(85, 192, "R$ 120", "cl-tb")}</g><g id="ent-80" opacity="0">${texto(85, 192, "R$ 80", "cl-tb")}</g></g>
      <g class="peca" opacity="0" id="losango"><path d="M250,130 L325,180 L250,230 L175,180 Z" class="cl-cor-suave"/>${texto(250, 172, "carrinho", "cl-t")}${texto(250, 192, "≥ 100?", "cl-tb")}</g>
      <g class="peca" opacity="0">${caixa(340, 40, 130, 50)}${texto(405, 65, "frete = 0", "cl-tm")}</g>
      <g class="peca" opacity="0">${caixa(340, 270, 130, 50)}${texto(405, 295, "frete = 15", "cl-tm")}</g>
      <g class="peca" opacity="0">${caixa(507, 150, 120, 60)}${texto(567, 167, "total", "cl-t2")}
        <g id="sai-120" opacity="0">${texto(567, 191, "R$ 120", "cl-tb")}</g><g id="sai-95" opacity="0">${texto(567, 191, "R$ 95", "cl-tb")}</g></g>
      <g class="peca" opacity="0">${texto(272, 100, "sim", "cl-tc")}${texto(272, 262, "não", "cl-te")}</g>
      <g id="ficha" opacity="0"><circle r="19" class="cl-ficha"/><g id="f-120">${texto(0, 1, "120", "cl-sobre")}</g><g id="f-80" opacity="0">${texto(0, 1, "80", "cl-sobre")}</g></g>`,
    montar(s, t) {
      const $ = (q) => s.querySelector(q);
      t.set($("#ficha"), { x: 85, y: 180 }, 0);
      t.to(s.querySelectorAll(".peca"), { opacity: 1, duration: 0.4, stagger: 0.18 }, 0.1);
      t.to($(".cl-linhas"), { opacity: 1, duration: 0.5 }, 1.0);
      t.to($("#ficha"), { opacity: 1, duration: 0.3 }, 1.6);
      percorrer(t, $("#ficha"), [[250, 180]], 0.8, 2.3);
      t.to($("#losango"), { scale: 1.08, transformOrigin: "50% 50%", duration: 0.25, yoyo: true, repeat: 1 }, 3.2);
      tracar(t, $("#luz-sim"), 1.1, 3.9);
      tracar(t, $("#luz-sim2"), 1.0, 5.2);
      percorrer(t, $("#ficha"), [[250, 65], [405, 65]], 0.55, 3.9);
      percorrer(t, $("#ficha"), [[567, 65], [567, 128]], 0.5, 5.2);
      t.to($("#sai-120"), { opacity: 1, duration: 0.3 }, 5.9);
      t.to($("#ficha"), { opacity: 0, duration: 0.3 }, 6.6);
      t.to([$("#luz-sim"), $("#luz-sim2"), $("#sai-120"), $("#ent-120")], { opacity: 0, duration: 0.4 }, 7.2);
      t.to($("#ent-80"), { opacity: 1, duration: 0.4 }, 7.4);
      t.set($("#ficha"), { x: 85, y: 180 }, 7.5);
      t.set($("#f-120"), { opacity: 0 }, 7.5);
      t.set($("#f-80"), { opacity: 1 }, 7.5);
      t.to($("#ficha"), { opacity: 1, duration: 0.3 }, 7.7);
      percorrer(t, $("#ficha"), [[250, 180]], 0.8, 8.0);
      t.to($("#losango"), { scale: 1.08, transformOrigin: "50% 50%", duration: 0.25, yoyo: true, repeat: 1 }, 8.8);
      tracar(t, $("#luz-nao"), 1.1, 9.4);
      tracar(t, $("#luz-nao2"), 1.0, 10.7);
      percorrer(t, $("#ficha"), [[250, 295], [405, 295]], 0.55, 9.4);
      percorrer(t, $("#ficha"), [[567, 295], [567, 232]], 0.5, 10.7);
      t.to($("#sai-95"), { opacity: 1, duration: 0.3 }, 11.4);
    },
  }];

  // ---------- PY: variável é etiqueta ----------
  const etiqueta = (id, nome, x, y) => `<g id="${id}" opacity="0" transform="translate(${x},${y})"><rect width="76" height="26" rx="8" class="cl-cor"/><circle cx="11" cy="13" r="3.5" class="cl-furo"/>${texto(44, 13, nome, "cl-sobre")}</g>`;
  C.PY = [{
    titulo: "Variável é etiqueta, não gaveta",
    fim: 11,
    legendas: [
      [0, "Três linhas de Python. O interpretador lê uma por vez, de cima para baixo."],
      [1.0, "Linha 1: cria o valor 500 na memória..."],
      [2.2, "...e cola nele a etiqueta saldo."],
      [3.4, "Linha 2: outro valor, outra etiqueta. pix aponta para 120."],
      [5.4, "Linha 3: o Python resolve primeiro o lado direito: 500 − 120."],
      [7.2, "Surge o 380, e a etiqueta saldo passa para ele."],
      [8.6, "O 500 não mudou: só ficou sem etiqueta. Variável é etiqueta, não gaveta."],
    ],
    svg: `
      ${caixa(20, 50, 290, 220, "cl-painel", 14)}${texto(60, 72, "main.py", "cl-t2")}
      <rect id="cursor-linha" x="30" y="93" width="270" height="34" rx="8" class="cl-cor-suave" opacity="0"/>
      <text x="44" y="110" class="cl-tm" dominant-baseline="central"><tspan class="cl-num">1  </tspan>saldo = 500</text>
      <text x="44" y="160" class="cl-tm" dominant-baseline="central"><tspan class="cl-num">2  </tspan>pix = 120</text>
      <text x="44" y="210" class="cl-tm" dominant-baseline="central"><tspan class="cl-num">3  </tspan>saldo = saldo - pix</text>
      <g id="conta" opacity="0">${caixa(44, 236, 190, 28, "cl-balao", 8)}${texto(139, 250, "500 − 120 = 380", "cl-tm")}</g>
      ${texto(470, 40, "memória", "cl-t2")}
      <g id="v500" opacity="0">${caixa(360, 100, 100, 54)}${texto(410, 127, "500", "cl-tb")}</g>
      <g id="v120" opacity="0">${caixa(360, 230, 100, 54)}${texto(410, 257, "120", "cl-tb")}</g>
      <g id="v380" opacity="0">${caixa(500, 160, 100, 54)}${texto(550, 187, "380", "cl-tb")}</g>
      <g id="sem" opacity="0">${texto(410, 172, "sem etiqueta", "cl-t2")}</g>
      ${etiqueta("e-saldo", "saldo", 372, 74)}${etiqueta("e-pix", "pix", 372, 204)}`,
    montar(s, t) {
      const $ = (q) => s.querySelector(q);
      t.set([$("#v500"), $("#v120"), $("#v380")], { scale: 0.6, transformOrigin: "50% 50%" }, 0);
      t.set($("#e-saldo"), { x: 452, y: 74 }, 0);
      t.set($("#e-pix"), { x: 452, y: 204 }, 0);
      t.to($("#cursor-linha"), { opacity: 1, duration: 0.3 }, 0.8);
      t.to($("#v500"), surgir, 1.0);
      t.to($("#e-saldo"), { opacity: 1, x: 372, duration: 0.6, ease: "power2.out" }, 2.2);
      t.to($("#cursor-linha"), { y: 50, duration: 0.4 }, 3.4);
      t.to($("#v120"), surgir, 3.6);
      t.to($("#e-pix"), { opacity: 1, x: 372, duration: 0.6, ease: "power2.out" }, 4.2);
      t.to($("#cursor-linha"), { y: 100, duration: 0.4 }, 5.4);
      t.to($("#conta"), { opacity: 1, duration: 0.4 }, 5.8);
      t.to($("#v380"), surgir, 7.2);
      t.to($("#e-saldo"), { x: 512, y: 134, duration: 0.8, ease: "power2.inOut" }, 7.6);
      t.to($("#v500"), { opacity: 0.35, duration: 0.5 }, 8.6);
      t.to($("#sem"), { opacity: 1, duration: 0.5 }, 8.8);
    },
  }];

  // ---------- CMP: do caractere ao bit ----------
  const bits = (x0, y, valores, id) => valores.split("").map((b, i) => `<g class="${id}" opacity="0">${caixa(x0 + i * 35, y, 31, 40, b === "1" ? "cl-cor-suave" : "cl-caixa", 7)}${texto(x0 + i * 35 + 15.5, y + 20, b, "cl-tm")}</g>`).join("");
  C.CMP = [{
    titulo: "Do caractere ao bit",
    fim: 10.6,
    legendas: [
      [0, "Você aperta a tecla A."],
      [1.2, "O computador procura o A na tabela de caracteres: é o número 65."],
      [2.6, "Por dentro, 65 vira 8 bits. Cada casa vale o dobro da vizinha."],
      [4.4, "Os bits ligados são o do 64 e o do 1: 64 + 1 = 65."],
      [6.4, "Uma letra acentuada, como ã, é o número 227 e ocupa 2 bytes no UTF-8."],
      [8.6, "Ler o arquivo com a codificação errada troca esses bytes por símbolos estranhos, como Ã£."],
    ],
    svg: `
      <g id="tecla-a"><rect x="24" y="64" width="78" height="72" rx="14" class="cl-tecla"/>${texto(63, 98, "A", "cl-tecla-t")}</g>
      <g id="seta1" opacity="0"><path class="cl-linha" d="M110,100 H150" marker-end="url(#cl-ponta)"/>${caixa(158, 76, 86, 48, "cl-cor-suave")}${texto(201, 100, "65", "cl-tb")}</g>
      <g id="seta2" opacity="0"><path class="cl-linha" d="M250,100 H318" marker-end="url(#cl-ponta)"/></g>
      <g id="casas" opacity="0">${[128, 64, 32, 16, 8, 4, 2, 1].map((v, i) => texto(340.5 + i * 35, 66, v, "cl-t2")).join("")}</g>
      ${bits(325, 80, "01000001", "bit-a")}
      <rect id="luz-64" x="358" y="78" width="35" height="44" rx="9" class="cl-anel" opacity="0"/>
      <rect id="luz-1" x="568" y="78" width="35" height="44" rx="9" class="cl-anel" opacity="0"/>
      <g id="soma" opacity="0">${texto(465, 150, "64 + 1 = 65", "cl-tb")}</g>
      <g id="linha2" opacity="0"><rect x="24" y="214" width="78" height="72" rx="14" class="cl-tecla"/>${texto(63, 248, "ã", "cl-tecla-t")}
        <path class="cl-linha" d="M110,250 H150" marker-end="url(#cl-ponta)"/>${caixa(158, 226, 86, 48, "cl-cor-suave")}${texto(201, 250, "227", "cl-tb")}
        <path class="cl-linha" d="M250,250 H318" marker-end="url(#cl-ponta)"/></g>
      ${bits(325, 210, "11000011", "bit-b1")}${bits(325, 256, "10100011", "bit-b2")}
      <g id="estranho" opacity="0">${caixa(420, 312, 190, 34, "cl-erro-suave", 9)}${texto(515, 329, "lido errado: Ã£", "cl-te")}</g>`,
    montar(s, t) {
      const $ = (q) => s.querySelector(q);
      t.to($("#tecla-a"), { y: 5, duration: 0.12, yoyo: true, repeat: 1 }, 0.4);
      t.to($("#seta1"), { opacity: 1, duration: 0.4 }, 1.2);
      t.to($("#seta2"), { opacity: 1, duration: 0.3 }, 2.6);
      t.to($("#casas"), { opacity: 1, duration: 0.4 }, 2.8);
      t.to(s.querySelectorAll(".bit-a"), { opacity: 1, duration: 0.2, stagger: 0.14 }, 2.9);
      t.to([$("#luz-64"), $("#luz-1")], { opacity: 1, duration: 0.3, stagger: 0.3 }, 4.5);
      t.to($("#soma"), { opacity: 1, duration: 0.4 }, 5.2);
      t.to($("#linha2"), { opacity: 1, duration: 0.5 }, 6.4);
      t.to(s.querySelectorAll(".bit-b1"), { opacity: 1, duration: 0.15, stagger: 0.09 }, 6.9);
      t.to(s.querySelectorAll(".bit-b2"), { opacity: 1, duration: 0.15, stagger: 0.09 }, 7.7);
      t.to($("#estranho"), { opacity: 1, duration: 0.4 }, 8.8);
      t.to($("#estranho"), { x: 4, duration: 0.06, yoyo: true, repeat: 5 }, 9.2);
    },
  }];

  // ---------- BD: como a consulta pensa ----------
  const LINHAS_BD = [[1, 1, "dificil"], [2, 1, "media"], [12, 1, "facil"], [28, 2, "facil"], [47, 3, "facil"], [49, 3, "dificil"]];
  C.BD = [{
    titulo: "Como a consulta pensa",
    fim: 11.6,
    legendas: [
      [0, "Você escreve a consulta nesta ordem. O banco executa em outra."],
      [1.4, "1. FROM: primeiro ele pega a tabela questoes inteira."],
      [3.4, "2. WHERE: depois filtra as linhas. Só ficam as de dificuldade 'facil'."],
      [5.6, "3. SELECT: só então escolhe as colunas. disciplina_id sai."],
      [7.6, "4. ORDER BY id DESC: por último, ordena do maior id para o menor."],
      [9.6, "Resultado: 3 linhas. E o texto vai entre aspas simples: 'facil'."],
    ],
    svg: `
      ${caixa(16, 70, 262, 200, "cl-painel", 14)}
      <rect id="realce" x="24" y="88" width="246" height="34" rx="8" class="cl-cor-suave" opacity="0"/>
      ${[["SELECT", " id, dificuldade", 3], ["FROM", " questoes", 1], ["WHERE", " dificuldade =", 2], ["", "      'facil'", 0], ["ORDER BY", " id DESC", 4]].map(([k, r, n], i) => `<text x="34" y="${105 + i * 34}" class="cl-tm" dominant-baseline="central"><tspan class="cl-chave">${k}</tspan>${r.replace("'facil'", "<tspan class=\"cl-str\">'facil'</tspan>")}</text>${n ? `<g class="ordem" opacity="0"><circle cx="258" cy="${105 + i * 34}" r="11" class="cl-cor"/>${texto(258, 105 + i * 34, n, "cl-sobre")}</g>` : ""}`).join("")}
      <g id="tabela" opacity="0">
        ${texto(456, 40, "questoes", "cl-t2")}
        ${caixa(300, 56, 320, 34, "cl-cab", 8)}${texto(340, 73, "id", "cl-tb")}<g id="col-disc">${texto(445, 73, "disciplina_id", "cl-tb")}</g>${texto(562, 73, "dificuldade", "cl-tb")}
      </g>
      ${LINHAS_BD.map(([id, d, dif], i) => `<g class="linha-bd ${dif === "facil" ? "fica" : "sai"}" data-id="${id}" opacity="0" transform="translate(0,${96 + i * 38})">
        ${caixa(300, 0, 320, 32, "cl-caixa", 7)}<rect x="300" y="0" width="320" height="32" rx="7" class="cl-linha-ok" opacity="0"/>
        ${texto(340, 16, id, "cl-tm")}<g class="cel-disc">${texto(445, 16, d, "cl-tm")}</g>${texto(562, 16, dif, "cl-tm")}
        <path d="M308,16 H612" class="cl-risco" opacity="0"/></g>`).join("")}`,
    montar(s, t) {
      const $ = (q) => s.querySelector(q);
      const $$ = (q) => s.querySelectorAll(q);
      const ordem = $$(".ordem");
      t.to($("#realce"), { opacity: 1, y: 34, duration: 0.4 }, 1.4);
      t.to(ordem[1], { opacity: 1, duration: 0.3 }, 1.5);
      t.to($("#tabela"), { opacity: 1, duration: 0.4 }, 1.7);
      t.to($$(".linha-bd"), { opacity: 1, duration: 0.25, stagger: 0.12 }, 1.9);
      t.to($("#realce"), { y: 68, attr: { height: 68 }, duration: 0.4 }, 3.4);
      t.to(ordem[2], { opacity: 1, duration: 0.3 }, 3.5);
      t.to($$(".sai .cl-risco"), { opacity: 1, duration: 0.3, stagger: 0.1 }, 3.9);
      t.to($$(".sai"), { opacity: 0.22, duration: 0.4 }, 4.5);
      t.to($$(".fica .cl-linha-ok"), { opacity: 1, duration: 0.4 }, 4.5);
      t.to($("#realce"), { y: 0, attr: { height: 34 }, duration: 0.4 }, 5.6);
      t.to(ordem[0], { opacity: 1, duration: 0.3 }, 5.7);
      t.to([$("#col-disc"), ...$$(".cel-disc")], { opacity: 0.12, duration: 0.5 }, 6.1);
      t.to($("#realce"), { y: 136, duration: 0.4 }, 7.6);
      t.to(ordem[3], { opacity: 1, duration: 0.3 }, 7.7);
      t.to($$(".sai"), { opacity: 0, duration: 0.3 }, 8.0);
      const destino = { 47: 0, 28: 1, 12: 2 };
      $$(".fica").forEach((g) => t.to(g, { y: 96 + destino[g.dataset.id] * 38, duration: 0.8, ease: "power2.inOut" }, 8.2));
    },
  }];

  // ---------- ED: pilha e fila ----------
  const item = (cls, x, y, w, rotulo) => `<g class="${cls}" opacity="0" transform="translate(${x},${y})">${caixa(0, 0, w, 38, "cl-cor-suave", 9)}${texto(w / 2, 19, rotulo, "cl-t")}</g>`;
  // ---------- ED: busca binária ----------
  const NUMS = [3, 7, 11, 15, 18, 22, 26, 31, 37, 42, 48, 53, 59, 64, 70, 77];
  C.ED = [{
    titulo: "Pilha e fila: quem sai primeiro",
    fim: 10.8,
    legendas: [
      [0, "Duas estruturas. Muda só uma regra: quem sai primeiro."],
      [0.8, "Pilha: cada ação nova entra por cima, como no histórico do editor."],
      [3.4, "Ctrl+Z tira a de cima: a última que entrou é a primeira que sai."],
      [5.0, "Fila: cada pedido novo entra no fim."],
      [7.4, "A cozinha atende o primeiro da fila: o primeiro que entrou é o primeiro que sai."],
      [9.2, "Pilha: último a entrar, primeiro a sair. Fila: primeiro a entrar, primeiro a sair."],
    ],
    svg: `
      ${texto(150, 34, "pilha (Ctrl+Z)", "cl-tb")}${texto(470, 34, "fila (pedidos)", "cl-tb")}
      <path d="M58,120 V310 H242 V120" class="cl-linha"/>
      ${item("p1", 66, 262, 168, "digitar olá")}${item("p2", 66, 218, 168, "negrito")}${item("p3", 66, 174, 168, "apagar linha")}
      <g id="desfeito" opacity="0">${texto(150, 84, "desfeito: apagar linha", "cl-tc")}</g>
      <path d="M330,150 H620 M330,210 H620" class="cl-linha"/>
      <g id="cozinha">${caixa(300, 236, 110, 34, "cl-painel", 9)}${texto(355, 253, "cozinha", "cl-t2")}</g>
      ${item("q1", 340, 161, 86, "pedido 1")}${item("q2", 434, 161, 86, "pedido 2")}${item("q3", 528, 161, 86, "pedido 3")}
      <g id="saiu" opacity="0">${texto(470, 300, "saiu primeiro: pedido 1", "cl-tc")}</g>`,
    montar(s, t) {
      const $ = (q) => s.querySelector(q);
      ["p1", "p2", "p3"].forEach((c, i) => t.fromTo($("." + c), { y: 60, opacity: 0 }, { y: [262, 218, 174][i], opacity: 1, duration: 0.55, ease: "bounce.out" }, 0.9 + i * 0.75));
      t.to($(".p3"), { y: 100, x: 120, opacity: 0, duration: 0.7, ease: "power2.in" }, 3.6);
      t.to($("#desfeito"), { opacity: 1, duration: 0.4 }, 4.1);
      ["q1", "q2", "q3"].forEach((c, i) => t.fromTo($("." + c), { x: 640, opacity: 0 }, { x: [340, 434, 528][i], opacity: 1, duration: 0.6, ease: "power2.out" }, 5.1 + i * 0.7));
      t.to($(".q1"), { x: 310, y: 236, opacity: 0, duration: 0.7, ease: "power2.in" }, 7.6);
      t.to($(".q2"), { x: 340, duration: 0.5 }, 8.2);
      t.to($(".q3"), { x: 434, duration: 0.5 }, 8.3);
      t.to($("#saiu"), { opacity: 1, duration: 0.4 }, 8.6);
    },
  }, {
    titulo: "Busca binária: metade fora a cada olhada",
    fim: 10.8,
    legendas: [
      [0, "Uma lista em ordem com 16 números. Procuramos o 37."],
      [1.6, "Olha o meio: 31. O 37 é maior, então toda a metade da esquerda sai."],
      [3.6, "Olha o meio do que sobrou: 53. O 37 é menor: sai a direita."],
      [5.6, "Meio de novo: 42. Maior que 37: sai mais um pedaço."],
      [7.4, "Achou na quarta olhada. Olhando um por um, seriam nove."],
      [9.2, "Com um milhão de itens em ordem, bastam no máximo 20 olhadas."],
    ],
    svg: `
      ${caixa(232, 30, 176, 40, "cl-cor-suave", 20)}${texto(320, 50, "procurando 37", "cl-tb")}
      ${NUMS.map((n, i) => `<g class="num" opacity="0">${caixa(16 + i * 38, 160, 34, 46, "cl-caixa", 8)}${texto(33 + i * 38, 183, n, "cl-tm")}${texto(33 + i * 38, 222, i, "cl-t2")}</g>`).join("")}
      <rect id="achou" x="318" y="156" width="42" height="54" rx="10" class="cl-anel-certo" opacity="0"/>
      <g id="seta-meio" opacity="0"><path d="M-9,-14 L9,-14 L0,0 Z" class="cl-cor"/>${texto(0, -28, "meio", "cl-t2")}</g>
      ${[1, 2, 3, 4].map((n) => `<g class="olhadas" opacity="0">${texto(320, 290, `olhadas: ${n}`, n === 4 ? "cl-tc" : "cl-tb")}</g>`).join("")}`,
    montar(s, t) {
      const $ = (q) => s.querySelector(q);
      const num = s.querySelectorAll(".num");
      const ol = s.querySelectorAll(".olhadas");
      const xDe = (i) => 33 + i * 38;
      t.to(num, { opacity: 1, duration: 0.2, stagger: 0.05 }, 0.2);
      t.set($("#seta-meio"), { x: xDe(7), y: 152 }, 0);
      // n = número da olhada (0 a 3); só o contador dessa olhada fica visível
      const passo = (i, n, desc, pos) => {
        t.to($("#seta-meio"), { x: xDe(i), opacity: 1, duration: 0.5, ease: "power2.inOut" }, pos);
        ol.forEach((o, k) => t.to(o, { opacity: k === n ? 1 : 0, duration: 0.2 }, pos + 0.3));
        if (desc) t.to(desc.map((k) => num[k]), { opacity: 0.18, duration: 0.5 }, pos + 1.1);
      };
      passo(7, 0, [0, 1, 2, 3, 4, 5, 6, 7], 1.6);
      passo(11, 1, [11, 12, 13, 14, 15], 3.6);
      passo(9, 2, [9, 10], 5.6);
      passo(8, 3, null, 7.4);
      t.to($("#achou"), { opacity: 1, duration: 0.3 }, 7.9);
      t.to($("#achou"), { scale: 1.12, transformOrigin: "50% 50%", duration: 0.25, yoyo: true, repeat: 1 }, 8.2);
    },
  }];

  // ---------- EST: média e mediana ----------
  const XEST = (v) => 40 + v * 13.3;
  const SAL = [2, 3, 3, 4, 4, 5, 5];
  const pilhaY = (lista, i) => 228 - lista.slice(0, i).filter((v) => v === lista[i]).length * 20;
  C.EST = [{
    titulo: "A média se mexe, a mediana não",
    fim: 10.6,
    legendas: [
      [0, "Sete salários de uma equipe, em mil reais."],
      [1.8, "A média soma tudo e divide por 7: 3,7 mil. A mediana é o valor do meio: 4 mil."],
      [4.2, "Agora entra o salário do diretor: 40 mil."],
      [5.6, "A média pula para 8,25 mil, mais do que quase todo mundo ganha."],
      [7.4, "A mediana continua em 4 mil: um valor extremo quase não mexe nela."],
      [9.0, "Por isso notícia de renda costuma usar a mediana."],
    ],
    svg: `
      <path d="M40,244 H600" class="cl-linha"/>
      ${[0, 5, 10, 15, 20, 25, 30, 35, 40].map((v) => `<path d="M${XEST(v)},244 v6" class="cl-linha"/>${texto(XEST(v), 264, v, "cl-t2")}`).join("")}
      ${texto(560, 290, "mil reais", "cl-t2")}
      ${SAL.map((v, i) => `<circle class="pt" cx="${XEST(v)}" cy="${pilhaY(SAL, i)}" r="8.5" opacity="0"/>`).join("")}
      <g id="diretor" opacity="0" transform="translate(640,0)"><circle cx="${XEST(40)}" cy="228" r="11" class="cl-cor"/>${texto(XEST(40), 200, "diretor", "cl-t2")}</g>
      <g id="mediana" opacity="0" transform="translate(${XEST(4)},0)"><path d="M0,120 V236" class="cl-tracejado-certo"/>${caixa(-58, 92, 116, 28, "cl-certo-suave", 8)}${texto(0, 106, "mediana 4 mil", "cl-tc")}</g>
      <g id="media" opacity="0" transform="translate(${XEST(26 / 7)},0)"><path d="M0,250 V312" class="cl-tracejado"/>
        <g id="m-antes">${caixa(-60, 312, 120, 28, "cl-cor-suave", 8)}${texto(0, 326, "média 3,7 mil", "cl-tb")}</g>
        <g id="m-depois" opacity="0">${caixa(-64, 312, 128, 28, "cl-cor-suave", 8)}${texto(0, 326, "média 8,25 mil", "cl-tb")}</g></g>`,
    montar(s, t) {
      const $ = (q) => s.querySelector(q);
      t.fromTo(s.querySelectorAll(".pt"), { y: -60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "bounce.out", stagger: 0.12 }, 0.2);
      t.to($("#media"), { opacity: 1, duration: 0.4 }, 1.9);
      t.to($("#mediana"), { opacity: 1, duration: 0.4 }, 2.6);
      t.to($("#diretor"), { opacity: 1, x: 0, duration: 1.1, ease: "power3.out" }, 4.2);
      t.to($("#media"), { x: XEST(8.25), duration: 1.2, ease: "elastic.out(1, 0.6)" }, 5.7);
      t.to($("#m-antes"), { opacity: 0, duration: 0.3 }, 5.8);
      t.to($("#m-depois"), { opacity: 1, duration: 0.3 }, 6.0);
      t.to($("#mediana"), { scale: 1.1, transformOrigin: "50% 100%", duration: 0.25, yoyo: true, repeat: 3 }, 7.5);
    },
  }];

  // ---------- ML: decorar não é aprender ----------
  const TREINO = [[90, 250], [150, 215], [210, 232], [270, 180], [330, 190], [390, 140], [450, 150], [510, 105], [570, 112]];
  const reta = (x) => 255 - 0.28 * (x - 70);
  const TESTE = [[120, 238], [240, 212], [360, 170], [480, 144], [540, 120]];
  // curva que passa em todos os pontos de treino e balança entre eles
  const balanco = [];
  TREINO.forEach((p, i) => {
    balanco.push(p);
    if (i < TREINO.length - 1) {
      const q = TREINO[i + 1];
      balanco.push([(p[0] + q[0]) / 2, (p[1] + q[1]) / 2 + (i % 2 ? -46 : 46)]);
    }
  });
  function suave(pts) {
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      d += ` C${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]},${p2[1]}`;
    }
    return d;
  }
  const yBalanco = (x) => { const p = balanco.find((b) => Math.abs(b[0] - x) < 1); return p ? p[1] : reta(x); };
  C.ML = [{
    titulo: "Decorar não é aprender",
    fim: 11,
    legendas: [
      [0, "Pontos azuis: os exemplos de treino que o modelo vê."],
      [1.8, "Modelo simples: uma reta. Não passa em todos, mas pega a tendência."],
      [3.6, "Modelo complicado: passa exatamente em cada ponto. Erro no treino: zero."],
      [5.6, "Chegam dados novos, que o modelo nunca viu (laranja)."],
      [7.0, "A curva complicada erra feio nos novos: ela decorou o treino."],
      [8.8, "A reta erra pouco. Isso é sobreajuste: decorar não é aprender."],
    ],
    svg: `
      <path d="M60,40 V300 H610" class="cl-linha"/>
      <path id="reta" d="M70,${reta(70)} L600,${reta(600)}" class="cl-modelo-certo"/>
      <path id="decorou" d="${suave(balanco)}" class="cl-modelo-erro"/>
      ${TREINO.map(([x, y]) => `<circle class="treino" cx="${x}" cy="${y}" r="7.5" opacity="0"/>`).join("")}
      ${TESTE.map(([x, y]) => `<path class="erro-curva" d="M${x},${y} V${yBalanco(x)}" opacity="0"/><path class="erro-reta" d="M${x},${y} V${reta(x)}" opacity="0"/>`).join("")}
      ${TESTE.map(([x, y]) => `<rect class="teste" x="${x - 7}" y="${y - 7}" width="14" height="14" rx="3" opacity="0"/>`).join("")}
      <g id="leg" opacity="0"><circle cx="420" cy="276" r="6" class="treino-leg"/>${texto(462, 276, "treino", "cl-t2")}<rect x="508" y="270" width="12" height="12" rx="3" class="teste-leg"/>${texto(546, 276, "novos", "cl-t2")}</g>`,
    montar(s, t) {
      const $ = (q) => s.querySelector(q);
      const $$ = (q) => s.querySelectorAll(q);
      t.to($$(".treino"), { opacity: 1, duration: 0.25, stagger: 0.1 }, 0.2);
      t.to($("#leg"), { opacity: 1, duration: 0.3 }, 1.2);
      tracar(t, $("#reta"), 1.2, 1.9);
      tracar(t, $("#decorou"), 1.6, 3.7);
      t.fromTo($$(".teste"), { scale: 0, opacity: 0, transformOrigin: "50% 50%" }, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)", stagger: 0.15 }, 5.7);
      t.to($$(".erro-curva"), { opacity: 1, duration: 0.3, stagger: 0.12 }, 7.1);
      t.to($("#decorou"), { opacity: 0.3, duration: 0.5 }, 8.8);
      t.to($$(".erro-curva"), { opacity: 0.25, duration: 0.5 }, 8.8);
      t.to($$(".erro-reta"), { opacity: 1, duration: 0.3, stagger: 0.12 }, 9.0);
    },
  }];

  // ---------- player ----------
  const semMovimento = () => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  const DEFS = `<defs><marker id="cl-ponta" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="cl-ponta"/></marker></defs>`;
  const ic = (n) => (window.ICONE ? window.ICONE(n) : "");

  function montarPlayer(el, clipe) {
    const quadros = semMovimento();
    el.innerHTML = `
      <div class="clipe-tela">
        <svg viewBox="0 0 640 360" role="img" aria-label="${clipe.titulo}">${DEFS}${clipe.svg}</svg>
        <p class="clipe-legenda" aria-live="polite"></p>
        <button type="button" class="clipe-capa">
          <span class="clipe-play-grande">${ic("play-duotone")}</span>
          <b>${clipe.titulo}</b>
          <small>${mmss(clipe.fim)} · ${quadros ? "quadro a quadro" : "animação com legenda"}</small>
        </button>
      </div>
      <div class="clipe-controles">
        <button type="button" class="clipe-botao" data-tocar aria-label="${quadros ? "Próximo quadro" : "Reproduzir"}">${ic(quadros ? "arrow-right-bold" : "play-bold")}</button>
        <input type="range" min="0" max="1000" value="0" step="1" aria-label="Posição no clipe" class="clipe-barra">
        <span class="clipe-tempo">0:00 / ${mmss(clipe.fim)}</span>
        <button type="button" class="clipe-botao" data-velocidade aria-label="Velocidade">1x</button>
        <button type="button" class="clipe-botao" data-recomecar aria-label="Recomeçar">${ic("arrow-counter-clockwise-bold")}</button>
      </div>`;
    const legenda = el.querySelector(".clipe-legenda");
    const capa = el.querySelector(".clipe-capa");
    const tocar = el.querySelector("[data-tocar]");
    const barra = el.querySelector(".clipe-barra");
    const tempo = el.querySelector(".clipe-tempo");
    const vel = el.querySelector("[data-velocidade]");
    const svg = el.querySelector("svg");
    const legendaEm = (s) => { let txt = clipe.legendas[0][1]; clipe.legendas.forEach(([t, x]) => { if (s >= t) txt = x; }); return txt; };
    legenda.textContent = legendaEm(0);

    if (!window.gsap) {
      capa.querySelector("small").textContent = "a animação não carregou; leia o roteiro abaixo";
      el.querySelector(".clipe-controles").outerHTML = `<ol class="clipe-roteiro">${clipe.legendas.map(([, x]) => `<li>${x}</li>`).join("")}</ol>`;
      svg.querySelectorAll("[opacity='0']").forEach((n) => n.setAttribute("opacity", "1"));
      return;
    }
    const tl = window.gsap.timeline({ paused: true });
    clipe.montar(svg, tl);
    tl.to({}, { duration: 0.01 }, clipe.fim);
    const atualizar = () => {
      const s = tl.time();
      barra.value = Math.round((s / tl.duration()) * 1000);
      barra.style.setProperty("--p", `${(s / tl.duration()) * 100}%`);
      tempo.textContent = `${mmss(s)} / ${mmss(clipe.fim)}`;
      const nova = legendaEm(s);
      if (legenda.textContent !== nova) { legenda.textContent = nova; legenda.classList.remove("troca"); void legenda.offsetWidth; legenda.classList.add("troca"); }
    };
    tl.eventCallback("onUpdate", atualizar);
    const icone = (tocando) => {
      if (quadros) return;
      tocar.innerHTML = ic(tocando ? "pause-bold" : "play-bold");
      tocar.setAttribute("aria-label", tocando ? "Pausar" : "Reproduzir");
      el.classList.toggle("tocando", tocando);
    };
    tl.eventCallback("onComplete", () => { icone(false); el.classList.add("terminou"); });
    const iniciar = () => { capa.hidden = true; el.classList.add("iniciado"); };
    // movimento reduzido: cada clique mostra o quadro final de um trecho da legenda, sem animação
    let quadro = -1;
    const proximoQuadro = () => {
      iniciar();
      quadro = quadro >= clipe.legendas.length - 1 ? 0 : quadro + 1;
      const seguinte = clipe.legendas[quadro + 1];
      tl.pause(seguinte ? seguinte[0] - 0.05 : clipe.fim);
      atualizar();
    };
    const alternar = () => {
      if (quadros) return proximoQuadro();
      iniciar();
      el.classList.remove("terminou");
      if (tl.progress() >= 1) tl.restart();
      else if (tl.paused()) tl.play();
      else tl.pause();
      icone(!tl.paused());
    };
    capa.addEventListener("click", alternar);
    tocar.addEventListener("click", alternar);
    barra.addEventListener("input", () => { iniciar(); tl.pause(); icone(false); tl.progress(barra.value / 1000); atualizar(); });
    el.querySelector("[data-recomecar]").addEventListener("click", () => { iniciar(); el.classList.remove("terminou"); if (quadros) { quadro = -1; tl.pause(0); atualizar(); } else { tl.restart(); icone(true); } });
    const VEL = [1, 0.75, 0.5];
    vel.addEventListener("click", () => { const i = (VEL.indexOf(tl.timeScale()) + 1) % VEL.length; tl.timeScale(VEL[i]); vel.textContent = `${String(VEL[i]).replace(".", ",")}x`; });
    // pausa quando sai da tela
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((es) => es.forEach((e) => { if (!e.isIntersecting && !tl.paused()) { tl.pause(); icone(false); } })).observe(el);
    }
    atualizar();
  }

  window.CLIPES = C;
  window.CLIPE_PLAYER = montarPlayer;
})();
