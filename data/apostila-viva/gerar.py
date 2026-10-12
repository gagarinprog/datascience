"""Gera o banco de exemplo da Apostila Viva (SQLite): seed.sql e apostila.db.

Uso: python -I data/apostila-viva/gerar.py

Sempre os mesmos dados (semente fixa): 30 usuários, 6 disciplinas, 120 questões,
1.500 respostas. Traz de propósito o que as lições precisam:
- nomes com acento e com apóstrofo (D'Ávila), para treinar aspas;
- e-mails e bancas ausentes (NULL), e respostas em branco;
- dificuldade desigual e usuários com níveis diferentes, para as agregações terem graça.
"""

import random
import sqlite3
from datetime import datetime, timedelta
from pathlib import Path

PASTA = Path(__file__).resolve().parent
SEMENTE = 2026

DISCIPLINAS = [
    (1, "Banco de Dados", "Cebraspe", 24),
    (2, "Estatística", "FGV", 22),
    (3, "Lógica de Programação", "Cebraspe", 19),
    (4, "Estruturas de Dados", "FCC", 21),
    (5, "Aprendizado de Máquina", "Cebraspe", 18),
    (6, "Engenharia de Software", None, 16),
]

NOMES = [
    "Ana Souza", "Bruno Lima", "Carla Mendes", "Diego Rocha", "Elisa Prado",
    "Fábio Nunes", "Gabriela Torres", "Heitor Campos", "Isabela Duarte", "João Pereira",
    "Joana D'Ávila", "Kaio Mendes", "Larissa Ribeiro", "Marcos Vieira", "Natália Freitas",
    "Otávio Barros", "Paula Antunes", "Rafael Couto", "Sabrina Lopes", "Tiago Moreira",
    "Úrsula Neves", "Vinícius Araújo", "Wesley Cardoso", "Yasmin Teixeira", "Zé Carlos Brito",
    "Alice Monteiro", "Caio Fernandes", "Débora Castro", "Igor Saraiva", "Lúcia Ramos",
]

ASSUNTOS = {
    1: ["chave primária", "chave estrangeira", "normalização", "junções", "agregação", "índices", "transações", "NULL"],
    2: ["média e mediana", "desvio-padrão", "probabilidade condicional", "distribuição normal", "intervalo de confiança", "p-valor"],
    3: ["operadores lógicos", "laços de repetição", "estruturas de decisão", "funções", "teste de mesa"],
    4: ["pilhas", "filas", "tabelas hash", "árvores binárias de busca", "heaps", "grafos"],
    5: ["sobreajuste", "validação cruzada", "matriz de confusão", "regressão logística", "k-means"],
    6: ["requisitos", "testes de software", "Scrum", "versionamento", "padrões de projeto"],
}

DIFICULDADES = [("facil", 0.4), ("media", 0.4), ("dificil", 0.2)]
CHANCE_ACERTO = {"facil": 0.82, "media": 0.62, "dificil": 0.38}


def sql(valor):
    if valor is None:
        return "NULL"
    if isinstance(valor, int):
        return str(valor)
    return "'" + str(valor).replace("'", "''") + "'"


def sem_acento(texto):
    tabela = str.maketrans("áâãàéêíóôõúüçÁÂÃÀÉÊÍÓÔÕÚÜÇ", "aaaaeeiooouucAAAAEEIOOOUUC")
    return texto.translate(tabela)


def gerar():
    rnd = random.Random(SEMENTE)

    usuarios = []
    for i, nome in enumerate(NOMES, start=1):
        partes = sem_acento(nome).lower().replace("'", "").split()
        email = None if i in (7, 19, 26) else f"{partes[0]}.{partes[-1]}@exemplo.com.br"
        criado = datetime(2026, 1, 5) + timedelta(days=rnd.randint(0, 200), minutes=rnd.randint(0, 1439))
        usuarios.append((i, nome, email, criado.strftime("%Y-%m-%d %H:%M:%S")))

    questoes = []
    qid = 0
    for did, nome, banca, total in DISCIPLINAS:
        for n in range(1, total + 1):
            qid += 1
            assunto = rnd.choice(ASSUNTOS[did])
            dificuldade = rnd.choices([d for d, _ in DIFICULDADES], [p for _, p in DIFICULDADES])[0]
            if banca == "Cebraspe":
                enunciado = f"Julgue o item sobre {assunto} ({nome}, item {n})."
                gabarito = rnd.choice("CE")
            else:
                enunciado = f"Assinale a alternativa correta sobre {assunto} ({nome}, questão {n})."
                gabarito = rnd.choice("ABCDE")
            questoes.append((qid, did, enunciado, gabarito, dificuldade))

    nivel = {u[0]: rnd.uniform(-0.15, 0.15) for u in usuarios}
    peso = [rnd.uniform(0.3, 3.0) for _ in usuarios]
    respostas = []
    inicio = datetime(2026, 8, 1, 7, 0, 0)
    for rid in range(1, 1501):
        uid = rnd.choices([u[0] for u in usuarios], peso)[0]
        q = rnd.choice(questoes)
        opcoes = "CE" if q[2].startswith("Julgue") else "ABCDE"
        quando = inicio + timedelta(minutes=rnd.randint(0, 70 * 24 * 60))
        if rnd.random() < 0.03:
            resposta, correta = None, 0
        elif rnd.random() < CHANCE_ACERTO[q[4]] + nivel[uid]:
            resposta, correta = q[3], 1
        else:
            resposta = rnd.choice([o for o in opcoes if o != q[3]])
            correta = 0
        respostas.append((rid, uid, q[0], resposta, correta, quando.strftime("%Y-%m-%d %H:%M:%S")))
    respostas.sort(key=lambda r: r[5])
    respostas = [(i, *r[1:]) for i, r in enumerate(respostas, start=1)]

    linhas = ["-- Dados da Apostila Viva. Gerado por gerar.py; não edite à mão.", "BEGIN;"]
    for tabela, colunas, dados in [
        ("usuarios", "id, nome, email, criado_em", usuarios),
        ("disciplinas", "id, nome, banca", [d[:3] for d in DISCIPLINAS]),
        ("questoes", "id, disciplina_id, enunciado, gabarito, dificuldade", questoes),
        ("respostas", "id, usuario_id, questao_id, resposta, correta, respondida_em", respostas),
    ]:
        for linha in dados:
            linhas.append(f"INSERT INTO {tabela} ({colunas}) VALUES ({', '.join(sql(v) for v in linha)});")
    linhas.append("COMMIT;")
    (PASTA / "seed.sql").write_text("\n".join(linhas) + "\n", encoding="utf-8", newline="\n")

    banco = PASTA / "apostila.db"
    banco.unlink(missing_ok=True)
    con = sqlite3.connect(banco)
    con.executescript("PRAGMA foreign_keys = ON;")
    con.executescript((PASTA / "schema.sql").read_text(encoding="utf-8"))
    con.executescript((PASTA / "seed.sql").read_text(encoding="utf-8"))
    contagem = [con.execute(f"SELECT COUNT(*) FROM {t}").fetchone()[0] for t in ("usuarios", "disciplinas", "questoes", "respostas")]
    con.close()
    print("usuarios, disciplinas, questoes, respostas:", contagem)


if __name__ == "__main__":
    gerar()
