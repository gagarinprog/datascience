// Só no app Android: o WebView não baixa arquivos sozinho. "Salvar meu trajeto" e o backup do Centro de Dados
// passam pela ponte do app, que grava o arquivo na pasta Downloads do celular.
(function () {
  if (!window.DominioAndroid) return;
  const clicar = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () {
    if (this.download && /^blob:/.test(this.href)) {
      const nome = this.download;
      fetch(this.href).then((r) => r.text()).then((texto) => {
        const onde = window.DominioAndroid.salvar(nome, texto);
        alert(onde ? "Arquivo salvo em " + onde + "." : "Não consegui salvar o arquivo.");
      }).catch(() => alert("Não consegui salvar o arquivo."));
      return;
    }
    return clicar.call(this);
  };
})();
