# ROADMAP — fases de construção do DOMÍNIO

> Uma fase por sessão do Claude Code. Cada fase só começa depois que a anterior passou nos critérios de aceite.
> Status: `[ ]` não iniciada · `[~]` em andamento · `[x]` concluída

---

## Fase 0 — Fundação e sistema de design `[x]`

**Objetivo:** projeto criado, tokens no lugar e uma página `/design` que mostra todos os componentes base.

Entregas:
- Next.js + TypeScript estrito + Tailwind v4 + pnpm; ESLint e Prettier; Vitest e Playwright configurados
- `app/globals.css` com todos os tokens de `docs/DESIGN.md` em `@theme`
- Fontes Sora e JetBrains Mono via `next/font/google`
- Componentes: `BotaoTatil` (primário, secundário, perigo; estados normal, pressionado, desabilitado), `Chip` (com cor de disciplina), `Painel`, `BarraProgressoSegmentada`, `PainelFeedback` (certo e errado), `ChipConceito` (5 estados da trilha)
- Página `/design` com todos os componentes e a paleta
- `.env.example` com `ANTHROPIC_API_KEY=` e `NEXT_PUBLIC_SUPABASE_URL=` vazios; `.gitignore` cobrindo `.env.local`
- Repositório git iniciado com o primeiro commit

Aceite:
- `pnpm lint`, `pnpm typecheck`, `pnpm test` passam
- Screenshot de `/design` em 390 px e 1280 px conferido contra o DESIGN.md
- Nenhum emoji, nenhuma cor fora dos tokens

Registro (11/10/2026):
- Feito com Next.js 16.4 (Turbopack, Cache Components), React 19.3, Tailwind 4.3, pnpm 12, Vitest 5 e Playwright 1.64.
- `pnpm test`: 41 testes, incluindo os de proteção (tokens iguais ao DESIGN.md, nenhum hex fora do `globals.css`, nenhum emoji, nenhuma caixa alta).
- `pnpm test:e2e`: 14 testes em 390 e 1280 px (sem rolagem horizontal, axe WCAG AA com contraste, alvos de 44 px, foco de 2 px, reduzir movimento).
- Capturas em `docs/capturas/` (`pnpm capturas` regera). Decisões de design na seção 9 do `docs/DESIGN.md`.
- Para a Fase 2: o exemplo do DESIGN 6.3 usa `respostas.disciplina_id`, coluna que não existe no schema da Apostila Viva (`disciplina_id` está em `questoes`). A lição de GROUP BY precisa agrupar `questoes` por `disciplina_id` ou esperar o JOIN, que vem depois na trilha.

---

## Fase 1 — Casca do app e tela Hoje `[x]`

Entregas:
- Navegação: barra inferior no mobile (Hoje, Trilha, Revisar, Laboratório, Eu); trilho lateral no desktop
- Tela **Hoje** conforme DESIGN.md 6.1, com dados falsos vindos de `lib/repositorio/local.ts`
- Interface `Repositorio` (métodos: `sessaoDeHoje`, `cartasParaRevisar`, `dominio`, `registrarTentativa`, `registrarSessao`)
- Rotas vazias, com estado vazio bem escrito, para Trilha, Revisar, Laboratório, Eu

Aceite: navegação funciona por teclado; Playwright abre Hoje e clica em "Começar sessão".

Registro (11/10/2026):
- Hoje fica em `/`. A navegação vive no grupo `app/(app)`; o `/design` e a lição ficam fora, em tela cheia.
- `obterRepositorio()` em `lib/repositorio/` entrega a versão local (localStorage, com os dados falsos do DESIGN 6.1). A Fase 5 troca pelo Supabase nesse mesmo ponto.
- "Começar sessão" leva a `/licao/bd-group-by-having`, página provisória que a Fase 2 substitui. "Só 10 minutos hoje" leva a `/revisar`.
- A frase de mapa do blueprint (7.1) entrou no cartão da missão.
- `pnpm test`: 70 testes. `pnpm test:e2e`: 64 testes em 390 e 1280 px (Hoje com relógio fixo, navegação só por teclado, axe, rolagem e alvos de 44 px em todas as telas). O CI no GitHub Actions roda tudo a cada envio para a `main` e a cada pull request.
- Para depois: decidir quem escolhe a missão do dia (o app, pela semana do blueprint 3.2, ou o chat do projeto). Os dados falsos, inclusive a AP em 26/10, saem quando o progresso for real.

---

## Fase 2 — Motor de conteúdo e player de lição `[ ]`

Entregas:
- Schema Zod do conteúdo (`lib/conteudo/schema.ts`): `Licao { id, disciplina, conceito, titulo, minutos, passos: Passo[] }`, com `Passo` = `desafio | conceito | exemplo | item`, e `Item` cobrindo os tipos de DESIGN.md 6.4 (menos `sql`, `python`, `explique` nesta fase)
- Carregador que valida todo `content/**/*.json` no build (erro de schema quebra o build)
- Player de lição em tela cheia (DESIGN.md 6.3) com progresso segmentado, botão "Verificar" e painel de feedback
- Componentes: `ItemFlashcard`, `ItemCertoErrado`, `ItemCompletar` (chips), `ItemParsons`, `ItemPrevejaSaida`, `ItemAcheOErro`
- **Uma lição de referência completa:** `content/bd/group-by-having.json`, escrita a partir de `docs/01_MAPA` seção 5

Didática (`docs/04_FUNDAMENTOS_DIDATICOS.md`, seções 1 a 4):
- `desafio` como pré-pergunta de um item sobre o conceito-alvo; não pesa no domínio
- `exemplo` com `subobjetivos` rotulados e uma `autoexplicacao` de múltipla escolha
- Prática em degraus (completar → Parsons → prever → escrever), pulando o degrau seguinte quando acerta de primeira, e um item de discriminação com o conceito vizinho
- Feedback em três partes (o que está certo, o erro exato, o próximo passo), escada de pistas e registro de "usou dica"
- Catálogo de erros (`lib/conteudo/erros.ts`, com os códigos da seção 4) usado no feedback, nos distratores do Parsons e no `erro_tipo` das tentativas

Aceite: testes unitários dos corretores de cada tipo; Playwright completa a lição de referência acertando e errando.

---

## Fase 3 — Laboratório SQL `[ ]`

Entregas:
- `sql.js` carregado sob demanda (não no bundle inicial)
- `data/apostila-viva/schema.sql` e `seed.sql` (SQLite) com as 4 tabelas e dados verossímeis: 30 usuários, 6 disciplinas, 120 questões, 1.500 respostas
- `ItemSql`: editor CodeMirror com destaque SQL, botão "Executar consulta", tabela de resultado, botão "Verificar"
- Corretor por **resultado**: executa a consulta do aluno e a consulta-gabarito; compara colunas e linhas (com e sem ordem, conforme o item define); mensagens específicas: número de colunas diferente, linhas faltando/sobrando, ordem errada, certo
- Detector do erro das aspas: se a consulta tiver nome de coluna entre aspas simples, o feedback diz isso pelo nome
- Rota `/laboratorio` com editor livre e painel de schema clicável

Didática (`docs/04_FUNDAMENTOS_DIDATICOS.md`, seção 5):
- Antes de começar, decidir entre manter o `sql.js` com verificações próprias ou trocar pelo PGlite (PostgreSQL no navegador, recomendado), porque o SQLite aceita coisas que o PostgreSQL do curso rejeita
- Se ficar o `sql.js`: tabelas `STRICT`, aspas duplas como texto desligadas ou detectadas, e avisos para coluna solta no GROUP BY, `==`, `IS NOT valor` e apelido no HAVING
- "Ver passo a passo": a tabela intermediária de cada cláusula, na ordem lógica (FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY)
- Mensagens de erro do banco reescritas para iniciante, com o código do catálogo de erros

Adiantado (11/10/2026), para o tutor `/aula`: `data/apostila-viva/schema.sql`, `seed.sql` e o gerador `gerar.py` (30 usuários, 6 disciplinas, 120 questões, 1.500 respostas, semente fixa, com NULL e apóstrofo de propósito). O corretor por resultado em linha de comando está em `tutor/sql.py`, com aspas duplas como texto desligadas, como no PostgreSQL.

Adiantado (20/10/2026), na apostila: o Laboratório Castelo de Dados (`apostila/castelo/`) já usa o PGlite, o corretor por resultado (`comparar.js`, com ordem e tolerância), o detector das aspas, os erros do PostgreSQL reescritos para iniciante e o "ver passo a passo" do GROUP BY. A decisão sql.js × PGlite fica tomada a favor do PGlite; o app Next.js pode reaproveitar `comparar.js` e o roteiro das salas.

Adiantado (20/10/2026, à noite), na apostila: o laboratório virou o Centro de Dados (mapa com zonas e tráfego, painel com o ciclo entender, ver o passo a passo, fazer, explicar), com 12 passo a passo animados (Anime.js) feitos com linhas reais do banco de estudo, módulos em cascata e a dica dos exercícios de código como comentário no editor. As lições ganharam a mesma cascata por conceito.

Adiantado (21/10/2026), na apostila: tutorial guiado na primeira visita ao mapa; cada matéria diz para que serve no trabalho do cientista de dados; o laboratório vai do banco vazio à operação, com a zona E (índices e `EXPLAIN ANALYZE`, transações com `ROLLBACK`, visão e usuário só leitura, backup e restauração pelo próprio `.sql`, painel de resultados com recado ao gestor), o nivelamento D e o guia abrindo cada módulo com o uso no trabalho. São 17 módulos em 5 zonas, todos com as soluções conferidas num PostgreSQL de verdade nos testes.

Adiantado (21/10/2026, à tarde), na apostila: página inicial sem rolagem (apresentação na primeira visita, Continuar e três atalhos no dia a dia); os guias em três traços à escolha (Mangá, Anime próprio, Aventura) e com oito movimentos ligados ao estudo; exemplos de Banco de Dados e Análise de Dados migrados para o banco de estudo; verificação de todas as interações no navegador, que achou e corrigiu a troca de tela que travava quando vinha de um temporizador, o "ache o erro" que passava da largura do celular e contrastes abaixo de AA nas animações; a verificação virou o teste `e2e/apostila.spec.ts`, que roda no CI.

Adiantado (21/10/2026, à noite), na apostila: salvar o trajeto num arquivo e carregar em outro aparelho (`trajeto.js`, no menu do guia, com conferência do arquivo e desfazer). Para a Fase 5: a sincronização na nuvem vai para um projeto Supabase novo, só do Domínio, usando o mesmo formato do arquivo.

Adiantado (21/10/2026, madrugada), na apostila e parte da Fase 8 (Python no navegador): "Faça no Python", em que se escreve o comando e a tabela muda enquanto se digita (Pyodide num Web Worker, pandas sob demanda, correção por testes, dicas em degraus, erros em português), com o bloco "O comando em Python" em cada conceito. Primeiro envio: Comece por aqui (8 exercícios em pandas: shape, coluna derivada, filtro e len, duas regras, dtypes e value_counts, sort_values com desempate, mean, max, min e groupby, e o mini-projeto inteiro) e PY.01 (7: REPL, script, input com float, comentário, recuo, PEP 8 e o aprovado.py). Segundo envio: LOG.01 (5: IMC com o teste de mesa, pseudocódigo traduzido para Python, o fluxograma do frete em if/else, o teste de mesa automático das notas e a conta de luz), LOG.02 (6: reatribuição, troca com auxiliar, os quatro tipos, str() no print, a constante NOTA_DE_CORTE e o programa da tarefa) e LOG.03 (7: média e quanto falta, // e %, == contra =, and, precedência, curto-circuito e o programa da concorrência), com o teste de mesa automático (`data-rastro`) e o pseudocódigo traduzido linha a linha em comentário. Próximo: as caixas Experimente das matérias com Python.

Aceite: 10 casos de teste do corretor (incluindo o erro das aspas) passando.

---

## Fase 4 — Revisão espaçada (FSRS) `[ ]`

Entregas:
- `lib/fsrs/` adaptando o `ts-fsrs` ao modelo `carta` do blueprint
- Ao terminar uma lição, os itens dela viram cartas
- Tela **Revisar** (DESIGN.md 6.6): fila do dia intercalada por disciplina, botões Errei/Difícil/Bom/Fácil, resumo final
- O passo "Aquecimento" da sessão de Hoje usa essa fila (máx. 12 cartas)

Didática (`docs/04_FUNDAMENTOS_DIDATICOS.md`, seção 6): retenção desejada de 0,90; pista usada vale Difícil e solução mostrada vale Errei; intercalação dirigida dos pares que se confundem (WHERE × HAVING, COUNT(*) × COUNT(coluna), INNER × LEFT JOIN).

Aceite: testes que simulam 30 dias de revisão e checam que os intervalos crescem com acertos e encolhem com erros.

---

## Fase 5 — Supabase e persistência real `[ ]`

Entregas:
- Migrations com o schema de `docs/02_BLUEPRINT_PLATAFORMA.md` seção 8 (adaptado: coluna `usuario_id` em todas as tabelas de progresso)
- RLS: cada linha só é lida e escrita pelo próprio usuário
- Login por link mágico (um único usuário, o Kaio)
- `lib/repositorio/supabase.ts` implementando a mesma interface da Fase 1; a troca é feita por variável de ambiente
- Script de seed do currículo: `disciplina`, `modulo`, `conceito`, `prerequisito` a partir do `01_MAPA`

Aceite: progresso sobrevive a trocar de navegador; teste de RLS com um segundo usuário de teste que não enxerga nada.

---

## Fase 6 — Tutor (Claude) `[ ]`

Entregas:
- `app/api/tutor/route.ts` (servidor) usando o Anthropic SDK; prompt de `lib/tutor/prompt.ts` (cópia fiel da seção 5.1 do blueprint)
- Botão "Explicar meu erro" no painel de feedback, com resposta em streaming
- `ItemExplique`: o tutor avalia a explicação de 3 linhas e devolve nota 0 a 3 + uma pergunta
- Resposta do tutor validada por Zod (o JSON de saída do prompt); falha de validação mostra mensagem clara, nunca quebra a tela
- Limite de uso local (ex.: 40 chamadas/dia) configurável, para controlar custo

Didática (`docs/04_FUNDAMENTOS_DIDATICOS.md`, seção 7): o tutor recebe a solução e o critério do item, segue a escada de pistas um degrau por vez e devolve no JSON o degrau usado.

Aceite: chave nunca aparece no bundle do cliente (checar com busca no build); teste com tutor simulado (mock).

---

## Fase 7 — Trilha de Circuito `[ ]`

Entregas:
- Componente `TrilhaCircuito` desenhando o grafo de `conceito` + `prerequisito` em SVG, com trilhas ortogonais, pads nas junções e cor por disciplina
- Os 6 estados de domínio (bloqueado, disponível, apresentado, praticado, dominado, retido) calculados pelas regras do blueprint seção 4.2
- Animação da corrente quando um conceito passa a "praticado" (respeitando reduced motion)
- Painel do chip: lógica em uma frase, estado, último acerto, "Estudar agora"

Didática (`docs/04_FUNDAMENTOS_DIDATICOS.md`, decisão 16): avaliar estimar o domínio pelo histórico de tentativas (knowledge tracing) no lugar da regra fixa "3 acertos em 2 dias".

Aceite: com 40 conceitos de BD a trilha continua fluida no celular; acessível por teclado (cada chip é focável e anunciado).

---

## Fase 8 — Python no navegador `[ ]`

Entregas:
- Pyodide carregado sob demanda, num Web Worker
- `ItemPython`: editor, saída do console, testes escondidos (estilo Exercism), tempo limite de execução
- Primeiras lições de ALG II (Módulo 1: classes como registro, arquivos com `with`)

Aceite: travar em laço infinito não congela a interface (o worker é encerrado).

---

## Fase 9 — Polimento, PWA e modo prova `[ ]`

Entregas:
- PWA instalável (ícone, manifest, offline para lições já baixadas)
- Modo prova: contador de dias até cada AP, sessão focada nas disciplinas com AP próxima
- Modo Certo/Errado cronometrado (20 itens) com estatística por assunto
- Passada completa de acessibilidade e desempenho (Lighthouse)

Didática (`docs/04_FUNDAMENTOS_DIDATICOS.md`, seções 8 e 9): no modo C/E, a confiança antes da resposta e a nota no estilo Cebraspe (+1, −1, 0, conforme o edital); na tela Hoje, uma intenção de implementação opcional ("quando e onde vou estudar").

---

## Revisão de experiência (11/10/2026, entre as fases 1 e 2)

Revisão feita do ponto de vista de quem usa, com as capturas antes e depois. O que mudou:
- **"Começar sessão" deixou de cair em "em construção":** abre o desafio da lição, jogável (escolher, Verificar, feedback, concluir), e a tentativa fica guardada com o `erro_tipo`. Isso adiantou duas peças da Fase 2: `ItemCertoErrado` e o formato do player; o player completo continua na Fase 2.
- **Movimento:** transições entre telas pela View Transitions API (aba esmaece; lição entra pela direita e sai pela esquerda), indicador da aba que desliza, toque que afunda, segmento de progresso que enche, ícone do feedback que acende. Tudo desliga com reduzir movimento (DESIGN 5.1).
- **Hoje:** meta da semana com os dias de segunda a domingo e o de hoje marcado; a sequência e a semana saem dos dias estudados, e o ícone da sequência acende quando hoje já teve estudo.
- **Abas com conteúdo:** Trilha mostra uma prévia linear de Banco de Dados (a Trilha de Circuito completa continua na Fase 7); Laboratório mostra as tabelas da Apostila Viva; Revisar conta as cartas; Eu resume sequência, semana e domínio.
- **Código sem ligaduras** (`>=` não vira `≥`) e bloco de código focável quando rola.
- Testes: 91 de unidade e 76 de fluxo em 390 e 1280 px (inclui o desafio jogado nos dois caminhos, o axe com o painel aberto e as transições disparando), mais 16 capturas.

## Apostila: estilo de jogo (13/10/2026) e depois visual sóbrio (15/10/2026), fora das fases

A apostila estática (`apostila/`, publicada como artefato) virou um jogo no estilo Mimo, a pedido do Kaio:
- **Mapa:** as 16 matérias numa estrada sinuosa em 6 mundos, com anel de progresso em cada parada, o mascote marcando "você está aqui" e a parte já percorrida da estrada acesa nas cores das matérias.
- **Matéria:** a jornada dos módulos em ziguezague; ao tocar num módulo, ele abre em cascata (o que ensina, conceitos, pré-requisitos, XP) e o resto recua. "Como funciona" virou subtópicos em sanfona, um aberto por vez, com contagem dos já vistos.
- **Clipes:** 8 vídeos curtos animados com GSAP (frete, variáveis, bits, consulta SQL, pilha e fila, busca binária, média e mediana, sobreajuste), com legenda, barra de tempo e velocidade; com movimento reduzido, viram quadros.
- **Lição em tela cheia:** 5 passos com barra segmentada, balões do glossário (96 termos), cartão de vitória com confete e avanço automático. XP, nível e ofensiva saem do progresso salvo.
- **Panda estudante (14/10/2026):** o mascote Dado virou um panda com capelo, óculos e blusão na cor da matéria, neutro de gênero, com cinco expressões (padrão, explica, feliz, uau, pensa). Pisca, balança a borla do capelo, acena quando explica e comenta os clipes ao lado da legenda.
- **Refino de movimento e organização:** barra de mundos fixa no mapa (pula para o mundo e acompanha a rolagem), mundos e paradas que entram conforme a rolagem, números do topo que sobem, clipes com marcas de capítulo na barra de tempo.
- **Visual sóbrio (15/10/2026):** o Kaio achou a trilha infantil. O mapa virou um diagrama de linhas (como um mapa de metrô): 16 estações em 6 linhas, com a parte percorrida acesa e as dependências destacadas ao passar o mouse. A matéria virou uma linha do tempo de módulos, um aberto por vez. Botões planos, cantos contidos, sem brilhos nem confete. Os guias passaram a ser um elenco original em estilo anime (Rin, Takumi, Mei), com o panda como opção, escolhido no topo. Não foram usados personagens de franquias: a busca no GitHub só achou geradores por IA sem licença e personagens de terceiros.
- **Trilhas de explicação e progresso salvo (16/10/2026):** "Como funciona" virou uma trilha guiada: cada subtópico tem uma tarefa (explicar a ideia com suas palavras, assistir aos clipes até o fim, fazer três tentativas na caixa interativa, prever a saída de cada linha de código antes de ver) e só conclui depois dela; o próximo abre sozinho. A lição retoma do passo em que parou, os conceitos podem ser marcados como entendidos e a resposta escrita fica guardada. Tudo vai para um documento só na nuvem do artefato, com cópia no navegador e mesclagem entre aparelhos. A explicação trocou o roxo por azul metálico; o mapa não mudou.
- Testes: capturas em 1366 e 390 px, claro e escuro, com movimento reduzido; nenhuma tela transborda (inclui os 5 passos da lição, medido contra a largura fixa do aparelho) e nenhum erro de página.

---

## Regra de conteúdo para todas as fases

Cada nova lição entra em `content/<disciplina>/` e precisa: passar no schema, seguir a ordem desafio → conceito → exemplo → prática → explique, usar o schema da Apostila Viva nos exemplos, e ter pelo menos um item C/E com justificativa.
