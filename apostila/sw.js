// Service worker do Domínio: guarda os arquivos no aparelho para o app abrir sem internet.
// Arquivos do próprio site: rede primeiro (pega a versão nova quando há internet) e cópia guardada quando não há.
// Fontes e bibliotecas de CDN: cópia guardada primeiro, porque não mudam. As grandes (o PostgreSQL e o Python
// do laboratório) não entram na instalação: ficam guardadas no primeiro uso, e daí em diante abrem sem internet.
// Toda lição ou arquivo novo em apostila/ entra em ARQUIVOS; o teste tests/apostila-pwa.test.ts confere.
const CACHE = "dominio-v15";
const ARQUIVOS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./estilo.css",
  "./trilha.css",
  "./jornada.css",
  "./icones.js",
  "./mascote.js",
  "./personagens.js",
  "./logos.js",
  "./figuras.js",
  "./materias.js",
  "./guia-textos.js",
  "./fontes.js",
  "./glossario.js",
  "./experimente.js",
  "./clipes.js",
  "./jornada.js",
  "./tema.css",
  "./tema.js",
  "./icones/icone-192.png",
  "./icones/icone-512.png",
  "./icones/icone-mascara-512.png",
  "./icones/apple-touch-icon.png",
  "./licoes/INICIO.html",
  "./licoes/LOG.01.html",
  "./licoes/PY.01.html",
  "./licoes/LOG.02.html",
  "./licoes/LOG.03.html",
  "./licoes/GALERIA.html",
  "./licoes/REVISAR.html",
  "./licoes/clip.css",
  "./licoes/clip.js",
  "./licoes/clipes-inicio.js",
  "./licoes/clipes-log.js",
  "./licoes/clipes-py.js",
  "./licoes/clipes-var.js",
  "./licoes/clipes-ops.js",
  "./licoes/clipes-galeria.js",
  "./licoes/reacao.js",
  "./licoes/motor.js",
  "./licoes/laboratorio.js",
  "./licoes/laboratorio.css",
  "./licoes/LOGICA-SIMPLES.html",
  "./licoes/revisao-logica.js",
  "./licoes/python-worker.js",
  "./licoes/revisar.js",
  "./licoes/dados/estudo.sql",
  "./castelo/index.html",
  "./castelo/castelo.css",
  "./castelo/castelo.js",
  "./castelo/salas.js",
  "./castelo/comparar.js",
  "./castelo/relogio.py",
  "./castelo/passos.js",
  "./castelo/backup.js",
  "./botoes.css",
  "./avatares.js",
  "./avatares-manga.js",
  "./tracos.js",
  "./trajeto.js",
  "./guia-mov.js",
  "./guia-mov.css",
  "./passo/passo.js",
  "./passo/cascata.js",
  "./passo/passo.css",
];
const CDN = [
  "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Mono:wght@400;500;700&family=Atkinson+Hyperlegible+Next:ital,wght@0,400;0,500;0,700;0,800;1,400&family=Bricolage+Grotesque:opsz,wght@12..96,500..800&display=swap",
  "https://cdn.jsdelivr.net/npm/@formkit/auto-animate@0.8.2/index.mjs",
  "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/gsap.min.js",
  "https://cdn.jsdelivr.net/npm/animejs@4.4.1/dist/bundles/anime.umd.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then(async (c) => {
      await c.addAll(ARQUIVOS);
      // bibliotecas de fora: se alguma falhar, o app instala mesmo assim e guarda depois, no primeiro uso
      await Promise.allSettled(CDN.map((u) => fetch(u, { mode: "cors" }).then((r) => r.ok && c.put(u, r))));
      await self.skipWaiting();
    }),
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

const guardar = (req, resp) => {
  if (resp && (resp.ok || resp.type === "opaque")) {
    const copia = resp.clone();
    caches.open(CACHE).then((c) => c.put(req, copia));
  }
  return resp;
};

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin) {
    e.respondWith(
      fetch(req)
        .then((r) => guardar(req, r))
        .catch(() =>
          caches
            .match(req, { ignoreSearch: true })
            .then((r) => r || (req.mode === "navigate" ? caches.match("./index.html") : Response.error())),
        ),
    );
    return;
  }
  e.respondWith(caches.match(req).then((r) => r || fetch(req).then((resp) => guardar(req, resp))));
});
