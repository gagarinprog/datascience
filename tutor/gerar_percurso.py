"""Gera tutor/percurso.txt a partir do currículo (docs/05) e da ordem dos módulos abaixo.

Uso: python -I tutor/gerar_percurso.py

A ordem é o percurso do zero: começa sem computador (algoritmo), passa a usar Python
como notação, intercala SQL, matemática e estatística quando cada um já tem base,
e só junta as trilhas quando os pré-requisitos estão cumpridos. Os números dos
passos mudam se a ordem mudar; o progresso guarda o código do conceito, não só o número.
"""

import re
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CURRICULO = RAIZ / "docs" / "05_CURRICULO_CIENCIA_DE_DADOS.md"
SAIDA = RAIZ / "tutor" / "percurso.txt"

ETAPAS = [
    ("E1 Base", """
        LOG.01 PY.01 LOG.02 PY.02 LOG.03 CMP.01 LOG.04 MAT.02 LOG.05 ENG.01
        LOG.06 LOG.09 CMP.02 PY.03 LOG.07 MAT.01 BD.01 BD.02 BD.03 BD.04
        PY.04 BD.05 BD.06 LOG.08 EST.01 BD.07 EST.02 MAT.03 ENG.02 CMP.03
        CMP.04 CMP.05 CMP.06 CMP.07
    """, "Projeto 1: Raio-X da Apostila Viva, 15 perguntas de negócio em SQL"),
    ("E2 Programar de verdade", """
        PY.05 BD.08 PY.06 ALG.01 ED.01 ED.02 ALG.02 BD.09 PY.07 ED.03
        ED.04 ALG.04 ED.05 MAT.04 PY.08 PY.09 BD.10 ALG.03 ED.06 EST.03
        PY.10 BD.11 PY.11 POO.01 POO.02 BD.12 MAT.05 POO.03 POO.04 BD.13
        ED.07 ED.08 ALG.05 EST.04 POO.05 POO.06 BD.14 PY.13 ENG.03 ED.09
        ED.10 MAT.06 EST.05 BD.18 PY.12 POO.07 ALG.06 ED.11 ALG.09 ALG.07
        ALG.08 ED.12 ALG.10 PY.14 ENG.04 ENG.05 POO.08
    """, "Projeto 2: corretor de questões em linha de comando, com classes, testes e Git"),
    ("E3 Trabalhar com dados", """
        AD.01 FMT.01 AD.02 AD.03 FMT.02 AD.04 BD.15 AD.05 EST.06 VIS.01
        VIS.02 VIS.03 AD.06 FMT.03 AD.07 FMT.06 AD.08 EST.07 FMT.07 FMT.09
        VIS.04 EST.08 MAT.07 FMT.04 FMT.08 EST.09 VIS.05 BD.16 BD.17 FMT.05
        NSQ.01 NSQ.02 NSQ.03 EST.10 MAT.08 FMT.10 FMT.11 FMT.12
    """, "Projeto 3: inflação e juros (API do Banco Central) e microdados do INEP com Parquet e DuckDB"),
    ("E4 Modelar", """
        EST.11 AD.09 ML.01 ML.02 ML.03 MAT.10 ML.04 ML.05 AD.10 ML.07
        ML.06 MAT.09 ML.08 EST.12 ML.09 ML.10 ML.11 ML.13 ML.12
    """, "Projeto 4: modelo de previsão com validação honesta e explicação para um gestor"),
    ("E5 Profissão", """
        ENG.06 ETI.06 ENG.07 VIS.06 ETI.01 ETI.02 ETI.03 ENG.08 BD.19 BD.20
        ETI.05 ENG.09 NSQ.04 NSQ.05 NSQ.06 NSQ.07 ETI.04 VIS.07 ENG.10
    """, "Projeto 5: pipeline em produção, da API ao painel"),
]

LINHA_MODULO = re.compile(r"^\| ((?:[A-Z]{2,3})\.\d\d) ([^|]+?) \| ([^|]+?) \| ([^|]+?) \| ([^|]+?) \|$", re.M)


def ler_modulos():
    texto = CURRICULO.read_text(encoding="utf-8")
    modulos = {}
    for codigo, nome, conceitos, exercicios, dominio in LINHA_MODULO.findall(texto):
        lista = [c.strip() for c in conceitos.split(";") if c.strip() and not c.strip().startswith("`TODO")]
        lista = [re.sub(r"\. `TODO.*$", "", c) for c in lista]
        modulos[codigo] = (nome.strip(), lista, exercicios.strip(), dominio.strip())
    return modulos


def main():
    modulos = ler_modulos()
    ordem = [m for _, bloco, _ in ETAPAS for m in bloco.split()]
    faltando = sorted(set(modulos) - set(ordem))
    sobrando = sorted(set(ordem) - set(modulos))
    repetidos = sorted({m for m in ordem if ordem.count(m) > 1})
    if faltando or sobrando or repetidos:
        raise SystemExit(f"faltando={faltando} sobrando={sobrando} repetidos={repetidos}")

    linhas = [
        "# Percurso do zero. Gerado por tutor/gerar_percurso.py; não edite à mão.",
        "# M = módulo (exercícios | tarefa de domínio). Passo: número, código, conceito.",
        "# TD = tarefa de domínio do módulo. PJ = projeto da etapa.",
    ]
    passo = 0
    for etapa, bloco, projeto in ETAPAS:
        linhas.append(f"\n## {etapa}")
        for codigo in bloco.split():
            nome, conceitos, exercicios, dominio = modulos[codigo]
            linhas.append(f"M {codigo} {nome} | {exercicios} | {dominio}")
            for i, conceito in enumerate(conceitos, start=1):
                passo += 1
                linhas.append(f"{passo:04d} {codigo}.{i:02d} {conceito}")
            passo += 1
            linhas.append(f"{passo:04d} {codigo}.TD tarefa de domínio")
        passo += 1
        linhas.append(f"{passo:04d} {etapa.split()[0]}.PJ {projeto}")

    SAIDA.write_text("\n".join(linhas) + "\n", encoding="utf-8", newline="\n")
    print(f"{passo} passos, {len(ordem)} módulos")


if __name__ == "__main__":
    main()
