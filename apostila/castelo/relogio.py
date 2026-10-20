# Relógio da execução: roda a chamada com sys.settrace e anota, a cada linha da função,
# o número da linha e o valor de cada variável. Devolve um JSON com os passos.
# Variáveis de entrada (postas pelo JavaScript): _codigo (o código da função) e _chamada.
import sys, json

_nome = _chamada.split("(")[0].strip()
_passos = []

def _rastro(frame, evento, arg):
    if frame.f_code.co_name != _nome:
        return _rastro
    if evento in ("line", "return"):
        _passos.append({
            "linha": frame.f_lineno,
            "evento": evento,
            "vars": {k: repr(v) for k, v in frame.f_locals.items()},
            "ret": repr(arg) if evento == "return" else None,
        })
    return _rastro

_ambiente = {}
exec(compile(_codigo, "<relogio>", "exec"), _ambiente)
sys.settrace(_rastro)
try:
    eval(_chamada, _ambiente)
finally:
    sys.settrace(None)
json.dumps(_passos)
