"""Gera o banco de estudo fictício usado nos exemplos de SQL, pandas e estatística.

Como rodar (na pasta do projeto):
    python -I apostila/licoes/dados/gerar_estudo.py

O resultado é o arquivo estudo.sql, ao lado deste script: primeiro o esquema (CREATE TABLE),
depois os dados (INSERT). Ele roda no PostgreSQL (e no PGlite, o PostgreSQL do navegador) e no SQLite.

Tudo aqui é inventado: alunos, questões e respostas. A semente fixa (random.seed) faz o
arquivo sair sempre igual, para que as respostas dos exercícios não mudem de uma vez para outra.

Leia este arquivo como uma aula de Python: cada bloco tem um comentário dizendo o que faz.
"""

import random  # módulo da biblioteca padrão que sorteia números
from datetime import datetime, timedelta  # datas e intervalos de tempo
from pathlib import Path  # caminhos de arquivo que funcionam em qualquer sistema

# 1. Semente fixa: o "sorteio" passa a ser sempre o mesmo.
random.seed(2026)

# 2. Dados fixos, em listas de tuplas. Uma tupla é uma sequência que não muda: (id, nome, banca).
MATERIAS = [
    (1, "Língua Portuguesa", "Cebraspe"),
    (2, "Raciocínio Lógico", "FGV"),
    (3, "Direito Administrativo", "Quadrix"),
    (4, "Informática", "Cebraspe"),
    (5, "Estatística", "FGV"),
    (6, "Banco de Dados", "Quadrix"),
]

# O apóstrofo em D'Ávila está aqui de propósito: em SQL, texto vai entre aspas simples,
# e um apóstrofo dentro do texto precisa ser escrito duas vezes ('D''Ávila').
ALUNOS = [
    "Ana Souza", "Bruno Lima", "Carla Mendes", "Diego Rocha", "Elisa Prado", "Felipe Nunes",
    "Gabriela Reis", "Hugo Barros", "Joana D'Ávila", "Kleber Santos", "Larissa Melo", "Marcos Teles",
]

# Assunto de cada questão, como aparece nos editais. São só títulos: nenhum texto de lei é copiado aqui.
ASSUNTOS = {
    1: ["Crase antes de palavra masculina", "Concordância do verbo haver", "Regência do verbo assistir", "Colocação do pronome oblíquo",
        "Uso da vírgula antes do e", "Sentido de conjunções adversativas", "Voz passiva sintética", "Acentuação de paroxítonas",
        "Coesão por pronomes", "Interpretação de tirinha"],
    2: ["Negação de proposição composta", "Tabela-verdade do condicional", "Equivalência da contrapositiva", "Silogismo com todos e alguns",
        "Princípio da casa dos pombos", "Permutação com repetição", "Probabilidade de eventos independentes", "Sequência lógica de números",
        "Diagrama de Venn com três conjuntos", "Porcentagem sobre porcentagem"],
    3: ["Princípio da impessoalidade", "Ato administrativo vinculado", "Revogação e anulação", "Poder de polícia",
        "Licitação dispensável", "Agente público e cargo em comissão", "Responsabilidade civil do Estado", "Autarquia e fundação",
        "Improbidade administrativa", "Controle pelo Tribunal de Contas"],
    4: ["Atalhos do editor de texto", "Fórmula PROCV na planilha", "Phishing e engenharia social", "Backup incremental",
        "Protocolos HTTP e HTTPS", "Armazenamento em nuvem", "Extensões de arquivo", "Firewall e antivírus",
        "Correio eletrônico: CC e CCO", "Navegação anônima"],
    5: ["Média, mediana e moda", "Desvio padrão", "Probabilidade condicional", "Distribuição normal",
        "Amostragem estratificada", "Correlação não é causalidade", "Intervalo de confiança", "Teste de hipóteses",
        "Quartis e boxplot", "Regressão linear simples"],
    6: ["Chave primária e chave estrangeira", "Primeira forma normal", "JOIN entre duas tabelas", "GROUP BY com HAVING",
        "Índices e desempenho", "Transação e atomicidade", "Diferença entre DELETE e TRUNCATE", "Modelo entidade-relacionamento",
        "Valor NULL em comparações", "Visões (views)"],
}
QUESTOES_POR_MATERIA = 10
INICIO = datetime(2026, 8, 1, 7, 0, 0)  # primeira data possível de resposta


def texto_sql(valor):
    """Converte um valor do Python em texto SQL: None vira NULL, texto ganha aspas simples."""
    if valor is None:
        return "NULL"
    if isinstance(valor, bool):  # bool vem antes de int, porque True também é um int
        return "TRUE" if valor else "FALSE"
    if isinstance(valor, (int, float)):
        return str(valor)
    return "'" + str(valor).replace("'", "''") + "'"


def linha_insert(tabela, valores):
    """Monta um INSERT a partir de uma tabela e de uma tupla de valores."""
    return f"INSERT INTO {tabela} VALUES ({', '.join(texto_sql(v) for v in valores)});"


def gabarito_da_banca(banca):
    """Cebraspe usa Certo/Errado; as outras bancas usam alternativas de A a E."""
    return random.choice(["C", "E"]) if banca == "Cebraspe" else random.choice("ABCDE")


def gerar():
    linhas = []

    # 3. Alunos: o e-mail de um deles fica vazio (NULL), para treinar IS NULL.
    alunos = []
    for i, nome in enumerate(ALUNOS, start=1):
        primeiro = nome.split()[0].lower()
        email = None if i == 7 else f"{primeiro}{i}@exemplo.com"
        criado = INICIO - timedelta(days=random.randint(10, 120))
        alunos.append((i, nome, email, criado.strftime("%Y-%m-%d %H:%M:%S")))

    # 4. Questões: dez por matéria, com gabarito no formato da banca e um nível de 1 a 5.
    questoes = []
    for materia_id, nome, banca in MATERIAS:
        for n in range(1, QUESTOES_POR_MATERIA + 1):
            qid = len(questoes) + 1
            enunciado = ASSUNTOS[materia_id][n - 1]
            questoes.append((qid, materia_id, enunciado, gabarito_da_banca(banca), random.randint(1, 5)))

    # 5. Respostas: cada aluno responde um conjunto sorteado de questões.
    #    Alunos com número maior acertam um pouco mais (para as médias não saírem todas iguais).
    respostas = []
    for aluno_id, *_ in alunos:
        chance_de_acerto = 0.45 + aluno_id * 0.025
        for qid, materia_id, _, gabarito, nivel in random.sample(questoes, random.randint(20, 40)):
            banca = MATERIAS[materia_id - 1][2]
            if random.random() < 0.05:  # 5% ficam em branco: resposta e acertou viram NULL
                resposta, acertou = None, None
            elif random.random() < chance_de_acerto - nivel * 0.04:
                resposta, acertou = gabarito, True
            else:
                opcoes = ["C", "E"] if banca == "Cebraspe" else list("ABCDE")
                opcoes.remove(gabarito)
                resposta, acertou = random.choice(opcoes), False
            quando = INICIO + timedelta(days=random.randint(0, 75), minutes=random.randint(0, 900))
            respostas.append((len(respostas) + 1, aluno_id, qid, resposta, acertou, quando.strftime("%Y-%m-%d %H:%M:%S")))

    # 6. O esquema: quatro tabelas, ligadas por chaves estrangeiras.
    linhas += [
        "-- Banco de estudo fictício. Gerado por gerar_estudo.py; não edite à mão.",
        "CREATE TABLE alunos (id INTEGER PRIMARY KEY, nome TEXT NOT NULL, email TEXT, criado_em TIMESTAMP NOT NULL);",
        "CREATE TABLE materias (id INTEGER PRIMARY KEY, nome TEXT NOT NULL, banca TEXT NOT NULL);",
        "CREATE TABLE questoes (id INTEGER PRIMARY KEY, materia_id INTEGER NOT NULL REFERENCES materias(id), enunciado TEXT NOT NULL, gabarito TEXT NOT NULL, nivel INTEGER NOT NULL CHECK (nivel BETWEEN 1 AND 5));",
        "CREATE TABLE respostas (id INTEGER PRIMARY KEY, aluno_id INTEGER NOT NULL REFERENCES alunos(id), questao_id INTEGER NOT NULL REFERENCES questoes(id), resposta TEXT, acertou BOOLEAN, respondida_em TIMESTAMP NOT NULL);",
    ]
    linhas += [linha_insert("materias", m) for m in MATERIAS]
    linhas += [linha_insert("alunos", a) for a in alunos]
    linhas += [linha_insert("questoes", q) for q in questoes]
    linhas += [linha_insert("respostas", r) for r in respostas]
    return linhas, len(alunos), len(questoes), len(respostas)


if __name__ == "__main__":  # só roda quando o arquivo é executado, não quando é importado
    linhas, n_alunos, n_questoes, n_respostas = gerar()
    destino = Path(__file__).with_name("estudo.sql")
    destino.write_text("\n".join(linhas) + "\n", encoding="utf-8")
    print(f"{destino.name}: {n_alunos} alunos, {len(MATERIAS)} matérias, {n_questoes} questões, {n_respostas} respostas")
