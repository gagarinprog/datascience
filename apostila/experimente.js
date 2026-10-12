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
    titulo: "Mude o saldo e o valor do Pix e veja o que cada etiqueta guarda depois de cada linha",
    montar(el) {
      el.innerHTML = `<div class="controles">${campo("saldo inicial", { type: "text", inputmode: "decimal", value: "500" })}${campo("valor do Pix", { type: "text", inputmode: "decimal", value: "120" })}</div><div class="rolagem"><table class="tabela"><thead><tr><th>depois da linha</th><th>saldo</th><th>pix</th></tr></thead><tbody></tbody></table></div><p class="nota-exp"></p>`;
      const [s, p] = el.querySelectorAll("input");
      ligar(el, () => {
        const saldo = lerNumero(s.value), pix = lerNumero(p.value);
        const ok = !Number.isNaN(saldo) && !Number.isNaN(pix);
        el.querySelector("tbody").innerHTML = ok ? [
          ["1  saldo = " + saldo, fmt(saldo), "ainda não existe"],
          ["2  pix = " + pix, fmt(saldo), fmt(pix)],
          ["3  saldo = saldo - pix", fmt(saldo - pix), fmt(pix)],
        ].map((l) => `<tr><td class="m">${esc(l[0])}</td><td class="m">${l[1]}</td><td class="m">${l[2]}</td></tr>`).join("") : `<tr><td colspan="3">Digite dois números.</td></tr>`;
        el.querySelector(".nota-exp").textContent = ok && saldo - pix < 0
          ? "O saldo ficou negativo e o Python não reclamou: a regra “não pode ficar negativo” quem escreve é você, com um if."
          : "Repare que a linha 3 usa o valor antigo de saldo para calcular o novo.";
      });
    },
  };

  const QUESTOES = [
    ["Banco de Dados", 6, 10, 8], ["Estatística", 6, 14, 2], ["Lógica de Programação", 6, 8, 5],
    ["Estruturas de Dados", 8, 7, 6], ["Aprendizado de Máquina", 5, 11, 2], ["Engenharia de Software", 6, 4, 6],
  ];
  X.BD = {
    titulo: "Monte a consulta e veja quantas linhas sobram em cada etapa (números reais do banco de estudo)",
    montar(el) {
      el.innerHTML = `<div class="controles">${seletor("WHERE dificuldade =", [["todas", "(sem filtro)"], ["facil", "'facil'"], ["media", "'media'"], ["dificil", "'dificil'"]], "facil")}<label class="campo marcar"><input type="checkbox" checked> <span>GROUP BY disciplina</span></label></div><pre class="sql-montado"></pre><div class="etapas-sql"></div><div class="rolagem"><table class="tabela"><thead></thead><tbody></tbody></table></div>`;
      const sel = el.querySelector("select"), agrupar = el.querySelector("input[type=checkbox]");
      ligar(el, () => {
        const col = { facil: 1, media: 2, dificil: 3 }[sel.value];
        const conta = (q) => (col ? q[col] : q[1] + q[2] + q[3]);
        const filtradas = QUESTOES.reduce((a, q) => a + conta(q), 0);
        const where = col ? `\nWHERE q.dificuldade = '${sel.value}'` : "";
        el.querySelector(".sql-montado").textContent = agrupar.checked
          ? `SELECT d.nome, COUNT(*) AS questoes\nFROM questoes q\nJOIN disciplinas d ON d.id = q.disciplina_id${where}\nGROUP BY d.nome\nORDER BY questoes DESC;`
          : `SELECT COUNT(*) AS questoes\nFROM questoes q${where};`;
        const etapas = [["FROM", "120 linhas"], ["WHERE", col ? `${filtradas} linhas` : "sem filtro: 120"], ["GROUP BY", agrupar.checked ? "6 grupos" : "um grupo só"], ["SELECT", agrupar.checked ? "2 colunas" : "1 coluna"]];
        el.querySelector(".etapas-sql").innerHTML = etapas.map(([a, b]) => `<span><b>${a}</b>${b}</span>`).join("<i aria-hidden=\"true\">→</i>");
        const linhas = agrupar.checked
          ? QUESTOES.map((q) => [q[0], conta(q)]).sort((a, b) => b[1] - a[1])
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
    titulo: "Edite os valores (separados por ponto e vírgula) e veja média, mediana e desvio-padrão",
    montar(el) {
      el.innerHTML = `<label class="campo largo" for="${id("vals")}"><span>valores</span><input id="${"vals-" + contador}" type="text" value="3000; 3200; 2800; 3100; 2900; 3000; 3300; 2700; 3050; 300000"></label><div class="medidas"></div><div class="grafico-pontos"></div>`;
      const entrada = el.querySelector("input");
      ligar(el, () => {
        const v = entrada.value.split(";").map(lerNumero).filter((x) => !Number.isNaN(x));
        if (v.length < 2) { el.querySelector(".medidas").innerHTML = "<p>Digite pelo menos dois números.</p>"; el.querySelector(".grafico-pontos").innerHTML = ""; return; }
        const ord = [...v].sort((a, b) => a - b);
        const media = v.reduce((a, b) => a + b, 0) / v.length;
        const meio = Math.floor(ord.length / 2);
        const mediana = ord.length % 2 ? ord[meio] : (ord[meio - 1] + ord[meio]) / 2;
        const dp = Math.sqrt(v.reduce((a, b) => a + (b - media) ** 2, 0) / (v.length - 1));
        el.querySelector(".medidas").innerHTML = `<span><small>média</small><b>${fmt(media)}</b></span><span><small>mediana</small><b>${fmt(mediana)}</b></span><span><small>desvio-padrão</small><b>${fmt(dp)}</b></span>`;
        const min = ord[0], max = ord[ord.length - 1], larg = max - min || 1;
        const P = (x) => 20 + ((x - min) / larg) * 680;
        let svg = `<svg viewBox="0 0 720 90" role="img" aria-label="Valores na reta com média e mediana"><line x1="20" y1="60" x2="700" y2="60" class="fx-traco"/>`;
        v.forEach((x) => { svg += `<circle cx="${P(x).toFixed(1)}" cy="60" r="6" class="fx-cheio" opacity=".75"/>`; });
        svg += `<line x1="${P(media)}" y1="18" x2="${P(media)}" y2="74" class="fx-traco-erro"/><text x="${P(media) + 4}" y="16" class="fx-te">média</text>`;
        svg += `<line x1="${P(mediana)}" y1="30" x2="${P(mediana)}" y2="74" class="fx-traco-certo"/><text x="${P(mediana) + 4}" y="40" class="fx-tc">mediana</text></svg>`;
        el.querySelector(".grafico-pontos").innerHTML = svg;
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
    titulo: "Leia um CSV brasileiro: mude o separador e o decimal e veja a tabela quebrar ou funcionar",
    montar(el) {
      const tid = id("csv");
      el.innerHTML = `<label class="campo largo" for="${tid}"><span>arquivo CSV</span><textarea id="${tid}" rows="4" spellcheck="false">nome;nota\nAna Souza;7,5\nKaio Mendes;9,0\nJoana D'Ávila;8,25</textarea></label><div class="controles">${seletor("separador (sep)", [[";", "ponto e vírgula ;"], [",", "vírgula ,"]], ",")}${seletor("decimal", [[",", "vírgula"], [".", "ponto"]], ".")}</div><div class="rolagem"><table class="tabela"><thead></thead><tbody></tbody></table></div><p class="nota-exp"></p>`;
      const [sep, dec] = el.querySelectorAll("select");
      const area = el.querySelector("textarea");
      ligar(el, () => {
        const linhas = area.value.split("\n").filter((l) => l.trim());
        const partes = linhas.map((l) => l.split(sep.value));
        const cab = partes[0] || [];
        el.querySelector("thead").innerHTML = `<tr>${cab.map((c) => `<th>${esc(c)}</th>`).join("")}</tr>`;
        el.querySelector("tbody").innerHTML = partes.slice(1).map((p) => `<tr>${p.map((c) => `<td class="m">${esc(c)}</td>`).join("")}</tr>`).join("");
        let nota;
        if (cab.length < 2) nota = "Tudo veio numa coluna só: o separador está errado.";
        else {
          const col = partes.slice(1).map((p) => p[1] ?? "");
          const nums = col.map((c) => Number(dec.value === "," ? c.replace(/\./g, "").replace(",", ".") : c));
          nota = nums.every((x) => !Number.isNaN(x))
            ? `Deu certo: a soma das notas é ${fmt(nums.reduce((a, b) => a + b, 0))}.`
            : "As colunas se separaram, mas as notas não viraram números: o decimal brasileiro é a vírgula.";
        }
        el.querySelector(".nota-exp").textContent = nota;
      });
    },
  };

  const RESPOSTAS = [["BD", 1], ["EST", 0], ["BD", 0], ["EST", 1], ["BD", 1], ["LOG", 1], ["LOG", 0], ["BD", 1]];
  X.AD = {
    titulo: "Escolha a conta e veja o agrupamento (o groupby do pandas, o GROUP BY do SQL)",
    montar(el) {
      el.innerHTML = `<div class="controles">${seletor("conta aplicada em cada grupo", [["mean", ".mean() — taxa de acerto"], ["sum", ".sum() — total de acertos"], ["count", ".count() — número de respostas"]], "mean")}</div><pre class="sql-montado"></pre><div class="rolagem"><table class="tabela"><thead><tr><th>disciplina</th><th>resultado</th></tr></thead><tbody></tbody></table></div>`;
      const sel = el.querySelector("select");
      ligar(el, () => {
        const g = {};
        RESPOSTAS.forEach(([d, c]) => { (g[d] = g[d] || []).push(c); });
        el.querySelector(".sql-montado").textContent = `df.groupby("disciplina")["correta"].${sel.value}()`;
        el.querySelector("tbody").innerHTML = Object.entries(g).map(([d, vals]) => {
          const soma = vals.reduce((a, b) => a + b, 0);
          const r = sel.value === "mean" ? fmt(soma / vals.length) : sel.value === "sum" ? soma : vals.length;
          return `<tr><td>${d}</td><td class="m">${r}</td></tr>`;
        }).join("");
      });
    },
  };

  X.VIS = {
    titulo: "Arraste para escolher onde o eixo começa e veja a diferença entre 52% e 55% mudar de tamanho",
    montar(el) {
      const rid = id("eixo");
      el.innerHTML = `<label class="campo largo" for="${rid}"><span>o eixo começa em: <b class="valor-eixo">0</b>%</span><input id="${rid}" type="range" min="0" max="51" value="0"></label><div class="grafico-eixo"></div><p class="nota-exp"></p>`;
      const r = el.querySelector("input");
      ligar(el, () => {
        const base = Number(r.value), topo = 56;
        el.querySelector(".valor-eixo").textContent = base;
        const Y = (v) => 200 - ((v - base) / (topo - base)) * 170;
        let s = `<svg viewBox="0 0 420 230" role="img" aria-label="Barras de 52 e 55 por cento com eixo começando em ${base}"><line x1="50" y1="200" x2="400" y2="200" class="fx-traco"/>`;
        [["Banco A", 52], ["Banco B", 55]].forEach(([n, v], i) => {
          const x = 110 + i * 150;
          s += `<rect x="${x}" y="${Y(v)}" width="90" height="${200 - Y(v)}" class="fx-destaque"/><text x="${x + 45}" y="${Y(v) - 8}" text-anchor="middle" class="fx-t">${v}%</text><text x="${x + 45}" y="220" text-anchor="middle" class="fx-t2">${n}</text>`;
        });
        s += `<text x="44" y="200" text-anchor="end" class="fx-t2">${base}</text></svg>`;
        el.querySelector(".grafico-eixo").innerHTML = s;
        const razao = (55 - base) / (52 - base);
        el.querySelector(".nota-exp").textContent = `A barra B parece ${fmt(razao, 1)} vez${razao >= 2 ? "es" : ""} a barra A. A diferença real é de 55 / 52 = 1,06 vez.`;
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
  function ajustar(pts, grau) {
    const n = grau + 1;
    const A = Array.from({ length: n }, () => new Array(n + 1).fill(0));
    pts.forEach(([x, y]) => {
      const t = 2 * x - 1;
      const pot = Array.from({ length: n }, (_, k) => t ** k);
      for (let i = 0; i < n; i++) { for (let j = 0; j < n; j++) A[i][j] += pot[i] * pot[j]; A[i][n] += pot[i] * y; }
    });
    for (let i = 0; i < n; i++) A[i][i] += 1e-9;
    for (let c = 0; c < n; c++) {
      let m = c;
      for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[m][c])) m = r;
      [A[c], A[m]] = [A[m], A[c]];
      for (let r = 0; r < n; r++) {
        if (r === c) continue;
        const f = A[r][c] / A[c][c];
        for (let k = c; k <= n; k++) A[r][k] -= f * A[c][k];
      }
    }
    const coef = A.map((linha, i) => linha[n] / linha[i]);
    return (x) => coef.reduce((a, c, k) => a + c * (2 * x - 1) ** k, 0);
  }
  X.ML = {
    titulo: "Arraste a complexidade do modelo: o erro no treino sempre cai, o erro em dados novos não",
    montar(el) {
      const rid = id("grau");
      el.innerHTML = `<label class="campo largo" for="${rid}"><span>complexidade (grau do polinômio): <b class="valor-grau">3</b></span><input id="${rid}" type="range" min="1" max="10" value="3"></label><div class="grafico-ml"></div><div class="medidas"></div><p class="nota-exp"></p>`;
      const r = el.querySelector("input");
      const treino = pontos(11, 0.5), teste = pontos(29, 0.1, 0.1);
      ligar(el, () => {
        const g = Number(r.value);
        el.querySelector(".valor-grau").textContent = g;
        const f = ajustar(treino, g);
        const rmse = (pts) => Math.sqrt(pts.reduce((a, [x, y]) => a + (f(x) - y) ** 2, 0) / pts.length);
        const et = rmse(treino), en = rmse(teste);
        const X0 = (x) => 20 + x * 560, Y0 = (y) => 130 - Math.max(-2.2, Math.min(2.2, y)) * 50;
        let s = `<svg viewBox="0 0 600 260" role="img" aria-label="Pontos de treino e teste e a curva do modelo de grau ${g}">`;
        const curva = Array.from({ length: 121 }, (_, i) => { const x = i / 120; return `${X0(x).toFixed(1)},${Y0(f(x)).toFixed(1)}`; }).join(" ");
        s += `<polyline points="${curva}" class="${g >= 8 ? "fx-traco-erro" : "fx-traco-certo"}"/>`;
        treino.forEach(([x, y]) => { s += `<circle cx="${X0(x)}" cy="${Y0(y)}" r="5" class="fx-cheio"/>`; });
        teste.forEach(([x, y]) => { s += `<circle cx="${X0(x)}" cy="${Y0(y)}" r="5" class="fx-caixa"/>`; });
        s += `<text x="20" y="250" class="fx-t2">cheios: dados de treino · vazios: dados novos (teste)</text></svg>`;
        el.querySelector(".grafico-ml").innerHTML = s;
        el.querySelector(".medidas").innerHTML = `<span><small>erro no treino</small><b>${fmt(et)}</b></span><span><small>erro em dados novos</small><b>${fmt(en)}</b></span>`;
        el.querySelector(".nota-exp").textContent = g <= 2 ? "Simples demais: erra nos dois (subajuste)." : g <= 7 ? "Na medida: pega o padrão e acerta dados novos." : "Complexo demais: decora o treino e erra mais nos dados novos (sobreajuste).";
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
