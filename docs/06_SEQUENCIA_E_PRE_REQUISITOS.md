# 06 — Sequência de estudo e pré-requisitos

> O que é preciso saber antes de cada tópico, como saber que dá para avançar e em que ordem estudar as 16 matérias.
> Pesquisa feita em 12/10/2026. Os dados de cada módulo ficam em `tutor/sequencia_dados.py`; a página visual é a aba Trilha da apostila (`apostila/index.html`).

## Sumário

1. [O que a pesquisa diz sobre ordem](#1-o-que-a-pesquisa-diz-sobre-ordem)
2. [A ordem das 16 matérias](#2-a-ordem-das-16-matérias)
3. [A ordem dentro de cada matéria](#3-a-ordem-dentro-de-cada-matéria)
4. [Pontos de virada](#4-pontos-de-virada)
5. [Como a plataforma usa a sequência](#5-como-a-plataforma-usa-a-sequência)
6. [O que mudou em relação ao docs/05](#6-o-que-mudou-em-relação-ao-docs05)
7. [Referências](#7-referências)

---

## 1. O que a pesquisa diz sobre ordem

Sete achados guiaram a sequência. Cada um vira uma regra prática.

| Achado | Fonte | Regra no DOMÍNIO |
|---|---|---|
| Trajetórias de aprendizagem montadas a partir de mais de 600 objetivos de mais de 100 artigos vão do cotidiano para o pensamento computacional e só então para o programa. Na trajetória de sequência, primeiro vem a precisão e a ordem dos passos; a repetição e a decisão vêm depois, porque mudam a ordem padrão. Laços simples, que só contam vezes, vêm antes de laços controlados por condição e de laços aninhados. | Rich, Strickland, Binkowski, Moran e Franklin, ICER 2017 | Lógica começa sem computador (algoritmo, teste de mesa) e logo passa ao primeiro programa; decisão e repetição só depois de variáveis e operadores. |
| Os pesquisadores marcaram dois tipos de ligação entre objetivos: dependência com evidência (seta preta) e caminho possível (seta cinza). | Rich e colegas, 2017 | Cada módulo tem uma lista `antes` só com dependências duras. A ordem sugerida entre módulos independentes é recomendação, não trava. |
| Usar um artefato pronto, depois modificar e só então criar ajuda a entrar num tema novo; o mesmo vale para prever, rodar, investigar, modificar e criar (PRIMM). | Lee e colegas, 2011; Sentance, Waite e Kallia, 2019 | Banco de dados: consultar um banco pronto antes de modelar o seu. Estruturas de dados: usar pilha e fila prontas antes de construir uma lista ligada. Exercícios de prever a saída antes de escrever código. |
| Muitos erros de iniciante vêm de um modelo errado do que a máquina faz por baixo (a máquina nocional). Sorva reuniu 162 erros de concepção registrados na literatura; 14 são só sobre atribuição de variável. Num experimento com 496 iniciantes, ensinar variável como etiqueta deu melhor resultado do que como caixa em questões com duas atribuições seguidas. | du Boulay, 1986; Sorva (tese); Hermans e colegas, 2018 | Variável é ensinada como etiqueta (o modelo do Python). As lições desenham a memória. A matéria Como o computador funciona vem logo depois dos primeiros programas. |
| Alguns conceitos são pontos de virada: difíceis, demoram a fazer sentido e, depois de entendidos, mudam o jeito de ver o resto. Há evidência empírica para ponteiros e referências e para orientação a objetos; recursão e dinâmica do programa são candidatos. | Boustedt e colegas, SIGCSE 2007; Eckerdal e colegas | Esses módulos ganham o selo “ponto de virada”, mais tempo e mais prática antes de avançar (seção 4). |
| A dificuldade das consultas SQL foi medida em consultas reais de estudantes. Da mais fácil para a mais difícil: uma tabela, agrupamento sem e com HAVING, junção natural, subconsulta simples, subconsulta correlacionada e autojunção. Os erros de lógica se repetem do mesmo jeito em alunos diferentes e têm causas identificáveis: conhecimento anterior, generalização, a própria linguagem e modelo mental incompleto. | Ahadi, Prior, Behbood e Lister, ITiCSE 2015 e 2016; Taipalus, Siponen e Vartiainen, 2018; Miedema, Aivaloglou e Fletcher, ICER 2021 | A ordem dos módulos de SQL segue essa escala. A autojunção fica por último dentro de Junções; a subconsulta correlacionada, por último dentro de Subconsultas. |
| Em estruturas de dados, os erros previsíveis estão documentados: esquecer de atualizar o ponteiro do fim ao inserir numa lista ligada (16% dos estudantes), usar busca binária numa lista ligada, achar que a árvore de busca é balanceada por padrão, achar que as chaves ficam no lugar quando a tabela hash cresce. Na recursão, a volta das chamadas é a parte mais difícil. | Zingaro e colegas, ICER 2018; Karpierz e Wolfman, SIGCSE 2014; Porter e colegas (BDSI), ICER 2019; Kahney; Götschi, Sanders e Galpin, 2003 | Esses erros viram o “tropeço comum” de cada módulo e alimentam os distratores dos exercícios. |
| Em estatística, iniciantes de qualquer idade começam pelo nível A (perguntas e dados reais antes da teoria). Cursos de referência ensinam inferência primeiro por simulação e reamostragem e só depois pelas fórmulas. | GAISE II, 2020; Data 8 (Berkeley); OpenIntro (Diez, Barr e Çetinkaya-Rundel) | A matéria de estatística põe a reamostragem antes da estimação e dos testes. Os exercícios simulam antes de usar fórmula. |

Também foram usados como referência de ordem os cursos e livros mais usados para iniciantes: CS50 Python e Python for Everybody (funções, condicionais, laços, exceções, bibliotecas, testes, arquivos, expressões regulares, objetos), Think Python (3ª edição), Problem Solving with Algorithms and Data Structures using Python (análise, estruturas básicas, recursão, busca e ordenação, árvores, grafos), Data 8 e Data 100 de Berkeley (tabelas e gráficos antes de inferência; modelos depois de análise exploratória), Mathematics for Machine Learning (fundamentos matemáticos imediatamente antes dos modelos) e o estudo de erros em programação para análise de dados de Singh e colegas (SIGCSE 2024).

## 2. A ordem das 16 matérias

| Ordem | Matéria | Módulos | Por que nessa posição | Usa o que veio de |
|---|---|---|---|---|
| 1 | Lógica de programação | 10 | Base de tudo; começa sem computador e inclui o primeiro programa em Python | — |
| 2 | Python | 13 | A ferramenta de trabalho; o resto do percurso escreve código nela | Lógica |
| 3 | Banco de dados e SQL | 20 | Habilidade mais pedida em vagas e concursos; só precisa de lógica booleana | Lógica |
| 4 | Como o computador funciona | 7 | Explica o que você já viu acontecer (float, acentos, lentidão) | Lógica (inclui o primeiro programa) |
| 5 | Matemática básica e lógica | 3 | Conjuntos, lógica proposicional e contagem, pedidos pela estatística e pelos concursos | Lógica |
| 6 | Probabilidade e estatística | 12 | Simulação com o Python que você já sabe | Lógica, Python, Matemática básica |
| 7 | Estruturas de dados e algoritmos | 22 | Precisa de referências e classes do Python | Lógica, Python |
| 8 | Orientação a objetos | 8 | Ponto de virada; vem depois de classes e estruturas | Python, Computador, Estruturas |
| 9 | Ferramentas do ofício | 10 | Terminal, ambientes, notebook, Git, pipelines | Python, Banco de dados, Computador |
| 10 | Formatos e coleta de dados | 12 | CSV, JSON, APIs e dados públicos | Python, Computador, Estruturas |
| 11 | Análise de dados | 9 | pandas, com o par em SQL de cada operação | Python, Banco de dados, Computador, Estruturas, Formatos |
| 12 | Visualização e comunicação | 8 | Gráficos, análise exploratória e relatórios | Estatística, Análise de dados, Ferramentas |
| 13 | Álgebra linear e cálculo para dados | 7 | A matemática dos modelos, logo antes deles | Matemática básica, Análise, Estatística |
| 14 | Aprendizado de máquina | 13 | Usa estatística, análise e álgebra linear | Estatística, Análise, Álgebra linear, Formatos |
| 15 | Dados além do relacional | 7 | Só faz sentido depois do relacional | Banco de dados, Formatos, Estruturas |
| 16 | Ética, privacidade e governança | 6 | Usa tudo: dados pessoais, modelos e pipelines | Computador, Estatística, Ferramentas, Análise, ML |

O gerador (`tutor/gerar_percurso.py`) confere a cada execução que nenhum módulo aparece antes de um módulo que ele exige. Se alguém mudar a ordem e quebrar uma dependência, a geração para e diz qual.

## 3. A ordem dentro de cada matéria

As listas completas, com o que cada módulo exige, a pergunta de prontidão, o tropeço comum e o exemplo do dia a dia, estão em `tutor/sequencia_dados.py` e na aba Trilha. Abaixo, só as decisões de ordem que diferem do docs/05 e o porquê.

- **Lógica de programação:** o módulo Primeiros passos do Python (`PY.01`) entra logo depois de Algoritmo, para que todo conceito seguinte já seja visto rodando. Depuração (`LOG.09`) vem logo após repetição, quando os primeiros erros de verdade aparecem, e antes de funções.
- **Python:** erros e exceções, arquivos, módulos e testes vêm antes de compreensões, classes, expressões regulares e anotações de tipo. É a ordem do CS50 Python e do Python for Everybody: primeiro o kit para fazer coisas reais, depois os atalhos e a organização.
- **Banco de dados e SQL:** funções úteis (`BD.11`, como CASE e datas) vêm antes da agregação, porque são consultas de uma tabela só. Álgebra relacional (`BD.18`) vem logo depois das operações de conjunto, porque é a mesma ideia escrita em símbolos. Modelagem e normalização vêm depois de consultar, e não antes.
- **Estatística:** reamostragem (`EST.09`) vem antes de estimação (`EST.07`) e testes de hipótese (`EST.08`).
- **Estruturas de dados e algoritmos:** as duas trilhas do docs/05 viraram uma matéria só, na ordem do Problem Solving with Algorithms and Data Structures using Python. Custo vem primeiro; pilhas e filas antes de listas ligadas; recursão antes de árvores; heaps antes da árvore de busca; grafos por último.
- **Ferramentas do ofício:** ambientes virtuais e Jupyter vêm logo depois do terminal, antes do Git.
- **Formatos:** datas sobem para o terceiro lugar, porque aparecem em quase toda base.
- **Visualização:** a análise exploratória (`AD.09`) passa para dentro desta matéria, depois dos gráficos, porque é feita com eles.
- **Aprendizado de máquina:** atributos e pipelines (`ML.07`) vêm antes de árvores e conjuntos; texto e tempo (`ML.13`) antes de redes neurais.
- **Matemática:** dividida em duas matérias. Conjuntos, lógica e contagem (`MAT.01` a `MAT.03`) ficam no começo. Vetores, matrizes, sistemas, mínimos quadrados, decomposições e cálculo (`MAT.04` a `MAT.10`) viram a matéria Álgebra linear e cálculo, logo antes do aprendizado de máquina.

## 4. Pontos de virada

Módulos marcados com o selo “ponto de virada” na Trilha: Variáveis e tipos (`LOG.02`), Referências e mutabilidade (`PY.05`), Recursão (`ALG.04`), Classe e objeto (`POO.01`) e Polimorfismo (`POO.04`).

O que muda neles:
- mais exemplos desenhados da memória (etiquetas, setas, pilha de chamadas);
- o tutor pede dois acertos de prontidão em dias diferentes antes de dar o módulo por dominado;
- quando um erro desses aparece mais tarde, o tutor volta ao módulo de origem em vez de corrigir só o sintoma.

## 5. Como a plataforma usa a sequência

- **Trilha (`apostila/index.html#trilha`):** as 16 matérias como estações, com o progresso de cada uma e o selo “você está aqui”. Cada matéria mostra por que está naquela posição, de que matérias depende e para quais prepara. Cada módulo mostra o que precisa antes (com links), o tropeço comum, o exemplo do dia a dia e a pergunta de prontidão: você escreve a sua resposta, compara e marca como dominado ou para rever.
- **Progresso:** salvo na base de dados da própria apostila (documento `progresso/geral`), que o tutor também lê e atualiza; quando a página está fora do claude.ai, fica guardado no navegador.
- **Tutor (`/aula`):** a linha `M` de cada módulo no `tutor/percurso.txt` traz `antes:` e `pronto:`. Antes de começar um módulo, o tutor confere se os pré-requisitos já foram estudados; se não, oferece uma revisão rápida deles.
- **Guia (`apostila/index.html#guia`):** cada matéria com logos das tecnologias, ilustrações ampliáveis e uma caixa “Experimente”, em que você digita valores e vê o resultado na hora.

## 6. O que mudou em relação ao docs/05

Nenhum módulo ou conceito foi apagado nem renomeado: os códigos do docs/05 continuam os mesmos e o progresso salvo não muda. Mudou só a ordem e o agrupamento em matérias:
- Estruturas de dados e Algoritmos viraram uma matéria só.
- Matemática foi dividida em Matemática básica e lógica e em Álgebra linear e cálculo.
- `PY.01` passou para dentro de Lógica de programação, e `AD.09` para dentro de Visualização.
- A ordem dos conceitos mudou em dois módulos: autojunção por último em `BD.08`; subconsulta correlacionada por último em `BD.09`.

## 7. Referências

- Rich, K. M.; Strickland, C.; Binkowski, T. A.; Moran, C.; Franklin, D. *K-8 Learning Trajectories Derived from Research Literature: Sequence, Repetition, Conditionals*. ICER 2017, p. 182–190. https://doi.org/10.1145/3105726.3106166
- Lee, I. et al. *Computational Thinking for Youth in Practice*. ACM Inroads 2(1), 2011, p. 32–37.
- Sentance, S.; Waite, J.; Kallia, M. *Teachers' Experiences of Using PRIMM to Teach Programming in School*. SIGCSE 2019.
- du Boulay, B. *Some Difficulties of Learning to Program*. Journal of Educational Computing Research 2(1), 1986, p. 57–73.
- Sorva, J. *Visual Program Simulation in Introductory Programming Education* (tese, Aalto University, 2012), com a lista de 162 erros de concepção.
- Hermans, F. et al. *Thinking Out of the Box: Comparing Metaphors for Variables in Programming Education*. WiPSCE 2018. https://www.felienne.com/archives/6063
- Boustedt, J. et al. *Threshold Concepts in Computer Science: Do They Exist and Are They Useful?* SIGCSE 2007, p. 504–508. https://doi.org/10.1145/1227310.1227482
- Ahadi, A.; Prior, J.; Behbood, V.; Lister, R. *A Quantitative Study of the Relative Difficulty for Novices of Writing Seven Different Types of SQL Queries*. ITiCSE 2015; e *Students' Semantic Mistakes in Writing Seven Different Types of SQL Queries*. ITiCSE 2016.
- Taipalus, T.; Siponen, M.; Vartiainen, T. *Errors and Complications in SQL Query Formulation*. ACM TOCE 18(3), 2018. https://doi.org/10.1145/3231712
- Miedema, D.; Aivaloglou, E.; Fletcher, G. *Identifying SQL Misconceptions of Novices: Findings from a Think-Aloud Study*. ICER 2021. https://doi.org/10.1145/3446871.3469759
- Zingaro, D. et al. *Identifying Student Difficulties with Basic Data Structures*. ICER 2018. https://doi.org/10.1145/3230977.3231005
- Karpierz, K.; Wolfman, S. A. *Misconceptions and Concept Inventory Questions for Binary Search Trees and Hash Tables*. SIGCSE 2014. https://doi.org/10.1145/2538862.2538902
- Porter, L. et al. *BDSI: A Validated Concept Inventory for Basic Data Structures*. ICER 2019. https://doi.org/10.1145/3291279.3339404
- Götschi, T.; Sanders, I.; Galpin, V. *Mental Models of Recursion*. SIGCSE 2003; Kahney, H. *What Do Novice Programmers Know About Recursion?* (1983/1989).
- Singh, A. et al. *Investigating Student Mistakes in Introductory Data Science Programming*. SIGCSE 2024.
- GAISE II: *Pre-K–12 Guidelines for Assessment and Instruction in Statistics Education II*. ASA e NCTM, 2020.
- Adhikari, A.; DeNero, J.; Wagner, D. *Computational and Inferential Thinking* (Data 8). https://inferentialthinking.com
- Data 100, UC Berkeley: notas do curso. https://ds100.org/course-notes/
- Miller, B.; Ranum, D. *Problem Solving with Algorithms and Data Structures using Python*. Runestone Academy.
- CS50's Introduction to Programming with Python. https://cs50.harvard.edu/python/
- Severance, C. *Python for Everybody*. https://www.py4e.com/
- Downey, A. *Think Python*, 3ª ed. https://allendowney.github.io/ThinkPython/
- Deisenroth, M.; Faisal, A.; Ong, C. S. *Mathematics for Machine Learning*. Cambridge, 2020. https://mml-book.com
- Guo, P. *Online Python Tutor: Embeddable Web-Based Program Visualization for CS Education*. SIGCSE 2013.

Repositórios usados na parte visual da apostila: Devicon (logos, licença MIT, github.com/devicons/devicon), Simple Icons (logos de DuckDB, dbt e Polars, CC0, github.com/simple-icons/simple-icons) e highlight.js (realce de código, BSD-3, github.com/highlightjs/highlight.js). As marcas pertencem aos seus donos e aparecem só para identificar cada tecnologia.
