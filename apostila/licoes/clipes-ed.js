// Animações da lição "Estruturas de dados: o mapa" (ED.01). Cada uma é função do passo (clip.js);
// a árvore usa o mesmo desenho das bancadas (estruturas.js). As chaves vêm do caso da telemetria (1000, 1050, ...).
(function () {
  const C = window.Clip, E = window.Estruturas;
  const esc = C.esc;

  // 1. procurar na lista e no dicionário
  const LISTA = [12, 45, 7, 33, 90, 21, 64, 87];
  C.registrar("ed-custo", {
    titulo: "Procurar a matrícula 87 numa lista e num dicionário",
    passos: [
      ["Oito matrículas numa <b>lista sem ordem</b>. Vamos procurar a 87, que é a última.", 3800],
      ["Sem ordem, o computador confere uma por uma: 12? 45? 7?... Cada conferência é um <b>passo</b>.", 4200],
      ["Só no 8º passo ele acha a 87. Com 1 milhão de matrículas, seriam até 1 milhão de passos: custo <b>O(n)</b>.", 4600],
      ["No <b>dicionário</b>, a própria chave diz onde ela mora: 87 % 8 = 7, gaveta 7.", 4400],
      ["Vai direto à gaveta 7 e confere: <b>1 passo</b>, com 8 ou com 1 milhão de matrículas. Custo <b>O(1)</b> em média.", 4800],
    ],
    html: () => `<div class="edc">
      <p class="edc-rot">Lista</p><div class="edc-lista">${LISTA.map((v, i) => `<span class="edc-cel" data-i="${i}">${v}</span>`).join("")}</div><p class="edc-cont" data-l></p>
      <p class="edc-rot">Dicionário</p><div class="edc-dict"><span class="edc-chave">87</span><span class="edc-seta" aria-hidden="true">→</span><span class="edc-conta">87 % 8 = 7</span><span class="edc-seta" aria-hidden="true">→</span><span class="edc-gav">gaveta 7: <b>87</b></span></div><p class="edc-cont" data-d></p></div>`,
    aplicar(p, k) {
      const vistos = [0, 3, 8, 8, 8][k];
      p.querySelectorAll(".edc-cel").forEach((c, i) => { c.classList.toggle("visto", i < vistos); c.classList.toggle("achou", i === 7 && vistos === 8); c.classList.toggle("agora", i === vistos - 1 && k < 2); });
      p.querySelector("[data-l]").textContent = vistos ? `${vistos} ${vistos === 1 ? "passo" : "passos"}${vistos === 8 ? ": achou" : "..."}` : "";
      const d = p.querySelector(".edc-dict");
      d.classList.toggle("on", k >= 3); d.classList.toggle("achou", k >= 4);
      p.querySelector("[data-d]").textContent = k >= 4 ? "1 passo: achou" : k >= 3 ? "calculando a gaveta..." : "";
    },
  });

  // 2. inserir no começo: vetor desloca, lista troca setas
  const ALUNOS = ["Ana", "Bia", "Caio", "Davi"];
  C.registrar("ed-inserir", {
    titulo: "O Zé entra no começo: no vetor e na lista ligada",
    passos: [
      ["Quatro alunos num <b>vetor</b> (posições 0 a 3) e numa <b>lista ligada</b>. O Zé precisa entrar no começo.", 3800],
      ["No vetor, a posição 0 está ocupada. Para abrir espaço, <b>todos andam uma casa</b>, de trás para a frente: 4 deslocamentos.", 4800],
      ["Agora o Zé entra na posição 0. Com 1 milhão de alunos, seria 1 milhão de deslocamentos: <b>O(n)</b>.", 4200],
      ["Na lista ligada ninguém anda. Cria-se o nó do Zé, e ele passa a <b>apontar para a Ana</b>.", 4400],
      ["Por fim, o <b>início</b> aponta para o Zé. Duas setas mudaram, com 4 ou com 1 milhão de alunos: <b>O(1)</b>.", 4600],
    ],
    html: () => `<div class="edi"><p class="edc-rot">Vetor</p><div class="edi-vetor"></div><p class="edc-rot">Lista ligada</p><div class="edi-lista"></div></div>`,
    aplicar(p, k) {
      const vet = p.querySelector(".edi-vetor"), lis = p.querySelector(".edi-lista");
      const v = k >= 2 ? ["Zé", ...ALUNOS] : k >= 1 ? ["", ...ALUNOS] : [...ALUNOS, ""];
      vet.innerHTML = v.map((t, i) => `<span class="edi-cel${t ? "" : " vaga"}${(k === 1 && t) ? " anda" : ""}${t === "Zé" ? " novo" : ""}"><b>${t ? esc(t) : "&nbsp;"}</b><small>${i}</small></span>`).join("");
      const comZe = k >= 3;
      lis.innerHTML = `<span class="edi-ini${k >= 4 ? " mudou" : ""}">início →</span>` + (comZe && k >= 4 ? `<span class="edi-no novo">Zé</span><span class="edi-seta mudou">→</span>` : "")
        + ALUNOS.map((t, i) => `<span class="edi-no">${esc(t)}</span><span class="edi-seta">→</span>`).join("") + `<span class="edi-fim">fim</span>`
        + (comZe && k < 4 ? `<span class="edi-solto"><span class="edi-no novo">Zé</span> <span class="edi-seta mudou">→ Ana</span></span>` : "");
    },
  });

  // 3. pilha e fila
  C.registrar("ed-pilha-fila", {
    titulo: "Quem sai primeiro: pilha e fila",
    passos: [
      ["Entram A, B e C, nessa ordem, numa <b>pilha</b> e numa <b>fila</b>.", 3800],
      ["Na pilha, cada um fica <b>em cima</b> do anterior. Na fila, cada um entra <b>no fim</b>.", 4200],
      ["Tirar um da pilha: sai o <b>C</b>, o último que entrou (LIFO). Tirar um da fila: sai o <b>A</b>, o primeiro (FIFO).", 5000],
      ["O D entra nas duas. Na pilha, ele vai para o topo e será o próximo a sair; na fila, vai para o fim.", 4800],
    ],
    html: () => `<div class="edp"><div class="edp-col"><p class="edc-rot">Pilha</p><div class="edp-pilha"></div><p class="edc-cont" data-p></p></div><div class="edp-col"><p class="edc-rot">Fila</p><div class="edp-fila"></div><p class="edc-cont" data-f></p></div></div>`,
    aplicar(p, k) {
      const pilha = [["A"], ["A", "B", "C"], ["A", "B"], ["A", "B", "D"]][k], fila = [["A"], ["A", "B", "C"], ["B", "C"], ["B", "C", "D"]][k];
      p.querySelector(".edp-pilha").innerHTML = [...pilha].reverse().map((t, i) => `<span class="edp-it${i === 0 ? " topo" : ""}">${t}</span>`).join("");
      p.querySelector(".edp-fila").innerHTML = `<span class="edp-sai">sai</span>` + fila.map((t, i) => `<span class="edp-it${i === 0 ? " topo" : ""}">${t}</span>`).join("") + `<span class="edp-sai">entra</span>`;
      p.querySelector("[data-p]").textContent = k === 2 ? "saiu C" : k === 3 ? "próximo a sair: D" : "";
      p.querySelector("[data-f]").textContent = k === 2 ? "saiu A" : k === 3 ? "próximo a sair: B" : "";
    },
  });

  // 4. hash: M = 50 junta tudo; M = 53 espalha
  const LINHAS = [[1000, 50], [1050, 50], [1100, 50], [1000, 53], [1050, 53], [1100, 53]];
  C.registrar("ed-hash", {
    titulo: "A gaveta é o resto da divisão por M",
    passos: [
      ["Três leituras da telemetria: 1000, 1050 e 1100. A gaveta de cada uma é <b>chave % M</b>. Começamos com M = 50.", 4200],
      ["1000 % 50 = <b>0</b>: gaveta 0.", 3200],
      ["1050 % 50 = <b>0</b> também: <b>colisão</b>. A gaveta 0 vira uma fila: 1000 → 1050.", 4200],
      ["1100 % 50 = <b>0</b> de novo. Todas as chaves são múltiplas de 50, então o resto é sempre 0. Achar 1100 custa 3 conferências.", 5200],
      ["Com <b>M = 53</b>, que é primo: 1000 → 46, 1050 → 43, 1100 → 40. Cada uma na sua gaveta: achar volta a custar 1.", 5600],
    ],
    html: () => `<div class="edh"><table class="tabela edh-tab"><thead><tr><th>chave</th><th>conta</th><th>gaveta</th></tr></thead><tbody>${LINHAS.map(([c, m], i) => `<tr data-i="${i}"><td class="m">${c}</td><td class="m">${c} % ${m}</td><td class="m"><b>${c % m}</b></td></tr>`).join("")}</tbody></table><p class="edh-gav"></p></div>`,
    aplicar(p, k) {
      const ver = [0, 1, 2, 3, 6][k];
      p.querySelectorAll(".edh-tab tbody tr").forEach((tr, i) => { tr.hidden = i >= ver; tr.classList.toggle("colide", i < 3 && i > 0 && k >= 2 && k < 4); });
      p.querySelector(".edh-gav").innerHTML = k === 0 ? "" : k < 4 ? `M = 50 · gaveta 0: <b class="alerta">${LINHAS.slice(0, ver).map((l) => l[0]).join(" → ")}</b>` : "M = 53 · gaveta 40: <b>1100</b> · gaveta 43: <b>1050</b> · gaveta 46: <b>1000</b>";
    },
  });

  // 5. ABB que degenera e AVL que gira
  const passosAvl = () => {
    const ins = (ks, f) => ks.reduce((r, k) => f(r, k), null);
    const abb = (ks) => ins(ks, (r, k) => E.insAbb(r, k));
    const avl = (ks) => ins(ks, (r, k) => E.insAvl(r, k, []));
    return [
      { r: abb([1000]), m: { 1000: "novo" } },
      { r: abb([1000, 1050]), m: { 1050: "novo" } },
      { r: abb([1000, 1050, 1100]), m: { 1100: "novo" } },
      { r: avl([1000, 1050, 1100]), m: { 1050: "novo" } },
      { r: abb([1000, 1050, 1100, 1150, 1200]), m: {} },
      { r: avl([1000, 1050, 1100, 1150, 1200]), m: {} },
    ];
  };
  C.registrar("ed-avl", {
    titulo: "A AVL gira quando um lado fica dois níveis mais alto",
    passos: [
      ["Entra o 1000: a raiz. O número embaixo é o <b>fator de balanceamento</b>: altura da esquerda menos altura da direita.", 4400],
      ["Entra o 1050, maior: vai para a <b>direita</b>. O 1000 fica com fator −1, ainda aceito.", 4000],
      ["Entra o 1100, maior ainda: direita da direita. O 1000 fica com <b>fator −2</b>: desequilibrou.", 4600],
      ["O 1000 tem −2 e o filho do lado pesado (1050) tem −1: <b>mesmo sinal, rotação simples à esquerda</b>. O 1050 sobe para a raiz.", 5600],
      ["Sem girar, uma ABB comum com 5 chaves em ordem vira uma fila torta: altura 4, até 5 comparações.", 4600],
      ["A AVL com as mesmas 5 chaves: altura 2, no máximo 3 comparações. Com 1 milhão de chaves, cerca de 20.", 5000],
    ],
    html: () => `<div class="eda"></div>`,
    aplicar(p, k) {
      const s = passosAvl()[k];
      p.querySelector(".eda").innerHTML = E.svgArvore(s.r, { marcas: s.m, ajustar: true });
    },
  });
})();
