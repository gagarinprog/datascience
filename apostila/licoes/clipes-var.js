// Animações da lição "Variáveis e tipos" (LOG.02). Dados do concurso fictício da lição "Comece por aqui".
(function () {
  const C = window.Clip;
  const esc = C.esc;

  // 1. variável = etiqueta que aponta para um valor
  C.registrar("etiqueta", {
    titulo: "Uma variável é um nome colado num valor",
    passos: [
      ["<b>x = 5</b>: o valor 5 existe, e o nome <b>x</b> foi colado nele, como uma etiqueta.", 3800],
      ["Agora <b>x = x + 2</b>. Primeiro o Python faz a conta do lado direito: x vale 5, então 5 + 2 dá <b>7</b>. O 7 nasce, ainda sem nome.", 5400],
      ["Só depois de calcular, o Python cola a etiqueta <b>x</b> no 7. O sinal = quer dizer “<b>recebe</b>”, não “é igual a”.", 5000],
      ["O 5 ficou <b>sem nome</b>: x não guarda os dois valores, só o mais recente. Quem lê x agora vê 7.", 5000],
    ],
    html: () => `<div class="etq"><div class="etq-casa" data-c="a"><div class="bolha">5</div><div class="etq-slot"><span class="etq-chip">x</span></div><small class="etq-nota">sem nome</small></div>
      <div class="etq-sinal" aria-hidden="true">+ 2 →</div>
      <div class="etq-casa ausente" data-c="b"><div class="bolha">7</div><div class="etq-slot"></div></div></div>
      <p class="etq-conta"></p>`,
    aplicar(p, k) {
      const a = p.querySelector('[data-c="a"]'), b = p.querySelector('[data-c="b"]');
      const chip = p.querySelector(".etq-chip");
      b.classList.toggle("ausente", k < 1);
      p.querySelector(".etq-sinal").classList.toggle("on", k >= 1);
      const alvo = (k >= 2 ? b : a).querySelector(".etq-slot");
      if (chip.parentElement !== alvo) C.flip([chip], () => alvo.appendChild(chip));
      a.classList.toggle("sem-nome", k >= 3);
      p.querySelector(".etq-conta").textContent = ["x = 5", "x = x + 2  →  calcula 5 + 2 = 7", "x recebe 7", "x vale 7"][k];
    },
  });

  // 2. atribuições em sequência
  C.registrar("atribuicao", C.execucao({
    titulo: "Seguindo as atribuições do total de pontos",
    codigo: ["total = 48", "total = total + 30", "titulos = 2", "total = total + titulos"],
    vars: ["total", "titulos"],
    passos: [
      { l: "Vamos acompanhar o valor de cada variável, linha por linha. Anotar isso é a <b>previsão</b> que o exercício final pede.", linha: -1, mem: {} },
      { l: "Linha 1: a variável <b>total</b> recebe 48.", linha: 0, mem: { total: 48 } },
      { l: "Linha 2: o lado direito primeiro: <b>total + 30</b> = 48 + 30 = 78. Depois o resultado volta para <b>total</b>. O 48 foi substituído.", linha: 1, mem: { total: 78 } },
      { l: "Linha 3: nasce uma variável nova, <b>titulos</b>, com 2. Ela não mexe em total.", linha: 2, mem: { total: 78, titulos: 2 } },
      { l: "Linha 4: <b>total + titulos</b> = 78 + 2 = 80, e total passa a valer 80. A variável titulos continua valendo 2.", linha: 3, mem: { total: 80, titulos: 2 } },
    ],
  }));

  // 3. tipos primitivos: cada valor na sua gaveta
  const VALORES = [["78", "int"], ["7.5", "float"], ["“Ana”", "str"], ["True", "bool"], ["“70”", "str"], ["3", "int"]];
  const GAVETAS = [["int", "números inteiros"], ["float", "números com ponto decimal"], ["str", "textos (entre aspas)"], ["bool", "verdadeiro ou falso"]];
  C.registrar("tipos", {
    titulo: "Cada valor tem um tipo",
    passos: [
      ["Seis valores soltos. Para o Python, cada um tem um <b>tipo</b>, que diz o que dá para fazer com ele.", 3800],
      ["Números inteiros, sem ponto: <b>int</b>. O 78 e o 3 vão para cá.", 4000],
      ["Números com ponto decimal: <b>float</b>. Em Python o decimal usa <b>ponto</b>: 7.5.", 4200],
      ["Texto, sempre entre aspas: <b>str</b>. Repare no “70” entre aspas: é <b>texto</b>, não número.", 5000],
      ["Verdadeiro ou falso: <b>bool</b>. Escreve-se True ou False, com a primeira letra maiúscula.", 4200],
    ],
    html: () => `<div class="tp"><div class="tp-banco">${VALORES.map(([v, t], i) => `<span class="tp-v" data-i="${i}" data-t="${t}">${esc(v)}</span>`).join("")}</div>
      <div class="tp-gavetas">${GAVETAS.map(([t, d]) => `<div class="tp-g" data-t="${t}"><b>${t}</b><small>${d}</small><div class="tp-itens"></div></div>`).join("")}</div></div>`,
    aplicar(p, k) {
      const ordem = ["int", "float", "str", "bool"];
      const vs = [...p.querySelectorAll(".tp-v")];
      C.flip(vs, () => {
        vs.forEach((v) => {
          const guardado = k >= 1 && ordem.indexOf(v.dataset.t) < k;
          const alvo = guardado ? p.querySelector(`.tp-g[data-t="${v.dataset.t}"] .tp-itens`) : p.querySelector(".tp-banco");
          if (v.parentElement !== alvo) alvo.appendChild(v);
        });
      });
      p.querySelectorAll(".tp-g").forEach((g) => g.classList.toggle("ativa", ordem.indexOf(g.dataset.t) === k - 1));
    },
  });

  // 4. conversão de tipo: o que dá certo e o que dá erro
  const CONV = [
    ['int("8")', "8", "ok", "o texto vira o número 8"],
    ["float(8)", "8.0", "ok", "o inteiro vira decimal"],
    ["int(7.9)", "7", "ok", "corta a parte decimal, não arredonda"],
    ['int("7.5")', "ValueError", "erro", "texto com ponto não vira inteiro"],
    ['"8" + 2', "TypeError", "erro", "não dá para somar texto com número"],
  ];
  C.registrar("conversao", {
    titulo: "Conversões de tipo: o que funciona e o que dá erro",
    passos: [
      ["Converter é trocar o tipo de um valor. Vamos ver cinco casos, e o que o Python faz em cada um.", 3600],
      ["<b>int(“8”)</b> converte o texto “8” no número 8. É o que se faz com o que vem do input.", 4600],
      ["<b>float(8)</b> vira 8.0: mesmo valor, agora como decimal.", 3600],
      ["<b>int(7.9)</b> vira 7. Atenção: o int <b>corta</b> a parte decimal, ele não arredonda para 8.", 5000],
      ["<b>int(“7.5”)</b> dá <b>erro</b>: o texto “7.5” não é um inteiro. Para ele, use float(“7.5”).", 5000],
      ["E <b>“8” + 2</b> também dá erro: o Python não soma texto com número. Converta antes: int(“8”) + 2 dá 10.", 5400],
    ],
    html: () => `<table class="conv"><thead><tr><th>Você escreve</th><th>O Python devolve</th><th>Por quê</th></tr></thead><tbody>${CONV.map(([a, b, t, m], i) => `<tr data-q="${i + 1}" class="${t}"><td><code>${esc(a)}</code></td><td><code>${esc(b)}</code></td><td>${esc(m)}</td></tr>`).join("")}</tbody></table>`,
    aplicar(p, k) {
      p.querySelectorAll("tr[data-q]").forEach((tr) => { const q = Number(tr.dataset.q); tr.classList.toggle("ver", q <= k); tr.classList.toggle("agora", q === k); });
    },
  });

  // 5. constante: mudar em um lugar só
  const SOLTO = ["total = objetiva + discursiva", "aprovado = total >= 70", "faltam = 70 - total", "if total >= 70:"];
  const CONST = ["NOTA_DE_CORTE = 70", "total = objetiva + discursiva", "aprovado = total >= NOTA_DE_CORTE", "faltam = NOTA_DE_CORTE - total"];
  C.registrar("constante", {
    titulo: "Constante: o valor fixo mora em um lugar só",
    passos: [
      ["Dois programas fazem a mesma coisa. À esquerda, o <b>70</b> aparece solto em três lugares. À direita, ele mora em uma constante, <b>NOTA_DE_CORTE</b>, definida uma vez.", 5600],
      ["Imagine que o edital seja retificado e a nota de corte passe a ser <b>75</b>. É preciso mudar os dois programas.", 4400],
      ["À esquerda, é preciso achar <b>cada</b> 70. Esquecer um deles é fácil: o programa fica com duas regras diferentes e ninguém percebe.", 5600],
      ["À direita, muda <b>uma</b> linha, e todas as outras acompanham. Constantes se escrevem em <b>MAIÚSCULAS</b>, por convenção.", 5000],
    ],
    html: () => `<div class="cst"><div class="cst-lado cst-a"><h4>Valor solto</h4><pre>${SOLTO.map((l, i) => `<span class="cst-l" data-i="${i}">${esc(l)}</span>`).join("")}</pre><p class="cst-nota"></p></div>
      <div class="cst-lado cst-b"><h4>Constante</h4><pre>${CONST.map((l, i) => `<span class="cst-l" data-i="${i}">${esc(l)}</span>`).join("")}</pre><p class="cst-nota"></p></div></div>`,
    aplicar(p, k) {
      const A = p.querySelector(".cst-a"), B = p.querySelector(".cst-b");
      const set = (raiz, linhas) => raiz.querySelectorAll(".cst-l").forEach((s, i) => { s.innerHTML = linhas[i]; });
      const l75 = (l) => esc(l).replace(/70/g, "<mark>75</mark>");
      // esquerda
      set(A, SOLTO.map((l, i) => (k >= 2 && i !== 3 ? l75(l) : esc(l))));
      // direita
      set(B, CONST.map((l, i) => (k >= 3 && i === 0 ? l75(l) : esc(l))));
      A.classList.toggle("erro", k >= 2);
      B.classList.toggle("certo", k >= 3);
      A.querySelector(".cst-nota").textContent = k >= 2 ? "Esqueceram o 70 da última linha: o programa agora tem duas regras." : "";
      B.querySelector(".cst-nota").textContent = k >= 3 ? "Uma linha mudou. Tudo o mais continua certo." : "";
    },
  });
})();
