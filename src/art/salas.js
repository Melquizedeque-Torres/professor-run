// Cenários SVG autorais (viewBox 0 0 800 450). A faixa x 650–760 fica livre
// para a porta com as trancas, desenhada por src/ui/sala.js.
const parede = (cor) => `<rect width="800" height="330" fill="${cor}"/>`;
const chao = (cor) => `<rect y="330" width="800" height="120" fill="${cor}"/><rect y="326" width="800" height="6" fill="#000" opacity=".35"/>`;
const rotulo = (texto, x, y) => `<text x="${x}" y="${y}" class="rotulo-svg" text-anchor="middle">${texto}</text>`;
const janela = (x, y) => `<g transform="translate(${x} ${y})"><rect width="110" height="90" fill="#0b1630" stroke="#6b6f86" stroke-width="6"/><circle cx="78" cy="28" r="11" fill="#f4f1c9"/><line x1="55" y1="0" x2="55" y2="90" stroke="#6b6f86" stroke-width="4"/><line x1="0" y1="45" x2="110" y2="45" stroke="#6b6f86" stroke-width="4"/></g>`;
const relogioParede = (x, y) => `<g transform="translate(${x} ${y})"><circle r="26" fill="#f5f5f5" stroke="#333" stroke-width="4"/><line x2="0" y2="-16" stroke="#333" stroke-width="3"/><line x2="13" y2="6" stroke="#c0392b" stroke-width="3"/></g>`;
const carteira = (x) => `<g transform="translate(${x} 300)"><rect width="90" height="12" fill="#8b5a2b"/><rect x="8" y="12" width="6" height="40" fill="#5b3a1a"/><rect x="76" y="12" width="6" height="40" fill="#5b3a1a"/></g>`;
const CORES_LIVROS = ['#c0392b', '#2980b9', '#27ae60', '#f39c12', '#8e44ad', '#16a085', '#d35400'];
const estante = (x) => `<g transform="translate(${x} 40)"><rect width="150" height="290" fill="#5b3a22"/>${[0, 1, 2, 3]
  .map((i) => `<rect x="8" y="${10 + i * 70}" width="134" height="60" fill="#3a2414"/>${[0, 1, 2, 3, 4, 5, 6]
    .map((j) => `<rect x="${12 + j * 18}" y="${18 + i * 70}" width="14" height="52" fill="${CORES_LIVROS[(i + j) % 7]}"/>`).join('')}`)
  .join('')}</g>`;
const mesa = (x, y, w) => `<g transform="translate(${x} ${y})"><rect width="${w}" height="14" fill="#7a5230"/><rect x="10" y="14" width="8" height="${330 - y + 30}" fill="#4d331d"/><rect x="${w - 18}" y="14" width="8" height="${330 - y + 30}" fill="#4d331d"/></g>`;
const monitor = `<rect width="130" height="90" rx="6" fill="#222" stroke="#555" stroke-width="4"/><rect x="10" y="10" width="110" height="64" fill="#0b1a10"/><text x="18" y="40" fill="#4ade80" font-family="monospace" font-size="14">&gt; senha_</text><rect x="55" y="90" width="20" height="20" fill="#444"/><rect x="30" y="108" width="70" height="8" fill="#555"/>`;
const painelCofre = (letra) => `<rect width="240" height="105" rx="8" fill="#2c3e50" stroke="#95a5a6" stroke-width="4"/><circle cx="55" cy="52" r="30" fill="#7f8c8d" stroke="#bdc3c7" stroke-width="4"/><line x1="55" y1="52" x2="55" y2="28" stroke="#ecf0f1" stroke-width="4"/>${rotulo(`Painel ${letra}`, 160, 58)}`;

export const SALAS = {
  1: {
    fundo: parede('#34395a') + chao('#3b2c20') + janela(40, 60) + relogioParede(570, 70) + carteira(70) + carteira(210) + carteira(350) + carteira(490),
    objetos: [
      { id: 'lousa', nome: 'Lousa do professor', x: 200, y: 50,
        desenho: `<rect width="300" height="160" rx="4" fill="#1f4d3a" stroke="#8b5a2b" stroke-width="10"/><text x="24" y="60" class="giz">n! = n·(n−1)!</text><text x="24" y="110" class="giz">P.F.C.</text>${rotulo('Lousa', 150, 185)}` },
    ],
  },
  2: {
    fundo: parede('#4a3426') + chao('#2a1d14') + estante(20) + estante(480),
    objetos: [
      { id: 'livro-antigo', nome: 'Livro antigo no atril', x: 200, y: 170,
        desenho: `<rect x="40" y="70" width="40" height="90" fill="#6d4c2f"/><path d="M0 70 L60 48 L120 70 L60 88 Z" fill="#f3e9d2" stroke="#8b6b45" stroke-width="3"/>${rotulo('Livro antigo', 60, 180)}` },
      { id: 'fichario', nome: 'Fichário da biblioteca', x: 350, y: 160,
        desenho: `<rect width="100" height="150" fill="#7f8c8d" stroke="#2c3e50" stroke-width="3"/>${[0, 1, 2].map((i) => `<rect x="10" y="${12 + i * 46}" width="80" height="36" fill="#95a5a6" stroke="#2c3e50"/><rect x="40" y="${26 + i * 46}" width="20" height="6" fill="#2c3e50"/>`).join('')}${rotulo('Fichário', 50, 170)}` },
    ],
  },
  3: {
    fundo: parede('#1e2a38') + chao('#2b2f36') + mesa(30, 270, 400),
    objetos: [
      { id: 'computador', nome: 'Computador do laboratório', x: 60, y: 150, desenho: `${monitor}${rotulo('Computador', 65, 140)}` },
      { id: 'servidor', nome: 'Rack do servidor', x: 470, y: 110,
        desenho: `<rect width="100" height="215" rx="4" fill="#111" stroke="#444" stroke-width="3"/>${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="10" y="${12 + i * 33}" width="80" height="24" fill="#222"/><circle cx="78" cy="${24 + i * 33}" r="4" fill="${i % 2 ? '#4ade80' : '#f87171'}" class="selo-fechado"/>`).join('')}${rotulo('Servidor', 50, 235)}` },
    ],
    ferramenta: {
      id: 'pascal', nome: 'Quadro de Pascal (ferramenta)', x: 220, y: 40,
      desenho: `<rect width="210" height="150" rx="4" fill="#f5f5f0" stroke="#7f8c8d" stroke-width="6"/>${[['1'], ['1 1'], ['1 2 1'], ['1 3 3 1'], ['?  ?  ?  ?  ?']]
        .map(([t], i) => `<text x="105" y="${30 + i * 24}" text-anchor="middle" font-family="monospace" font-size="16" fill="#2c3e50">${t}</text>`).join('')}${rotulo('Quadro de Pascal', 105, 172)}`,
    },
  },
  4: {
    fundo: parede('#3d3a2f') + chao('#2e261c') + janela(530, 50) + mesa(40, 280, 260),
    objetos: [
      { id: 'cafeteira', nome: 'Cafeteira', x: 70, y: 200,
        desenho: `<rect width="70" height="80" rx="6" fill="#444"/><rect x="10" y="30" width="50" height="40" fill="#6b3e1f" opacity=".85"/><rect x="20" y="-12" width="30" height="12" fill="#222"/>${rotulo('Cafeteira', 35, 100)}` },
      { id: 'armario', nome: 'Armário de provas', x: 180, y: 70,
        desenho: `<rect width="120" height="210" fill="#6b5b3e" stroke="#3b3222" stroke-width="4"/><line x1="60" y1="0" x2="60" y2="210" stroke="#3b3222" stroke-width="3"/><circle cx="50" cy="105" r="4" fill="#ffcc4d"/><circle cx="70" cy="105" r="4" fill="#ffcc4d"/>${rotulo('Armário', 60, 230)}` },
      { id: 'mural', nome: 'Mural de avisos', x: 340, y: 60,
        desenho: `<rect width="160" height="110" fill="#b58b5a" stroke="#6b4f2f" stroke-width="6"/><rect x="15" y="15" width="50" height="40" fill="#fff8c4" transform="rotate(-4 40 35)"/><rect x="85" y="20" width="55" height="45" fill="#d6f5ff" transform="rotate(3 112 42)"/><rect x="40" y="62" width="60" height="38" fill="#ffd6e0"/>${rotulo('Mural', 80, 130)}` },
    ],
  },
  5: {
    fundo: parede('#1a1a24') + chao('#121218') + `<rect x="40" y="40" width="600" height="275" rx="14" fill="#3b4652" stroke="#95a5a6" stroke-width="6"/>`,
    objetos: [
      { id: 'painel-a', nome: 'Painel A do cofre', x: 70, y: 60, desenho: painelCofre('A') },
      { id: 'painel-b', nome: 'Painel B do cofre', x: 370, y: 60, desenho: painelCofre('B') },
      { id: 'painel-c', nome: 'Painel C do cofre', x: 70, y: 190, desenho: painelCofre('C') },
      { id: 'painel-d', nome: 'Painel D do cofre', x: 370, y: 190, desenho: painelCofre('D') },
    ],
  },
};
