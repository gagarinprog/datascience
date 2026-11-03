import { expect, test, type Page } from "@playwright/test";

import { RESOLVER } from "./apostila-resolver";

/**
 * A apostila (apostila/, site estático no GitHub Pages) testada como o aluno usa: a página inicial, o traço e o
 * movimento dos guias, a aula linear (Entenda, Pratique, Avance) de cada lição inteira, a aula gerada até o módulo
 * dominado, o mapa e a matéria em menus suspensos e a revisão do dia. O servidor estático
 * sobe junto com o do app (playwright.config.ts). Roda no celular (390 px) e no computador (1280 px).
 */
const BASE = "http://127.0.0.1:3200/apostila/";
const LICOES = ["INICIO", "LOG.01", "LOG.02", "LOG.03", "PY.01", "ED.01"];

type Resultado = { tipo: string; estado: string; retorno: string; log: string[] };

function vigiarErros(page: Page) {
  const erros: string[] = [];
  page.on("pageerror", (e) => erros.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error") erros.push(m.text());
  });
  return erros;
}

async function resolver(page: Page, vid: string, errar: boolean) {
  return (await page.evaluate(`(${RESOLVER})(${JSON.stringify([vid, errar])})`)) as Resultado;
}

test.describe("apostila", () => {
  test.use({ actionTimeout: 15_000 });
  test("a página inicial cabe numa tela e apresenta o programa na primeira visita", async ({
    page,
  }) => {
    const erros = vigiarErros(page);
    await page.goto(BASE + "index.html");
    await expect(page.locator(".inicio.primeira")).toBeVisible();
    await expect(page.locator(".ini-atalho")).toHaveCount(3);
    const [altura, tela, largura, telaL] = await page.evaluate(() => [
      document.documentElement.scrollHeight,
      innerHeight,
      document.documentElement.scrollWidth,
      innerWidth,
    ]);
    expect(altura).toBeLessThanOrEqual((tela ?? 0) + 1);
    expect(largura).toBeLessThanOrEqual((telaL ?? 0) + 1);
    await page.locator("[data-ini-tutorial]").click();
    await expect(page.locator(".tut-cartao")).toBeVisible();
    await expect(page).toHaveURL(/#mapa$/);
    for (let k = 0; k < 7; k++) await page.locator('[data-tut="prox"]').click();
    await expect(page.locator(".tut-cartao")).toHaveCount(0);
    await page.goto(BASE + "index.html#inicio");
    await expect(page.locator(".inicio:not(.primeira)")).toBeVisible();
    await expect(page.locator(".ini-botao")).toHaveAttribute("href", /licoes\/LOG\.01\.html$/);
    expect(erros).toEqual([]);
  });

  test("os três traços trocam o rosto dos guias e ficam salvos", async ({ page }) => {
    await page.goto(BASE + "index.html#mapa");
    await page.evaluate(() =>
      localStorage.setItem("dominio:tutorial:v1", JSON.stringify({ feito: true })),
    );
    await page.reload();
    const rostos = new Set<string>();
    for (const traco of ["manga", "anime", "aventura"]) {
      await page.locator("#guia-btn").click();
      await page.locator(`[data-traco-opcao="${traco}"]`).click();
      rostos.add(await page.locator("#guia-mini").innerHTML());
      await page.reload();
      expect(
        await page.evaluate(
          () =>
            (window as unknown as { GUIAS: Record<string, { estilo: string }> }).GUIAS.rin!.estilo,
        ),
      ).toBe(traco);
    }
    expect(rostos.size).toBe(3);
  });

  test("o guia se mexe na pergunta final e, com reduzir movimento, só troca a expressão", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      localStorage.setItem("dominio:traco:v1", "manga");
      localStorage.setItem("dominio:tutorial:v1", JSON.stringify({ feito: true }));
    });
    await page.goto(BASE + "index.html#fechar-LOG.01");
    const guia = page.locator(".fechar-guia .mascote");
    await expect(guia).toHaveClass(/gm-chegar/);
    await expect(guia).toHaveAttribute("data-quadro", "pensa");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(BASE + "index.html#fechar-PY.01");
    await page.reload();
    const parado = page.locator(".fechar-guia .mascote");
    await expect(parado).toHaveAttribute("data-quadro", "pensa");
    await expect(parado).not.toHaveClass(/gm-/);
  });

  // percorre a aula linear: em cada etapa resolve o que estiver à vista (errando de propósito um sim, um não),
  // passa pelas animações e segue pelo botão de baixo, até a última ação (pergunta final ou mapa)
  async function percorrerAula(page: Page, rotulo: string) {
    await page.evaluate(() =>
      document
        .querySelectorAll<HTMLElement>(".exercicio")
        .forEach((e, i) => (e.dataset.vid = "x" + i)),
    );
    let k = 0;
    const ir = page.locator(".aula-ir");
    for (let volta = 0; volta < 400; volta++) {
      const painel = page.locator(".secao:not([hidden]) .etapa-painel:not([hidden])");
      const vista = painel.locator(".exercicio:visible");
      for (let j = 0; j < (await vista.count()); j++) {
        const ex = vista.nth(j);
        if ((await ex.getAttribute("data-estado")) === "resolvido") continue;
        const vid = (await ex.getAttribute("data-vid")) ?? "";
        const r = await resolver(page, vid, k++ % 2 === 0);
        expect(r.estado, `${rotulo} ${vid} ${r.tipo}`).toBe("resolvido");
        expect(r.retorno).not.toBe("");
      }
      const figs = painel.locator("figure[data-clip]:visible");
      for (let f = 0; f < (await figs.count()); f++) {
        const fig = figs.nth(f);
        if (await fig.locator("[data-aposta]").count())
          await fig.locator("[data-aposta]").first().click();
        const passos = await fig.locator(".clip-pontos button").count();
        for (let p = 1; p < passos; p++) await fig.locator('[data-a="prox"]').click();
      }
      const ta = painel.locator(".explicar textarea:visible");
      if (await ta.count()) {
        await ta.first().fill("Explicação com as minhas palavras.");
        await painel.locator("[data-salvar]:visible").first().click();
      }
      await expect(ir, `${rotulo}: o botão de seguir libera`).toBeEnabled();
      const texto = (await ir.textContent()) ?? "";
      if (/pergunta final|voltar ao mapa/i.test(texto)) return { k, texto };
      await ir.click();
    }
    throw new Error(rotulo + ": a aula não terminou");
  }

  test("a aula gerada vai do primeiro conceito ao módulo dominado", async ({ page }) => {
    test.setTimeout(120_000);
    const erros = vigiarErros(page);
    await page.addInitScript(() =>
      localStorage.setItem("dominio:tutorial:v1", JSON.stringify({ feito: true })),
    );
    await page.goto(BASE + "licoes/AULA.html#LOG.04");
    await expect(page.locator(".aula-nome small")).toContainText("conceito 1 de");
    // um conceito por vez e, nele, uma etapa por vez
    await expect(page.locator(".secao:not([hidden])")).toHaveCount(1);
    await expect(page.locator(".etapa-painel:visible")).toHaveCount(1);
    const { k, texto } = await percorrerAula(page, "LOG.04");
    expect(k).toBeGreaterThan(3);
    expect(texto).toMatch(/pergunta final/i);
    await page.locator(".aula-ir").click();
    await expect(page).toHaveURL(/#fechar-LOG\.04$/);
    const final = page.locator("[data-verifica] .exercicio");
    await final.evaluate((e) => ((e as HTMLElement).dataset.vid = "final"));
    expect((await resolver(page, "final", true)).estado).toBe("resolvido");
    await page.locator("[data-dominar]").click();
    await expect(page.locator(".vitoria")).toBeVisible();
    await page.locator("[data-ficar]").click();
    await expect(page.locator("#hud-xp")).not.toHaveText("0");
    await expect(page.locator('.mod-sus[data-cod="LOG.04"] .mod-nome small')).toContainText(
      "dominado",
    );
    expect(erros).toEqual([]);
  });

  test("a aula guarda onde parou e o menu só abre os conceitos já alcançados", async ({ page }) => {
    const erros = vigiarErros(page);
    await page.goto(BASE + "licoes/AULA.html#PY.03");
    await expect(page.locator(".etapa-entenda:visible [data-fig]")).toHaveCount(1);
    // o desenho anda por etapas
    const nota = page.locator(".etapa-entenda:visible [data-fig] .pl-nota b").first();
    const antes = await nota.textContent();
    await page.locator('.etapa-entenda:visible [data-pl="passo"]').first().click();
    await expect(nota).not.toHaveText(antes ?? "");
    await page.locator(".aula-menu > summary").click();
    const itens = page.locator(".aula-conceitos button");
    await expect(itens.first()).toBeEnabled();
    await expect(itens.nth(1)).toBeDisabled();
    await page.keyboard.press("Escape");
    await expect(page.locator(".aula-menu")).not.toHaveAttribute("open", "");
    // vai até o Pratique e recarrega: volta no mesmo lugar
    await page.locator(".aula-ir").click();
    await expect(page.locator('.aula-etapas [data-etapa="1"]')).toHaveClass(/atual/);
    await page.reload();
    await expect(page.locator('.aula-etapas [data-etapa="1"]')).toHaveClass(/atual/);
    expect(erros).toEqual([]);
  });

  for (const licao of LICOES) {
    test(`a lição ${licao} é resolvida inteira, conceito por conceito`, async ({ page }) => {
      test.setTimeout(240_000);
      const erros = vigiarErros(page);
      await page.goto(BASE + `licoes/${licao}.html`);
      const { k } = await percorrerAula(page, licao);
      expect(k).toBeGreaterThan(10);
      await expect(page.locator(".aula-nome small")).toContainText(/conceito (\d+) de \1/);
      expect(erros).toEqual([]);
    });
  }

  // as caixas Experimente em Python: cada passo é um código que cumpre mais metas; a caixa conclui com as três
  const SE =
    'if pix <= saldo:\n    saldo = saldo - pix\nelse:\n    print("Saldo insuficiente")\nprint("Saldo:", saldo)';
  const ML = (g: number) =>
    `grau = ${g}\ncoef = np.polyfit(x_treino, y_treino, grau)\nerro_treino = np.sqrt(np.mean((np.polyval(coef, x_treino) - y_treino) ** 2))\nerro_novos = np.sqrt(np.mean((np.polyval(coef, x_novos) - y_novos) ** 2))`;
  const CAIXAS: Record<string, string[]> = {
    PY: [
      'saldo = 500\npix = 650\nsaldo = saldo - pix\nprint("Saldo:", saldo)',
      "saldo = 500\npix = 650\n" + SE,
      "saldo = 500\npix = 120\n" + SE,
    ],
    EST: [
      "acertos = pd.Series([9, 10, 8, 12, 16, 10, 17, 21, 19, 16, 19, 21, 90])\nmedia = acertos.mean()\nmediana = acertos.median()\ndesvio = acertos.std()",
    ],
    FMT: [
      'texto = """nome;taxa_acerto\nAna Souza;0,26\nBruno Lima;0,32\nCarla Mendes;0,35\nDiego Rocha;0,40"""\ndf = pd.read_csv(StringIO(texto), sep=";", decimal=",")\nmedia = df["taxa_acerto"].mean()',
    ],
    AD: [
      'taxa = respostas.groupby("materia")["acertou"].mean()\ntotal = respostas.groupby("materia")["acertou"].sum()\nrespondidas = respostas.groupby("materia")["acertou"].count()',
    ],
    VIS: [
      'materias = ["Informática", "Estatística", "Dir. Adm.", "Banco de Dados"]\ntaxa = [0.54, 0.51, 0.40, 0.51]\nplt.bar(materias, taxa)\nplt.ylim(0, 0.6)\nplt.ylabel("taxa de acerto")',
    ],
    ML: [ML(3), ML(4), ML(10)],
  };
  for (const [sigla, passos] of Object.entries(CAIXAS)) {
    test(`a caixa Experimente de ${sigla} roda o Python e conclui pelas metas`, async ({
      page,
    }) => {
      test.setTimeout(180_000);
      const erros = vigiarErros(page);
      await page.addInitScript(() =>
        localStorage.setItem("dominio:tutorial:v1", JSON.stringify({ feito: true })),
      );
      await page.goto(BASE + `index.html#guia-${sigla}`);
      const sub = page.locator('.sub[data-sub="experimente"]');
      await sub.locator(".sub-cab").click();
      await expect(sub.locator(".py-metas li")).toHaveCount(3);
      await expect(sub.locator(".py-estado")).toBeHidden({ timeout: 150_000 });
      await expect(sub.locator(".py-metas li.feita")).toHaveCount(0);
      await expect(sub.locator("[data-concluir]")).toBeDisabled();
      for (const [k, codigo] of passos.entries()) {
        await sub.locator("textarea").fill(codigo);
        const meta = passos.length === 1 ? 3 : k + 1;
        await expect(sub.locator(".py-metas li.feita")).toHaveCount(meta, { timeout: 60_000 });
      }
      await expect(sub.locator("[data-tentativas]")).toHaveText("3 de 3 metas");
      await expect(sub.locator("[data-concluir]")).toBeEnabled();
      if (sigla === "VIS") await expect(sub.locator(".py-fig svg")).toBeVisible();
      expect(erros).toEqual([]);
    });
  }

  test("a ideia da matéria conclui pela pergunta corrigida, com o texto livre opcional", async ({
    page,
  }) => {
    const erros = vigiarErros(page);
    await page.addInitScript(() =>
      localStorage.setItem("dominio:tutorial:v1", JSON.stringify({ feito: true })),
    );
    await page.goto(BASE + "index.html#guia-BD");
    const sub = page.locator('.sub[data-sub="ideia"]');
    if ((await sub.locator(".sub-cab").getAttribute("aria-expanded")) !== "true")
      await sub.locator(".sub-cab").click();
    await expect(sub.locator("[data-concluir]")).toBeDisabled();
    const ex = sub.locator(".exercicio");
    await ex.evaluate((e) => ((e as HTMLElement).dataset.vid = "ideia"));
    expect((await resolver(page, "ideia", false)).estado).toBe("resolvido");
    await expect(sub.locator("[data-concluir]")).toBeEnabled();
    await expect(sub.locator('[data-nota="ideia"]')).toBeVisible();
    expect(erros).toEqual([]);
  });

  test("a revisão de conceitos simples guarda o método das listas, um item por vez", async ({
    page,
  }) => {
    const erros = vigiarErros(page);
    await page.goto(BASE + "licoes/LOGICA-SIMPLES.html");
    await expect(page.locator("#rl-pontos button")).toHaveCount(8);
    const campos = page.locator("#rl-palco input");
    for (const [k, v] of ["5", "2", "2"].entries()) await campos.nth(k).fill(v);
    await page.locator("#rl-palco [data-verificar]").click();
    await expect(page.locator("#rl-estado")).toHaveText("Concluído.");
    await page.locator('#rl-pontos [data-ir="3"]').click();
    const sel = page.locator("#rl-palco select");
    for (const v of ["sum", "count", "mean"]) {
      await sel.selectOption(v);
      await page.waitForTimeout(750);
    }
    await expect(page.locator("[data-tentativas]")).toHaveText("3 de 3 tentativas");
    await expect(page.locator("#rl-conta")).toHaveText("2 de 8 concluídos");
    expect(erros).toEqual([]);
  });

  test("as bancadas de estruturas de dados respondem a arrastar, tocar e reduzir movimento", async ({
    page,
  }) => {
    const erros = vigiarErros(page);
    await page.emulateMedia({ reducedMotion: "reduce" });
    // as bancadas ficam no Entenda de cada conceito: o endereço #cN abre o conceito
    const abrir = async (sec: string, tipo: string) => {
      await page.goto(BASE + `licoes/ED.01.html#${sec}`);
      const b = page.locator(`[data-bancada="${tipo}"]`);
      await expect(b).toBeVisible();
      return b;
    };
    // tabela hash: errar a gaveta avisa a conta; arrastar para a certa guarda
    const hash = await abrir("c4", "hash");
    await hash.locator('.ed-chip[data-k="1050"]').click();
    await hash.locator('.ed-gav[data-i="5"]').click();
    await expect(hash.locator(".ed-placar")).toContainText("1050 % 50 = 0");
    await hash.locator('.ed-chip[data-k="1050"]').dragTo(hash.locator('.ed-gav[data-i="0"]'));
    await expect(hash.locator('.ed-gav[data-i="0"]')).toHaveClass(/ocupada/);
    await hash.locator("[data-todas]").click();
    await expect(hash.locator(".ed-placar")).toContainText("7 na gaveta mais cheia");
    await hash.locator('.ed-m[data-m="53"]').click();
    await hash.locator("[data-todas]").click();
    await expect(hash.locator(".ed-placar")).toContainText("7 gavetas ocupadas");
    // árvore: com chaves em ordem, a ABB degenera e a AVL fica com altura 2
    const arv = await abrir("c5", "arvore");
    await arv.locator("[data-todas]").click();
    await expect(arv.locator(".ed-placar")).toContainText("6 de altura");
    await arv.locator('.ed-m[data-m="avl"]').click();
    await arv.locator("[data-todas]").click();
    await expect(arv.locator(".ed-placar")).toContainText("2 de altura", { timeout: 20_000 });
    // pilha: o último que entra sai primeiro
    const pf = await abrir("c3", "pilha-fila");
    for (let i = 0; i < 3; i++) await pf.locator('[data-b="pilha"] .ed-chip').click();
    await pf.locator('[data-area="pilha"] .ed-item').first().click();
    await pf.locator('[data-tirar="pilha"]').click();
    await expect(pf.locator('[data-v="pilha"]')).toContainText("Acertou");
    expect(erros).toEqual([]);
  });

  test("a revisão do dia traz o exercício da lição e reagenda", async ({ page }) => {
    await page.goto(BASE + "licoes/LOG.01.html");
    const ontem = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
    await page.evaluate((dia) => {
      const M = (window as unknown as { Motor: { idDe: (e: Element) => string } }).Motor;
      const cartoes: Record<string, object> = {};
      for (const sec of document.querySelectorAll(".secao"))
        for (const ex of sec.querySelectorAll(".exercicio:not(.desafio)")) {
          if (Object.keys(cartoes).length >= 2) break;
          const id = M.idDe(ex);
          cartoes[id] = {
            id,
            licao: "LOG.01",
            titulo: "Lógica",
            url: "LOG.01.html",
            sec: sec.id,
            conceito: sec.id,
            caixa: 0,
            proxima: dia,
            erros: 1,
            acertos: 0,
            criado: dia,
          };
        }
      localStorage.setItem("dominio:revisao:v1", JSON.stringify(cartoes));
    }, ontem);
    await page.goto(BASE + "licoes/REVISAR.html");
    for (let i = 0; i < 2; i++) {
      await expect(page.locator("#r-palco .exercicio")).toBeVisible();
      await page.evaluate(() => {
        (document.querySelector("#r-palco .exercicio") as HTMLElement).dataset.vid = "r";
      });
      expect((await resolver(page, "r", false)).estado).toBe("resolvido");
      await page.locator("#r-proximo").click();
    }
    await expect(page.locator("#r-palco")).toContainText("Revisão concluída");
  });

  test("a matéria mostra os módulos em menus suspensos, um aberto por vez", async ({ page }) => {
    const erros = vigiarErros(page);
    await page.addInitScript(() =>
      localStorage.setItem("dominio:tutorial:v1", JSON.stringify({ feito: true })),
    );
    await page.goto(BASE + "index.html#trilha-PY");
    // 13 módulos: em partes de 5, só a parte e o módulo atuais abertos
    await expect(page.locator(".parte-sus")).toHaveCount(3);
    await expect(page.locator(".parte-sus[open]")).toHaveCount(1);
    await expect(page.locator(".mod-sus[open]")).toHaveCount(1);
    await expect(page.locator(".mat-mais")).not.toHaveAttribute("open", "");
    const segundo = page.locator(".parte-sus[open] .mod-sus").nth(1);
    await segundo.locator("summary").click();
    await expect(segundo).toHaveAttribute("open", "");
    await expect(page.locator(".mod-sus[open]")).toHaveCount(1);
    await expect(segundo.locator(".mod-ir")).toHaveAttribute(
      "href",
      /licoes\/(AULA\.html#PY\.\d\d|PY\.\d\d\.html)/,
    );
    // o mapa: 6 grupos, só o atual aberto; o diagrama fica num menu
    await page.goto(BASE + "index.html#mapa");
    await expect(page.locator(".grupo-mapa")).toHaveCount(6);
    await expect(page.locator(".grupo-mapa[open]")).toHaveCount(1);
    await page.locator(".mapa-diagrama summary").click();
    await expect(page.locator(".estacao")).toHaveCount(16);
    const largura = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(largura).toBeLessThanOrEqual(0);
    expect(erros).toEqual([]);
  });

  test("os pesos da formação: o mapa mostra o total, a janela explica cada matéria", async ({
    page,
  }) => {
    const erros = vigiarErros(page);
    await page.addInitScript(() => {
      localStorage.setItem("dominio:tutorial:v1", JSON.stringify({ feito: true }));
      localStorage.setItem(
        "dominio:progresso:v1",
        JSON.stringify({ modulos: { "LOG.01": { estado: "dominado" } } }),
      );
    });
    await page.goto(BASE + "index.html#mapa");
    await expect(page.locator(".mapa-formacao")).toContainText("da formação de cientista de dados");
    await expect(page.locator(".mapa-formacao")).toContainText("1 de 167 módulos");
    await expect(page.locator('.g-mat[href="#trilha-PY"]')).toContainText("vale 12%");
    await page.locator("[data-pesos]").click();
    const jn = page.locator("dialog.jn");
    await expect(jn.locator(".peso-linha")).toHaveCount(16);
    await expect(jn.locator(".peso-linha").first()).toContainText("13%");
    await page.keyboard.press("Escape");
    await expect(jn).toHaveCount(0);
    await page.goto(BASE + "index.html#trilha-LOG");
    await expect(page.locator('.mod-sus[data-cod="LOG.01"] .mod-vale')).toContainText(
      /vale \d,\d\d%/,
    );
    expect(erros).toEqual([]);
  });

  test("os cinco temas aparecem no menu e o Planta é o padrão", async ({ page }) => {
    await page.addInitScript(() =>
      localStorage.setItem("dominio:tutorial:v1", JSON.stringify({ feito: true })),
    );
    await page.goto(BASE + "index.html#mapa");
    await expect(page.locator("html")).toHaveAttribute("data-tema", "planta");
    await page.locator("#guia-btn").click();
    await expect(page.locator("[data-tema-opcao]")).toHaveCount(5);
    await page.locator('[data-tema-opcao="caderno"]').click();
    await expect(page.locator("html")).toHaveAttribute("data-tema", "caderno");
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-tema", "caderno");
  });

  test("o trajeto vai para um arquivo e volta em outro aparelho", async ({ page, browser }) => {
    await page.addInitScript(() => {
      localStorage.setItem("dominio:tutorial:v1", JSON.stringify({ feito: true }));
      localStorage.setItem(
        "dominio:progresso:v1",
        JSON.stringify({
          modulos: { "LOG.01": { estado: "dominado", em: "2026-10-21" } },
          passos: { "PY.01": 2 },
        }),
      );
    });
    await page.goto(BASE + "index.html");
    await expect(page.locator(".ini-trajeto")).toBeVisible();
    await page.locator("#guia-btn").click();
    const baixado = page.waitForEvent("download");
    await page.locator('[data-trajeto="salvar"]').click();
    const arquivo = await baixado;
    expect(arquivo.suggestedFilename()).toMatch(/^dominio-trajeto-\d{4}-\d{2}-\d{2}\.json$/);
    const caminho = await arquivo.path();
    await expect(page.locator(".ini-trajeto")).toHaveCount(0);

    // outro aparelho: começa vazio e recebe o arquivo
    const outro = await browser.newContext();
    const pg = await outro.newPage();
    await pg.goto(BASE + "index.html#mapa");
    await pg.evaluate(() =>
      localStorage.setItem("dominio:tutorial:v1", JSON.stringify({ visto: true })),
    );
    await pg.reload();
    await expect(pg.locator("#hud-xp")).toHaveText("0");
    await pg.locator("#guia-btn").click();
    const escolha = pg.waitForEvent("filechooser");
    await pg.locator('[data-trajeto="carregar"]').click();
    await (await escolha).setFiles(caminho);
    await expect(pg.locator(".trajeto-dlg")).toContainText("1 módulo dominado");
    await pg.locator("[data-trocar]").click();
    await expect(pg.locator(".toast")).toContainText("Trajeto carregado");
    await expect(pg.locator("#hud-xp")).not.toHaveText("0");
    await pg.locator("#guia-btn").click();
    await expect(pg.locator('[data-trajeto="desfazer"]')).toBeVisible();
    await outro.close();
  });

  test("um arquivo que não é trajeto é recusado sem mexer em nada", async ({ page }) => {
    await page.addInitScript(() =>
      localStorage.setItem("dominio:tutorial:v1", JSON.stringify({ feito: true })),
    );
    await page.goto(BASE + "index.html#mapa");
    await page.locator("#guia-btn").click();
    const escolha = page.waitForEvent("filechooser");
    await page.locator('[data-trajeto="carregar"]').click();
    await (
      await escolha
    ).setFiles({
      name: "notas.json",
      mimeType: "application/json",
      buffer: Buffer.from('{"oi": 1}'),
    });
    await expect(page.locator(".trajeto-dlg")).toContainText("não é um trajeto");
    await expect(page.locator("[data-trocar]")).toHaveCount(0);
  });
});
