// Python das lições, fora da página: o Pyodide (github.com/pyodide/pyodide, MPL 2.0) roda neste Web Worker, para o
// quadro de código atualizar enquanto se digita sem travar a tela. Se um código demorar demais (um laço sem fim),
// a página encerra este worker e cria outro. O mesmo Pyodide do laboratório, pela CDN, guardado pelo service worker.
// É um worker de módulo (new Worker(url, { type: "module" })): esta versão do Pyodide não roda em worker clássico.
import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v314.0.7/full/pyodide.mjs";
const PYODIDE = "https://cdn.jsdelivr.net/pyodide/v314.0.7/full/";
let py = null;
const pacotes = new Set();

// converte o valor de uma variável em algo que a página sabe desenhar: tabela, série, lista ou valor
const AJUDA = `
import json as _json, io as _io, sys as _sys, builtins as _b
def _forma(v):
    try:
        import pandas as _pd
        if isinstance(v, _pd.DataFrame):
            d = v.head(30)
            return {"tipo": "tabela", "colunas": [str(c) for c in d.columns], "indice": [str(i) for i in d.index],
                    "linhas": _json.loads(d.to_json(orient="values", double_precision=6)),
                    "total": int(len(v))}
        if isinstance(v, _pd.Series):
            d = v.head(30)
            return {"tipo": "serie", "nome": str(v.name) if v.name is not None else "", "indice": [str(i) for i in d.index],
                    "valores": _json.loads(d.to_json(orient="values", double_precision=6)), "total": int(len(v)), "dtype": str(v.dtype)}
    except ImportError:
        pass
    if isinstance(v, bool) or v is None or isinstance(v, (int, float, str)):
        return {"tipo": "valor", "repr": repr(v), "py": type(v).__name__}
    return {"tipo": "valor", "repr": repr(v)[:400], "py": type(v).__name__}
`;

async function preparar(lista) {
  if (!py) {
    py = await loadPyodide({ indexURL: PYODIDE });
    py.runPython(AJUDA);
  }
  // o import também acontece aqui, sem tempo limite: o primeiro import do pandas leva alguns segundos
  for (const p of lista || []) if (!pacotes.has(p)) { await py.loadPackage(p); py.runPython(`import ${p}`); pacotes.add(p); }
}

async function rodar(m) {
  await preparar(m.pacotes);
  // cada execução começa limpa: um dicionário novo de variáveis, a saída capturada e o input respondido pela lista
  const ns = py.runPython("{}");
  const entradas = py.toPy((m.entradas || []).map(String));
  ns.set("_entradas", entradas);
  ns.set("_codigo", m.codigo || ""); // os testes podem olhar o texto (por exemplo, se há comentário)
  py.runPython(`
from __main__ import _forma, _json, _io
_saida = _io.StringIO()
def print(*a, sep=" ", end="\\n", file=None, flush=False):
    _saida.write(sep.join(str(x) for x in a) + end)
def input(prompt=""):
    _saida.write(str(prompt))
    v = _entradas.pop(0) if _entradas else ""
    _saida.write(v + "\\n")
    return v
`, { globals: ns });
  entradas.destroy();
  const res = { valores: {}, saida: "", erro: null, ultimo: null, teste: null };
  try {
    if (m.preparo) py.runPython(m.preparo, { globals: ns });
    const ultimo = await py.runPythonAsync(m.codigo || "", { globals: ns });
    if (ultimo !== undefined && m.repl) {
      ns.set("_ultimo", ultimo);
      res.ultimo = JSON.parse(py.runPython("_json.dumps(_forma(_ultimo))", { globals: ns }));
    }
    if (ultimo && ultimo.destroy) ultimo.destroy();
  } catch (e) {
    res.erro = String(e && e.message || e);
  }
  res.saida = py.runPython("_saida.getvalue()", { globals: ns });
  for (const nome of m.mostrar || []) {
    if (!ns.has(nome)) continue;
    try { res.valores[nome] = JSON.parse(py.runPython(`_json.dumps(_forma(${nome}))`, { globals: ns })); } catch (e) { /* valor que não sai */ }
  }
  if (!res.erro && m.testes) {
    try { py.runPython(m.testes, { globals: ns }); res.teste = { ok: true }; }
    catch (e) { res.teste = { ok: false, msg: String(e && e.message || e) }; }
  }
  ns.destroy();
  return res;
}

self.onmessage = async (ev) => {
  const m = ev.data;
  try {
    if (m.tipo === "preparar") { await preparar(m.pacotes); self.postMessage({ id: m.id, pronto: true }); return; }
    self.postMessage(Object.assign({ id: m.id }, await rodar(m)));
  } catch (e) {
    self.postMessage({ id: m.id, falhou: String(e && e.message || e) });
  }
};
