// Demonstrações da galeria: um exemplo de cada molde do motor de animação (clip.js).
// Dados do concurso fictício da lição "Comece por aqui"; nomes e notas são inventados.
(function () {
  const C = window.Clip;

  C.registrar("g-fluxo", C.fluxo({
    titulo: "Molde fluxo: entrada, processamento e saída",
    caixas: [
      { papel: "Entrada", titulo: "O que chega", linhas: [["objetiva = 54", 0], ["discursiva = 31", 0]] },
      { papel: "Processamento", titulo: "O que se faz", linhas: [["total = 54 + 31 = 85", 1], ["85 >= 70 ? sim", 2]] },
      { papel: "Saída", titulo: "O que sai", linhas: [["“aprovada”", 3]] },
    ],
    passos: [
      ["As notas da Carla chegam: é a <b>entrada</b>.", 0, 3400],
      ["O <b>processamento</b> soma as notas.", 1, 3200],
      ["E compara com o corte: 85 &gt;= 70.", 1, 3200],
      ["A <b>saída</b> é o resultado: aprovada.", 2, 3200],
    ],
  }));

  C.registrar("g-execucao", C.execucao({
    titulo: "Molde execução: linha por linha, com a memória",
    codigo: ["total = 48", "total = total + 30", "aprovado = total >= 70", "print(aprovado)"],
    vars: ["total", "aprovado"],
    passos: [
      { l: "O computador lê uma linha por vez.", linha: -1, mem: {} },
      { l: "total recebe 48.", linha: 0, mem: { total: 48 } },
      { l: "total + 30 = 78, e o resultado volta para total.", linha: 1, mem: { total: 78 } },
      { l: "78 &gt;= 70 é True.", linha: 2, mem: { total: 78, aprovado: "True" } },
      { l: "print mostra a resposta.", linha: 3, mem: { total: 78, aprovado: "True" }, saida: "True" },
    ],
  }));

  C.registrar("g-tabela", C.tabela({
    titulo: "Molde tabela: uma linha por passo",
    colunas: ["Pergunta", "Resposta"],
    linhas: [
      { celulas: ["<code>78 &gt;= 70</code>", "<code>True</code>"], tom: "ok" },
      { celulas: ["<code>67 &gt;= 70</code>", "<code>False</code>"], tom: "erro" },
      { celulas: ["<code>70 &gt;= 70</code>", "<code>True</code>"], tom: "ok" },
    ],
    passos: [["Três candidatos e a mesma pergunta: alcançou o corte?", 3200], ["Ana, 78: sim.", 2800], ["Bruno, 67: não.", 2800], ["Exatamente 70 também passa, porque &gt;= inclui o igual.", 3800]],
  }));

  C.registrar("g-reducao", C.reducao({
    titulo: "Molde redução: a expressão encolhe na ordem certa",
    ordem: ["* /", "+ −", "comparação"],
    etapas: [
      { exp: "40 + 12 * 2 >= 60", foco: "12 * 2", l: "Primeiro a multiplicação." },
      { exp: "40 + 24 >= 60", foco: "40 + 24", l: "Depois a soma." },
      { exp: "64 >= 60", foco: "64 >= 60", l: "Por fim a comparação." },
      { exp: "True", foco: "", l: "Resultado: <b>True</b>." },
    ],
  }));

  C.registrar("g-antes-depois", C.antesDepois({
    titulo: "Molde antes e depois: o que mudou fica marcado",
    rotulos: ["antes", "depois"],
    versoes: ["T=48+30\nprint(T)", "<mark>total</mark>=48+30\nprint(<mark>total</mark>)", "total<mark> = </mark>48<mark> + </mark>30\nprint(total)"],
    passos: [["Funciona, mas o nome T não diz nada.", 0, 3400], ["Um nome que diz o que guarda.", 1, 3400], ["Espaço em volta do = e do +.", 2, 3400]],
  }));

  C.registrar("g-gavetas", C.gavetas({
    titulo: "Molde gavetas: cada item vai para o seu grupo",
    gavetas: [{ id: "num", nome: "Número", desc: "dá para fazer conta" }, { id: "txt", nome: "Texto", desc: "entre aspas" }],
    itens: [{ t: "78", g: "num" }, { t: "“Ana”", g: "txt" }, { t: "7.5", g: "num" }, { t: "“70”", g: "txt" }],
    passos: [["Quatro valores misturados.", 3000], ["Os números vão para a primeira gaveta.", 3200], ["Os textos, com aspas, para a segunda. Inclusive o “70”.", 3800]],
  }));

  C.registrar("g-barras", C.barras({
    titulo: "Molde barras: valores, destaque e média",
    dados: [{ rotulo: "Ana", valor: 78 }, { rotulo: "Bruno", valor: 67 }, { rotulo: "Carla", valor: 85 }, { rotulo: "Diego", valor: 73 }, { rotulo: "Elisa", valor: 66 }, { rotulo: "Felipe", valor: 84 }],
    passos: [
      { l: "O total de pontos de seis candidatos fictícios.", ver: 0, ms: 2400 },
      { l: "Cada barra cresce até o total do candidato.", ver: 6 },
      { l: "Os dois que ficaram abaixo do corte de 70: Bruno e Elisa.", ver: 6, destaque: [1, 4] },
      { l: "A <b>média</b> é a soma dividida pela quantidade: 453 / 6 = 75,5.", ver: 6, media: true, ms: 4600 },
    ],
  }));
})();
