// Trajeto: salva tudo o que o Domínio guarda neste aparelho num arquivo e restaura de um arquivo, em qualquer
// aparelho. Entra tudo que começa com "dominio:" no armazenamento do navegador: módulos dominados e passos,
// lições, revisões, anotações, respostas, o progresso e o último backup do laboratório, guia, traço e tema.
// O banco do laboratório (PostgreSQL no navegador) não vai no arquivo: o próprio laboratório o reconstrói a partir
// dos módulos feitos ("Reconstruir até aqui"). Antes de carregar um arquivo, o trajeto atual fica guardado para
// desfazer. A nuvem (Supabase) vem depois, usando este mesmo formato.
(function (raiz) {
  "use strict";
  const PREFIXO = "dominio:";
  const PROPRIAS = ["dominio:trajeto:anterior", "dominio:trajeto:salvo"]; // do próprio salvamento: não viajam
  const VERSAO = 1;
  const armazem = () => { try { return raiz.localStorage; } catch (e) { return null; } };
  const hojeISO = () => new Date().toISOString();

  function chaves() {
    const ls = armazem();
    if (!ls) return [];
    const lista = [];
    for (let i = 0; i < ls.length; i++) {
      const k = ls.key(i);
      if (k && k.startsWith(PREFIXO) && !PROPRIAS.includes(k)) lista.push(k);
    }
    return lista.sort();
  }

  // o pacote: { app, versao, salvo_em, dados: { chave: texto } }
  function empacotar() {
    const ls = armazem(), dados = {};
    chaves().forEach((k) => { dados[k] = ls.getItem(k); });
    return { app: "dominio", versao: VERSAO, salvo_em: hojeISO(), dados };
  }

  function lerJSON(texto, padrao) { try { return JSON.parse(texto); } catch (e) { return padrao; } }

  // o que o arquivo traz, em números que a pessoa reconhece
  function resumo(pacote) {
    const d = pacote.dados || {};
    const prog = lerJSON(d["dominio:progresso:v1"], {}) || {};
    const mods = Object.values(prog.modulos || {}).filter((m) => m && m.estado === "dominado").length;
    const licoes = Object.keys(d).filter((k) => k.startsWith("dominio:licao:")).length;
    const revisoes = Object.keys(lerJSON(d["dominio:revisao:v1"], {}) || {}).length;
    const lab = lerJSON(d["dominio:castelo:v1"], null);
    return { modulos: mods, licoes, revisoes, laboratorio: lab && lab.feitas ? lab.feitas : 0, salvo_em: pacote.salvo_em || "" };
  }

  // confere o arquivo antes de tocar em qualquer coisa; devolve o pacote ou lança um erro com a explicação
  function validar(texto) {
    const p = lerJSON(texto, null);
    if (!p || typeof p !== "object") throw new Error("Este arquivo não é um trajeto do Domínio (não deu para ler o conteúdo).");
    if (p.app !== "dominio" || !p.dados || typeof p.dados !== "object") throw new Error("Este arquivo não é um trajeto do Domínio.");
    if (typeof p.versao !== "number" || p.versao > VERSAO) throw new Error("Este trajeto foi salvo por uma versão mais nova do Domínio. Atualize a página e tente de novo.");
    const limpo = {};
    Object.entries(p.dados).forEach(([k, v]) => {
      if (typeof k === "string" && k.startsWith(PREFIXO) && !PROPRIAS.includes(k) && typeof v === "string") limpo[k] = v;
    });
    if (!Object.keys(limpo).length) throw new Error("Este trajeto está vazio.");
    return { app: "dominio", versao: p.versao, salvo_em: p.salvo_em || "", dados: limpo };
  }

  // troca o trajeto deste aparelho pelo do arquivo; o atual fica guardado para desfazer
  function aplicar(pacote) {
    const ls = armazem();
    if (!ls) throw new Error("Este navegador não deixa guardar dados (janela anônima?).");
    const anterior = empacotar();
    chaves().forEach((k) => ls.removeItem(k));
    Object.entries(pacote.dados).forEach(([k, v]) => ls.setItem(k, v));
    ls.setItem("dominio:trajeto:anterior", JSON.stringify(anterior));
  }
  function desfazer() {
    const ls = armazem();
    const ant = ls && lerJSON(ls.getItem("dominio:trajeto:anterior"), null);
    if (!ant) return false;
    chaves().forEach((k) => ls.removeItem(k));
    Object.entries(ant.dados || {}).forEach(([k, v]) => ls.setItem(k, v));
    ls.removeItem("dominio:trajeto:anterior");
    return true;
  }

  function nomeArquivo(d) {
    const p = (n) => String(n).padStart(2, "0");
    return `dominio-trajeto-${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}.json`;
  }
  // baixa o arquivo e anota quando foi o último salvamento
  function baixar() {
    const pacote = empacotar();
    const blob = new Blob([JSON.stringify(pacote, null, 1)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = nomeArquivo(new Date());
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    try { raiz.localStorage.setItem("dominio:trajeto:salvo", pacote.salvo_em); } catch (e) { /* sem armazenamento */ }
    return pacote;
  }
  const ultimoSalvo = () => { try { return raiz.localStorage.getItem("dominio:trajeto:salvo") || ""; } catch (e) { return ""; } };
  const temAnterior = () => { try { return !!raiz.localStorage.getItem("dominio:trajeto:anterior"); } catch (e) { return false; } };

  raiz.Trajeto = { empacotar, validar, resumo, aplicar, desfazer, baixar, ultimoSalvo, temAnterior, nomeArquivo, chaves, VERSAO };
})(typeof window !== "undefined" ? window : globalThis);
