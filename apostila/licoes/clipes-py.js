// Animações da lição "Primeiros passos" (PY.01): REPL, script, print e input, comentários, bloco e PEP 8.
// Os dados são do mesmo concurso fictício da lição "Comece por aqui".
(function () {
  const C = window.Clip;
  const esc = C.esc;

  // 1. REPL: pergunta e resposta na hora
  const REPL = [
    ["48 + 30", "78", 1],
    ["total = 48 + 30", "", 2],
    ["total", "78", 3],
    ["total >= 70", "True", 4],
    ['print("aprovado")', "aprovado", 5],
  ];
  C.registrar("repl", {
    titulo: "O REPL do Python: pergunta e resposta na hora",
    passos: [
      ["O <b>REPL</b> é uma conversa com o Python. Ele mostra um aviso, <b>&gt;&gt;&gt;</b>, e espera você digitar uma linha.", 3800],
      ["Você digita <b>48 + 30</b> e aperta Enter. O Python calcula e <b>responde na hora</b>: 78.", 4200],
      ["Aqui você pede para <b>guardar</b> o resultado no nome <b>total</b>. Guardar não é mostrar: o Python obedece e <b>não escreve nada</b>.", 5000],
      ["Digitar só o nome <b>total</b> é pedir o valor guardado. Agora ele aparece: 78.", 4200],
      ["Uma pergunta de sim ou não: 78 ≥ 70? O Python responde <b>True</b> (verdadeiro).", 4200],
      ["Para escrever de propósito, use <b>print</b>. O REPL serve para testar ideias rápidas, linha por linha.", 4600],
    ],
    html: () => `<div class="term" role="img" aria-label="Terminal do Python"><div class="term-barra"><i></i><i></i><i></i><span>python</span></div>
      <div class="term-corpo">${REPL.map(([cmd, resp, q]) => `<div class="term-par" data-q="${q}"><div><span class="pr">&gt;&gt;&gt;</span> <code>${esc(cmd)}</code></div>${resp ? `<div class="resp">${esc(resp)}</div>` : '<div class="resp vazia">(nada aparece)</div>'}</div>`).join("")}
      <div class="term-par term-cursor" data-q="0"><span class="pr">&gt;&gt;&gt;</span> <span class="cur"></span></div></div></div>`,
    aplicar(p, k) {
      p.querySelectorAll(".term-par[data-q]").forEach((e) => {
        const q = Number(e.dataset.q);
        e.classList.toggle("ver", q <= k);
        e.classList.toggle("agora", q === k && q > 0);
      });
    },
  });

  // 2. script: o arquivo roda de cima para baixo
  C.registrar("py-script", C.execucao({
    titulo: "Rodando um script com a média de duas notas",
    codigo: ["n1 = 6", "n2 = 9", "media = (n1 + n2) / 2", "print(media)"],
    vars: ["n1", "n2", "media"],
    passos: [
      { l: "Um <b>script</b> é um arquivo com as linhas já escritas, como <b>media.py</b>. Ao rodar, o Python executa <b>tudo, de cima para baixo</b>, sem você digitar nada.", linha: -1, mem: {} },
      { l: "Linha 1: o nome <b>n1</b> passa a guardar o 6.", linha: 0, mem: { n1: 6 } },
      { l: "Linha 2: o nome <b>n2</b> guarda o 9.", linha: 1, mem: { n1: 6, n2: 9 } },
      { l: "Linha 3: o Python faz a conta, (6 + 9) / 2, e guarda 7.5 em <b>media</b>. Nada aparece na tela ainda.", linha: 2, mem: { n1: 6, n2: 9, media: 7.5 } },
      { l: "Linha 4: <b>print(media)</b> escreve o valor na tela. Num script, só aparece o que tiver <b>print</b>.", linha: 3, mem: { n1: 6, n2: 9, media: 7.5 }, saida: "7.5" },
      { l: "O arquivo fica salvo: você roda de novo quando quiser, ou troca o 6 e o 9 e roda outra vez. No REPL, o que você digitou some quando fecha.", linha: -1, mem: { n1: 6, n2: 9, media: 7.5 }, saida: "7.5" },
    ],
  }));

  // 3. print e input: a entrada chega como texto
  C.registrar("py-input", C.execucao({
    titulo: "input devolve texto; int() converte em número",
    codigo: ['nome = input("Nome: ")', 'texto = input("Nota: ")', "nota = int(texto)", 'print(nome, "tirou", nota)'],
    vars: ["nome", "texto", "nota"],
    passos: [
      { l: "Um programa que <b>pergunta</b> ao usuário. Vamos ver o que o Python guarda em cada caixa. As aspas “ ” vão indicar quando o valor é <b>texto</b>.", linha: -1, mem: {} },
      { l: "Linha 1: <b>input</b> mostra a pergunta e <b>espera</b>. Você digita Ana. O Python guarda o texto “Ana”.", linha: 0, mem: { nome: "“Ana”" }, saida: "Nome: Ana" },
      { l: "Linha 2: você digita 8. Atenção: o <b>input sempre devolve texto</b>. Em <b>texto</b> está “8”, com aspas, que é só o símbolo do número.", linha: 1, mem: { nome: "“Ana”", texto: "“8”" }, saida: "Nota: 8" },
      { l: "Linha 3: <b>int(texto)</b> converte o texto “8” no número 8. Agora dá para fazer conta com <b>nota</b>.", linha: 2, mem: { nome: "“Ana”", texto: "“8”", nota: 8 }, saida: "Nota: 8" },
      { l: "Linha 4: <b>print</b> junta as peças, separadas por espaço, e escreve na tela: Ana tirou 8.", linha: 3, mem: { nome: "“Ana”", texto: "“8”", nota: 8 }, saida: "Ana tirou 8" },
    ],
  }));

  // 4. comentários: o Python pula o que vem depois do #
  C.registrar("py-comentario", C.execucao({
    titulo: "Comentários: o Python ignora o que vem depois do #",
    codigo: ["# corte do edital (fictício)", "corte = 70", "total = 78  # 48 + 30", "print(total >= corte)"],
    vars: ["corte", "total"],
    passos: [
      { l: "As linhas em cinza e itálico começam com <b>#</b>: são <b>comentários</b>, notas para quem lê o código.", linha: -1, mem: {} },
      { l: "A linha 1 é só comentário: o Python <b>pula</b> direto para a linha 2, que guarda o 70 em <b>corte</b>.", linha: 1, mem: { corte: 70 } },
      { l: "Linha 3: o Python executa <b>total = 78</b> e ignora tudo que vem depois do #, mesmo na mesma linha.", linha: 2, mem: { corte: 70, total: 78 } },
      { l: "Linha 4: 78 ≥ 70? O comentário não mudou nada: aparece True.", linha: 3, mem: { corte: 70, total: 78 }, saida: "True" },
      { l: "Um bom comentário explica o <b>porquê</b> (“nota de corte do edital”), não repete o que a linha já diz (“guarda 70 em corte”).", linha: -1, mem: { corte: 70, total: 78 }, saida: "True" },
    ],
  }));

  // 5. indentação: o recuo define o bloco
  const BLOCO = {
    a: ["nota = 62", "if nota >= 70:", '    print("aprovado")', 'print("fim da lista")'],
    b: ["nota = 62", "if nota >= 70:", 'print("aprovado")', 'print("fim da lista")'],
  };
  C.registrar("py-bloco", {
    titulo: "O recuo define o que pertence ao if",
    passos: [
      ["Este código decide se imprime “aprovado”. É a decisão <b>se ... então</b> do pseudocódigo, escrita em Python. A nota é 62.", 4200],
      ["A linha do <b>if</b> termina em <b>dois-pontos</b>. As linhas <b>recuadas</b> (4 espaços) logo abaixo formam o <b>bloco</b>: só rodam se a pergunta der sim.", 5600],
      ["62 ≥ 70? <b>Não</b>. O Python pula o bloco inteiro e segue na primeira linha sem recuo. Saída: só “fim da lista”.", 5000],
      ["Agora um erro comum: o <b>print(“aprovado”)</b> perdeu o recuo. Visualmente é quase igual, mas o Python lê de outro jeito.", 5000],
      ["Sem recuo, o print <b>já não pertence ao if</b>: roda sempre. Agora aparece “aprovado” para quem tirou 62. O programa passou a mentir.", 5600],
      ["Moral: em Python, <b>o recuo faz parte do código</b>. Ele não é enfeite como em outras linguagens.", 4400],
    ],
    html: () => `<div class="bloco-demo"><ol class="exec-codigo">${BLOCO.a.map((_, j) => `<li data-l="${j}"><span class="n">${j + 1}</span><code></code></li>`).join("")}</ol>
      <div class="exec-saida"><small>saída (o que aparece na tela)</small><b>—</b></div><p class="bloco-aviso" hidden>O programa mente: 62 não alcança 70.</p></div>`,
    aplicar(p, k) {
      const versao = k >= 3 ? BLOCO.b : BLOCO.a;
      const lis = p.querySelectorAll(".exec-codigo li");
      lis.forEach((li, j) => {
        const code = li.querySelector("code");
        if (code.dataset.t !== versao[j]) {
          code.dataset.t = versao[j]; code.textContent = versao[j];
          if (j === 2 && k >= 3) { li.classList.remove("muda"); void li.offsetWidth; li.classList.add("muda"); }
        }
      });
      lis[1].classList.toggle("lendo", k === 1);
      lis[2].classList.toggle("em-bloco", k === 1 || k === 2);
      lis[2].classList.toggle("pulada", k === 2);
      lis[2].classList.toggle("lendo", k === 4);
      lis[3].classList.toggle("lendo", k === 2 || k === 4);
      lis[2].classList.toggle("erro", k >= 3);
      const sb = p.querySelector(".exec-saida b");
      const saida = k === 2 ? "fim da lista" : k >= 4 ? "aprovado · fim da lista" : "—";
      if (sb.textContent !== saida) { sb.textContent = saida; sb.parentElement.classList.remove("muda"); void sb.offsetWidth; sb.parentElement.classList.add("muda"); }
      p.querySelector(".bloco-aviso").hidden = k < 4;
    },
  });

  // 6. PEP 8: do código bagunçado ao legível
  const PEP = [
    ["T=48+30", "NotaDeCorte=70", "print(T>=NotaDeCorte)"],
    ["<mark>total</mark>=48+30", "<mark>nota_de_corte</mark>=70", "print(<mark>total</mark>&gt;=<mark>nota_de_corte</mark>)"],
    ["total<mark> = </mark>48<mark> + </mark>30", "nota_de_corte<mark> = </mark>70", "print(total<mark> &gt;= </mark>nota_de_corte)"],
  ];
  C.registrar("py-pep8", {
    titulo: "Do código bagunçado ao código no estilo PEP 8",
    passos: [
      ["Este código <b>funciona</b>, mas é difícil de ler: nomes que não dizem nada, letras maiúsculas misturadas e tudo grudado.", 4400],
      ["Primeiro, <b>nomes que dizem o que guardam</b>, em minúsculas e com sublinhado entre as palavras: <b>total</b> e <b>nota_de_corte</b>.", 5200],
      ["Depois, <b>espaço em volta</b> do = e dos operadores (+ e &gt;=). Cada pedaço fica fácil de enxergar.", 4800],
      ["O resultado faz exatamente a mesma coisa, mas lê-se de uma vez. É para isso que existe o <b>PEP 8</b>, o guia de estilo que quase todo programador Python segue.", 5600],
    ],
    html: () => `<div class="pep"><div class="pep-rotulo" aria-hidden="true"><span class="p-ant">antes</span><span class="p-dep">depois</span></div>
      <pre class="pep-cod"><code></code></pre></div>`,
    aplicar(p, k) {
      const est = Math.min(2, k);
      const code = p.querySelector(".pep-cod code");
      if (code.dataset.e !== String(est)) { code.dataset.e = String(est); code.innerHTML = PEP[est].join("\n"); code.classList.remove("troca"); void code.offsetWidth; code.classList.add("troca"); }
      p.querySelector(".p-ant").classList.toggle("on", k === 0);
      p.querySelector(".p-dep").classList.toggle("on", k >= 3);
      p.querySelector(".pep").classList.toggle("pronto", k >= 3);
    },
  });
})();
