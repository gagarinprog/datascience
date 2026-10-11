# REFERÊNCIAS: GITHUB, APPS E MÉTODOS
## O que existe de melhor, e o que o DOMÍNIO aproveita de cada um

> Regra de uso: nada daqui substitui o ciclo diário. Cada recurso entra **amarrado a um conceito do grafo** (documento 02, seção 4), nunca como "lista para ver depois". Quando uma missão pedir, a plataforma aponta o capítulo ou o notebook exato.

---

## 1. Repositórios do GitHub para incrementar o conteúdo

### 1.1 Currículos completos (para conferir se o grafo não tem buraco)

| Repositório | O que é | Como o DOMÍNIO usa |
|---|---|---|
| **ossu/data-science** | Currículo autodidata de ciência de dados montado só com cursos e livros gratuitos, da matemática ao ML | Checagem de cobertura: comparar com a grade da UFMS e achar o que falta (principalmente matemática e estatística) |
| **datasciencemasters/go** | Currículo aberto para chegar a vaga júnior de cientista de dados, só com recursos gratuitos | Mesmo uso, com viés de mercado |
| **microsoft/Data-Science-For-Beginners** | 10 semanas, 20 lições com projetos, quizzes e tarefas | Fonte de exercícios curtos para as Etapas 2 e 5 (pandas e visualização) |
| **virgili0/Virgilio** | Guia estruturado com site interativo: estatística, Python, etapas de projeto, ML e visualização | Leitura de apoio para a trilha sombra de Estatística |

### 1.2 Conteúdo técnico de alta qualidade

| Repositório | O que é | Disciplina/etapa que alimenta |
|---|---|---|
| **jakevdp/PythonDataScienceHandbook** | O livro *Python Data Science Handbook* inteiro em notebooks: NumPy, pandas, Matplotlib, scikit-learn | ALG II → pandas (Etapa 2), GAAL com NumPy, ML (Etapa 6) |
| **donnemartin/data-science-ipython-notebooks** | Coleção de notebooks organizados por ferramenta (pandas, scikit-learn, Spark…) | Banco de exemplos para "preveja a saída" |
| **TheAlgorithms/Python** | Implementações de algoritmos e estruturas de dados em Python | ED (hash, heap, ABB, AVL) e ALG II (ordenação, recursão): comparar com o seu código depois de você implementar |
| **alexeygrigorev/data-science-interviews** | Perguntas e respostas de entrevista: SQL, Python, classificação, regularização, árvores | Itens de revisão de nível "mercado" |
| **drivendataorg/cookiecutter-data-science** | Modelo padrão de pasta para projetos de dados reproduzíveis | Estrutura das missões-âncora e dos Projetos Integradores |
| **academic/awesome-datascience** | Lista curada de tutoriais, livros e ferramentas | Consulta pontual |
| **eugeneyan/applied-ml** | Artigos de empresas sobre ML em produção | Fase avançada (5º e 6º semestres) |

### 1.3 Peças de software para construir o DOMÍNIO

| Repositório | Para quê |
|---|---|
| **open-spaced-repetition/ts-fsrs** | Algoritmo FSRS em TypeScript (revisão espaçada no app) |
| **open-spaced-repetition/py-fsrs** | O mesmo em Python (versão 2, back-end ou análise dos seus dados de estudo) |
| **open-spaced-repetition/awesome-fsrs** | Lista de implementações e artigos do FSRS |
| **Pyodide** | Rodar Python (e pandas) dentro do navegador |
| **sql.js** / **PGlite** | Rodar SQLite / Postgres dentro do navegador para o editor SQL |
| **OATutor** (Pardos et al., CHI 2023) | Primeiro sistema de tutoria adaptativa de código aberto (licença MIT) com rastreamento de conhecimento; referência de arquitetura para a versão 2 |

---

## 2. Apps de ensino: o que copiar e o que evitar

### 2.1 Mimo
- **O que faz bem:** lições de poucos minutos no celular, exercícios de tocar para completar código, múltipla escolha, sequência diária (streak), pontos (XP), trilhas por linguagem (Python, SQL, web).
- **Limite:** pouca escrita de código do zero e poucos projetos de verdade.
- **O DOMÍNIO pega:** a duração curta, o começo sem fricção, a sequência diária, o formato "complete a lacuna" **só como degrau** para o código escrito do zero.

### 2.2 Brilliant
- **O que faz bem:** aprender fazendo; problema antes do procedimento; intuição visual antes da notação; uma ideia por lição; feedback imediato; apoio que diminui com o tempo; recuperação ativa; espaçamento; intercalação; variação de contexto; seleção adaptativa de exercícios.
- **O DOMÍNIO pega:** praticamente todo o método. É a referência principal para GAAL e Estrutura de Dados (visualizações manipuláveis).

### 2.3 Hyperskill (JetBrains Academy)
- **O que faz bem:** mapa de conhecimento; plano de estudo puxado por **projeto**; toda teoria seguida de prática; vários exercícios parecidos até automatizar; projetos em etapas que reutilizam o código anterior.
- **O DOMÍNIO pega:** o grafo de conhecimento e as missões-âncora em etapas (a análise da Apostila Viva cresce a cada semana).

### 2.4 Anki + FSRS
- **O que faz bem:** revisão espaçada guiada pelo modelo de memória DSR (dificuldade, estabilidade, recuperabilidade).
- **O DOMÍNIO pega:** o algoritmo FSRS para decidir quando cada carta volta.

### 2.5 Duolingo
- **O que faz bem:** meta diária mínima, "congelamento" da sequência, metas pequenas.
- **O DOMÍNIO pega:** o dia mínimo de 10 minutos que conta como dia cumprido. **Evita:** ligas e rankings (competição gera ansiedade e não ensina).

### 2.6 Khan Academy
- **O que faz bem:** domínio por habilidade (só avança quando domina).
- **O DOMÍNIO pega:** os estados de domínio do grafo.

### 2.7 Exercism
- **O que faz bem:** exercícios de código com testes automáticos e mentoria humana.
- **O DOMÍNIO pega:** correção por teste; o Claude no papel do mentor.

### 2.8 VisuAlgo (indicado pelos professores de ED)
- Visualização de hash, heap, ABB e AVL. Usar sempre junto com as missões de Estrutura de Dados.

---

## 3. Leituras de base (gratuitas ou na Biblioteca Digital da UFMS)

| Tema | Fonte | Onde |
|---|---|---|
| Banco de Dados | Elmasri & Navathe, *Sistemas de banco de dados* (7ª ed.) | Biblioteca Digital UFMS |
| Banco de Dados | Documentação oficial do PostgreSQL | postgresql.org/docs |
| Estrutura de Dados | Szwarcfiter; Cormen (*Algoritmos*) | Biblioteca Digital UFMS |
| Álgebra Linear | Anton, *Álgebra Linear com Aplicações* (10ª ed., páginas indicadas no cronograma) | Biblioteca Digital UFMS |
| Geometria Analítica | Venturi, *Álgebra Vetorial e Geometria Analítica* | Gratuito (link no plano de ensino) |
| Python | Banin, *Python 3: conceitos e aplicações* | Biblioteca Digital UFMS |
| Java | Deitel, *Java: como programar* | Biblioteca Digital UFMS |
| Computação e sociedade | Maciel & Viterbo (orgs.), *Computação e sociedade* (vols. 1 e 2) | Gratuito (EdUFMT) |

---

## 4. Concurso: onde ciência de dados aparece

- Em provas de TI de controle do Cebraspe (TCU, TCEs, CGU), um levantamento da Estratégia Concursos com 44 questões apontou como mais frequentes: noções de mineração de dados, dado/informação/conhecimento/inteligência, bancos de dados relacionais e modelagem dimensional. O próprio texto tem inconsistência na contagem de mineração de dados, então use como tendência, não como número exato.
- Editais com ênfase em ciência de dados aparecem em empresas e bancos públicos (exemplos de cursos preparatórios para Petrobras – Ciência de Dados e BRDE – Analista de Sistemas/Ciência de Dados).
- O CNU 2025 tem um bloco de Ciências, Dados e Tecnologia, com o eixo "Tecnologias da informação e comunicação & ciência de dados".
- Antes de produzir conteúdo de concurso para um edital específico, a plataforma roda a análise de peso do edital (você já tem um fluxo para isso).

---

## Fontes consultadas

- [KDnuggets — 10 GitHub Repositories to Master Data Science](https://www.kdnuggets.com/10-github-repositories-to-master-data-science)
- [Brilliant — How Brilliant teaches math](https://brilliant.org/resources/choosing-brilliant/how-brilliant-teaches-math/)
- [Coddy vs Mimo (comparativo publicado por concorrente)](https://coddy.tech/vs/mimo)
- [Hyperskill — How we teach](https://hyperskill.org/how-we-teach)
- [open-spaced-repetition (GitHub)](https://github.com/open-spaced-repetition)
- [Never Work in Theory — OATutor](https://neverworkintheory.org/2023/05/07/open-source-adaptive-tutoring-system.html)
- [Estratégia Concursos — TI de controle no Cebraspe](https://concursos.estrategia.com/portal/ti-controle-cebraspe-cespe/)
- [Estratégia Concursos — Conteúdo programático CNU 2025](https://www.estrategiaconcursos.com.br/blog/conteudo-programatico-provas-cnu-2025/)
- [Gran Cursos — Petrobras ênfase 7 Ciência de Dados](https://www.grancursosonline.com.br/cursos/por-concurso/petrobras-petroleo-brasileiro-s-a-enfase-7-ciencia-de-dados)
- [Gran Cursos — BRDE Analista de Sistemas Ciência de Dados](https://www.grancursosonline.com.br/cursos/por-concurso/brde-banco-regional-de-desenvolvimento-do-extremo-sul-conhecimentos-especificos-para-o-cargo-analista-de-sistemas-ciencia-de-dados-pos-edital)
