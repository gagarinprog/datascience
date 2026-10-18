// Animações da lição "Algoritmo" (LOG.01), com exemplos de concurso e de estudo.
(function () {
  const C = window.Clip;

  // 1. instrução vaga x algoritmo
  C.registrar("vagoexato", {
    titulo: "Instrução vaga e algoritmo",
    passos: [
      ["Duas formas de pedir a mesma coisa: conferir o seu desempenho depois de uma prova.", 3400],
      ["A instrução da esquerda é <b>vaga</b>: depende do bom senso de quem a executa.", 3600],
      ["Repare nas dúvidas: bem, comparado com quê? Quanto é “bem”? Duas pessoas fariam coisas diferentes, e uma máquina nem saberia começar.", 5200],
      ["A da direita é um <b>algoritmo</b>: passos em ordem, cada um com um único jeito de ser feito. Aqui estão os dois primeiros.", 4600],
      ["Passos 3 e 4: contar e escrever. O algoritmo <b>termina</b> e entrega um resultado.", 4200],
      ["Quem seguir esses passos, pessoa ou máquina, chega ao mesmo número. Esse é o teste de um bom algoritmo.", 4600],
    ],
    html: () => `<div class="vx">
      <div class="vx-card vx-vago"><h4>Instrução vaga</h4><p>“Confira como você foi na prova.”</p>
        <div class="duvida"><span>Foi bem, comparado com quê?</span><span>Quanto é “bem”?</span><span>Cada pessoa faria de um jeito</span></div></div>
      <div class="vx-card vx-exato"><h4>Algoritmo</h4><p>“Confira o seu desempenho na prova.”</p>
        <ol><li>Pegue o gabarito oficial.</li><li>Compare cada resposta sua com o gabarito.</li><li>Conte quantas coincidiram.</li><li>Escreva esse número como seus acertos.</li></ol></div></div>`,
    aplicar(p, k) {
      p.querySelector(".vx-vago").classList.toggle("on", k >= 1);
      p.querySelector(".vx-vago").classList.toggle("duv", k >= 2);
      p.querySelector(".vx-exato").classList.toggle("on", k >= 3);
      const ate = k < 3 ? 0 : k === 3 ? 2 : 4;
      p.querySelectorAll(".vx-exato li").forEach((li, j) => li.classList.toggle("ver", j < ate));
    },
  });

  // 2. entrada, processamento e saída com as notas de um concurso
  C.registrar("eps", C.fluxo({
    titulo: "Entrada, processamento e saída: notas de um concurso",
    caixas: [
      { papel: "Entrada", titulo: "O que chega", linhas: [["objetiva = 48", 0], ["discursiva = 30", 0]] },
      { papel: "Processamento", titulo: "O que se faz", linhas: [["total ← 48 + 30 = 78", 1], ["78 ≥ 70 ? sim", 2]] },
      { papel: "Saída", titulo: "O que sai", linhas: [["“aprovado”", 3]] },
    ],
    passos: [
      ["Todo algoritmo tem três partes. A <b>entrada</b> é o que chega de fora: aqui, as duas notas de um candidato.", 0, 4000],
      ["O <b>processamento</b> é o que se faz com a entrada. Primeiro uma conta: somar as notas.", 1, 3600],
      ["Depois uma <b>decisão</b>: o total alcança a nota de corte, 70? Sim.", 1, 3600],
      ["A <b>saída</b> é o resultado entregue: “aprovado”.", 2, 3400],
      ["Para qualquer problema, comece com três perguntas: <b>o que eu recebo, o que preciso entregar e que caminho leva de um ao outro?</b>", 2, 5200],
    ],
  }));

  // 3. pseudocódigo sendo executado
  C.registrar("exec-pseudo", C.execucao({
    titulo: "Executando o pseudocódigo da classificação",
    codigo: ["leia total", "se total >= 70 então", "  situacao ← \"aprovado\"", "senão", "  situacao ← \"reprovado\"", "fimse", "escreva situacao"],
    vars: ["total", "situacao"],
    passos: [
      { l: "Vamos executar este pseudocódigo com total = 78. O computador lê <b>uma linha por vez</b>, de cima para baixo.", linha: -1, mem: {} },
      { l: "Linha 1: <b>leia total</b>. O valor 78 chega e fica guardado na memória, na caixa chamada total.", linha: 0, mem: { total: 78 } },
      { l: "Linha 2: a decisão. 78 ≥ 70? <b>Sim</b>. O computador segue pelo caminho do <b>então</b>.", linha: 1, mem: { total: 78 } },
      { l: "Linha 3: a seta <b>←</b> guarda o valor “aprovado” na caixa situacao.", linha: 2, mem: { total: 78, situacao: "aprovado" } },
      { l: "As linhas 4 e 5, o caminho do <b>senão</b>, foram <b>puladas</b>: só um dos dois caminhos roda. O computador salta para o fimse.", linha: 5, mem: { total: 78, situacao: "aprovado" } },
      { l: "Linha 7: <b>escreva situacao</b>. A saída aparece na tela: aprovado.", linha: 6, mem: { total: 78, situacao: "aprovado" }, saida: "aprovado" },
    ],
  }));

  // 4. fluxograma percorrido por uma ficha
  // a ficha espera na seta que entra em cada forma, para nunca cobrir o texto
  const P = { ini: [262, 28], leia: [180, 64], dec: [180, 136], sim: [90, 246], nao: [270, 246], esc: [180, 345], fim: [180, 413] };
  const V = {
    iniLeia: [[262, 28], [262, 64], [180, 64]], leiaDec: [[180, 64], [180, 136]],
    decSim: [[180, 136], [180, 190], [90, 190], [90, 246]], decNao: [[180, 64], [180, 190], [270, 190], [270, 246]],
    simEsc: [[90, 246], [90, 335], [180, 335], [180, 345]], naoFim: [[270, 246], [270, 335], [180, 335], [180, 413]],
    escFim: [[180, 345], [180, 413]],
  };
  const S = [
    { pos: "ini", val: "", nos: ["ini"], cam: [] },
    { pos: "leia", val: 78, nos: ["ini", "leia"], cam: ["c1"], via: V.iniLeia },
    { pos: "dec", val: 78, nos: ["ini", "leia", "dec"], cam: ["c1", "c2"], via: V.leiaDec },
    { pos: "sim", val: 78, nos: ["ini", "leia", "dec", "sim"], cam: ["c1", "c2", "c3"], via: V.decSim },
    { pos: "esc", val: 78, nos: ["ini", "leia", "dec", "sim", "esc"], cam: ["c1", "c2", "c3", "c5"], via: V.simEsc },
    { pos: "fim", val: 78, nos: ["ini", "leia", "dec", "sim", "esc", "fim"], cam: ["c1", "c2", "c3", "c5", "c7"], via: V.escFim },
    { pos: "leia", val: 66, nos: ["ini", "leia"], cam: ["c1"] },
    { pos: "nao", val: 66, nos: ["ini", "leia", "dec", "nao"], cam: ["c1", "c2", "c4"], via: V.decNao },
    { pos: "fim", val: 66, nos: ["ini", "leia", "dec", "nao", "esc", "fim"], cam: ["c1", "c2", "c4", "c6", "c7"], via: V.naoFim },
  ];
  C.registrar("fluxo-nota", {
    titulo: "Percorrendo o fluxograma da classificação",
    passos: [
      ["Este é o mesmo algoritmo da classificação, agora como <b>fluxograma</b>: um desenho em que cada forma tem um papel e as setas dão o caminho. Uma ficha vai percorrê-lo.", 4800],
      ["Depois do <b>início</b> (oval) vem a <b>entrada</b> (paralelogramo): <b>leia total</b>. A ficha entra carregando o valor 78.", 4400],
      ["O <b>losango</b> é a decisão: 78 ≥ 70? A ficha chega à pergunta.", 3800],
      ["A resposta é <b>sim</b>: a ficha vai ao retângulo do processamento, situacao ← “aprovado”. O outro caminho não é visitado.", 5000],
      ["Os dois caminhos se juntam na <b>saída</b>: escreva situacao. Aparece “aprovado”.", 4200],
      ["O oval do <b>fim</b>: o algoritmo terminou e entregou um resultado.", 3600],
      ["Agora uma segunda ficha, com total = 66, no mesmo fluxograma.", 3400],
      ["66 ≥ 70? <b>Não.</b> Desta vez a ficha segue pelo caminho do não e processa situacao ← “reprovado”.", 5000],
      ["Ela chega à saída e ao fim: “reprovado”. Mesmo desenho, dois caminhos possíveis: <b>só um é percorrido a cada vez</b>.", 5200],
    ],
    html: () => `<svg class="fl" viewBox="0 0 360 470" role="img" aria-label="Fluxograma: início, leia total, total maior ou igual a 70, aprovado ou reprovado, escreva situação, fim">
      <path class="fl-cam" data-c="c1" d="M180 48 V80"/><path class="fl-cam" data-c="c2" d="M180 120 V152"/>
      <path class="fl-cam" data-c="c3" d="M95 190 H90 V270"/><path class="fl-cam" data-c="c4" d="M265 190 H270 V270"/>
      <path class="fl-cam" data-c="c5" d="M90 310 V335 H180 V360"/><path class="fl-cam" data-c="c6" d="M270 310 V335 H180 V360"/>
      <path class="fl-cam" data-c="c7" d="M180 400 V426"/>
      <text x="62" y="182" class="fx-t2">sim</text><text x="274" y="182" class="fx-t2">não</text>
      <rect class="fl-no fx-caixa" data-n="ini" x="124" y="8" width="112" height="40" rx="20"/><text class="fx-tm" x="180" y="33" text-anchor="middle">início</text>
      <polygon class="fl-no fx-caixa" data-n="leia" points="115,80 245,80 235,120 105,120"/><text class="fx-tm" x="180" y="105" text-anchor="middle">leia total</text>
      <polygon class="fl-no fx-caixa" data-n="dec" points="180,152 265,190 180,228 95,190"/><text class="fx-tm" x="180" y="195" text-anchor="middle">total ≥ 70 ?</text>
      <rect class="fl-no fx-caixa" data-n="sim" x="8" y="270" width="164" height="40" rx="6"/><text class="fx-tm" x="90" y="295" text-anchor="middle" font-size="10">situacao ← “aprovado”</text>
      <rect class="fl-no fx-caixa" data-n="nao" x="188" y="270" width="164" height="40" rx="6"/><text class="fx-tm" x="270" y="295" text-anchor="middle" font-size="10">situacao ← “reprovado”</text>
      <polygon class="fl-no fx-caixa" data-n="esc" points="115,360 245,360 235,400 105,400"/><text class="fx-tm" x="180" y="385" text-anchor="middle" font-size="12.5">escreva situacao</text>
      <rect class="fl-no fx-caixa" data-n="fim" x="124" y="426" width="112" height="40" rx="20"/><text class="fx-tm" x="180" y="451" text-anchor="middle">fim</text>
      <g class="fl-ficha"><circle r="13"/><text text-anchor="middle" dy="4.5"></text></g></svg>`,
    aplicar(p, k, antes) {
      const s = S[k];
      p.querySelectorAll(".fl-no").forEach((n) => n.classList.toggle("on", s.nos.includes(n.dataset.n)));
      p.querySelectorAll(".fl-cam").forEach((c) => c.classList.toggle("on", s.cam.includes(c.dataset.c)));
      const f = p.querySelector(".fl-ficha");
      f.querySelector("text").textContent = s.val;
      const [x, y] = P[s.pos];
      if (s.via && antes === k - 1 && f.animate && !C.reduz()) f.animate(s.via.map(([a, b]) => ({ transform: `translate(${a}px, ${b}px)` })), { duration: 450 * s.via.length, easing: "ease-in-out" });
      f.style.transform = `translate(${x}px, ${y}px)`;
    },
  });

  // 5. teste de mesa: a nota de um candidato que não passou
  C.registrar("exec-mesa", C.execucao({
    titulo: "Teste de mesa com objetiva 40 e discursiva 24",
    teste: true,
    codigo: ["leia objetiva", "leia discursiva", "total ← objetiva + discursiva", "se total >= 70 então", "  escreva \"aprovado\"", "senão", "  escreva \"reprovado\"", "fimse"],
    vars: ["objetiva", "discursiva", "total"],
    passos: [
      { l: "Teste de mesa com objetiva = 40 e discursiva = 24. Ao lado, a memória; embaixo, a tabela que você monta no papel.", linha: -1, mem: {} },
      { l: "Linha 1: lê a objetiva. Anote na tabela <b>só o que mudou</b>: objetiva = 40.", linha: 0, mem: { objetiva: 40 } },
      { l: "Linha 2: lê a discursiva: 24.", linha: 1, mem: { objetiva: 40, discursiva: 24 } },
      { l: "Linha 3: a conta. 40 + 24 = 64, guardado em total.", linha: 2, mem: { objetiva: 40, discursiva: 24, total: 64 } },
      { l: "Linha 4: a decisão. 64 ≥ 70? <b>Não</b>. Anote a pergunta e a resposta; o caminho vai para o senão.", linha: 3, mem: { objetiva: 40, discursiva: 24, total: 64 }, nota: "total ≥ 70 ?  64 ≥ 70 → <b>não</b>" },
      { l: "Linha 7: o caminho do senão escreve “reprovado”. A linha 5 foi pulada, por isso <b>não aparece</b> na tabela: ela registra só o que foi executado.", linha: 6, mem: { objetiva: 40, discursiva: 24, total: 64 }, saida: "reprovado" },
    ],
  }));
})();
