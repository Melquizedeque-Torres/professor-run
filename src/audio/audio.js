// Todo o som é sintetizado com Web Audio API: sem arquivos e sem questões de licença.
let ctx = null;
let mestre = null;
let mudo = lerMudo();
let musica = null;

function lerMudo() {
  try { return localStorage.getItem('pr-mudo') === '1'; } catch { return false; }
}
function salvarMudo() {
  try { localStorage.setItem('pr-mudo', mudo ? '1' : '0'); } catch { /* armazenamento indisponível */ }
}

function contexto() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    mestre = ctx.createGain();
    mestre.gain.value = mudo ? 0 : 1;
    mestre.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function nota(freq, inicio, dur, tipo = 'sine', vol = 0.15) {
  const c = contexto();
  if (!c) return;
  const osc = c.createOscillator();
  const ganho = c.createGain();
  osc.type = tipo;
  osc.frequency.value = freq;
  ganho.gain.setValueAtTime(0.0001, inicio);
  ganho.gain.exponentialRampToValueAtTime(vol, inicio + 0.02);
  ganho.gain.exponentialRampToValueAtTime(0.0001, inicio + dur);
  osc.connect(ganho).connect(mestre);
  osc.start(inicio);
  osc.stop(inicio + dur + 0.05);
}

// [frequência Hz, atraso s, duração s, forma de onda, volume]
const EFEITOS = {
  clique: [[880, 0, 0.05, 'square', 0.05]],
  acerto: [[523.25, 0, 0.15, 'triangle'], [659.25, 0.1, 0.15, 'triangle'], [783.99, 0.2, 0.3, 'triangle']],
  tranca: [[1400, 0, 0.04, 'square', 0.08], [900, 0.06, 0.08, 'square', 0.08]],
  erro: [[196, 0, 0.3, 'sawtooth', 0.12], [147, 0.18, 0.4, 'sawtooth', 0.12]],
  alarme: [[880, 0, 0.18, 'square', 0.08], [660, 0.2, 0.18, 'square', 0.08], [880, 0.4, 0.18, 'square', 0.08]],
  fase: [[392, 0, 0.2, 'triangle'], [523.25, 0.15, 0.2, 'triangle'], [659.25, 0.3, 0.2, 'triangle'], [1046.5, 0.45, 0.5, 'triangle']],
  vitoria: [[523.25, 0, 0.2, 'triangle'], [659.25, 0.15, 0.2, 'triangle'], [783.99, 0.3, 0.2, 'triangle'],
    [1046.5, 0.45, 0.6, 'triangle'], [783.99, 0.75, 0.2, 'triangle'], [1046.5, 0.9, 0.8, 'triangle']],
  derrota: [[392, 0, 0.4, 'sawtooth', 0.1], [349.23, 0.35, 0.4, 'sawtooth', 0.1], [311.13, 0.7, 0.4, 'sawtooth', 0.1], [261.63, 1.05, 0.9, 'sawtooth', 0.1]],
};

export function tocar(nome) {
  const c = contexto();
  if (!c) return;
  for (const [f, atraso, dur, tipo, vol] of EFEITOS[nome]) nota(f, c.currentTime + atraso, dur, tipo, vol);
}

// Música procedural: progressão Am–F–C–G. O andamento e as camadas crescem com a fase.
const ACORDES = [[220, 261.63, 329.63], [174.61, 220, 261.63], [261.63, 329.63, 392], [196, 246.94, 293.66]];

export function iniciarMusica(fase) {
  pararMusica();
  const c = contexto();
  if (!c) return;
  const batida = 60 / (64 + fase * 8);
  let passo = 0;
  const tocarBatida = () => {
    const t = c.currentTime + 0.05;
    const acorde = ACORDES[Math.floor(passo / 4) % ACORDES.length];
    if (passo % 4 === 0) acorde.forEach((f) => nota(f / 2, t, batida * 4, 'sine', 0.035));
    nota(acorde[0] / 4, t, batida * 0.9, 'triangle', 0.06);
    if (fase >= 3) nota(acorde[passo % 3] * 2, t, batida * 0.5, 'triangle', 0.025);
    if (fase >= 5) nota(acorde[(passo + 1) % 3] * 4, t + batida / 2, batida * 0.25, 'square', 0.012);
    passo += 1;
  };
  tocarBatida();
  musica = setInterval(tocarBatida, batida * 1000);
}

export function pararMusica() {
  if (musica) clearInterval(musica);
  musica = null;
}

export function alternarMudo() {
  mudo = !mudo;
  salvarMudo();
  if (mestre) mestre.gain.value = mudo ? 0 : 1;
  return mudo;
}

export function estaMudo() {
  return mudo;
}
