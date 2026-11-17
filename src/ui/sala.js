import { SALAS } from '../art/salas.js';

const SELO_FECHADO = '<g class="selo-fechado"><circle r="14" fill="#ffcc4d"/><text y="5" text-anchor="middle" font-size="14">🔒</text></g>';
const SELO_ABERTO = '<g><circle r="14" fill="#4ade80"/><text y="5" text-anchor="middle" font-size="14">🔓</text></g>';

const enigmaAberto = () => !document.getElementById('modal-enigma').classList.contains('oculto');

function ativar(el, acao) {
  el.addEventListener('click', () => {
    if (!enigmaAberto()) acao();
  });
  el.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      if (!enigmaAberto()) acao();
    }
  });
}

function porta(e) {
  const n = e.acertosNecessarios;
  const trancas = Array.from({ length: n }, (_, i) => {
    const y = 140 + i * Math.min(55, 190 / n);
    return `<g class="tranca${i < e.acertosFase ? ' aberta' : ''}" transform="translate(705 ${y})"><path class="haste" d="M-8 0 v-8 a8 8 0 0 1 16 0 v8"/><rect x="-14" y="0" width="28" height="22" rx="4"/></g>`;
  }).join('');
  return `<g class="porta"><rect class="porta-folha" x="660" y="110" width="90" height="260" rx="6"/><circle class="macaneta" cx="672" cy="250" r="5"/>${trancas}</g>`;
}

export function renderizarSala(cena, e, { aoClicarObjeto, aoClicarFerramenta }) {
  const sala = SALAS[e.fase.numero];
  const objetos = sala.objetos.slice(0, e.acertosNecessarios).map((o, i) => {
    const resolvido = i < e.acertosFase;
    return `<g class="objeto${resolvido ? ' resolvido' : ''}" data-indice="${i}" tabindex="${resolvido ? -1 : 0}" role="button"
      aria-label="${o.nome}${resolvido ? ' (resolvido)' : ''}" transform="translate(${o.x} ${o.y})">${o.desenho}${resolvido ? SELO_ABERTO : SELO_FECHADO}</g>`;
  }).join('');
  const f = sala.ferramenta;
  const ferramenta = f
    ? `<g class="objeto ferramenta" data-ferramenta="${f.id}" tabindex="0" role="button" aria-label="${f.nome}" transform="translate(${f.x} ${f.y})">${f.desenho}</g>`
    : '';
  cena.innerHTML = `<svg class="svg-sala" viewBox="0 0 800 450" role="group" aria-label="${e.fase.sala}">${sala.fundo}${porta(e)}${objetos}${ferramenta}</svg>`;
  cena.querySelectorAll('.objeto[data-indice]:not(.resolvido)').forEach((el) => {
    ativar(el, () => aoClicarObjeto(sala.objetos[Number(el.dataset.indice)]));
  });
  cena.querySelectorAll('.objeto[data-ferramenta]').forEach((el) => {
    ativar(el, () => aoClicarFerramenta(el.dataset.ferramenta));
  });
}
