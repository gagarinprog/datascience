# Domínio

Plataforma pessoal de estudo de Ciência de Dados: lições curtas, revisão espaçada (FSRS), laboratórios de SQL e Python que corrigem pelo resultado e o Claude como tutor socrático.

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
