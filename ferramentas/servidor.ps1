# Dominio - servidor local. Serve a pasta "app" em http://localhost:8765 e abre o navegador.
# Nada sai do computador: tudo, inclusive o Python e o PostgreSQL, esta na pasta app.
# Para fechar o Dominio, feche esta janela.
$ErrorActionPreference = "Stop"
$raiz = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot "app"))
$porta = 8765
$endereco = "http://localhost:$porta/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($endereco)
try {
  $listener.Start()
} catch {
  # ja esta aberto em outra janela: so abre o navegador
  try { Start-Process ($endereco + "index.html") } catch { Write-Host "  Abra no navegador: $($endereco)index.html" }
  exit
}
Write-Host ""
Write-Host "  Dominio aberto em $endereco"
Write-Host "  Deixe esta janela aberta enquanto estuda. Para sair, feche esta janela."
Write-Host ""
try { Start-Process ($endereco + "index.html") } catch { Write-Host "  Abra no navegador: $($endereco)index.html" }
$tipos = @{
  ".html" = "text/html; charset=utf-8"; ".js" = "text/javascript; charset=utf-8"; ".mjs" = "text/javascript; charset=utf-8"
  ".css" = "text/css; charset=utf-8"; ".json" = "application/json"; ".webmanifest" = "application/manifest+json"
  ".wasm" = "application/wasm"; ".png" = "image/png"; ".svg" = "image/svg+xml"; ".ico" = "image/x-icon"
  ".woff2" = "font/woff2"; ".whl" = "application/octet-stream"; ".zip" = "application/zip"; ".data" = "application/octet-stream"
  ".sql" = "text/plain; charset=utf-8"; ".py" = "text/plain; charset=utf-8"; ".txt" = "text/plain; charset=utf-8"
}
while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $resp = $ctx.Response
  try {
    $caminho = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath)
    if ($caminho.EndsWith("/")) { $caminho += "index.html" }
    $relativo = $caminho.TrimStart("/").Replace("/", [IO.Path]::DirectorySeparatorChar)
    $arq = [IO.Path]::GetFullPath((Join-Path $raiz $relativo))
    if (-not $arq.StartsWith($raiz) -or -not (Test-Path -LiteralPath $arq -PathType Leaf)) {
      $resp.StatusCode = 404
    } else {
      $ext = [IO.Path]::GetExtension($arq).ToLower()
      if ($tipos.ContainsKey($ext)) { $resp.ContentType = $tipos[$ext] } else { $resp.ContentType = "application/octet-stream" }
      $resp.AddHeader("Cache-Control", "no-cache")
      $bytes = [IO.File]::ReadAllBytes($arq)
      $resp.ContentLength64 = $bytes.Length
      if ($ctx.Request.HttpMethod -ne "HEAD") { $resp.OutputStream.Write($bytes, 0, $bytes.Length) }
    }
  } catch {
    try { $resp.StatusCode = 500 } catch {}
  } finally {
    try { $resp.Close() } catch {}
  }
}
