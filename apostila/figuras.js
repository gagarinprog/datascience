// Ilustrações da apostila do DOMÍNIO. Cada figura é um SVG desenhado com as cores do tema
// (classes fx-* em estilo.css), então funciona no claro e no escuro. Gráficos de dados são
// calculados aqui, em escala, a partir dos números.
(function () {
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  function texto(x, y, t, cls = "fx-t", ancora = "middle") {
    const linhas = String(t).split("\n");
    const y0 = y - ((linhas.length - 1) * 16) / 2;
    return linhas
      .map((l, i) => `<text x="${x}" y="${y0 + i * 16}" class="${cls}" text-anchor="${ancora}" dominant-baseline="middle">${esc(l.replace(/^ +/, (m) => " ".repeat(m.length)))}</text>`)
      .join("");
  }
  function caixa(x, y, w, h, t, cls = "fx-caixa", tcls = "fx-t", r = 4) {
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" class="${cls}"/>` + (t ? texto(x + w / 2, y + h / 2, t, tcls) : "");
  }
  function oval(cx, cy, w, h, t, cls = "fx-suave") {
    return `<rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="${h / 2}" class="${cls}"/>` + texto(cx, cy, t);
  }
  function para(x, y, w, h, t, cls = "fx-caixa", tcls = "fx-t") {
    const k = 12;
    return `<polygon points="${x + k},${y} ${x + w},${y} ${x + w - k},${y + h} ${x},${y + h}" class="${cls}"/>` + texto(x + w / 2, y + h / 2, t, tcls);
  }
  function losango(cx, cy, w, h, t, cls = "fx-aviso") {
    return `<polygon points="${cx},${cy - h / 2} ${cx + w / 2},${cy} ${cx},${cy + h / 2} ${cx - w / 2},${cy}" class="${cls}"/>` + texto(cx, cy, t);
  }
  function linha(pontos, cls = "fx-traco", comPonta = true) {
    return `<polyline points="${pontos.map((p) => p.join(",")).join(" ")}" class="${cls}"${comPonta ? ' marker-end="url(#ponta)"' : ""}/>`;
  }
  const seta = (x1, y1, x2, y2, cls) => linha([[x1, y1], [x2, y2]], cls);
  const circulo = (cx, cy, r, cls = "fx-caixa") => `<circle cx="${cx}" cy="${cy}" r="${r}" class="${cls}"/>`;
  const svg = (w, h, conteudo, rotulo) => `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(rotulo)}">${conteudo}</svg>`;

  // tabela pequena: colunas [{nome, w, destaque}], linhas de valores
  function tabela(x, y, titulo, colunas, linhas, classeLinha) {
    let s = titulo ? texto(x, y - 10, titulo, "fx-tb", "start") : "";
    let cx = x;
    colunas.forEach((c) => {
      s += caixa(cx, y, c.w, 26, c.nome, "fx-suave", "fx-t2", 0);
      linhas.forEach((l, i) => {
        const cls = classeLinha ? classeLinha(i) : c.destaque ? "fx-destaque" : "fx-caixa";
        s += caixa(cx, y + 26 * (i + 1), c.w, 26, l[colunas.indexOf(c)], cls, "fx-tm", 0);
      });
      cx += c.w;
    });
    return s;
  }

  // números pseudoaleatórios fixos, para os gráficos serem sempre iguais
  function gerador(semente) {
    let s = semente;
    return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
  }
  function normal(rnd) {
    const u = 1 - rnd();
    const v = rnd();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  const FIG = {};

  FIG.LOG = () =>
    svg(760, 345,
      oval(70, 150, 100, 36, "início") +
      seta(120, 150, 150, 150) +
      para(150, 122, 140, 56, "ler preço\ne pago") +
      seta(290, 150, 318, 150) +
      losango(400, 150, 164, 96, "pago ≥ preço?") +
      linha([[482, 150], [520, 150]]) + texto(500, 138, "sim", "fx-tc") +
      caixa(520, 125, 210, 50, "troco ← pago − preço", "fx-destaque") +
      seta(625, 175, 625, 213) +
      para(550, 213, 150, 46, "mostrar troco") +
      seta(625, 259, 625, 296) +
      oval(625, 314, 100, 34, "fim") +
      seta(400, 198, 400, 213) + texto(416, 205, "não", "fx-te", "start") +
      para(325, 213, 150, 46, "mostrar\n“falta dinheiro”") +
      linha([[400, 259], [400, 314], [573, 314]]) +
      texto(20, 222, "as formas", "fx-tb", "start") +
      oval(52, 250, 64, 22, "") + texto(96, 250, "início e fim", "fx-t2", "start") +
      para(20, 270, 64, 22, "") + texto(96, 281, "entrada e saída", "fx-t2", "start") +
      caixa(20, 300, 64, 22, "") + texto(96, 311, "processamento", "fx-t2", "start") +
      losango(52, 333, 40, 20, "") + texto(96, 333, "decisão", "fx-t2", "start"),
      "Fluxograma do troco: ler preço e pago; se pago for maior ou igual ao preço, calcular e mostrar o troco; senão, mostrar falta dinheiro.");

  FIG.PY = () =>
    svg(760, 250,
      caixa(20, 30, 300, 200, "", "fx-suave") +
      texto(170, 16, "o código, lido de cima para baixo", "fx-t2") +
      ["1  preco = 18", "2  pago = 50", "3  troco = pago - preco", "4  preco = 20"].map((l, i) => texto(40, 65 + i * 42, l, "fx-tm", "start")).join("") +
      texto(390, 16, "nomes (etiquetas)", "fx-t2") +
      texto(545, 16, "valores na memória", "fx-t2") +
      caixa(345, 45, 90, 30, "preco", "fx-destaque", "fx-tt") +
      caixa(345, 115, 90, 30, "pago", "fx-destaque", "fx-tt") +
      caixa(345, 175, 90, 30, "troco", "fx-destaque", "fx-tt") +
      caixa(515, 30, 60, 32, "20") + caixa(515, 74, 60, 32, "18", "fx-suave", "fx-t2") +
      caixa(515, 114, 60, 32, "50") + caixa(515, 174, 60, 32, "32") +
      seta(435, 58, 513, 47, "fx-traco-tinta") +
      linha([[435, 62], [513, 90]], "fx-pontilhado") + texto(590, 90, "da linha 1; sem etiqueta,\no Python descarta", "fx-t2", "start") +
      seta(435, 130, 513, 130, "fx-traco-tinta") +
      seta(435, 190, 513, 190, "fx-traco-tinta") +
      texto(590, 46, "a linha 4 passou\na etiqueta para o 20", "fx-t2", "start") +
      texto(590, 190, "50 − 18,\ncalculado na linha 3", "fx-t2", "start"),
      "Variáveis como etiquetas: preco aponta para 20 depois de ter apontado para 18; pago aponta para 50; troco para 32.");

  FIG.CMP = () =>
    svg(760, 300,
      caixa(20, 40, 120, 70, "entrada\nteclado, rede") +
      seta(140, 75, 188, 75) +
      caixa(190, 40, 140, 70, "processador\n(CPU)", "fx-destaque") +
      seta(330, 65, 378, 65) + seta(380, 87, 332, 87) +
      caixa(380, 40, 160, 70, "memória (RAM)\nrápida, se apaga") +
      seta(540, 65, 588, 65) + seta(590, 87, 542, 87) +
      caixa(590, 40, 150, 70, "disco\nlento, permanente") +
      texto(460, 128, "acesso em cerca de 100 ns", "fx-t2") +
      texto(665, 128, "acesso de 0,1 a 10 ms", "fx-t2") +
      seta(260, 110, 260, 160) +
      caixa(190, 160, 140, 50, "saída\ntela, arquivo") +
      texto(20, 255, "13 em binário:", "fx-tb", "start") +
      ["8", "4", "2", "1"].map((p, i) => texto(424 + i * 50, 222, p, "fx-t2")).join("") +
      ["1", "1", "0", "1"].map((b, i) => caixa(402 + i * 50, 235, 44, 40, b, b === "1" ? "fx-destaque" : "fx-caixa", "fx-tm")).join("") +
      texto(140, 255, "cada casa vale o dobro da seguinte", "fx-t2", "start") +
      texto(610, 255, "8 + 4 + 0 + 1 = 13", "fx-tm", "start"),
      "O caminho dos dados: entrada, processador, memória e disco, saída. Abaixo, 13 escrito em binário como 1101.");

  FIG.BD = () => {
    const disc = texto(84, 58, "disciplinas", "fx-tb", "start") + tabela(20, 70, "", [{ nome: "id", w: 44, destaque: true }, { nome: "nome", w: 190 }],
      [["1", "Banco de Dados"], ["2", "Estatística"], ["3", "Lógica de Programação"]]);
    const ques = tabela(420, 70, "questoes", [{ nome: "id", w: 44 }, { nome: "disciplina_id", w: 116, destaque: true }, { nome: "dificuldade", w: 104 }],
      [["1", "1", "media"], ["2", "1", "facil"], ["3", "2", "facil"], ["4", "3", "dificil"]]);
    const etapas = [["FROM questoes\n+ JOIN", "120 linhas"], ["WHERE\nfacil", "37 linhas"], ["GROUP BY\nnome", "6 grupos"], ["SELECT\nnome, COUNT", "2 colunas"], ["ORDER BY\nquestoes DESC", "maior primeiro"]];
    let pipe = texto(20, 252, "a ordem em que o banco executa a consulta", "fx-tb", "start");
    etapas.forEach(([a, b], i) => {
      const x = 20 + i * 148;
      pipe += caixa(x, 266, 130, 50, a, i === 2 ? "fx-destaque" : "fx-caixa", "fx-tm") + texto(x + 65, 330, b, "fx-t2");
      if (i < 4) pipe += seta(x + 130, 291, x + 146, 291);
    });
    return svg(760, 345,
      disc + ques +
      `<path d="M 522 70 C 522 30, 42 30, 42 68" class="fx-traco-tinta" marker-end="url(#ponta)"/>` +
      texto(280, 18, "a chave estrangeira aponta para a chave primária", "fx-tt") +
      texto(20, 190, "id: chave primária, não se repete", "fx-t2", "start") +
      texto(420, 216, "disciplina_id: de qual disciplina é a questão", "fx-t2", "start") + pipe,
      "Duas tabelas ligadas: questoes.disciplina_id aponta para disciplinas.id. Abaixo, a ordem de execução de uma consulta, de 120 linhas até 6 grupos ordenados.");
  };

  FIG.MAT = () => {
    const o = [60, 250], e = 40;
    const p = (x, y) => [o[0] + x * e, o[1] - y * e];
    let grade = "";
    for (let i = 0; i <= 6; i++) grade += `<line x1="${p(i, 0)[0]}" y1="${p(0, 0)[1]}" x2="${p(i, 5)[0]}" y2="${p(0, 5)[1]}" class="fx-grade"/>`;
    for (let j = 0; j <= 5; j++) grade += `<line x1="${p(0, j)[0]}" y1="${p(0, j)[1]}" x2="${p(6, j)[0]}" y2="${p(0, j)[1]}" class="fx-grade"/>`;
    const q = (x, y) => [440 + x * 64, 240 - y * 64];
    const poly = (pts, cls) => `<polygon points="${pts.map((t) => q(...t).join(",")).join(" ")}" class="${cls}"/>`;
    return svg(760, 290,
      texto(20, 20, "vetores: somar é andar uma seta e depois a outra", "fx-tb", "start") + grade +
      linha([p(3, 1), p(4, 3)], "fx-pontilhado", false) + linha([p(1, 2), p(4, 3)], "fx-pontilhado", false) +
      linha([p(0, 0), p(3, 1)], "fx-traco-tinta") + texto(...p(2.2, 0.35), "u = (3, 1)", "fx-tt") +
      linha([p(0, 0), p(1, 2)], "fx-traco-tinta") + texto(...p(0.1, 2.4), "v = (1, 2)", "fx-tt", "start") +
      linha([p(0, 0), p(4, 3)], "fx-traco-certo") + texto(...p(4.15, 3.25), "u + v = (4, 3)", "fx-tc", "start") +
      texto(440, 20, "matriz: transforma o espaço", "fx-tb", "start") +
      poly([[0, 0], [1, 0], [1, 1], [0, 1]], "fx-suave") +
      poly([[0, 0], [1, 0], [2, 1], [1, 1]], "fx-destaque") +
      texto(...q(0.5, -0.35), "antes", "fx-t2") + texto(...q(1.6, 1.3), "depois", "fx-tt") +
      texto(630, 100, "[ 1  1 ]\n[ 0  1 ]", "fx-tm", "start") +
      texto(630, 155, "cada ponto (x, y)\nvai para (x + y, y):\no quadrado inclina", "fx-t2", "start"),
      "À esquerda, os vetores u = (3, 1) e v = (1, 2) e a soma (4, 3). À direita, uma matriz inclina um quadrado.");
  };

  FIG.EST = () => {
    const rnd = gerador(7);
    const dados = Array.from({ length: 1000 }, () => Math.max(0, Math.min(100, 64 + 12 * normal(rnd))));
    const media = dados.reduce((a, b) => a + b, 0) / dados.length;
    const dp = Math.sqrt(dados.reduce((a, b) => a + (b - media) ** 2, 0) / (dados.length - 1));
    const dentro = dados.filter((d) => Math.abs(d - media) <= dp).length / dados.length;
    const ini = 25, fim = 105, largura = 5;
    const contagens = [];
    for (let b = ini; b < fim; b += largura) contagens.push(dados.filter((d) => d >= b && d < b + largura).length);
    const maximo = Math.ceil(Math.max(...contagens) / 40) * 40;
    const X = (v) => 70 + ((v - ini) / (fim - ini)) * 630, Y = (c) => 250 - (c / maximo) * 210;
    let s = `<rect x="${X(media - dp)}" y="40" width="${X(media + dp) - X(media - dp)}" height="210" class="fx-suave"/>`;
    contagens.forEach((c, i) => {
      const x = X(ini + i * largura);
      s += `<rect x="${x + 1}" y="${Y(c)}" width="${X(ini + largura) - X(ini) - 2}" height="${250 - Y(c)}" class="fx-destaque"/>`;
    });
    let curva = [];
    for (let v = ini; v <= fim; v += 1) {
      const dens = Math.exp(-((v - media) ** 2) / (2 * dp * dp)) / (dp * Math.sqrt(2 * Math.PI));
      curva.push([X(v).toFixed(1), Y(dens * dados.length * largura).toFixed(1)]);
    }
    s += linha(curva, "fx-traco-certo", false);
    s += `<line x1="${X(media)}" y1="36" x2="${X(media)}" y2="250" class="fx-traco"/>`;
    for (let v = 30; v <= 100; v += 10) s += texto(X(v), 266, v, "fx-t2");
    for (let c = 0; c <= maximo; c += 40) s += texto(60, Y(c), c, "fx-t2", "end") + `<line x1="66" y1="${Y(c)}" x2="70" y2="${Y(c)}" class="fx-traco"/>`;
    s += `<line x1="70" y1="250" x2="700" y2="250" class="fx-traco"/>`;
    s += texto(X(media) + 6, 30, `média ${media.toFixed(1).replace(".", ",")}`, "fx-t", "start");
    s += texto(X(86), 110,`${Math.round(dentro * 100)}% das notas ficam\na um desvio-padrão\n(${dp.toFixed(1).replace(".", ",")}) da média`, "fx-t2", "start");
    s += texto(385, 290, "nota de cada um dos 1.000 candidatos (barras) e a curva normal com a mesma média e desvio (linha)", "fx-t2");
    return svg(760, 300, s, "Histograma de 1.000 notas em forma de sino, com a média e a faixa de um desvio-padrão marcadas.");
  };

  FIG.ED = () => {
    let s = "";
    const titulo = (x, y, a, b) => texto(x, y, a, "fx-tb", "start") + texto(x, y + 18, b, "fx-t2", "start");
    s += titulo(10, 16, "vetor", "lado a lado, acesso direto pelo índice");
    ["7", "3", "9", "1", "4"].forEach((v, i) => { s += caixa(20 + i * 42, 52, 42, 36, v, "fx-caixa", "fx-tm", 0) + texto(41 + i * 42, 102, i, "fx-t2"); });
    s += titulo(265, 16, "lista ligada", "cada item aponta o próximo");
    ["7", "3", "9"].forEach((v, i) => { s += caixa(270 + i * 66, 52, 44, 36, v, "fx-caixa", "fx-tm") + seta(314 + i * 66, 70, 334 + i * 66, 70); });
    s += texto(470, 70, "fim", "fx-t2", "start");
    s += titulo(520, 16, "pilha", "o último que entra sai primeiro");
    ["c", "b", "a"].forEach((v, i) => { s += caixa(540, 50 + i * 32, 100, 30, v, i === 0 ? "fx-destaque" : "fx-caixa", "fx-tm"); });
    s += seta(690, 65, 644, 65) + texto(696, 65, "topo", "fx-tt", "start");
    s += titulo(10, 176, "fila", "o primeiro que entra sai primeiro");
    ["a", "b", "c", "d"].forEach((v, i) => { s += caixa(50 + i * 42, 220, 40, 36, v, i === 0 ? "fx-destaque" : "fx-caixa", "fx-tm"); });
    s += seta(48, 238, 14, 238) + texto(28, 272, "sai", "fx-tt") + seta(254, 238, 220, 238) + texto(238, 272, "entra", "fx-tt");
    s += titulo(265, 176, "tabela hash", "a chave diz a gaveta");
    s += caixa(268, 224, 66, 32, "“kaio”", "fx-caixa", "fx-tm") + seta(334, 240, 350, 240) + caixa(352, 224, 50, 32, "h( )", "fx-aviso", "fx-tm") + seta(402, 240, 436, 266);
    [0, 1, 2, 3, 4].forEach((g) => { s += caixa(438, 218 + g * 24, 44, 24, g, g === 2 ? "fx-destaque" : "fx-suave", "fx-tm", 0); });
    s += texto(268, 290, "vai direto à gaveta 2", "fx-t2", "start");
    s += titulo(520, 176, "árvore de busca", "menores à esquerda, maiores à direita");
    const nos = { 8: [620, 230], 3: [575, 276], 10: [665, 276], 1: [550, 322], 6: [600, 322], 14: [690, 322] };
    [[8, 3], [8, 10], [3, 1], [3, 6], [10, 14]].forEach(([a, b]) => { s += `<line x1="${nos[a][0]}" y1="${nos[a][1]}" x2="${nos[b][0]}" y2="${nos[b][1]}" class="fx-traco"/>`; });
    Object.entries(nos).forEach(([v, [x, y]]) => { s += circulo(x, y, 16, v === "8" ? "fx-destaque" : "fx-caixa") + texto(x, y, v, "fx-tm"); });
    return svg(760, 345, s, "Seis estruturas: vetor, lista ligada, pilha, fila, tabela hash e árvore binária de busca.");
  };

  FIG.ALG = () => {
    const X = (n) => 70 + (n / 20) * 470, Y = (v) => 280 - (v / 400) * 250;
    const curvas = [
      ["n²", (n) => n * n, "fx-traco-erro"],
      ["n log n", (n) => (n <= 1 ? 0 : n * Math.log2(n)), "fx-traco"],
      ["n", (n) => n, "fx-traco-tinta"],
      ["log n", (n) => (n <= 1 ? 0 : Math.log2(n)), "fx-traco-certo"],
      ["1", () => 1, "fx-traco-certo"],
    ];
    let s = "";
    for (let v = 0; v <= 400; v += 100) s += `<line x1="70" y1="${Y(v)}" x2="540" y2="${Y(v)}" class="fx-grade"/>` + texto(62, Y(v), v, "fx-t2", "end");
    for (let n = 0; n <= 20; n += 5) s += texto(X(n), 296, n, "fx-t2");
    curvas.forEach(([nome, f, cls], i) => {
      const pts = [];
      for (let n = 1; n <= 20; n += 0.25) pts.push([X(n).toFixed(1), Y(Math.min(f(n), 420)).toFixed(1)]);
      s += linha(pts, cls, false);
      const fim = f(20);
      const rotulo = `${nome}: ${Number.isInteger(fim) ? fim : fim.toFixed(1).replace(".", ",")}`;
      if (i < 3) s += texto(548, [Y(400), Y(86), Y(20) - 4][i], rotulo, "fx-t2", "start");
    });
    s += texto(305, 316, "tamanho da entrada (n)", "fx-t2") + texto(20, 18, "passos", "fx-t2", "start");
    s += texto(90, 60, "log n (4,3 passos) e constante (1 passo): colados no zero", "fx-tc", "start");
    s += caixa(620, 60, 130, 150, "", "fx-suave");
    s += texto(685, 80, "com n = 1 milhão", "fx-tb") + texto(632, 115, "log n: 20 passos", "fx-tc", "start") + texto(632, 145, "n: 1 milhão", "fx-tt", "start") + texto(632, 175, "n²: 1 trilhão", "fx-te", "start");
    return svg(760, 325, s, "Gráfico de quantos passos cada classe de algoritmo dá conforme a entrada cresce: constante, logarítmica, linear, n log n e quadrática.");
  };

  FIG.POO = () =>
    svg(760, 290,
      caixa(260, 20, 240, 30, "Questao  (classe, o molde)", "fx-destaque", "fx-tb", 0) +
      caixa(260, 50, 240, 50, "enunciado\ngabarito", "fx-caixa", "fx-tm", 0) +
      caixa(260, 100, 240, 30, "corrigir(resposta)", "fx-caixa", "fx-tm", 0) +
      caixa(20, 40, 190, 54, "q1\n“2 + 2 = 4”, gabarito C", "fx-suave", "fx-t2", 27) +
      caixa(550, 40, 190, 54, "q2\n“Java é compilado”, C", "fx-suave", "fx-t2", 27) +
      linha([[258, 67], [212, 67]], "fx-pontilhado") + linha([[502, 67], [548, 67]], "fx-pontilhado") +
      texto(115, 112, "objeto feito com o molde", "fx-t2") + texto(645, 112, "outro objeto", "fx-t2") +
      caixa(90, 200, 230, 64, "QuestaoCertoErrado\ncorrigir: C ou E", "fx-caixa") +
      caixa(440, 200, 230, 64, "QuestaoMultipla\ncorrigir: A a E", "fx-caixa") +
      linha([[205, 198], [205, 165], [380, 165], [380, 132]], "fx-traco-tinta") +
      linha([[555, 198], [555, 165], [380, 165]], "fx-traco-tinta", false) +
      texto(392, 182, "herança: “é uma” Questao", "fx-tt", "start"),
      "A classe Questao como molde, dois objetos feitos com ela e duas classes filhas que herdam dela.");

  FIG.ENG = () => {
    let s = texto(20, 90, "main", "fx-tb", "start") + texto(250, 140, "ramo analise", "fx-tt", "end");
    s += `<line x1="70" y1="90" x2="500" y2="90" class="fx-traco"/>`;
    s += linha([[220, 90], [290, 170], [360, 170], [420, 90]], "fx-traco-tinta", false);
    [[70, "dados brutos"], [140, "limpeza"], [220, "README"], [420, "junta a análise"], [500, "relatório"]].forEach(([x, t], i) => {
      s += circulo(x, 90, 12, i === 4 ? "fx-destaque" : "fx-caixa") + texto(x, 60 - (i % 2) * 18, t, "fx-t2");
    });
    [[290, "média por\ndisciplina"], [360, "gráficos"]].forEach(([x, t]) => { s += circulo(x, 170, 12, "fx-caixa") + texto(x, 205, t, "fx-t2"); });
    s += texto(500, 118, "você está aqui", "fx-tt");
    s += caixa(560, 130, 190, 100, "", "fx-suave");
    s += ["$ git log --oneline", "e71 relatório", "a41 junta a análise", "9e0 gráficos"].map((l, i) => texto(572, 150 + i * 21, l, "fx-tm", "start")).join("");
    return svg(760, 245, s, "Linha do tempo do Git: commits na main, um ramo de análise com dois commits que volta e se junta à main.");
  };

  FIG.FMT = () => {
    let s = texto(20, 20, "tabela", "fx-tb", "start") + texto(270, 20, "CSV no padrão brasileiro", "fx-tb", "start") + texto(520, 20, "JSON (de uma API)", "fx-tb", "start");
    s += tabela(20, 36, "", [{ nome: "nome", w: 140 }, { nome: "nota", w: 70 }], [["Ana Souza", "7,5"], ["Kaio Mendes", "9,0"]]);
    s += caixa(270, 36, 220, 78, "", "fx-suave") + ["nome;nota", "Ana Souza;7,5", "Kaio Mendes;9,0"].map((l, i) => texto(282, 56 + i * 20, l, "fx-tm", "start")).join("");
    s += texto(270, 130, "; separa colunas, a vírgula é decimal", "fx-t2", "start");
    s += caixa(520, 36, 230, 98, "", "fx-suave") + ['[{"nome": "Ana Souza",', '  "nota": 7.5},', ' {"nome": "Kaio Mendes",', '  "nota": 9.0}]'].map((l, i) => texto(530, 54 + i * 20, l, "fx-tm", "start")).join("");
    s += linha([[125, 120], [125, 175], [330, 210]]) + seta(380, 140, 380, 205) + linha([[635, 140], [635, 175], [430, 210]]);
    s += caixa(270, 208, 220, 48, "pandas: DataFrame\n(a mesma tabela no Python)", "fx-destaque");
    return svg(760, 270, s, "Os mesmos dados em tabela, em CSV com ponto e vírgula e em JSON, todos virando um DataFrame do pandas.");
  };

  FIG.AD = () => {
    const linhas = [["BD", "1"], ["EST", "0"], ["BD", "0"], ["EST", "1"], ["BD", "1"], ["LOG", "1"]];
    const cor = { BD: "fx-destaque", EST: "fx-aviso", LOG: "fx-certo" };
    let s = texto(20, 18, "tabela de respostas", "fx-tb", "start") + texto(220, 18, "1. separar por grupo", "fx-tb", "start") + texto(430, 18, "2. aplicar a média", "fx-tb", "start") + texto(610, 18, "3. juntar", "fx-tb", "start");
    s += tabela(20, 36, "", [{ nome: "disciplina", w: 90 }, { nome: "correta", w: 70 }], linhas, (i) => cor[linhas[i][0]]);
    const grupos = [["BD", ["1", "0", "1"], "0,67"], ["EST", ["0", "1"], "0,50"], ["LOG", ["1"], "1,00"]];
    let y = 36;
    grupos.forEach(([g, vals, m]) => {
      vals.forEach((v, i) => { s += caixa(220, y + i * 24, 60, 24, g, cor[g], "fx-tm", 0) + caixa(280, y + i * 24, 50, 24, v, cor[g], "fx-tm", 0); });
      const meio = y + (vals.length * 24) / 2;
      s += seta(334, meio, 426, meio) + caixa(430, meio - 15, 130, 30, `média = ${m}`, "fx-caixa", "fx-tm");
      s += seta(562, meio, 608, 70 + grupos.findIndex((x) => x[0] === g) * 26 + 13);
      y += vals.length * 24 + 14;
    });
    s += tabela(610, 44, "", [{ nome: "disciplina", w: 80 }, { nome: "taxa", w: 60 }], grupos.map(([g, , m]) => [g, m]), (i) => cor[grupos[i][0]]);
    s += seta(182, 120, 216, 120);
    return svg(760, 260, s, "Agrupar em três passos: separar as respostas por disciplina, calcular a média de acerto de cada grupo e juntar numa tabela.");
  };

  FIG.VIS = () => {
    const graf = (x0, base, topo, titulo, cls) => {
      const Y = (v) => 240 - ((v - base) / (topo - base)) * 190;
      let s = texto(x0, 22, titulo, cls, "start");
      for (let v = base; v <= topo; v += (topo - base) / 3) s += `<line x1="${x0 + 40}" y1="${Y(v)}" x2="${x0 + 300}" y2="${Y(v)}" class="fx-grade"/>` + texto(x0 + 34, Y(v), Math.round(v), "fx-t2", "end");
      [["Banco A", 52], ["Banco B", 55]].forEach(([n, v], i) => {
        const x = x0 + 80 + i * 120;
        s += `<rect x="${x}" y="${Y(v)}" width="70" height="${240 - Y(v)}" class="fx-destaque"/>` + texto(x + 35, Y(v) - 10, `${v}%`, "fx-t") + texto(x + 35, 256, n, "fx-t2");
      });
      return s;
    };
    return svg(760, 270,
      graf(20, 50, 56, "eixo começando em 50: parece o triplo", "fx-te") + graf(420, 0, 60, "eixo começando em 0: diferença real de 3 pontos", "fx-tc"),
      "Os mesmos dois valores, 52% e 55%, em dois gráficos de barras: com o eixo cortado a diferença parece enorme; com o eixo no zero, é pequena.");
  };

  FIG.ML = () => {
    const rnd = gerador(11);
    const pts = Array.from({ length: 12 }, (_, i) => {
      const x = (i + 0.5) / 12;
      return [x, Math.sin(2 * Math.PI * x) * 0.8 + normal(rnd) * 0.22];
    });
    const mx = pts.reduce((a, p) => a + p[0], 0) / pts.length, my = pts.reduce((a, p) => a + p[1], 0) / pts.length;
    const b = pts.reduce((a, p) => a + (p[0] - mx) * (p[1] - my), 0) / pts.reduce((a, p) => a + (p[0] - mx) ** 2, 0);
    const painel = (x0, titulo, cls, curva) => {
      const X = (x) => x0 + 10 + x * 220, Y = (y) => 140 - y * 70;
      let s = caixa(x0, 30, 240, 220, "", "fx-suave") + texto(x0 + 120, 16, titulo, cls);
      s += linha(curva.map(([x, y]) => [X(x).toFixed(1), Y(y).toFixed(1)]), cls === "fx-tc" ? "fx-traco-certo" : "fx-traco-erro", false);
      pts.forEach(([x, y]) => { s += circulo(X(x), Y(y), 4, "fx-cheio"); });
      return s;
    };
    const reta = [[0, my - b * mx], [1, my + b * (1 - mx)]];
    const seno = Array.from({ length: 41 }, (_, i) => [i / 40, Math.sin((2 * Math.PI * i) / 40) * 0.8]);
    const decorou = [[0, pts[0][1]], ...pts, [1, pts[pts.length - 1][1]]];
    return svg(760, 260,
      painel(10, "simples demais: erra tudo", "fx-te", reta) + painel(260, "na medida: pega o padrão", "fx-tc", seno) + painel(510, "decorou os pontos: erra os novos", "fx-te", decorou),
      "Três modelos para os mesmos pontos: uma reta que não acompanha a curva, uma curva que pega o padrão e uma linha que passa por todos os pontos.");
  };

  FIG.NSQ = () => {
    let s = texto(20, 18, "documento", "fx-tb", "start") + texto(215, 18, "chave-valor", "fx-tb", "start") + texto(410, 18, "grafo", "fx-tb", "start") + texto(590, 18, "colunar", "fx-tb", "start");
    s += caixa(20, 32, 180, 150, "", "fx-suave") + ["{", ' "nome": "Kaio",', ' "respostas": [', '   {"q":12, "r":"C"},', '   {"q":47, "r":"E"}', " ]", "}"].map((l, i) => texto(28, 48 + i * 19, l, "fx-tm", "start")).join("");
    [["sessao:91", "carrinho"], ["visitas", "1532"], ["usuario:12", "Kaio"]].forEach(([k, v], i) => {
      s += caixa(215, 40 + i * 48, 96, 32, k, "fx-destaque", "fx-tm") + seta(311, 56 + i * 48, 325, 56 + i * 48) + caixa(327, 40 + i * 48, 74, 32, v, "fx-caixa", "fx-tm");
    });
    const g = { Ana: [450, 60], Kaio: [520, 100], Joana: [440, 150], Igor: [540, 170] };
    [["Ana", "Kaio"], ["Kaio", "Joana"], ["Ana", "Joana"], ["Kaio", "Igor"]].forEach(([a, b]) => { s += `<line x1="${g[a][0]}" y1="${g[a][1]}" x2="${g[b][0]}" y2="${g[b][1]}" class="fx-traco"/>`; });
    Object.entries(g).forEach(([n, [x, y]]) => { s += caixa(x - 30, y - 14, 60, 28, n, "fx-caixa", "fx-t2", 14); });
    [["id", ["1", "2", "3"]], ["nome", ["Ana", "Kaio", "Igor"]], ["correta", ["1", "0", "1"]]].forEach(([c, vals], i) => {
      const x = 590 + i * 56;
      s += caixa(x, 34, 52, 24, c, "fx-suave", "fx-t2", 0) + vals.map((v, j) => caixa(x, 58 + j * 24, 52, 24, v, "fx-destaque", "fx-tm", 0)).join("");
    });
    s += texto(590, 150, "cada coluna guardada\njunta e comprimida", "fx-t2", "start");
    s += texto(20, 208, "estrutura flexível", "fx-t2", "start") + texto(215, 208, "busca instantânea", "fx-t2", "start") + texto(410, 208, "as ligações são o dado", "fx-t2", "start") + texto(590, 208, "somar milhões de linhas", "fx-t2", "start");
    return svg(760, 220, s, "Quatro modelos de dados: documento JSON, pares chave e valor, grafo de pessoas ligadas e armazenamento por coluna.");
  };

  FIG.ETI = () => {
    const etapas = [["coleta", "para que finalidade?"], ["armazenamento", "quem tem acesso?"], ["uso", "só o necessário"], ["compartilhamento", "identifica alguém?"], ["descarte", "até quando guardar?"]];
    let s = texto(20, 18, "a vida de um dado pessoal, com a pergunta de cada etapa", "fx-tb", "start");
    etapas.forEach(([e, p], i) => {
      const x = 20 + i * 148;
      s += caixa(x, 36, 130, 44, e, "fx-destaque") + texto(x + 65, 98, p, "fx-t2");
      if (i < 4) s += seta(x + 130, 58, x + 146, 58);
    });
    s += texto(20, 140, "pseudonimizar: trocar o que identifica por um código", "fx-tb", "start");
    s += caixa(20, 156, 300, 40, "Kaio Mendes · 12/03/1990 · 79002-150", "fx-erro", "fx-tm") + seta(322, 176, 386, 176);
    s += caixa(390, 156, 300, 40, "usuário 12 · 1990 · 79002-xxx", "fx-certo", "fx-tm");
    s += texto(20, 214, "cuidado: cruzar com outras bases pode reidentificar a pessoa", "fx-t2", "start");
    return svg(760, 225, s, "As cinco etapas da vida de um dado pessoal e um exemplo de pseudonimização.");
  };

  // figuras das lições
  FIG.RECEITA = () =>
    svg(760, 220,
      caixa(20, 20, 340, 180, "", "fx-erro") + texto(36, 42, "para uma pessoa", "fx-te", "start") +
      ["Ponha um pouco de pó de café.", "Coloque água quente.", "Adoce a gosto.", "Sirva quando estiver bom."].map((l, i) => texto(36, 76 + i * 30, l, "fx-t", "start")).join("") +
      caixa(400, 20, 340, 180, "", "fx-certo") + texto(416, 42, "para uma máquina", "fx-tc", "start") +
      ["1. Ponha 2 colheres de pó no filtro.", "2. Ferva 200 ml de água.", "3. Despeje a água sobre o pó.", "4. Ponha 1 colher de açúcar.", "5. Sirva."].map((l, i) => texto(416, 72 + i * 26, l, "fx-t", "start")).join(""),
      "Duas receitas de café: a da esquerda usa expressões vagas como um pouco e a gosto; a da direita tem quantidades e ordem definidas.");

  FIG.EPS = () =>
    svg(760, 170,
      texto(105, 22, "entrada", "fx-tb") + texto(380, 22, "processamento", "fx-tb") + texto(655, 22, "saída", "fx-tb") +
      para(20, 50, 170, 70, "preço = 18\npago = 50", "fx-caixa", "fx-tm") +
      seta(190, 85, 268, 85) +
      caixa(270, 50, 220, 70, "troco ← pago − preço", "fx-destaque", "fx-tm") +
      seta(490, 85, 568, 85) +
      para(570, 50, 170, 70, "troco = 32", "fx-caixa", "fx-tm") +
      texto(105, 145, "os dados que chegam", "fx-t2") + texto(380, 145, "o que se faz com eles", "fx-t2") + texto(655, 145, "o resultado", "fx-t2"),
      "Entrada, processamento e saída do troco: entram preço 18 e pago 50, calcula-se pago menos preço, sai troco 32.");

  window.FIG = FIG;
  window.FIG_DEFS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><marker id="ponta" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fx-ponta"/></marker></defs></svg>`;
})();
