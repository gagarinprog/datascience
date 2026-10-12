// Gerado por tutor/gerar_percurso.py a partir do docs/05. Não edite à mão.
window.MATERIAS = [
 {
  "sigla": "LOG",
  "nome": "Lógica de programação",
  "modulos": [
   {
    "codigo": "LOG.01",
    "nome": "Algoritmo",
    "conceitos": [
     "o que é algoritmo",
     "entrada, processamento e saída",
     "pseudocódigo",
     "fluxograma",
     "teste de mesa"
    ],
    "dominio": "Escrever o algoritmo de um problema do dia a dia e testá-lo à mão"
   },
   {
    "codigo": "LOG.02",
    "nome": "Variáveis e tipos",
    "conceitos": [
     "variável como nome para um valor",
     "atribuição",
     "tipos primitivos",
     "conversão de tipo",
     "constantes"
    ],
    "dominio": "Prever o valor de cada variável após uma sequência de atribuições"
   },
   {
    "codigo": "LOG.03",
    "nome": "Operadores e expressões",
    "conceitos": [
     "aritméticos",
     "divisão inteira e resto",
     "relacionais",
     "lógicos (e, ou, não)",
     "precedência",
     "curto-circuito"
    ],
    "dominio": "Avaliar à mão expressões mistas sem errar a precedência"
   },
   {
    "codigo": "LOG.04",
    "nome": "Lógica booleana",
    "conceitos": [
     "tabela-verdade",
     "leis de De Morgan",
     "simplificar condições",
     "condição composta"
    ],
    "dominio": "Reescrever uma condição negada usando De Morgan"
   },
   {
    "codigo": "LOG.05",
    "nome": "Decisão",
    "conceitos": [
     "se e senão",
     "decisões encadeadas",
     "escolha múltipla",
     "casos de borda"
    ],
    "dominio": "Classificar entradas em faixas sem lacunas nem sobreposições"
   },
   {
    "codigo": "LOG.06",
    "nome": "Repetição",
    "conceitos": [
     "laço com contador",
     "laço com condição",
     "acumulador",
     "contador",
     "sentinela",
     "laços aninhados",
     "parada e laço infinito"
    ],
    "dominio": "Resolver problemas de soma, contagem, máximo e busca com laços"
   },
   {
    "codigo": "LOG.07",
    "nome": "Funções",
    "conceitos": [
     "definir e chamar",
     "parâmetros e retorno",
     "escopo",
     "efeito colateral",
     "função pura"
    ],
    "dominio": "Quebrar um programa em funções que se testam separadas"
   },
   {
    "codigo": "LOG.08",
    "nome": "Decomposição",
    "conceitos": [
     "dividir o problema",
     "resolver o caso pequeno primeiro",
     "refinamento sucessivo"
    ],
    "dominio": "Partir um enunciado médio em subproblemas e implementar"
   },
   {
    "codigo": "LOG.09",
    "nome": "Depuração",
    "conceitos": [
     "ler mensagem de erro",
     "erro de sintaxe, de execução e de lógica",
     "imprimir para investigar",
     "isolar o erro"
    ],
    "dominio": "Achar e corrigir três erros diferentes num programa curto"
   }
  ]
 },
 {
  "sigla": "PY",
  "nome": "Python",
  "modulos": [
   {
    "codigo": "PY.01",
    "nome": "Primeiros passos",
    "conceitos": [
     "interpretador e REPL",
     "script",
     "print e input",
     "comentários",
     "indentação como bloco",
     "PEP 8"
    ],
    "dominio": "Escrever e rodar um script que lê dados e responde"
   },
   {
    "codigo": "PY.02",
    "nome": "Números e textos",
    "conceitos": [
     "int, float, bool",
     "str como sequência",
     "fatiamento",
     "métodos de string",
     "f-strings",
     "imutabilidade"
    ],
    "dominio": "Limpar e formatar uma lista de nomes e valores"
   },
   {
    "codigo": "PY.03",
    "nome": "Listas e tuplas",
    "conceitos": [
     "lista",
     "índice negativo",
     "fatias",
     "métodos",
     "mutabilidade",
     "tupla",
     "desempacotamento"
    ],
    "dominio": "Manipular listas sem confundir cópia e referência"
   },
   {
    "codigo": "PY.04",
    "nome": "Dicionários e conjuntos",
    "conceitos": [
     "dicionário",
     "chave e valor",
     "iterar items()",
     "get com padrão",
     "conjunto",
     "operações de conjunto"
    ],
    "dominio": "Contar ocorrências e agrupar valores com dicionário"
   },
   {
    "codigo": "PY.05",
    "nome": "Referências e mutabilidade",
    "conceitos": [
     "nome aponta para objeto",
     "is e ==",
     "apelidos (aliasing)",
     "cópia rasa e profunda",
     "argumento padrão mutável"
    ],
    "dominio": "Explicar um bug causado por lista compartilhada"
   },
   {
    "codigo": "PY.06",
    "nome": "Funções a fundo",
    "conceitos": [
     "argumentos posicionais e nomeados",
     "*args e **kwargs",
     "lambda",
     "funções como valor",
     "sorted com key",
     "closures"
    ],
    "dominio": "Ordenar e filtrar registros passando funções"
   },
   {
    "codigo": "PY.07",
    "nome": "Compreensões e iteração",
    "conceitos": [
     "compreensão de lista, dicionário e conjunto",
     "enumerate",
     "zip",
     "iteradores",
     "geradores e yield"
    ],
    "dominio": "Reescrever laços em compreensões legíveis e processar dado grande com gerador"
   },
   {
    "codigo": "PY.08",
    "nome": "Erros e exceções",
    "conceitos": [
     "try, except, else, finally",
     "exceções comuns",
     "lançar exceção",
     "validar entrada"
    ],
    "dominio": "Tornar um programa robusto a entradas ruins"
   },
   {
    "codigo": "PY.09",
    "nome": "Arquivos",
    "conceitos": [
     "abrir com with",
     "modos de abertura",
     "ler linha a linha",
     "escrever",
     "codificação",
     "pathlib"
    ],
    "dominio": "Ler um arquivo de texto, processar e gravar o resultado"
   },
   {
    "codigo": "PY.10",
    "nome": "Módulos e pacotes",
    "conceitos": [
     "import",
     "módulos da biblioteca padrão (math, random, datetime, collections, itertools, json, csv, re)",
     "criar o seu módulo",
     "if __name__ == \"__main__\""
    ],
    "dominio": "Organizar um programa em dois módulos"
   },
   {
    "codigo": "PY.11",
    "nome": "Classes em Python",
    "conceitos": [
     "classe e objeto",
     "__init__",
     "atributos e métodos",
     "__repr__ e __str__",
     "dataclass"
    ],
    "dominio": "Modelar registros do domínio com dataclass"
   },
   {
    "codigo": "PY.12",
    "nome": "Tipagem e qualidade",
    "conceitos": [
     "anotações de tipo",
     "mypy (conceito)",
     "docstrings",
     "nomes bons",
     "funções pequenas"
    ],
    "dominio": "Anotar e documentar um módulo existente"
   },
   {
    "codigo": "PY.13",
    "nome": "Testes",
    "conceitos": [
     "assert",
     "pytest",
     "caso normal, de borda e de erro",
     "testar antes de corrigir"
    ],
    "dominio": "Escrever testes que pegam um bug antes da correção"
   },
   {
    "codigo": "PY.14",
    "nome": "Expressões regulares",
    "conceitos": [
     "classes de caracteres",
     "quantificadores",
     "grupos",
     "findall, sub",
     "validar e extrair"
    ],
    "dominio": "Extrair datas, valores e e-mails de texto livre"
   }
  ]
 },
 {
  "sigla": "CMP",
  "nome": "Como o computador funciona",
  "modulos": [
   {
    "codigo": "CMP.01",
    "nome": "Representação numérica",
    "conceitos": [
     "bit e byte",
     "base 2, 10 e 16",
     "conversão entre bases",
     "inteiros com sinal (complemento de dois)",
     "estouro (overflow)",
     "ponto flutuante (IEEE 754) e arredondamento"
    ],
    "dominio": "Converter números entre bases e explicar por que 0.1 + 0.2 != 0.3"
   },
   {
    "codigo": "CMP.02",
    "nome": "Texto",
    "conceitos": [
     "caractere e código",
     "ASCII",
     "Unicode",
     "UTF-8 e Latin-1",
     "\"mojibake\" (acento quebrado)",
     "normalização de acentos"
    ],
    "dominio": "Diagnosticar e corrigir um arquivo com acentos quebrados"
   },
   {
    "codigo": "CMP.03",
    "nome": "Lógica digital",
    "conceitos": [
     "portas lógicas",
     "tabela-verdade",
     "circuitos combinacionais",
     "somador"
    ],
    "dominio": "Montar a tabela-verdade de um circuito pequeno"
   },
   {
    "codigo": "CMP.04",
    "nome": "Arquitetura",
    "conceitos": [
     "CPU, memória e armazenamento",
     "hierarquia de memória e cache",
     "ciclo de instrução",
     "32 e 64 bits"
    ],
    "dominio": "Explicar por que ler do disco é mais lento que da memória e o que isso muda numa análise"
   },
   {
    "codigo": "CMP.05",
    "nome": "Sistemas operacionais",
    "conceitos": [
     "processo e thread",
     "memória virtual",
     "sistema de arquivos",
     "caminhos absolutos e relativos",
     "permissões"
    ],
    "dominio": "Navegar e organizar arquivos por caminho sem interface gráfica"
   },
   {
    "codigo": "CMP.06",
    "nome": "Redes e web",
    "conceitos": [
     "IP, DNS e portas",
     "cliente e servidor",
     "HTTP (métodos, códigos de status, cabeçalhos)",
     "HTTPS",
     "o que é uma API"
    ],
    "dominio": "Ler uma resposta HTTP e dizer o que aconteceu"
   },
   {
    "codigo": "CMP.07",
    "nome": "Como o código roda",
    "conceitos": [
     "compilador, interpretador e bytecode",
     "máquina virtual (JVM, CPython)"
    ],
    "dominio": "Explicar a diferença entre executar Java e Python"
   }
  ]
 },
 {
  "sigla": "BD",
  "nome": "Banco de dados e SQL",
  "modulos": [
   {
    "codigo": "BD.01",
    "nome": "Por que bancos",
    "conceitos": [
     "dado, informação e SGBD",
     "problemas de planilhas e arquivos soltos",
     "independência de dados",
     "arquitetura de três esquemas"
    ],
    "dominio": "Explicar o que um SGBD resolve que uma planilha não resolve"
   },
   {
    "codigo": "BD.02",
    "nome": "Modelo relacional",
    "conceitos": [
     "relação, tupla e atributo",
     "domínio",
     "esquema e instância",
     "chave candidata, primária e estrangeira",
     "integridade de entidade e referencial"
    ],
    "dominio": "Identificar as chaves e as ligações do esquema da Apostila Viva"
   },
   {
    "codigo": "BD.03",
    "nome": "Primeira consulta",
    "conceitos": [
     "SELECT e FROM",
     "colunas e *",
     "apelido com AS",
     "expressões",
     "DISTINCT"
    ],
    "dominio": "Responder perguntas simples numa tabela"
   },
   {
    "codigo": "BD.04",
    "nome": "Filtrar",
    "conceitos": [
     "WHERE",
     "comparação",
     "AND, OR, NOT e precedência",
     "IN",
     "BETWEEN",
     "LIKE",
     "aspas simples para texto"
    ],
    "dominio": "Escrever filtros compostos sem erro de aspas nem de precedência"
   },
   {
    "codigo": "BD.05",
    "nome": "NULL",
    "conceitos": [
     "o que é NULL",
     "lógica de três valores",
     "IS NULL",
     "NULL em comparações e contas",
     "COALESCE"
    ],
    "dominio": "Prever o resultado de filtros com NULL"
   },
   {
    "codigo": "BD.06",
    "nome": "Ordenar e limitar",
    "conceitos": [
     "ORDER BY com várias colunas",
     "ASC e DESC",
     "LIMIT e OFFSET",
     "onde ficam os NULL"
    ],
    "dominio": "Montar rankings e páginas de resultado"
   },
   {
    "codigo": "BD.07",
    "nome": "Agregação",
    "conceitos": [
     "COUNT, SUM, AVG, MIN, MAX",
     "COUNT(*) e COUNT(coluna)",
     "GROUP BY",
     "HAVING",
     "ordem lógica de execução"
    ],
    "dominio": "Resumir dados por grupo e filtrar grupos"
   },
   {
    "codigo": "BD.08",
    "nome": "Junções",
    "conceitos": [
     "produto cartesiano",
     "INNER JOIN",
     "LEFT JOIN",
     "RIGHT e FULL JOIN",
     "autojunção",
     "junção com várias tabelas",
     "linhas duplicadas por junção"
    ],
    "dominio": "Cruzar as quatro tabelas da Apostila Viva sem perder nem duplicar linhas"
   },
   {
    "codigo": "BD.09",
    "nome": "Subconsultas",
    "conceitos": [
     "subconsulta escalar",
     "em WHERE com IN e EXISTS",
     "correlacionada",
     "em FROM"
    ],
    "dominio": "Resolver a mesma pergunta com junção e com subconsulta"
   },
   {
    "codigo": "BD.10",
    "nome": "Operações de conjunto",
    "conceitos": [
     "UNION e UNION ALL",
     "INTERSECT",
     "EXCEPT",
     "compatibilidade de colunas"
    ],
    "dominio": "Comparar dois conjuntos de alunos ou questões"
   },
   {
    "codigo": "BD.11",
    "nome": "Funções úteis",
    "conceitos": [
     "texto (UPPER, SUBSTR, TRIM, concatenação)",
     "datas",
     "CASE WHEN",
     "conversão de tipo"
    ],
    "dominio": "Criar faixas e rótulos dentro da consulta"
   },
   {
    "codigo": "BD.12",
    "nome": "Modelagem conceitual",
    "conceitos": [
     "entidade, atributo, relacionamento",
     "cardinalidade (1:1, 1:N, N:M)",
     "entidade fraca",
     "diagrama ER",
     "passar do ER para tabelas"
    ],
    "dominio": "Modelar um caso pequeno do zero e gerar as tabelas"
   },
   {
    "codigo": "BD.13",
    "nome": "Normalização",
    "conceitos": [
     "dependência funcional",
     "anomalias de inserção, atualização e remoção",
     "1FN, 2FN, 3FN e FNBC",
     "quando desnormalizar"
    ],
    "dominio": "Levar uma tabela \"planilhão\" até a 3FN"
   },
   {
    "codigo": "BD.14",
    "nome": "Criar e alterar",
    "conceitos": [
     "CREATE TABLE",
     "tipos de dados",
     "restrições (PRIMARY KEY, FOREIGN KEY, NOT NULL, UNIQUE, CHECK)",
     "INSERT, UPDATE, DELETE",
     "ALTER TABLE"
    ],
    "dominio": "Criar o esquema da Apostila Viva com todas as restrições"
   },
   {
    "codigo": "BD.15",
    "nome": "SQL analítico",
    "conceitos": [
     "CTE com WITH",
     "CTE recursiva",
     "funções de janela (ROW_NUMBER, RANK, LAG, LEAD, somas acumuladas, PARTITION BY)"
    ],
    "dominio": "Calcular ranking por disciplina e evolução das respostas no tempo"
   },
   {
    "codigo": "BD.16",
    "nome": "Transações",
    "conceitos": [
     "ACID",
     "BEGIN, COMMIT, ROLLBACK",
     "concorrência",
     "níveis de isolamento e anomalias (leitura suja, não repetível, fantasma)"
    ],
    "dominio": "Explicar o que acontece com duas transferências simultâneas"
   },
   {
    "codigo": "BD.17",
    "nome": "Desempenho",
    "conceitos": [
     "índice e árvore B",
     "quando o índice ajuda e quando atrapalha",
     "plano de execução (EXPLAIN)",
     "seletividade"
    ],
    "dominio": "Ler um plano de execução e propor um índice"
   },
   {
    "codigo": "BD.18",
    "nome": "Álgebra relacional",
    "conceitos": [
     "seleção, projeção, junção, união, diferença, renomeação",
     "equivalência com SQL"
    ],
    "dominio": "Traduzir consultas entre álgebra relacional e SQL (cai em concurso)"
   },
   {
    "codigo": "BD.19",
    "nome": "Visões, permissões e rotinas",
    "conceitos": [
     "VIEW",
     "GRANT e REVOKE",
     "procedimentos e gatilhos (conceito)"
    ],
    "dominio": "Criar uma visão para um relatório recorrente"
   },
   {
    "codigo": "BD.20",
    "nome": "Analítico e transacional",
    "conceitos": [
     "OLTP e OLAP",
     "data warehouse",
     "modelo estrela e floco de neve",
     "fato e dimensão",
     "ETL e ELT"
    ],
    "dominio": "Desenhar um modelo estrela para as respostas da Apostila Viva"
   }
  ]
 },
 {
  "sigla": "MAT",
  "nome": "Matemática para dados",
  "modulos": [
   {
    "codigo": "MAT.01",
    "nome": "Conjuntos e funções",
    "conceitos": [
     "conjunto, pertinência, operações",
     "produto cartesiano",
     "função, domínio e imagem",
     "composição",
     "inversa"
    ],
    "dominio": "Resolver problemas de conjuntos e composição"
   },
   {
    "codigo": "MAT.02",
    "nome": "Lógica proposicional",
    "conceitos": [
     "proposição",
     "conectivos",
     "tabela-verdade",
     "tautologia e contradição",
     "equivalências",
     "implicação e contrapositiva",
     "quantificadores"
    ],
    "dominio": "Resolver itens de lógica no estilo Cebraspe"
   },
   {
    "codigo": "MAT.03",
    "nome": "Contagem",
    "conceitos": [
     "princípio multiplicativo",
     "permutação",
     "arranjo",
     "combinação",
     "com e sem reposição"
    ],
    "dominio": "Contar casos sem fórmula decorada, pela lógica"
   },
   {
    "codigo": "MAT.04",
    "nome": "Vetores",
    "conceitos": [
     "vetor como seta e como lista",
     "soma",
     "múltiplo",
     "norma",
     "produto interno",
     "ângulo",
     "projeção"
    ],
    "dominio": "Calcular similaridade de cosseno entre dois vetores e interpretar"
   },
   {
    "codigo": "MAT.05",
    "nome": "Matrizes",
    "conceitos": [
     "operações",
     "produto de matrizes",
     "transposta",
     "identidade",
     "inversa",
     "matriz como transformação"
    ],
    "dominio": "Multiplicar matrizes à mão e com NumPy e interpretar como transformação"
   },
   {
    "codigo": "MAT.06",
    "nome": "Sistemas lineares",
    "conceitos": [
     "escalonamento",
     "posto",
     "solução única, infinitas ou nenhuma",
     "determinante"
    ],
    "dominio": "Resolver e classificar sistemas"
   },
   {
    "codigo": "MAT.07",
    "nome": "Espaços vetoriais",
    "conceitos": [
     "combinação linear",
     "independência linear",
     "base",
     "dimensão",
     "subespaço"
    ],
    "dominio": "Decidir se um conjunto de vetores é base"
   },
   {
    "codigo": "MAT.08",
    "nome": "Mínimos quadrados",
    "conceitos": [
     "projeção em subespaço",
     "equações normais",
     "ligação com regressão linear"
    ],
    "dominio": "Ajustar uma reta por mínimos quadrados à mão e em código"
   },
   {
    "codigo": "MAT.09",
    "nome": "Autovalores e decomposições",
    "conceitos": [
     "autovalor e autovetor",
     "diagonalização",
     "SVD",
     "PCA como rotação para as direções de maior variância"
    ],
    "dominio": "Reduzir dados a duas dimensões com PCA e interpretar os componentes"
   },
   {
    "codigo": "MAT.10",
    "nome": "Cálculo para otimização",
    "conceitos": [
     "derivada como taxa",
     "regras de derivação",
     "regra da cadeia",
     "derivada parcial",
     "gradiente",
     "descida do gradiente",
     "integral como área (intuição)"
    ],
    "dominio": "Implementar descida do gradiente para ajustar uma reta"
   }
  ]
 },
 {
  "sigla": "EST",
  "nome": "Probabilidade e estatística",
  "modulos": [
   {
    "codigo": "EST.01",
    "nome": "Tipos de dado e coleta",
    "conceitos": [
     "variável qualitativa e quantitativa",
     "nominal, ordinal, discreta, contínua",
     "população e amostra",
     "estudo observacional e experimento"
    ],
    "dominio": "Classificar variáveis e dizer o que um estudo permite concluir"
   },
   {
    "codigo": "EST.02",
    "nome": "Estatística descritiva",
    "conceitos": [
     "média, mediana e moda",
     "amplitude",
     "variância e desvio-padrão",
     "quartis e intervalo interquartil",
     "valores atípicos",
     "assimetria"
    ],
    "dominio": "Resumir uma variável e escolher a medida certa para dados assimétricos"
   },
   {
    "codigo": "EST.03",
    "nome": "Probabilidade",
    "conceitos": [
     "espaço amostral",
     "eventos",
     "regras da soma e do produto",
     "probabilidade condicional",
     "independência",
     "teorema de Bayes"
    ],
    "dominio": "Resolver problemas de Bayes, como teste com falso positivo"
   },
   {
    "codigo": "EST.04",
    "nome": "Variáveis aleatórias",
    "conceitos": [
     "discreta e contínua",
     "função de probabilidade e densidade",
     "esperança",
     "variância",
     "acumulada"
    ],
    "dominio": "Calcular esperança e variância e conferir por simulação"
   },
   {
    "codigo": "EST.05",
    "nome": "Distribuições",
    "conceitos": [
     "Bernoulli",
     "binomial",
     "Poisson",
     "uniforme",
     "normal",
     "exponencial",
     "quando cada uma aparece"
    ],
    "dominio": "Associar fenômenos às distribuições e calcular probabilidades"
   },
   {
    "codigo": "EST.06",
    "nome": "Amostragem",
    "conceitos": [
     "lei dos grandes números",
     "teorema central do limite",
     "distribuição amostral",
     "erro-padrão",
     "amostragem aleatória, estratificada e por conglomerado",
     "viés de seleção"
    ],
    "dominio": "Mostrar o teorema central do limite por simulação"
   },
   {
    "codigo": "EST.07",
    "nome": "Estimação",
    "conceitos": [
     "estimador",
     "viés e variância",
     "intervalo de confiança",
     "interpretação correta"
    ],
    "dominio": "Construir e interpretar um intervalo de confiança sem o erro clássico de interpretação"
   },
   {
    "codigo": "EST.08",
    "nome": "Testes de hipótese",
    "conceitos": [
     "hipóteses nula e alternativa",
     "estatística de teste",
     "p-valor",
     "nível de significância",
     "erros tipo I e II",
     "poder",
     "teste t",
     "qui-quadrado",
     "múltiplos testes"
    ],
    "dominio": "Fazer um teste de duas médias e explicar o p-valor corretamente"
   },
   {
    "codigo": "EST.09",
    "nome": "Reamostragem",
    "conceitos": [
     "bootstrap",
     "teste de permutação",
     "quando usar"
    ],
    "dominio": "Fazer um intervalo por bootstrap e comparar com o teórico"
   },
   {
    "codigo": "EST.10",
    "nome": "Correlação e causalidade",
    "conceitos": [
     "covariância",
     "correlação de Pearson e de Spearman",
     "confusão",
     "paradoxo de Simpson",
     "experimento aleatorizado",
     "teste A/B"
    ],
    "dominio": "Explicar por que uma correlação observada não prova causa, com um exemplo de confusão"
   },
   {
    "codigo": "EST.11",
    "nome": "Regressão linear",
    "conceitos": [
     "regressão simples e múltipla",
     "interpretação de coeficientes",
     "R²",
     "resíduos",
     "suposições",
     "variáveis categóricas",
     "interação"
    ],
    "dominio": "Ajustar e interpretar uma regressão e diagnosticar pelos resíduos"
   },
   {
    "codigo": "EST.12",
    "nome": "Além do básico",
    "conceitos": [
     "regressão logística (interpretação)",
     "ANOVA",
     "séries temporais (tendência, sazonalidade, autocorrelação)",
     "inferência bayesiana (introdução)"
    ],
    "dominio": "Ler a saída de uma regressão logística e explicar os coeficientes"
   }
  ]
 },
 {
  "sigla": "ED",
  "nome": "Estruturas de dados",
  "modulos": [
   {
    "codigo": "ED.01",
    "nome": "Tipos abstratos",
    "conceitos": [
     "tipo abstrato de dados",
     "interface e implementação",
     "operações e custos"
    ],
    "dominio": "Descrever uma estrutura pelas operações e custos, sem falar de código"
   },
   {
    "codigo": "ED.02",
    "nome": "Vetores",
    "conceitos": [
     "vetor contíguo",
     "acesso por índice em O(1)",
     "inserção no meio em O(n)",
     "vetor dinâmico e realocação"
    ],
    "dominio": "Explicar por que append é rápido e insert(0, x) é lento"
   },
   {
    "codigo": "ED.03",
    "nome": "Listas ligadas",
    "conceitos": [
     "nó e ponteiro",
     "lista simples, dupla e circular",
     "inserção e remoção",
     "comparação com vetor"
    ],
    "dominio": "Implementar inserção e remoção numa lista ligada"
   },
   {
    "codigo": "ED.04",
    "nome": "Pilhas",
    "conceitos": [
     "LIFO",
     "empilhar e desempilhar",
     "pilha de chamadas",
     "parênteses balanceados",
     "notação pós-fixa"
    ],
    "dominio": "Validar expressões com parênteses usando pilha"
   },
   {
    "codigo": "ED.05",
    "nome": "Filas",
    "conceitos": [
     "FIFO",
     "fila circular",
     "deque",
     "fila de prioridade (conceito)"
    ],
    "dominio": "Simular uma fila de atendimento"
   },
   {
    "codigo": "ED.06",
    "nome": "Tabelas hash",
    "conceitos": [
     "função de espalhamento",
     "colisão",
     "encadeamento",
     "endereçamento aberto",
     "fator de carga",
     "por que dict é O(1) em média"
    ],
    "dominio": "Calcular posições, tratar colisões e explicar o custo médio"
   },
   {
    "codigo": "ED.07",
    "nome": "Árvores",
    "conceitos": [
     "raiz, folha, altura, nível",
     "árvore binária",
     "percursos (pré, em e pós-ordem",
     "por nível)"
    ],
    "dominio": "Percorrer uma árvore à mão nos quatro percursos"
   },
   {
    "codigo": "ED.08",
    "nome": "Árvore binária de busca",
    "conceitos": [
     "propriedade de ordem",
     "busca, inserção e remoção",
     "árvore degenerada"
    ],
    "dominio": "Inserir e remover numa ABB e prever o formato"
   },
   {
    "codigo": "ED.09",
    "nome": "Árvores balanceadas",
    "conceitos": [
     "AVL e fator de balanceamento",
     "rotações",
     "árvore B e o índice de banco"
    ],
    "dominio": "Explicar por que o índice de um banco é uma árvore B"
   },
   {
    "codigo": "ED.10",
    "nome": "Heaps",
    "conceitos": [
     "heap mínimo e máximo",
     "subir e descer",
     "fila de prioridade",
     "heapq"
    ],
    "dominio": "Manter os k maiores valores de um fluxo com heap"
   },
   {
    "codigo": "ED.11",
    "nome": "Grafos",
    "conceitos": [
     "vértice e aresta",
     "dirigido e ponderado",
     "lista e matriz de adjacência"
    ],
    "dominio": "Representar uma rede pequena nas duas formas"
   },
   {
    "codigo": "ED.12",
    "nome": "Matrizes",
    "conceitos": [
     "matriz densa e esparsa",
     "armazenamento por linha e por coluna",
     "por que o pandas e o NumPy são colunares"
    ],
    "dominio": "Escolher a representação certa para uma matriz quase toda de zeros"
   }
  ]
 },
 {
  "sigla": "ALG",
  "nome": "Algoritmos e complexidade",
  "modulos": [
   {
    "codigo": "ALG.01",
    "nome": "Custo",
    "conceitos": [
     "contar operações",
     "melhor, pior e caso médio",
     "notação O",
     "classes comuns (1, log n, n, n log n, n², 2ⁿ)",
     "custo de memória"
    ],
    "dominio": "Dar a complexidade de trechos de código e justificar"
   },
   {
    "codigo": "ALG.02",
    "nome": "Busca",
    "conceitos": [
     "busca linear",
     "busca binária",
     "pré-condição de ordenação"
    ],
    "dominio": "Implementar a busca binária sem erro de limite"
   },
   {
    "codigo": "ALG.03",
    "nome": "Ordenação simples",
    "conceitos": [
     "seleção",
     "inserção",
     "bolha",
     "estabilidade"
    ],
    "dominio": "Rastrear cada algoritmo numa lista pequena"
   },
   {
    "codigo": "ALG.04",
    "nome": "Recursão",
    "conceitos": [
     "caso base e passo",
     "pilha de chamadas",
     "recursão e iteração",
     "recursão de cauda (conceito)"
    ],
    "dominio": "Escrever funções recursivas corretas e rastreá-las"
   },
   {
    "codigo": "ALG.05",
    "nome": "Dividir e conquistar",
    "conceitos": [
     "merge sort",
     "quicksort e pivô",
     "custo n log n"
    ],
    "dominio": "Explicar quando o quicksort degrada"
   },
   {
    "codigo": "ALG.06",
    "nome": "Ordenação por contagem",
    "conceitos": [
     "counting sort",
     "limite de n log n para comparação"
    ],
    "dominio": "Dizer quando dá para ordenar em tempo linear"
   },
   {
    "codigo": "ALG.07",
    "nome": "Gulosos",
    "conceitos": [
     "escolha gulosa",
     "troco",
     "agendamento de intervalos",
     "quando falha"
    ],
    "dominio": "Mostrar um caso em que o guloso erra"
   },
   {
    "codigo": "ALG.08",
    "nome": "Programação dinâmica",
    "conceitos": [
     "subproblemas sobrepostos",
     "memorização",
     "tabela",
     "mochila e maior subsequência comum (introdução)"
    ],
    "dominio": "Transformar uma recursão lenta numa solução memorizada"
   },
   {
    "codigo": "ALG.09",
    "nome": "Grafos",
    "conceitos": [
     "busca em largura",
     "busca em profundidade",
     "caminho mínimo (Dijkstra)",
     "ordenação topológica"
    ],
    "dominio": "Achar o caminho mínimo num grafo pequeno à mão e em código"
   },
   {
    "codigo": "ALG.10",
    "nome": "Medir na prática",
    "conceitos": [
     "timeit",
     "crescimento empírico",
     "vetorização como algoritmo melhor"
    ],
    "dominio": "Comparar duas soluções medindo o tempo para tamanhos crescentes"
   }
  ]
 },
 {
  "sigla": "POO",
  "nome": "Orientação a objetos",
  "modulos": [
   {
    "codigo": "POO.01",
    "nome": "Classe e objeto",
    "conceitos": [
     "estado e comportamento",
     "construtor",
     "instância",
     "referência",
     "this e self"
    ],
    "dominio": "Modelar uma entidade nas duas linguagens"
   },
   {
    "codigo": "POO.02",
    "nome": "Encapsulamento",
    "conceitos": [
     "modificadores de acesso",
     "getters e setters",
     "invariantes"
    ],
    "dominio": "Proteger as regras de uma classe"
   },
   {
    "codigo": "POO.03",
    "nome": "Herança",
    "conceitos": [
     "superclasse e subclasse",
     "extends",
     "super",
     "sobrescrita"
    ],
    "dominio": "Montar uma hierarquia pequena sem repetição"
   },
   {
    "codigo": "POO.04",
    "nome": "Polimorfismo",
    "conceitos": [
     "sobrescrita e sobrecarga",
     "ligação dinâmica",
     "tratar tipos diferentes pela mesma interface"
    ],
    "dominio": "Corrigir uma lista de questões de tipos diferentes sem nenhum if de tipo"
   },
   {
    "codigo": "POO.05",
    "nome": "Abstração e interfaces",
    "conceitos": [
     "classe abstrata",
     "interface",
     "contrato",
     "composição e herança"
    ],
    "dominio": "Decidir entre herança e composição em três casos"
   },
   {
    "codigo": "POO.06",
    "nome": "Java essencial",
    "conceitos": [
     "JVM e bytecode",
     "tipos primitivos e referência",
     "== e equals",
     "String",
     "static",
     "exceções verificadas"
    ],
    "dominio": "Prever a saída de programas Java típicos de prova"
   },
   {
    "codigo": "POO.07",
    "nome": "Coleções",
    "conceitos": [
     "ArrayList, HashMap, HashSet em Java",
     "equivalentes em Python",
     "genéricos"
    ],
    "dominio": "Escolher a coleção certa em Java e em Python"
   },
   {
    "codigo": "POO.08",
    "nome": "Princípios de projeto",
    "conceitos": [
     "coesão e acoplamento",
     "responsabilidade única",
     "padrões comuns (estratégia, fábrica) em nível de conceito"
    ],
    "dominio": "Refatorar uma classe que faz coisas demais"
   }
  ]
 },
 {
  "sigla": "ENG",
  "nome": "Ferramentas do ofício",
  "modulos": [
   {
    "codigo": "ENG.01",
    "nome": "Terminal",
    "conceitos": [
     "diretório atual",
     "ls, cd, mkdir, cp, mv, rm",
     "caminhos",
     "cat, head, grep, wc",
     "redirecionamento e encadeamento"
    ],
    "dominio": "Achar e filtrar arquivos e linhas só pelo terminal"
   },
   {
    "codigo": "ENG.02",
    "nome": "Git",
    "conceitos": [
     "repositório",
     "add e commit",
     "histórico",
     "diff",
     "desfazer com segurança"
    ],
    "dominio": "Versionar um projeto e voltar a uma versão anterior"
   },
   {
    "codigo": "ENG.03",
    "nome": "Git em equipe",
    "conceitos": [
     "ramos",
     "merge",
     "conflito",
     "GitHub",
     "pull request",
     "revisão"
    ],
    "dominio": "Resolver um conflito de merge"
   },
   {
    "codigo": "ENG.04",
    "nome": "Ambientes",
    "conceitos": [
     "ambiente virtual",
     "dependências e versões",
     "requirements e arquivo de projeto",
     "por que \"na minha máquina funciona\""
    ],
    "dominio": "Recriar o ambiente de um projeto do zero"
   },
   {
    "codigo": "ENG.05",
    "nome": "Jupyter e editor",
    "conceitos": [
     "células",
     "ordem de execução e estado oculto",
     "quando sair do notebook para módulo"
    ],
    "dominio": "Achar o erro causado por células rodadas fora de ordem"
   },
   {
    "codigo": "ENG.06",
    "nome": "Projeto de dados",
    "conceitos": [
     "estrutura de pastas",
     "dados brutos imutáveis",
     "configuração separada do código",
     "README"
    ],
    "dominio": "Organizar um projeto que outra pessoa consiga rodar"
   },
   {
    "codigo": "ENG.07",
    "nome": "Qualidade",
    "conceitos": [
     "testes",
     "validação de dados",
     "registro de execução (logging)",
     "revisão de código"
    ],
    "dominio": "Pôr testes e validação num pipeline de análise"
   },
   {
    "codigo": "ENG.08",
    "nome": "Pipelines",
    "conceitos": [
     "ETL e ELT",
     "tarefa e dependência",
     "agendamento",
     "idempotência",
     "orquestrador (conceito: Airflow)",
     "transformação em SQL versionado (conceito: dbt)"
    ],
    "dominio": "Desenhar um pipeline diário idempotente"
   },
   {
    "codigo": "ENG.09",
    "nome": "Contêineres e nuvem",
    "conceitos": [
     "contêiner e imagem (Docker)",
     "armazenamento de objetos",
     "computação sob demanda",
     "permissões",
     "custo"
    ],
    "dominio": "Explicar como empacotar uma análise para rodar em outro lugar"
   },
   {
    "codigo": "ENG.10",
    "nome": "Processo de software",
    "conceitos": [
     "requisitos",
     "ciclo de vida",
     "métodos ágeis (Scrum, Kanban)",
     "qualidade e testes",
     "documentação"
    ],
    "dominio": "Resolver itens de engenharia de software no estilo Cebraspe"
   }
  ]
 },
 {
  "sigla": "FMT",
  "nome": "Formatos e coleta de dados",
  "modulos": [
   {
    "codigo": "FMT.01",
    "nome": "CSV",
    "conceitos": [
     "separador, aspas e escape",
     "cabeçalho",
     "ponto e vírgula e vírgula decimal (padrão brasileiro)",
     "codificação",
     "módulo csv e pandas.read_csv"
    ],
    "dominio": "Ler sem erro um CSV brasileiro com acentos, ; e vírgula decimal"
   },
   {
    "codigo": "FMT.02",
    "nome": "JSON",
    "conceitos": [
     "objeto, lista e tipos",
     "aninhamento",
     "JSON Lines",
     "achatar estrutura aninhada"
    ],
    "dominio": "Transformar um JSON aninhado em tabela"
   },
   {
    "codigo": "FMT.03",
    "nome": "Excel e planilhas",
    "conceitos": [
     "abas",
     "células mescladas",
     "datas como número",
     "armadilhas de planilha"
    ],
    "dominio": "Extrair uma tabela limpa de uma planilha mal formatada"
   },
   {
    "codigo": "FMT.04",
    "nome": "XML e HTML",
    "conceitos": [
     "árvore de elementos",
     "atributos",
     "seletores",
     "extrair tabela de página"
    ],
    "dominio": "Extrair uma tabela de uma página HTML salva"
   },
   {
    "codigo": "FMT.05",
    "nome": "Parquet e Arrow",
    "conceitos": [
     "formato colunar",
     "esquema e tipos",
     "compressão",
     "partição"
    ],
    "dominio": "Converter CSV para Parquet e comparar tamanho e velocidade"
   },
   {
    "codigo": "FMT.06",
    "nome": "Datas e horas",
    "conceitos": [
     "ISO 8601",
     "fuso horário",
     "data sem hora",
     "datetime",
     "conversão e aritmética de datas"
    ],
    "dominio": "Corrigir uma série com datas em formatos misturados"
   },
   {
    "codigo": "FMT.07",
    "nome": "APIs",
    "conceitos": [
     "REST",
     "requisição e resposta",
     "parâmetros",
     "paginação",
     "autenticação por chave",
     "limites de taxa"
    ],
    "dominio": "Baixar uma série completa de uma API pública paginada"
   },
   {
    "codigo": "FMT.08",
    "nome": "Raspagem",
    "conceitos": [
     "quando é permitido (termos de uso, robots.txt)",
     "requisição",
     "leitura de HTML",
     "respeitar o servidor"
    ],
    "dominio": "Coletar dados de uma página permitida, sem sobrecarregá-la"
   },
   {
    "codigo": "FMT.09",
    "nome": "Dados públicos brasileiros",
    "conceitos": [
     "portal dados.gov.br",
     "API do IBGE",
     "séries do Banco Central (SGS)",
     "microdados do INEP",
     "Portal da Transparência",
     "dicionários de dados"
    ],
    "dominio": "Montar uma base a partir de duas fontes oficiais com dicionário de dados"
   },
   {
    "codigo": "FMT.10",
    "nome": "Texto como dado",
    "conceitos": [
     "tokenização",
     "contagem de palavras",
     "n-gramas",
     "stop words",
     "TF-IDF"
    ],
    "dominio": "Comparar documentos por TF-IDF"
   },
   {
    "codigo": "FMT.11",
    "nome": "Imagem como dado",
    "conceitos": [
     "pixel",
     "canais",
     "matriz e tensor",
     "operações simples"
    ],
    "dominio": "Fazer operações básicas numa imagem como matriz NumPy"
   },
   {
    "codigo": "FMT.12",
    "nome": "Serialização",
    "conceitos": [
     "pickle e seus riscos",
     "JSON para troca",
     "versões de esquema"
    ],
    "dominio": "Escolher formato de troca seguro entre sistemas"
   }
  ]
 },
 {
  "sigla": "AD",
  "nome": "Análise de dados",
  "modulos": [
   {
    "codigo": "AD.01",
    "nome": "NumPy",
    "conceitos": [
     "ndarray",
     "forma e tipo",
     "criação",
     "indexação e fatias",
     "máscara booleana",
     "vetorização",
     "broadcasting",
     "agregações por eixo"
    ],
    "dominio": "Trocar laços por operações vetorizadas e medir o ganho"
   },
   {
    "codigo": "AD.02",
    "nome": "pandas: estruturas",
    "conceitos": [
     "Series e DataFrame",
     "índice",
     "tipos de coluna",
     "ler e inspecionar (head, info, describe)"
    ],
    "dominio": "Carregar e descrever um conjunto de dados novo em minutos"
   },
   {
    "codigo": "AD.03",
    "nome": "Selecionar e filtrar",
    "conceitos": [
     "loc e iloc",
     "filtro booleano",
     "query",
     "criar e transformar colunas",
     "aviso de cópia"
    ],
    "dominio": "Responder perguntas filtrando sem o erro de cópia encadeada"
   },
   {
    "codigo": "AD.04",
    "nome": "Agrupar",
    "conceitos": [
     "groupby",
     "agg com várias funções",
     "transform",
     "tabela dinâmica (pivot_table)",
     "equivalência com SQL"
    ],
    "dominio": "Fazer em pandas a mesma análise feita em SQL e conferir"
   },
   {
    "codigo": "AD.05",
    "nome": "Juntar",
    "conceitos": [
     "merge (tipos de junção)",
     "concat",
     "chaves duplicadas",
     "validar a junção"
    ],
    "dominio": "Juntar tabelas e provar que nenhuma linha se perdeu ou duplicou"
   },
   {
    "codigo": "AD.06",
    "nome": "Arrumar dados",
    "conceitos": [
     "dado arrumado (tidy data)",
     "melt e pivot",
     "colunas com mais de uma informação"
    ],
    "dominio": "Arrumar uma tabela larga de planilha para formato longo"
   },
   {
    "codigo": "AD.07",
    "nome": "Limpeza",
    "conceitos": [
     "dados ausentes (tipos e tratamentos)",
     "duplicados",
     "tipos errados",
     "inconsistência de categorias",
     "valores atípicos",
     "validação de regras"
    ],
    "dominio": "Limpar uma base real e documentar cada decisão"
   },
   {
    "codigo": "AD.08",
    "nome": "Datas e séries",
    "conceitos": [
     "índice de tempo",
     "reamostragem",
     "janelas móveis",
     "defasagem",
     "variação percentual"
    ],
    "dominio": "Calcular a inflação acumulada em 12 meses a partir da série mensal"
   },
   {
    "codigo": "AD.09",
    "nome": "Análise exploratória",
    "conceitos": [
     "perguntas antes dos gráficos",
     "distribuições",
     "relações",
     "segmentação",
     "hipóteses a testar"
    ],
    "dominio": "Fazer uma análise exploratória completa com cinco achados justificados"
   },
   {
    "codigo": "AD.10",
    "nome": "Desempenho e alternativas",
    "conceitos": [
     "memória por tipo",
     "category",
     "leitura em partes",
     "Polars e DuckDB a partir do Python"
    ],
    "dominio": "Analisar um arquivo maior que o confortável sem travar"
   }
  ]
 },
 {
  "sigla": "VIS",
  "nome": "Visualização e comunicação",
  "modulos": [
   {
    "codigo": "VIS.01",
    "nome": "Percepção",
    "conceitos": [
     "posição, comprimento, ângulo e cor",
     "o que o olho compara bem e mal"
    ],
    "dominio": "Ordenar codificações visuais por precisão"
   },
   {
    "codigo": "VIS.02",
    "nome": "Escolher o gráfico",
    "conceitos": [
     "comparação",
     "distribuição (histograma, boxplot)",
     "relação (dispersão)",
     "composição",
     "tempo (linha)"
    ],
    "dominio": "Escolher o gráfico certo para dez perguntas"
   },
   {
    "codigo": "VIS.03",
    "nome": "Matplotlib",
    "conceitos": [
     "figura e eixos",
     "tipos de gráfico",
     "rótulos e títulos",
     "vários painéis"
    ],
    "dominio": "Fazer um painel de quatro gráficos legível"
   },
   {
    "codigo": "VIS.04",
    "nome": "Gráficos que mentem",
    "conceitos": [
     "eixo truncado",
     "escala dupla",
     "área enganosa",
     "excesso de cor"
    ],
    "dominio": "Corrigir três gráficos enganosos"
   },
   {
    "codigo": "VIS.05",
    "nome": "Gráfico explicativo",
    "conceitos": [
     "um recado por gráfico",
     "título que diz a conclusão",
     "destaque e contexto"
    ],
    "dominio": "Transformar um gráfico exploratório em explicativo"
   },
   {
    "codigo": "VIS.06",
    "nome": "Relatório e notebook",
    "conceitos": [
     "estrutura (pergunta, método, resultado, limite)",
     "notebook reproduzível",
     "Markdown"
    ],
    "dominio": "Escrever um relatório de uma página a partir de uma análise"
   },
   {
    "codigo": "VIS.07",
    "nome": "Painéis",
    "conceitos": [
     "indicadores",
     "filtros",
     "quando um painel ajuda e quando atrapalha"
    ],
    "dominio": "Desenhar um painel de acompanhamento com cinco indicadores"
   }
  ]
 },
 {
  "sigla": "ML",
  "nome": "Aprendizado de máquina",
  "modulos": [
   {
    "codigo": "ML.01",
    "nome": "O problema",
    "conceitos": [
     "supervisionado e não supervisionado",
     "regressão e classificação",
     "variável-alvo e atributos",
     "o que um modelo aprende"
    ],
    "dominio": "Enquadrar dez problemas reais no tipo certo"
   },
   {
    "codigo": "ML.02",
    "nome": "Avaliação honesta",
    "conceitos": [
     "treino, validação e teste",
     "sobreajuste e subajuste",
     "viés e variância",
     "vazamento de dados",
     "validação cruzada"
    ],
    "dominio": "Achar o vazamento num pipeline com resultado bom demais"
   },
   {
    "codigo": "ML.03",
    "nome": "Métricas",
    "conceitos": [
     "MAE, RMSE e R²",
     "matriz de confusão",
     "acurácia",
     "precisão",
     "revocação",
     "F1",
     "curva ROC e AUC",
     "escolha da métrica pelo custo do erro"
    ],
    "dominio": "Escolher a métrica para um caso com classes desbalanceadas e justificar"
   },
   {
    "codigo": "ML.04",
    "nome": "Modelos lineares",
    "conceitos": [
     "regressão linear",
     "regressão logística",
     "regularização Ridge e Lasso"
    ],
    "dominio": "Ajustar, regularizar e interpretar um modelo linear"
   },
   {
    "codigo": "ML.05",
    "nome": "Vizinhos e distância",
    "conceitos": [
     "k vizinhos mais próximos",
     "padronização das escalas",
     "maldição da dimensionalidade"
    ],
    "dominio": "Mostrar o efeito de padronizar no kNN"
   },
   {
    "codigo": "ML.06",
    "nome": "Árvores e conjuntos",
    "conceitos": [
     "árvore de decisão",
     "impureza",
     "poda",
     "bagging",
     "random forest",
     "boosting"
    ],
    "dominio": "Comparar árvore, floresta e boosting no mesmo problema"
   },
   {
    "codigo": "ML.07",
    "nome": "Atributos",
    "conceitos": [
     "codificação de categorias",
     "padronização",
     "criar atributos",
     "seleção",
     "pipelines do scikit-learn"
    ],
    "dominio": "Montar um pipeline completo sem vazamento"
   },
   {
    "codigo": "ML.08",
    "nome": "Não supervisionado",
    "conceitos": [
     "k-means",
     "agrupamento hierárquico",
     "DBSCAN",
     "escolher o número de grupos",
     "PCA na prática"
    ],
    "dominio": "Segmentar dados e descrever cada grupo"
   },
   {
    "codigo": "ML.09",
    "nome": "Ajuste e escolha",
    "conceitos": [
     "busca de hiperparâmetros",
     "validação cruzada aninhada (conceito)",
     "curva de aprendizado"
    ],
    "dominio": "Ajustar hiperparâmetros sem contaminar o teste"
   },
   {
    "codigo": "ML.10",
    "nome": "Problemas reais",
    "conceitos": [
     "classes desbalanceadas",
     "dados faltantes no modelo",
     "deriva de dados",
     "calibração"
    ],
    "dominio": "Tratar um problema desbalanceado e explicar a escolha"
   },
   {
    "codigo": "ML.11",
    "nome": "Interpretação",
    "conceitos": [
     "importância de atributos",
     "dependência parcial",
     "valores SHAP (conceito)",
     "explicar para quem decide"
    ],
    "dominio": "Explicar um modelo para um gestor em cinco linhas"
   },
   {
    "codigo": "ML.12",
    "nome": "Redes neurais",
    "conceitos": [
     "perceptron",
     "camadas",
     "ativação",
     "retropropagação (intuição)",
     "quando vale a pena"
    ],
    "dominio": "Explicar o que uma rede pequena aprende num exemplo simples"
   },
   {
    "codigo": "ML.13",
    "nome": "Texto e tempo",
    "conceitos": [
     "classificação de texto com TF-IDF",
     "previsão de séries (base ingênua, validação temporal)"
    ],
    "dominio": "Bater uma previsão ingênua numa série real com validação temporal"
   }
  ]
 },
 {
  "sigla": "NSQ",
  "nome": "Dados além do relacional",
  "modulos": [
   {
    "codigo": "NSQ.01",
    "nome": "Por que NoSQL",
    "conceitos": [
     "limites do relacional",
     "esquema flexível",
     "escala horizontal",
     "teorema CAP",
     "consistência eventual",
     "BASE e ACID"
    ],
    "dominio": "Escolher o tipo de banco para cinco cenários e justificar"
   },
   {
    "codigo": "NSQ.02",
    "nome": "Documentos",
    "conceitos": [
     "documento JSON",
     "coleção",
     "consulta e agregação no MongoDB",
     "embutir ou referenciar"
    ],
    "dominio": "Modelar a Apostila Viva como documentos e consultar"
   },
   {
    "codigo": "NSQ.03",
    "nome": "Colunar e análise",
    "conceitos": [
     "armazenamento por linha e por coluna",
     "compressão",
     "Parquet",
     "DuckDB consultando arquivo direto"
    ],
    "dominio": "Consultar um Parquet grande com DuckDB e explicar a velocidade"
   },
   {
    "codigo": "NSQ.04",
    "nome": "Chave-valor e cache",
    "conceitos": [
     "Redis",
     "expiração",
     "contadores",
     "quando usar cache"
    ],
    "dominio": "Desenhar um cache para uma consulta cara"
   },
   {
    "codigo": "NSQ.05",
    "nome": "Coluna larga e grafo",
    "conceitos": [
     "Cassandra (conceito)",
     "Neo4j e consultas de caminho (conceito)"
    ],
    "dominio": "Reconhecer problemas que pedem grafo"
   },
   {
    "codigo": "NSQ.06",
    "nome": "Big data",
    "conceitos": [
     "volume, velocidade e variedade",
     "processamento distribuído",
     "MapReduce",
     "Spark e DataFrames distribuídos (conceito)",
     "data lake e lakehouse"
    ],
    "dominio": "Explicar como uma contagem roda dividida em muitas máquinas"
   },
   {
    "codigo": "NSQ.07",
    "nome": "Fluxos",
    "conceitos": [
     "dado em lote e em fluxo",
     "fila de mensagens (conceito: Kafka)",
     "janela de tempo"
    ],
    "dominio": "Dizer quando um problema pede processamento contínuo"
   }
  ]
 },
 {
  "sigla": "ETI",
  "nome": "Ética, privacidade e governança",
  "modulos": [
   {
    "codigo": "ETI.01",
    "nome": "LGPD",
    "conceitos": [
     "dado pessoal e dado pessoal sensível",
     "bases legais",
     "direitos do titular",
     "papéis (controlador, operador, encarregado)"
    ],
    "dominio": "Classificar dados de um projeto pela LGPD com o texto oficial à mão"
   },
   {
    "codigo": "ETI.02",
    "nome": "Anonimização",
    "conceitos": [
     "anonimização e pseudonimização",
     "reidentificação por cruzamento",
     "agregação mínima"
    ],
    "dominio": "Mostrar como uma base \"anônima\" pode ser reidentificada"
   },
   {
    "codigo": "ETI.03",
    "nome": "Segurança de dados",
    "conceitos": [
     "confidencialidade, integridade e disponibilidade",
     "criptografia simétrica e assimétrica",
     "hash",
     "controle de acesso",
     "segredos fora do código"
    ],
    "dominio": "Achar falhas de segurança num projeto de exemplo"
   },
   {
    "codigo": "ETI.04",
    "nome": "Viés e justiça",
    "conceitos": [
     "viés na coleta, no rótulo e no modelo",
     "métricas de justiça (conceito)",
     "impacto de decisões automáticas"
    ],
    "dominio": "Auditar um modelo simples por grupo"
   },
   {
    "codigo": "ETI.05",
    "nome": "Governança e qualidade",
    "conceitos": [
     "dimensões de qualidade (completude, exatidão, consistência, atualidade)",
     "metadados",
     "dicionário de dados",
     "linhagem",
     "dono do dado",
     "DAMA-DMBOK (conceito)"
    ],
    "dominio": "Escrever o dicionário de dados e as regras de qualidade de uma base"
   },
   {
    "codigo": "ETI.06",
    "nome": "Reprodutibilidade",
    "conceitos": [
     "semente aleatória",
     "versão de dados e código",
     "registro de decisões"
    ],
    "dominio": "Tornar uma análise reproduzível por outra pessoa"
   }
  ]
 }
];
