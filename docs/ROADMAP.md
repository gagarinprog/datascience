# ROADMAP — fases de construção do DOMÍNIO

> Uma fase por sessão do Claude Code. Cada fase só começa depois que a anterior passou nos critérios de aceite.
> Status: `[ ]` não iniciada · `[~]` em andamento · `[x]` concluída

---

## Fase 0 — Fundação e sistema de design `[ ]`

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

---

## Fase 1 — Casca do app e tela Hoje `[ ]`

Entregas:
- Navegação: barra inferior no mobile (Hoje, Trilha, Revisar, Laboratório, Eu); trilho lateral no desktop
- Tela **Hoje** conforme DESIGN.md 6.1, com dados falsos vindos de `lib/repositorio/local.ts`
- Interface `Repositorio` (métodos: `sessaoDeHoje`, `cartasParaRevisar`, `dominio`, `registrarTentativa`, `registrarSessao`)
- Rotas vazias, com estado vazio bem escrito, para Trilha, Revisar, Laboratório, Eu

Aceite: navegação funciona por teclado; Playwright abre Hoje e clica em "Começar sessão".

---

## Fase 2 — Motor de conteúdo e player de lição `[ ]`

Entregas:
- Schema Zod do conteúdo (`lib/conteudo/schema.ts`): `Licao { id, disciplina, conceito, titulo, minutos, passos: Passo[] }`, com `Passo` = `desafio | conceito | exemplo | item`, e `Item` cobrindo os tipos de DESIGN.md 6.4 (menos `sql`, `python`, `explique` nesta fase)
- Carregador que valida todo `content/**/*.json` no build (erro de schema quebra o build)
- Player de lição em tela cheia (DESIGN.md 6.3) com progresso segmentado, botão "Verificar" e painel de feedback
- Componentes: `ItemFlashcard`, `ItemCertoErrado`, `ItemCompletar` (chips), `ItemParsons`, `ItemPrevejaSaida`, `ItemAcheOErro`
- **Uma lição de referência completa:** `content/bd/group-by-having.json`, escrita a partir de `docs/01_MAPA` seção 5

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

Aceite: 10 casos de teste do corretor (incluindo o erro das aspas) passando.

---

## Fase 4 — Revisão espaçada (FSRS) `[ ]`

Entregas:
- `lib/fsrs/` adaptando o `ts-fsrs` ao modelo `carta` do blueprint
- Ao terminar uma lição, os itens dela viram cartas
- Tela **Revisar** (DESIGN.md 6.6): fila do dia intercalada por disciplina, botões Errei/Difícil/Bom/Fácil, resumo final
- O passo "Aquecimento" da sessão de Hoje usa essa fila (máx. 12 cartas)

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

Aceite: chave nunca aparece no bundle do cliente (checar com busca no build); teste com tutor simulado (mock).

---

## Fase 7 — Trilha de Circuito `[ ]`

Entregas:
- Componente `TrilhaCircuito` desenhando o grafo de `conceito` + `prerequisito` em SVG, com trilhas ortogonais, pads nas junções e cor por disciplina
- Os 6 estados de domínio (bloqueado, disponível, apresentado, praticado, dominado, retido) calculados pelas regras do blueprint seção 4.2
- Animação da corrente quando um conceito passa a "praticado" (respeitando reduced motion)
- Painel do chip: lógica em uma frase, estado, último acerto, "Estudar agora"

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

---

## Regra de conteúdo para todas as fases

Cada nova lição entra em `content/<disciplina>/` e precisa: passar no schema, seguir a ordem desafio → conceito → exemplo → prática → explique, usar o schema da Apostila Viva nos exemplos, e ter pelo menos um item C/E com justificativa.
