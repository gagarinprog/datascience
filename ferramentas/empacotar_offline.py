import os, re, shutil, subprocess, sys, urllib.parse
import os.path
SP = os.path.dirname(os.path.abspath(__file__)) + "/../build-offline"
os.makedirs(SP, exist_ok=True)
SRC = os.path.dirname(os.path.abspath(__file__)) + "/../apostila"
OUT = SP + "/Dominio"; APP = OUT + "/app"; VEN = APP + "/vendor"
FONTES_CSS = "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Mono:wght@400;500;700&family=Atkinson+Hyperlegible+Next:ital,wght@0,400;0,500;0,700;0,800;1,400&family=Bricolage+Grotesque:opsz,wght@12..96,500..800&display=swap"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36"
def baixar(url, dest):
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    if os.path.exists(dest) and os.path.getsize(dest) > 0: return
    subprocess.run(["curl", "-sSfL", "-A", UA, "-o", dest, url], check=True)
shutil.rmtree(OUT, ignore_errors=True)
shutil.copytree(SRC, APP, ignore=shutil.ignore_patterns("*.py", "__pycache__", "node_modules"))
# o banco de estudo .py gerador fica de fora, mas relogio.py do castelo é usado em tempo de execucao
shutil.copy(SRC + "/castelo/relogio.py", APP + "/castelo/relogio.py")
urls = [u for u in open(os.path.dirname(os.path.abspath(__file__)) + "/urls_externas.txt").read().split() if "fonts.g" not in u]
for u in urls:
    p = urllib.parse.urlparse(u); baixar(u, VEN + "/" + p.netloc + p.path)
# fontes: CSS completo (todas as faixas de caracteres) e cada woff2
css = subprocess.run(["curl", "-sSfL", "-A", UA, FONTES_CSS], check=True, capture_output=True, text=True).stdout
for u in sorted(set(re.findall(r"https://fonts\.gstatic\.com/[^)]+", css))):
    p = urllib.parse.urlparse(u); baixar(u, VEN + "/" + p.netloc + p.path)
css = css.replace("https://fonts.gstatic.com/", "/vendor/fonts.gstatic.com/")
os.makedirs(VEN + "/fonts.googleapis.com", exist_ok=True)
open(VEN + "/fonts.googleapis.com/fontes.css", "w").write(css)
# troca os enderecos de fora pelos locais em todos os textos do app (menos na pasta vendor)
n = 0
for raiz, dirs, arqs in os.walk(APP):
    if raiz.startswith(VEN): continue
    for a in arqs:
        if not a.endswith((".html", ".js", ".css", ".mjs")): continue
        f = os.path.join(raiz, a); s = open(f, encoding="utf-8").read(); t = s
        t = t.replace(FONTES_CSS, "/vendor/fonts.googleapis.com/fontes.css")
        t = t.replace("https://cdn.jsdelivr.net/", "/vendor/cdn.jsdelivr.net/").replace("https://cdnjs.cloudflare.com/", "/vendor/cdnjs.cloudflare.com/")
        if a == "offline.js":
            t = t.replace("const disponivel = () =>", "const disponivel = () => false && (() =>").replace('location.hostname === "localhost");\n', 'location.hostname === "localhost"));\n', 1)
        if t != s: open(f, "w", encoding="utf-8").write(t); n += 1
print("arquivos reescritos", n)
# o que ainda aponta para fora
rest = subprocess.run(["grep", "-rlE", "https://(cdn\\.jsdelivr|cdnjs|fonts\\.g)", APP, "--include=*.js", "--include=*.html", "--include=*.css", "--exclude-dir=vendor"], capture_output=True, text=True).stdout
print("ainda com endereco de fora:", rest or "nenhum")
