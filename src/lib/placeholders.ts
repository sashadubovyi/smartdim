// Self-contained SVG placeholder images encoded as data URIs.
// Using inline SVG keeps the seed data offline-friendly, dependency-free and
// weightless — no external image requests on first paint.

function svg(bg1: string, bg2: string, glyph: string, label: string): string {
  const markup = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='800' viewBox='0 0 800 800'>
  <defs>
    <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0' stop-color='${bg1}'/>
      <stop offset='1' stop-color='${bg2}'/>
    </linearGradient>
  </defs>
  <rect width='800' height='800' fill='${bg1}'/>
  <circle cx='400' cy='360' r='250' fill='url(#g)'/>
  <g fill='#ffffff' fill-opacity='0.92' transform='translate(400 360)'>
    ${glyph}
  </g>
  <text x='400' y='690' font-family='Manrope, Arial, sans-serif' font-size='46' font-weight='700' fill='#2f4d44' text-anchor='middle'>${label}</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(markup)}`;
}

const glyphs = {
  bulb: `<path transform='translate(-90 -120) scale(7.5)' d='M12 2a7 7 0 0 0-4 12.7V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.3A7 7 0 0 0 12 2Z'/><rect x='-35' y='95' width='70' height='22' rx='11'/><rect x='-28' y='128' width='56' height='20' rx='10'/>`,
  plug: `<path transform='translate(-70 -90) scale(6)' d='M6 4v6a6 6 0 0 0 12 0V4h-3v6a3 3 0 0 1-6 0V4H6Z'/><rect x='-15' y='40' width='30' height='90' rx='15'/>`,
  camera: `<rect x='-150' y='-90' width='300' height='190' rx='40'/><circle cx='0' cy='5' r='70' fill='#2f4d44'/><circle cx='0' cy='5' r='40' fill='#ffffff'/><rect x='90' y='-60' width='40' height='24' rx='8' fill='#2f4d44'/>`,
  speaker: `<rect x='-110' y='-150' width='220' height='300' rx='60'/><circle cx='0' cy='-60' r='45' fill='#2f4d44'/><circle cx='0' cy='80' r='70' fill='#2f4d44'/><circle cx='0' cy='80' r='38' fill='#ffffff'/>`,
  thermostat: `<circle cx='0' cy='0' r='150'/><circle cx='0' cy='0' r='100' fill='#2f4d44'/><text x='0' y='30' font-family='Manrope, Arial' font-size='90' font-weight='800' fill='#ffffff' text-anchor='middle'>21°</text>`,
  lock: `<rect x='-110' y='-30' width='220' height='170' rx='36'/><path d='M-70 -30 v-40 a70 70 0 0 1 140 0 v40' fill='none' stroke='#ffffff' stroke-width='30'/><circle cx='0' cy='45' r='26' fill='#2f4d44'/>`,
};

export const PLACEHOLDERS = {
  bulb: svg('#dbeadb', '#3a6154', glyphs.bulb, 'smartdim'),
  bulb2: svg('#e3f0e6', '#457566', glyphs.bulb, 'smartdim'),
  plug: svg('#dde9e2', '#3a6154', glyphs.plug, 'smartdim'),
  camera: svg('#d9e7e0', '#2f4d44', glyphs.camera, 'smartdim'),
  speaker: svg('#e0ebe2', '#457566', glyphs.speaker, 'smartdim'),
  thermostat: svg('#dce9e1', '#3a6154', glyphs.thermostat, 'smartdim'),
  lock: svg('#dbe8e1', '#2f4d44', glyphs.lock, 'smartdim'),
};

export const EMPTY_IMAGE = svg('#eef4f1', '#cfe9c6', glyphs.bulb, 'smartdim');
