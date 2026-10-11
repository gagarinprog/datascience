# DOMÍNIO — instruções permanentes para o Claude Code

> Este arquivo é lido no começo de toda sessão. Regras curtas e firmes. Detalhes ficam em `docs/`.

## O que é

DOMÍNIO é a plataforma de estudo **pessoal** do Kaio (um único usuário): app tutor para dominar o curso de Tecnologia em Ciência dos Dados da UFMS e servir a concursos de dados/TI. Lições curtas no estilo Mimo, revisão espaçada (FSRS), laboratórios de SQL e Python que corrigem de verdade, e o Claude como tutor socrático.

Documentos de referência (leia antes de mexer na área correspondente):
- `docs/01_MAPA_DAS_DISCIPLINAS.md` — conteúdo do curso, conceitos atômicos, pegadinhas, missões
- `docs/02_BLUEPRINT_PLATAFORMA.md` — pedagogia, ciclo diário, modelo de domínio, schema SQL, prompt do tutor
- `docs/03_REFERENCIAS_GITHUB_E_APPS.md` — referências
- `docs/04_FUNDAMENTOS_DIDATICOS.md` — base científica das decisões de ensino, catálogo de erros de SQL, diferenças SQLite × PostgreSQL
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
3. Exemplos de SQL, pandas e estatística usam **sempre** o schema da Apostila Viva:
   `usuarios(id, nome, email, criado_em)`, `disciplinas(id, nome, banca)`,
   `questoes(id, disciplina_id, enunciado, gabarito, dificuldade)`,
   `respostas(id, usuario_id, questao_id, resposta, correta, respondida_em)`.
4. Conteúdo do curso segue os slides e planos descritos no `01_MAPA`. Melhoria didática é bem-vinda, mas não pode contradizer o curso.
5. **Lei seca nunca é inventada nem resumida.** Se um item precisar de texto legal, deixe `TODO: colar texto oficial` e avise.
6. Itens Certo/Errado sempre com justificativa.
7. Exercício de código corrige por **resultado** (conjunto de linhas no SQL, testes no Python), nunca por comparação de texto.
8. Exemplo resolvido com **subobjetivos rotulados** e uma autoexplicação de múltipla escolha (doc 04, seção 2).
9. Feedback de erro em três partes: o que está certo, o erro exato e o próximo passo. Pistas em degraus; a solução só depois de duas tentativas (doc 04, seção 3).
10. Erros comuns vêm do catálogo do doc 04 (seção 4) e viram itens "ache o erro", distratores e `erro_tipo`.

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
