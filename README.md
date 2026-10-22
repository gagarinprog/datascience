# Domínio

[![CI](https://github.com/gagarinprog/datascience/actions/workflows/ci.yml/badge.svg)](https://github.com/gagarinprog/datascience/actions/workflows/ci.yml)

Plataforma pessoal de estudo de Ciência de Dados: lições curtas, revisão espaçada (FSRS), laboratórios de SQL e Python que corrigem pelo resultado e o Claude como tutor socrático.

## Como começar a estudar

O lugar principal é o site: https://gagarinprog.github.io/datascience/

1. **Abra no celular ou no computador e instale.** No Chrome do celular, menu e "Adicionar à tela inicial"; no computador, o ícone de instalar na barra de endereço. Para estudar sem internet, ainda com Wi-Fi, abra o menu do guia (o rosto no canto de cima) e toque em **Baixar o curso inteiro** (cerca de 50 MB, com o Python e o PostgreSQL). Quando os quatro itens ficarem prontos, o curso todo roda sem internet.
2. **Primeira visita:** o Início apresenta o programa e o botão abre o tutorial (sete paradas pela tela real). Escolha o guia e o traço no topo.
3. **Comece por "Comece por aqui: a lista de aprovados"**, no cartão do mapa. Depois siga a ordem do mapa: Lógica (LOG), Python (PY), Banco de dados (BD) e assim por diante. Cada matéria tem a trilha de como funciona, os módulos em estudo de 5 passos e, quando existe, a lição ilustrada.
4. **No dia a dia:** abra o Início e toque em **Continuar de onde parou**. Se o Início avisar que há revisão para hoje, faça a revisão primeiro (5 a 10 minutos).
5. **Centro de Dados:** quando terminar o começo de BD, abra o cartão do Centro de Dados no mapa. Lá se monta e administra um PostgreSQL de verdade, zona por zona.
6. **Revisão de conceitos simples:** o cartão de mesmo nome no mapa guarda os exercícios de contar e calcular com a tabela, para aquecer.

**Guarde o trajeto.** No site, o progresso fica no navegador daquele aparelho. No menu do guia, "Salvar meu trajeto" baixa um arquivo `dominio-trajeto-AAAA-MM-DD.json`; em outro aparelho, "Carregar trajeto" traz tudo de volta. O Início lembra quando passar 7 dias sem salvar. Não limpe os dados do navegador sem salvar antes.

O artefato (https://claude.ai/artifact/EUHg4dSKd4P3K38iU1y3wE) é um espelho do site dentro do Claude: o progresso dele fica na base do artefato e é ali que o `/aula` marca os módulos dominados. Para estudar todo dia, use o site; o `/aula` é o complemento para dúvidas, prática de produção e simulados.

## Estudar com o tutor `/aula`

Só precisa do Claude Code e do Git (Python 3 já basta para o banco de estudo).

```bash
git clone https://github.com/gagarinprog/datascience.git
cd datascience
claude
```

Dentro do Claude, digite `/aula`. O tutor lê `tutor/progresso.md`, continua de onde você parou e monta o banco de estudo sozinho na primeira consulta SQL. Quando o módulo tem lição ilustrada, o tutor manda o link dela no site.

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
