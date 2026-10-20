// Animações da lição "Operadores e expressões" (LOG.03). Dados do concurso fictício da lição "Comece por aqui".
(function () {
  const C = window.Clip;
  const esc = C.esc;

  // linhas de tabela que aparecem uma por passo (comparações e regra com e/ou)
  const revelar = (p, k) => p.querySelectorAll("tr[data-q]").forEach((tr) => {
    const q = Number(tr.dataset.q);
    tr.classList.toggle("ver", q <= k);
    tr.classList.toggle("agora", q === k);
  });

  // 1. aritméticos: nota ponderada
  C.registrar("ponderada", C.execucao({
    titulo: "Calculando uma nota com pesos",
    codigo: ["objetiva = 48", "discursiva = 30", "total = objetiva * 2 + discursiva * 3", "nota = total / 5"],
    vars: ["objetiva", "discursiva", "total", "nota"],
    passos: [
      { l: "Num edital fictício, a objetiva tem peso 2 e a discursiva peso 3. A nota é a soma ponderada dividida por 5, a soma dos pesos.", linha: -1, mem: {} },
      { l: "Linhas 1 e 2: as duas notas chegam.", linha: 1, mem: { objetiva: 48, discursiva: 30 } },
      { l: "Linha 3: as multiplicações vêm antes da soma, como na matemática. 48 * 2 = 96 e 30 * 3 = 90; depois 96 + 90 = <b>186</b>.", linha: 2, mem: { objetiva: 48, discursiva: 30, total: 186 }, ms: 5200 },
      { l: "Linha 4: 186 / 5 = <b>37.2</b>. Repare no ponto: a divisão com / sempre dá decimal.", linha: 3, mem: { objetiva: 48, discursiva: 30, total: 186, nota: 37.2 } },
    ],
  }));

  // 2. divisão inteira e resto: 23 candidatos em salas de 10
  C.registrar("divresto", {
    titulo: "23 candidatos em salas de 10 lugares",
    passos: [
      ["São <b>23</b> candidatos e cada sala tem <b>10</b> lugares. Quantas salas ficam cheias, e quantos sobram?", 3800],
      ["Enchemos a primeira sala com 10 candidatos.", 3000],
      ["Enchemos a segunda. Não dá para encher uma terceira: só restam 3.", 3800],
      ["<b>23 // 10 = 2</b>: a divisão inteira conta quantos grupos completos cabem. <b>23 % 10 = 3</b>: o resto conta quem sobrou.", 5600],
    ],
    html: () => `<div class="dr"><div class="dr-fila">${Array.from({ length: 23 }, (_, i) => `<span class="dr-p" data-i="${i}"></span>`).join("")}</div>
      <div class="dr-salas"><div class="dr-sala" data-s="0"><small>sala 1</small><div class="dr-lugares"></div></div><div class="dr-sala" data-s="1"><small>sala 2</small><div class="dr-lugares"></div></div></div>
      <p class="dr-conta"><code>23 // 10 = 2</code> <code>23 % 10 = 3</code></p></div>`,
    aplicar(p, k) {
      const pessoas = [...p.querySelectorAll(".dr-p")];
      const fila = p.querySelector(".dr-fila");
      const salas = [...p.querySelectorAll(".dr-sala .dr-lugares")];
      C.flip(pessoas, () => {
        pessoas.forEach((e, i) => {
          const sala = i < 10 && k >= 1 ? salas.at(0) : i >= 10 && i < 20 && k >= 2 ? salas.at(1) : fila;
          if (e.parentElement !== sala) sala.appendChild(e);
        });
      });
      pessoas.forEach((e, i) => e.classList.toggle("sobra", i >= 20 && k >= 2));
      p.querySelectorAll(".dr-sala").forEach((s, j) => s.classList.toggle("cheia", k >= j + 1));
      p.querySelector(".dr-conta").classList.toggle("on", k >= 3);
    },
  });

  // 3. relacionais: perguntas que respondem True ou False
  const COMP = [["nota == 70", "True", "igual (dois sinais de igual)"], ["nota != 70", "False", "diferente"], ["nota > 70", "False", "maior: 70 não é maior que 70"],
    ["nota >= 70", "True", "maior ou igual"], ['nota == "70"', "False", "número e texto nunca são iguais"]];
  C.registrar("comparar", {
    titulo: "Comparações com nota = 70",
    passos: [
      ["A variável <b>nota</b> vale 70. Cada comparação é uma pergunta, e a resposta é sempre <b>True</b> ou <b>False</b>.", 3800],
      ["<b>==</b> pergunta se é igual. Um sinal só, =, guarda; dois sinais, ==, comparam.", 4400],
      ["<b>!=</b> pergunta se é diferente. 70 não é diferente de 70: False.", 3800],
      ["<b>&gt;</b> é estrito: 70 não é maior que 70.", 3600],
      ["<b>&gt;=</b> inclui o igual. É o que a nota de corte usa: quem tira exatamente 70 passa.", 4200],
      ["Cuidado com tipos: o número 70 e o texto “70” <b>não são iguais</b>. É o erro clássico de esquecer de converter o input.", 5200],
    ],
    html: () => `<table class="conv"><thead><tr><th>Pergunta</th><th>Resposta</th><th>O que pergunta</th></tr></thead><tbody>${COMP.map(([a, b, m], i) => `<tr data-q="${i + 1}" class="${b === "True" ? "ok" : "erro"}"><td><code>${esc(a)}</code></td><td><code>${b}</code></td><td>${esc(m)}</td></tr>`).join("")}</tbody></table>`,
    aplicar: revelar,
  });

  // 4. lógicos: regra com duas condições
  const CAND = [["Ana", 78, 30], ["Diego", 73, 28], ["Bruno", 67, 25]];
  C.registrar("logicos", {
    titulo: "Uma regra com duas condições",
    passos: [
      ["Regra de um edital fictício: passa quem tem <b>total &gt;= 70</b> e também <b>discursiva &gt;= 30</b>. Vamos aplicar a três candidatos.", 4600],
      ["Ana: 78 &gt;= 70 é True; 30 &gt;= 30 é True. <b>True and True = True</b>: passa.", 4400],
      ["Diego: 73 &gt;= 70 é True, mas 28 &gt;= 30 é False. Com <b>and</b>, basta um False para o resultado ser False.", 5200],
      ["Bruno: 67 &gt;= 70 já é False. Com and, o resultado é False, seja qual for a discursiva.", 4400],
      ["Se a regra usasse <b>or</b> (uma das duas basta), Diego passaria: True or False = True. E <b>not</b> inverte: not True é False.", 5600],
    ],
    html: () => `<table class="conv lg"><thead><tr><th>Candidato</th><th>total &gt;= 70</th><th>disc. &gt;= 30</th><th>and</th></tr></thead><tbody>${CAND.map(([n, t, d], i) => {
      const a = t >= 70, b = d >= 30;
      return `<tr data-q="${i + 1}" class="${a && b ? "ok" : "erro"}"><td>${n} (${t}, ${d})</td><td><code>${a ? "True" : "False"}</code></td><td><code>${b ? "True" : "False"}</code></td><td><code>${a && b ? "True" : "False"}</code></td></tr>`;
    }).join("")}<tr data-q="4" class="ok"><td colspan="3">Diego com <code>or</code>: True or False</td><td><code>True</code></td></tr></tbody></table>`,
    aplicar: revelar,
  });

  // 5. precedência: a expressão encolhe uma operação por vez
  const RED = [
    ["10 + 4 * 3 ** 2 >= 40 and not False", "3 ** 2", "O Python não lê da esquerda para a direita: segue a <b>ordem de precedência</b>. 1º a potência, <b>**</b>: 3 ** 2."],
    ["10 + 4 * 9 >= 40 and not False", "4 * 9", "Deu 9. 2º multiplicação e divisão (* / // %): 4 * 9."],
    ["10 + 36 >= 40 and not False", "10 + 36", "Deu 36. 3º soma e subtração: 10 + 36."],
    ["46 >= 40 and not False", "46 >= 40", "Deu 46. 4º as comparações: 46 >= 40."],
    ["True and not False", "not False", "Deu True. 5º o <b>not</b>: not False."],
    ["True and True", "True and True", "Deu True. 6º o <b>and</b> (o or vem por último): True and True."],
    ["True", "", "Resultado final: <b>True</b>. Na dúvida, use parênteses: o que está entre parênteses vem antes de tudo."],
  ];
  C.registrar("precedencia", {
    titulo: "Uma expressão resolvida na ordem de precedência",
    passos: RED.map((r) => [r[2], 4200]),
    html: () => `<div class="pr"><p class="pr-exp"><code></code></p><ol class="pr-ordem"><li>**</li><li>* / // %</li><li>+ −</li><li>== != &lt; &gt; &lt;= &gt;=</li><li>not</li><li>and</li><li>or</li></ol></div>`,
    aplicar(p, k) {
      const [exp, foco] = RED.at(k);
      const code = p.querySelector(".pr-exp code");
      const html = foco ? esc(exp).replace(esc(foco), `<mark>${esc(foco)}</mark>`) : `<b>${esc(exp)}</b>`;
      if (code.innerHTML !== html) { code.innerHTML = html; code.classList.remove("troca"); void code.offsetWidth; code.classList.add("troca"); }
      const nivel = k;
      p.querySelectorAll(".pr-ordem li").forEach((li, j) => { li.classList.toggle("feito", j < nivel); li.classList.toggle("agora", j === nivel); });
    },
  });

  // 6. curto-circuito: o segundo lado nem é olhado
  C.registrar("curto", {
    titulo: "Curto-circuito evita a divisão por zero",
    passos: [
      ["Um cargo com <b>vagas = 0</b> (o edital ainda não definiu). Queremos saber se há mais de 10 inscritos por vaga, sem quebrar o programa.", 4600],
      ["Linha A: o Python começa pela esquerda. <b>vagas != 0</b> é False.", 3800],
      ["Com <b>and</b>, um False já decide tudo. O Python <b>nem olha</b> o lado direito, e a divisão por zero não acontece. Resultado: False.", 5400],
      ["Linha B: as mesmas condições, na ordem trocada. Agora a divisão vem primeiro: 1250 / 0.", 4200],
      ["<b>ZeroDivisionError</b>: o programa para. A ordem das condições importa quando uma delas protege a outra.", 5000],
    ],
    html: () => `<div class="cc"><div class="cc-linha" data-l="a"><small>A</small><code><span class="cc-p1">vagas != 0</span> and <span class="cc-p2">inscritos / vagas &gt; 10</span></code><b class="cc-res"></b></div>
      <div class="cc-linha" data-l="b"><small>B</small><code><span class="cc-p1">inscritos / vagas &gt; 10</span> and <span class="cc-p2">vagas != 0</span></code><b class="cc-res"></b></div></div>`,
    aplicar(p, k) {
      const A = p.querySelector('[data-l="a"]'), B = p.querySelector('[data-l="b"]');
      A.querySelector(".cc-p1").classList.toggle("lido", k >= 1);
      A.querySelector(".cc-p2").classList.toggle("pulado", k >= 2);
      A.querySelector(".cc-res").textContent = k >= 2 ? "False" : "";
      A.classList.toggle("ok", k >= 2);
      B.classList.toggle("on", k >= 3);
      B.querySelector(".cc-p1").classList.toggle("quebra", k >= 3);
      B.querySelector(".cc-res").textContent = k >= 4 ? "ZeroDivisionError" : "";
      B.classList.toggle("erro", k >= 4);
    },
  });
})();
