# MAPA DEFINITIVO DAS DISCIPLINAS
## Tecnologia em Ciência dos Dados — UFMS Digital · Período 2026.2

> Documento-base da sua plataforma de estudos. Feito a partir da leitura dos slides das videoaulas, dos Planos de Ensino e dos Cronogramas publicados no AVA, mais a matriz curricular oficial (Siscad, curso 3290).
> Atualizado em 11/10/2026. Os módulos que o AVA ainda não liberou estão marcados como **[NÃO LIBERADO]**: ali, o conteúdo vem do Plano de Ensino, não dos slides.

---

## Sumário

0. [Como usar este documento](#0-como-usar-este-documento)
1. [Raio-X: onde você está de verdade](#1-raio-x-onde-você-está-de-verdade)
2. [O mapa de dependências (a lógica do curso inteiro)](#2-o-mapa-de-dependências)
3. [Prioridades: o que dominar primeiro e por quê](#3-prioridades)
4. [Algoritmos e Programação II](#4-algoritmos-e-programação-ii) (Python)
5. [Banco de Dados](#5-banco-de-dados)
6. [Estrutura de Dados](#6-estrutura-de-dados)
7. [Geometria Analítica e Álgebra Linear](#7-geometria-analítica-e-álgebra-linear)
8. [Programação Orientada a Objetos](#8-programação-orientada-a-objetos) (Java)
9. [Introdução a Conceitos de Computação](#9-introdução-a-conceitos-de-computação)
10. [Disciplinas de apoio](#10-disciplinas-de-apoio): Blockchain, Ética e Governança em IA, Dispositivos Móveis, Inglês, Gestão de Inovação, Empreendedorismo
11. [Lacunas críticas fora do período atual](#11-lacunas-críticas)
12. [Erros encontrados nos próprios slides](#12-erros-encontrados-nos-próprios-slides)
13. [Fontes oficiais](#13-fontes-oficiais)

---

## 0. Como usar este documento

Cada disciplina central segue sempre o mesmo formato, para o seu cérebro não ter que reaprender a navegar:

| Bloco | O que responde |
|---|---|
| **Ficha** | Professor, carga horária, livro-base, quanto você já avançou no AVA |
| **A lógica por trás** | A ideia-mãe da disciplina em um parágrafo. Se só der para lembrar de uma coisa, é esta |
| **O que os slides trazem** | Módulo a módulo, unidade a unidade |
| **Conceitos atômicos** | A lista de "cartas" que vão virar flashcards e nós do grafo de conhecimento da plataforma |
| **Pegadinhas** | Onde o aluno erra e onde a banca pega |
| **Ponte para Ciência de Dados** | Onde isso aparece no trabalho real |
| **Ponte para concurso** | Como a banca cobra, com itens de treino no estilo Certo/Errado (escritos por mim, não são questões reais de prova) |
| **Missão-âncora** | Um exercício prático usando a Apostila Viva como dado real |

> Regra de ouro para TDAH: não leia este documento de ponta a ponta. Ele é um **mapa**, não uma apostila. Você vai abrir a seção do dia, fazer a missão e fechar.

---

## 1. Raio-X: onde você está de verdade

### 1.1 O curso inteiro em uma tela

```
SEMESTRE 1 (feito)        SEMESTRE 2                 SEMESTRE 3                   SEMESTRE 4                       SEMESTRE 5                         SEMESTRE 6
─────────────────         ─────────────────          ─────────────────            ─────────────────                ─────────────────                  ─────────────────
Algoritmos e Prog. I      ★ Algoritmos e Prog. II    ★ Banco de Dados             Introdução a Ciência de Dados    Aplicações em Aprendizado Máquina  Aprendizado Profundo
Pensamento Computacional    Cálculo I  (falta)       ★ Estrutura de Dados         Mineração de Dados               Redes Neurais                      Computação Escalável
Matemática Básica           Estatística e Prob.(falta)★ GAAL                      Modelagem e Inferência Estat.    Visualização Computacional         IA: Fundamentos e Práticas
Leitura e Prod. Textos      Fundamentos de Web (falta)★ POO (Java)                Sistemas Computacionais          Projeto Integrador II              Projeto Integrador III
Ética, Cidadania e Soc.   ★ Inglês                     Formação Profissional      Projeto Integrador I             ★ Empreendedorismo e Inovação      Segurança da Informação
EAD e Sist. Inf. UFMS     ★ Intro. Conceitos Comput. ★ Gestão de Inovação
Vida, Cid. e Sustent.

★ = você está cursando em 2026.2      (falta) = disciplina do 2º semestre que não está no seu período atual
Optativas que você cursa: Blockchain e suas Aplicações · também: Desenv. para Dispositivos Móveis · Ética e Governança em IA
```

Dados oficiais: 6 semestres, 2.400 horas, 90 horas de atividades complementares, coordenação de Bianca de Almeida Dantas.

### 1.2 Seu progresso no AVA (no dia desta leitura)

| Disciplina | Progresso AVA | Leitura honesta |
|---|---|---|
| Gestão de Inovação e Desenv. de Produtos | 100% | Concluída |
| Empreendedorismo e Inovação | 100% | Concluída |
| Ética e Governança em IA | 97% | Quase concluída |
| Introdução a Conceitos de Computação | 97% | Quase concluída |
| Geometria Analítica e Álgebra Linear | 94% | Avançada no AVA, mas a matéria pesa |
| Blockchain e suas Aplicações | 93% | Quase concluída |
| Inglês | 90% | Quase concluída |
| Estrutura de Dados | 78% | Falta o Módulo 4 (desafios) |
| Banco de Dados | 76% | Falta o Módulo 4 (NoSQL) |
| Desenvolvimento para Dispositivos Móveis | 59% | Metade |
| Programação Orientada a Objetos | 39% | Atrás |
| **Algoritmos e Programação II** | **34%** | **Atrás, e é a base de tudo** |

> **Atenção de calendário:** o calendário do AVA mostra 5 eventos em **26/10**. Confira se são as Avaliações Presenciais. A AP tem peso maior que os checkouts dos módulos e a Prova Optativa não substitui a AP.

### 1.3 Diagnóstico de nível (sem enfeite)

O que as nossas sessões anteriores mostram:

- **Python:** você está no começo da Etapa 1 da trilha (tipos de dados, conversões). Ainda não escreve sozinho, sem consulta, um programa com função + laço + arquivo.
- **SQL:** você já fez SELECT, WHERE, ORDER BY/LIMIT. O erro que mais se repete é a **aspa**: aspas em nome de coluna, ou falta de aspas em texto.
- **Estrutura de Dados:** você viu hash e começou ABB em modo `/lento`. Partiu do zero em hash.
- **Álgebra Linear:** você resolveu atividades de diagonalização e de produto interno (traço de AᵀB), em parte com a resposta pronta no fim.
- **Seu ponto mais forte:** leitura econômica de cenário. Você sabe fazer a pergunta certa sobre o dado. É exatamente a parte que mais falta em cientista de dados júnior.

**Conclusão:** o AVA diz que você está entre 34% e 97% concluído. O seu domínio real está no nível "fundamentos em construção". Não é um problema: é o ponto de partida. O que não pode acontecer é a plataforma te tratar como se você estivesse onde o AVA diz.

---

## 2. O mapa de dependências

Esta é a lógica do curso inteiro. Cada seta quer dizer "sem a de cima, a de baixo não para de pé".

```
                         ┌──────────────────────────────┐
                         │  LÓGICA + PYTHON (ALG I/II)  │  ← tudo começa aqui
                         └──────────────┬───────────────┘
            ┌──────────────────┬────────┴─────────┬────────────────────┐
            ▼                  ▼                  ▼                    ▼
   ESTRUTURA DE DADOS     POO (Java no curso;   ARQUIVOS / CSV      COMPLEXIDADE O(·)
   hash, heap, árvores    Python no mercado)    (ALG II M1)         (ALG II M4)
            │                  │                  │                    │
            └────────┬─────────┘                  ▼                    │
                     ▼                    BANCO DE DADOS ◄─────────────┘
              ÍNDICES DE BD  ◄─────────── (modelagem, SQL, índices, transações)
              (hash e árvore B)                   │
                                                  ▼
   MATEMÁTICA BÁSICA ─► CÁLCULO I ─┐     INTRODUÇÃO A CIÊNCIA DE DADOS (pandas)
                                   │              │
   GAAL (vetores, matrizes, ───────┼──────────────┼──► MINERAÇÃO DE DADOS
   autovalores, produto interno)   │              │         │
                                   ▼              ▼         ▼
   ESTATÍSTICA E PROBABILIDADE ─► MODELAGEM E INFERÊNCIA ─► APRENDIZADO DE MÁQUINA ─► REDES NEURAIS ─► APRENDIZADO PROFUNDO
                                                                       │
                                                         VISUALIZAÇÃO ─┴─► PROJETOS INTEGRADORES
```

Três leituras que mudam o seu jeito de estudar:

1. **Estrutura de Dados explica Banco de Dados.** O índice hash de BD (Módulo 3) é a tabela de dispersão de ED (Módulo 1). O índice ordenado de BD é a árvore balanceada de ED (Módulo 3). Estude as duas juntas.
2. **GAAL é a linguagem do Machine Learning.** Um dataset é uma matriz. Uma linha é um vetor. Distância entre clientes é norma. PCA é autovalor. Regressão linear é sistema linear sem solução exata, resolvido por projeção.
3. **A maior lacuna não está no seu período.** Estatística e Probabilidade (2º semestre) não aparece em 2026.2 e é pré-requisito lógico de Modelagem e Inferência, Mineração e ML. A plataforma precisa adiantar esse conteúdo.

---

## 3. Prioridades

| Nível | Disciplina | Por quê | Peso no seu tempo |
|---|---|---|---|
| **S** | Algoritmos e Programação II | Base de tudo. Você está atrás (34%) | 30% |
| **S** | Banco de Dados | SQL é a ferramenta nº 1 do cientista de dados, e a mais cobrada em concurso de TI e de dados | 25% |
| **A** | Estrutura de Dados | Explica desempenho, índices e entrevistas técnicas | 15% |
| **A** | GAAL | Linguagem do ML; você já tem base de economista (matrizes, sistemas) | 15% |
| **B** | POO (Java) | Necessária para passar; no mercado de dados você usa POO em Python | 10% |
| **B** | Intro. Conceitos de Computação | Quase concluída; revisar só representação de dados (binário, ponto flutuante, ASCII/Unicode) | 3% |
| **C** | Ética e Governança em IA, Blockchain | Pouco tempo; ouro para concurso (LGPD, governança, IA responsável) | 2% |
| **D** | Inglês, Gestão de Inovação, Empreendedorismo, Dispositivos Móveis | Só o necessário para a aprovação | resto |

> **Prioridade paralela, fora do período:** Estatística (ver seção 11). Entra como "trilha sombra" de 15 minutos, 3 vezes por semana.

---

## 4. Algoritmos e Programação II

### Ficha

| Item | Dado |
|---|---|
| Professor | Prof. Dr. Rafael dos Passos Canteri |
| Carga horária | 75 h · 2º semestre |
| Linguagem | Python |
| Livros-base | Banin (*Python 3: conceitos e aplicações*), Perkovic (*Introdução à computação usando Python*), Szwarcfiter (*Estruturas de dados e seus algoritmos*) · complementares: Cormen, Forbellone (lógica com Python) |
| Progresso AVA | 34% (liberado só o Módulo 1 e a videoaula do Módulo 2) |

### A lógica por trás

> Algoritmos I ensinou o computador a **fazer coisas**. Algoritmos II ensina a **organizar** as coisas que ele guarda e a **medir** o custo de fazer cada uma.

Em uma frase: você deixa de pensar em "variáveis soltas" e passa a pensar em **estruturas** (registros, listas, pilhas, filas), em **persistência** (arquivos), em **custo** (complexidade) e em **estratégia** (recursão, ordenação). É literalmente a passagem de "escrever código" para "projetar algoritmos".

### O que os slides trazem

**Módulo 1 — Variáveis compostas e arquivos**

- **U1 Variáveis compostas heterogêneas.** O slide abre com um problema concreto: um programa para academia que guarda nome, sexo, idade, peso, altura e nível de treino, calcula o IMC e agrupa por categoria. Depois classifica as variáveis em três tipos:

  | Tipo | Quantos valores | Tipos de dado | Exemplo |
  |---|---|---|---|
  | Simples homogênea | um | um | `idade = 22` |
  | Composta homogênea | vários | todos iguais | vetor/lista de notas |
  | Composta heterogênea | vários | diferentes | registro (C/Pascal), classe/objeto (Python/Java) |

  Em Python a ferramenta é a **classe**: `class Aluno` com `__init__(self, nome, sexo, idade, peso, altura)`, depois `aluno1 = Aluno("Guilherme", 'M', 22, 80.5, 1.82)`. Metáfora do slide: a classe é a planta, o objeto é o produto.

- **U2 Manipulação de arquivos.** Arquivo é uma coleção de dados tratada como unidade e guardada em memória secundária (HD, SSD). Ler um arquivo = copiar do disco para a RAM. Gravar = o caminho inverso. Arquivo texto (sequência de caracteres, portátil) × binário (bytes). Funções: `open`, `close`, `with open(...) as`, `read`, `readline`, `readlines`, `write`, `writelines`. Tabela dos modos:

  | Modo | Faz | Se existe | Se não existe |
  |---|---|---|---|
  | `'r'` | só leitura | lê do começo | **erro** |
  | `'w'` | escrita | **apaga tudo** | cria |
  | `'a'` | acrescenta no fim | preserva | cria |

  Boas práticas: sempre `with`, sempre `try/except FileNotFoundError`, nunca caminho absoluto (`os.path.join`).

**Módulo 2 — Memória e manipulação de listas** **[videoaula liberada, slides não]**
U1 Gerenciamento de memória · U2 Manipulação de listas.

**Módulo 3 — Estruturas de dados** **[NÃO LIBERADO]**
U1 Listas lineares · U2 Pilhas e filas.

**Módulo 4 — Noções de eficiência e recursividade** **[NÃO LIBERADO]**
U1 Análise de complexidade · U2 Algoritmos recursivos.

**Módulo 5 — Algoritmos de ordenação** **[NÃO LIBERADO]**
U1 Ordenação básica (bolha, seleção, inserção) · U2 Ordenação sofisticada (merge sort, quick sort, e provavelmente heap sort).

### Conceitos atômicos

`variável simples` · `composta homogênea` · `composta heterogênea` · `classe` · `objeto/instância` · `__init__` · `self` · `atributo de instância` · `memória primária × secundária` · `arquivo texto × binário` · `modos r/w/a` · `with` (gerenciador de contexto) · `readline × readlines` · `strip()` · `try/except` · `os.path.join` · `referência × cópia` · `mutável × imutável` · `lista encadeada` · `pilha (LIFO)` · `fila (FIFO)` · `O(1), O(n), O(n²), O(log n)` · `caso base e caso recursivo` · `pilha de chamadas` · `ordenação estável` · `dividir para conquistar`

### Pegadinhas

- `open("x.txt", "w")` **apaga o arquivo existente** sem avisar. Erro clássico de iniciante e de prova.
- `readlines()` devolve as linhas **com** o `\n` no fim. Por isso o slide usa `linha.strip()`.
- Modo `'r'` em arquivo inexistente gera `FileNotFoundError`. Nos modos `'w'` e `'a'`, o arquivo é criado.
- O slide escreve `sexo` como "Char": em Python não existe tipo char, `'M'` é uma `str` de tamanho 1.
- Em Python, `b = a` com lista **não copia**: os dois nomes apontam para o mesmo objeto (é o que o Módulo 2 vai explicar).

### Ponte para Ciência de Dados

| Conceito de ALG II | Onde aparece no trabalho |
|---|---|
| Composta heterogênea (classe) | Uma **linha** de DataFrame; um registro JSON de API; `@dataclass` |
| Composta homogênea | Uma **coluna** de DataFrame; `np.array` (por isso `np.array([1, 2, "três"])` converte tudo para texto) |
| Arquivos | Ler CSV, JSON, Parquet; `pd.read_csv` é um `open` + parser |
| Complexidade | Por que um `for` sobre 1 milhão de linhas é lento e a operação vetorizada do pandas é rápida |
| Recursão | Árvores de decisão; percorrer JSON aninhado |
| Ordenação | `ORDER BY`, `sort_values`, ranking, mediana |

### Ponte para concurso

Lógica de programação e estruturas de dados aparecem em cargos de TI (Cebraspe, FGV, Cesgranrio, Quadrix) quase sempre como **análise de trecho de código** ou **complexidade**. Itens de treino:

1. (C/E) Ao abrir em modo de escrita (`'w'`) um arquivo que já existe, o Python acrescenta o novo conteúdo ao final do conteúdo anterior. → **Errado.** O modo `'w'` sobrescreve; quem acrescenta é o `'a'`.
2. (C/E) Uma pilha segue a política LIFO, em que o último elemento inserido é o primeiro removido. → **Certo.**
3. (C/E) A busca binária em vetor ordenado de n elementos tem complexidade de pior caso O(n). → **Errado.** É O(log n).

### Missão-âncora (Apostila Viva)

> Crie `class Questao` com `id`, `disciplina`, `enunciado`, `gabarito` (`'C'` ou `'E'`) e `dificuldade` (1 a 5). Grave 5 questões em `questoes.csv` usando `with open(..., 'w')`. Depois leia o arquivo, monte uma lista de objetos e imprima a média de dificuldade por disciplina. **Sem IA, sem copiar.**

---

## 5. Banco de Dados

### Ficha

| Item | Dado |
|---|---|
| Professor | Prof. Dr. Márcio Aparecido Inacio da Silva |
| Carga horária | 60 h · 3º semestre |
| Livros-base | Elmasri & Navathe (*Sistemas de banco de dados*, 7ª ed.) · Heuser (*Projeto de banco de dados*) · Silberschatz (*Sistema de banco de dados*) · apoio: documentação PostgreSQL, MySQL, MongoDB, Cassandra, Neo4j, Redis |
| Esquema didático | **EMPRESA**: FUNCIONARIO, DEPARTAMENTO, PROJETO, DEPENDENTE, TRABALHA_EM, LOCALIZAÇÕES |
| Progresso AVA | 76% (falta o Módulo 4, NoSQL) |

### A lógica por trás

> Um banco de dados existe para que **muitos programas e muitas pessoas** usem **os mesmos dados**, ao **mesmo tempo**, **sem estragá-los** e **sem precisar saber como estão guardados no disco**.

Cada módulo resolve um pedaço dessa frase:

```
"sem precisar saber como estão guardados" → independência de dados, catálogo (M1U1)
"os mesmos dados, sem redundância"        → modelagem ER e normalização (M1U2 a M1U4)
"conversar com os dados"                  → SQL: DDL e DML (M2)
"rápido"                                  → índices (M3U1)
"só quem pode"                            → segurança, GRANT/REVOKE (M3U1)
"ao mesmo tempo, sem estragar"            → transações, ACID, bloqueios (M3U2)
"e quando o dado não cabe em tabela?"     → NoSQL (M4)
```

### O que os slides trazem

**Módulo 1 — Projeto de Banco de Dados Relacional**

- **U1 Visão geral e motivação.** Começa pela história: programas antigos gravavam dados em estruturas próprias, então mudar a estrutura obrigava a mudar todos os programas. A solução foi um sistema intermediário que conhece a estrutura e entrega a cada programa só o que ele precisa: o **SGBD** (o primeiro comercial surgiu na década de 1960). Conceitos: banco de dados (coleção coerente, que representa um **minimundo**), metadados e **catálogo** (o banco descreve a si mesmo), **independência de dados**, abstração, **múltiplas visões**, concorrência (OLTP), redundância controlada (normalização × desnormalização por desempenho), segurança, índices, buffering, otimização de consulta, backup e recuperação, gatilhos e procedimentos armazenados. Papéis: DBA, projetista (administrador de dados), analistas e programadores, usuário final. **Esquema** (estrutura, muda pouco) × **instância** (estado/snapshot, muda o tempo todo). DDL × DML: o SQL junta as duas.

- **U2 Modelo conceitual (MER/DER).** Exemplo EMPRESA. Elementos: **entidade** (retângulo), **atributo** (elipse: simples × composto, mono × multivalorado, armazenado × derivado), **atributo-chave** e restrição de unicidade, **entidade fraca** (chave parcial, depende de uma forte), **relacionamento** (losango: TRABALHA_PARA, GERENCIA, CONTROLA, DEPENDE_DE, TRABALHA_EM, SUPERVISIONA), **grau** (binário, ternário: FORNECEDOR fornece PEÇA para PROJETO, n-ário), **cardinalidade** (1:1, 1:N, M:N, recursivo), **participação** total (linha dupla) × parcial, atributo de relacionamento (`dt_inicio`, `horas`), notação mín-máx (1,1), (4,N), (0,1). **EER**: especialização × generalização, disjunção (d) × sobreposição (o).

- **U3 Modelo relacional e mapeamento.** Glossário: relação = tabela, tupla = linha, atributo = coluna, domínio = tipo. Esquema `R(A1, …, An)`, grau, `t[Ai]`. Valores atômicos e NULL. Hierarquia das chaves: **superchave ⊇ chave (mínima) → candidatas → primária + únicas**. Integridade de entidade (PK nunca NULL) e **integridade referencial** (FK aponta para PK existente, ou é NULL). **As regras de mapeamento ER → relacional:**

  | No MER | Vira no relacional |
  |---|---|
  | Entidade forte | Tabela com atributos simples; PK = chave |
  | Atributo multivalorado | **Nova tabela** (atributo + PK do dono); PK composta |
  | Entidade fraca | Tabela com FK da forte; PK = PK da forte + chave parcial |
  | 1:1 | FK de um lado (de preferência o de participação total). Alternativas: tabela unificada; tabela de referência cruzada |
  | 1:N | FK **no lado N** |
  | M:N | **Nova tabela** com as duas FKs; PK composta |
  | n-ário | Nova tabela com todas as FKs |
  | Especialização | 4 opções: superclasse + subclasses; só subclasses; tabela única com 1 atributo tipo; tabela única com vários atributos tipo |

- **U4 Qualidade do projeto (normalização).** **Dependência funcional** X → Y: se duas tuplas concordam em X, concordam em Y. Não é simétrica. Vem do conhecimento do mundo real, não dos dados de exemplo. Formas normais:

  | Forma | Exige | Elimina |
  |---|---|---|
  | **1FN** | só valores atômicos | atributo multivalorado ou relação dentro de relação |
  | **2FN** | 1FN + todo atributo não primo depende da chave **inteira** | dependência **parcial** de chave composta |
  | **3FN** | 2FN + nenhum não primo depende de outro não primo | dependência **transitiva** |
  | **BCNF** | todo determinante é superchave | sobras da 3FN (exemplo LOTES: `area → estado`) |

  Propriedades da decomposição: **junção sem perdas** (obrigatória) e preservação de dependências (desejável; a BCNF pode perder uma DF, como o slide mostra).

**Módulo 2 — Definição e manipulação de dados**

- **U1 DDL.** SQL é padrão ANSI/ISO; o slide indica a documentação do PostgreSQL 17 e do MySQL 9. `CREATE DOMAIN` (ex.: `TIPO_CPF AS CHAR(4)`; `D_NUM INTEGER CHECK (D_NUM > 0 AND D_NUM < 21)`), `CREATE TABLE` com `VARCHAR`, `DATE`, `DECIMAL(10,2)`, `BOOLEAN`. Restrições: `NOT NULL`, `DEFAULT`, `CHECK`, `PRIMARY KEY`, `UNIQUE`, `FOREIGN KEY` com `ON DELETE/ON UPDATE` → `SET NULL`, `CASCADE`, `SET DEFAULT` (o padrão é rejeitar). **Dependência circular:** FUNCIONARIO referencia a si mesmo (`supcpf`) e a DEPARTAMENTO, que ainda não existe. Solução: criar sem a FK e depois `ALTER TABLE ... ADD CONSTRAINT`. `DROP ... CASCADE` × `RESTRICT`. `CASCADE` é adequado para tabelas de relacionamento (TRABALHA_EM), multivalorados (LOCALIZAÇÕES) e entidades fracas (DEPENDENTE).

- **U2 DML.** `INSERT` (com e sem lista de colunas), `UPDATE ... SET ... WHERE`, `DELETE` (sem `WHERE` apaga tudo). `SELECT–FROM–WHERE` com 14 consultas graduadas: junção pelo `WHERE`, qualificação `TABELA.coluna`, apelido e **autojunção** (funcionário × supervisor), `ALL` × `DISTINCT`, `UNION / EXCEPT / INTERSECT` (com `ALL` mantém duplicatas), `LIKE` com `%` e `_`, `ORDER BY`, `IS NULL`, `JOIN ... ON`, `SUM/MAX/MIN/AVG`, `GROUP BY ... HAVING`, subconsulta no `WHERE` (salário acima da média), **subconsulta correlacionada** no `SELECT` (número de dependentes), `IN`, `= ANY/SOME`, `> ALL`, `<= ALL`, `EXISTS/NOT EXISTS`.

**Módulo 3 — Bancos de dados relacionais**

- **U1 Indexação e segurança.** Problema: varrer a tabela inteira para achar um registro. Solução: **índice**, como o índice remissivo de um livro. Chave de busca ≠ chave primária; uma tabela pode ter vários índices. **Ordenado × hash** (hash só serve bem para igualdade). Critérios de avaliação: tipo de acesso (igualdade ou intervalo), tempo de acesso, de inserção, de exclusão, espaço extra. Entrada de índice = chave + ponteiro (bloco + deslocamento). **Denso** (uma entrada por valor) × **esparso** (só algumas; exige arquivo ordenado; acha a maior chave ≤ procurada e varre). Compromisso clássico: esparso com uma entrada por **bloco**, porque o custo dominante é trazer o bloco do disco. Manutenção: todo `INSERT/DELETE/UPDATE` atualiza todos os índices afetados. Segurança: ameaças (roubo e fraude, confidencialidade, integridade, disponibilidade), controle **discricionário** × **mandatório**, `PUBLIC`, dono do objeto, `WITH GRANT OPTION`, **papéis** (`CREATE ROLE vendedor; GRANT vendedor TO joao;`, papel dentro de papel), `GRANT/REVOKE` inclusive por coluna.

- **U2 Transações e concorrência.** Transação = unidade lógica de trabalho (transferência bancária). `read_item(X)` e `write_item(X)` via buffer. Fim: `COMMIT`/`ROLLBACK`; DDL e DCL fazem commit automático; desconectar faz commit; falha faz rollback. **ACID** e quem garante cada letra:

  | Propriedade | Significa | Quem garante |
  |---|---|---|
  | **A**tomicidade | tudo ou nada | SGBD (transações + recuperação) |
  | **C**onsistência | de estado válido para estado válido | **o programador** |
  | **I**solamento | cada transação "acha que está sozinha" | controle de concorrência |
  | **D**urabilidade | commit sobrevive a falha | recuperação, memória não volátil |

  Schedule (plano de execução intercalado). Os **4 problemas**: atualização perdida, leitura suja (atualização temporária), resumo incorreto, leitura não repetível (exemplo da reserva aérea). Serializabilidade. Bloqueio compartilhado (S) × exclusivo (X) e a matriz de compatibilidade (só S com S é compatível). **Deadlock**. **2PL** (fase de expansão e fase de encolhimento): garante serializabilidade, **não** evita deadlock. Prevenção: bloquear tudo antes; **wait-die** (a mais velha espera, a mais nova morre); **wound-wait** (a mais velha fere a mais nova, a mais nova espera). Detecção e recuperação.

**Módulo 4 — NoSQL** **[NÃO LIBERADO]**
U1 Introdução ao NoSQL · U2 Orientado a documentos e outros SGBDs (a bibliografia de apoio indica MongoDB, Cassandra, Neo4j e Redis: documento, coluna larga, grafo e chave-valor).

### Conceitos atômicos

`SGBD` · `minimundo` · `metadados/catálogo` · `independência de dados` · `esquema × instância` · `DDL × DML × DCL` · `entidade forte/fraca` · `atributo composto/multivalorado/derivado` · `cardinalidade` · `participação total/parcial` · `grau do relacionamento` · `especialização d/o` · `superchave` · `chave candidata` · `PK` · `FK` · `integridade de entidade` · `integridade referencial` · `regras de mapeamento` · `dependência funcional` · `atributo primo` · `DF parcial` · `DF transitiva` · `1FN/2FN/3FN/BCNF` · `junção sem perdas` · `CREATE DOMAIN` · `constraints` · `ON DELETE CASCADE` · `dependência circular + ALTER` · `autojunção` · `GROUP BY × HAVING` · `subconsulta correlacionada` · `EXISTS` · `ANY/ALL` · `índice denso/esparso` · `índice hash × ordenado` · `GRANT/REVOKE/ROLE` · `transação` · `ACID` · `schedule` · `4 anomalias` · `bloqueio S/X` · `2PL` · `deadlock` · `wait-die × wound-wait`

### Pegadinhas

- **Sua pegadinha pessoal:** `'texto'` entre aspas simples; nome de coluna **sem** aspas; número sem aspas. `WHERE 'nome' = 'Kaio'` compara dois textos e nunca acessa a coluna.
- `WHERE` filtra **linhas antes** de agrupar; `HAVING` filtra **grupos depois**. Agregação no `WHERE` é erro.
- `COUNT(*)` conta linhas; `COUNT(coluna)` ignora NULL.
- `NULL = NULL` não é verdadeiro: usa-se `IS NULL`.
- Consistência (o C do ACID) é responsabilidade do **programador**. Banca adora inverter.
- 2PL garante serializabilidade e **não** garante ausência de deadlock.
- Índice esparso **exige** arquivo ordenado pela chave de busca.
- 2FN só faz sentido com chave **composta**: tabela com PK simples e em 1FN já está em 2FN.

### Ponte para Ciência de Dados

- 60 a 80% do trabalho real é tirar e limpar dado, e isso é SQL: `JOIN`, `GROUP BY`, subconsulta, depois CTEs e funções de janela (próximas fases do seu roteiro).
- Normalização explica por que o analista recebe dados **espalhados em várias tabelas**, e desnormalização explica o **data warehouse** (modelagem dimensional, cobrada em concurso).
- Índices explicam por que a sua consulta no Supabase da Apostila Viva fica lenta quando a tabela `respostas` crescer.
- Transações explicam por que um pipeline que grava pela metade corrompe o dataset.

### Ponte para concurso

Banco de dados é o bloco mais cobrado em cargos de TI e de dados. Num levantamento de provas de TI de controle do Cebraspe (Estratégia Concursos), "bancos de dados relacionais" e "modelagem dimensional" estão entre os assuntos mais frequentes, junto com mineração de dados e "dado, informação, conhecimento e inteligência". Itens de treino:

1. (C/E) Em uma relação na 2FN, nenhum atributo não primo pode ter dependência funcional parcial de uma chave candidata. → **Certo.**
2. (C/E) A propriedade de consistência das transações é garantida exclusivamente pelo módulo de controle de concorrência do SGBD. → **Errado.** É do programador. Isolamento é do controle de concorrência.
3. (C/E) A cláusula HAVING pode ser usada para filtrar grupos formados pelo GROUP BY com base em funções de agregação. → **Certo.**
4. (C/E) No mapeamento de um relacionamento M:N para o modelo relacional, basta incluir a chave primária de uma das entidades como chave estrangeira na outra. → **Errado.** M:N exige uma nova relação.

### Missão-âncora (Apostila Viva)

> Com as tabelas `usuarios`, `disciplinas`, `questoes`, `respostas`: (1) desenhe o DER e diga a cardinalidade de cada relacionamento; (2) escreva a consulta "taxa de acerto por disciplina, só disciplinas com mais de 10 respostas, da maior para a menor"; (3) diga que índice você criaria para ela e por quê.

---

## 6. Estrutura de Dados

### Ficha

| Item | Dado |
|---|---|
| Professores | Prof.ª Dr.ª Graziela Santos de Araújo, Prof. Dr. Jonathan de Andrade Silva (o plano lista também Gedson Faria) |
| Carga horária | 60 h · 3º semestre |
| Linguagem | Python (implementação de ABB com nós ligados) |
| Livros-base | Ziviani, Szwarcfiter, Cormen, Borin · apoio: Lambert (*Fundamentos de Python*), Stallings (*Criptografia*) |
| Ferramenta indicada | **VisuAlgo** (visualização das árvores) |
| Progresso AVA | 78% (falta o Módulo 4) |

### A lógica por trás

> Toda estrutura de dados é uma **troca**: você paga em memória, em complexidade de código ou em custo de inserção para **ganhar velocidade** na operação que mais importa.

A disciplina é uma escada. Cada degrau resolve o defeito do anterior:

```
Vetor pequeno  → busca O(n), tamanho fixo
Vetor gigante  → busca O(1), memória cara
Lista ligada   → memória sob demanda, busca O(n)
      │  "quero O(1) sem desperdiçar memória"
      ▼
HASH           → O(1) médio. Defeito: não sabe quem é o maior, nem dar ordem
      │  "quero o maior/menor rápido"
      ▼
HEAP           → máximo em O(1), inserir/remover em O(log n). Defeito: só sabe o topo
      │  "quero buscar qualquer um e manter a ordem"
      ▼
ABB            → busca, insere e remove em O(log n)... se estiver equilibrada. Defeito: pode degenerar em O(n)
      │  "quero garantir O(log n) sempre"
      ▼
AVL            → rotações mantêm |fb| ≤ 1 → O(log n) garantido
      │
      ▼
DESAFIOS       → hash criptográfico, código de Huffman (árvore)
```

### O que os slides trazem

**Módulo 1 — Hash e Heap**

- **U1 Tabelas de dispersão.** Motivação com 10 inteiros entre 0 e 999 e as três estratégias da escada acima. Definições: `d` dado, `k` chave/posição de 0 a M−1, `T` tabela, `M` tamanho (idealmente **primo**), `F` função: `F(d) = k` e `T[k] = d`. Funções perfeitas × imperfeitas (aceitável × inaceitável). Uma boa função é rápida, espalha uniformemente e usa informação relevante do dado. **Strings:** somar códigos ASCII faz anagramas colidirem (LOS e OSL dão o mesmo valor). Correção: ponderar pela posição, `c·aᵖ` com `a` primo. Métodos: **divisão** `d % M` (exemplo M=7: 3, 14, 27, 65, 99 → 3, 0, 6, 2, 1; e por que M par concentra os pares), **multiplicação** `M·((d·A) % 1)` com A ≈ 0,618, **dobra** (1234 → 55 → 0). **Fator de carga** = chaves / M. As videoaulas 2 e 3 tratam colisões (encadeamento e endereçamento aberto).
- **U2 Heap.** Fila de prioridade (triagem num posto de saúde: fita verde, amarela, vermelha). Max-heap × min-heap. Árvore binária quase completa guardada em **vetor**: `FE = 2i+1`, `FD = 2i+2`, `pai = ⌊(i−1)/2⌋`. Inserir: coloca no fim e **sobe** trocando com o pai. Remover o máximo: a raiz recebe o último e **desce** trocando com o maior filho. N nós → ⌊log₂N⌋+1 níveis → **O(log n)**. Pseudocódigos `Inserir`, `VerificarInsercao`, `ExtrairMax`, `VerificarRemocao`, `EncMaior`.

**Módulo 2 — Árvore Binária de Busca**

- **U1 Conceitos, inserção e busca.** Busca linear × **binária** (V = [1,3,5,7,9,11,13], procurar 15 leva 3 passos), mas manter o vetor ordenado é caro. Daí a ABB: **esquerda < nó < direita**. Altura = níveis − 1. A forma depende da **ordem de inserção** (no VisuAlgo, [1,2,3,4,7,8] vira uma árvore degenerada e [4,2,7,1,3,8] vira uma árvore equilibrada). Tipos: degenerada, quase completa, completa/cheia, estritamente binária. Busca iterativa, busca que devolve o pai, inserção (sempre cria uma folha). Pior caso O(n), equilibrada O(log n). Parte II: implementação em Python com nós (`fe`, `fd`) e funções `conectar`, `buscar`, `inserir`, depois a classe `ABB`.
- **U2 Percurso e remoção.** Remoção em 3 casos: folha (some), 1 filho (o avô adota o neto), 2 filhos (troca pelo **antecessor**, o mais à direita da subárvore esquerda, ou pelo **sucessor**, o mais à esquerda da subárvore direita, e remove recursivamente). Percursos com a sequência 4,2,6,1,3,5,7: pré-ordem [4,2,1,3,6,5,7], **em-ordem [1..7], sempre ordenado**, pós-ordem [1,3,2,5,7,6,4]. Análise: nível M tem 2^(M−1) nós, total 2^M − 1, altura h = log₂(N+1) − 1 (N = 15 → h = 3).

**Módulo 3 — Árvores balanceadas**

- **U1 AVL e rotações.** AVL (1962), Rubro-Negra (1978), Splay (1985). AVL: Adelson-Velsky e Landis. Fator de balanceamento `fb = h(esq) − h(dir)`, balanceada se `|fb| ≤ 1` (altura da árvore vazia = −1). Rotações simples (RE, RD) e duplas (RED, RDE) com pseudocódigo. **Regra de decisão:**

  | fb do nó | fb do filho do lado pesado | Rotação |
  |---|---|---|
  | −2 | −1 (mesmo sinal) | RE simples à esquerda |
  | +2 | +1 (mesmo sinal) | RD simples à direita |
  | +2 | −1 (sinais diferentes) | RED dupla (esquerda no filho, direita no nó) |
  | −2 | +1 (sinais diferentes) | RDE dupla (direita no filho, esquerda no nó) |

- **U2 Inserção e remoção.** Campo `pai` no nó; `atualizarFBIns` sobe do nó inserido até a raiz ou até achar `fb = 0`; `verificarRotacao`. Remoção = inverter os sinais (remover de um lado equivale a inserir do outro). Exercício no VisuAlgo: inserir 5,3,8,2,4,7,10,1,6,9,11,12 e remover 4.

**Módulo 4 — Desafios de programação**
U1 Aplicações usando hash (o slide é um vídeo; na nossa sessão anterior: hash criptográfico) · U2 Aplicações usando árvores **[NÃO LIBERADO]** (código de Huffman).

### Conceitos atômicos

`função de dispersão` · `colisão` · `fator de carga` · `M primo` · `método da divisão/multiplicação/dobra` · `encadeamento × endereçamento aberto` · `fila de prioridade` · `max-heap/min-heap` · `heap em vetor (2i+1, 2i+2, ⌊(i−1)/2⌋)` · `sift-up/sift-down` · `busca binária` · `propriedade da ABB` · `altura × nível` · `árvore degenerada` · `antecessor/sucessor` · `3 casos de remoção` · `pré/em/pós-ordem` · `h = log₂(N+1) − 1` · `fator de balanceamento` · `RE/RD/RED/RDE` · `regra dos sinais` · `campo pai`

### Pegadinhas

- Percurso **em-ordem** de uma ABB devolve os valores **ordenados**. É o teste mais rápido para ver se uma árvore é ABB.
- Heap não é ABB: no heap o pai é maior que **os dois** filhos; não há ordem entre irmãos.
- ABB tem O(log n) **só se equilibrada**. Inserir dados já ordenados gera uma lista (O(n)).
- Rotação dupla quando os sinais são **diferentes**; simples quando são **iguais**.
- Hash com M par e chaves pares: tudo cai nas posições pares. Por isso M primo.

### Ponte para Ciência de Dados

- `dict` e `set` do Python são tabelas hash: por isso `x in set` é O(1) e `x in list` é O(n).
- `GROUP BY` e `merge` do pandas usam hash por baixo.
- `heapq` resolve "top-k" (os 10 alunos com mais erros) sem ordenar tudo.
- Árvores de decisão e Random Forest são árvores; índices de banco são árvores B (parentes da AVL).

### Ponte para concurso

1. (C/E) O percurso em ordem simétrica (em-ordem) de uma árvore binária de busca visita as chaves em ordem crescente. → **Certo.**
2. (C/E) Em uma árvore AVL, o fator de balanceamento de qualquer nó pode assumir apenas os valores −1, 0 ou 1. → **Certo** (depois do rebalanceamento).
3. (C/E) A inserção em uma ABB sempre tem custo O(log n), independentemente da ordem de inserção. → **Errado.**

### Missão-âncora (Apostila Viva)

> Você tem 10.000 questões e precisa responder "essa questão já foi respondida por este usuário?" milhões de vezes. Compare lista × `set` medindo com `time.perf_counter()`. Depois use `heapq.nlargest` para achar as 5 disciplinas com mais erros. Explique o resultado em 3 linhas.

---

## 7. Geometria Analítica e Álgebra Linear

### Ficha

| Item | Dado |
|---|---|
| Professor | Prof. Dr. Thales Fernando Vilamaior Paiva |
| Carga horária | 60 h · 3º semestre |
| Livros-base | Venturi (*Álgebra Vetorial e Geometria Analítica*, gratuito) · Santos (*Geometria Analítica*) · **Anton (*Álgebra Linear com Aplicações*, 10ª ed.)**, com páginas indicadas no cronograma · Franco, Corrêa, Lay |
| Formato | Slides em LaTeX (definição → exemplo → propriedade), 14 a 28 por unidade |
| Progresso AVA | 94% |

### A lógica por trás

> Álgebra linear é o estudo de **transformações que preservam soma e multiplicação por escalar**. Uma matriz é a "foto" de uma transformação; autovalores dizem **em que direções ela só estica**, sem girar.

Para um economista, o atalho de intuição: um sistema linear é um **modelo de equilíbrio** (oferta = demanda em vários mercados ao mesmo tempo). Escalonar é eliminar variáveis. "Sistema impossível" é o equilíbrio que não existe; "indeterminado" é ter infinitos equilíbrios.

### O que os slides trazem

**Módulo 1 — Sistemas lineares e vetores**
- **U1 Matrizes e sistemas.** `M_{m×n}(ℝ)`, notação `a_ij`, propriedades de soma e produto por escalar, produto de matrizes, identidade `Iₙ` (`AIₙ = IₙA = A`), transposta com `(AB)ᵀ = BᵀAᵀ`, sistema escrito como `A·x = b`, operações elementares e escalonamento. Classificação depois de escalonar (última equação `0x₁ + … + 0xₙ = βₚ`): βₚ ≠ 0 → **impossível**; βₚ = 0 e p = n → **possível e determinado**; βₚ = 0 e p < n → **possível e indeterminado**.
- **U2 Vetores e posições relativas.** Vetor como classe de segmentos orientados equipolentes, operações, produto escalar e vetorial, retas e planos no espaço, posições relativas.

**Módulo 2 — Espaços vetoriais**
- **U1 Espaços e subespaços.** Os axiomas de espaço vetorial real e o teste de subespaço (contém o zero, fechado para soma e para escalar).
- **U2 Combinação linear, base e dimensão.** Base canônica {e₁, e₂, e₃} de ℝ³, base {1, x, x², x³, x⁴} de P₄(ℝ), independência linear, dimensão.

**Módulo 3 — Transformações lineares**
- **U1 Núcleo, imagem e matriz de uma TL.** E o teorema do núcleo e da imagem (dim N + dim Im = dim V).
- **U2 Autovalores, autovetores e diagonalização.** Polinômio característico `p_T(t)` (não depende da base escolhida); autovalores são as raízes; diagonalização.

**Módulo 4 — Espaços com produto interno**
- **U1 Produto interno, norma, distância, ortogonalidade.** Motivação pelo comprimento de vetor em ℝ² e ℝ³ (Pitágoras), depois a generalização.
- **U2 Matrizes especiais.** Operador ortogonal (`‖T(v)‖ = ‖v‖`, ex.: a rotação `S(x,y) = (x cos θ − y sen θ, x sen θ + y cos θ)`), matriz diagonal e potências `Dʳ` (daí `Aʳ = P Dʳ P⁻¹`), simétricas.

### Conceitos atômicos

`matriz m×n` · `produto de matrizes (não comutativo)` · `transposta` · `identidade` · `inversa` · `determinante` · `escalonamento` · `SPD/SPI/SI` · `posto` · `vetor` · `produto escalar` · `produto vetorial` · `espaço vetorial` · `subespaço` · `combinação linear` · `independência linear` · `base` · `dimensão` · `transformação linear` · `núcleo` · `imagem` · `teorema do núcleo e da imagem` · `matriz de TL` · `autovalor/autovetor` · `polinômio característico` · `diagonalização (A = PDP⁻¹)` · `produto interno` · `norma` · `distância` · `ortogonalidade` · `projeção` · `operador ortogonal` · `matriz simétrica`

### Pegadinhas

- `AB ≠ BA` em geral, e `(AB)ᵀ = BᵀAᵀ` (a ordem inverte).
- Uma matriz n×n é diagonalizável se e só se tem **n autovetores LI**. Ter autovalor repetido não impede, mas exige checar.
- Rotação de 90° (`T(x,y) = (−y, x)`, a sua atividade) **não tem autovalor real**: nenhum vetor do plano fica na mesma direção.
- Subespaço precisa conter o vetor nulo. Uma reta que não passa pela origem não é subespaço.

### Ponte para Ciência de Dados

| Álgebra linear | Ciência de dados |
|---|---|
| Matriz n×p | Dataset: n linhas (observações) × p colunas (variáveis) |
| Vetor | Um cliente, uma questão, um embedding de texto |
| Produto escalar / cosseno | Similaridade (recomendação: "alunos parecidos com você erraram…") |
| Norma / distância | k-NN, k-means |
| Sistema `Ax = b` sem solução | Regressão linear: projeção ortogonal, mínimos quadrados |
| Autovalores / autovetores | PCA (redução de dimensionalidade), PageRank |
| Diagonalização, potências | Cadeias de Markov (economia: transição de estados) |
| Matriz simétrica | Matriz de covariância e de correlação |

### Ponte para concurso

Concursos de dados cobram pouco a teoria pura; cobram **PCA, distância, similaridade e regressão**, que dependem disso. Itens de treino:

1. (C/E) Se A e B são matrizes quadradas de mesma ordem, então (AB)ᵀ = AᵀBᵀ. → **Errado.** É BᵀAᵀ.
2. (C/E) Os componentes principais obtidos pela PCA correspondem aos autovetores da matriz de covariância dos dados. → **Certo.**

### Missão-âncora

> Em NumPy: monte a matriz de acertos usuários × disciplinas (5 × 4) da Apostila Viva; calcule a similaridade de cosseno entre dois usuários; ache os autovalores da matriz de covariância das disciplinas com `np.linalg.eig` e diga, em português de economista, o que o maior autovalor significa.

---

## 8. Programação Orientada a Objetos

### Ficha

| Item | Dado |
|---|---|
| Professor | Prof. Dr. Anderson Viçoso de Araújo |
| Carga horária | 60 h · 3º semestre |
| Linguagem | **Java** (não Python) |
| Livros-base | Rodrigues et al. (*Estrutura de dados em Java*), Félix (*Programação orientada a objetos*), **Deitel (*Java: como programar*)** · complementares: Versolatto, Schildt, Sebesta |
| Progresso AVA | 39% |

### A lógica por trás

> Programação estruturada organiza o código em torno de **ações**. POO organiza em torno de **coisas** (objetos), cada uma com seus **dados** e suas **responsabilidades**, e faz as coisas conversarem por mensagens.

Os 4 pilares são 4 respostas a 4 medos:

| Pilar | Medo que resolve |
|---|---|
| **Encapsulamento** | "alguém vai mexer no meu saldo direto" |
| **Herança** | "vou copiar e colar esse código em 5 classes" |
| **Polimorfismo** | "vou ter um `if tipo == ...` gigante" |
| **Abstração/Interface** | "vou depender de detalhes que mudam" |

### O que os slides trazem

**Módulo 1 — Fundamentos**
- **U1 Paradigma OO.** Alan Kay e Smalltalk, objetos do mundo real, estruturada (top-down, foco no código, menos reuso) × OO (bottom-up, foco nos dados, reuso, abstração), linguagens OO, desvantagens (complexa para problemas simples, depende de experiência).
- **U2 Introdução ao Java.** Linguagem híbrida: `javac` gera bytecode (`.class`) e a **JVM** interpreta. As 5 fases: editor, compilador, carregador de classe, verificador de bytecode, interpretador. Plataforma = JVM + Java API. HelloWorld, `javap -c` (bytecode e constant pool), sensível a maiúsculas, `;`, `{}`, comentários, palavras reservadas (`goto` e `const` existem e não são usadas).
- **U3 Classes e objetos.** Classe = molde (planta da casa, formulário em branco). Responsabilidades (ContaCorrente: saldo, saque, depósito). Atributos e métodos. Ciclo de vida: `new`, a JVM carrega o `.class`, aloca memória e devolve a **referência**; quem destrói é o **Garbage Collector**. Primitivos (`char, boolean, byte, short, int, long, float, double`) × referência. Atributo de instância × de classe (`static`). Assinatura = nome + parâmetros. `return`, `void`.
- **U4 Programando em Java.** `if/else`, `switch`, `for`, `while`, `do-while`, `break`, `continue`, rótulos, operadores.

**Módulo 2 — Aprofundando**
- **U1 Arrays.** São objetos de tamanho fixo; declarar (`int[] a`), construir (`new int[4]`), inicializar. Valores padrão (0, 0L, 0.0f, 0.0d, `'\u0000'`, `false`, `null`). `length`, `for` e for-each, literal `{2,4,6,8,10}`, matriz = vetor de vetores, matriz irregular.
- **U2 Métodos, classes e objetos em profundidade** · **U3 Coleta de lixo e pacotes** **[NÃO LIBERADO]**

**Módulo 3 — Pilares** **[NÃO LIBERADO]** Herança e polimorfismo · Encapsulamento e modificadores de acesso · Interfaces e abstração · Classes e métodos genéricos.

**Módulo 4 — Conceitos avançados** **[NÃO LIBERADO]** Coleções · Conjuntos e mapas · Tratamento de exceções · Arquivos e fluxos.

### Conceitos atômicos

`classe` · `objeto` · `instância` · `referência` · `new` · `construtor` · `this` · `static` · `primitivo × referência` · `valor padrão` · `assinatura` · `sobrecarga × sobrescrita` · `JVM/bytecode` · `Garbage Collector` · `array` · `pacote` · `encapsulamento` · `private/protected/public/default` · `getter/setter` · `herança (extends)` · `super` · `polimorfismo` · `classe abstrata` · `interface` · `genéricos` · `ArrayList/HashSet/HashMap` · `exceção checked × unchecked` · `try/catch/finally`

### Pegadinhas

- Tamanho na declaração é erro: `int[5] a;` não compila.
- `==` entre objetos compara **referências**; para conteúdo, `equals()`. (O plano de ensino chama isso de "semântica de cópia e comparação".)
- O exemplo do slide `for(cont=10; cont>10; cont-=2)` **nunca executa**: a condição já começa falsa.
- Atributo `static` é um só para a classe inteira; mudar em um objeto muda para todos.
- Sobrecarga = mesmo nome, parâmetros diferentes (compilação). Sobrescrita = mesma assinatura na subclasse (execução, polimorfismo).

### Ponte para Ciência de Dados

O mercado de dados usa POO em **Python**: `sklearn` é POO pura (todo modelo tem `.fit()` e `.predict()`, isso é polimorfismo); `DataFrame` é uma classe; pipelines são composição. A estratégia é estudar o **conceito** uma vez e escrevê-lo nas duas linguagens (Java para a prova, Python para o trabalho).

### Ponte para concurso

1. (C/E) Em Java, a sobrecarga de métodos exige que os métodos tenham o mesmo nome e listas de parâmetros diferentes. → **Certo.**
2. (C/E) O operador `==`, aplicado a duas variáveis de referência em Java, compara o conteúdo dos objetos. → **Errado.**

### Missão-âncora

> Em Java e depois em Python: `class Questao` com atributos `private`, construtor e getters; `class QuestaoCertoErrado extends Questao` e `class QuestaoMultipla extends Questao`, cada uma com seu `corrigir(resposta)`. Um laço corrige uma lista misturada sem nenhum `if` de tipo. Isso é polimorfismo.

---

## 9. Introdução a Conceitos de Computação

### Ficha

| Item | Dado |
|---|---|
| Professora | Profa. Dra. Nahri Balesdent Moreano |
| Carga horária | 45 h · 2º semestre |
| Livros-base | Brookshear (*Ciência da Computação: uma visão abrangente*), Carvalho, Dale · apoio: Borges & Silva (arquitetura), Maciel & Viterbo (*Computação e sociedade*, gratuito) |
| Progresso AVA | 97% |

### A lógica por trás

> Tudo no computador é **número binário**, e tudo o que ele faz são **operações lógicas** sobre esses números, executadas uma a uma por um processador que **busca, decodifica e executa** instruções guardadas na memória.

### O que os slides trazem

- **M1U1 História.** Ábaco; Pascal, Leibniz; Babbage (Máquina Diferencial e Analítica, cartões perfurados); Ada Lovelace (1843, primeira programadora); Boole; relé e Stibitz (1939); Bombe (Turing, Enigma); Harvard Mark I (1944); Grace Hopper (primeiro compilador); as 3 Leis da Robótica de Asimov (1941); válvula, Colossus, **ENIAC** (Mauchly e Eckert); **von Neumann (1945): programa armazenado**; transistor (1947, Nobel de 1956), circuito integrado, Intel 4004 (1971); impactos sociais (inclusão, crimes digitais, privacidade, IA, propriedade intelectual, computação verde).
- **M1U2 Numeração e representação.** Bit e byte, sistema posicional, n bits → 2ⁿ valores; binário ↔ decimal (00101101 = 45; 12 = 1100; 19 = 10011); hexadecimal (0101 1010 0111 1111 = 5A7F); **complemento de 2** (inverter e somar 1; +56 = 00111000, −56 = 11001000; faixa −2ⁿ⁻¹ a 2ⁿ⁻¹−1); frações binárias (011.011 = 3,375); **ponto flutuante IEEE de 32 bits** (1 bit de sinal, 8 de expoente com polarização 127, 23 de fração); ASCII (7 bits, 128 caracteres; A = 65, a = 97), extensões de 8 bits, Unicode (1 a 4 bytes).
- **M2U1 Circuitos digitais.** Portas NOT, AND, OR, NAND, NOR, XOR, XNOR; exemplos do aviso de cinto de segurança (AND de 3 entradas) e do alarme de janelas (OR); três representações equivalentes (circuito, expressão, tabela-verdade com 2ⁿ linhas); precedência NOT > AND > OR; **meio-somador** (S = XOR, vai-um = AND).
- **M2U2 Arquitetura.** CPU (unidade de controle, ULA, registradores PC e IR), RAM, 3 níveis de cache, E/S, armazenamento secundário, barramentos (dados, endereços, controle); **ciclo da instrução** (busca, decodifica, busca operandos, executa, escreve resultado, atualiza PC) com `add R0,R1,R2`.
- **M3U1 Linguagens.** Algoritmo → programa; baixo nível × alto nível; paradigmas; `a = b + c − d` em C, assembly e linguagem de máquina; **compilação + ligação** (gera executável) × **interpretação** (não gera).
- **M3U2 SO e redes.** Camadas de software; funções do SO (processos, memória virtual, arquivos, E/S, segurança); kernel; CLI × GUI; LAN/MAN/WAN; repetidor, switch, roteador; Ethernet; TCP/IP; HTTP, FTP, SSH, VoIP.

### O que vale guardar para Ciência de Dados

- `0.1 + 0.2 != 0.3` em Python: é o ponto flutuante do M1U2. Nunca compare float com `==` (use `math.isclose`).
- `int64` × `int32` no pandas: memória por linha.
- `UnicodeDecodeError` ao abrir CSV brasileiro: é ASCII × UTF-8 × Latin-1.
- Cache e memória explicam por que operação vetorizada é rápida.
- Python é **interpretado** (por isso laço puro é lento); NumPy chama código **compilado**.

### Ponte para concurso

1. (C/E) Em complemento de 2 com 8 bits, o intervalo representável vai de −128 a 127. → **Certo.**
2. (C/E) O interpretador traduz todo o programa-fonte para linguagem de máquina e gera um arquivo executável antes da execução. → **Errado.** Isso descreve compilação e ligação.

---

## 10. Disciplinas de apoio

### 10.1 Blockchain e suas Aplicações (optativa · Prof. Dr. Carlos Alberto da Silva · 93%)
**Lógica:** um livro-razão **replicado** em muitos nós que não confiam uns nos outros, onde cada bloco carrega o hash do anterior (mexer em um quebra todos) e um **mecanismo de consenso** decide quem escreve o próximo.
**Slides:** Bitcoin (Satoshi, 2008–2009), moedas anteriores (E-Gold, Beenz); rede P2P; criptografia simétrica × assimétrica, hash, assinatura digital, envelope digital; arquitetura (full nodes, servidor de carimbo de tempo, prova de trabalho, nonce, incentivo, recuperação de espaço); consenso PoW, PoS, PoA, PBFT e tipos de rede (pública, privada, permissionada, consórcio, híbrida); regulação ("o código é lei"), LGPD; NFTs e versões 1.0/2.0/3.0 (Solidity, Vyper); smart contracts e suas fases; sistema financeiro centralizado × DeFi (Ethereum, Solana, Cardano, Polkadot, BSC).
**Para você:** hash criptográfico liga direto com ED (Módulo 4). Para concurso: assinatura digital e hash caem em Segurança da Informação.

### 10.2 Ética e Governança em IA (optativa · Carlos Alberto da Silva · 97%)
**Lógica:** IA escala decisões; por isso escala também erros e preconceitos. Governança é o conjunto de processos que dá nome a responsáveis, mede risco e audita.
**Slides:** ética × moral, pessoa humana, consciência; Asimov e a Lei Zero; princípios da **OCDE (2019)** e da UNESCO; dilema regulação × inovação; **EU AI Act** (risco inaceitável, alto, limitado, mínimo); Brasil: ausência de lei única, do PL 21/2020 ao **PL 2338/2023 (Marco Legal da IA)**, classificação de risco, responsabilidade civil; gestão de riscos no ciclo de vida; padrões de **IA Responsável** (indústria, organização, equipe; processo; produto); confiança × confiabilidade; casos Telstra (comitê de risco RCAID, matriz de exposição) e Reejig (auditoria); cidadania digital, mito da neutralidade, viés (recrutamento da Amazon, reconhecimento facial), relações étnico-raciais; soberania digital, pegada hídrica, economia circular.
**Para concurso:** muito valioso. LGPD, governança de dados e IA responsável aparecem em editais de controle e dados. **Aviso de fidelidade:** o andamento do PL 2338/2023 pode ter mudado depois da gravação da aula. Para lei seca, use sempre o texto oficial (Planalto/Câmara/Senado), nunca resumo.

### 10.3 Desenvolvimento para Dispositivos Móveis (Rafael Canteri · 59%)
**Slides:** fundamentos da computação móvel (tela, bateria, sensores; Newton, PDA, iPhone de 2007); Android (OHA, AOSP, kernel Linux, um usuário por app, permissões, Android Studio, emulador AVD); layouts (Relative, Constraint, Linear, Frame, Grid, Table; `match_parent`, `wrap_content`, `dp`, `sp`, margin × padding); componentes (TextView, EditText, Button, Spinner, RadioButton, CheckBox, Switch, ProgressBar, RatingBar, ImageView). **[NÃO LIBERADO]:** eventos, múltiplas telas, sensores, armazenamento persistente.
**Para você:** útil para o app da plataforma no futuro; baixa prioridade de estudo profundo agora.

### 10.4 Inglês (90%)
Estrutura da frase (do/does/did/will, contrações), skimming e scanning, predição, inferência, leitura top-down × bottom-up, e-mail formal × informal, modais (may/might, can/could, must/have to, should), marcadores discursivos, voz passiva, nominalização, listening, variedades do inglês e inglês como língua franca, autorregulação e IA para praticar.
**Para você:** o que importa é ler documentação técnica (pandas, scikit-learn, PostgreSQL). A plataforma vai usar trechos reais de documentação como exercício de leitura.

### 10.5 Gestão de Inovação e Desenv. de Produtos (100%) · Empreendedorismo e Inovação (100%)
Avaliação de oportunidade, PDCA, Lean, compliance, fontes de financiamento (anjo, capital de risco), plano de negócios, segmentação; Design Thinking, Canvas, startups, tríplice hélice. Concluídas. Servem de moldura para pensar a Apostila Viva como produto.

---

## 11. Lacunas críticas

O que **não** está no seu período e a plataforma precisa cobrir mesmo assim:

| Lacuna | Por que é crítica | Como a plataforma trata |
|---|---|---|
| **Estatística e Probabilidade** (2º sem.) | Pré-requisito de Inferência, Mineração e ML; é o seu diferencial de economista; cai em concurso de dados | Trilha sombra: 15 min, 3x/semana, desde já |
| **Cálculo I** (2º sem.) | Derivada = gradiente = como modelos de ML aprendem | Só intuição por enquanto; entra antes de Redes Neurais |
| **pandas** | Ferramenta nº 1 do dia a dia; só aparece formalmente em "Introdução a Ciência de Dados" (4º sem.) | Etapa 2 da trilha, ligada a ALG II |
| **Git/GitHub** | Portfólio, colaboração, concursos com prova prática | 1 missão por semana dentro dos projetos |
| **Fundamentos de Web** (2º sem.) | Necessário para construir a própria plataforma | Aprendido construindo |

---

## 12. Erros encontrados nos próprios slides

Use como treino de **revisão crítica**: achar o erro é sinal de domínio.

| Disciplina | Onde | O que está errado | Correto |
|---|---|---|---|
| BD M2U2 | Consulta 8 | Junta `PROJETO.dnumero = TRABALHA_EM.pnumero` | `PROJETO.numero = TRABALHA_EM.pnumero` |
| BD M2U2 | JOIN de supervisor | Usa `F.cpf = S.supcpf`, invertendo os papéis da consulta anterior (`F.supcpf = S.cpf`) | Manter `F.supcpf = S.cpf` se F é o supervisionado |
| BD M2U2 | GROUP BY | `salario > 40.000` | Em SQL o separador decimal é ponto: `40000` |
| BD M2U2 | Consulta 10 | `LIKE '_ _ / _ _ / 199 _'` numa coluna DATE | Funciona só se a data for texto; o certo é `EXTRACT(YEAR FROM dtnasc) BETWEEN 1990 AND 1999` |
| BD M2U2 | INSERT | Data `12/08/1974` e `5.558,00` sem aspas | `'1974-08-12'` e `5558.00` |
| BD M2U1 × M2U2 | Nomes de coluna | A DDL cria `nome` em FUNCIONARIO e `nome` em DEPARTAMENTO, mas várias consultas usam `pnome` e `dnome` | Escolher um padrão e manter (o modelo do Elmasri usa `pnome`/`dnome`) |
| ALG II M1U1 | Classe Aluno | Comentário "Char" para `sexo` | Python não tem char; é `str` |
| POO M1U4 | Laço for | `for(cont=10; cont>10; ...)` | Nunca executa (provavelmente intencional, mas vale notar) |

---

## 13. Fontes oficiais

- AVA UFMS: slides das videoaulas (Google Slides), Planos de Ensino e Cronogramas de cada disciplina, período 2026.2.
- Matriz curricular: siscad.ufms.br/cursos/3290/matriz
- Página do curso: agead.ufms.br/tecnologia-em-ciencia-dos-dados
- PPC (versão parcial): agead.ufms.br/files/2026/02/Parcial-Ciencia-de-Dados.pdf
- Levantamento de incidência em TI de controle (Cebraspe): concursos.estrategia.com/portal/ti-controle-cebraspe-cespe
