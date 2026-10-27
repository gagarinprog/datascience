"""Gera o percurso por matéria a partir do currículo (docs/05) e da sequência (tutor/sequencia_dados.py).

Uso: python -I tutor/gerar_percurso.py

Saídas:
- tutor/percurso.txt: uma seção por matéria, na ordem de estudo; em cada módulo, a linha M
  traz o que ele exige antes (antes:) e a pergunta de prontidão (pronto:).
- apostila/materias.js: os mesmos dados para a Trilha e o Guia das matérias.

Verificações que quebram a geração:
- todo módulo do docs/05 aparece em exatamente uma matéria;
- todo pré-requisito aparece antes, no percurso, do módulo que o exige;
- todo módulo tem pergunta, resposta, tropeço e exemplo do dia a dia.
"""

import json
import re
import runpy
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CURRICULO = RAIZ / "docs" / "05_CURRICULO_CIENCIA_DE_DADOS.md"
DADOS = runpy.run_path(str(RAIZ / "tutor" / "sequencia_dados.py"))
PERCURSO = RAIZ / "tutor" / "percurso.txt"
DADOS_GUIA = RAIZ / "apostila" / "materias.js"

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


def verificar(curriculo, materias, extras):
    erros = []
    ordem = [cod for m in materias for cod in m["modulos"]]
    vistos = set()
    for cod in ordem:
        if cod in vistos:
            erros.append(f"{cod} aparece duas vezes")
        vistos.add(cod)
    for cod in sorted(set(curriculo) - vistos):
        erros.append(f"{cod} não está em nenhuma matéria")
    for cod in sorted(vistos - set(curriculo)):
        erros.append(f"{cod} não existe no docs/05")
    posicao = {cod: i for i, cod in enumerate(ordem)}
    for cod in ordem:
        info = extras.get(cod)
        if not info:
            erros.append(f"{cod} sem dados de sequência")
            continue
        for campo in ("p", "r", "t", "d"):
            if not info[campo].strip():
                erros.append(f"{cod} sem o campo {campo}")
        for pre in info["antes"]:
            if pre not in posicao:
                erros.append(f"{cod} exige {pre}, que não existe")
            elif posicao[pre] >= posicao[cod]:
                erros.append(f"{cod} exige {pre}, que vem depois no percurso")
    for cod, ordem_c in DADOS["ORDEM_CONCEITOS"].items():
        if sorted(ordem_c) != list(range(1, len(curriculo[cod][1]) + 1)):
            erros.append(f"ordem de conceitos inválida em {cod}")
    if erros:
        raise SystemExit("\n".join(erros))


def main():
    curriculo = ler_modulos()
    materias = DADOS["MATERIAS"]
    extras = DADOS["MODULOS"]
    verificar(curriculo, materias, extras)

    nome_de = {cod: curriculo[cod][0] for cod in curriculo}
    materia_de = {cod: m["sigla"] for m in materias for cod in m["modulos"]}

    linhas = [
        "# Percurso por matéria. Gerado por tutor/gerar_percurso.py; não edite à mão.",
        "# M = módulo | exercícios | tarefa de domínio | antes: pré-requisitos | pronto: pergunta de prontidão.",
        "# Passo: código do passo, código do conceito, conceito. TD = tarefa de domínio do módulo.",
    ]
    guia = []
    total = 0
    for ordem, mat in enumerate(materias, start=1):
        sigla = mat["sigla"]
        linhas.append(f"\n## {sigla} {mat['nome']} ({ordem} de {len(materias)})")
        passo = 0
        mods = []
        for codigo in mat["modulos"]:
            nome, conceitos, exercicios, dominio = curriculo[codigo]
            info = extras[codigo]
            antes = "; ".join(f"{p} {nome_de[p]}" for p in info["antes"]) or "nada"
            virada = " | ponto de virada" if info["v"] else ""
            linhas.append(f"M {codigo} {nome} | {exercicios} | {dominio} | antes: {antes} | pronto: {info['p']}{virada}")
            posicoes = DADOS["ORDEM_CONCEITOS"].get(codigo, range(1, len(conceitos) + 1))
            for pos in posicoes:
                passo += 1
                linhas.append(f"{sigla}-{passo:03d} {codigo}.{pos:02d} {conceitos[pos - 1]}")
            passo += 1
            linhas.append(f"{sigla}-{passo:03d} {codigo}.TD tarefa de domínio")
            mods.append({
                "codigo": codigo,
                "nome": limpar(nome),
                "conceitos": [limpar(conceitos[pos - 1]) for pos in posicoes],
                "dominio": limpar(dominio),
                "antes": [{"codigo": p, "nome": limpar(nome_de[p]), "materia": materia_de[p]} for p in info["antes"]],
                "pergunta": info["p"],
                "resposta": info["r"],
                "tropeco": info["t"],
                "dia": info["d"],
                "virada": info["v"],
                "passos": len(conceitos) + 1,
            })
        total += passo
        # peso de cada módulo na formação: a parte da matéria, proporcional aos conceitos, com 1,5x no ponto de virada
        cotas = [len(m["conceitos"]) * (1.5 if m["virada"] else 1) for m in mods]
        for m, cota in zip(mods, cotas):
            m["peso"] = round(mat["peso"] * cota / sum(cotas), 3)
        guia.append({"sigla": sigla, "nome": mat["nome"], "etapa": mat["etapa"], "trabalho": mat["trabalho"], "porque": mat["porque"], "logos": mat["logos"], "peso": mat["peso"], "peso_porque": mat["peso_porque"], "modulos": mods})

    soma = sum(m["peso"] for m in materias)
    if soma != 100:
        raise SystemExit(f"os pesos das matérias somam {soma}, e precisam somar 100")
    PERCURSO.write_text("\n".join(linhas) + "\n", encoding="utf-8", newline="\n")
    DADOS_GUIA.write_text(
        "// Gerado por tutor/gerar_percurso.py a partir do docs/05 e de tutor/sequencia_dados.py. Não edite à mão.\n"
        "window.MATERIAS = " + json.dumps(guia, ensure_ascii=False, indent=1) + ";\n",
        encoding="utf-8",
        newline="\n",
    )
    print(f"{total} passos em {len(materias)} matérias, {sum(len(m['modulos']) for m in materias)} módulos")


if __name__ == "__main__":
    main()
