// Elenco original do Domínio, em estilo anime (seinen): três guias adultos, desenhados para o projeto.
// Nada aqui vem de franquia: são desenhos próprios, sem licença de terceiros.
// Cada guia tem as cinco expressões usadas pela apostila: padrao, explica, feliz, uau, pensa.
// A cor do detalhe (gravata, gola, fone) vem de --cv, a cor da matéria em que o guia aparece.
(function () {
  const ACC = "var(--cv, #6c8cff)";
  const TRACO = "#1b1e30";

  const CABELO = {
    curto: {
      tras: () => "",
      frente: `M50 102 C43 52 76 25 104 27 C139 29 157 57 150 102 C146 86 143 76 135 67 C128 81 116 85 107 71 C101 87 84 89 76 73 C68 85 60 90 50 102Z`,
      brilho: `M64 55 Q84 37 110 39`,
    },
    espetado: {
      tras: () => "",
      frente: `M50 102 C43 74 50 48 61 36 L68 53 L77 27 L90 47 L103 19 L114 45 L130 26 L134 51 L149 39 C158 64 156 86 150 102 C145 86 139 77 131 70 C123 83 111 85 103 73 C95 85 79 85 72 75 C64 85 58 91 50 102Z`,
      brilho: `M66 50 Q80 34 98 34`,
    },
    longo: {
      tras: () => `<path d="M46 104 C38 38 162 38 154 104 L162 196 C142 208 130 196 128 172 L72 172 C70 196 58 208 38 196Z"/>`,
      frente: `M47 106 C41 52 78 24 106 26 C141 28 159 58 153 106 C149 90 147 77 140 68 C125 84 100 78 85 60 C77 77 62 92 47 106Z`,
      brilho: `M60 58 Q82 36 112 38`,
    },
  };

  function olhos(tipo, cor) {
    const olho = (cx, lado) => {
      const cy = 112;
      const topo = `<path d="M${cx - 13.5} ${cy - 2} Q${cx} ${cy - 17.5} ${cx + 13.5} ${cy - 3}" stroke="${TRACO}" stroke-width="3.6" stroke-linecap="round" fill="none"/>`;
      const flick = `<path d="M${cx + lado * 13} ${cy - 3} l${lado * 5} -3" stroke="${TRACO}" stroke-width="2.6" stroke-linecap="round"/>`;
      if (tipo === "feliz") return `<path d="M${cx - 11} ${cy + 3} Q${cx} ${cy - 10} ${cx + 11} ${cy + 3}" stroke="${TRACO}" stroke-width="3.4" stroke-linecap="round" fill="none"/>${flick}`;
      const ry = tipo === "uau" ? 14 : 12;
      const dx = tipo === "pensa" ? -2.5 : 0, dy = tipo === "pensa" ? -2.5 : 0;
      return `<ellipse cx="${cx}" cy="${cy}" rx="11.5" ry="${ry}" fill="#fbfbff"/>
        <ellipse cx="${cx + dx}" cy="${cy + dy + 1}" rx="8.4" ry="${ry - 1.5}" fill="${cor}"/>
        <ellipse cx="${cx + dx}" cy="${cy + dy + 5}" rx="5.8" ry="4.6" fill="#ffffff" opacity="0.22"/>
        <ellipse cx="${cx + dx}" cy="${cy + dy + 1}" rx="4" ry="6" fill="#0d0f1c"/>
        <circle cx="${cx + dx - 3}" cy="${cy + dy - 3.5}" r="3" fill="#fff"/><circle cx="${cx + dx + 3}" cy="${cy + dy + 4}" r="1.5" fill="#fff" opacity="0.85"/>${topo}${flick}`;
    };
    return olho(80, -1) + olho(120, 1);
  }
  function sobrancelhas(tipo, corCabelo) {
    const l = tipo === "pensa" ? `M66 90 Q78 85 92 88` : tipo === "uau" ? `M66 88 Q78 80 92 84` : `M67 92 Q79 87 92 90`;
    const r = tipo === "pensa" ? `M108 83 Q121 77 134 84` : tipo === "uau" ? `M108 84 Q121 80 134 88` : `M108 90 Q121 87 133 92`;
    return `<g stroke="${corCabelo}" stroke-width="2.8" stroke-linecap="round" fill="none"><path d="${l}"/><path d="${r}"/></g>`;
  }
  function boca(tipo) {
    if (tipo === "feliz") return `<path d="M90 145 Q100 158 110 145 Z" fill="#7a2f3d" stroke="${TRACO}" stroke-width="2.4" stroke-linejoin="round"/>`;
    if (tipo === "explica") return `<path d="M91 146 Q100 154 109 146" stroke="${TRACO}" stroke-width="2.8" stroke-linecap="round" fill="none"/><path d="M95 148 Q100 152 105 148" fill="#7a2f3d" opacity="0.0"/>`;
    if (tipo === "uau") return `<ellipse cx="100" cy="148" rx="5" ry="6.5" fill="#7a2f3d" stroke="${TRACO}" stroke-width="2.4"/>`;
    if (tipo === "pensa") return `<path d="M93 148 Q100 145 108 149" stroke="${TRACO}" stroke-width="2.8" stroke-linecap="round" fill="none"/>`;
    return `<path d="M92 147 Q100 151 108 147" stroke="${TRACO}" stroke-width="2.8" stroke-linecap="round" fill="none"/>`;
  }

  function roupa(tipo, cor) {
    if (tipo === "jaleco") return `<path d="M12 230 C14 192 44 178 78 172 L100 194 L122 172 C156 178 186 192 188 230Z" fill="#eef0f7"/>
      <path d="M78 172 L100 194 L122 172 L112 169 L100 182 L88 169Z" fill="#d6daea"/>
      <path d="M100 194 V230" stroke="#c3c8dc" stroke-width="2"/><rect x="130" y="204" width="22" height="3" rx="1.5" fill="${ACC}"/>
      <path d="M86 176 L100 196 L114 176 Q100 170 86 176Z" fill="#2a2f4a"/>`;
    if (tipo === "moletom") return `<path d="M12 230 C14 192 44 178 78 172 L100 184 L122 172 C156 178 186 192 188 230Z" fill="${ACC}"/>
      <path d="M78 172 Q100 196 122 172 L116 168 Q100 184 84 168Z" fill="#0f1224" opacity="0.35"/>
      <path d="M92 190 V212 M108 190 V212" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity="0.8"/>`;
    return `<path d="M12 230 C14 192 44 178 78 172 L100 194 L122 172 C156 178 186 192 188 230Z" fill="${cor}"/>
      <path d="M82 171 L100 198 L118 171 L100 166Z" fill="#f2f4fb"/>
      <path d="M78 172 L90 196 L100 194 L82 171Z M122 172 L110 196 L100 194 L118 171Z" fill="#14172a"/>
      <path d="M96.5 192 H103.5 L105.5 216 L100 224 L94.5 216Z" fill="${ACC}"/>`;
  }
  function fone() {
    return `<g><path d="M48 98 C44 30 156 30 152 98" stroke="#232744" stroke-width="5.5" fill="none" stroke-linecap="round"/>
      <rect x="40" y="92" width="14" height="30" rx="7" fill="#232744"/><rect x="146" y="92" width="14" height="30" rx="7" fill="#232744"/>
      <rect x="43" y="98" width="5" height="18" rx="2.5" fill="${ACC}"/><rect x="152" y="98" width="5" height="18" rx="2.5" fill="${ACC}"/></g>`;
  }
  function oculos() {
    return `<g stroke="#2b2f4a" stroke-width="2.6" fill="rgb(160 190 255 / 0.10)"><rect x="63" y="96" width="33" height="29" rx="9"/><rect x="104" y="96" width="33" height="29" rx="9"/></g>
      <path d="M96 107 Q100 103 104 107" stroke="#2b2f4a" stroke-width="2.4" fill="none"/>
      <path d="M72 100 L84 98" stroke="#fff" stroke-width="2" opacity="0.55" stroke-linecap="round"/>`;
  }

  function desenhar(p, tipo) {
    const cab = CABELO[p.cabelo];
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 230" fill="none" role="img" aria-hidden="true">
  ${roupa(p.roupa, p.cor)}
  <g fill="${p.skin}"><path d="M88 148 L88 178 Q100 190 112 178 L112 148Z"/></g>
  <path d="M88 160 Q100 170 112 160 L112 172 Q100 184 88 172Z" fill="#000" opacity="0.10"/>
  <g fill="${p.hair}">${cab.tras()}</g>
  <ellipse cx="55" cy="112" rx="6" ry="10" fill="${p.skin}"/><ellipse cx="145" cy="112" rx="6" ry="10" fill="${p.skin}"/>
  <path d="M56 96 C56 142 78 169 100 169 C122 169 144 142 144 96 C144 64 124 52 100 52 C76 52 56 64 56 96Z" fill="${p.skin}"/>
  <path d="M60 128 C64 150 80 166 100 168 C84 160 68 146 60 128Z" fill="#000" opacity="0.07"/>
  ${p.sombraNariz ? "" : ""}
  ${olhos(tipo, p.iris)}
  ${sobrancelhas(tipo, p.hair)}
  <path d="M100 124 L97.5 132 Q100 134 103 132" stroke="#000" stroke-opacity="0.35" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  ${boca(tipo)}
  ${p.oculos ? oculos() : ""}
  <path d="${cab.frente}" fill="${p.hair}"/>
  <path d="${cab.brilho}" stroke="#fff" stroke-opacity="0.28" stroke-width="3.4" stroke-linecap="round" fill="none"/>
  ${p.fone ? fone() : ""}
  ${tipo === "uau" ? `<path d="M158 70 l8 -6 M162 86 l11 -1 M154 54 l5 -9" stroke="${ACC}" stroke-width="2.6" stroke-linecap="round"/>` : ""}
  ${tipo === "pensa" ? `<g fill="${ACC}"><circle cx="164" cy="56" r="3"/><circle cx="174" cy="44" r="4.2"/></g>` : ""}
</svg>`;
  }

  const ELENCO = [
    { id: "rin", nome: "Rin", funcao: "analista", cabelo: "curto", hair: "#1d2740", skin: "#f1d1bb", iris: "#3f73b8", roupa: "blazer", cor: "#242b45", oculos: true },
    { id: "takumi", nome: "Takumi", funcao: "engenheiro", cabelo: "espetado", hair: "#2b2018", skin: "#d6a37b", iris: "#6a4c2f", roupa: "moletom", cor: "#2a2f4a", fone: true },
    { id: "mei", nome: "Mei", funcao: "cientista", cabelo: "longo", hair: "#2a1d33", skin: "#ebc3a4", iris: "#6d52a3", roupa: "jaleco", cor: "#eef0f7" },
  ];
  const EXPR = ["padrao", "explica", "feliz", "uau", "pensa"];
  const GUIAS = {};
  ELENCO.forEach((p) => {
    GUIAS[p.id] = { id: p.id, nome: p.nome, funcao: p.funcao, expr: Object.fromEntries(EXPR.map((e) => [e, desenhar(p, e)])) };
  });
  // o panda anterior continua como opção de guia
  if (window.MASCOTE) GUIAS.panda = { id: "panda", nome: "Dado", funcao: "panda estudante", expr: window.MASCOTE };
  window.GUIAS = GUIAS;
})();
