// Gerado por tutor/gerar_percurso.py a partir do docs/05 e de tutor/sequencia_dados.py. Não edite à mão.
window.MATERIAS = [
 {
  "sigla": "LOG",
  "nome": "Lógica de programação",
  "etapa": "Pensar em passos",
  "trabalho": "Antes de qualquer análise, alguém precisa transformar um pedido vago, como “quero saber quem vai cancelar o plano”, em passos que um computador executa. Quem faz essa tradução é você, todos os dias.",
  "porque": "Começa sem computador, só com passos e teste de mesa, e logo passa a escrever esses passos em Python. As pesquisas que montaram trajetórias de aprendizagem (Rich e colegas, 2017) seguem esse caminho: do cotidiano para o pensamento computacional e depois para o programa. Primeiro a ordem dos passos, depois a repetição e a decisão, que mudam essa ordem.",
  "logos": [
   "python"
  ],
  "peso": 5,
  "peso_porque": "É a base de tudo, mas ocupa pouco tempo da formação: em semanas você já pensa em passos.",
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
    "dominio": "Escrever o algoritmo de um problema do dia a dia e testá-lo à mão",
    "antes": [],
    "pergunta": "Escreva os passos para pedir comida num app de delivery de um jeito que um robô conseguisse seguir. Sobrou alguma palavra vaga?",
    "resposta": "Se cada passo tem um único jeito de ser feito (o que, quanto, em que ordem) e o processo termina, você está pronto.",
    "tropeco": "Escrever passos que dependem de bom senso, como “escolha um restaurante bom”. O computador não tem bom senso.",
    "dia": "O passo a passo de um Pix: abrir o app, escolher Pix, digitar a chave, o valor, confirmar. Se faltar um passo, o dinheiro não sai.",
    "virada": false,
    "passos": 6,
    "peso": 0.485
   },
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
    "dominio": "Escrever e rodar um script que lê dados e responde",
    "antes": [
     {
      "codigo": "LOG.01",
      "nome": "Algoritmo",
      "materia": "LOG"
     }
    ],
    "pergunta": "O que aparece na tela com print(\"Oi\", 2 + 3)?",
    "resposta": "Oi 5. O Python calcula 2 + 3 antes de mostrar.",
    "tropeco": "Achar que o espaço no começo da linha é só estética. No Python, o recuo decide o que pertence a cada bloco.",
    "dia": "É como digitar uma fórmula numa planilha: você escreve a instrução e o resultado aparece na hora.",
    "virada": false,
    "passos": 7,
    "peso": 0.583
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
    "dominio": "Prever o valor de cada variável após uma sequência de atribuições",
    "antes": [
     {
      "codigo": "PY.01",
      "nome": "Primeiros passos",
      "materia": "LOG"
     }
    ],
    "pergunta": "Depois de x = 5 e x = x + 2, quanto vale x? O 5 continua guardado em x?",
    "resposta": "x vale 7. O nome x passou a apontar para o 7; o 5 ficou sem nome.",
    "tropeco": "Ler x = x + 2 como equação (que não tem solução). Em programação o sinal = quer dizer “recebe”. Outro erro comum: achar que a variável guarda os dois valores (Hermans e colegas, 2018).",
    "dia": "Um contato salvo no celular: o nome “Mãe” aponta para um número. Se ela troca de número, você atualiza o contato e o nome continua o mesmo.",
    "virada": true,
    "passos": 6,
    "peso": 0.728
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
    "dominio": "Avaliar à mão expressões mistas sem errar a precedência",
    "antes": [
     {
      "codigo": "LOG.02",
      "nome": "Variáveis e tipos",
      "materia": "LOG"
     }
    ],
    "pergunta": "Quanto dá 7 // 2 e 7 % 2? Para que serve o %?",
    "resposta": "3 e 1. O % é o resto da divisão: diz se um número é par (n % 2 == 0) e separa minutos de horas.",
    "tropeco": "Confundir = (guardar) com == (comparar), e esquecer a precedência: 2 + 3 * 4 dá 14, não 20.",
    "dia": "Dividir a conta do bar no Pix: total // pessoas dá o valor inteiro de cada um; total % pessoas, o que sobra.",
    "virada": false,
    "passos": 7,
    "peso": 0.583
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
    "dominio": "Reescrever uma condição negada usando De Morgan",
    "antes": [
     {
      "codigo": "LOG.03",
      "nome": "Operadores e expressões",
      "materia": "LOG"
     }
    ],
    "pergunta": "Frete grátis se o carrinho passar de R$ 100 OU se a pessoa for assinante. Quem não é assinante e tem R$ 80 no carrinho ganha?",
    "resposta": "Não. As duas condições são falsas, e o “ou” só dá falso quando as duas são falsas.",
    "tropeco": "Negar errado: o contrário de “tem 18 anos e tem CNH” é “não tem 18 anos OU não tem CNH” (lei de De Morgan).",
    "dia": "Os filtros da loja online: “frete grátis” E “chega amanhã” mostra menos produtos que “frete grátis” OU “chega amanhã”.",
    "virada": false,
    "passos": 5,
    "peso": 0.388
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
    "dominio": "Classificar entradas em faixas sem lacunas nem sobreposições",
    "antes": [
     {
      "codigo": "LOG.04",
      "nome": "Lógica booleana",
      "materia": "LOG"
     }
    ],
    "pergunta": "Cashback: até R$ 50, 0%; acima de 50 até 200, 2%; acima de 200, 5%. Quanto ganha quem gasta 50? E 200? E 201?",
    "resposta": "50 ganha 0%, 200 ganha 2%, 201 ganha 5%. O importante é cada valor cair em uma faixa só, sem buraco nem sobreposição.",
    "tropeco": "Achar que o programa executa todas as condições verdadeiras de um if/elif. Ele para na primeira verdadeira.",
    "dia": "O app do banco: tem saldo? Faz o Pix. Não tem? Mostra “saldo insuficiente”. Um caminho ou outro, nunca os dois.",
    "virada": false,
    "passos": 5,
    "peso": 0.388
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
    "dominio": "Resolver problemas de soma, contagem, máximo e busca com laços",
    "antes": [
     {
      "codigo": "LOG.05",
      "nome": "Decisão",
      "materia": "LOG"
     }
    ],
    "pergunta": "Quanto vale total depois de: total = 0; para cada x em [10, 20, 30]: total = total + x?",
    "resposta": "60. É o padrão acumulador: começa em zero e soma um valor por volta.",
    "tropeco": "Laço que nunca para (a condição do while nunca fica falsa) e erro por um (uma volta a mais ou a menos).",
    "dia": "O Spotify toca cada música da playlist até acabar; a retrospectiva do ano soma os minutos de cada uma.",
    "virada": false,
    "passos": 8,
    "peso": 0.68
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
    "dominio": "Achar e corrigir três erros diferentes num programa curto",
    "antes": [
     {
      "codigo": "LOG.06",
      "nome": "Repetição",
      "materia": "LOG"
     }
    ],
    "pergunta": "O que quer dizer NameError: name 'totl' is not defined?",
    "resposta": "Você usou um nome que não existe. Quase sempre é erro de digitação (totl em vez de total).",
    "tropeco": "Ler só a última linha do erro e mudar o código no chute. A mensagem diz o tipo do erro e a linha: comece por elas.",
    "dia": "Quando um app trava, o suporte pede o print da mensagem de erro, porque ela diz o que aconteceu e onde.",
    "virada": false,
    "passos": 5,
    "peso": 0.388
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
    "dominio": "Quebrar um programa em funções que se testam separadas",
    "antes": [
     {
      "codigo": "LOG.06",
      "nome": "Repetição",
      "materia": "LOG"
     }
    ],
    "pergunta": "Qual a diferença entre uma função que faz print do resultado e uma que faz return?",
    "resposta": "print só mostra na tela. return devolve o valor para quem chamou, que pode guardar e usar de novo.",
    "tropeco": "Confundir print com return e achar que uma variável criada dentro da função existe fora dela.",
    "dia": "O botão “pedir de novo” do app de delivery: um conjunto de passos com nome, que você aciona com um toque e com outros dados (endereço, pagamento).",
    "virada": false,
    "passos": 6,
    "peso": 0.485
   },
   {
    "codigo": "LOG.08",
    "nome": "Decomposição",
    "conceitos": [
     "dividir o problema",
     "resolver o caso pequeno primeiro",
     "refinamento sucessivo"
    ],
    "dominio": "Partir um enunciado médio em subproblemas e implementar",
    "antes": [
     {
      "codigo": "LOG.07",
      "nome": "Funções",
      "materia": "LOG"
     }
    ],
    "pergunta": "Como você quebraria “montar o relatório mensal de gastos do cartão” em partes?",
    "resposta": "Ler os gastos, classificar por categoria, somar cada categoria e mostrar o resultado. Cada parte vira uma função testada sozinha.",
    "tropeco": "Tentar escrever tudo de uma vez num bloco só. Resolva e teste a parte menor antes de juntar.",
    "dia": "Montar um móvel por etapas do manual: base, laterais, portas. Ninguém parafusa tudo ao mesmo tempo.",
    "virada": false,
    "passos": 4,
    "peso": 0.291
   }
  ]
 },
 {
  "sigla": "PY",
  "nome": "Python",
  "etapa": "Automatizar",
  "trabalho": "Python é a ferramenta do dia a dia: ler a planilha que o financeiro mandou, juntar com a base do app e gerar o relatório de toda segunda sem refazer à mão. Um script curto troca uma tarde de copiar e colar.",
  "porque": "Segue a ordem dos cursos mais usados para iniciantes (CS50 Python, Python for Everybody, Think Python): textos, listas e dicionários; depois erros, arquivos, bibliotecas e testes, que são o kit para fazer coisas reais; só então os atalhos (compreensões), as classes e as anotações de tipo. Referências e mutabilidade ficam logo após as coleções, porque é um ponto de virada que tudo o que vem depois usa.",
  "logos": [
   "python",
   "jupyter",
   "vscode"
  ],
  "peso": 12,
  "peso_porque": "A linguagem de trabalho: aparece em 57% das vagas de cientista de dados (365 Data Science, 1.000 vagas analisadas).",
  "modulos": [
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
    "dominio": "Limpar e formatar uma lista de nomes e valores",
    "antes": [
     {
      "codigo": "LOG.03",
      "nome": "Operadores e expressões",
      "materia": "LOG"
     }
    ],
    "pergunta": "O que dá \"Pix\" * 3? E \"10\" + \"5\"? E int(\"10\") + 5?",
    "resposta": "\"PixPixPix\", \"105\" (textos se juntam) e 15.",
    "tropeco": "Somar texto com número (\"Total: \" + 10) dá erro. Converta com str() ou use f-string.",
    "dia": "No carrinho, o nome do produto é texto e o preço é número. Juntar os dois numa frase pede conversão: f\"{nome}: R$ {preco:.2f}\".",
    "virada": false,
    "passos": 7,
    "peso": 1.021
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
    "dominio": "Manipular listas sem confundir cópia e referência",
    "antes": [
     {
      "codigo": "PY.02",
      "nome": "Números e textos",
      "materia": "PY"
     },
     {
      "codigo": "LOG.06",
      "nome": "Repetição",
      "materia": "LOG"
     }
    ],
    "pergunta": "Em musicas = [\"a\", \"b\", \"c\"], quanto valem musicas[0] e musicas[-1]?",
    "resposta": "\"a\" e \"c\". A contagem começa no zero e o -1 é o último.",
    "tropeco": "Esquecer que o primeiro índice é 0 e pedir musicas[3] numa lista de 3 itens (IndexError).",
    "dia": "Uma playlist: tem ordem, dá para pegar a primeira e a última, pôr uma música no fim e embaralhar.",
    "virada": false,
    "passos": 8,
    "peso": 1.191
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
    "dominio": "Contar ocorrências e agrupar valores com dicionário",
    "antes": [
     {
      "codigo": "PY.03",
      "nome": "Listas e tuplas",
      "materia": "PY"
     }
    ],
    "pergunta": "Como contar quantas vezes cada palavra aparece numa lista, usando dicionário?",
    "resposta": "Para cada palavra: contagem[palavra] = contagem.get(palavra, 0) + 1.",
    "tropeco": "Procurar pelo valor em vez da chave, ou esperar uma ordem fixa num conjunto.",
    "dia": "Dicionário é a agenda do celular: você busca pelo nome (a chave) e acha o número (o valor). Conjunto é a lista de seguidores: ninguém aparece duas vezes.",
    "virada": false,
    "passos": 7,
    "peso": 1.021
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
    "dominio": "Explicar um bug causado por lista compartilhada",
    "antes": [
     {
      "codigo": "PY.04",
      "nome": "Dicionários e conjuntos",
      "materia": "PY"
     }
    ],
    "pergunta": "a = [1, 2]; b = a; b.append(3). Quanto vale a?",
    "resposta": "[1, 2, 3]. a e b são dois nomes para a mesma lista. Para ter uma cópia, use b = a.copy().",
    "tropeco": "Achar que b = a cria uma cópia. É o mesmo objeto com dois nomes, um dos erros mais registrados entre iniciantes (lista de Sorva).",
    "dia": "Um álbum compartilhado de fotos: se outra pessoa apaga uma foto, ela some para você também, porque é o mesmo álbum. Baixar as fotos é fazer uma cópia.",
    "virada": true,
    "passos": 6,
    "peso": 1.277
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
    "dominio": "Ordenar e filtrar registros passando funções",
    "antes": [
     {
      "codigo": "PY.05",
      "nome": "Referências e mutabilidade",
      "materia": "PY"
     },
     {
      "codigo": "LOG.07",
      "nome": "Funções",
      "materia": "LOG"
     }
    ],
    "pergunta": "Como ordenar uma lista de produtos (nome, preço) pelo preço?",
    "resposta": "sorted(produtos, key=lambda p: p[1]).",
    "tropeco": "Usar lista como valor padrão de parâmetro (def f(x=[])): ela é criada uma vez só e vai acumulando entre as chamadas.",
    "dia": "O “ordenar por: menor preço” da loja online é uma função de ordenação com um critério, a key.",
    "virada": false,
    "passos": 7,
    "peso": 1.021
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
    "dominio": "Tornar um programa robusto a entradas ruins",
    "antes": [
     {
      "codigo": "PY.06",
      "nome": "Funções a fundo",
      "materia": "PY"
     },
     {
      "codigo": "LOG.09",
      "nome": "Depuração",
      "materia": "LOG"
     }
    ],
    "pergunta": "O que acontece com int(\"abc\") e como evitar que o programa pare?",
    "resposta": "Dá ValueError. Com try/except ValueError você trata o erro e pede de novo ou usa um valor padrão.",
    "tropeco": "Usar um except genérico que esconde todos os erros, inclusive os seus bugs.",
    "dia": "Digitar o CPF errado num formulário: o app não fecha; mostra “CPF inválido” e pede de novo.",
    "virada": false,
    "passos": 5,
    "peso": 0.681
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
    "dominio": "Ler um arquivo de texto, processar e gravar o resultado",
    "antes": [
     {
      "codigo": "PY.08",
      "nome": "Erros e exceções",
      "materia": "PY"
     }
    ],
    "pergunta": "Por que usar with open(...) as f em vez de só open(...)?",
    "resposta": "O with fecha o arquivo sozinho, mesmo se der erro no meio.",
    "tropeco": "Ler arquivo com acento sem dizer a codificação. Informe encoding=\"utf-8\".",
    "dia": "Baixar o extrato do banco em arquivo e processar linha por linha, como quem rola o extrato no app.",
    "virada": false,
    "passos": 7,
    "peso": 1.021
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
    "dominio": "Organizar um programa em dois módulos",
    "antes": [
     {
      "codigo": "PY.06",
      "nome": "Funções a fundo",
      "materia": "PY"
     }
    ],
    "pergunta": "Para que serve import random e como sortear um item de uma lista?",
    "resposta": "Traz o módulo random; random.choice(lista) sorteia um item.",
    "tropeco": "Dar ao seu arquivo o nome de um módulo (random.py): o Python importa o seu no lugar do original.",
    "dia": "Instalar um app pronto em vez de programar do zero: você usa o que já existe e foi testado.",
    "virada": false,
    "passos": 5,
    "peso": 0.681
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
    "dominio": "Escrever testes que pegam um bug antes da correção",
    "antes": [
     {
      "codigo": "PY.08",
      "nome": "Erros e exceções",
      "materia": "PY"
     },
     {
      "codigo": "PY.10",
      "nome": "Módulos e pacotes",
      "materia": "PY"
     }
    ],
    "pergunta": "Que testes você escreveria para uma função que calcula desconto?",
    "resposta": "Um caso normal, um de borda (desconto zero, valor zero) e um de erro (desconto negativo).",
    "tropeco": "Testar só o caso feliz. Os bugs moram nas bordas: zero, vazio, negativo, o maior valor.",
    "dia": "Mandar R$ 1 antes de um Pix grande para conferir a chave: é um teste.",
    "virada": false,
    "passos": 5,
    "peso": 0.681
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
    "dominio": "Reescrever laços em compreensões legíveis e processar dado grande com gerador",
    "antes": [
     {
      "codigo": "PY.06",
      "nome": "Funções a fundo",
      "materia": "PY"
     }
    ],
    "pergunta": "Reescreva com compreensão: novos = []; para p em precos: novos.append(p + 10).",
    "resposta": "novos = [p + 10 for p in precos].",
    "tropeco": "Usar compreensão antes de saber escrever o laço normal. Se ela ficar longa, o laço é mais legível.",
    "dia": "Aplicar o mesmo filtro em todas as fotos de um álbum de uma vez, em vez de editar uma por uma.",
    "virada": false,
    "passos": 6,
    "peso": 0.851
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
    "dominio": "Modelar registros do domínio com dataclass",
    "antes": [
     {
      "codigo": "PY.06",
      "nome": "Funções a fundo",
      "materia": "PY"
     }
    ],
    "pergunta": "Numa classe Pedido, o que é atributo e o que é método?",
    "resposta": "Atributo é o que o pedido tem (itens, total). Método é o que ele faz (adicionar_item, calcular_total).",
    "tropeco": "Esquecer o self nos métodos ou confundir a classe (o molde) com o objeto (o pedido de verdade).",
    "dia": "Todo pedido do delivery tem a mesma estrutura (restaurante, itens, status), mas cada pedido é um objeto diferente.",
    "virada": false,
    "passos": 6,
    "peso": 0.851
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
    "dominio": "Extrair datas, valores e e-mails de texto livre",
    "antes": [
     {
      "codigo": "PY.09",
      "nome": "Arquivos",
      "materia": "PY"
     }
    ],
    "pergunta": "Que padrão acha um CEP no formato 79002-150?",
    "resposta": "r\"\\d{5}-\\d{3}\": cinco dígitos, hífen, três dígitos.",
    "tropeco": "Escrever um padrão amplo demais, que pega mais do que devia. Teste também com exemplos que não deveriam casar.",
    "dia": "O campo de CPF que só aceita o formato certo usa um padrão assim para validar.",
    "virada": false,
    "passos": 6,
    "peso": 0.851
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
    "dominio": "Anotar e documentar um módulo existente",
    "antes": [
     {
      "codigo": "PY.11",
      "nome": "Classes em Python",
      "materia": "PY"
     }
    ],
    "pergunta": "O que diz a anotação def total(precos: list[float]) -> float?",
    "resposta": "Que a função recebe uma lista de números com casas decimais e devolve um número. O Python não obriga; o editor e o mypy avisam.",
    "tropeco": "Achar que a anotação faz o Python conferir os tipos na hora de rodar.",
    "dia": "O aviso “somente números” num formulário: documenta e evita erro antes de enviar.",
    "virada": false,
    "passos": 6,
    "peso": 0.851
   }
  ]
 },
 {
  "sigla": "BD",
  "nome": "Banco de dados e SQL",
  "etapa": "Guardar e consultar",
  "trabalho": "A área de vendas pede a taxa de recompra por região até amanhã. Os dados estão no banco da empresa, e quem escreve a consulta SQL que responde é você.",
  "porque": "Primeiro usar um banco pronto, depois modificar, depois criar o seu (a progressão usar, modificar, criar). As consultas seguem a ordem de dificuldade medida em consultas reais de estudantes (Ahadi e colegas, 2015): uma tabela, agrupamento, junção, subconsulta simples, subconsulta correlacionada e, por último, a autojunção.",
  "logos": [
   "postgresql",
   "sqlite",
   "mysql",
   "microsoftsqlserver",
   "oracle"
  ],
  "peso": 10,
  "peso_porque": "SQL aparece em 30% das vagas e está em quase todo dia de trabalho: os dados moram em bancos.",
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
    "dominio": "Explicar o que um SGBD resolve que uma planilha não resolve",
    "antes": [],
    "pergunta": "Por que o app do banco não guarda seus dados numa planilha?",
    "resposta": "Porque milhões de pessoas mexem ao mesmo tempo; o banco de dados garante regras, controla o acesso e não deixa nada se perder nem duplicar.",
    "tropeco": "Achar que banco de dados é só uma planilha grande.",
    "dia": "Seu histórico de pedidos, suas conversas e seu extrato vivem em bancos de dados.",
    "virada": false,
    "passos": 5,
    "peso": 0.449
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
    "dominio": "Identificar as chaves e as ligações do esquema do banco de estudo",
    "antes": [
     {
      "codigo": "BD.01",
      "nome": "Por que bancos",
      "materia": "BD"
     }
    ],
    "pergunta": "No banco de estudo, como a tabela respostas sabe de qual aluno é cada resposta?",
    "resposta": "Pela chave estrangeira aluno_id, que aponta para alunos.id.",
    "tropeco": "Repetir o nome do aluno em cada resposta, em vez de guardar só o id dele.",
    "dia": "Seu CPF identifica você em qualquer sistema: ninguém copia seu nome inteiro, só o número.",
    "virada": false,
    "passos": 6,
    "peso": 0.562
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
    "dominio": "Responder perguntas simples numa tabela",
    "antes": [
     {
      "codigo": "BD.02",
      "nome": "Modelo relacional",
      "materia": "BD"
     }
    ],
    "pergunta": "Escreva a consulta que mostra o nome e o e-mail de todos os alunos.",
    "resposta": "SELECT nome, email FROM alunos;",
    "tropeco": "Usar SELECT * por hábito: traz colunas demais e esconde o que você realmente quer.",
    "dia": "Escolher quais colunas aparecem numa planilha: você não precisa ver todas.",
    "virada": false,
    "passos": 6,
    "peso": 0.562
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
    "dominio": "Escrever filtros compostos sem erro de aspas nem de precedência",
    "antes": [
     {
      "codigo": "BD.03",
      "nome": "Primeira consulta",
      "materia": "BD"
     },
     {
      "codigo": "LOG.04",
      "nome": "Lógica booleana",
      "materia": "LOG"
     }
    ],
    "pergunta": "Escreva a consulta das questões de gabarito C da matéria 1.",
    "resposta": "SELECT * FROM questoes WHERE gabarito = 'C' AND materia_id = 1;",
    "tropeco": "Texto entre aspas duplas (\"C\") em vez de simples ('C'). No PostgreSQL, aspas duplas são nome de coluna. É o seu erro recorrente.",
    "dia": "O filtro do e-mail: “de: banco” e “com anexo” ao mesmo tempo.",
    "virada": false,
    "passos": 8,
    "peso": 0.787
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
    "dominio": "Prever o resultado de filtros com NULL",
    "antes": [
     {
      "codigo": "BD.04",
      "nome": "Filtrar",
      "materia": "BD"
     }
    ],
    "pergunta": "WHERE email = NULL encontra os alunos sem e-mail?",
    "resposta": "Não. Nada é igual a NULL, nem o próprio NULL. Use WHERE email IS NULL.",
    "tropeco": "Tratar NULL como zero ou texto vazio. NULL quer dizer “não informado”.",
    "dia": "O campo “telefone (opcional)” que a pessoa deixou em branco no cadastro: não é zero, é desconhecido.",
    "virada": false,
    "passos": 6,
    "peso": 0.562
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
    "dominio": "Montar rankings e páginas de resultado",
    "antes": [
     {
      "codigo": "BD.03",
      "nome": "Primeira consulta",
      "materia": "BD"
     }
    ],
    "pergunta": "Mostre as 5 respostas mais recentes.",
    "resposta": "SELECT * FROM respostas ORDER BY respondida_em DESC LIMIT 5;",
    "tropeco": "Esperar que o banco devolva as linhas em alguma ordem sem ORDER BY. Sem ele, a ordem não é garantida.",
    "dia": "Ordenar por “mais recentes” no YouTube e olhar só o começo da lista.",
    "virada": false,
    "passos": 5,
    "peso": 0.449
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
    "dominio": "Criar faixas e rótulos dentro da consulta",
    "antes": [
     {
      "codigo": "BD.04",
      "nome": "Filtrar",
      "materia": "BD"
     }
    ],
    "pergunta": "Como mostrar “fácil”, “médio” ou “difícil” a partir da coluna nivel, que vai de 1 a 5?",
    "resposta": "CASE WHEN nivel <= 2 THEN 'fácil' WHEN nivel = 3 THEN 'médio' ELSE 'difícil' END.",
    "tropeco": "Comparar datas guardadas como texto em formatos diferentes. Padronize para AAAA-MM-DD.",
    "dia": "As fórmulas SE, MAIÚSCULA e TEXTO da planilha, só que dentro da consulta.",
    "virada": false,
    "passos": 5,
    "peso": 0.449
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
    "dominio": "Resumir dados por grupo e filtrar grupos",
    "antes": [
     {
      "codigo": "BD.05",
      "nome": "NULL",
      "materia": "BD"
     },
     {
      "codigo": "BD.06",
      "nome": "Ordenar e limitar",
      "materia": "BD"
     }
    ],
    "pergunta": "Por que WHERE COUNT(*) > 20 dá erro e HAVING COUNT(*) > 20 funciona?",
    "resposta": "WHERE filtra linhas antes de os grupos existirem; HAVING filtra os grupos depois de contar.",
    "tropeco": "Pôr no SELECT uma coluna que não está no GROUP BY nem dentro de uma agregação (coluna solta).",
    "dia": "O resumo do app do cartão: gastos agrupados por categoria, com o total de cada uma.",
    "virada": false,
    "passos": 6,
    "peso": 0.562
   },
   {
    "codigo": "BD.08",
    "nome": "Junções",
    "conceitos": [
     "produto cartesiano",
     "INNER JOIN",
     "LEFT JOIN",
     "RIGHT e FULL JOIN",
     "junção com várias tabelas",
     "linhas duplicadas por junção",
     "autojunção"
    ],
    "dominio": "Cruzar as quatro tabelas do banco de estudo sem perder nem duplicar linhas",
    "antes": [
     {
      "codigo": "BD.02",
      "nome": "Modelo relacional",
      "materia": "BD"
     },
     {
      "codigo": "BD.07",
      "nome": "Agregação",
      "materia": "BD"
     }
    ],
    "pergunta": "Que junção mostra também os alunos que nunca responderam nada?",
    "resposta": "LEFT JOIN de alunos com respostas: quem não tem resposta aparece com NULL nas colunas de respostas.",
    "tropeco": "Esquecer a condição ON e gerar todas as combinações (produto cartesiano), ou duplicar linhas sem perceber.",
    "dia": "O PROCV da planilha: trazer o nome do restaurante para cada pedido pela coluna em comum.",
    "virada": false,
    "passos": 8,
    "peso": 0.787
   },
   {
    "codigo": "BD.09",
    "nome": "Subconsultas",
    "conceitos": [
     "subconsulta escalar",
     "em WHERE com IN e EXISTS",
     "em FROM",
     "correlacionada"
    ],
    "dominio": "Resolver a mesma pergunta com junção e com subconsulta",
    "antes": [
     {
      "codigo": "BD.08",
      "nome": "Junções",
      "materia": "BD"
     }
    ],
    "pergunta": "Liste o nome dos alunos que têm pelo menos uma resposta, usando IN.",
    "resposta": "SELECT nome FROM alunos WHERE id IN (SELECT aluno_id FROM respostas);",
    "tropeco": "Usar = com uma subconsulta que devolve várias linhas. Use IN ou EXISTS.",
    "dia": "“Mostre os produtos mais caros que a média”: primeiro a média, depois a comparação. Uma pergunta dentro da outra.",
    "virada": false,
    "passos": 5,
    "peso": 0.449
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
    "dominio": "Comparar dois conjuntos de alunos ou questões",
    "antes": [
     {
      "codigo": "BD.03",
      "nome": "Primeira consulta",
      "materia": "BD"
     }
    ],
    "pergunta": "Qual a diferença entre UNION e UNION ALL?",
    "resposta": "UNION tira as linhas repetidas; UNION ALL mantém todas.",
    "tropeco": "Juntar consultas com colunas em ordem ou tipos diferentes.",
    "dia": "Juntar os participantes de dois grupos de mensagens sem repetir quem está nos dois.",
    "virada": false,
    "passos": 5,
    "peso": 0.449
   },
   {
    "codigo": "BD.18",
    "nome": "Álgebra relacional",
    "conceitos": [
     "seleção, projeção, junção, união, diferença, renomeação",
     "equivalência com SQL"
    ],
    "dominio": "Traduzir consultas entre álgebra relacional e SQL (cai em concurso)",
    "antes": [
     {
      "codigo": "BD.10",
      "nome": "Operações de conjunto",
      "materia": "BD"
     },
     {
      "codigo": "BD.08",
      "nome": "Junções",
      "materia": "BD"
     }
    ],
    "pergunta": "Que operação da álgebra relacional faz o papel do WHERE? E da escolha de colunas no SELECT?",
    "resposta": "Seleção (σ) escolhe linhas; projeção (π) escolhe colunas.",
    "tropeco": "Confundir seleção com projeção: o nome SELECT do SQL atrapalha.",
    "dia": "É a matemática por trás do filtro e do recorte de colunas da planilha. Concurso adora perguntar.",
    "virada": false,
    "passos": 3,
    "peso": 0.225
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
    "dominio": "Modelar um caso pequeno do zero e gerar as tabelas",
    "antes": [
     {
      "codigo": "BD.08",
      "nome": "Junções",
      "materia": "BD"
     }
    ],
    "pergunta": "Um aluno estuda várias matérias e cada matéria tem vários alunos. Como guardar isso?",
    "resposta": "Relacionamento N:M: uma terceira tabela (matrícula) com aluno_id e materia_id.",
    "tropeco": "Pôr uma lista de matérias dentro de uma coluna do aluno (\"BD, EST, LOG\").",
    "dia": "Seguidores numa rede social: cada pessoa segue várias e é seguida por várias. Isso pede uma tabela de “quem segue quem”.",
    "virada": false,
    "passos": 6,
    "peso": 0.562
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
    "dominio": "Levar uma tabela \"planilhão\" até a 3FN",
    "antes": [
     {
      "codigo": "BD.12",
      "nome": "Modelagem conceitual",
      "materia": "BD"
     }
    ],
    "pergunta": "Uma tabela de pedidos repete o endereço do cliente em cada pedido. Que problema isso causa?",
    "resposta": "Se o cliente muda de endereço, é preciso mudar em vários lugares, e alguns ficam desatualizados (anomalia de atualização).",
    "tropeco": "Decorar 1FN, 2FN e 3FN sem entender o problema que elas resolvem: dado repetido que se desencontra.",
    "dia": "A planilha compartilhada em que cada pessoa escreve o nome do cliente de um jeito: “Kaio”, “kaio M.”, “Kaio Mendes”.",
    "virada": false,
    "passos": 5,
    "peso": 0.449
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
    "dominio": "Criar o esquema do banco de estudo com todas as restrições",
    "antes": [
     {
      "codigo": "BD.13",
      "nome": "Normalização",
      "materia": "BD"
     }
    ],
    "pergunta": "Que restrição impede cadastrar dois alunos com o mesmo e-mail?",
    "resposta": "UNIQUE na coluna email.",
    "tropeco": "Rodar UPDATE ou DELETE sem WHERE: muda ou apaga a tabela inteira.",
    "dia": "As regras do formulário de cadastro: campo obrigatório, e-mail único, idade maior que zero.",
    "virada": false,
    "passos": 6,
    "peso": 0.562
   },
   {
    "codigo": "BD.15",
    "nome": "SQL analítico",
    "conceitos": [
     "CTE com WITH",
     "CTE recursiva",
     "funções de janela (ROW_NUMBER, RANK, LAG, LEAD, somas acumuladas, PARTITION BY)"
    ],
    "dominio": "Calcular ranking por disciplina e evolução das respostas no tempo",
    "antes": [
     {
      "codigo": "BD.07",
      "nome": "Agregação",
      "materia": "BD"
     },
     {
      "codigo": "BD.09",
      "nome": "Subconsultas",
      "materia": "BD"
     }
    ],
    "pergunta": "Como numerar as respostas de cada aluno da mais antiga para a mais nova?",
    "resposta": "ROW_NUMBER() OVER (PARTITION BY aluno_id ORDER BY respondida_em).",
    "tropeco": "Confundir GROUP BY (resume as linhas) com PARTITION BY (calcula por grupo e mantém todas as linhas).",
    "dia": "O ranking das músicas mais tocadas de cada país, calculado sem perder nenhuma música.",
    "virada": false,
    "passos": 4,
    "peso": 0.337
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
    "dominio": "Explicar o que acontece com duas transferências simultâneas",
    "antes": [
     {
      "codigo": "BD.14",
      "nome": "Criar e alterar",
      "materia": "BD"
     }
    ],
    "pergunta": "Num Pix, o que garante que o dinheiro não sai da sua conta sem entrar na outra?",
    "resposta": "A transação: as duas operações acontecem juntas ou nenhuma acontece (atomicidade).",
    "tropeco": "Achar que cada comando é independente. Sem transação, uma falha no meio deixa o banco pela metade.",
    "dia": "Pix e transferência: ou o dinheiro sai e chega, ou nada acontece.",
    "virada": false,
    "passos": 5,
    "peso": 0.449
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
    "dominio": "Ler um plano de execução e propor um índice",
    "antes": [
     {
      "codigo": "BD.07",
      "nome": "Agregação",
      "materia": "BD"
     }
    ],
    "pergunta": "Por que um índice na coluna email deixa a busca por e-mail rápida?",
    "resposta": "Porque o banco vai direto ao lugar certo, como pelo índice de um livro, em vez de ler a tabela inteira.",
    "tropeco": "Criar índice em tudo: cada índice deixa as gravações mais lentas e ocupa espaço.",
    "dia": "A busca de contatos do celular acha um nome na hora entre milhares.",
    "virada": false,
    "passos": 5,
    "peso": 0.449
   },
   {
    "codigo": "BD.19",
    "nome": "Visões, permissões e rotinas",
    "conceitos": [
     "VIEW",
     "GRANT e REVOKE",
     "procedimentos e gatilhos (conceito)"
    ],
    "dominio": "Criar uma visão para um relatório recorrente",
    "antes": [
     {
      "codigo": "BD.14",
      "nome": "Criar e alterar",
      "materia": "BD"
     }
    ],
    "pergunta": "Para que serve uma VIEW?",
    "resposta": "Guardar uma consulta com nome para usar como se fosse uma tabela.",
    "tropeco": "Achar que a view copia os dados. Ela guarda a consulta e roda de novo a cada uso.",
    "dia": "Um filtro salvo numa planilha compartilhada: cada um vê só o que precisa.",
    "virada": false,
    "passos": 4,
    "peso": 0.337
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
    "dominio": "Desenhar um modelo estrela para as respostas do banco de estudo",
    "antes": [
     {
      "codigo": "BD.13",
      "nome": "Normalização",
      "materia": "BD"
     },
     {
      "codigo": "BD.15",
      "nome": "SQL analítico",
      "materia": "BD"
     }
    ],
    "pergunta": "Por que o banco que registra cada compra não é o mesmo que gera o relatório anual?",
    "resposta": "O transacional é feito para muitas gravações pequenas; o analítico, para leituras grandes e somas. Um atrapalharia o outro.",
    "tropeco": "Normalizar o data warehouse como o banco transacional. No modelo estrela, a repetição é proposital, para consultar rápido.",
    "dia": "O app do banco registra seu Pix na hora; o resumo de gastos do ano vem de outro lugar, montado à noite.",
    "virada": false,
    "passos": 6,
    "peso": 0.562
   }
  ]
 },
 {
  "sigla": "CMP",
  "nome": "Como o computador funciona",
  "etapa": "Entender a máquina",
  "trabalho": "Quando a conta não fecha por centavos, o acento vira símbolo estranho ou o notebook trava com uma base grande, saber como o computador guarda números, textos e memória é o que separa o palpite da correção.",
  "porque": "Vem depois dos primeiros programas porque dá o porquê do que você já viu acontecer: o 0.1 + 0.2 estranho, o acento quebrado, o programa lento. Aprender o que a máquina faz por baixo (a máquina nocional, de du Boulay) explica boa parte dos erros de quem começa.",
  "logos": [
   "linux",
   "windows11",
   "apple",
   "android",
   "ubuntu"
  ],
  "peso": 1,
  "peso_porque": "Ajuda a entender desempenho e memória, mas raramente é cobrado direto.",
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
    "dominio": "Converter números entre bases e explicar por que 0.1 + 0.2 != 0.3",
    "antes": [
     {
      "codigo": "LOG.03",
      "nome": "Operadores e expressões",
      "materia": "LOG"
     }
    ],
    "pergunta": "Por que 0.1 + 0.2 dá 0.30000000000000004?",
    "resposta": "O computador guarda decimais em binário, e 0,1 não tem representação exata, como 1/3 não tem em decimal.",
    "tropeco": "Comparar dinheiro com == em float. Use centavos inteiros ou Decimal.",
    "dia": "Apps de banco guardam R$ 10,50 como 1050 centavos justamente para não errar centavo.",
    "virada": false,
    "passos": 7,
    "peso": 0.188
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
    "dominio": "Diagnosticar e corrigir um arquivo com acentos quebrados",
    "antes": [
     {
      "codigo": "CMP.01",
      "nome": "Representação numérica",
      "materia": "CMP"
     }
    ],
    "pergunta": "Por que “São Paulo” vira “SÃ£o Paulo”?",
    "resposta": "O texto foi gravado em UTF-8 e lido como Latin-1.",
    "tropeco": "Achar que cada caractere ocupa um byte. Letras acentuadas e emojis ocupam mais.",
    "dia": "A mensagem que chega com símbolos estranhos quando vem de um sistema antigo.",
    "virada": false,
    "passos": 7,
    "peso": 0.188
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
    "dominio": "Montar a tabela-verdade de um circuito pequeno",
    "antes": [
     {
      "codigo": "LOG.04",
      "nome": "Lógica booleana",
      "materia": "LOG"
     }
    ],
    "pergunta": "Qual a saída de uma porta E com entradas 1 e 0?",
    "resposta": "0. A porta E só dá 1 quando as duas entradas são 1.",
    "tropeco": "Confundir o OU comum (1 ou 1 = 1) com o OU exclusivo (1 xou 1 = 0).",
    "dia": "Os dois interruptores da escada que acendem a mesma lâmpada funcionam como um OU exclusivo.",
    "virada": false,
    "passos": 5,
    "peso": 0.125
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
    "dominio": "Explicar por que ler do disco é mais lento que da memória e o que isso muda numa análise",
    "antes": [
     {
      "codigo": "CMP.01",
      "nome": "Representação numérica",
      "materia": "CMP"
     }
    ],
    "pergunta": "Qual a diferença entre memória RAM e armazenamento?",
    "resposta": "A RAM é rápida e se apaga ao desligar; o armazenamento (SSD) é mais lento e guarda tudo.",
    "tropeco": "Achar que mais armazenamento deixa o celular mais rápido. Quem segura muitos apps abertos é a RAM.",
    "dia": "Celular com 8 GB de RAM e 256 GB de armazenamento: duas memórias com papéis diferentes.",
    "virada": false,
    "passos": 5,
    "peso": 0.125
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
    "dominio": "Navegar e organizar arquivos por caminho sem interface gráfica",
    "antes": [
     {
      "codigo": "CMP.04",
      "nome": "Arquitetura",
      "materia": "CMP"
     }
    ],
    "pergunta": "Qual a diferença entre os caminhos C:\\dados\\vendas.csv e dados/vendas.csv?",
    "resposta": "O primeiro é absoluto (do começo do disco); o segundo é relativo à pasta em que você está.",
    "tropeco": "Rodar o script de outra pasta e o arquivo “sumir”: o caminho relativo depende de onde você está.",
    "dia": "O gerenciador de tarefas mostra os processos abertos e quanta memória cada um usa.",
    "virada": false,
    "passos": 6,
    "peso": 0.156
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
    "dominio": "Ler uma resposta HTTP e dizer o que aconteceu",
    "antes": [
     {
      "codigo": "CMP.05",
      "nome": "Sistemas operacionais",
      "materia": "CMP"
     }
    ],
    "pergunta": "O que significa o erro 404? E o 500?",
    "resposta": "404: o endereço não existe. 500: o servidor quebrou ao responder.",
    "tropeco": "Achar que a internet é uma nuvem abstrata. São computadores trocando mensagens por regras combinadas (protocolos).",
    "dia": "Abrir um site é pedir uma página a um servidor; o DNS é a agenda que troca o nome do site pelo endereço numérico.",
    "virada": false,
    "passos": 6,
    "peso": 0.156
   },
   {
    "codigo": "CMP.07",
    "nome": "Como o código roda",
    "conceitos": [
     "compilador, interpretador e bytecode",
     "máquina virtual (JVM, CPython)"
    ],
    "dominio": "Explicar a diferença entre executar Java e Python",
    "antes": [
     {
      "codigo": "PY.01",
      "nome": "Primeiros passos",
      "materia": "LOG"
     },
     {
      "codigo": "CMP.04",
      "nome": "Arquitetura",
      "materia": "CMP"
     }
    ],
    "pergunta": "Qual a diferença entre compilar (Java) e interpretar (Python)?",
    "resposta": "O Java é traduzido antes para bytecode e roda na JVM; o Python lê e executa na hora, com um bytecode interno.",
    "tropeco": "Achar que o Python não tem etapa de tradução. Ele gera bytecode, só que escondido.",
    "dia": "Legenda pronta de um filme (compilado) versus um intérprete traduzindo ao vivo (interpretado).",
    "virada": false,
    "passos": 3,
    "peso": 0.062
   }
  ]
 },
 {
  "sigla": "MAT",
  "nome": "Matemática básica e lógica",
  "etapa": "Raciocinar",
  "trabalho": "Conjuntos e lógica estão em cada filtro que você escreve: “clientes que compraram e não voltaram” é uma diferença de conjuntos. A contagem diz quantos casos um teste precisa cobrir.",
  "porque": "Só o que a estatística e o raciocínio lógico de concurso pedem logo: conjuntos, lógica proposicional e contagem. A álgebra linear e o cálculo ficam numa matéria própria, perto do aprendizado de máquina, que é onde eles são usados (diretrizes do grupo do PCMI, De Veaux e colegas, 2017).",
  "logos": [],
  "peso": 5,
  "peso_porque": "A matemática que sustenta estatística e modelos; vale pelo que destrava.",
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
    "dominio": "Resolver problemas de conjuntos e composição",
    "antes": [],
    "pergunta": "Se A são os clientes que usam Pix e B os que usam cartão, quem está em A ∩ B?",
    "resposta": "Quem usa os dois.",
    "tropeco": "Confundir união (está em pelo menos um) com interseção (está nos dois).",
    "dia": "Os “seguidores em comum” de dois perfis são a interseção de dois conjuntos.",
    "virada": false,
    "passos": 6,
    "peso": 1.471
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
    "dominio": "Resolver itens de lógica no estilo Cebraspe",
    "antes": [
     {
      "codigo": "LOG.04",
      "nome": "Lógica booleana",
      "materia": "LOG"
     },
     {
      "codigo": "MAT.01",
      "nome": "Conjuntos e funções",
      "materia": "MAT"
     }
    ],
    "pergunta": "Qual a negação de “Todo boleto vence no dia 10”?",
    "resposta": "“Algum boleto não vence no dia 10.”",
    "tropeco": "Negar “todo” com “nenhum”. O contrário de “todo” é “pelo menos um não”.",
    "dia": "“Se compartilhar a senha, a conta pode ser bloqueada” não diz que quem não compartilha nunca será bloqueado.",
    "virada": false,
    "passos": 8,
    "peso": 2.059
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
    "dominio": "Contar casos sem fórmula decorada, pela lógica",
    "antes": [
     {
      "codigo": "MAT.01",
      "nome": "Conjuntos e funções",
      "materia": "MAT"
     }
    ],
    "pergunta": "Quantas senhas de 4 dígitos existem?",
    "resposta": "10 × 10 × 10 × 10 = 10.000.",
    "tropeco": "Usar combinação quando a ordem importa (senha) ou arranjo quando não importa (escolher 2 sabores de pizza).",
    "dia": "Por que a senha de 4 números é fraca e a de 8 caracteres com letras é forte: as possibilidades se multiplicam.",
    "virada": false,
    "passos": 6,
    "peso": 1.471
   }
  ]
 },
 {
  "sigla": "EST",
  "nome": "Probabilidade e estatística",
  "etapa": "Medir a incerteza",
  "trabalho": "O app mudou o botão de compra e as vendas subiram 3%. Foi o botão ou foi acaso? Responder isso com um teste A/B e um intervalo de confiança é trabalho central do cientista de dados.",
  "porque": "Simulação antes de fórmula: você sorteia no computador, vê a variação acontecer e só depois usa a fórmula que resume aquilo (a linha do Data 8, de Berkeley, e do OpenIntro). As diretrizes GAISE II lembram que todo iniciante começa pelo nível A, qualquer que seja a idade: perguntas e dados reais antes da teoria.",
  "logos": [
   "python",
   "r"
  ],
  "peso": 12,
  "peso_porque": "O núcleo do ofício: medir, comparar, testar hipóteses e saber quando confiar num número.",
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
    "dominio": "Classificar variáveis e dizer o que um estudo permite concluir",
    "antes": [],
    "pergunta": "Uma pesquisa feita só com quem segue a loja numa rede social serve para falar de todos os clientes?",
    "resposta": "Não. É uma amostra de conveniência, com viés de seleção: quem segue a loja não representa todos.",
    "tropeco": "Calcular média de categorias ordenadas (pequeno, médio, grande) como se fossem números.",
    "dia": "A nota de 1 a 5 estrelas de um app é ordinal: a distância entre 4 e 5 não é igual à entre 1 e 2.",
    "virada": false,
    "passos": 5,
    "peso": 0.716
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
    "dominio": "Resumir uma variável e escolher a medida certa para dados assimétricos",
    "antes": [
     {
      "codigo": "EST.01",
      "nome": "Tipos de dado e coleta",
      "materia": "EST"
     },
     {
      "codigo": "LOG.06",
      "nome": "Repetição",
      "materia": "LOG"
     }
    ],
    "pergunta": "Nove pessoas ganham R$ 3 mil e uma ganha R$ 300 mil. Que medida descreve melhor o salário típico?",
    "resposta": "A mediana (R$ 3 mil). A média (R$ 32,7 mil) é puxada pelo valor extremo.",
    "tropeco": "Usar a média para tudo, mesmo com valores extremos.",
    "dia": "O “tempo médio de entrega” do app engana se poucos pedidos atrasam horas.",
    "virada": false,
    "passos": 7,
    "peso": 1.075
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
    "dominio": "Resolver problemas de Bayes, como teste com falso positivo",
    "antes": [
     {
      "codigo": "MAT.01",
      "nome": "Conjuntos e funções",
      "materia": "MAT"
     },
     {
      "codigo": "MAT.03",
      "nome": "Contagem",
      "materia": "MAT"
     },
     {
      "codigo": "EST.02",
      "nome": "Estatística descritiva",
      "materia": "EST"
     }
    ],
    "pergunta": "Um teste acerta 99% dos doentes e dá falso positivo em 5% dos saudáveis; a doença atinge 1% das pessoas. Deu positivo: a chance de estar doente é alta?",
    "resposta": "Não: cerca de 17%. Como a doença é rara, a maioria dos positivos vem dos falsos positivos (teorema de Bayes).",
    "tropeco": "Confundir a chance de dar positivo estando doente com a chance de estar doente dado que deu positivo.",
    "dia": "O alerta de “compra suspeita” do cartão: a maioria é alarme falso, porque fraude é rara.",
    "virada": false,
    "passos": 7,
    "peso": 1.075
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
    "dominio": "Calcular esperança e variância e conferir por simulação",
    "antes": [
     {
      "codigo": "EST.03",
      "nome": "Probabilidade",
      "materia": "EST"
     }
    ],
    "pergunta": "Num sorteio você ganha R$ 10 com chance de 1 em 5 e nada no resto. Quanto ganha, em média, por sorteio?",
    "resposta": "R$ 2 (10 × 1/5).",
    "tropeco": "Achar que o valor esperado é o que vai acontecer numa jogada. Ele é a média de muitas.",
    "dia": "A promoção “ganhe até R$ 50 de cashback” com sorteio: o ganho esperado costuma ser bem menor que o anunciado.",
    "virada": false,
    "passos": 6,
    "peso": 0.896
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
    "dominio": "Associar fenômenos às distribuições e calcular probabilidades",
    "antes": [
     {
      "codigo": "EST.04",
      "nome": "Variáveis aleatórias",
      "materia": "EST"
     }
    ],
    "pergunta": "Número de mensagens que chegam por minuto no suporte: que distribuição costuma descrever isso?",
    "resposta": "Poisson: contagem de eventos num intervalo.",
    "tropeco": "Supor que tudo é normal. Renda, tempo de espera e contagens costumam ser assimétricos.",
    "dia": "Altura das pessoas parece normal; curtidas por post têm cauda longa: poucos posts com muitíssimas.",
    "virada": false,
    "passos": 8,
    "peso": 1.254
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
    "dominio": "Mostrar o teorema central do limite por simulação",
    "antes": [
     {
      "codigo": "EST.05",
      "nome": "Distribuições",
      "materia": "EST"
     },
     {
      "codigo": "PY.10",
      "nome": "Módulos e pacotes",
      "materia": "PY"
     }
    ],
    "pergunta": "Por que uma pesquisa com 2 mil pessoas fala pelo país inteiro?",
    "resposta": "Se a amostra é aleatória, a média dela cai perto da verdadeira; o erro depende do tamanho da amostra, não do tamanho do país.",
    "tropeco": "Achar que amostra boa é amostra grande. Uma amostra grande e enviesada continua enviesada.",
    "dia": "A pesquisa eleitoral com margem de erro de 2 pontos para mais ou para menos.",
    "virada": false,
    "passos": 7,
    "peso": 1.075
   },
   {
    "codigo": "EST.09",
    "nome": "Reamostragem",
    "conceitos": [
     "bootstrap",
     "teste de permutação",
     "quando usar"
    ],
    "dominio": "Fazer um intervalo por bootstrap e comparar com o teórico",
    "antes": [
     {
      "codigo": "EST.06",
      "nome": "Amostragem",
      "materia": "EST"
     },
     {
      "codigo": "PY.06",
      "nome": "Funções a fundo",
      "materia": "PY"
     }
    ],
    "pergunta": "O que é bootstrap, em uma frase?",
    "resposta": "Sortear com reposição, da própria amostra, muitas vezes, para ver o quanto a estatística varia.",
    "tropeco": "Achar que o bootstrap cria dados novos. Ele só reaproveita a amostra que você tem.",
    "dia": "Simular mil vezes no computador o resultado de um teste de duas versões de um site, em vez de decorar fórmula.",
    "virada": false,
    "passos": 4,
    "peso": 0.537
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
    "dominio": "Construir e interpretar um intervalo de confiança sem o erro clássico de interpretação",
    "antes": [
     {
      "codigo": "EST.09",
      "nome": "Reamostragem",
      "materia": "EST"
     }
    ],
    "pergunta": "O que quer dizer um intervalo de confiança de 95% que vai de 40% a 46%?",
    "resposta": "Que o método usado acerta o valor verdadeiro em 95% das amostras. Não é “95% de chance de o valor estar aqui”.",
    "tropeco": "Ler o intervalo como a probabilidade de o valor verdadeiro estar dentro dele.",
    "dia": "A margem de erro da pesquisa eleitoral é metade da largura do intervalo de confiança.",
    "virada": false,
    "passos": 5,
    "peso": 0.716
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
    "dominio": "Fazer um teste de duas médias e explicar o p-valor corretamente",
    "antes": [
     {
      "codigo": "EST.07",
      "nome": "Estimação",
      "materia": "EST"
     }
    ],
    "pergunta": "p-valor de 0,03 quer dizer que a hipótese nula tem 3% de chance de ser verdadeira?",
    "resposta": "Não. Quer dizer: se a nula fosse verdadeira, um resultado tão extremo apareceria em cerca de 3% das amostras.",
    "tropeco": "Ler o p-valor como a probabilidade da hipótese, e confundir “significativo” com “importante”.",
    "dia": "Teste A/B do botão de comprar verde contra o azul: a diferença foi real ou sorte?",
    "virada": false,
    "passos": 10,
    "peso": 1.612
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
    "dominio": "Explicar por que uma correlação observada não prova causa, com um exemplo de confusão",
    "antes": [
     {
      "codigo": "EST.02",
      "nome": "Estatística descritiva",
      "materia": "EST"
     }
    ],
    "pergunta": "Cidades com mais academias têm mais casos de lesão. Academia causa lesão?",
    "resposta": "Não necessariamente: cidades maiores têm mais das duas coisas. É um fator de confusão.",
    "tropeco": "Concluir causa a partir de correlação.",
    "dia": "Quem assina o plano premium gasta mais. O premium faz gastar, ou quem já gasta muito assina o premium?",
    "virada": false,
    "passos": 7,
    "peso": 1.075
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
    "dominio": "Ajustar e interpretar uma regressão e diagnosticar pelos resíduos",
    "antes": [
     {
      "codigo": "EST.10",
      "nome": "Correlação e causalidade",
      "materia": "EST"
     },
     {
      "codigo": "EST.08",
      "nome": "Testes de hipótese",
      "materia": "EST"
     }
    ],
    "pergunta": "No modelo salário = 2.000 + 300 × anos_de_estudo, o que significa o 300?",
    "resposta": "Cada ano a mais de estudo está associado a R$ 300 a mais de salário, em média.",
    "tropeco": "Ler o coeficiente como causa e prever fora da faixa dos dados (40 anos de estudo).",
    "dia": "Os sites de imóveis estimam o preço de um apartamento pelo tamanho e pelo bairro.",
    "virada": false,
    "passos": 8,
    "peso": 1.254
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
    "dominio": "Ler a saída de uma regressão logística e explicar os coeficientes",
    "antes": [
     {
      "codigo": "EST.11",
      "nome": "Regressão linear",
      "materia": "EST"
     }
    ],
    "pergunta": "Quando usar regressão logística em vez de linear?",
    "resposta": "Quando o alvo é sim ou não (pagou ou não), e o que se modela é a probabilidade.",
    "tropeco": "Usar regressão linear para prever probabilidade e obter valores acima de 1.",
    "dia": "O “risco de inadimplência” que o banco calcula antes de liberar crédito.",
    "virada": false,
    "passos": 5,
    "peso": 0.716
   }
  ]
 },
 {
  "sigla": "ED",
  "nome": "Estruturas de dados e algoritmos",
  "etapa": "Fazer rápido",
  "trabalho": "Uma rotina que demora duas horas pode cair para dois minutos trocando uma lista por um dicionário. Saber o custo de cada estrutura evita o código que funciona na amostra e trava na base real.",
  "porque": "Estruturas e algoritmos andam juntos, na ordem do livro Problem Solving with Algorithms and Data Structures using Python: primeiro medir custo, depois usar pilhas e filas prontas, só então construir a sua lista ligada; recursão antes das árvores, porque percorrer árvore é recursão; grafos por último, porque usam filas, pilhas e heaps. Os erros previsíveis vêm dos estudos de Zingaro e colegas (2018) e de Karpierz e Wolfman (2014).",
  "logos": [
   "python",
   "java"
  ],
  "peso": 4,
  "peso_porque": "Escolher a estrutura certa muda o custo do código; pesa mais em entrevistas técnicas.",
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
    "dominio": "Dar a complexidade de trechos de código e justificar",
    "antes": [
     {
      "codigo": "LOG.06",
      "nome": "Repetição",
      "materia": "LOG"
     },
     {
      "codigo": "PY.03",
      "nome": "Listas e tuplas",
      "materia": "PY"
     }
    ],
    "pergunta": "Uma função percorre a lista uma vez para achar o maior valor. Se a lista dobra de tamanho, o tempo faz o quê?",
    "resposta": "Mais ou menos dobra: é O(n).",
    "tropeco": "Achar que O(n) mede segundos. Mede como o tempo cresce quando a entrada cresce.",
    "dia": "Procurar um contato rolando a lista cresce com o número de contatos; digitar o nome na busca é quase instantâneo.",
    "virada": false,
    "passos": 6,
    "peso": 0.238
   },
   {
    "codigo": "ED.01",
    "nome": "Tipos abstratos",
    "conceitos": [
     "tipo abstrato de dados",
     "interface e implementação",
     "operações e custos"
    ],
    "dominio": "Descrever uma estrutura pelas operações e custos, sem falar de código",
    "antes": [
     {
      "codigo": "ALG.01",
      "nome": "Custo",
      "materia": "ED"
     },
     {
      "codigo": "PY.04",
      "nome": "Dicionários e conjuntos",
      "materia": "PY"
     }
    ],
    "pergunta": "O que uma fila precisa saber fazer, sem falar de código?",
    "resposta": "Entrar no fim, sair do começo, mostrar quem é o próximo e dizer se está vazia.",
    "tropeco": "Confundir a ideia (o que a estrutura faz) com a implementação (como é feita por dentro).",
    "dia": "Você usa o carrinho de qualquer loja sem saber como foi programado: sabe o que ele faz.",
    "virada": false,
    "passos": 4,
    "peso": 0.143
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
    "dominio": "Explicar por que append é rápido e insert(0, x) é lento",
    "antes": [
     {
      "codigo": "ED.01",
      "nome": "Tipos abstratos",
      "materia": "ED"
     },
     {
      "codigo": "PY.03",
      "nome": "Listas e tuplas",
      "materia": "PY"
     }
    ],
    "pergunta": "Por que lista.append(x) é rápido e lista.insert(0, x) é lento numa lista enorme?",
    "resposta": "No fim, ele só ocupa o próximo lugar; no começo, precisa empurrar todos os itens uma posição.",
    "tropeco": "Achar que dá para acessar posições que não existem, como lista[10] numa lista de 10 itens (vai de 0 a 9).",
    "dia": "Cadeiras numeradas no cinema: achar a 7 é direto; pôr alguém na cadeira 1 obriga todo mundo a mudar de lugar.",
    "virada": false,
    "passos": 5,
    "peso": 0.19
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
    "dominio": "Validar expressões com parênteses usando pilha",
    "antes": [
     {
      "codigo": "ED.02",
      "nome": "Vetores",
      "materia": "ED"
     }
    ],
    "pergunta": "Você empilha a, b e c e desempilha uma vez. O que sai?",
    "resposta": "c, o último que entrou.",
    "tropeco": "Trocar o comportamento da pilha (o último que entra sai primeiro) com o da fila.",
    "dia": "O Ctrl+Z desfaz a última coisa que você fez; o botão voltar do navegador volta para a última página.",
    "virada": false,
    "passos": 6,
    "peso": 0.238
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
    "dominio": "Simular uma fila de atendimento",
    "antes": [
     {
      "codigo": "ED.04",
      "nome": "Pilhas",
      "materia": "ED"
     }
    ],
    "pergunta": "Chegam Ana, Bruno e Carla. Quem é atendido primeiro, e por que usar deque e não lista?",
    "resposta": "Ana. O deque tira do começo sem empurrar todo mundo; a lista precisaria deslocar todos os itens.",
    "tropeco": "Usar lista.pop(0) numa fila grande e deixar o programa lento.",
    "dia": "A fila de pedidos de um restaurante no app de delivery: primeiro pedido, primeiro a sair da cozinha.",
    "virada": false,
    "passos": 5,
    "peso": 0.19
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
    "dominio": "Implementar inserção e remoção numa lista ligada",
    "antes": [
     {
      "codigo": "ED.02",
      "nome": "Vetores",
      "materia": "ED"
     },
     {
      "codigo": "PY.05",
      "nome": "Referências e mutabilidade",
      "materia": "PY"
     },
     {
      "codigo": "PY.11",
      "nome": "Classes em Python",
      "materia": "PY"
     }
    ],
    "pergunta": "Para inserir no fim de uma lista ligada que guarda o último nó (tail), o que precisa ser atualizado?",
    "resposta": "O next do antigo último nó e o próprio tail, que passa a ser o nó novo.",
    "tropeco": "Esquecer de atualizar o tail ao inserir: 16% dos estudantes erraram exatamente isso (Zingaro e colegas, 2018).",
    "dia": "Uma caça ao tesouro: cada pista diz onde está a próxima. Para chegar à quinta, você passa pelas quatro anteriores.",
    "virada": false,
    "passos": 5,
    "peso": 0.19
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
    "dominio": "Escrever funções recursivas corretas e rastreá-las",
    "antes": [
     {
      "codigo": "LOG.07",
      "nome": "Funções",
      "materia": "LOG"
     },
     {
      "codigo": "ED.04",
      "nome": "Pilhas",
      "materia": "ED"
     }
    ],
    "pergunta": "O que acontece com uma função recursiva sem caso base?",
    "resposta": "Ela chama a si mesma sem parar até estourar a pilha de chamadas (RecursionError).",
    "tropeco": "Entender a ida (as chamadas) e não a volta: o resultado é montado quando cada chamada retorna (Kahney; Götschi e colegas, 2003).",
    "dia": "Pastas dentro de pastas na nuvem: para contar os arquivos, você conta os da pasta e repete o processo em cada subpasta.",
    "virada": true,
    "passos": 5,
    "peso": 0.286
   },
   {
    "codigo": "ALG.02",
    "nome": "Busca",
    "conceitos": [
     "busca linear",
     "busca binária",
     "pré-condição de ordenação"
    ],
    "dominio": "Implementar a busca binária sem erro de limite",
    "antes": [
     {
      "codigo": "ED.02",
      "nome": "Vetores",
      "materia": "ED"
     },
     {
      "codigo": "ALG.01",
      "nome": "Custo",
      "materia": "ED"
     }
    ],
    "pergunta": "Quantas comparações, no máximo, a busca binária faz numa lista ordenada de 1 milhão de itens?",
    "resposta": "Cerca de 20, porque cada passo corta o problema pela metade.",
    "tropeco": "Usar busca binária em lista desordenada, ou em lista ligada, onde não dá para pular para o meio (Zingaro e colegas, 2018).",
    "dia": "Adivinhar um número de 1 a 100 ouvindo “maior” ou “menor”: chutando sempre o meio, você acerta em no máximo 7 tentativas.",
    "virada": false,
    "passos": 4,
    "peso": 0.143
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
    "dominio": "Calcular posições, tratar colisões e explicar o custo médio",
    "antes": [
     {
      "codigo": "ED.02",
      "nome": "Vetores",
      "materia": "ED"
     },
     {
      "codigo": "LOG.03",
      "nome": "Operadores e expressões",
      "materia": "LOG"
     }
    ],
    "pergunta": "Por que achar uma chave num dicionário é rápido mesmo com milhões de itens?",
    "resposta": "A função de espalhamento calcula direto a gaveta onde a chave está; não precisa procurar uma por uma.",
    "tropeco": "Achar que, ao aumentar a tabela, as chaves ficam nas mesmas posições. É preciso recalcular a posição de todas (Karpierz e Wolfman, 2014).",
    "dia": "O banco acha a dona de uma chave Pix na hora, entre centenas de milhões de chaves.",
    "virada": false,
    "passos": 7,
    "peso": 0.286
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
    "dominio": "Rastrear cada algoritmo numa lista pequena",
    "antes": [
     {
      "codigo": "ED.02",
      "nome": "Vetores",
      "materia": "ED"
     },
     {
      "codigo": "LOG.06",
      "nome": "Repetição",
      "materia": "LOG"
     }
    ],
    "pergunta": "Na ordenação por inserção, o que acontece com cada novo item?",
    "resposta": "Ele é colocado na posição certa entre os já ordenados, como quem arruma as cartas na mão.",
    "tropeco": "Achar que todos os métodos simples se equivalem. A inserção é rápida para listas quase ordenadas.",
    "dia": "Arrumar as cartas na mão numa partida de truco, uma de cada vez.",
    "virada": false,
    "passos": 5,
    "peso": 0.19
   },
   {
    "codigo": "ALG.05",
    "nome": "Dividir e conquistar",
    "conceitos": [
     "merge sort",
     "quicksort e pivô",
     "custo n log n"
    ],
    "dominio": "Explicar quando o quicksort degrada",
    "antes": [
     {
      "codigo": "ALG.04",
      "nome": "Recursão",
      "materia": "ED"
     },
     {
      "codigo": "ALG.03",
      "nome": "Ordenação simples",
      "materia": "ED"
     }
    ],
    "pergunta": "Como o merge sort ordena uma lista de 8 itens?",
    "resposta": "Divide em metades até sobrar um item em cada parte e depois junta as partes em ordem, subindo até a lista inteira.",
    "tropeco": "Achar que o quicksort é sempre rápido: com pivô ruim numa lista já ordenada, ele vira O(n²).",
    "dia": "Organizar mil provas: dividir entre 10 pessoas, cada uma ordena a sua pilha, e depois juntar as pilhas em ordem.",
    "virada": false,
    "passos": 4,
    "peso": 0.143
   },
   {
    "codigo": "ALG.06",
    "nome": "Ordenação por contagem",
    "conceitos": [
     "counting sort",
     "limite de n log n para comparação"
    ],
    "dominio": "Dizer quando dá para ordenar em tempo linear",
    "antes": [
     {
      "codigo": "ALG.05",
      "nome": "Dividir e conquistar",
      "materia": "ED"
     }
    ],
    "pergunta": "Quando dá para ordenar sem comparar os itens entre si?",
    "resposta": "Quando os valores são inteiros num intervalo pequeno, como notas de 0 a 10: basta contar quantos há de cada.",
    "tropeco": "Usar contagem com valores muito espalhados (de 0 a 1 bilhão): a tabela de contagem fica gigante.",
    "dia": "Separar as cédulas da carteira por valor: uma pilha para cada nota.",
    "virada": false,
    "passos": 3,
    "peso": 0.095
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
    "dominio": "Percorrer uma árvore à mão nos quatro percursos",
    "antes": [
     {
      "codigo": "ALG.04",
      "nome": "Recursão",
      "materia": "ED"
     },
     {
      "codigo": "ED.05",
      "nome": "Filas",
      "materia": "ED"
     }
    ],
    "pergunta": "Em que ordem a pré-ordem visita uma árvore com raiz A e filhos B (esquerda) e C (direita)?",
    "resposta": "A, B, C: primeiro a raiz, depois a esquerda, depois a direita.",
    "tropeco": "Confundir os percursos. O nome diz quando a raiz é visitada: antes (pré), no meio (em) ou depois (pós).",
    "dia": "As pastas do seu computador e o organograma de uma empresa são árvores.",
    "virada": false,
    "passos": 5,
    "peso": 0.19
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
    "dominio": "Manter os k maiores valores de um fluxo com heap",
    "antes": [
     {
      "codigo": "ED.07",
      "nome": "Árvores",
      "materia": "ED"
     },
     {
      "codigo": "ED.02",
      "nome": "Vetores",
      "materia": "ED"
     }
    ],
    "pergunta": "Num heap mínimo, onde fica o menor valor?",
    "resposta": "Sempre na raiz, no topo.",
    "tropeco": "Confundir heap com árvore de busca: no heap o pai é menor que os filhos, mas a esquerda não é menor que a direita.",
    "dia": "O pronto-socorro atende pela gravidade, não pela ordem de chegada: é uma fila de prioridade.",
    "virada": false,
    "passos": 5,
    "peso": 0.19
   },
   {
    "codigo": "ED.08",
    "nome": "Árvore binária de busca",
    "conceitos": [
     "propriedade de ordem",
     "busca, inserção e remoção",
     "árvore degenerada"
    ],
    "dominio": "Inserir e remover numa ABB e prever o formato",
    "antes": [
     {
      "codigo": "ED.07",
      "nome": "Árvores",
      "materia": "ED"
     },
     {
      "codigo": "ALG.02",
      "nome": "Busca",
      "materia": "ED"
     }
    ],
    "pergunta": "Você insere 1, 2, 3, 4 e 5, nessa ordem, numa árvore de busca. Que formato ela fica?",
    "resposta": "Uma escada para a direita, que na prática é uma lista: a busca fica lenta.",
    "tropeco": "Achar que a árvore de busca é balanceada por padrão (Karpierz e Wolfman, 2014).",
    "dia": "O jogo de adivinhar o número guardado em forma de árvore: cada “maior ou menor” desce um nível.",
    "virada": false,
    "passos": 4,
    "peso": 0.143
   },
   {
    "codigo": "ED.09",
    "nome": "Árvores balanceadas",
    "conceitos": [
     "AVL e fator de balanceamento",
     "rotações",
     "árvore B e o índice de banco"
    ],
    "dominio": "Explicar por que o índice de um banco é uma árvore B",
    "antes": [
     {
      "codigo": "ED.08",
      "nome": "Árvore binária de busca",
      "materia": "ED"
     }
    ],
    "pergunta": "Para que servem as rotações de uma árvore AVL?",
    "resposta": "Para manter a árvore baixa depois de inserções e garantir buscas rápidas.",
    "tropeco": "Decorar as rotações sem entender o objetivo: manter a altura perto de log n.",
    "dia": "O índice de um banco de dados é uma árvore sempre equilibrada; por isso a busca continua rápida com bilhões de linhas.",
    "virada": false,
    "passos": 4,
    "peso": 0.143
   },
   {
    "codigo": "ED.11",
    "nome": "Grafos",
    "conceitos": [
     "vértice e aresta",
     "dirigido e ponderado",
     "lista e matriz de adjacência"
    ],
    "dominio": "Representar uma rede pequena nas duas formas",
    "antes": [
     {
      "codigo": "PY.04",
      "nome": "Dicionários e conjuntos",
      "materia": "PY"
     },
     {
      "codigo": "ED.02",
      "nome": "Vetores",
      "materia": "ED"
     }
    ],
    "pergunta": "Como guardar “quem segue quem” num dicionário Python?",
    "resposta": "Cada pessoa é uma chave e o valor é a lista de quem ela segue: {\"ana\": [\"kaio\", \"igor\"]}.",
    "tropeco": "Esquecer que seguir alguém tem direção (grafo dirigido) e amizade mútua não tem.",
    "dia": "Redes sociais e o mapa do aplicativo de trânsito são grafos: pontos ligados por linhas.",
    "virada": false,
    "passos": 4,
    "peso": 0.143
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
    "dominio": "Achar o caminho mínimo num grafo pequeno à mão e em código",
    "antes": [
     {
      "codigo": "ED.11",
      "nome": "Grafos",
      "materia": "ED"
     },
     {
      "codigo": "ED.05",
      "nome": "Filas",
      "materia": "ED"
     },
     {
      "codigo": "ED.10",
      "nome": "Heaps",
      "materia": "ED"
     }
    ],
    "pergunta": "Qual percurso acha o caminho com menos conexões entre duas pessoas numa rede?",
    "resposta": "A busca em largura, que explora primeiro os vizinhos mais próximos.",
    "tropeco": "Usar busca em largura quando as ligações têm pesos (distância, tempo). Aí o certo é Dijkstra.",
    "dia": "O app de trânsito escolhendo a rota mais rápida (Dijkstra) e a rede profissional mostrando “conexão de 2º grau” (largura).",
    "virada": false,
    "passos": 5,
    "peso": 0.19
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
    "dominio": "Mostrar um caso em que o guloso erra",
    "antes": [
     {
      "codigo": "ALG.03",
      "nome": "Ordenação simples",
      "materia": "ED"
     }
    ],
    "pergunta": "Dar troco de 6 com moedas de 1, 3 e 4, escolhendo sempre a maior, dá o menor número de moedas?",
    "resposta": "Não. O guloso faz 4 + 1 + 1 (três moedas), mas 3 + 3 (duas) é melhor.",
    "tropeco": "Achar que escolher sempre o melhor agora dá o melhor no fim.",
    "dia": "Pegar sempre a fila do caixa que parece menor nem sempre faz você sair mais cedo.",
    "virada": false,
    "passos": 5,
    "peso": 0.19
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
    "dominio": "Transformar uma recursão lenta numa solução memorizada",
    "antes": [
     {
      "codigo": "ALG.04",
      "nome": "Recursão",
      "materia": "ED"
     }
    ],
    "pergunta": "Por que calcular Fibonacci de 40 com recursão simples demora tanto?",
    "resposta": "Porque recalcula os mesmos valores milhões de vezes. Guardando cada resultado (memorização), caem para cerca de 40 cálculos.",
    "tropeco": "Não perceber que os subproblemas se repetem.",
    "dia": "Guardar trechos de rota já calculados para não recalcular a viagem inteira a cada desvio.",
    "virada": false,
    "passos": 5,
    "peso": 0.19
   },
   {
    "codigo": "ED.12",
    "nome": "Matrizes",
    "conceitos": [
     "matriz densa e esparsa",
     "armazenamento por linha e por coluna",
     "por que o pandas e o NumPy são colunares"
    ],
    "dominio": "Escolher a representação certa para uma matriz quase toda de zeros",
    "antes": [
     {
      "codigo": "ED.02",
      "nome": "Vetores",
      "materia": "ED"
     }
    ],
    "pergunta": "Uma matriz de 1 milhão por 1 milhão com quase tudo zero: guardar inteira é boa ideia?",
    "resposta": "Não. Use matriz esparsa, que guarda só os valores diferentes de zero.",
    "tropeco": "Esquecer que NumPy e pandas guardam por coluna, e por isso operar a coluna inteira é rápido.",
    "dia": "A tabela “usuário × filme” de um streaming: quase ninguém viu quase nada, então ela é quase toda vazia.",
    "virada": false,
    "passos": 4,
    "peso": 0.143
   },
   {
    "codigo": "ALG.10",
    "nome": "Medir na prática",
    "conceitos": [
     "timeit",
     "crescimento empírico",
     "vetorização como algoritmo melhor"
    ],
    "dominio": "Comparar duas soluções medindo o tempo para tamanhos crescentes",
    "antes": [
     {
      "codigo": "ALG.01",
      "nome": "Custo",
      "materia": "ED"
     },
     {
      "codigo": "PY.10",
      "nome": "Módulos e pacotes",
      "materia": "PY"
     }
    ],
    "pergunta": "Como comparar de verdade duas soluções para o mesmo problema?",
    "resposta": "Medindo o tempo (timeit) para tamanhos crescentes de entrada e vendo como ele cresce.",
    "tropeco": "Medir uma vez só, com entrada pequena, e tirar conclusão.",
    "dia": "Testar a velocidade da internet várias vezes, em horários diferentes, antes de reclamar com a operadora.",
    "virada": false,
    "passos": 4,
    "peso": 0.143
   }
  ]
 },
 {
  "sigla": "POO",
  "nome": "Orientação a objetos",
  "etapa": "Organizar o código",
  "trabalho": "Os pacotes que você usa todo dia, como pandas e scikit-learn, são feitos de classes. Entender objetos ajuda a ler a documentação, estender uma ferramenta e organizar um projeto que outra pessoa vai manter.",
  "porque": "Orientação a objetos é um ponto de virada comprovado (Boustedt e colegas, 2007): demora a fazer sentido, mas depois muda o jeito de ler qualquer código. Por isso vem depois das classes em Python e das estruturas de dados, com tempo para praticar em Java, a linguagem da disciplina da UFMS.",
  "logos": [
   "java",
   "python"
  ],
  "peso": 2,
  "peso_porque": "Útil para organizar projetos maiores; pouco pedido para quem analisa dados.",
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
    "dominio": "Modelar uma entidade nas duas linguagens",
    "antes": [
     {
      "codigo": "PY.11",
      "nome": "Classes em Python",
      "materia": "PY"
     },
     {
      "codigo": "ED.03",
      "nome": "Listas ligadas",
      "materia": "ED"
     }
    ],
    "pergunta": "Qual a diferença entre a classe Conta e a conta do Kaio?",
    "resposta": "A classe é o molde; a conta do Kaio é um objeto feito com ele, com saldo próprio.",
    "tropeco": "Achar que escrever a classe já cria um objeto. É preciso criar (instanciar): Conta().",
    "dia": "O modelo do cartão de um banco é um só; cada cliente recebe o seu cartão, com número próprio.",
    "virada": true,
    "passos": 6,
    "peso": 0.429
   },
   {
    "codigo": "POO.02",
    "nome": "Encapsulamento",
    "conceitos": [
     "modificadores de acesso",
     "getters e setters",
     "invariantes"
    ],
    "dominio": "Proteger as regras de uma classe",
    "antes": [
     {
      "codigo": "POO.01",
      "nome": "Classe e objeto",
      "materia": "POO"
     }
    ],
    "pergunta": "Por que o saldo não deve ser alterado direto, por fora da classe?",
    "resposta": "Para que só os métodos depositar e sacar mexam nele e garantam as regras (o saldo não fica negativo).",
    "tropeco": "Deixar tudo aberto e permitir que qualquer parte do código bagunce o objeto.",
    "dia": "Você não edita o saldo no app do banco: faz operações que o banco valida.",
    "virada": false,
    "passos": 4,
    "peso": 0.171
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
    "dominio": "Montar uma hierarquia pequena sem repetição",
    "antes": [
     {
      "codigo": "POO.01",
      "nome": "Classe e objeto",
      "materia": "POO"
     }
    ],
    "pergunta": "ContaPoupanca herda de Conta. O que ela ganha sem escrever nada?",
    "resposta": "Todos os atributos e métodos de Conta. Só escreve o que muda, como o rendimento.",
    "tropeco": "Usar herança só para reaproveitar código quando a relação não é “é um”.",
    "dia": "Todo plano de streaming é uma assinatura; o plano família é uma assinatura com mais telas.",
    "virada": false,
    "passos": 5,
    "peso": 0.229
   },
   {
    "codigo": "POO.04",
    "nome": "Polimorfismo",
    "conceitos": [
     "sobrescrita e sobrecarga",
     "ligação dinâmica",
     "tratar tipos diferentes pela mesma interface"
    ],
    "dominio": "Corrigir uma lista de questões de tipos diferentes sem nenhum if de tipo",
    "antes": [
     {
      "codigo": "POO.03",
      "nome": "Herança",
      "materia": "POO"
     }
    ],
    "pergunta": "Uma lista tem um Pix, um boleto e um cartão. Como pagar todos sem if perguntando o tipo?",
    "resposta": "Cada classe tem o seu método pagar(); o laço chama pagamento.pagar() para todos, e cada um faz do seu jeito.",
    "tropeco": "Encher o código de “se for Pix faça isto, se for boleto faça aquilo”.",
    "dia": "O botão “pagar” do app funciona para Pix, cartão e boleto; cada um paga do seu jeito.",
    "virada": true,
    "passos": 4,
    "peso": 0.257
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
    "dominio": "Decidir entre herança e composição em três casos",
    "antes": [
     {
      "codigo": "POO.04",
      "nome": "Polimorfismo",
      "materia": "POO"
     }
    ],
    "pergunta": "Qual a diferença entre herdar e compor?",
    "resposta": "Herdar é “é um” (poupança é uma conta). Compor é “tem um” (pedido tem itens).",
    "tropeco": "Criar hierarquias enormes de herança quando bastaria juntar objetos.",
    "dia": "Um carro tem motor (composição); um carro elétrico é um carro (herança).",
    "virada": false,
    "passos": 5,
    "peso": 0.229
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
    "dominio": "Prever a saída de programas Java típicos de prova",
    "antes": [
     {
      "codigo": "POO.01",
      "nome": "Classe e objeto",
      "materia": "POO"
     },
     {
      "codigo": "CMP.07",
      "nome": "Como o código roda",
      "materia": "CMP"
     }
    ],
    "pergunta": "Em Java, s1 == s2 compara o texto de duas Strings?",
    "resposta": "Não. Compara se são o mesmo objeto. Para comparar o texto, use s1.equals(s2).",
    "tropeco": "Usar == para comparar textos em Java. Cai em prova.",
    "dia": "Dois boletos com o mesmo valor não são o mesmo boleto: ter o mesmo conteúdo não é ser a mesma coisa.",
    "virada": false,
    "passos": 7,
    "peso": 0.343
   },
   {
    "codigo": "POO.07",
    "nome": "Coleções",
    "conceitos": [
     "ArrayList, HashMap, HashSet em Java",
     "equivalentes em Python",
     "genéricos"
    ],
    "dominio": "Escolher a coleção certa em Java e em Python",
    "antes": [
     {
      "codigo": "POO.06",
      "nome": "Java essencial",
      "materia": "POO"
     },
     {
      "codigo": "PY.04",
      "nome": "Dicionários e conjuntos",
      "materia": "PY"
     }
    ],
    "pergunta": "Qual o equivalente em Java do dicionário do Python?",
    "resposta": "HashMap.",
    "tropeco": "Escolher lista quando a busca é por chave. Aí o certo é HashMap (Java) ou dict (Python).",
    "dia": "A mesma agenda de contatos escrita em duas línguas.",
    "virada": false,
    "passos": 4,
    "peso": 0.171
   },
   {
    "codigo": "POO.08",
    "nome": "Princípios de projeto",
    "conceitos": [
     "coesão e acoplamento",
     "responsabilidade única",
     "padrões comuns (estratégia, fábrica) em nível de conceito"
    ],
    "dominio": "Refatorar uma classe que faz coisas demais",
    "antes": [
     {
      "codigo": "POO.05",
      "nome": "Abstração e interfaces",
      "materia": "POO"
     }
    ],
    "pergunta": "O que está errado numa classe Pedido que também manda e-mail, gera PDF e calcula imposto?",
    "resposta": "Ela faz coisas demais. Cada responsabilidade deveria ficar numa classe própria.",
    "tropeco": "Criar uma classe que faz tudo e que ninguém consegue mudar sem quebrar alguma coisa.",
    "dia": "No restaurante, quem cozinha não é quem entrega nem quem cobra.",
    "virada": false,
    "passos": 4,
    "peso": 0.171
   }
  ]
 },
 {
  "sigla": "ENG",
  "nome": "Ferramentas do ofício",
  "etapa": "Entregar e manter",
  "trabalho": "A análise só vale se outra pessoa consegue rodar de novo: o ambiente do projeto, o Git com o histórico de cada mudança e o pipeline que roda sozinho toda noite levam o seu notebook para dentro da empresa.",
  "porque": "Na ordem em que você precisa delas para trabalhar: terminal, ambiente do projeto, notebook, Git e só depois o trabalho em equipe, os pipelines e a nuvem. É a ordem do curso The Missing Semester, do MIT.",
  "logos": [
   "bash",
   "git",
   "github",
   "vscode",
   "jupyter",
   "docker",
   "anaconda"
  ],
  "peso": 5,
  "peso_porque": "Git, ambientes, nuvem e pipelines: AWS em 20% das vagas, Azure em 14%, Docker em 7%.",
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
    "dominio": "Achar e filtrar arquivos e linhas só pelo terminal",
    "antes": [
     {
      "codigo": "CMP.05",
      "nome": "Sistemas operacionais",
      "materia": "CMP"
     }
    ],
    "pergunta": "O que fazem cd dados e depois ls?",
    "resposta": "Entram na pasta dados e listam os arquivos dela.",
    "tropeco": "Usar rm achando que o arquivo vai para a lixeira. No terminal, apagar é para sempre.",
    "dia": "É conversar com o computador por mensagem de texto em vez de clicar.",
    "virada": false,
    "passos": 6,
    "peso": 0.532
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
    "dominio": "Recriar o ambiente de um projeto do zero",
    "antes": [
     {
      "codigo": "ENG.01",
      "nome": "Terminal",
      "materia": "ENG"
     },
     {
      "codigo": "PY.10",
      "nome": "Módulos e pacotes",
      "materia": "PY"
     }
    ],
    "pergunta": "Por que cada projeto deveria ter seu ambiente virtual?",
    "resposta": "Para que as versões das bibliotecas de um projeto não quebrem as de outro.",
    "tropeco": "Instalar tudo no Python do sistema e um projeto parar de funcionar quando outro atualiza uma biblioteca.",
    "dia": "Cada app do celular tem seus próprios dados e permissões; um não bagunça o outro.",
    "virada": false,
    "passos": 5,
    "peso": 0.426
   },
   {
    "codigo": "ENG.05",
    "nome": "Jupyter e editor",
    "conceitos": [
     "células",
     "ordem de execução e estado oculto",
     "quando sair do notebook para módulo"
    ],
    "dominio": "Achar o erro causado por células rodadas fora de ordem",
    "antes": [
     {
      "codigo": "ENG.04",
      "nome": "Ambientes",
      "materia": "ENG"
     }
    ],
    "pergunta": "Uma variável usada na célula 5 foi criada numa célula que você já apagou. O notebook ainda funciona?",
    "resposta": "Funciona até reiniciar, e isso engana. Reinicie e rode tudo de cima para baixo para conferir.",
    "tropeco": "Rodar células fora de ordem e achar que o notebook está certo.",
    "dia": "Um documento em que cada parágrafo pode rodar um cálculo e mostrar o resultado logo abaixo.",
    "virada": false,
    "passos": 4,
    "peso": 0.319
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
    "dominio": "Versionar um projeto e voltar a uma versão anterior",
    "antes": [
     {
      "codigo": "ENG.01",
      "nome": "Terminal",
      "materia": "ENG"
     }
    ],
    "pergunta": "Qual a diferença entre git add e git commit?",
    "resposta": "add escolhe o que entra na próxima foto do projeto; commit tira a foto, com uma mensagem.",
    "tropeco": "Fazer um commit gigante, com tudo misturado e a mensagem “ajustes”.",
    "dia": "O histórico de versões de um documento na nuvem, só que você decide quando salvar e escreve o que mudou.",
    "virada": false,
    "passos": 6,
    "peso": 0.532
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
    "dominio": "Resolver um conflito de merge",
    "antes": [
     {
      "codigo": "ENG.02",
      "nome": "Git",
      "materia": "ENG"
     }
    ],
    "pergunta": "O que é um conflito de merge?",
    "resposta": "Duas pessoas mudaram a mesma linha de jeitos diferentes; o Git pede que você escolha.",
    "tropeco": "Ter medo de conflito. Ele só pede uma decisão sua.",
    "dia": "Duas pessoas editando a mesma célula de uma planilha compartilhada ao mesmo tempo.",
    "virada": false,
    "passos": 7,
    "peso": 0.638
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
    "dominio": "Organizar um projeto que outra pessoa consiga rodar",
    "antes": [
     {
      "codigo": "ENG.02",
      "nome": "Git",
      "materia": "ENG"
     },
     {
      "codigo": "ENG.04",
      "nome": "Ambientes",
      "materia": "ENG"
     }
    ],
    "pergunta": "Por que nunca editar o arquivo de dados brutos?",
    "resposta": "Para poder refazer tudo do começo. As mudanças ficam no código, que dá para revisar.",
    "tropeco": "Corrigir dados à mão na planilha original e perder o rastro do que mudou.",
    "dia": "Guardar a foto original e editar uma cópia.",
    "virada": false,
    "passos": 5,
    "peso": 0.426
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
    "dominio": "Pôr testes e validação num pipeline de análise",
    "antes": [
     {
      "codigo": "PY.13",
      "nome": "Testes",
      "materia": "PY"
     },
     {
      "codigo": "ENG.06",
      "nome": "Projeto de dados",
      "materia": "ENG"
     }
    ],
    "pergunta": "Que validação você poria na chegada de um arquivo de vendas?",
    "resposta": "Colunas esperadas, tipos certos, valores não negativos e datas no período certo.",
    "tropeco": "Confiar que o dado sempre chega certo.",
    "dia": "O app do banco recusa um Pix de valor negativo antes de processar.",
    "virada": false,
    "passos": 5,
    "peso": 0.426
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
    "dominio": "Desenhar um pipeline diário idempotente",
    "antes": [
     {
      "codigo": "ENG.06",
      "nome": "Projeto de dados",
      "materia": "ENG"
     },
     {
      "codigo": "BD.14",
      "nome": "Criar e alterar",
      "materia": "BD"
     }
    ],
    "pergunta": "O que quer dizer um pipeline idempotente?",
    "resposta": "Rodar duas vezes dá o mesmo resultado que rodar uma, sem duplicar dados.",
    "tropeco": "Um pipeline que duplica linhas quando roda de novo depois de uma falha.",
    "dia": "Apertar “pagar” duas vezes não pode cobrar duas vezes.",
    "virada": false,
    "passos": 7,
    "peso": 0.638
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
    "dominio": "Explicar como empacotar uma análise para rodar em outro lugar",
    "antes": [
     {
      "codigo": "ENG.04",
      "nome": "Ambientes",
      "materia": "ENG"
     }
    ],
    "pergunta": "O que um contêiner resolve?",
    "resposta": "Leva o programa junto com tudo de que ele precisa, para rodar igual em qualquer máquina.",
    "tropeco": "Achar que a nuvem é de graça: armazenamento e processamento são cobrados por uso.",
    "dia": "Uma marmita: a comida vai pronta e igual para qualquer lugar.",
    "virada": false,
    "passos": 6,
    "peso": 0.532
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
    "dominio": "Resolver itens de engenharia de software no estilo Cebraspe",
    "antes": [
     {
      "codigo": "ENG.03",
      "nome": "Git em equipe",
      "materia": "ENG"
     }
    ],
    "pergunta": "O que é um sprint no Scrum?",
    "resposta": "Um ciclo curto (de 1 a 4 semanas) com metas definidas, ao fim do qual algo funcionando é entregue.",
    "tropeco": "Achar que ágil é trabalhar sem planejamento. O plano é feito em ciclos curtos.",
    "dia": "Um quadro com colunas “a fazer”, “fazendo” e “feito” é um Kanban.",
    "virada": false,
    "passos": 6,
    "peso": 0.532
   }
  ]
 },
 {
  "sigla": "FMT",
  "nome": "Formatos e coleta de dados",
  "etapa": "Coletar",
  "trabalho": "Os dados chegam de todo jeito: CSV exportado do sistema, JSON da API de um parceiro, planilha com células mescladas, datas em três formatos. Coletar e ler tudo isso direito é a primeira etapa de qualquer projeto.",
  "porque": "Do formato que mais aparece ao que menos aparece: CSV e JSON primeiro, datas logo depois (estão em toda base), planilhas, Parquet, APIs e dados públicos; raspagem, texto e imagem no fim.",
  "logos": [
   "json",
   "html5",
   "markdown"
  ],
  "peso": 4,
  "peso_porque": "Coletar e ler dados de arquivos, APIs e da web: é por onde todo projeto começa.",
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
    "dominio": "Ler sem erro um CSV brasileiro com acentos, ; e vírgula decimal",
    "antes": [
     {
      "codigo": "PY.09",
      "nome": "Arquivos",
      "materia": "PY"
     },
     {
      "codigo": "CMP.02",
      "nome": "Texto",
      "materia": "CMP"
     }
    ],
    "pergunta": "Ao abrir um CSV, tudo veio numa coluna só. O que fazer?",
    "resposta": "Informar o separador certo, provavelmente o ponto e vírgula.",
    "tropeco": "Ler “7,5” como texto porque a vírgula é a casa decimal. Informe decimal=\",\".",
    "dia": "Exportar o extrato do banco ou a fatura do cartão em CSV e abrir na planilha.",
    "virada": false,
    "passos": 6,
    "peso": 0.37
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
    "dominio": "Transformar um JSON aninhado em tabela",
    "antes": [
     {
      "codigo": "PY.04",
      "nome": "Dicionários e conjuntos",
      "materia": "PY"
     }
    ],
    "pergunta": "Como pegar a cidade em {\"endereco\": {\"cidade\": \"Campo Grande\"}}?",
    "resposta": "dados[\"endereco\"][\"cidade\"].",
    "tropeco": "Esquecer que um JSON aninhado precisa ser achatado antes de virar tabela.",
    "dia": "Consultar um CEP numa API pública devolve um JSON com rua, bairro e cidade.",
    "virada": false,
    "passos": 5,
    "peso": 0.296
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
    "dominio": "Corrigir uma série com datas em formatos misturados",
    "antes": [
     {
      "codigo": "PY.10",
      "nome": "Módulos e pacotes",
      "materia": "PY"
     }
    ],
    "pergunta": "Por que guardar datas como 2026-10-12 e não como 12/10/2026?",
    "resposta": "O formato ISO ordena certo como texto e não confunde dia com mês.",
    "tropeco": "Misturar o formato americano (mês/dia) com o brasileiro (dia/mês) na mesma coluna.",
    "dia": "O lembrete que dispara uma hora antes porque o servidor está em outro fuso horário.",
    "virada": false,
    "passos": 6,
    "peso": 0.37
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
    "dominio": "Extrair uma tabela limpa de uma planilha mal formatada",
    "antes": [
     {
      "codigo": "FMT.01",
      "nome": "CSV",
      "materia": "FMT"
     }
    ],
    "pergunta": "Por que uma data do Excel aparece como 45210 no Python?",
    "resposta": "O Excel guarda datas como número de dias desde 1900; é preciso converter.",
    "tropeco": "Ler células mescladas e cabeçalhos em várias linhas sem limpar antes.",
    "dia": "A planilha do financeiro, cheia de cores, totais no meio e várias abas.",
    "virada": false,
    "passos": 5,
    "peso": 0.296
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
    "dominio": "Converter CSV para Parquet e comparar tamanho e velocidade",
    "antes": [
     {
      "codigo": "FMT.01",
      "nome": "CSV",
      "materia": "FMT"
     },
     {
      "codigo": "ED.12",
      "nome": "Matrizes",
      "materia": "ED"
     }
    ],
    "pergunta": "Por que o mesmo dado ocupa muito menos em Parquet do que em CSV?",
    "resposta": "Ele guarda por coluna, com tipos definidos e compressão.",
    "tropeco": "Abrir um Parquet num editor de texto e achar que está corrompido. Ele é binário.",
    "dia": "Um vídeo comprimido ocupa menos e abre rápido: o Parquet faz isso com tabelas.",
    "virada": false,
    "passos": 5,
    "peso": 0.296
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
    "dominio": "Baixar uma série completa de uma API pública paginada",
    "antes": [
     {
      "codigo": "FMT.02",
      "nome": "JSON",
      "materia": "FMT"
     },
     {
      "codigo": "CMP.06",
      "nome": "Redes e web",
      "materia": "CMP"
     }
    ],
    "pergunta": "A API devolveu só 100 itens de 5.000. O que faltou?",
    "resposta": "A paginação: pedir as páginas seguintes até acabar.",
    "tropeco": "Pôr a chave da API dentro do código que vai para o GitHub.",
    "dia": "O app do clima pede os dados a um servidor e recebe um JSON pronto.",
    "virada": false,
    "passos": 7,
    "peso": 0.444
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
    "dominio": "Montar uma base a partir de duas fontes oficiais com dicionário de dados",
    "antes": [
     {
      "codigo": "FMT.07",
      "nome": "APIs",
      "materia": "FMT"
     },
     {
      "codigo": "FMT.01",
      "nome": "CSV",
      "materia": "FMT"
     }
    ],
    "pergunta": "Onde achar as séries da Selic e do IPCA?",
    "resposta": "No sistema de séries do Banco Central (SGS), que tem API pública.",
    "tropeco": "Usar a base sem ler o dicionário de dados e interpretar um código errado.",
    "dia": "Os gráficos de inflação dos jornais usam essas mesmas fontes oficiais.",
    "virada": false,
    "passos": 7,
    "peso": 0.444
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
    "dominio": "Extrair uma tabela de uma página HTML salva",
    "antes": [
     {
      "codigo": "FMT.02",
      "nome": "JSON",
      "materia": "FMT"
     }
    ],
    "pergunta": "Em <produto preco=\"10\">Café</produto>, o que é elemento e o que é atributo?",
    "resposta": "O elemento é produto, com o texto Café; preco=\"10\" é um atributo.",
    "tropeco": "Cortar HTML com split em vez de usar um leitor de HTML.",
    "dia": "A nota fiscal eletrônica (NF-e) é um XML.",
    "virada": false,
    "passos": 5,
    "peso": 0.296
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
    "dominio": "Coletar dados de uma página permitida, sem sobrecarregá-la",
    "antes": [
     {
      "codigo": "FMT.04",
      "nome": "XML e HTML",
      "materia": "FMT"
     },
     {
      "codigo": "CMP.06",
      "nome": "Redes e web",
      "materia": "CMP"
     }
    ],
    "pergunta": "Antes de raspar um site, o que conferir?",
    "resposta": "Se existe API, os termos de uso, o robots.txt e um ritmo que não sobrecarregue o servidor.",
    "tropeco": "Disparar milhares de requisições por segundo e ser bloqueado.",
    "dia": "Os comparadores de preço coletam dados de lojas automaticamente.",
    "virada": false,
    "passos": 5,
    "peso": 0.296
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
    "dominio": "Comparar documentos por TF-IDF",
    "antes": [
     {
      "codigo": "PY.14",
      "nome": "Expressões regulares",
      "materia": "PY"
     },
     {
      "codigo": "PY.04",
      "nome": "Dicionários e conjuntos",
      "materia": "PY"
     }
    ],
    "pergunta": "O que o TF-IDF valoriza numa palavra?",
    "resposta": "Aparecer muito num documento e pouco nos outros: é o que torna a palavra característica dele.",
    "tropeco": "Contar palavras sem tirar as muito comuns (de, a, que).",
    "dia": "O resumo automático das avaliações de um produto: “os clientes falam de entrega e tamanho”.",
    "virada": false,
    "passos": 6,
    "peso": 0.37
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
    "dominio": "Fazer operações básicas numa imagem como matriz NumPy",
    "antes": [
     {
      "codigo": "ED.12",
      "nome": "Matrizes",
      "materia": "ED"
     }
    ],
    "pergunta": "Como o computador guarda uma foto colorida de 1000 × 1000 pixels?",
    "resposta": "Como uma grade de 1000 × 1000 com 3 números por pixel: vermelho, verde e azul.",
    "tropeco": "Esquecer os canais de cor e tratar a imagem como uma tabela simples.",
    "dia": "Os filtros de foto das redes sociais mudam os números de cada pixel.",
    "virada": false,
    "passos": 5,
    "peso": 0.296
   },
   {
    "codigo": "FMT.12",
    "nome": "Serialização",
    "conceitos": [
     "pickle e seus riscos",
     "JSON para troca",
     "versões de esquema"
    ],
    "dominio": "Escolher formato de troca seguro entre sistemas",
    "antes": [
     {
      "codigo": "FMT.02",
      "nome": "JSON",
      "materia": "FMT"
     }
    ],
    "pergunta": "Por que não abrir um arquivo pickle recebido de um desconhecido?",
    "resposta": "Porque, ao carregar, ele pode executar código malicioso.",
    "tropeco": "Usar pickle para trocar dados entre sistemas. Prefira JSON ou Parquet.",
    "dia": "Não abrir anexo executável de e-mail desconhecido: mesmo princípio.",
    "virada": false,
    "passos": 4,
    "peso": 0.222
   }
  ]
 },
 {
  "sigla": "AD",
  "nome": "Análise de dados",
  "etapa": "Limpar e analisar",
  "trabalho": "A maior parte do tempo de um cientista de dados passa aqui: limpar, juntar, agrupar e resumir tabelas com pandas até a pergunta do negócio virar um número confiável.",
  "porque": "Tabelas antes de modelos, como no Data 8 e no Data 100, de Berkeley: NumPy, depois o DataFrame, filtrar, agrupar, juntar, arrumar e limpar. Cada passo tem o seu par em SQL, que você já viu. Um estudo com os envios de alunos de um curso de análise de dados (Singh e colegas, 2024) mostra onde se erra: entender os dados, valores ausentes e uso errado das bibliotecas.",
  "logos": [
   "pandas",
   "numpy",
   "jupyter",
   "duckdb",
   "polars"
  ],
  "peso": 10,
  "peso_porque": "Limpar e analisar com pandas é a maior parte do tempo de trabalho de quem lida com dados.",
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
    "dominio": "Trocar laços por operações vetorizadas e medir o ganho",
    "antes": [
     {
      "codigo": "PY.07",
      "nome": "Compreensões e iteração",
      "materia": "PY"
     },
     {
      "codigo": "ED.12",
      "nome": "Matrizes",
      "materia": "ED"
     }
    ],
    "pergunta": "Como somar 10 a todos os preços de um array, sem laço?",
    "resposta": "precos + 10. É a vetorização.",
    "tropeco": "Escrever um laço for sobre um array grande. A operação vetorizada é dezenas de vezes mais rápida.",
    "dia": "Aplicar um reajuste de 5% em todos os preços da loja de uma vez.",
    "virada": false,
    "passos": 9,
    "peso": 1.818
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
    "dominio": "Carregar e descrever um conjunto de dados novo em minutos",
    "antes": [
     {
      "codigo": "AD.01",
      "nome": "NumPy",
      "materia": "AD"
     },
     {
      "codigo": "FMT.01",
      "nome": "CSV",
      "materia": "FMT"
     }
    ],
    "pergunta": "O que df.info() mostra de útil logo de cara?",
    "resposta": "As colunas, o tipo de cada uma e quantos valores não nulos cada uma tem.",
    "tropeco": "Começar a analisar sem olhar tipos e valores ausentes.",
    "dia": "Abrir uma planilha nova e olhar o cabeçalho e o tamanho antes de mexer.",
    "virada": false,
    "passos": 5,
    "peso": 0.909
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
    "dominio": "Responder perguntas filtrando sem o erro de cópia encadeada",
    "antes": [
     {
      "codigo": "AD.02",
      "nome": "pandas: estruturas",
      "materia": "AD"
     },
     {
      "codigo": "BD.04",
      "nome": "Filtrar",
      "materia": "BD"
     }
    ],
    "pergunta": "Como pegar só os pedidos acima de R$ 100?",
    "resposta": "df[df[\"valor\"] > 100] ou df.query(\"valor > 100\").",
    "tropeco": "Usar and e or em vez de & e | nas condições do pandas, e esquecer os parênteses.",
    "dia": "O filtro de uma coluna na planilha.",
    "virada": false,
    "passos": 6,
    "peso": 1.136
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
    "dominio": "Fazer em pandas a mesma análise feita em SQL e conferir",
    "antes": [
     {
      "codigo": "AD.03",
      "nome": "Selecionar e filtrar",
      "materia": "AD"
     },
     {
      "codigo": "BD.07",
      "nome": "Agregação",
      "materia": "BD"
     }
    ],
    "pergunta": "Como calcular a taxa de acerto por matéria?",
    "resposta": "df.groupby(\"materia_id\")[\"acertou\"].mean().",
    "tropeco": "Esquecer que o groupby sozinho não calcula nada: precisa da conta (mean, sum, count).",
    "dia": "A tabela dinâmica da planilha.",
    "virada": false,
    "passos": 6,
    "peso": 1.136
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
    "dominio": "Juntar tabelas e provar que nenhuma linha se perdeu ou duplicou",
    "antes": [
     {
      "codigo": "AD.04",
      "nome": "Agrupar",
      "materia": "AD"
     },
     {
      "codigo": "BD.08",
      "nome": "Junções",
      "materia": "BD"
     }
    ],
    "pergunta": "Como saber se um merge duplicou linhas?",
    "resposta": "Comparar o número de linhas antes e depois, ou usar validate=\"many_to_one\".",
    "tropeco": "Juntar por uma chave que se repete dos dois lados e multiplicar as linhas.",
    "dia": "O PROCV que, com nome repetido, traz o valor errado sem avisar.",
    "virada": false,
    "passos": 5,
    "peso": 0.909
   },
   {
    "codigo": "AD.06",
    "nome": "Arrumar dados",
    "conceitos": [
     "dado arrumado (tidy data)",
     "melt e pivot",
     "colunas com mais de uma informação"
    ],
    "dominio": "Arrumar uma tabela larga de planilha para formato longo",
    "antes": [
     {
      "codigo": "AD.04",
      "nome": "Agrupar",
      "materia": "AD"
     }
    ],
    "pergunta": "Uma planilha tem uma coluna por mês (jan, fev, mar). Por que passar para o formato longo?",
    "resposta": "Porque cada linha vira uma observação (mês, valor), e agrupar e fazer gráfico ficam simples.",
    "tropeco": "Analisar a tabela larga como está e escrever uma conta para cada coluna.",
    "dia": "O relatório que chega com um mês por coluna.",
    "virada": false,
    "passos": 4,
    "peso": 0.682
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
    "dominio": "Limpar uma base real e documentar cada decisão",
    "antes": [
     {
      "codigo": "AD.05",
      "nome": "Juntar",
      "materia": "AD"
     },
     {
      "codigo": "AD.06",
      "nome": "Arrumar dados",
      "materia": "AD"
     }
    ],
    "pergunta": "A coluna cidade tem “Campo Grande”, “campo grande” e “C. Grande”. O que fazer?",
    "resposta": "Padronizar (minúsculas, sem espaços sobrando) e mapear as variações para um nome só, registrando a regra.",
    "tropeco": "Apagar todas as linhas com valor ausente sem pensar no viés que isso cria. Valores ausentes estão entre os erros mais comuns (Singh e colegas, 2024).",
    "dia": "Um cadastro em que cada atendente escreveu o nome da cidade de um jeito.",
    "virada": false,
    "passos": 7,
    "peso": 1.364
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
    "dominio": "Calcular a inflação acumulada em 12 meses a partir da série mensal",
    "antes": [
     {
      "codigo": "AD.04",
      "nome": "Agrupar",
      "materia": "AD"
     },
     {
      "codigo": "FMT.06",
      "nome": "Datas e horas",
      "materia": "FMT"
     }
    ],
    "pergunta": "Como calcular a inflação acumulada em 12 meses a partir das variações mensais?",
    "resposta": "Multiplicar os fatores (1 + variação) dos 12 meses e subtrair 1, numa janela que anda mês a mês.",
    "tropeco": "Somar as variações mensais em vez de compor.",
    "dia": "O IPCA acumulado em 12 meses que aparece no noticiário.",
    "virada": false,
    "passos": 6,
    "peso": 1.136
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
    "dominio": "Analisar um arquivo maior que o confortável sem travar",
    "antes": [
     {
      "codigo": "AD.04",
      "nome": "Agrupar",
      "materia": "AD"
     },
     {
      "codigo": "CMP.04",
      "nome": "Arquitetura",
      "materia": "CMP"
     }
    ],
    "pergunta": "O arquivo tem 5 GB e o computador, 8 GB de RAM. Como analisar?",
    "resposta": "Ler só as colunas necessárias, em partes, com tipos menores, ou consultar o arquivo direto com DuckDB ou Polars.",
    "tropeco": "Carregar tudo de uma vez e travar o computador.",
    "dia": "Assistir a uma série por streaming em vez de baixar a temporada inteira antes.",
    "virada": false,
    "passos": 5,
    "peso": 0.909
   }
  ]
 },
 {
  "sigla": "VIS",
  "nome": "Visualização e comunicação",
  "etapa": "Comunicar",
  "trabalho": "Um bom gráfico decide a reunião. Você mostra para a diretoria, num slide, que o cancelamento se concentra no segundo mês de assinatura, e a decisão sai ali.",
  "porque": "Primeiro como o olho lê um gráfico, depois qual gráfico usar, depois fazer e corrigir. A análise exploratória entra aqui porque é feita com gráficos. Relatório e painel fecham a matéria, porque comunicar é o fim de toda análise.",
  "logos": [
   "matplotlib",
   "plotly"
  ],
  "peso": 7,
  "peso_porque": "Comunicar o resultado: visualização em 10% das vagas, Tableau em 12%, Power BI em 9%.",
  "modulos": [
   {
    "codigo": "VIS.01",
    "nome": "Percepção",
    "conceitos": [
     "posição, comprimento, ângulo e cor",
     "o que o olho compara bem e mal"
    ],
    "dominio": "Ordenar codificações visuais por precisão",
    "antes": [],
    "pergunta": "Para comparar 5 valores com precisão, pizza ou barras?",
    "resposta": "Barras: o olho compara comprimentos muito melhor do que ângulos.",
    "tropeco": "Usar pizza com muitas fatias parecidas.",
    "dia": "O gráfico de pizza da fatura do cartão em que ninguém consegue comparar as fatias.",
    "virada": false,
    "passos": 3,
    "peso": 0.483
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
    "dominio": "Escolher o gráfico certo para dez perguntas",
    "antes": [
     {
      "codigo": "VIS.01",
      "nome": "Percepção",
      "materia": "VIS"
     },
     {
      "codigo": "EST.02",
      "nome": "Estatística descritiva",
      "materia": "EST"
     }
    ],
    "pergunta": "Que gráfico mostra como a Selic mudou mês a mês?",
    "resposta": "Linha: evolução no tempo.",
    "tropeco": "Usar barras para uma série longa no tempo, ou linha para categorias sem ordem.",
    "dia": "O gráfico de linha da cotação do dólar no app do banco.",
    "virada": false,
    "passos": 6,
    "peso": 1.207
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
    "dominio": "Fazer um painel de quatro gráficos legível",
    "antes": [
     {
      "codigo": "VIS.02",
      "nome": "Escolher o gráfico",
      "materia": "VIS"
     },
     {
      "codigo": "AD.02",
      "nome": "pandas: estruturas",
      "materia": "AD"
     }
    ],
    "pergunta": "O que todo gráfico precisa ter antes de ir para um relatório?",
    "resposta": "Título que diz o recado, eixos com nome e unidade, e a fonte dos dados.",
    "tropeco": "Deixar os rótulos automáticos (col_1, valor) e a legenda cobrindo os dados.",
    "dia": "O gráfico da planilha, só que feito com código que você roda de novo quando os dados mudam.",
    "virada": false,
    "passos": 5,
    "peso": 0.966
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
    "dominio": "Corrigir três gráficos enganosos",
    "antes": [
     {
      "codigo": "VIS.03",
      "nome": "Matplotlib",
      "materia": "VIS"
     }
    ],
    "pergunta": "Barras com o eixo começando em 50 comparando 52% e 55%: o que está errado?",
    "resposta": "A diferença real, de 3 pontos, parece o triplo. Barras precisam começar no zero.",
    "tropeco": "Cortar o eixo para “dar destaque” e enganar o leitor.",
    "dia": "Gráficos de propaganda com a escala esticada.",
    "virada": false,
    "passos": 5,
    "peso": 0.966
   },
   {
    "codigo": "VIS.05",
    "nome": "Gráfico explicativo",
    "conceitos": [
     "um recado por gráfico",
     "título que diz a conclusão",
     "destaque e contexto"
    ],
    "dominio": "Transformar um gráfico exploratório em explicativo",
    "antes": [
     {
      "codigo": "VIS.04",
      "nome": "Gráficos que mentem",
      "materia": "VIS"
     }
    ],
    "pergunta": "O que muda entre um gráfico para explorar e um para explicar?",
    "resposta": "O explicativo tem um recado só, título que conclui e destaque no que importa. O exploratório é para você.",
    "tropeco": "Mandar para o chefe o gráfico do jeito que saiu da análise.",
    "dia": "O gráfico de jornal com o título “Inflação desacelera pelo terceiro mês”.",
    "virada": false,
    "passos": 4,
    "peso": 0.724
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
    "dominio": "Fazer uma análise exploratória completa com cinco achados justificados",
    "antes": [
     {
      "codigo": "AD.07",
      "nome": "Limpeza",
      "materia": "AD"
     },
     {
      "codigo": "VIS.03",
      "nome": "Matplotlib",
      "materia": "VIS"
     },
     {
      "codigo": "EST.02",
      "nome": "Estatística descritiva",
      "materia": "EST"
     }
    ],
    "pergunta": "Antes de qualquer gráfico, o que define uma boa análise exploratória?",
    "resposta": "Perguntas claras: o que eu quero descobrir? Os gráficos vêm para responder a elas.",
    "tropeco": "Gerar dezenas de gráficos sem pergunta e não concluir nada.",
    "dia": "Olhar os gastos do ano e perguntar: onde foi a maior parte do dinheiro? Em que mês gastei mais?",
    "virada": false,
    "passos": 6,
    "peso": 1.207
   },
   {
    "codigo": "VIS.06",
    "nome": "Relatório e notebook",
    "conceitos": [
     "estrutura (pergunta, método, resultado, limite)",
     "notebook reproduzível",
     "Markdown"
    ],
    "dominio": "Escrever um relatório de uma página a partir de uma análise",
    "antes": [
     {
      "codigo": "VIS.05",
      "nome": "Gráfico explicativo",
      "materia": "VIS"
     },
     {
      "codigo": "AD.09",
      "nome": "Análise exploratória",
      "materia": "VIS"
     },
     {
      "codigo": "ENG.05",
      "nome": "Jupyter e editor",
      "materia": "ENG"
     }
    ],
    "pergunta": "Quais as quatro partes de um relatório de análise?",
    "resposta": "Pergunta, método, resultado e limitações.",
    "tropeco": "Esconder as limitações. São elas que dão credibilidade ao resultado.",
    "dia": "O resumo de uma página que você manda antes da reunião.",
    "virada": false,
    "passos": 4,
    "peso": 0.724
   },
   {
    "codigo": "VIS.07",
    "nome": "Painéis",
    "conceitos": [
     "indicadores",
     "filtros",
     "quando um painel ajuda e quando atrapalha"
    ],
    "dominio": "Desenhar um painel de acompanhamento com cinco indicadores",
    "antes": [
     {
      "codigo": "VIS.06",
      "nome": "Relatório e notebook",
      "materia": "VIS"
     }
    ],
    "pergunta": "Quantos indicadores cabem num painel útil?",
    "resposta": "Poucos: os que levam a alguma decisão. De cinco a sete costuma ser o máximo legível.",
    "tropeco": "Pôr todos os números possíveis e ninguém saber para onde olhar.",
    "dia": "O painel do app de corrida: ritmo, distância e tempo, sem mais nada.",
    "virada": false,
    "passos": 4,
    "peso": 0.724
   }
  ]
 },
 {
  "sigla": "ALC",
  "nome": "Álgebra linear e cálculo para dados",
  "etapa": "Entender os modelos",
  "trabalho": "Por trás da recomendação do streaming, da regressão e das redes neurais há vetores e matrizes. Essa matemática é o que permite explicar por que um modelo errou, e não só rodar o comando.",
  "porque": "A matemática por trás dos modelos, logo antes de usá-los, na ordem do livro Mathematics for Machine Learning: vetores, matrizes, sistemas, espaços, mínimos quadrados, decomposições e cálculo para otimizar. Tudo com NumPy, que você já conhece.",
  "logos": [
   "numpy"
  ],
  "peso": 5,
  "peso_porque": "Vetores, matrizes e derivadas explicam como os modelos aprendem.",
  "modulos": [
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
    "dominio": "Calcular similaridade de cosseno entre dois vetores e interpretar",
    "antes": [
     {
      "codigo": "MAT.01",
      "nome": "Conjuntos e funções",
      "materia": "MAT"
     },
     {
      "codigo": "AD.01",
      "nome": "NumPy",
      "materia": "AD"
     }
    ],
    "pergunta": "Dois clientes gastam (100, 0, 50) e (200, 0, 100) em três categorias. Eles são parecidos?",
    "resposta": "Na proporção, sim: os vetores apontam para o mesmo lado (similaridade de cosseno 1); um só gasta o dobro do outro.",
    "tropeco": "Achar que vetor é só seta da física. Em dados, um vetor é uma linha da tabela.",
    "dia": "O streaming representa cada pessoa como um vetor de gostos e recomenda o que vetores parecidos assistiram.",
    "virada": false,
    "passos": 8,
    "peso": 0.972
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
    "dominio": "Multiplicar matrizes à mão e com NumPy e interpretar como transformação",
    "antes": [
     {
      "codigo": "MAT.04",
      "nome": "Vetores",
      "materia": "ALC"
     }
    ],
    "pergunta": "Uma tabela de 1.000 clientes por 3 colunas, multiplicada por um vetor de 3 pesos, dá o quê?",
    "resposta": "Um vetor de 1.000 pontuações, uma por cliente.",
    "tropeco": "Achar que multiplicar matrizes é multiplicar elemento por elemento. É linha vezes coluna.",
    "dia": "Calcular o valor de todos os carrinhos de uma vez: quantidades vezes preços.",
    "virada": false,
    "passos": 7,
    "peso": 0.833
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
    "dominio": "Resolver e classificar sistemas",
    "antes": [
     {
      "codigo": "MAT.05",
      "nome": "Matrizes",
      "materia": "ALC"
     }
    ],
    "pergunta": "x + y = 10 e x − y = 2. Quanto valem x e y?",
    "resposta": "x = 6 e y = 4.",
    "tropeco": "Esquecer que um sistema pode ter infinitas soluções ou nenhuma.",
    "dia": "Descobrir o preço do lanche e do refrigerante a partir de duas notas de pedidos diferentes.",
    "virada": false,
    "passos": 5,
    "peso": 0.556
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
    "dominio": "Decidir se um conjunto de vetores é base",
    "antes": [
     {
      "codigo": "MAT.06",
      "nome": "Sistemas lineares",
      "materia": "ALC"
     }
    ],
    "pergunta": "Se uma coluna é o dobro de outra, ela traz informação nova?",
    "resposta": "Não. Ela é linearmente dependente da outra; para o modelo, é redundante.",
    "tropeco": "Pôr no modelo colunas que são combinação de outras, como o preço em reais e em centavos.",
    "dia": "O preço em reais e o preço em dólares do mesmo produto contam a mesma história.",
    "virada": false,
    "passos": 6,
    "peso": 0.694
   },
   {
    "codigo": "MAT.08",
    "nome": "Mínimos quadrados",
    "conceitos": [
     "projeção em subespaço",
     "equações normais",
     "ligação com regressão linear"
    ],
    "dominio": "Ajustar uma reta por mínimos quadrados à mão e em código",
    "antes": [
     {
      "codigo": "MAT.07",
      "nome": "Espaços vetoriais",
      "materia": "ALC"
     },
     {
      "codigo": "EST.11",
      "nome": "Regressão linear",
      "materia": "EST"
     }
    ],
    "pergunta": "O que a reta de mínimos quadrados minimiza?",
    "resposta": "A soma dos quadrados das distâncias verticais entre os pontos e a reta.",
    "tropeco": "Achar que a reta precisa passar por algum dos pontos.",
    "dia": "A “linha de tendência” que a planilha desenha no gráfico de dispersão.",
    "virada": false,
    "passos": 4,
    "peso": 0.417
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
    "dominio": "Reduzir dados a duas dimensões com PCA e interpretar os componentes",
    "antes": [
     {
      "codigo": "MAT.08",
      "nome": "Mínimos quadrados",
      "materia": "ALC"
     }
    ],
    "pergunta": "O que o primeiro componente principal representa?",
    "resposta": "A direção em que os dados mais variam.",
    "tropeco": "Esquecer de padronizar as colunas antes do PCA: a de maior escala domina.",
    "dia": "Resumir dezenas de perguntas de uma pesquisa de satisfação em dois ou três fatores.",
    "virada": false,
    "passos": 5,
    "peso": 0.556
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
    "dominio": "Implementar descida do gradiente para ajustar uma reta",
    "antes": [
     {
      "codigo": "MAT.08",
      "nome": "Mínimos quadrados",
      "materia": "ALC"
     }
    ],
    "pergunta": "O que a descida do gradiente faz, em uma frase?",
    "resposta": "Dá pequenos passos na direção em que o erro diminui mais rápido, até ele parar de cair.",
    "tropeco": "Passo grande demais (taxa de aprendizado) faz o erro pular e nunca cair.",
    "dia": "Descer uma montanha no escuro tateando o chão: cada passo vai para onde o chão desce mais.",
    "virada": false,
    "passos": 8,
    "peso": 0.972
   }
  ]
 },
 {
  "sigla": "ML",
  "nome": "Aprendizado de máquina",
  "etapa": "Prever",
  "trabalho": "Prever quem vai cancelar o plano, que transação de Pix é golpe ou quanto a loja vai vender no mês que vem: o modelo é treinado, avaliado com honestidade e colocado para funcionar.",
  "porque": "Na ordem do Data 100 e do livro An Introduction to Statistical Learning: o problema, a avaliação honesta e as métricas antes de qualquer modelo; depois modelos lineares, vizinhos, atributos, árvores, agrupamento, ajuste e interpretação. Redes neurais no fim.",
  "logos": [
   "scikitlearn",
   "tensorflow",
   "pytorch",
   "kaggle"
  ],
  "peso": 13,
  "peso_porque": "Aprendizado de máquina aparece em 69% das vagas: é o que mais diferencia o cientista de dados.",
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
    "dominio": "Enquadrar dez problemas reais no tipo certo",
    "antes": [
     {
      "codigo": "EST.11",
      "nome": "Regressão linear",
      "materia": "EST"
     },
     {
      "codigo": "AD.07",
      "nome": "Limpeza",
      "materia": "AD"
     }
    ],
    "pergunta": "Prever se um cliente vai cancelar a assinatura é regressão ou classificação?",
    "resposta": "Classificação: a resposta é sim ou não.",
    "tropeco": "Escolher o algoritmo antes de definir o que se quer prever e com quais dados.",
    "dia": "O “você também pode gostar” das lojas é um modelo treinado com compras passadas.",
    "virada": false,
    "passos": 5,
    "peso": 0.912
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
    "dominio": "Achar o vazamento num pipeline com resultado bom demais",
    "antes": [
     {
      "codigo": "ML.01",
      "nome": "O problema",
      "materia": "ML"
     },
     {
      "codigo": "EST.06",
      "nome": "Amostragem",
      "materia": "EST"
     }
    ],
    "pergunta": "Por que o modelo não pode ser avaliado com os mesmos dados do treino?",
    "resposta": "Porque ele pode ter decorado. Só dados nunca vistos mostram se ele aprendeu o padrão.",
    "tropeco": "Vazamento de dados: usar no treino uma informação que só existiria depois do resultado.",
    "dia": "Estudar com a prova antiga e tirar 10 nela não prova que você sabe a matéria.",
    "virada": false,
    "passos": 6,
    "peso": 1.14
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
    "dominio": "Escolher a métrica para um caso com classes desbalanceadas e justificar",
    "antes": [
     {
      "codigo": "ML.02",
      "nome": "Avaliação honesta",
      "materia": "ML"
     }
    ],
    "pergunta": "Com 1% de fraudes, um modelo que diz sempre “não é fraude” tem 99% de acurácia. Ele é bom?",
    "resposta": "Não: não pega nenhuma fraude. Olhe a revocação e a precisão.",
    "tropeco": "Usar acurácia quando as classes são desbalanceadas.",
    "dia": "No filtro de spam, deixar passar spam e mandar um e-mail importante para o spam são erros com custos diferentes.",
    "virada": false,
    "passos": 9,
    "peso": 1.825
   },
   {
    "codigo": "ML.04",
    "nome": "Modelos lineares",
    "conceitos": [
     "regressão linear",
     "regressão logística",
     "regularização Ridge e Lasso"
    ],
    "dominio": "Ajustar, regularizar e interpretar um modelo linear",
    "antes": [
     {
      "codigo": "ML.03",
      "nome": "Métricas",
      "materia": "ML"
     },
     {
      "codigo": "MAT.08",
      "nome": "Mínimos quadrados",
      "materia": "ALC"
     },
     {
      "codigo": "MAT.10",
      "nome": "Cálculo para otimização",
      "materia": "ALC"
     }
    ],
    "pergunta": "Para que serve a regularização?",
    "resposta": "Para penalizar coeficientes grandes e impedir que o modelo se ajuste demais ao treino.",
    "tropeco": "Comparar coeficientes de variáveis em escalas diferentes sem padronizar.",
    "dia": "Estimar o preço de um imóvel pelo tamanho, pelos quartos e pelo bairro.",
    "virada": false,
    "passos": 4,
    "peso": 0.684
   },
   {
    "codigo": "ML.05",
    "nome": "Vizinhos e distância",
    "conceitos": [
     "k vizinhos mais próximos",
     "padronização das escalas",
     "maldição da dimensionalidade"
    ],
    "dominio": "Mostrar o efeito de padronizar no kNN",
    "antes": [
     {
      "codigo": "ML.04",
      "nome": "Modelos lineares",
      "materia": "ML"
     },
     {
      "codigo": "MAT.04",
      "nome": "Vetores",
      "materia": "ALC"
     }
    ],
    "pergunta": "Por que padronizar as colunas antes do kNN?",
    "resposta": "Porque a distância fica dominada pela coluna de maior escala (salário em reais contra idade em anos).",
    "tropeco": "Usar kNN com dezenas de colunas sem pensar que, com muitas dimensões, tudo fica longe de tudo.",
    "dia": "“Pessoas parecidas com você também ouviram” no app de música.",
    "virada": false,
    "passos": 4,
    "peso": 0.684
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
    "dominio": "Montar um pipeline completo sem vazamento",
    "antes": [
     {
      "codigo": "ML.05",
      "nome": "Vizinhos e distância",
      "materia": "ML"
     },
     {
      "codigo": "AD.07",
      "nome": "Limpeza",
      "materia": "AD"
     }
    ],
    "pergunta": "Como transformar a coluna cidade para o modelo usar?",
    "resposta": "Codificar em colunas de 0 e 1 (one-hot), ajustando o codificador só com os dados de treino.",
    "tropeco": "Ajustar a padronização com todos os dados antes de separar treino e teste: é vazamento.",
    "dia": "Transformar “dia da semana” em “é fim de semana?” pode ajudar a prever vendas.",
    "virada": false,
    "passos": 6,
    "peso": 1.14
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
    "dominio": "Comparar árvore, floresta e boosting no mesmo problema",
    "antes": [
     {
      "codigo": "ML.07",
      "nome": "Atributos",
      "materia": "ML"
     }
    ],
    "pergunta": "Por que uma floresta aleatória costuma errar menos que uma árvore sozinha?",
    "resposta": "Muitas árvores diferentes votam, e os erros de uma se compensam com os das outras.",
    "tropeco": "Deixar a árvore crescer sem limite até decorar o treino.",
    "dia": "Pedir a opinião de vários amigos antes de escolher um restaurante, em vez de seguir um só.",
    "virada": false,
    "passos": 7,
    "peso": 1.368
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
    "dominio": "Segmentar dados e descrever cada grupo",
    "antes": [
     {
      "codigo": "ML.05",
      "nome": "Vizinhos e distância",
      "materia": "ML"
     },
     {
      "codigo": "MAT.09",
      "nome": "Autovalores e decomposições",
      "materia": "ALC"
     }
    ],
    "pergunta": "No k-means, o que você precisa escolher antes de rodar?",
    "resposta": "O número de grupos, o k.",
    "tropeco": "Tratar os grupos como verdade. Eles dependem das colunas e da escala escolhidas.",
    "dia": "Separar clientes em perfis (econômico, frequente, ocasional) sem ninguém ter dito antes quais existem.",
    "virada": false,
    "passos": 6,
    "peso": 1.14
   },
   {
    "codigo": "ML.09",
    "nome": "Ajuste e escolha",
    "conceitos": [
     "busca de hiperparâmetros",
     "validação cruzada aninhada (conceito)",
     "curva de aprendizado"
    ],
    "dominio": "Ajustar hiperparâmetros sem contaminar o teste",
    "antes": [
     {
      "codigo": "ML.06",
      "nome": "Árvores e conjuntos",
      "materia": "ML"
     },
     {
      "codigo": "ML.02",
      "nome": "Avaliação honesta",
      "materia": "ML"
     }
    ],
    "pergunta": "Por que não escolher os hiperparâmetros olhando o resultado no teste?",
    "resposta": "Porque o teste deixa de ser honesto. Use validação cruzada dentro do treino.",
    "tropeco": "Testar dezenas de combinações no teste e relatar a melhor.",
    "dia": "Ajustar o tempero provando sempre a mesma colherada: no fim, a receita só fica boa para aquela colherada.",
    "virada": false,
    "passos": 4,
    "peso": 0.684
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
    "dominio": "Tratar um problema desbalanceado e explicar a escolha",
    "antes": [
     {
      "codigo": "ML.09",
      "nome": "Ajuste e escolha",
      "materia": "ML"
     }
    ],
    "pergunta": "O que é deriva de dados?",
    "resposta": "Quando o mundo muda, os dados novos ficam diferentes dos de treino e o modelo piora.",
    "tropeco": "Treinar uma vez e nunca mais acompanhar o modelo em uso.",
    "dia": "Modelos de compra que pararam de funcionar quando a pandemia mudou os hábitos das pessoas.",
    "virada": false,
    "passos": 5,
    "peso": 0.912
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
    "dominio": "Explicar um modelo para um gestor em cinco linhas",
    "antes": [
     {
      "codigo": "ML.06",
      "nome": "Árvores e conjuntos",
      "materia": "ML"
     }
    ],
    "pergunta": "Como explicar a um gestor por que o modelo negou crédito a alguém?",
    "resposta": "Mostrando quais fatores mais pesaram para aquela pessoa e em que direção.",
    "tropeco": "Ler a importância de um atributo como causa.",
    "dia": "O app do banco explicando por que o seu limite não aumentou.",
    "virada": false,
    "passos": 5,
    "peso": 0.912
   },
   {
    "codigo": "ML.13",
    "nome": "Texto e tempo",
    "conceitos": [
     "classificação de texto com TF-IDF",
     "previsão de séries (base ingênua, validação temporal)"
    ],
    "dominio": "Bater uma previsão ingênua numa série real com validação temporal",
    "antes": [
     {
      "codigo": "ML.04",
      "nome": "Modelos lineares",
      "materia": "ML"
     },
     {
      "codigo": "FMT.10",
      "nome": "Texto como dado",
      "materia": "FMT"
     },
     {
      "codigo": "AD.08",
      "nome": "Datas e séries",
      "materia": "AD"
     }
    ],
    "pergunta": "Por que não embaralhar os dados ao validar uma previsão de vendas?",
    "resposta": "Porque o modelo veria o futuro. Em séries, o teste vem sempre depois do treino no tempo.",
    "tropeco": "Não comparar o modelo com uma previsão ingênua, como repetir o último valor.",
    "dia": "A previsão de demanda do supermercado para o fim de semana.",
    "virada": false,
    "passos": 3,
    "peso": 0.456
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
    "dominio": "Explicar o que uma rede pequena aprende num exemplo simples",
    "antes": [
     {
      "codigo": "ML.04",
      "nome": "Modelos lineares",
      "materia": "ML"
     },
     {
      "codigo": "MAT.10",
      "nome": "Cálculo para otimização",
      "materia": "ALC"
     }
    ],
    "pergunta": "O que uma rede neural ajusta quando aprende?",
    "resposta": "Os pesos das conexões, pela descida do gradiente.",
    "tropeco": "Usar rede neural numa tabela pequena em que uma regressão ou uma árvore resolve melhor, e explica.",
    "dia": "O reconhecimento facial que desbloqueia o celular.",
    "virada": false,
    "passos": 6,
    "peso": 1.14
   }
  ]
 },
 {
  "sigla": "NSQ",
  "nome": "Dados além do relacional",
  "etapa": "Escalar",
  "trabalho": "Nem todo dado cabe em tabela: eventos de um app em tempo real, documentos JSON, a rede de quem segue quem. Saber quando usar outro tipo de banco evita forçar o problema no formato errado.",
  "porque": "Só depois de dominar o relacional faz sentido entender por que existem outros modelos: documento, colunar, chave-valor, grafo, processamento distribuído e fluxo.",
  "logos": [
   "mongodb",
   "redis",
   "cassandra",
   "neo4j",
   "apachespark",
   "apachekafka"
  ],
  "peso": 3,
  "peso_porque": "Bancos não relacionais e grandes volumes (Spark em 12% das vagas) entram em empresas maiores.",
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
    "dominio": "Escolher o tipo de banco para cinco cenários e justificar",
    "antes": [
     {
      "codigo": "BD.16",
      "nome": "Transações",
      "materia": "BD"
     }
    ],
    "pergunta": "Por que um app global às vezes mostra a contagem de curtidas com atraso?",
    "resposta": "Consistência eventual: os servidores se atualizam aos poucos para continuar rápidos e disponíveis.",
    "tropeco": "Achar que NoSQL substitui o banco relacional em tudo.",
    "dia": "A contagem de visualizações de um vídeo que demora a atualizar.",
    "virada": false,
    "passos": 7,
    "peso": 0.643
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
    "dominio": "Modelar o banco de estudo como documentos e consultar",
    "antes": [
     {
      "codigo": "NSQ.01",
      "nome": "Por que NoSQL",
      "materia": "NSQ"
     },
     {
      "codigo": "FMT.02",
      "nome": "JSON",
      "materia": "FMT"
     }
    ],
    "pergunta": "Quando vale embutir os itens dentro do documento do pedido?",
    "resposta": "Quando eles são sempre lidos junto com o pedido e não mudam sozinhos.",
    "tropeco": "Embutir dados que mudam e precisar atualizar mil documentos.",
    "dia": "O perfil completo de um usuário num app, com preferências e endereços, guardado de uma vez.",
    "virada": false,
    "passos": 5,
    "peso": 0.429
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
    "dominio": "Consultar um Parquet grande com DuckDB e explicar a velocidade",
    "antes": [
     {
      "codigo": "NSQ.01",
      "nome": "Por que NoSQL",
      "materia": "NSQ"
     },
     {
      "codigo": "FMT.05",
      "nome": "Parquet e Arrow",
      "materia": "FMT"
     },
     {
      "codigo": "BD.07",
      "nome": "Agregação",
      "materia": "BD"
     }
    ],
    "pergunta": "Por que somar uma coluna de 100 milhões de linhas é rápido no DuckDB?",
    "resposta": "Ele lê só aquela coluna, comprimida, sem tocar nas outras.",
    "tropeco": "Usar banco colunar para muitas gravações pequenas, como cada clique de um site.",
    "dia": "As retrospectivas de fim de ano das plataformas de música, calculadas sobre bilhões de reproduções.",
    "virada": false,
    "passos": 5,
    "peso": 0.429
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
    "dominio": "Desenhar um cache para uma consulta cara",
    "antes": [
     {
      "codigo": "NSQ.01",
      "nome": "Por que NoSQL",
      "materia": "NSQ"
     }
    ],
    "pergunta": "O que é um cache?",
    "resposta": "Uma cópia rápida de um resultado caro, guardada por um tempo para não recalcular.",
    "tropeco": "Esquecer de expirar o cache e mostrar dado velho.",
    "dia": "O navegador guarda as imagens de um site para abrir mais rápido na próxima vez.",
    "virada": false,
    "passos": 5,
    "peso": 0.429
   },
   {
    "codigo": "NSQ.05",
    "nome": "Coluna larga e grafo",
    "conceitos": [
     "Cassandra (conceito)",
     "Neo4j e consultas de caminho (conceito)"
    ],
    "dominio": "Reconhecer problemas que pedem grafo",
    "antes": [
     {
      "codigo": "NSQ.01",
      "nome": "Por que NoSQL",
      "materia": "NSQ"
     },
     {
      "codigo": "ED.11",
      "nome": "Grafos",
      "materia": "ED"
     }
    ],
    "pergunta": "Que tipo de banco responde bem a “amigos de amigos que moram em Campo Grande”?",
    "resposta": "Um banco de grafo, como o Neo4j.",
    "tropeco": "Fazer consultas de muitos saltos com muitas junções no relacional e tudo ficar lento.",
    "dia": "“Pessoas que você talvez conheça” das redes sociais.",
    "virada": false,
    "passos": 3,
    "peso": 0.214
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
    "dominio": "Explicar como uma contagem roda dividida em muitas máquinas",
    "antes": [
     {
      "codigo": "NSQ.03",
      "nome": "Colunar e análise",
      "materia": "NSQ"
     },
     {
      "codigo": "ALG.05",
      "nome": "Dividir e conquistar",
      "materia": "ED"
     }
    ],
    "pergunta": "Como contar as palavras de um bilhão de documentos usando muitas máquinas?",
    "resposta": "Cada máquina conta a sua parte (map) e depois as contagens são somadas (reduce).",
    "tropeco": "Usar Spark para dados que cabem numa planilha.",
    "dia": "Os assuntos do momento de uma rede social, calculados sobre milhões de posts por minuto.",
    "virada": false,
    "passos": 6,
    "peso": 0.536
   },
   {
    "codigo": "NSQ.07",
    "nome": "Fluxos",
    "conceitos": [
     "dado em lote e em fluxo",
     "fila de mensagens (conceito: Kafka)",
     "janela de tempo"
    ],
    "dominio": "Dizer quando um problema pede processamento contínuo",
    "antes": [
     {
      "codigo": "NSQ.06",
      "nome": "Big data",
      "materia": "NSQ"
     }
    ],
    "pergunta": "Qual a diferença entre processar em lote e em fluxo?",
    "resposta": "Lote processa tudo de tempos em tempos; fluxo processa cada evento assim que ele chega.",
    "tropeco": "Montar processamento em tempo real quando um relatório diário bastaria.",
    "dia": "O alerta de compra do cartão chega na hora (fluxo); a fatura fecha uma vez por mês (lote).",
    "virada": false,
    "passos": 4,
    "peso": 0.321
   }
  ]
 },
 {
  "sigla": "ETI",
  "nome": "Ética, privacidade e governança",
  "etapa": "Cuidar dos dados",
  "trabalho": "Todo projeto com dados pessoais passa pela LGPD: o que pode ser coletado, por quanto tempo e com que base legal. Um modelo que discrimina ou vaza dados é um risco para a empresa e para as pessoas.",
  "porque": "Fecha o percurso porque usa tudo: dados pessoais, modelos e pipelines. A LGPD é estudada sempre pelo texto oficial.",
  "logos": [],
  "peso": 2,
  "peso_porque": "Privacidade e uso justo dos dados: pouco cobrado como técnica, obrigatório como postura.",
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
    "dominio": "Classificar dados de um projeto pela LGPD com o texto oficial à mão",
    "antes": [
     {
      "codigo": "EST.01",
      "nome": "Tipos de dado e coleta",
      "materia": "EST"
     }
    ],
    "pergunta": "Nome e CPF de um cliente são dados pessoais? E uma informação sobre a saúde dele?",
    "resposta": "São dados pessoais, e a lei trata a informação de saúde como uma categoria especial. Confira as definições no texto oficial da Lei 13.709/2018.",
    "tropeco": "Estudar LGPD por resumo de internet. Em prova, o que se cobra é o texto da lei.",
    "dia": "O aviso de cookies dos sites e o pedido para uma loja apagar seus dados.",
    "virada": false,
    "passos": 5,
    "peso": 0.333
   },
   {
    "codigo": "ETI.02",
    "nome": "Anonimização",
    "conceitos": [
     "anonimização e pseudonimização",
     "reidentificação por cruzamento",
     "agregação mínima"
    ],
    "dominio": "Mostrar como uma base \"anônima\" pode ser reidentificada",
    "antes": [
     {
      "codigo": "ETI.01",
      "nome": "LGPD",
      "materia": "ETI"
     },
     {
      "codigo": "AD.07",
      "nome": "Limpeza",
      "materia": "AD"
     }
    ],
    "pergunta": "Tirar o nome de uma base basta para anonimizar?",
    "resposta": "Não. Data de nascimento, CEP e sexo juntos podem identificar a pessoa.",
    "tropeco": "Confundir pseudonimizar (trocar por um código, ainda dá para voltar) com anonimizar.",
    "dia": "Dados de localização “anônimos” do celular que, cruzados com outros, revelam onde a pessoa mora.",
    "virada": false,
    "passos": 4,
    "peso": 0.25
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
    "dominio": "Achar falhas de segurança num projeto de exemplo",
    "antes": [
     {
      "codigo": "ETI.01",
      "nome": "LGPD",
      "materia": "ETI"
     },
     {
      "codigo": "CMP.06",
      "nome": "Redes e web",
      "materia": "CMP"
     }
    ],
    "pergunta": "Por que as senhas são guardadas como hash, e não como texto?",
    "resposta": "Se o banco vazar, quem roubou não lê as senhas direto.",
    "tropeco": "Pôr senha ou chave de API no código e subir para o GitHub.",
    "dia": "A verificação em duas etapas do app do banco e a criptografia de ponta a ponta dos mensageiros.",
    "virada": false,
    "passos": 6,
    "peso": 0.417
   },
   {
    "codigo": "ETI.04",
    "nome": "Viés e justiça",
    "conceitos": [
     "viés na coleta, no rótulo e no modelo",
     "métricas de justiça (conceito)",
     "impacto de decisões automáticas"
    ],
    "dominio": "Auditar um modelo simples por grupo",
    "antes": [
     {
      "codigo": "ML.03",
      "nome": "Métricas",
      "materia": "ML"
     },
     {
      "codigo": "ETI.01",
      "nome": "LGPD",
      "materia": "ETI"
     }
    ],
    "pergunta": "Um modelo acerta 95% no geral e 70% num grupo. O que fazer?",
    "resposta": "Investigar os dados desse grupo (pouca representação? rótulos ruins?) e medir o desempenho por grupo sempre.",
    "tropeco": "Olhar só a métrica geral.",
    "dia": "Reconhecimento facial que funciona pior para grupos pouco representados nas fotos de treino.",
    "virada": false,
    "passos": 4,
    "peso": 0.25
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
    "dominio": "Escrever o dicionário de dados e as regras de qualidade de uma base",
    "antes": [
     {
      "codigo": "AD.07",
      "nome": "Limpeza",
      "materia": "AD"
     }
    ],
    "pergunta": "O que um dicionário de dados descreve?",
    "resposta": "Cada coluna: nome, significado, tipo, unidade, origem e regras.",
    "tropeco": "Ninguém saber de onde veio um número do relatório.",
    "dia": "A bula do remédio, só que para uma tabela.",
    "virada": false,
    "passos": 7,
    "peso": 0.5
   },
   {
    "codigo": "ETI.06",
    "nome": "Reprodutibilidade",
    "conceitos": [
     "semente aleatória",
     "versão de dados e código",
     "registro de decisões"
    ],
    "dominio": "Tornar uma análise reproduzível por outra pessoa",
    "antes": [
     {
      "codigo": "ENG.06",
      "nome": "Projeto de dados",
      "materia": "ENG"
     }
    ],
    "pergunta": "O que guardar para outra pessoa refazer a sua análise e chegar ao mesmo número?",
    "resposta": "Os dados brutos, o código, as versões das bibliotecas e a semente dos sorteios.",
    "tropeco": "Sortear sem semente e cada execução dar um resultado diferente.",
    "dia": "Uma receita com quantidades exatas: qualquer um faz o mesmo bolo.",
    "virada": false,
    "passos": 4,
    "peso": 0.25
   }
  ]
 }
];
