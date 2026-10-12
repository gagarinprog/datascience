"""Gera o percurso por matéria a partir do currículo (docs/05).

Uso: python -I tutor/gerar_percurso.py

Saídas:
- tutor/percurso.txt: uma seção por matéria, na ordem de estudo; dentro dela, os
  módulos na ordem do currículo e um passo por conceito (LOG-001, LOG-002...).
- apostila/materias.js: os mesmos dados para o Guia das matérias.

Cada matéria é estudada do começo ao fim, em sequência. As matérias seguem a ordem
abaixo: cada uma só pede o que as anteriores já ensinaram.
"""

import json
import re
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CURRICULO = RAIZ / "docs" / "05_CURRICULO_CIENCIA_DE_DADOS.md"
PERCURSO = RAIZ / "tutor" / "percurso.txt"
DADOS_GUIA = RAIZ / "apostila" / "materias.js"

MATERIAS = [
    ("LOG", "Lógica de programação"),
    ("PY", "Python"),
    ("CMP", "Como o computador funciona"),
    ("BD", "Banco de dados e SQL"),
    ("MAT", "Matemática para dados"),
    ("EST", "Probabilidade e estatística"),
    ("ED", "Estruturas de dados"),
    ("ALG", "Algoritmos e complexidade"),
    ("POO", "Orientação a objetos"),
    ("ENG", "Ferramentas do ofício"),
    ("FMT", "Formatos e coleta de dados"),
    ("AD", "Análise de dados"),
    ("VIS", "Visualização e comunicação"),
    ("ML", "Aprendizado de máquina"),
    ("NSQ", "Dados além do relacional"),
    ("ETI", "Ética, privacidade e governança"),
]

LINHA_MODULO = re.compile(r"^\| ((?:[A-Z]{2,3})\.\d\d) ([^|]+?) \| ([^|]+?) \| ([^|]+?) \| ([^|]+?) \|$", re.M)


def limpar(texto):
    return re.sub(r"`", "", texto).strip()


def ler_modulos():
    texto = CURRICULO.read_text(encoding="utf-8")
    modulos = {}
    for codigo, nome, conceitos, exercicios, dominio in LINHA_MODULO.findall(texto):
        conceitos = re.sub(r"\. `TODO.*$", "", conceitos)
        lista = [c.strip() for c in conceitos.split(";") if c.strip()]
        modulos[codigo] = (nome.strip(), lista, exercicios.strip(), dominio.strip())
    return modulos


def main():
    modulos = ler_modulos()
    siglas = [s for s, _ in MATERIAS]
    sem_materia = sorted({c.split(".")[0] for c in modulos} - set(siglas))
    if sem_materia:
        raise SystemExit(f"módulos sem matéria: {sem_materia}")

    linhas = [
        "# Percurso por matéria. Gerado por tutor/gerar_percurso.py; não edite à mão.",
        "# M = módulo (exercícios | tarefa de domínio). Passo: código, conceito.",
        "# TD = tarefa de domínio do módulo.",
    ]
    guia = []
    total = 0
    for ordem, (sigla, nome_materia) in enumerate(MATERIAS, start=1):
        codigos = sorted(c for c in modulos if c.split(".")[0] == sigla)
        linhas.append(f"\n## {sigla} {nome_materia} ({ordem} de {len(MATERIAS)})")
        passo = 0
        mods = []
        for codigo in codigos:
            nome, conceitos, exercicios, dominio = modulos[codigo]
            linhas.append(f"M {codigo} {nome} | {exercicios} | {dominio}")
            for i, conceito in enumerate(conceitos, start=1):
                passo += 1
                linhas.append(f"{sigla}-{passo:03d} {codigo}.{i:02d} {conceito}")
            passo += 1
            linhas.append(f"{sigla}-{passo:03d} {codigo}.TD tarefa de domínio")
            mods.append({"codigo": codigo, "nome": limpar(nome), "conceitos": [limpar(c) for c in conceitos], "dominio": limpar(dominio)})
        total += passo
        guia.append({"sigla": sigla, "nome": nome_materia, "modulos": mods})

    PERCURSO.write_text("\n".join(linhas) + "\n", encoding="utf-8", newline="\n")
    DADOS_GUIA.parent.mkdir(exist_ok=True)
    DADOS_GUIA.write_text(
        "// Gerado por tutor/gerar_percurso.py a partir do docs/05. Não edite à mão.\n"
        "window.MATERIAS = " + json.dumps(guia, ensure_ascii=False, indent=1) + ";\n",
        encoding="utf-8",
        newline="\n",
    )
    print(f"{total} passos em {len(MATERIAS)} matérias")


if __name__ == "__main__":
    main()
