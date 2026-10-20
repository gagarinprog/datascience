# DOMÍNIO — instruções permanentes para o Claude Code

> Este arquivo é lido no começo de toda sessão. Regras curtas e firmes. Detalhes ficam em `docs/`.

## O que é

DOMÍNIO é a plataforma de estudo **pessoal** do Kaio (um único usuário): app tutor para dominar o curso de Tecnologia em Ciência dos Dados da UFMS e servir a concursos de dados/TI. Lições curtas no estilo Mimo, revisão espaçada (FSRS), laboratórios de SQL e Python que corrigem de verdade, e o Claude como tutor socrático.

Documentos de referência (leia antes de mexer na área correspondente):
- `docs/01_MAPA_DAS_DISCIPLINAS.md` — conteúdo do curso, conceitos atômicos, pegadinhas, missões
- `docs/02_BLUEPRINT_PLATAFORMA.md` — pedagogia, ciclo diário, modelo de domínio, schema SQL, prompt do tutor
- `docs/03_REFERENCIAS_GITHUB_E_APPS.md` — referências
- `docs/04_FUNDAMENTOS_DIDATICOS.md` — base científica das decisões de ensino, catálogo de erros de SQL, diferenças SQLite × PostgreSQL
- `docs/05_CURRICULO_CIENCIA_DE_DADOS.md` — currículo completo (16 trilhas, módulos, conceitos, exercícios, critérios de domínio, projetos); o curso da UFMS guia a ordem, o currículo vai além dele
- `docs/06_SEQUENCIA_E_PRE_REQUISITOS.md` — ordem das 16 matérias e dos módulos, o que cada módulo exige antes, pontos de virada e a pesquisa que justifica a ordem; dados em `tutor/sequencia_dados.py`
- `docs/DESIGN.md` — identidade visual, tokens, componentes, telas
- `docs/ROADMAP.md` — fases, critérios de aceite e o status de cada uma

## Quem usa

- Economista, iniciante em programação, tem TDAH e pouco tempo.
- Interface 100% em **português do Brasil**.
- **Nenhum emoji** na interface, no conteúdo ou nos commits. Ícones vêm do Lucide.
- Uma ação principal por tela. Nada de telas cheias de opções.

## Stack (não troque sem perguntar)

- Next.js (App Router) + TypeScript estrito + React Server Components onde fizer sentido
- Tailwind CSS v4 (tokens via `@theme` em `app/globals.css`) + shadcn/ui **customizado** para o DESIGN.md (nunca o visual padrão)
- Motion (Framer Motion) para animação; Lucide para ícones
- Fontes por `next/font/google`: **Sora** (interface e títulos) e **JetBrains Mono** (somente código)
- Supabase (Postgres + Auth + RLS) a partir da Fase 5; antes disso, persistência em `localStorage` atrás de uma interface `Repositorio`
- `ts-fsrs` para revisão espaçada
- CodeMirror 6 para editor de código; `sql.js` para SQL no navegador; Pyodide (Fase 8) para Python
- Anthropic SDK no **servidor** (route handler `app/api/tutor/route.ts`)
- Zod para validar conteúdo e respostas; Vitest para unidade; Playwright para fluxo
- Gerenciador de pacotes: pnpm

## Estrutura de pastas

```
app/                    rotas (hoje, trilha, licao/[id], revisar, laboratorio, perfil, design)
components/ui/          primitivos (botão, chip, painel, barra de progresso)
components/licao/       player de lição e um componente por tipo de item
components/trilha/      trilha de circuito (assinatura visual)
lib/conteudo/           schema Zod + carregadores de conteúdo
lib/fsrs/               adaptador do ts-fsrs
lib/repositorio/        interface Repositorio + implementações (local, supabase)
lib/tutor/              prompt do tutor e cliente do route handler
content/                lições em JSON, uma pasta por disciplina (alg2, bd, ed, gaal, poo, icc)
data/apostila-viva/     schema e seed SQLite usados nos laboratórios
docs/                   documentos de referência
```

## Regras de conteúdo (pedagogia)

1. Toda lição segue: **desafio → conceito → exemplo resolvido → prática → explicar em 3 linhas**. O desafio é uma pré-pergunta de um item sobre o conceito-alvo (doc 04, seção 2).
2. Um conceito por lição; 3 a 7 minutos.
3. Exemplos de SQL, pandas e estatística usam **sempre** o banco de estudo fictício (`apostila/licoes/dados/estudo.sql`, gerado por `gerar_estudo.py` na mesma pasta):
   `alunos(id, nome, email, criado_em)`, `materias(id, nome, banca)`,
   `questoes(id, materia_id, enunciado, gabarito, nivel)`,
   `respostas(id, aluno_id, questao_id, resposta, acertou, respondida_em)`.
   Em lições, exemplos e apresentações, nunca citar o nome de outro produto do Kaio nem o caminho de outro projeto (pedido de 20/10/2026). O laboratório do app Next.js e o tutor `/aula` ainda usam o banco anterior até a migração.
4. Conteúdo do curso segue os slides e planos descritos no `01_MAPA`. Melhoria didática é bem-vinda, mas não pode contradizer o curso.
5. **Lei seca nunca é inventada nem resumida.** Se um item precisar de texto legal, deixe `TODO: colar texto oficial` e avise.
6. Itens Certo/Errado sempre com justificativa.
7. Exercício de código corrige por **resultado** (conjunto de linhas no SQL, testes no Python), nunca por comparação de texto.
8. Exemplo resolvido com **subobjetivos rotulados** e uma autoexplicação de múltipla escolha (doc 04, seção 2).
9. Feedback de erro em três partes: o que está certo, o erro exato e o próximo passo. Pistas em degraus; a solução só depois de duas tentativas (doc 04, seção 3).
10. Erros comuns vêm do catálogo do doc 04 (seção 4) e viram itens "ache o erro", distratores e `erro_tipo`.
11. Nível amador e linguagem atual: exemplos do dia a dia e da tecnologia que o Kaio já usa (Pix, app do banco, delivery, streaming, redes sociais, GPS, planilha, celular) e da economia quando couber. Nada de exemplo datado quando existe um atual.
12. A ordem de estudo e os pré-requisitos seguem o doc 06. Mudou a ordem: edite `tutor/sequencia_dados.py` e rode `python -I tutor/gerar_percurso.py`, que recusa qualquer módulo antes de um pré-requisito dele.

## Regras do tutor (Claude dentro do app)

- Socrático: nunca entrega a resposta antes da tentativa; aponta o erro exato e faz uma pergunta.
- Respostas de no máximo 6 linhas na interface.
- Conhece o erro recorrente do Kaio: aspas em SQL.
- Prompt completo em `docs/02_BLUEPRINT_PLATAFORMA.md`, seção 5.1. Versão em código: `lib/tutor/prompt.ts`.
- A chave `ANTHROPIC_API_KEY` vive só em `.env.local` e só é lida no servidor. Nunca no cliente, nunca em commit.

## Regras de engenharia

- Antes de cada fase: modo de planejamento, plano curto, espera aprovação.
- Ao terminar uma fase: rodar `pnpm lint`, `pnpm typecheck`, `pnpm test`; abrir o app; tirar screenshot das telas tocadas e comparar com `docs/DESIGN.md`; atualizar `docs/ROADMAP.md`.
- Commits pequenos, em português, no imperativo ("Adiciona player de lição").
- O código vive também no GitHub (`gagarinprog/datascience`, branch `main`). Antes de começar, `git pull` (pode ter mudança feita na nuvem); depois dos commits, `git push`. O CI (`.github/workflows/ci.yml`) roda lint, tipos, formatação e todos os testes a cada envio e pull request.
- Acessibilidade obrigatória: foco visível, contraste AA, `prefers-reduced-motion` respeitado, alvos de toque de 44 px.
- Mobile primeiro (390 px), depois desktop.
- Nada de dependência nova sem dizer por quê.
- Não apague conteúdo aprovado sem autorização explícita.

## Comandos

```
pnpm dev          # servidor local
pnpm lint
pnpm typecheck
pnpm test         # vitest
pnpm test:e2e     # playwright
pnpm capturas     # capturas das telas em docs/capturas
```

## Tutor no Claude Code (`/aula`)

- A skill `.claude/skills/aula` dá as aulas uma matéria por vez (`tutor/percurso.txt`, gerado do doc 05 por `tutor/gerar_percurso.py`) e guarda o estado em `tutor/progresso.md`.
- Material visual em `apostila/`, publicado como artefato (https://claude.ai/artifact/EUHg4dSKd4P3K38iU1y3wE). `index.html` carrega `jornada.js`, com três níveis de foco: o Mapa de formação (`#mapa`, as 16 matérias como estações de um diagrama de linhas, uma linha por grupo de matérias; passar o mouse mostra o que cada estação usa e prepara), a Matéria (`#trilha-<SIGLA>` mostra os módulos numa linha do tempo vertical, um aberto por vez; `#guia-<SIGLA>` mostra os subtópicos de como funciona; `#fontes-<SIGLA>` mostra as fontes) e a Lição em tela cheia (`#estudo-<CÓDIGO>`, 5 passos, avanço por botão ou depois do acerto). `#fontes` lista todas as referências. Âncoras sem barra, porque o link do artefato só repassa âncoras simples. Dados: `materias.js` (gerado; não edite à mão), `guia-textos.js`, `figuras.js`, `experimente.js` (caixas interativas), `clipes.js` (clipes animados com GSAP), `glossario.js` (balões dos termos), `fontes.js`, `logos.js`, `icones.js` (Phosphor) e os guias: `personagens.js` (elenco original em estilo anime, desenhado para o projeto: Rin, Takumi, Mei, Bia, Davi, Lia, Kenji, Sol e Rafa, cada um com as cinco expressões padrao, explica, feliz, uau e pensa; cabelos, roupas e acessórios são peças combináveis no próprio arquivo) e `mascote.js` (o panda Dado, opção de guia). O guia é escolhido no topo e fica salvo no navegador. O progresso fica na base do artefato (coleção `progresso`, documento `geral`), com cópia no navegador: `modulos` (dominado ou rever), `passos` (passo em que cada lição parou), `conceitos` (conceitos marcados como entendidos), `respostas` (a resposta escrita na pergunta final), `trilhas` (subtópicos de como funciona concluídos), `notas` (explicações e exemplos escritos na trilha), `clipes` (clipes vistos até o fim), `previsoes` (palpites de saída do código) e `interacoes` (tentativas na caixa interativa). XP, nível e ofensiva saem de `modulos`. A trilha de explicação de cada matéria tem uma tarefa por subtópico (explicar com suas palavras, assistir, experimentar, prever a saída do código) e só conclui depois dela. Lições ilustradas em `apostila/licoes/<SIGLA>.<NN>.html`, no modelo de `LOG.01.html` (e `PY.01.html`, que mostra o padrão para código: REPL, script, bloco e PEP 8), um conceito por vez; cada lição nova entra no mapa `LICOES` de `jornada.js`. `licoes/INICIO.html` ("Comece por aqui: a lista de aprovados", linkada no cartão do mapa) abre a trilha para iniciantes com um concurso fictício (nomes, notas e regras inventados). Cada conceito das lições traz `.simples` (explicação em palavras simples), `.cotidiano` (analogia do dia a dia acadêmico), uma animação passo a passo e `.resumo`. As animações usam `licoes/clip.js` (motor: cada animação é função do passo, com Tocar, Voltar, Passo e pontos; `Clip.registrar`, `Clip.fluxo`, `Clip.execucao`), `licoes/clip.css` e os clipes de cada lição em `clipes-inicio.js`, `clipes-log.js`, `clipes-py.js`, `clipes-var.js` e `clipes-ops.js`; no HTML basta `<figure data-clip="ID">`. Moldes prontos em `clip.js`: `fluxo`, `execucao`, `tabela`, `reducao`, `antesDepois`, `gavetas` e `barras`, todos demonstrados em `licoes/GALERIA.html` (galeria de guias e animações, aberta pelo seletor de guia). Nas lições, `licoes/reacao.js` faz o guia escolhido reagir no retorno de cada exercício (feliz no acerto, pensativo no erro). Os exercícios das lições rodam no motor único `licoes/motor.js` (cada lição só chama `Motor.licao({ chave, trilha, nomes })`): duas tentativas com pista e gabarito só na segunda, feedback em três partes, Certo/Errado com confiança e saldo Cebraspe, `data-classificar` vira cartões para tocar ou arrastar em grupos, `data-ordenar` aceita `data-alternativas`, linha falsa (`data-falsa`) e recuo (`data-recuo`), `data-ache` é o "ache o erro", o `.explique` ganha campo de texto salvo no aparelho, e animações aceitam `data-preveja` (aposta antes de ver). O que não sai de primeira (exceto o desafio) vira cartão de revisão para 1, 3, 7, 14 e 30 dias; a fila do dia fica em `licoes/REVISAR.html` e o mapa avisa quando há revisão. Os testes do motor estão em `tests/apostila-motor.test.ts`.
- O Laboratório **Castelo de Dados** (`apostila/castelo/`, cartão no mapa) é uma sala à parte das matérias, que continuam lineares e intocadas: 12 salas em 4 fases (Fundação, Consultas, Python, Análise) guiam a construção de um banco PostgreSQL de verdade com os dados do banco de estudo e terminam com uma análise e um `.sql` para baixar. O roteiro fica em `castelo/salas.js` (apresentação curta por sala, tarefas `sql`, `escolha`, `acao`, `python`, `relogio`, `fsrs` e `texto`, o `estado` que reconstrói o banco e os nivelamentos `niveis`, que passam com 3 de 4 e liberam a fase seguinte; quem já sabe pode pular a fase pelo nivelamento); o motor em `castelo/castelo.js` (rotas `#sN`, `#nivel-X`, `#relatorio`); a correção pelo resultado e os erros do PostgreSQL em português em `castelo/comparar.js`; o rastreador de linhas do relógio em `castelo/relogio.py`. Roda no navegador com PGlite (PostgreSQL, salvo no IndexedDB), Pyodide com pandas e ts-fsrs, todos por CDN e guardados pelo service worker no primeiro uso. A mudança de fase mostra por que estudar aquilo. Progresso em `dominio:castelo:v1`. `tests/apostila-castelo.test.ts` roda todas as soluções num PostgreSQL de verdade (PGlite, dependência de desenvolvimento só para isso).
- A apostila também é publicada como site no GitHub Pages (https://gagarinprog.github.io/datascience/) pelo `.github/workflows/pages.yml` a cada envio que toca `apostila/`. É um app instalável (PWA): `manifest.webmanifest`, ícones em `apostila/icones/` e `sw.js`, que guarda tudo no aparelho para uso offline. Arquivo novo em `apostila/` entra na lista `ARQUIVOS` do `sw.js` (o teste `tests/apostila-pwa.test.ts` confere) e toda página nova registra o service worker. No site, o progresso fica no navegador do aparelho; no artefato, na base do artefato.
- O visual da apostila é sóbrio e profissional, aprovado pelo Kaio em 15/10/2026 depois de ele achar a versão anterior infantil: Bricolage Grotesque nos títulos (peso 700), Atkinson Hyperlegible Next no texto, Atkinson Hyperlegible Mono no código; fundo grafite, linhas finas, cantos de 6 a 12 px, botões planos, uma cor por matéria usada com parcimônia no mapa (`--m-*` e `--mv-*` em `trilha.css`); nas telas de explicação (matéria, trilha, lição, lição ilustrada) a cor de destaque é um azul moderno com acabamento metálico (`--azul-*`, `--metal*` e a classe `tema-exp` em `jornada.css`), nunca roxo. Nada de botões 3D, brilhos, confete, bolas brilhantes ou balões grandes de mascote. Movimento só quando explica algo e sempre desligado com `prefers-reduced-motion`; contraste AA, foco visível e alvos de 44 px continuam obrigatórios. Personagens de franquias de anime não entram (são de terceiros, sem licença); só desenhos próprios. Na apostila os ícones vêm do Phosphor; no app Next.js, do Lucide.
- SQL de estudo roda no banco da Apostila Viva: `python -I tutor/sql.py "<consulta>"`. O banco (`data/apostila-viva/apostila.db`) é gerado por `data/apostila-viva/gerar.py` e não vai para o git.
- Mudou a ordem ou o currículo: rode `python -I tutor/gerar_percurso.py` de novo.
