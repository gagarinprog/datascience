// Revisão de conceitos simples: as caixas de escolher na lista e digitar valores, no formato de antes
// (antes ficavam no Experimente das matérias, que hoje usa o quadro de Python). Mudou um valor, o resultado muda.
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

  // oito respostas reais do banco de estudo (ids 4 a 16): [matéria, acertou]
  const RESPOSTAS = [["Língua Portuguesa", 1], ["Banco de Dados", 0], ["Língua Portuguesa", 0], ["Banco de Dados", 1], ["Estatística", 0], ["Banco de Dados", 0], ["Estatística", 0], ["Estatística", 0]];

  X.AD = {
    titulo: "Escolha a conta e veja o agrupamento (o groupby do pandas, o GROUP BY do SQL)",
    montar(el) {
      el.innerHTML = `<div class="controles">${seletor("conta aplicada em cada grupo", [["mean", ".mean() — taxa de acerto"], ["sum", ".sum() — total de acertos"], ["count", ".count() — número de respostas"]], "mean")}</div><pre class="sql-montado"></pre><div class="rolagem"><table class="tabela"><thead><tr><th>materia</th><th>resultado</th></tr></thead><tbody></tbody></table></div>`;
      const sel = el.querySelector("select");
      ligar(el, () => {
        const g = {};
        RESPOSTAS.forEach(([d, c]) => { (g[d] = g[d] || []).push(c); });
        el.querySelector(".sql-montado").textContent = `df.groupby("materia")["acertou"].${sel.value}()`;
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

  window.CAIXAS_SIMPLES = X;
})();

// A página LOGICA-SIMPLES.html: um item por vez. Caixa conclui com 3 tentativas diferentes; exercício, ao resolver.
// O progresso fica em dominio:revisao-logica:v1 (entra no arquivo do trajeto).
(function () {
  const palco = document.getElementById("rl-palco");
  if (!palco) return;
  const CHAVE = "dominio:revisao-logica:v1", META = 3;
  const ler = () => { try { return JSON.parse(localStorage.getItem(CHAVE)) || {}; } catch (e) { return {}; } };
  const gravar = (v) => { try { localStorage.setItem(CHAVE, JSON.stringify(v)); } catch (e) { /* sem armazenamento */ } };
  const hoje = () => new Date().toISOString().slice(0, 10);
  const C = window.CAIXAS_SIMPLES || {};
  const ITENS = [
    { id: "contar", titulo: "Contar com uma regra", texto: "Passe a regra linha por linha e conte quem fica.", ex: "rl-contar" },
    { id: "calcular", titulo: "Média e diferença", texto: "Some, divida e subtraia com os totais da tabela.", ex: "rl-calcular" },
    { id: "PY", titulo: "Variáveis: o que cada uma guarda", caixa: "PY" },
    { id: "AD", titulo: "Agrupar e escolher a conta", caixa: "AD" },
    { id: "EST", titulo: "Média, mediana e desvio", caixa: "EST" },
    { id: "FMT", titulo: "Separador e decimal de um CSV", caixa: "FMT" },
    { id: "VIS", titulo: "Onde o eixo do gráfico começa", caixa: "VIS" },
    { id: "ML", titulo: "Complexidade do modelo", caixa: "ML" },
  ];
  let estado = ler();
  estado.feitos = estado.feitos || {};
  estado.tentativas = estado.tentativas || {};
  let i = Math.min(ITENS.length - 1, Math.max(0, Number(estado.atual) || 0));
  const pontos = document.getElementById("rl-pontos"), conta = document.getElementById("rl-conta"), situacao = document.getElementById("rl-estado");
  const voltar = document.getElementById("rl-voltar"), proximo = document.getElementById("rl-proximo");
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  function concluir(id) {
    if (!estado.feitos[id]) { estado.feitos[id] = hoje(); gravar(estado); }
    desenharPontos();
    situacao.textContent = "Concluído."; situacao.className = "rl-estado ok";
  }
  function desenharPontos() {
    pontos.innerHTML = ITENS.map((it, k) => `<li><button type="button" data-ir="${k}" class="${estado.feitos[it.id] ? "feito" : ""}"${k === i ? ' aria-current="step"' : ""} aria-label="${k + 1}. ${esc(it.titulo)}${estado.feitos[it.id] ? ", concluído" : ""}">${k + 1}</button></li>`).join("");
    const n = ITENS.filter((it) => estado.feitos[it.id]).length;
    conta.textContent = `${n} de ${ITENS.length} concluídos`;
  }
  function mostrar() {
    estado.atual = i; gravar(estado);
    const it = ITENS[i];
    desenharPontos();
    const feito = !!estado.feitos[it.id];
    situacao.textContent = feito ? "Concluído." : it.caixa ? `Faça ${META} tentativas diferentes.` : "Resolva o exercício.";
    situacao.className = "rl-estado" + (feito ? " ok" : "");
    voltar.disabled = i === 0;
    proximo.textContent = i === ITENS.length - 1 ? "Voltar ao mapa" : "Próximo";
    if (it.ex) {
      palco.innerHTML = `<h2>${esc(it.titulo)}</h2><p class="lede">${esc(it.texto)}</p>`;
      const ex = document.importNode(document.getElementById(it.ex).content, true).firstElementChild;
      palco.appendChild(ex);
      window.Motor.montarExercicio(ex, { licao: "LOGICA-SIMPLES", titulo: "Conceitos simples", conceito: it.titulo, aoResolver: () => concluir(it.id) });
      if (window.Reacao) window.Reacao.observar(ex);
      return;
    }
    const caixa = C[it.caixa];
    palco.innerHTML = `<h2>${esc(it.titulo)}</h2><section class="experimente"><header><b>experimente</b><span>${esc(caixa.titulo)}</span><span class="tentativas" data-tentativas></span></header><div class="area-exp"></div></section>`;
    const area = palco.querySelector(".area-exp"), rotulo = palco.querySelector("[data-tentativas]");
    const atualizar = () => { rotulo.textContent = `${Math.min(META, estado.tentativas[it.id] || 0)} de ${META} tentativas`; };
    caixa.montar(area, null);
    atualizar();
    let t = 0;
    const contar = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        estado.tentativas[it.id] = (estado.tentativas[it.id] || 0) + 1;
        gravar(estado); atualizar();
        if (estado.tentativas[it.id] >= META) concluir(it.id);
      }, 650);
    };
    area.addEventListener("input", contar);
    area.addEventListener("click", (e) => { if (e.target.closest("button")) contar(); });
  }
  pontos.addEventListener("click", (e) => { const b = e.target.closest("[data-ir]"); if (b) { i = Number(b.dataset.ir); mostrar(); palco.scrollIntoView({ block: "start" }); } });
  voltar.addEventListener("click", () => { if (i > 0) { i--; mostrar(); } });
  proximo.addEventListener("click", () => { if (i < ITENS.length - 1) { i++; mostrar(); palco.scrollIntoView({ block: "start" }); } else location.href = "../index.html#mapa"; });
  mostrar();
})();
