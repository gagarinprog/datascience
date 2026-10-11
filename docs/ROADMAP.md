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

---

## Regra de conteúdo para todas as fases

Cada nova lição entra em `content/<disciplina>/` e precisa: passar no schema, seguir a ordem desafio → conceito → exemplo → prática → explique, usar o schema da Apostila Viva nos exemplos, e ter pelo menos um item C/E com justificativa.
