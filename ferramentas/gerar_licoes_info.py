"""Gera apostila/licoes-info.js: quanto cada aula ilustrada tem (conceitos, exercícios, Python, minutos).

Os números aparecem nos botões "Aula ilustrada", "Exercícios" e "Laboratório Python" do estudo e da matéria.
Rode depois de mudar uma lição: python -I ferramentas/gerar_licoes_info.py
"""
import json
import pathlib
import re

RAIZ = pathlib.Path(__file__).resolve().parent.parent / "apostila"
jornada = (RAIZ / "jornada.js").read_text(encoding="utf-8")
licoes = json.loads("{" + re.search(r"const LICOES = \{(.*?)\};", jornada).group(1) + "}")
info = {}
for cod, caminho in sorted(licoes.items()):
    html = (RAIZ / caminho).read_text(encoding="utf-8")
    secoes = len(re.findall(r'<section class="secao"', html))
    classes = re.findall(r'class="exercicio([^"]*)"', html)
    python = sum(1 for c in classes if " py" in c or c.strip() == "py")
    exercicios = sum(1 for c in classes if "desafio" not in c and " py" not in c)
    animacoes = len(re.findall(r"data-clip=", html))
    bancadas = len(re.findall(r"data-bancada=", html))
    minutos = round(secoes * 3 + exercicios * 0.4 + python * 1.5)
    info[cod] = {"conceitos": secoes, "exercicios": exercicios, "python": python, "animacoes": animacoes, "bancadas": bancadas, "minutos": minutos}
saida = "// Gerado por ferramentas/gerar_licoes_info.py a partir das lições ilustradas; não edite à mão.\nwindow.LICOES_INFO = " + json.dumps(info, ensure_ascii=False, indent=1) + ";\n"
(RAIZ / "licoes-info.js").write_text(saida, encoding="utf-8")
print(json.dumps(info, ensure_ascii=False))
