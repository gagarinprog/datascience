# DESIGN.md — identidade visual do DOMÍNIO

## 1. Ideia central

**"Uma placa de circuito que acende conforme você aprende."**

O curso é ciência de dados, a disciplina de base é computação, e o primeiro conteúdo de Introdução a Conceitos de Computação é literalmente circuito digital. A interface usa esse mundo: o progresso é **corrente elétrica** percorrendo trilhas de uma placa. Cada conceito dominado é um chip que acende; as trilhas entre eles se iluminam na cor da disciplina.

Do Mimo vem a **mecânica**: lições curtas em tela cheia, um botão de ação fixo embaixo, feedback em painel que sobe, chips de código para tocar, trilha vertical de lições, sequência diária. Do circuito vem a **identidade**.

A ousadia fica num lugar só: a **Trilha de Circuito**. Todo o resto é calmo, escuro, legível.

## 2. Tokens de cor

| Token | Hex | Uso |
|---|---|---|
| `--fundo` | `#0D1430` | Fundo do app (azul-noite de sala de servidores, não preto) |
| `--placa` | `#151E42` | Superfície 1: painéis, cartão de lição |
| `--placa-alta` | `#1D2A5A` | Superfície 2: elementos elevados, painel de feedback |
| `--trilha-apagada` | `#2A3870` | Trilhas e bordas inativas |
| `--texto` | `#E9EDFF` | Texto principal |
| `--texto-2` | `#8D97C4` | Texto secundário, legendas |
| `--corrente` | `#38E1FF` | Ação principal (botões), foco, corrente "ligada" genérica |
| `--sobre-corrente` | `#04121A` | Texto sobre o botão ciano |
| `--acerto` | `#3DE0A0` | Resposta certa |
| `--erro` | `#FF6B81` | Resposta errada |
| `--aviso` | `#FFD166` | Avisos (AP chegando, sequência em risco) |

### Sinal por disciplina (a cor carrega informação, não é decoração)

| Disciplina | Token | Hex |
|---|---|---|
| Algoritmos II (Python) | `--sinal-alg2` | `#38E1FF` ciano |
| Banco de Dados (SQL) | `--sinal-bd` | `#FFB547` âmbar |
| Estrutura de Dados | `--sinal-ed` | `#FF6FB5` rosa |
| GAAL | `--sinal-gaal` | `#9D8CFF` violeta |
| POO | `--sinal-poo` | `#C9F27A` lima suave |
| Intro. Conceitos de Computação | `--sinal-icc` | `#7AA8FF` azul |
| Estatística (trilha sombra) | `--sinal-est` | `#FF9E7A` salmão |

Regra: a cor de disciplina aparece **só** em trilhas, chips de conceito e na barra de progresso da lição daquela disciplina. Nunca em fundos grandes.

Brilho ("glow"): elementos acesos usam `box-shadow: 0 0 0 1px cor, 0 0 18px -4px cor` com opacidade baixa. Nunca gradiente decorativo em fundo de seção.

Modo claro: não existe na v1. O app é escuro por identidade. (Reavaliar depois.)

## 3. Tipografia

- **Sora** — interface, títulos e números. Pesos 400, 600, 700.
- **JetBrains Mono** — **só código** (editor, trechos SQL/Python, saídas). Nunca para rótulos pequenos de interface.

Escala (mobile / desktop):

| Papel | Tamanho | Peso | Altura de linha |
|---|---|---|---|
| Número de destaque (sequência, XP) | 40 / 48 | 700 | 1.0 |
| Título de tela | 26 / 32 | 700 | 1.15 |
| Título de cartão | 20 / 22 | 600 | 1.25 |
| Corpo da lição | 17 / 18 | 400 | 1.55 |
| Secundário | 14 / 15 | 400 | 1.45 |
| Código | 15 / 15 | 400 | 1.6 |

Regras: frases em caixa normal (nada de rótulos em CAIXA ALTA); linha de leitura até 64 caracteres no cartão de lição; nenhum destaque de "uma palavra colorida" em títulos.

## 4. Forma e profundidade

- Raio por hierarquia: painéis de tela 24 px · cartões 16 px · chips 10 px · botões 14 px.
- **Botão tátil** (assinatura do Mimo/Duolingo, reinterpretada): botão principal tem uma "base" de 4 px mais escura embaixo (`box-shadow: 0 4px 0 <cor escurecida>`); ao pressionar, desce 4 px e a base some. Dá sensação física sem animação gratuita.
- Sem sombras cinzas genéricas; profundidade vem das superfícies `--placa` / `--placa-alta`.

## 5. Movimento

Só três momentos de movimento, todos respondendo a ação do usuário:
1. **Verificar resposta:** painel de feedback sobe de baixo (200 ms, ease-out); verde ou vermelho com ícone e texto (cor nunca sozinha).
2. **Conceito passou a "praticado":** a corrente percorre a trilha até o próximo chip (600 ms) e o chip acende. É o único momento "show".
3. **Fim da sessão:** contador de sequência sobe um número.

Com `prefers-reduced-motion`: troca tudo por mudança instantânea de estado.

## 6. Telas

### 6.1 Hoje (tela inicial)

```
┌───────────────────────────────┐
│ Domingo, 11 out               │
│                               │
│  Sequência  12 dias           │  ← número grande, Sora 700
│  ▮▮▮▮▮▮▯  meta da semana      │
│                               │
│ ┌───────────────────────────┐ │
│ │ Missão de hoje            │ │
│ │ SQL · GROUP BY e HAVING   │ │  ← chip âmbar (BD)
│ │ 25 min · 12 revisões      │ │
│ │                           │ │
│ │ [   Começar sessão    ]   │ │  ← botão tátil ciano, único CTA
│ └───────────────────────────┘ │
│  Só 10 minutos hoje           │  ← link discreto: dia mínimo
│                               │
│ AP de Banco de Dados em 15 d  │  ← aviso, só se houver
├───────────────────────────────┤
│ Hoje  Trilha  Revisar  Lab  Eu│  ← barra inferior (mobile)
└───────────────────────────────┘
```

### 6.2 Trilha de Circuito (assinatura)

```
        (BD)                         Legenda de estados
   ┌──────────┐                      □ bloqueado (cinza, sem trilha)
   │ SELECT   │■ dominado            ▣ disponível (contorno)
   └────┬─────┘                      ◪ apresentado
        │  ← trilha acesa (âmbar)    ■ praticado (aceso)
   ┌────┴─────┐                      ◉ dominado (aceso + brilho)
   │ WHERE    │■
   └────┬─────┘
        ├──────────────┐
   ┌────┴─────┐   ┌────┴──────┐
   │ GROUP BY │▣  │ JOIN      │□
   └──────────┘   └───────────┘
```

- Trilha vertical que se ramifica quando o grafo ramifica (pré-requisitos reais da tabela `prerequisito`).
- Trilhas em ângulos de 90° com cantos arredondados, como trilhas de PCB; pequenos "pads" circulares nas junções.
- Seletor de disciplina no topo (chips com a cor de cada uma).
- Tocar num chip abre um painel com: a lógica em uma frase, estado, último acerto e "Estudar agora".
- Desktop: o grafo inteiro em tela, com zoom; mobile: rolagem vertical.

### 6.3 Player de lição (tela cheia, sem barra inferior)

```
┌───────────────────────────────┐
│ ✕   ▰▰▰▱▱▱▱   (âmbar)         │  ← fechar + progresso segmentado
│                               │
│ Desafio                       │
│ Quantas respostas cada        │
│ disciplina recebeu?           │
│                               │
│ ┌───────────────────────────┐ │
│ │ SELECT disciplina_id, ___ │ │  ← JetBrains Mono
│ │ FROM respostas            │ │
│ │ ________ disciplina_id;   │ │
│ └───────────────────────────┘ │
│                               │
│ [COUNT(*)] [GROUP BY] [SUM]   │  ← chips para tocar (degrau 1)
│ [ORDER BY] [WHERE]            │
│                               │
├───────────────────────────────┤
│ [        Verificar        ]   │  ← fixo embaixo, desabilitado até responder
└───────────────────────────────┘
```

Painel de feedback (sobe por cima do botão):
- Certo: fundo `--placa-alta`, borda e ícone `--acerto`, frase curta do porquê, botão "Continuar".
- Errado: ícone `--erro`, o erro exato, botão "Explicar meu erro" (chama o tutor) e "Tentar de novo".

### 6.4 Tipos de item e sua interface

| Tipo | Interface |
|---|---|
| `flashcard` | Cartão que vira; botões FSRS: Errei · Difícil · Bom · Fácil |
| `certo_errado` | Afirmação + dois botões grandes "Certo" / "Errado"; justificativa no feedback |
| `completar` | Lacunas no código + chips para tocar |
| `parsons` | Linhas embaralhadas para arrastar na ordem |
| `preveja_saida` | Código + campo da saída esperada |
| `ache_o_erro` | Código com erro; tocar na linha errada |
| `sql` | Editor CodeMirror + "Executar" + tabela de resultado + "Verificar" |
| `python` | Editor + saída do console + testes (Fase 8) |
| `explique` | Campo de texto livre (3 linhas) avaliado pelo tutor |

A sequência dentro de uma lição sobe de degrau: tocar chips → completar → escrever do zero.

### 6.5 Laboratório

Editor SQL em tela larga com o banco da Apostila Viva carregado; painel lateral com o schema (tabelas e colunas clicáveis para inserir no editor); histórico das consultas.

### 6.6 Revisar

Fila FSRS do dia, intercalada entre disciplinas; contador "faltam 7"; ao fim, resumo de 3 linhas (o que mais errou).

## 7. Texto da interface

- Verbos claros: "Começar sessão", "Verificar", "Continuar", "Explicar meu erro", "Executar consulta".
- Erros dizem o que houve e como resolver: "Consulta com erro de sintaxe perto de `FORM`. Você quis dizer `FROM`?"
- Estados vazios convidam a agir: "Nenhuma revisão para hoje. Que tal uma lição nova?"
- Nada de "Uau!", "Incrível!" em todo acerto. Elogio raro e específico.

## 8. Checklist de qualidade (rodar a cada fase)

- [ ] Contraste AA em todo texto (inclusive `--texto-2` sobre `--placa`)
- [ ] Foco visível (anel `--corrente` 2 px)
- [ ] Alvos de toque ≥ 44 px
- [ ] Funciona em 390 px de largura sem rolagem horizontal
- [ ] `prefers-reduced-motion` respeitado
- [ ] Nenhum emoji, nenhum rótulo em caixa alta
- [ ] Cor de disciplina só onde carrega informação
