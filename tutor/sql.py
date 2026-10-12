"""Roda SQL no banco da Apostila Viva e corrige pelo resultado.

  python -I tutor/sql.py "SELECT ..."                      mostra até 15 linhas
  python -I tutor/sql.py --comparar "<aluno>" "<gabarito>"  compara os conjuntos de linhas
  python -I tutor/sql.py --comparar-ordem "<aluno>" "<gabarito>"  compara também a ordem

Monta o banco na primeira vez. Cada execução começa do banco original:
alterações (INSERT, UPDATE, DELETE, CREATE) são desfeitas no fim.
"""

import sqlite3
import subprocess
import sys
from collections import Counter
from pathlib import Path

PASTA = Path(__file__).resolve().parent.parent / "data" / "apostila-viva"
BANCO = PASTA / "apostila.db"
LIMITE = 15


def conectar():
    if not BANCO.exists():
        subprocess.run([sys.executable, "-I", str(PASTA / "gerar.py")], check=True, capture_output=True)
    con = sqlite3.connect(BANCO, isolation_level=None)
    # Como no PostgreSQL: aspas duplas só para nomes, nunca para texto (erro "aspas" do doc 04).
    if hasattr(sqlite3, "SQLITE_DBCONFIG_DQS_DML"):
        con.setconfig(sqlite3.SQLITE_DBCONFIG_DQS_DML, False)
        con.setconfig(sqlite3.SQLITE_DBCONFIG_DQS_DDL, False)
    con.execute("PRAGMA foreign_keys = ON")
    con.execute("BEGIN")
    return con


def rodar(con, consulta):
    cursor = con.execute(consulta)
    colunas = [c[0] for c in cursor.description] if cursor.description else []
    return colunas, cursor.fetchall()


def mostrar(consulta):
    con = conectar()
    try:
        colunas, linhas = rodar(con, consulta)
    except sqlite3.Error as erro:
        print(f"erro: {erro}")
        return
    finally:
        con.rollback()
    if not colunas:
        print("ok (sem linhas de resultado)")
        return
    print(" | ".join(colunas))
    for linha in linhas[:LIMITE]:
        print(" | ".join("NULL" if v is None else str(v) for v in linha))
    print(f"({len(linhas)} linhas{', mostrando ' + str(LIMITE) if len(linhas) > LIMITE else ''})")


def comparar(aluno, gabarito, com_ordem):
    con = conectar()
    try:
        try:
            _, linhas_aluno = rodar(con, aluno)
        except sqlite3.Error as erro:
            print(f"erro na consulta do aluno: {erro}")
            return
        _, linhas_gabarito = rodar(con, gabarito)
    finally:
        con.rollback()
    if com_ordem:
        iguais = linhas_aluno == linhas_gabarito
    else:
        iguais = Counter(linhas_aluno) == Counter(linhas_gabarito)
    if iguais:
        print(f"iguais ({len(linhas_gabarito)} linhas)")
        return
    a, g = Counter(linhas_aluno), Counter(linhas_gabarito)
    print(f"diferentes: aluno {len(linhas_aluno)} linhas, gabarito {len(linhas_gabarito)}")
    print("sobram no aluno:", list((a - g).elements())[:5])
    print("faltam no aluno:", list((g - a).elements())[:5])
    if com_ordem and a == g:
        print("mesmas linhas, ordem diferente")


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    args = sys.argv[1:]
    if len(args) == 3 and args[0] in ("--comparar", "--comparar-ordem"):
        comparar(args[1], args[2], args[0] == "--comparar-ordem")
    elif len(args) == 1:
        mostrar(args[0])
    else:
        print(__doc__)
