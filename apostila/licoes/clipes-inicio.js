// Animações da lição "Comece por aqui": a lista de aprovados de um concurso fictício.
// Todos os nomes e notas são inventados.
(function () {
  const C = window.Clip;
  const D = [["Ana", "Analista", 48, 30], ["Bruno", "Técnico", 42, 25], ["Carla", "Analista", 54, 31], ["Diego", "Técnico", 45, 28],
    ["Elisa", "Analista", 39, 27], ["Felipe", "Técnico", 51, 33], ["Gabriela", "Analista", 44, 29], ["Hugo", "Técnico", 36, 22]]
    .map(([n, c, o, d]) => ({ n, c, o, d, t: o + d }));
  const rank = [...D].sort((a, b) => b.t - a.t || b.o - a.o); // desempate: maior nota objetiva
  const chip = (r) => `<span class="chip-c" data-n="${r.n}"><b>${r.n}</b><i>${r.t}</i></span>`;
  const por = (p, sel, n) => [...p.querySelectorAll(sel)].find((e) => e.dataset.n === n);

  // 1. linha, coluna, célula
  C.registrar("tabela", {
    titulo: "Uma lista de candidatos vira tabela",
    passos: [
      ["Esta é a lista de candidatos de um concurso fictício, organizada como <b>tabela</b>. Por enquanto só aparecem os nomes das colunas, o cabeçalho.", 3800],
      ["Cada candidato vira <b>uma linha</b>. Em ciência de dados, cada linha é uma <b>observação</b>: um caso real que foi medido. Destacamos a linha da Carla.", 4600],
      ["Cada coisa que anotamos sobre as pessoas vira <b>uma coluna</b>: cargo, nota objetiva, nota discursiva. Cada coluna é uma <b>variável</b>. Destacamos a coluna Objetiva.", 4600],
      ["Linha e coluna se cruzam numa <b>célula</b>, que guarda um valor. A nota objetiva da Carla é 54.", 4200],
      ["Resumo: <b>tabela = observações nas linhas + variáveis nas colunas</b>. Quase toda análise de dados começa assim.", 4200],
    ],
    html: () => `<table class="tab-demo"><thead><tr><th>Nome</th><th>Cargo</th><th class="num">Objetiva</th><th class="num">Discursiva</th></tr></thead><tbody>${
      D.map((r, i) => `<tr style="--i:${i}"><td>${r.n}</td><td>${r.c}</td><td class="num">${r.o}</td><td class="num">${r.d}</td></tr>`).join("")}</tbody></table>
      <div class="tab-chips"><span class="tab-chip" data-c="1">Linha = uma pessoa (observação)</span><span class="tab-chip" data-c="2">Coluna = uma característica (variável)</span><span class="tab-chip" data-c="3">Célula = um valor</span></div>`,
    aplicar(p, k) {
      const t = p.querySelector(".tab-demo");
      t.classList.toggle("ver", k >= 1);
      t.classList.toggle("dl", k === 1);
      t.classList.toggle("dc", k === 2);
      t.classList.toggle("dx", k === 3);
      p.querySelectorAll(".tab-chip").forEach((c) => c.classList.toggle("on", Number(c.dataset.c) <= k));
    },
  });

  // 2. filtrar com a nota de corte
  C.registrar("funil", {
    titulo: "Aplicar a nota de corte aos candidatos",
    passos: [
      ["Chegaram 8 candidatos, cada um com a <b>nota total</b> (objetiva + discursiva).", 3600],
      ["O edital tem uma regra, a <b>nota de corte</b>. Para cada candidato a pergunta é a mesma: o total é maior ou igual a 70?", 4400],
      ["Aplicamos a regra linha por linha. Quem responde <b>sim</b> passa; quem responde <b>não</b> fica de fora. <b>Filtrar</b> é isso: manter só as linhas que atendem a uma regra. Sobraram 5.", 5200],
      ["Uma segunda regra do edital: só há 3 vagas. Valem os 3 primeiros do ranking (você vê como se ordena na lição 4); os outros 2 aprovados ficam no <b>cadastro de reserva</b>.", 5600],
    ],
    html: () => `<div class="funil">
      <p class="f-tit">Candidatos, em ordem de inscrição · nome e nota total</p>
      <div class="chips f-fila">${D.map(chip).join("")}</div>
      <div class="f-regra">Regra do edital (fictícia): nota de corte 70 → total ≥ 70 ?</div>
      <div class="f-zonas">
        <div class="f-zona f-saiu"><p>Ficam de fora (&lt; 70)</p><div class="chips"></div></div>
        <div class="f-zona f-passou"><p class="t-passou">Passaram (≥ 70)</p><div class="chips" data-s="vagas"></div><p class="t-reserva">Cadastro de reserva</p><div class="chips" data-s="reserva"></div></div>
      </div></div>`,
    aplicar(p, k) {
      const chips = [...p.querySelectorAll(".chip-c")];
      const fila = p.querySelector(".f-fila"), saiu = p.querySelector(".f-saiu .chips");
      const vagas = p.querySelector('[data-s="vagas"]'), reserva = p.querySelector('[data-s="reserva"]');
      C.flip(chips, () => {
        p.querySelector(".funil").classList.toggle("vazia", k >= 2);
        p.querySelector(".f-regra").classList.toggle("on", k >= 1);
        p.querySelector(".f-zonas").classList.toggle("on", k >= 2);
        p.querySelector(".f-passou").classList.toggle("sep", k >= 3);
        p.querySelector(".t-passou").textContent = k >= 3 ? "Convocados (3 vagas)" : "Passaram (≥ 70)";
        if (k < 2) D.forEach((r) => { const c = por(p, ".chip-c", r.n); fila.appendChild(c); c.className = "chip-c"; });
        else if (k === 2) D.forEach((r) => { const c = por(p, ".chip-c", r.n); (r.t >= 70 ? vagas : saiu).appendChild(c); c.className = "chip-c " + (r.t >= 70 ? "ok" : "nao"); });
        else rank.forEach((r, j) => { const c = por(p, ".chip-c", r.n); if (r.t < 70) { saiu.appendChild(c); c.className = "chip-c nao"; } else { (j < 3 ? vagas : reserva).appendChild(c); c.className = "chip-c " + (j < 3 ? "ok" : "res"); } });
      });
    },
  });

  // 3. tipos de variável
  const COLS = [["cargo", "cat"], ["objetiva", "num"], ["discursiva", "num"], ["total", "num"], ["situação", "cat"], ["posição", "ord"]];
  C.registrar("caixas", {
    titulo: "Número, categoria ou ordem",
    passos: [
      ["Aqui estão as colunas da nossa tabela. Cada uma guarda um <b>tipo</b> de informação.", 3400],
      ["Para descobrir o tipo, faça uma pergunta: <b>dá para somar ou tirar a média disso?</b>", 3800],
      ["Objetiva, discursiva e total são <b>números</b>: faz sentido somar e tirar média.", 3800],
      ["Cargo e situação são <b>categorias</b>: rótulos que separam as pessoas em grupos. Dá para <i>contar</i> quantos há de cada, mas não somar “Analista” com “Técnico”.", 5200],
      ["Posição (1º, 2º, 3º…) é uma <b>ordem</b>. Parece número, mas somar posições não diz nada: o que importa é quem vem antes de quem.", 5200],
    ],
    html: () => `<p class="f-tit">Colunas da tabela de aprovados</p>
      <div class="chips mesa">${COLS.map(([n, t]) => `<span class="chip-c" data-n="${n}" data-t="${t}"><b>${n}</b></span>`).join("")}</div>
      <p class="mesa-pergunta">Dá para somar ou tirar a média disso?</p>
      <div class="cestas">
        <div class="cesta" data-t="num"><p><b>Número</b>dá para somar e tirar média</p><div class="chips"></div></div>
        <div class="cesta" data-t="cat"><p><b>Categoria</b>é um rótulo; serve para separar em grupos</p><div class="chips"></div></div>
        <div class="cesta" data-t="ord"><p><b>Ordem</b>1º, 2º, 3º: a posição importa, a soma não</p><div class="chips"></div></div>
      </div>`,
    aplicar(p, k) {
      const chips = [...p.querySelectorAll(".chip-c")];
      const mesa = p.querySelector(".mesa");
      const libera = { num: 2, cat: 3, ord: 4 };
      C.flip(chips, () => {
        p.querySelector(".mesa-pergunta").classList.toggle("on", k === 1);
        p.querySelectorAll(".cesta").forEach((c) => c.classList.toggle("on", k >= libera[c.dataset.t]));
        COLS.forEach(([n, t]) => {
          const c = por(p, ".chip-c", n), vai = k >= libera[t];
          (vai ? p.querySelector(`.cesta[data-t="${t}"] .chips`) : mesa).appendChild(c);
          c.className = "chip-c" + (vai ? " " + t : "");
        });
      });
    },
  });

  // 4. ordenar, desempatar e filtrar
  C.registrar("ranking", {
    titulo: "Ordenar a lista, desempatar e filtrar",
    passos: [
      ["A lista chega na ordem de inscrição (a ordem alfabética). O comprimento da barra mostra a nota total.", 3800],
      ["<b>Ordenar</b> é colocar as linhas em fila usando uma coluna como critério. Aqui: pelo total, do maior para o menor. Os valores não mudam; só a ordem das linhas.", 5400],
      ["Há um <b>empate</b>: Diego e Gabriela têm 73. O edital desempata pela nota objetiva: 45 contra 44. Diego fica em 4º, Gabriela em 5ª.", 5600],
      ["Agora <b>filtrar</b>: as linhas com total abaixo de 70 ficam apagadas. Sobram 5 aprovados, já em ordem.", 4600],
      ["Ordenar + filtrar responde à pergunta do concurso: <b>quem passou e em que posição</b>.", 4200],
    ],
    html: () => `<div class="rank">${D.map((r) => `<div class="linha-r${r.t === 73 ? " emp" : ""}" data-n="${r.n}"><span class="pos"></span><b>${r.n}</b><span class="tr"><i style="width:${r.t}%"></i></span><span class="val">${r.t}</span><span class="obj">obj ${r.o}</span></div>`).join("")}</div>`,
    aplicar(p, k) {
      const rk = p.querySelector(".rank");
      const linhas = [...p.querySelectorAll(".linha-r")];
      const ordem = k >= 1 ? rank : D;
      C.flip(linhas, () => {
        ordem.forEach((r, j) => {
          const l = por(p, ".linha-r", r.n);
          rk.appendChild(l);
          l.querySelector(".pos").textContent = k >= 1 ? j + 1 + "º" : "";
          l.classList.toggle("fora", k >= 3 && r.t < 70);
        });
        rk.classList.toggle("ord", k >= 1);
        rk.classList.toggle("obj", k >= 2);
      });
    },
  });

  // 5. soma, média e gráfico de barras
  C.registrar("barras", {
    titulo: "Gráfico de barras e média",
    passos: [
      ["Queremos resumir as notas totais dos 8 candidatos em poucos números. Primeiro o gráfico: uma barra para cada candidato.", 3600],
      ["Cada barra é a nota total de uma pessoa. Num relance dá para ver quem está no alto e quem está embaixo. O gráfico de barras serve para <b>comparar</b>.", 5000],
      ["Para resumir os 8 valores em um só, <b>somamos todas as notas</b>: 584.", 4200],
      ["E <b>dividimos pela quantidade</b> de candidatos: 584 ÷ 8 = 73. Esta é a <b>média</b>, a linha vermelha tracejada.", 5000],
      ["A média é um resumo, não a história toda. Três candidatos ficaram acima dela (verde), três abaixo (laranja) e dois exatamente nela (cinza).", 5600],
    ],
    html: () => `<div class="barras"><div class="b-colunas">${D.map((r) => `<div class="barra" data-v="${r.t}" data-n="${r.n}" style="--h:${r.t}%"></div>`).join("")}<div class="b-media"><span>média 73</span></div></div>
      <div class="b-nomes">${D.map((r) => `<span>${r.n.slice(0, 3)}</span>`).join("")}</div><p class="b-conta"></p></div>`,
    aplicar(p, k) {
      p.querySelector(".b-colunas").classList.toggle("on", k >= 1);
      p.querySelector(".b-media").classList.toggle("on", k >= 3);
      p.querySelectorAll(".barra").forEach((b) => {
        const t = Number(b.dataset.v);
        b.classList.toggle("acima", k >= 4 && t > 73);
        b.classList.toggle("abaixo", k >= 4 && t < 73);
        b.classList.toggle("igual", k >= 4 && t === 73);
      });
      p.querySelector(".b-conta").textContent = k === 2 ? "78 + 67 + 85 + 73 + 66 + 84 + 73 + 58 = 584" : k >= 3 ? "584 ÷ 8 = 73" : "";
    },
  });

  // 6. entrada, processamento e saída de um mini-projeto de dados
  C.registrar("projeto", C.fluxo({
    titulo: "Um projeto de dados em três partes",
    caixas: [
      { papel: "Entrada", titulo: "A tabela de candidatos", linhas: [["8 linhas, 4 colunas", 0], ["notas objetiva e discursiva", 0]] },
      { papel: "Processamento", titulo: "O que fazemos com ela", linhas: [["total ← obj + disc", 1], ["filtrar total ≥ 70", 2], ["ordenar e desempatar", 3], ["média do total", 4]] },
      { papel: "Saída", titulo: "A resposta", linhas: [["5 passaram", 5], ["Carla em 1º lugar", 5], ["média geral: 73", 5]] },
    ],
    passos: [
      ["Todo projeto de dados tem três partes. Primeiro a <b>entrada</b>: a tabela que você recebeu.", 0, 3800],
      ["No <b>processamento</b>, criamos uma coluna nova, o total, somando as duas notas.", 1, 3600],
      ["Depois <b>filtramos</b>: ficam só os candidatos com total ≥ 70.", 1, 3400],
      ["Depois <b>ordenamos</b> pelo total e desempatamos pela nota objetiva.", 1, 3400],
      ["E <b>resumimos</b> com a média.", 1, 3000],
      ["A <b>saída</b> é a resposta à pergunta do concurso. Repare: é o mesmo desenho de qualquer algoritmo, entrada, processamento e saída, que você estuda no Módulo 1.", 2, 5400],
    ],
  }));
})();
