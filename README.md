# Domínio

[![CI](https://github.com/gagarinprog/datascience/actions/workflows/ci.yml/badge.svg)](https://github.com/gagarinprog/datascience/actions/workflows/ci.yml)

Plataforma pessoal de estudo de Ciência de Dados: lições curtas, revisão espaçada (FSRS), laboratórios de SQL e Python que corrigem pelo resultado e o Claude como tutor socrático.

## Estudar em qualquer máquina

Só precisa do Claude Code e do Git (Python 3 já basta para o banco de estudo).

```bash
git clone https://github.com/gagarinprog/datascience.git
cd datascience
claude
```

Dentro do Claude, digite `/aula`. O tutor lê `tutor/progresso.md`, continua de onde você parou e monta o banco de estudo sozinho na primeira consulta SQL. Para ver o mapa visual: https://claude.ai/artifact/EUHg4dSKd4P3K38iU1y3wE (entre na mesma conta).

Ao terminar uma sessão, o tutor grava o avanço em `tutor/progresso.md`; faça `git add -A && git commit -m "Atualiza progresso" && git push` para levar o ponto para a outra máquina. Antes de começar em outra máquina, `git pull`.

## Rodar

Requisitos: Node.js 20.9 ou mais novo e pnpm.

```bash
pnpm install
pnpm dev
```

Depois abra http://localhost:3000/design para ver o sistema de design.

## Comandos

| Comando          | O que faz                                                  |
| ---------------- | ---------------------------------------------------------- |
| `pnpm dev`       | Servidor local                                             |
| `pnpm lint`      | ESLint                                                     |
| `pnpm typecheck` | TypeScript (gera antes os tipos das rotas)                 |
| `pnpm test`      | Testes de unidade (Vitest)                                 |
| `pnpm test:e2e`  | Testes de fluxo (Playwright, em 390 e 1280 px, com axe)    |
| `pnpm capturas`  | Regera as capturas da página `/design` em `docs/capturas/` |
| `pnpm format`    | Prettier                                                   |

Na primeira vez, o Playwright precisa do navegador: `pnpm exec playwright install chromium`.

## Documentos

- `CLAUDE.md`: regras permanentes do projeto
- `docs/DESIGN.md`: identidade visual, tokens e telas
- `docs/ROADMAP.md`: fases, critérios de aceite e status
