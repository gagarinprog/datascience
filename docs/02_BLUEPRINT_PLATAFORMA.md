# BLUEPRINT DA PLATAFORMA TUTORA
## Codinome: **DOMÍNIO** — a sua peça única de estudo em Ciência de Dados

> Objetivo: te levar do nível "fundamentos em construção" ao **domínio real** do conteúdo do curso, em sessões curtas e diárias, com o Claude como tutor, servindo ao mesmo tempo à **graduação**, a uma **transição de carreira** e aos **concursos de dados e TI**.
> Base: o mapa das disciplinas (`01_MAPA_DAS_DISCIPLINAS.md`), o histórico das nossas sessões e o que funciona em Mimo, Brilliant, Hyperskill, Anki/FSRS e Khan Academy (`03_REFERENCIAS_GITHUB_E_APPS.md`).

---

## 0. Respostas diretas às suas perguntas

**"É necessário te mandar a grade do curso?"**
Não. Eu já peguei a matriz oficial no Siscad (6 semestres, 2.400 h, todas as disciplinas e optativas) e os planos de ensino de tudo o que você cursa agora. Está no documento 01. A grade inteira já está no plano da plataforma, inclusive as matérias do 4º ao 6º semestre.

**"Como podemos avançar?"**
Em três movimentos, nesta ordem:

1. **Hoje, sem app nenhum:** o ciclo diário (seção 3) já roda aqui no chat do projeto CD. O estudo não espera o software.
2. **MVP em uma sessão de trabalho:** eu construo a versão 1 do DOMÍNIO como um app publicado no claude.ai (Opção A, seção 6), com revisão espaçada, missões, editor SQL de verdade e o Claude embutido para corrigir e explicar.
3. **Versão 2 como projeto de portfólio:** quando você terminar SQL (Etapa 3 da trilha), reconstruímos com Next.js + Supabase (a stack da Apostila Viva). Construir a versão 2 **é** estudo: Python, SQL, API, modelagem.

**Um aviso honesto.** Numa conversa anterior eu te desaconselhei construir uma plataforma "agora". O risco continua o mesmo: passar horas construindo ferramenta em vez de estudar. A diferença é que a Opção A custa pouco tempo seu (eu construo) e há uma regra que neutraliza o risco: **tempo de estudo é estudo; mexer no app só no sábado, em tempo de projeto.**

---

## 1. Para quem é (o perfil que a plataforma assume)

| Característica | Consequência no design |
|---|---|
| TDAH | Sessões curtas, uma única próxima ação visível, começo fácil, feedback imediato, nada de "tela em branco" |
| Pouco tempo | Ciclo base de 25 min; versão estendida de 45 min; nunca exige mais que isso para manter o progresso |
| Economista | Exemplos de cenário, oferta e demanda, séries de preço; estatística como ponto forte a explorar |
| Iniciante em código | Socrático com resposta obrigatória, código escrito por você, erro tratado como dado |
| Aprende visualmente | Diagramas ASCII, tabelas, árvores desenhadas passo a passo, visualizações interativas |
| Pediu sem emojis como marcador | Interface sóbria, hierarquia por tipografia e cor |
| Dados reais da Apostila Viva | Todo exercício de SQL, pandas e estatística usa o schema `usuarios / disciplinas / questoes / respostas` |
| Concurseiro | Modo Certo/Errado com justificativa, no estilo Cebraspe/Quadrix |

---

## 2. Princípios pedagógicos (e de onde vêm)

| # | Princípio | O que significa na prática | Inspiração |
|---|---|---|---|
| 1 | **Problema primeiro** | Toda lição abre com um desafio que você tenta antes da explicação | Brilliant |
| 2 | **Um conceito por vez** | Uma lição = um nó do grafo; 3 a 7 minutos | Mimo, Brilliant |
| 3 | **Exemplo resolvido → apoio que some** | Primeiro você vê; depois completa lacunas; depois escreve sozinho | Brilliant (fading), pesquisa de worked examples |
| 4 | **Recuperação ativa** | Lembrar de memória, nunca reler | Brilliant, Anki |
| 5 | **Revisão espaçada com FSRS** | O algoritmo decide quando cada carta volta, com base em dificuldade, estabilidade e retenção | open-spaced-repetition (FSRS) |
| 6 | **Intercalação** | A revisão mistura disciplinas, para você aprender a escolher a ferramenta | Brilliant, pesquisa cognitiva |
| 7 | **Domínio antes de avançar** | Um nó só libera os seguintes quando estiver "praticado" | Khan Academy, Hyperskill |
| 8 | **Teoria → prática imediata → projeto** | Cada conceito vira código no mesmo dia e entra num projeto | Hyperskill |
| 9 | **Socrático com resposta obrigatória** | O Claude não revela a resposta antes da sua tentativa; "não sei" vale | Nosso acordo |
| 10 | **Mapa antes do detalhe** | Toda sessão abre dizendo onde você está e o que vai saber no fim | Nosso acordo (você disse que se perde sem o mapa) |
| 11 | **Explicar em 3 linhas** | Fechamento com explicação própria, que o Claude avalia | Técnica de Feynman |
| 12 | **Hábito sem punição** | Sequência diária com "congelamento", meta mínima de 10 minutos que conta como dia cumprido | Duolingo, Mimo |

---

## 3. O ciclo diário

### 3.1 Sessão base (25 min)

```
┌────────────────────────────────────────────────────────────────────────┐
│ 0. MAPA (1 min)      Onde estou no grafo · missão de hoje · o que      │
│                      vou saber fazer no fim                            │
├────────────────────────────────────────────────────────────────────────┤
│ 1. AQUECIMENTO (5)   8 a 12 cartas da revisão FSRS, misturadas         │
├────────────────────────────────────────────────────────────────────────┤
│ 2. DESAFIO (3)       Um problema antes da explicação. Errar é previsto │
├────────────────────────────────────────────────────────────────────────┤
│ 3. CONCEITO (6)      Explicação curta + diagrama + exemplo resolvido   │
├────────────────────────────────────────────────────────────────────────┤
│ 4. PRÁTICA (8)       Você escreve: código, SQL ou item C/E.            │
│                      Sem IA, sem copiar. Correção automática           │
├────────────────────────────────────────────────────────────────────────┤
│ 5. FECHAMENTO (2)    Explique em 3 linhas → Claude avalia → as cartas  │
│                      novas entram na fila de revisão                   │
└────────────────────────────────────────────────────────────────────────┘
```

**Dia mínimo (10 min):** só os passos 0, 1 e 5. Conta como dia cumprido. É o que segura a sequência nos dias ruins.
**Dia estendido (45 min):** base + missão-âncora da disciplina (ver documento 01).

### 3.2 A semana

| Dia | Foco principal (passos 2 a 4) | Por quê |
|---|---|---|
| Seg | Python / Algoritmos II | Base de tudo |
| Ter | SQL / Banco de Dados | Ferramenta nº 1 |
| Qua | Estrutura de Dados | Liga Python e BD |
| Qui | GAAL (com NumPy) | Linguagem do ML |
| Sex | POO (Java e Python) ou o que estiver mais atrasado no AVA | Aprovação |
| Sáb | Projeto (missões-âncora) + tempo de construir o app | Transferência |
| Dom | Revisão longa + 20 itens C/E cronometrados + trilha sombra de Estatística | Concurso e retenção |

A revisão diária (passo 1) é sempre misturada, independente do foco do dia.

### 3.3 Modo prova

Nas duas semanas antes de cada Avaliação Presencial, o DOMÍNIO troca o foco para as disciplinas com AP próxima: os módulos liberados no AVA, os itens no estilo do checkout e um simulado por disciplina.

---

## 4. O modelo de domínio (como a plataforma sabe o que você sabe)

### 4.1 Grafo de conhecimento

Cada **conceito atômico** do documento 01 vira um **nó**. Cada pré-requisito vira uma **aresta**. Exemplo de um pedaço do grafo:

```
[variável] → [lista] → [laço for] → [função] → [arquivo: open/with] → [csv] → [pandas.read_csv]
                 │                                                      │
                 └────────► [dict] → [hash] → [índice hash de BD] ◄─────┘
[SELECT] → [WHERE] → [ORDER BY] → [GROUP BY] → [HAVING] → [JOIN] → [subconsulta] → [CTE] → [janela]
[vetor] → [produto escalar] → [norma] → [similaridade de cosseno] → [k-NN]
```

### 4.2 Estados de um nó

| Estado | Critério de entrada | Cor no mapa |
|---|---|---|
| Bloqueado | pré-requisito abaixo de "praticado" | cinza |
| Disponível | pré-requisitos ok | contorno |
| Apresentado | passou pela lição | azul claro |
| Praticado | 3 acertos sem ajuda, em pelo menos 2 dias diferentes | azul |
| Dominado | praticado + usado em código/SQL de verdade + explicação aprovada | verde |
| Retido | estabilidade FSRS acima de 21 dias | verde escuro |

Assim o painel mostra o seu domínio **real**, não a porcentagem do AVA.

### 4.3 Diagnóstico de entrada

Antes do primeiro dia: 20 minutos, 15 itens misturados (Python, SQL, ED, GAAL, representação de dados). O resultado posiciona você no grafo. Sem diagnóstico, a plataforma chuta, e chute é o que você pediu para eu evitar.

---

## 5. Os papéis do Claude

| Papel | Onde | O que faz |
|---|---|---|
| **Professor socrático** | Chat do projeto CD | Conduz o conceito novo, desenha os diagramas, faz perguntas com resposta obrigatória, aplica `/lento`, `/direto`, `/volta` |
| **Corretor** | Dentro do app | Lê o seu código ou a sua explicação e devolve: o que está certo, o erro exato e uma pergunta que te leva a corrigir sozinho |
| **Gerador de prática** | Dentro do app | Cria variações do mesmo exercício com outros dados (para você não decorar a resposta) |
| **Orientador** | Chat do projeto CD | No começo de cada sessão, lê o seu progresso salvo no app e escolhe a missão do dia |
| **Revisor de concurso** | Os dois | Itens C/E no estilo da banca, sempre com justificativa. Lei seca só a partir do texto oficial que você colar |

### 5.1 Prompt do tutor (usado pelo app nas correções)

```text
Você é o tutor do DOMÍNIO, plataforma pessoal de estudo de Ciência de Dados do Kaio
(UFMS, Tecnologia em Ciência dos Dados; economista; iniciante em programação; TDAH).

Regras invioláveis:
1. Nunca entregue a resposta completa antes de o Kaio tentar. Se ele errar, aponte
   o ERRO EXATO (linha, cláusula, conceito) e faça UMA pergunta que o leve a corrigir.
2. "Não sei" é resposta válida: responda com uma dica menor, nunca com a solução.
3. Respostas curtas: no máximo 6 linhas, a não ser que ele peça /direto.
4. Use diagramas ASCII ou tabelas quando ajudarem. Nada de emoji como marcador.
5. Exemplos sempre com o schema da Apostila Viva:
   usuarios(id, nome, email, criado_em)
   disciplinas(id, nome, banca)
   questoes(id, disciplina_id, enunciado, gabarito, dificuldade)
   respostas(id, usuario_id, questao_id, resposta, correta, respondida_em)
6. Erro recorrente conhecido: aspas em SQL (coluna com aspas, texto sem aspas).
   Se aparecer, nomeie o padrão: "é aquele erro das aspas de novo".
7. No fim, devolva também um JSON: {"acertou": bool, "conceitos": [...],
   "erro_tipo": "...", "proxima_dica": "..."}

Contexto desta tentativa:
- Conceito: {{conceito}}
- Enunciado: {{enunciado}}
- Resposta do Kaio: {{resposta}}
- Gabarito/critério: {{criterio}}
```

---

## 6. Arquitetura: duas opções

### Opção A — App publicado no claude.ai (recomendada para começar)

```
┌──────────────── claude.ai (abre no PC e no celular) ─────────────────┐
│  DOMÍNIO (um app HTML + JS publicado como artifact)                   │
│                                                                       │
│  Painel "Hoje" · Revisão FSRS · Lições em cartões · Editor SQL        │
│  (sql.js, banco da Apostila Viva no navegador) · Mapa de domínio      │
│                                                                       │
│  Capacidades da plataforma:                                           │
│   db     → guarda progresso, cartas, tentativas, diário               │
│   sample → chama o Claude de dentro do app (corrigir, explicar, gerar)│
│   user   → identifica você                                            │
└───────────────────────────────┬───────────────────────────────────────┘
                                │ o Claude do projeto CD lê e escreve
                                ▼ esses mesmos dados (progresso, cartas novas)
                        Chat do projeto CD (professor socrático)
```

| A favor | Contra |
|---|---|
| Zero servidor, zero chave de API, zero custo de infraestrutura | Depende do claude.ai |
| O Claude está embutido (botão "explique meu erro") | O app fica num único arquivo; fica difícil passar de certo tamanho |
| Eu, aqui no chat, leio o seu progresso e adapto a sessão | O código é meu, não seu (você aprende menos construindo) |
| Pronto em uma sessão de trabalho | Python no navegador (Pyodide) é pesado no celular |

### Opção B — App próprio (versão 2, projeto de portfólio)

| Camada | Escolha | Por quê |
|---|---|---|
| Front | Next.js (React) | Já é o mundo da Apostila Viva |
| Banco | Supabase (Postgres) | Você já usa; o schema da seção 8 roda direto |
| Revisão espaçada | `ts-fsrs` (ou `py-fsrs` no back) | Implementação oficial do FSRS |
| Python no navegador | Pyodide | Roda Python e pandas sem servidor |
| SQL no navegador | sql.js ou PGlite | Corrige consulta por resultado |
| Tutor | API da Anthropic (Claude) | Mesmo prompt da seção 5.1 |
| Mobile | PWA (instalável) | Sem loja de apps |

**Custo:** a API do Claude é paga por uso. Confirme o preço atual em docs.claude.com antes de decidir.

**Recomendação:** A agora. B quando você fechar a Etapa 3 (SQL) da trilha. Aí o DOMÍNIO v2 vira o seu "Projeto Integrador zero" e item de portfólio.

---

## 7. Funcionalidades

### 7.1 MVP (versão 1)

| # | Funcionalidade | Detalhe |
|---|---|---|
| 1 | **Painel "Hoje"** | Uma frase de mapa, uma missão, um botão "começar". Nada mais na tela |
| 2 | **Revisão FSRS** | Cartas dos 6 núcleos; botões "errei / difícil / bom / fácil" |
| 3 | **Lição em cartões** | Desafio → conceito → exemplo → prática; começa por SQL (fases 4 a 12 do seu roteiro) |
| 4 | **Editor SQL real** | Banco da Apostila Viva no navegador; corrige comparando o **resultado**, não o texto |
| 5 | **"Explique meu erro"** | O Claude responde com o prompt da seção 5.1 |
| 6 | **Mapa de domínio** | O grafo colorido pelos estados da seção 4.2 |
| 7 | **Diário de 3 linhas** | A explicação de fechamento, avaliada e guardada |
| 8 | **Contador AP** | Dias até cada Avaliação Presencial |

### 7.2 Depois do MVP

| Funcionalidade | Inspiração |
|---|---|
| Python no navegador com testes automáticos | Exercism, Hyperskill |
| Modo C/E cronometrado com estatística de acerto por assunto | Cebraspe/Quadrix |
| Exercício "ordene as linhas" (Parsons) e "preveja a saída" | Mimo |
| Visualizações manipuláveis (árvore AVL girando, heap subindo, vetor sendo projetado) | Brilliant, VisuAlgo |
| Gráfico de retenção e de carga de revisão | FSRS |
| Trilha sombra de Estatística (economia como contexto) | — |
| Leitura técnica em inglês (trechos da documentação do pandas) | Disciplina de Inglês |
| Exportar cartas para o Anki | Anki |

---

## 8. Modelo de dados (Postgres/Supabase, pronto para usar)

Na Opção A, cada tabela vira uma coleção do banco do app. Na Opção B, roda direto no Supabase. Bônus: ler e entender este schema já é exercício do Módulo 1 de Banco de Dados.

```sql
-- ===== Currículo =====
create table disciplina (
  id            text primary key,          -- 'BD', 'ED', 'ALG2', 'GAAL', 'POO', 'ICC'
  nome          text not null,
  semestre      int  check (semestre between 1 and 6),
  carga_horaria int,
  prioridade    char(1) check (prioridade in ('S','A','B','C','D'))
);

create table modulo (
  id            text primary key,          -- 'BD-M1U3'
  disciplina_id text not null references disciplina(id),
  titulo        text not null,
  liberado_ava  boolean default false,
  ordem         int
);

create table conceito (                    -- nó do grafo
  id          text primary key,            -- 'bd.normalizacao.2fn'
  modulo_id   text references modulo(id),
  nome        text not null,
  logica      text,                        -- "a lógica por trás" em uma frase
  ponte_ds    text,
  ponte_concurso text
);

create table prerequisito (                -- aresta do grafo
  conceito_id     text references conceito(id),
  depende_de_id   text references conceito(id),
  primary key (conceito_id, depende_de_id),
  check (conceito_id <> depende_de_id)
);

-- ===== Prática =====
create table item (
  id          uuid primary key default gen_random_uuid(),
  conceito_id text not null references conceito(id),
  tipo        text check (tipo in ('flashcard','certo_errado','sql','python',
                                   'parsons','preveja_saida','ache_o_erro','explique')),
  enunciado   text not null,
  gabarito    text,                        -- resposta, consulta-gabarito ou critério
  justificativa text,
  dificuldade int check (dificuldade between 1 and 5)
);

create table tentativa (
  id           uuid primary key default gen_random_uuid(),
  item_id      uuid not null references item(id),
  resposta     text,
  correta      boolean,
  usou_dica    boolean default false,
  erro_tipo    text,                       -- 'aspas', 'having_vs_where', ...
  feedback     text,                       -- devolvido pelo Claude
  feita_em     timestamptz default now()
);

-- ===== Memória (FSRS) =====
create table carta (
  item_id        uuid primary key references item(id),
  estabilidade   real,                     -- S do FSRS
  dificuldade    real,                     -- D do FSRS
  ultima_revisao timestamptz,
  proxima_revisao timestamptz,
  repeticoes     int default 0,
  lapsos         int default 0,
  estado         text default 'novo'       -- novo, aprendendo, revisao, reaprendendo
);

-- ===== Domínio e rotina =====
create table dominio (
  conceito_id text primary key references conceito(id),
  estado      text default 'bloqueado'
              check (estado in ('bloqueado','disponivel','apresentado',
                                'praticado','dominado','retido')),
  atualizado_em timestamptz default now()
);

create table sessao (
  id          uuid primary key default gen_random_uuid(),
  inicio      timestamptz default now(),
  fim         timestamptz,
  tipo        text check (tipo in ('minimo','base','estendido','prova')),
  foco        text references disciplina(id),
  explicacao_3_linhas text,
  nota_explicacao int check (nota_explicacao between 0 and 3)
);

-- ===== Consultas que o painel usa =====
-- Cartas para revisar hoje, intercaladas
select i.enunciado, i.tipo, c.proxima_revisao
from carta c join item i on i.id = c.item_id
where c.proxima_revisao <= now()
order by random()
limit 12;

-- Seu erro mais frequente nos últimos 30 dias
select erro_tipo, count(*) as vezes
from tentativa
where correta = false and feita_em > now() - interval '30 days'
group by erro_tipo
order by vezes desc
limit 3;

-- Conceitos que podem ser liberados (todos os pré-requisitos já praticados)
select c.id, c.nome
from conceito c
join dominio d on d.conceito_id = c.id and d.estado = 'bloqueado'
where not exists (
  select 1
  from prerequisito p
  join dominio dp on dp.conceito_id = p.depende_de_id
  where p.conceito_id = c.id
    and dp.estado not in ('praticado','dominado','retido')
);
```

---

## 9. Como o conteúdo é produzido

1. **Fonte:** os conceitos atômicos do documento 01 (já estão listados por disciplina).
2. **Para cada conceito**, eu gero: 1 lição (desafio, conceito, exemplo resolvido), 3 a 6 itens de tipos diferentes, 2 itens C/E com justificativa e as arestas de pré-requisito.
3. **Revisão de qualidade:** cada item passa pelo teste "dá para acertar sem decorar?". Se só dá para acertar decorando, o item volta.
4. **Fidelidade:** conteúdo do curso segue o que os slides e os planos dizem; o que for melhoria didática minha fica marcado como tal. Lei seca nunca é resumida nem inventada.
5. **Ordem de produção:** SQL (fases 4 a 12) → Python Etapa 1 → ED → GAAL → POO → Estatística.

---

## 10. Plano das próximas semanas

| Janela | Prioridade | Entregas |
|---|---|---|
| **Até as APs (o AVA mostra eventos em 26/10)** | Sobreviver às APs sem perder o fio | Revisão dos módulos liberados de BD, ED, GAAL e ALG II; 1 simulado por disciplina; ciclo base diário |
| Semana 1 em paralelo | Diagnóstico + MVP | Diagnóstico de 20 min; DOMÍNIO v1 publicado; 50 cartas iniciais (SQL e Python) |
| Semanas 3 a 6 | Python Etapa 1 completa + SQL fases 4 a 8 | Missões-âncora de ALG II e BD; trilha sombra de Estatística (descritiva) |
| Semanas 7 a 10 | SQL fases 9 a 12 + pandas (Etapa 2) + ED aplicada | Primeira análise completa dos dados da Apostila Viva (SQL → pandas → gráfico → 1 página de conclusões) |
| Semanas 11 a 12 | Revisão e consolidação | Mapa de domínio com os 6 núcleos em "praticado" ou acima; decisão sobre a Opção B |

O plano é refeito depois do diagnóstico. Nenhuma data aqui é promessa: é o ponto de partida.

---

## 11. O que eu preciso de você para começar

1. **Tempo real por dia:** quanto você consegue de verdade em um dia comum (10, 25 ou 45 minutos)?
2. **Datas das APs:** confirme no AVA se os eventos de 26/10 são as Avaliações Presenciais e de quais disciplinas.
3. **Decisão de arquitetura:** Opção A agora (recomendada) ou ir direto para a Opção B.
4. **Diagnóstico:** quando você disser "começar", eu aplico os 15 itens aqui no chat.

Com essas quatro respostas, eu construo o MVP e a primeira semana de conteúdo.
