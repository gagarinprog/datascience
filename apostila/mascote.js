// Mascote Dado: um panda estudante (capelo, óculos e blusão na cor da matéria), desenhado para o Domínio.
// Neutro de gênero. A cor do blusão e do capelo vem de --cv (a cor viva da matéria em que ele aparece).
// Cinco expressões: padrao, explica, feliz, uau, pensa. As classes p-* recebem os movimentos em jornada.css.
(function () {
  const PRETO = "#1c1b2e";
  const BRANCO = "#fffdf8";
  const ACC = "var(--cv, #8b7cf6)";
  const estrela = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path class="p-brilho" d="M0 -9 L2.4 -2.4 L9 0 L2.4 2.4 L0 9 L-2.4 2.4 L-9 0 L-2.4 -2.4Z" fill="#ffd166"/></g>`;

  function olho(cx, cy, tipo) {
    if (tipo === "feliz") return `<path d="M${cx - 10} ${cy + 3} q10 -13 20 0" stroke="${BRANCO}" stroke-width="4" stroke-linecap="round" fill="none"/>`;
    const r = tipo === "uau" ? 9.5 : 8;
    const dx = tipo === "pensa" ? -2.5 : 0;
    const dy = tipo === "pensa" ? -3.5 : 0;
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${BRANCO}"/><circle cx="${cx + dx}" cy="${cy + dy}" r="${tipo === "uau" ? 5.4 : 4.8}" fill="${PRETO}"/><circle cx="${cx + dx + 1.9}" cy="${cy + dy - 1.9}" r="1.7" fill="${BRANCO}"/>`;
  }
  function boca(tipo) {
    const sorriso = (d, extra = "") => `<path d="${d}" stroke="${PRETO}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" fill="none"${extra}/>`;
    if (tipo === "feliz") return `<path d="M86 135 Q100 160 114 135 Z" fill="#5b1f2e" stroke="${PRETO}" stroke-width="3" stroke-linejoin="round"/><ellipse cx="100" cy="148" rx="7" ry="4.4" fill="#ff8aa1"/>`;
    if (tipo === "explica") return `<path d="M90 136 Q100 152 110 136 Z" fill="#5b1f2e" stroke="${PRETO}" stroke-width="3" stroke-linejoin="round"/>`;
    if (tipo === "uau") return `<ellipse cx="100" cy="143" rx="7" ry="9" fill="#5b1f2e" stroke="${PRETO}" stroke-width="3"/>`;
    if (tipo === "pensa") return sorriso("M91 141 Q101 136 110 141");
    return sorriso("M89 136 Q100 148 111 136");
  }
  function extras(tipo) {
    if (tipo === "uau") return estrela(24, 36, 1.1) + estrela(180, 30, 1.3) + estrela(186, 96, 0.8) + estrela(14, 98, 0.7);
    if (tipo === "pensa") return `<g class="p-pensa"><circle cx="170" cy="46" r="3.4" fill="${ACC}"/><circle cx="181" cy="34" r="4.6" fill="${ACC}"/><text x="186" y="20" font-family="Bricolage Grotesque, system-ui, sans-serif" font-size="26" font-weight="800" fill="${ACC}" text-anchor="middle">?</text></g>`;
    return "";
  }
  function panda(tipo) {
    const pata = tipo === "explica"
      ? `<g class="p-pata" style="transform-origin:168px 178px"><ellipse cx="176" cy="140" rx="13.5" ry="27" transform="rotate(24 176 140)" fill="${PRETO}"/><ellipse cx="170" cy="118" rx="6" ry="5" transform="rotate(24 170 118)" fill="#3b3963"/></g>`
      : `<ellipse cx="170" cy="182" rx="15" ry="25" transform="rotate(10 170 182)" fill="${PRETO}"/>`;
    const brow = tipo === "pensa"
      ? `<path d="M52 82 q12 -8 24 -2" stroke="${PRETO}" stroke-width="0"/><path d="M118 80 q12 -7 24 1" stroke="#fffdf8" stroke-width="3.4" stroke-linecap="round" fill="none"/>`
      : tipo === "uau" ? `<path d="M56 76 q11 -7 22 -1 M122 75 q11 -6 22 1" stroke="${BRANCO}" stroke-width="3.2" stroke-linecap="round" fill="none"/>` : "";
    const rubor = tipo === "feliz" ? 0.75 : 0.5;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none" role="img" aria-hidden="true">
  <g class="p-corpo">
    <path d="M22 200 C22 160 58 147 100 147 C142 147 178 160 178 200 Z" fill="${ACC}"/>
    <path d="M70 150 q30 18 60 0 l0 10 q-30 18 -60 0Z" fill="${BRANCO}" opacity="0.92"/>
    <ellipse cx="30" cy="182" rx="15" ry="25" transform="rotate(-10 30 182)" fill="${PRETO}"/>
    ${pata}
  </g>
  <g class="p-cabeca">
    <circle cx="38" cy="58" r="23" fill="${PRETO}"/><circle cx="162" cy="58" r="23" fill="${PRETO}"/>
    <circle cx="40" cy="60" r="10" fill="#4a4770"/><circle cx="160" cy="60" r="10" fill="#4a4770"/>
    <ellipse cx="100" cy="108" rx="72" ry="62" fill="${BRANCO}" stroke="${PRETO}" stroke-width="3.5"/>
    <ellipse cx="67" cy="104" rx="16" ry="21.5" transform="rotate(20 67 104)" fill="${PRETO}"/>
    <ellipse cx="133" cy="104" rx="16" ry="21.5" transform="rotate(-20 133 104)" fill="${PRETO}"/>
    <g class="p-olhos">${olho(68, 103, tipo)}${olho(132, 103, tipo)}</g>
    ${brow}
    <ellipse cx="50" cy="132" rx="10" ry="6" fill="#ff8aa1" opacity="${rubor}"/><ellipse cx="150" cy="132" rx="10" ry="6" fill="#ff8aa1" opacity="${rubor}"/>
    <path d="M91 124 Q100 117 109 124 Q109 131 100 132 Q91 131 91 124Z" fill="${PRETO}"/>
    <path d="M100 132 V136" stroke="${PRETO}" stroke-width="3" stroke-linecap="round"/>
    ${boca(tipo)}
    <g stroke="#f2b632" stroke-width="3.2" fill="none"><circle cx="68" cy="103" r="22"/><circle cx="132" cy="103" r="22"/><path d="M90 100 q10 -7 20 0" stroke-linecap="round"/></g>
    <path d="M60 52 L60 72 Q100 92 140 72 L140 52 Z" fill="#2c2a4a"/>
    <polygon points="100,8 164,31 100,54 36,31" fill="${PRETO}" stroke="#4a4770" stroke-width="2" stroke-linejoin="round"/>
    <circle cx="100" cy="31" r="4" fill="${ACC}"/>
    <path class="p-borla" d="M100 31 L150 38 L150 64" stroke="${ACC}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <circle class="p-borla" cx="150" cy="67" r="5.5" fill="${ACC}"/>
  </g>
  ${extras(tipo)}
</svg>`;
  }
  window.MASCOTE = { padrao: panda("padrao"), explica: panda("explica"), feliz: panda("feliz"), uau: panda("uau"), pensa: panda("pensa") };
})();
