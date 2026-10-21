// "Experimente": uma caixa interativa por matéria. Você digita valores e vê o resultado na hora.
// Cada função recebe o contêiner do exercício e o contêiner da figura da matéria (para acender partes dela).
(function () {
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const fmt = (n, casas = 2) => Number(n).toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });
  const inteiro = (n) => Number(n).toLocaleString("pt-BR");
  let contador = 0;
  const id = (base) => `${base}-${++contador}`;

  function campo(rotulo, attrs) {
    const i = id("campo");
    const extra = Object.entries(attrs).map(([k, v]) => `${k}="${esc(v)}"`).join(" ");
    return `<label class="campo" for="${i}"><span>${esc(rotulo)}</span><input id="${i}" ${extra}></label>`;
  }
  function seletor(rotulo, opcoes, valor) {
    const i = id("sel");
    return `<label class="campo" for="${i}"><span>${esc(rotulo)}</span><select id="${i}">${opcoes.map(([v, t]) => `<option value="${esc(v)}"${v === valor ? " selected" : ""}>${esc(t)}</option>`).join("")}</select></label>`;
  }
  // AutoAnimate (carregado pela página como módulo) anima itens que entram e saem de uma lista.
  function animar(el) {
    const aplicar = () => window.autoAnimate && window.autoAnimate(el, { duration: 200 });
    if (window.autoAnimate) aplicar();
    else window.addEventListener("autoanimate", aplicar, { once: true });
  }
  function caixa(texto, topo) {
    const s = document.createElement("span");
    s.textContent = texto;
    if (topo) s.className = "topo";
    return s;
  }
  function ligar(raiz, atualizar) {
    raiz.querySelectorAll("input, select, textarea").forEach((c) => c.addEventListener("input", atualizar));
    atualizar();
  }
  function lerNumero(texto) {
    const t = String(texto).trim().replace(/\./g, "").replace(",", ".");
    return t === "" ? NaN : Number(t);
  }


  // Caixas em Python: o quadro de laboratorio.js (escrever o comando e ver o resultado mudar), com metas que se
  // marcam sozinhas. A matéria conclui a caixa quando as metas são cumpridas (jornada.js, aoMeta).
  function python(el, op) {
    if (!window.Laboratorio) { el.innerHTML = `<p class="nota-exp">O quadro de Python não carregou nesta página.</p>`; return null; }
    return window.Laboratorio.quadro(el, op);
  }

  const X = {};

  X.LOG = {
    titulo: "Digite o valor do carrinho e veja o caminho que o algoritmo faz",
    montar(el, fig) {
      el.innerHTML = `<div class="controles">${campo("Valor do carrinho (R$)", { type: "text", inputmode: "decimal", value: "80" })}</div><ol class="rastro"></ol>`;
      const entrada = el.querySelector("input");
      const saida = el.querySelector(".rastro");
      ligar(el, () => {
        const v = lerNumero(entrada.value);
        fig.classList.remove("fig-sim", "fig-nao");
        if (Number.isNaN(v) || v < 0) {
          saida.innerHTML = `<li class="aviso">Digite um valor em reais, como 80 ou 120,50.</li>`;
          return;
        }
        const sim = v >= 100;
        const frete = sim ? 0 : 15;
        fig.classList.add(sim ? "fig-sim" : "fig-nao");
        saida.innerHTML = [
          `ler o carrinho: <b>R$ ${fmt(v)}</b>`,
          `${fmt(v)} ≥ 100? <b class="${sim ? "ok" : "nao"}">${sim ? "sim" : "não"}</b>`,
          `frete ← <b>${frete}</b>`,
          `total ← ${fmt(v)} + ${frete} = <b>R$ ${fmt(v + frete)}</b>`,
        ].map((l) => `<li>${l}</li>`).join("");
      });
    },
  };

  X.PY = {
    titulo: "Escreva o Pix em Python e veja o teste de mesa: o que cada variável guarda depois de cada linha",
    python: true,
    montar(el, fig, aoMeta) {
      python(el, {
        aoMeta, rastro: true, vars: ["saldo", "pix"],
        como: `<p>Uma variável guarda um valor. A linha <code>saldo = saldo - pix</code> usa o valor antigo de <code>saldo</code> para calcular o novo. Para uma regra (o saldo não pode ficar negativo), use <code>if</code> e <code>else</code>, com dois-pontos e recuo de 4 espaços:</p><pre><code>if condição:\n    # o que fazer quando é verdade\nelse:\n    # o que fazer quando não é</code></pre>`,
        inicial: 'saldo = 500\npix = 120\nsaldo = saldo - pix\nprint("Saldo:", saldo)',
        metas: [
          { texto: "Mude o Pix para 650 e veja o saldo ficar negativo: o Python não reclama.", dica: "pix = 650", teste: "pix == 650 and saldo < 0" },
          { texto: "Proteja o saldo com <code>if</code>: só desconta quando <code>pix &lt;= saldo</code>; senão, mostra Saldo insuficiente.", dica: 'if pix <= saldo:\n    saldo = saldo - pix\nelse:\n    print("Saldo insuficiente")', teste: '"if " in _codigo and "Saldo insuficiente" in _saida.getvalue() and saldo == 500' },
          { texto: "Volte o Pix para 120: agora o <code>if</code> desconta e o saldo fica 380.", dica: "pix = 120", teste: '"if " in _codigo and pix == 120 and saldo == 380' },
        ],
      });
    },
  };

  // questões do banco de estudo por matéria e faixa de nível: [nome, fácil (nível 1 e 2), médio (3), difícil (4 e 5)]
  const QUESTOES = [
    ["Banco de Dados", 5, 3, 2], ["Língua Portuguesa", 4, 2, 4], ["Raciocínio Lógico", 4, 3, 3],
    ["Direito Administrativo", 3, 1, 6], ["Informática", 2, 2, 6], ["Estatística", 1, 3, 6],
  ];
  X.BD = {
    titulo: "Monte a consulta e veja quantas linhas sobram em cada etapa (números reais do banco de estudo)",
    montar(el) {
      el.innerHTML = `<div class="controles">${seletor("WHERE q.nivel", [["todas", "(sem filtro)"], ["facil", "<= 2 (fácil)"], ["medio", "= 3 (médio)"], ["dificil", ">= 4 (difícil)"]], "facil")}<label class="campo marcar"><input type="checkbox" checked> <span>GROUP BY matéria</span></label></div><pre class="sql-montado"></pre><div class="etapas-sql"></div><div class="rolagem"><table class="tabela"><thead></thead><tbody></tbody></table></div>`;
      const sel = el.querySelector("select"), agrupar = el.querySelector("input[type=checkbox]");
      ligar(el, () => {
        const col = { facil: 1, medio: 2, dificil: 3 }[sel.value];
        const conta = (q) => (col ? q[col] : q[1] + q[2] + q[3]);
        const filtradas = QUESTOES.reduce((a, q) => a + conta(q), 0);
        const total = QUESTOES.reduce((a, q) => a + q[1] + q[2] + q[3], 0);
        const where = col ? `\nWHERE q.nivel ${{ facil: "<= 2", medio: "= 3", dificil: ">= 4" }[sel.value]}` : "";
        el.querySelector(".sql-montado").textContent = agrupar.checked
          ? `SELECT m.nome, COUNT(*) AS questoes\nFROM questoes q\nJOIN materias m ON m.id = q.materia_id${where}\nGROUP BY m.nome\nORDER BY questoes DESC;`
          : `SELECT COUNT(*) AS questoes\nFROM questoes q${where};`;
        const etapas = [["FROM", `${total} linhas`], ["WHERE", col ? `${filtradas} linhas` : `sem filtro: ${total}`], ["GROUP BY", agrupar.checked ? `${QUESTOES.length} grupos` : "um grupo só"], ["SELECT", agrupar.checked ? "2 colunas" : "1 coluna"]];
        el.querySelector(".etapas-sql").innerHTML = etapas.map(([a, b]) => `<span><b>${a}</b>${b}</span>`).join("<i aria-hidden=\"true\">→</i>");
        const linhas = agrupar.checked
          ? QUESTOES.map((q) => [q[0], conta(q)]).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
          : [["(todas)", filtradas]];
        el.querySelector("thead").innerHTML = `<tr><th>${agrupar.checked ? "nome" : ""}</th><th>questoes</th></tr>`;
        el.querySelector("tbody").innerHTML = linhas.map(([n, c]) => `<tr><td>${esc(n)}</td><td class="m">${c}</td></tr>`).join("");
      });
    },
  };

  X.CMP = {
    titulo: "Digite um número de 0 a 255 e um caractere para ver como o computador guarda cada um",
    montar(el) {
      el.innerHTML = `<div class="controles">${campo("número", { type: "number", min: "0", max: "255", value: "13" })}${campo("caractere", { type: "text", maxlength: "2", value: "ã" })}</div><div class="bits"></div><p class="soma-bits m"></p><p class="bytes-texto"></p>`;
      const [n, c] = el.querySelectorAll("input");
      ligar(el, () => {
        const v = Math.max(0, Math.min(255, Math.floor(Number(n.value) || 0)));
        const pesos = [128, 64, 32, 16, 8, 4, 2, 1];
        el.querySelector(".bits").innerHTML = pesos.map((p) => `<span class="bit${v & p ? " um" : ""}"><small>${p}</small>${v & p ? 1 : 0}</span>`).join("");
        const partes = pesos.filter((p) => v & p);
        el.querySelector(".soma-bits").textContent = `${v} = ${partes.length ? partes.join(" + ") : "0"}  →  ${v.toString(2).padStart(8, "0")} em binário`;
        const ch = [...c.value][0] || "";
        const bytes = ch ? [...new TextEncoder().encode(ch)] : [];
        el.querySelector(".bytes-texto").innerHTML = ch
          ? `“${esc(ch)}” em UTF-8 ocupa <b>${bytes.length} byte${bytes.length > 1 ? "s" : ""}</b>: <span class="m">${bytes.map((b) => b.toString(2).padStart(8, "0")).join(" ")}</span>`
          : "Digite um caractere (uma letra, um acento, um emoji).";
      });
    },
  };

  X.MAT = {
    titulo: "Quantas senhas existem? Mude o tamanho e os símbolos possíveis",
    montar(el) {
      el.innerHTML = `<div class="controles">${campo("posições", { type: "number", min: "1", max: "20", value: "4" })}${seletor("símbolos por posição", [["10", "só números (10)"], ["26", "só letras minúsculas (26)"], ["36", "letras e números (36)"], ["62", "maiúsculas, minúsculas e números (62)"]], "10")}</div><p class="resultado-grande"></p><p class="nota-exp"></p>`;
      const pos = el.querySelector("input"), sim = el.querySelector("select");
      ligar(el, () => {
        const k = Math.max(1, Math.min(20, Math.floor(Number(pos.value) || 1)));
        const s = BigInt(sim.value);
        let total = 1n;
        for (let i = 0; i < k; i++) total *= s;
        el.querySelector(".resultado-grande").innerHTML = `${sim.value}<sup>${k}</sup> = <b>${total.toLocaleString("pt-BR")}</b> senhas`;
        const segundos = Number(total) / 1e9;
        const anos = segundos / (3600 * 24 * 365);
        el.querySelector(".nota-exp").textContent = `Testando 1 bilhão de senhas por segundo, um computador levaria até ${anos >= 1 ? inteiro(Math.round(anos)) + " anos" : segundos >= 1 ? inteiro(Math.round(segundos)) + " segundos" : "menos de um segundo"} para testar todas. É o princípio multiplicativo.`;
      });
    },
  };

  X.EST = {
    titulo: "Calcule média, mediana e desvio-padrão com o pandas e veja o que um valor extremo faz com cada um",
    python: true,
    montar(el, fig, aoMeta) {
      python(el, {
        aoMeta, pacotes: ["pandas"], preparo: "import pandas as pd", vars: ["media", "mediana", "desvio"], mostrar: ["acertos"],
        como: `<p>Uma série do pandas guarda uma lista de números e já sabe as contas: <code>.mean()</code> (média), <code>.median()</code> (mediana, o valor do meio) e <code>.std()</code> (desvio-padrão, o quanto os valores se espalham). Os números são os acertos de cada um dos 12 alunos do banco de estudo.</p><pre><code>acertos = pd.Series([9, 10, 8, 12])\nmedia = acertos.mean()</code></pre>`,
        inicial: "acertos = pd.Series([9, 10, 8, 12, 16, 10, 17, 21, 19, 16, 19, 21])\nmedia = acertos.mean()\nmediana = \ndesvio = ",
        metas: [
          { texto: "Complete a mediana com <code>.median()</code>.", dica: "mediana = acertos.median()", teste: "mediana == acertos.median()" },
          { texto: "Complete o desvio-padrão com <code>.std()</code>.", dica: "desvio = acertos.std()", teste: "desvio == acertos.std()" },
          { texto: "Um aluno novo fez 90 acertos: ponha 90 no fim da lista. A média sobe bem; a mediana continua 16.", dica: "acertos = pd.Series([9, 10, 8, 12, 16, 10, 17, 21, 19, 16, 19, 21, 90])", teste: "90 in acertos.tolist() and media == acertos.mean() and mediana == acertos.median()" },
        ],
        aoResultado(res, area) {
          const serie = res.valores.acertos, num = (n) => (res.valores[n] ? Number(res.valores[n].repr) : NaN);
          if (!serie || serie.tipo !== "serie") { area.innerHTML = ""; return; }
          const v = serie.valores.filter((x) => typeof x === "number"), media = num("media"), mediana = num("mediana");
          if (v.length < 2) { area.innerHTML = ""; return; }
          const min = Math.min(...v), max = Math.max(...v), larg = max - min || 1;
          const P = (x) => 20 + ((x - min) / larg) * 680;
          let svg = `<svg viewBox="0 0 720 90" role="img" aria-label="Os acertos na reta, com a média e a mediana"><line x1="20" y1="60" x2="700" y2="60" class="fx-traco"/>`;
          v.forEach((x) => { svg += `<circle cx="${P(x).toFixed(1)}" cy="60" r="6" class="fx-cheio" opacity=".75"/>`; });
          if (Number.isFinite(media)) svg += `<line x1="${P(media)}" y1="18" x2="${P(media)}" y2="74" class="fx-traco-erro"/><text x="${P(media) + 4}" y="16" class="fx-te">média ${fmt(media, 1)}</text>`;
          if (Number.isFinite(mediana)) svg += `<line x1="${P(mediana)}" y1="30" x2="${P(mediana)}" y2="74" class="fx-traco-certo"/><text x="${P(mediana) + 4}" y="40" class="fx-tc">mediana ${fmt(mediana, 1)}</text>`;
          area.innerHTML = `<div class="grafico-pontos">${svg}</svg></div>`;
        },
      });
    },
  };

  X.ED = {
    titulo: "Pilha e fila na prática: digite um item e use os botões. Depois mude o tamanho da entrada e veja o custo",
    montar(el) {
      el.innerHTML = `<div class="controles">${campo("item", { type: "text", value: "pedido 1", maxlength: "16" })}</div>
        <div class="duas-colunas">
          <div><p class="rotulo-exp">Pilha (o último que entra sai primeiro)</p><div class="botoes"><button type="button" class="botao" data-a="empilhar">Empilhar</button><button type="button" class="botao" data-a="desempilhar">Desempilhar</button></div><div class="pilha-vis"></div></div>
          <div><p class="rotulo-exp">Fila (o primeiro que entra sai primeiro)</p><div class="botoes"><button type="button" class="botao" data-a="entrar">Entrar na fila</button><button type="button" class="botao" data-a="sair">Atender</button></div><div class="fila-vis"></div></div>
        </div><p class="nota-exp" aria-live="polite"></p>
        <div class="controles">${campo("tamanho da entrada (n)", { type: "number", min: "1", max: "1000000000", value: "1000000" })}</div><div class="rolagem"><table class="tabela custo"><thead><tr><th>tipo de algoritmo</th><th>passos com esse n</th><th>exemplo</th></tr></thead><tbody></tbody></table></div>`;
      const item = el.querySelector("input");
      const pilha = ["pedido A", "pedido B"], fila = ["Ana", "Bruno"];
      let n = 3;
      const nota = el.querySelector(".nota-exp");
      const pv = el.querySelector(".pilha-vis"), fv = el.querySelector(".fila-vis");
      pilha.slice().reverse().forEach((x, i) => pv.appendChild(caixa(x, i === 0)));
      fila.forEach((x, i) => fv.appendChild(caixa(x, i === 0)));
      animar(pv);
      animar(fv);
      const marcarTopo = (lista) => [...lista.children].forEach((c, i) => c.classList.toggle("topo", i === 0));
      el.querySelectorAll("[data-a]").forEach((b) => b.addEventListener("click", () => {
        const v = item.value.trim() || `item ${n}`;
        const a = b.dataset.a;
        if (a === "empilhar") { pilha.push(v); pv.prepend(caixa(v, true)); nota.textContent = `“${v}” foi para o topo da pilha.`; }
        if (a === "desempilhar") {
          if (pilha.length) { nota.textContent = `Saiu “${pilha.pop()}”: o último que entrou.`; pv.firstElementChild.remove(); }
          else nota.textContent = "A pilha está vazia.";
        }
        if (a === "entrar") { fila.push(v); fv.appendChild(caixa(v, false)); nota.textContent = `“${v}” entrou no fim da fila.`; }
        if (a === "sair") {
          if (fila.length) { nota.textContent = `Atendido: “${fila.shift()}”, o primeiro que chegou.`; fv.firstElementChild.remove(); }
          else nota.textContent = "A fila está vazia.";
        }
        marcarTopo(pv);
        marcarTopo(fv);
        n += 1;
        item.value = `pedido ${n}`;
      }));
      const tam = el.querySelectorAll("input")[1];
      ligar(el, () => {
        const v = Math.max(1, Math.floor(Number(tam.value) || 1));
        const lg = Math.log2(v);
        const linhas = [
          ["constante, O(1)", 1, "pegar o item de um índice; achar uma chave Pix"],
          ["logarítmico, O(log n)", Math.ceil(lg), "busca binária numa lista ordenada"],
          ["linear, O(n)", v, "procurar rolando a lista inteira"],
          ["n log n", Math.ceil(v * lg), "ordenar com merge sort"],
          ["quadrático, O(n²)", v * v, "comparar cada item com todos os outros"],
        ];
        el.querySelector(".custo tbody").innerHTML = linhas.map(([a, b, c]) => `<tr><td>${a}</td><td class="m">${b > 1e15 ? b.toExponential(2).replace(".", ",") : inteiro(b)}</td><td>${c}</td></tr>`).join("");
      });
    },
  };

  X.POO = {
    titulo: "Crie uma conta e use os métodos: a regra do saldo fica protegida dentro da classe",
    montar(el) {
      el.innerHTML = `<div class="controles">${campo("titular", { type: "text", value: "Kaio" })}${campo("valor (R$)", { type: "text", inputmode: "decimal", value: "100" })}</div><div class="botoes"><button type="button" class="botao" data-a="depositar">conta.depositar(valor)</button><button type="button" class="botao" data-a="sacar">conta.sacar(valor)</button></div><div class="objeto-vis"></div><p class="nota-exp" aria-live="polite"></p>`;
      const [tit, val] = el.querySelectorAll("input");
      let saldo = 0;
      const nota = el.querySelector(".nota-exp");
      const desenhar = () => {
        el.querySelector(".objeto-vis").innerHTML = `<div class="objeto"><small>objeto da classe Conta</small><span class="m">titular = "${esc(tit.value || "?")}"</span><span class="m">saldo = ${fmt(saldo)}</span></div>`;
      };
      el.querySelectorAll("[data-a]").forEach((b) => b.addEventListener("click", () => {
        const v = lerNumero(val.value);
        if (Number.isNaN(v) || v <= 0) { nota.textContent = "O método recusou: o valor precisa ser maior que zero."; return; }
        if (b.dataset.a === "depositar") { saldo += v; nota.textContent = `Depósito de R$ ${fmt(v)} aceito.`; }
        else if (v > saldo) nota.textContent = `Saque recusado pelo método sacar: o saldo (R$ ${fmt(saldo)}) não pode ficar negativo.`;
        else { saldo -= v; nota.textContent = `Saque de R$ ${fmt(v)} aceito.`; }
        desenhar();
      }));
      ligar(el, desenhar);
    },
  };

  X.ENG = {
    titulo: "Escreva a mensagem de cada versão e faça commits: é assim que o Git guarda o histórico",
    montar(el) {
      el.innerHTML = `<div class="controles">${campo("mensagem do commit", { type: "text", value: "Lê o extrato do cartão" })}</div><div class="botoes"><button type="button" class="botao primario">git commit</button></div><ol class="historico"></ol>`;
      const msg = el.querySelector("input");
      const lista = el.querySelector(".historico");
      const novo = (h, m) => {
        lista.querySelectorAll(".selo-aqui").forEach((s) => s.remove());
        lista.insertAdjacentHTML("afterbegin", `<li><span class="m">${h}</span> ${esc(m)} <small class="selo-aqui">você está aqui</small></li>`);
      };
      novo("1a2b3c4", "Cria o projeto");
      animar(lista);
      el.querySelector("button").addEventListener("click", () => {
        const m = msg.value.trim();
        if (!m) return;
        novo(Array.from({ length: 7 }, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join(""), m);
        msg.value = "";
      });
    },
  };

  X.FMT = {
    titulo: "Leia um CSV brasileiro com o pandas: acerte o separador e o decimal e veja a tabela se arrumar",
    python: true,
    montar(el, fig, aoMeta) {
      python(el, {
        aoMeta, pacotes: ["pandas"], preparo: "import pandas as pd\nfrom io import StringIO", ver: ["df", "tipos"],
        como: `<p>No Brasil, o CSV costuma vir com ponto e vírgula entre as colunas e vírgula nos decimais. O <code>read_csv</code> precisa saber disso: <code>sep=";"</code> e <code>decimal=","</code>. O <code>StringIO</code> faz o texto se comportar como um arquivo. As taxas são as de quatro alunos do banco de estudo.</p><pre><code>df = pd.read_csv(StringIO(texto), sep=";", decimal=",")</code></pre>`,
        inicial: 'texto = """nome;taxa_acerto\nAna Souza;0,26\nBruno Lima;0,32\nCarla Mendes;0,35\nDiego Rocha;0,40"""\ndf = pd.read_csv(StringIO(texto))\ntipos = df.dtypes.astype(str)  # o tipo de cada coluna',
        metas: [
          { texto: "Separe as colunas: diga ao <code>read_csv</code> que o separador é o ponto e vírgula.", dica: 'df = pd.read_csv(StringIO(texto), sep=";")', teste: "df.shape[1] == 2 and list(df.columns) == ['nome', 'taxa_acerto']" },
          { texto: "Faça a taxa virar número: o decimal é a vírgula. O tipo passa a ser float64.", dica: 'df = pd.read_csv(StringIO(texto), sep=";", decimal=",")', teste: "list(df.columns) == ['nome', 'taxa_acerto'] and str(df['taxa_acerto'].dtype).startswith('float')" },
          { texto: "Calcule a taxa média numa variável <code>media</code>.", dica: 'media = df["taxa_acerto"].mean()', teste: "abs(media - 0.3325) < 1e-9" },
        ],
      });
    },
  };

  X.AD = {
    titulo: "Agrupe as respostas por matéria com o groupby do pandas e troque a conta: média, soma e contagem",
    python: true,
    montar(el, fig, aoMeta) {
      python(el, {
        aoMeta, pacotes: ["pandas"], base: "respostas", ver: ["taxa", "total", "respondidas"],
        // as 14 primeiras respostas da Ana Souza no banco de estudo (None: não respondeu)
        preparo: 'import pandas as pd\nrespostas = pd.DataFrame({"id": list(range(1, 15)), "materia": ["Informática", "Informática", "Banco de Dados", "Língua Portuguesa", "Informática", "Banco de Dados", "Raciocínio Lógico", "Raciocínio Lógico", "Língua Portuguesa", "Banco de Dados", "Língua Portuguesa", "Estatística", "Banco de Dados", "Raciocínio Lógico"], "acertou": [0, 1, None, 1, 0, 0, 0, 0, 0, 1, None, 0, 0, 0]})',
        como: `<p>O <code>groupby</code> separa as linhas em grupos (um por matéria) e aplica uma conta em cada grupo: é o <code>GROUP BY</code> do SQL. A coluna <code>acertou</code> vale 1 (acertou), 0 (errou) ou vazio (não respondeu). São as 14 primeiras respostas da Ana Souza.</p><pre><code>respostas.groupby("materia")["acertou"].mean()</code></pre>`,
        inicial: 'taxa = respostas.groupby("materia")["acertou"].',
        metas: [
          { texto: "Em <code>taxa</code>, a média de acertos de cada matéria: <code>.mean()</code>.", dica: 'taxa = respostas.groupby("materia")["acertou"].mean()', teste: 'taxa.equals(respostas.groupby("materia")["acertou"].mean())' },
          { texto: "Numa linha nova, <code>total</code>: a soma de acertos de cada matéria, com <code>.sum()</code>.", dica: 'total = respostas.groupby("materia")["acertou"].sum()', teste: 'total.equals(respostas.groupby("materia")["acertou"].sum())' },
          { texto: "Em <code>respondidas</code>, conte com <code>.count()</code>. Repare em Banco de Dados: 4 linhas, mas 3 respondidas, porque o vazio não conta.", dica: 'respondidas = respostas.groupby("materia")["acertou"].count()', teste: 'respondidas.equals(respostas.groupby("materia")["acertou"].count())' },
        ],
      });
    },
  };

  X.VIS = {
    titulo: "Faça o gráfico de barras com o matplotlib e veja o eixo que não começa no zero exagerar a diferença",
    python: true,
    montar(el, fig, aoMeta) {
      const temGrafico = "len(plt.get_fignums()) > 0 and ";
      python(el, {
        aoMeta, pacotes: ["matplotlib"], preparo: "import matplotlib.pyplot as plt",
        como: `<p><code>plt.bar</code> desenha uma barra por item; <code>plt.ylim</code> diz onde o eixo vertical começa e termina; <code>plt.ylabel</code> dá nome a ele. Os números são a taxa de acerto real de cada matéria no banco de estudo.</p><pre><code>plt.bar(materias, taxa)\nplt.ylim(0, 0.6)\nplt.ylabel("taxa de acerto")</code></pre>`,
        inicial: 'materias = ["Informática", "Estatística", "Dir. Adm."]\ntaxa = [0.54, 0.51, 0.40]\nplt.figure(figsize=(6, 3.4))\nplt.bar(materias, taxa)\nplt.ylim(0.38, 0.56)\nplt.title("Taxa de acerto por matéria")',
        metas: [
          { texto: "Faça o eixo começar no zero e compare: a diferença volta ao tamanho real.", dica: "plt.ylim(0, 0.6)", teste: temGrafico + "plt.gca().get_ylim()[0] == 0" },
          { texto: "Dê nome ao eixo vertical com <code>plt.ylabel</code>.", dica: 'plt.ylabel("taxa de acerto")', teste: temGrafico + 'plt.gca().get_ylabel().strip() != ""' },
          { texto: "Acrescente Banco de Dados, com 0.51, no fim das duas listas.", dica: 'materias = ["Informática", "Estatística", "Dir. Adm.", "Banco de Dados"]\ntaxa = [0.54, 0.51, 0.40, 0.51]', teste: temGrafico + "len(plt.gca().patches) == 4" },
        ],
      });
    },
  };

  X.ALC = {
    titulo: "Digite dois vetores e veja a soma, o produto interno e o quanto eles apontam para o mesmo lado",
    montar(el) {
      el.innerHTML = `<div class="controles">${campo("u (x; y)", { type: "text", value: "3; 1" })}${campo("v (x; y)", { type: "text", value: "1; 2" })}</div><div class="duas-colunas"><div class="plano-vis"></div><div class="medidas coluna-medidas"></div></div>`;
      const [a, b] = el.querySelectorAll("input");
      const ler = (t) => t.split(";").map(lerNumero);
      ligar(el, () => {
        const u = ler(a.value), v = ler(b.value);
        if (u.length !== 2 || v.length !== 2 || [...u, ...v].some(Number.isNaN)) { el.querySelector(".medidas").innerHTML = "<p>Use o formato 3; 1</p>"; return; }
        const soma = [u[0] + v[0], u[1] + v[1]];
        const dot = u[0] * v[0] + u[1] * v[1];
        const nu = Math.hypot(...u), nv = Math.hypot(...v);
        const cos = nu && nv ? dot / (nu * nv) : 0;
        const lim = Math.max(1, ...[...u, ...v, ...soma].map(Math.abs));
        const E = 120 / lim, O = [150, 150];
        const P = ([x, y]) => [O[0] + x * E, O[1] - y * E];
        const seta = (p, cls, nome) => { const [x, y] = P(p); return `<line x1="${O[0]}" y1="${O[1]}" x2="${x}" y2="${y}" class="${cls}" marker-end="url(#ponta)"/><text x="${x + 6}" y="${y - 6}" class="fx-tt">${nome}</text>`; };
        el.querySelector(".plano-vis").innerHTML = `<svg viewBox="0 0 300 300" role="img" aria-label="Vetores u, v e a soma"><line x1="10" y1="150" x2="290" y2="150" class="fx-grade"/><line x1="150" y1="10" x2="150" y2="290" class="fx-grade"/>${seta(u, "fx-traco-tinta", "u")}${seta(v, "fx-traco-tinta", "v")}${seta(soma, "fx-traco-certo", "u + v")}</svg>`;
        el.querySelector(".medidas").innerHTML = `<span><small>u + v</small><b class="m">(${fmt(soma[0], 1)}; ${fmt(soma[1], 1)})</b></span><span><small>produto interno u · v</small><b class="m">${fmt(dot, 1)}</b></span><span><small>cosseno do ângulo</small><b class="m">${fmt(cos)}</b></span><span><small>leitura</small><b>${cos > 0.9 ? "apontam quase para o mesmo lado" : cos > 0.2 ? "parecidos em parte" : cos > -0.2 ? "quase perpendiculares: nada em comum" : "apontam para lados opostos"}</b></span>`;
      });
    },
  };

  function gerador(semente) {
    let s = semente;
    return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
  }
  function pontos(semente, desloc, ruido = 0.22) {
    const r = gerador(semente);
    return Array.from({ length: 12 }, (_, i) => {
      const x = (i + desloc) / 12;
      const u = 1 - r(), w = r();
      return [x, Math.sin(2 * Math.PI * x) * 0.8 + Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * w) * ruido];
    });
  }
  X.ML = {
    titulo: "Ajuste um modelo com o numpy e mude a complexidade: o erro no treino sempre cai, o erro em dados novos não",
    python: true,
    montar(el, fig, aoMeta) {
      const treino = pontos(11, 0.5), teste = pontos(29, 0.1, 0.1);
      const lista = (pts, i) => `np.array([${pts.map((p) => p[i].toFixed(3)).join(", ")}])`;
      const confere = "abs(erro_novos - np.sqrt(np.mean((np.polyval(coef, x_novos) - y_novos) ** 2))) < 1e-12";
      python(el, {
        aoMeta, pacotes: ["numpy"], vars: ["grau", "erro_treino", "erro_novos"], mostrar: ["coef"],
        preparo: `import numpy as np\nimport warnings\nwarnings.simplefilter("ignore")\nx_treino = ${lista(treino, 0)}\ny_treino = ${lista(treino, 1)}\nx_novos = ${lista(teste, 0)}\ny_novos = ${lista(teste, 1)}`,
        como: `<p><code>np.polyfit(x, y, grau)</code> acha a curva daquele grau que passa mais perto dos pontos de treino; <code>np.polyval</code> usa a curva para prever. O erro é a raiz da média dos erros ao quadrado (RMSE). Na matéria, o mesmo aparece com o scikit-learn.</p><pre><code>coef = np.polyfit(x_treino, y_treino, grau)\nprevisto = np.polyval(coef, x_novos)\nerro = np.sqrt(np.mean((previsto - y_novos) ** 2))</code></pre>`,
        inicial: "grau = 3\ncoef = np.polyfit(x_treino, y_treino, grau)\nerro_treino = np.sqrt(np.mean((np.polyval(coef, x_treino) - y_treino) ** 2))\nerro_novos = ",
        metas: [
          { texto: "Complete <code>erro_novos</code>: o mesmo cálculo, com <code>x_novos</code> e <code>y_novos</code>.", dica: "erro_novos = np.sqrt(np.mean((np.polyval(coef, x_novos) - y_novos) ** 2))", teste: confere },
          { texto: "Mude o grau até o erro em dados novos ficar abaixo de 0,2.", dica: "grau = 4", teste: "erro_novos < 0.2 and " + confere },
          { texto: "Suba para grau 10: o treino fica quase perfeito e o erro em dados novos dispara (sobreajuste).", dica: "grau = 10", teste: "grau >= 10 and erro_treino < 0.01 and erro_novos > 0.5 and " + confere },
        ],
        aoResultado(res, area) {
          const c = res.valores.coef && res.valores.coef.lista, num = (n) => (res.valores[n] ? Number(res.valores[n].repr) : NaN);
          const g = num("grau");
          const f = c ? (x) => c.reduce((a, k) => a * x + k, 0) : null;
          const X0 = (x) => 20 + x * 560, Y0 = (y) => 130 - Math.max(-2.2, Math.min(2.2, y)) * 50;
          let s = `<svg viewBox="0 0 600 260" role="img" aria-label="Pontos de treino e de dados novos${f ? ` e a curva do modelo de grau ${g}` : ""}">`;
          if (f) s += `<polyline points="${Array.from({ length: 121 }, (_, i) => { const x = i / 120; return `${X0(x).toFixed(1)},${Y0(f(x)).toFixed(1)}`; }).join(" ")}" class="${g >= 8 ? "fx-traco-erro" : "fx-traco-certo"}"/>`;
          treino.forEach(([x, y]) => { s += `<circle cx="${X0(x)}" cy="${Y0(y)}" r="5" class="fx-cheio"/>`; });
          teste.forEach(([x, y]) => { s += `<circle cx="${X0(x)}" cy="${Y0(y)}" r="5" class="fx-caixa"/>`; });
          s += `<text x="20" y="250" class="fx-t2">cheios: dados de treino · vazios: dados novos</text></svg>`;
          const leitura = !f ? "" : g <= 2 ? "Simples demais: erra nos dois (subajuste)." : g <= 7 ? "Na medida: pega o padrão e acerta dados novos." : "Complexo demais: decora o treino e erra mais nos dados novos (sobreajuste).";
          area.innerHTML = `<div class="grafico-ml">${s}</div>${leitura ? `<p class="nota-exp">${leitura}</p>` : ""}`;
        },
      });
    },
  };

  X.NSQ = {
    titulo: "Consulte um preço duas vezes: a primeira vai ao banco, a segunda vem do cache (chave-valor)",
    montar(el) {
      el.innerHTML = `<div class="controles">${seletor("produto", [["cafe", "café"], ["fone", "fone de ouvido"], ["tenis", "tênis"]], "cafe")}${campo("o cache vale por (segundos)", { type: "number", min: "1", max: "120", value: "10" })}</div><div class="botoes"><button type="button" class="botao primario">Consultar preço</button></div><ol class="historico"></ol>`;
      const sel = el.querySelector("select"), validade = el.querySelector("input");
      const precos = { cafe: 18.9, fone: 149, tenis: 399.9 };
      const cache = {};
      const lista = el.querySelector(".historico");
      animar(lista);
      el.querySelector("button").addEventListener("click", () => {
        const chave = "preco:" + sel.value;
        const agora = Date.now();
        const guardado = cache[chave];
        let linha;
        if (guardado && agora - guardado.em < Number(validade.value) * 1000) {
          linha = `<span class="m">${chave}</span> veio do <b>cache</b> em 1 ms: R$ ${fmt(guardado.valor)}`;
        } else {
          cache[chave] = { valor: precos[sel.value], em: agora };
          linha = `<span class="m">${chave}</span> não estava no cache: consulta ao <b>banco</b> em 180 ms, e o resultado foi guardado por ${validade.value} s`;
        }
        lista.insertAdjacentHTML("afterbegin", `<li>${linha}</li>`);
      });
    },
  };

  X.ETI = {
    titulo: "Digite um registro e veja como fica depois de pseudonimizado",
    montar(el) {
      el.innerHTML = `<div class="controles">${campo("nome", { type: "text", value: "Kaio Mendes" })}${campo("nascimento", { type: "date", value: "1990-03-12" })}${campo("CEP", { type: "text", value: "79002-150", maxlength: "9" })}</div><div class="duas-colunas"><div class="registro antes"></div><div class="registro depois"></div></div><p class="nota-exp">O código troca o nome por um apelido fixo, mas quem tiver a lista de nomes consegue refazer a conta: por isso pseudonimizar não é anonimizar.</p>`;
      const [nome, nasc, cep] = el.querySelectorAll("input");
      const resumo = async (t) => {
        if (window.crypto && crypto.subtle) {
          const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t));
          return [...new Uint8Array(b)].slice(0, 4).map((x) => x.toString(16).padStart(2, "0")).join("");
        }
        let h = 0;
        for (const c of t) h = (h * 31 + c.charCodeAt(0)) >>> 0;
        return h.toString(16).padStart(8, "0");
      };
      ligar(el, async () => {
        const cod = await resumo(nome.value.trim().toLowerCase());
        el.querySelector(".antes").innerHTML = `<small>antes</small><span>${esc(nome.value)}</span><span>${esc(nasc.value)}</span><span>${esc(cep.value)}</span>`;
        el.querySelector(".depois").innerHTML = `<small>depois</small><span class="m">usuário ${cod}</span><span>${esc((nasc.value || "").slice(0, 4))}</span><span>${esc(cep.value.slice(0, 5))}-xxx</span>`;
      });
    },
  };

  window.EXPERIMENTE = X;
})();
