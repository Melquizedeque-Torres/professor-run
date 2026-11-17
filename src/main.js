import { FASES, TEMPO_LIMITE_S, MAX_ERROS } from './config.js';
import { agruparPorFase } from './engine/banco.js';
import { criarJogo } from './engine/game.js';
import { INTRO, ENTRADAS, VITORIA, DERROTA } from './narrativa.js';
import { mostrarTela, mostrarHistoria } from './ui/telas.js';
import { atualizarHud } from './ui/hud.js';
import { renderizarSala } from './ui/sala.js';
import { abrirEnigma, fecharEnigma } from './ui/enigma.js';
import { mostrarFeedback } from './ui/feedback.js';
import { formatarTempo } from './ui/formatos.js';
import { tempoLimiteDaUrl } from './ui/parametros.js';
import { tocar, iniciarMusica, pararMusica, alternarMudo, estaMudo } from './audio/audio.js';

const tempoLimite = tempoLimiteDaUrl(location.search, TEMPO_LIMITE_S);
let bancoPorFase = null;
let jogo = null;
let relogio = null;
let pausado = true;

async function carregarBanco() {
  const resposta = await fetch('data/questoes.json');
  if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
  return agruparPorFase(await resposta.json(), FASES.length);
}

async function novaPartida() {
  clearInterval(relogio);
  jogo = criarJogo({ fases: FASES, bancoPorFase, tempoLimiteS: tempoLimite, maxErros: MAX_ERROS, rng: Math.random });
  pausado = true;
  await mostrarHistoria({ ...INTRO, botao: 'Procurar a saída' });
  iniciarRelogio();
  await entrarNaSala();
}

async function entrarNaSala() {
  pausado = true;
  const { fase } = jogo.estado();
  await mostrarHistoria({ ...ENTRADAS[fase.numero], botao: 'Entrar' });
  iniciarMusica(fase.numero);
  mostrarTela('tela-sala');
  desenharSala();
  pausado = false;
}

function desenharSala() {
  const e = jogo.estado();
  atualizarHud(e);
  renderizarSala(document.getElementById('cena'), e, {
    aoClicarObjeto: abrirObjeto,
    aoClicarFerramenta: () => {},
  });
}

function abrirObjeto(objeto) {
  tocar('clique');
  abrirEnigma({ questao: jogo.estado().questaoAtual, objeto, aoEnviar: enviarResposta });
}

function animar(el, classe) {
  el.classList.remove(classe);
  void el.offsetWidth;
  el.classList.add(classe);
}

async function enviarResposta(valor) {
  const r = jogo.responder(valor);
  const e = jogo.estado();
  if (r.correta) {
    tocar('tranca');
    tocar('acerto');
  } else {
    tocar('erro');
    animar(document.getElementById('cena'), 'tremer');
    if (e.status === 'jogando' && e.erros >= MAX_ERROS - 2) tocar('alarme');
  }
  if (r.status === 'jogando' && !r.avancouFase) desenharSala();
  else atualizarHud(e);

  pausado = true; // o relógio não corre enquanto a resolução está aberta
  await mostrarFeedback({ correta: r.correta, questao: r.questao });
  if (r.status !== 'jogando') return finalizar(r.status);
  if (r.avancouFase) {
    tocar('fase');
    await transicao();
    await entrarNaSala();
    return;
  }
  pausado = false;
}

function transicao() {
  return new Promise((resolve) => {
    const veu = document.getElementById('transicao');
    veu.classList.add('ativa');
    setTimeout(() => {
      veu.classList.remove('ativa');
      resolve();
    }, 900);
  });
}

function iniciarRelogio() {
  clearInterval(relogio);
  relogio = setInterval(() => {
    if (pausado || !jogo) return;
    jogo.tick(1);
    const e = jogo.estado();
    if (e.status === 'derrota') {
      finalizar('derrota');
      return;
    }
    atualizarHud(e);
  }, 1000);
}

function finalizar(resultado) {
  clearInterval(relogio);
  pausado = true;
  pararMusica();
  fecharEnigma();
  document.querySelectorAll('.modal').forEach((m) => m.classList.add('oculto'));
  const e = jogo.estado();
  const usado = formatarTempo(tempoLimite - e.tempoRestanteS);
  if (resultado === 'vitoria') {
    tocar('vitoria');
    document.getElementById('vitoria-texto').textContent = VITORIA.texto;
    document.getElementById('vitoria-stats').textContent =
      `Tempo: ${usado} · Erros: ${e.erros}/${e.maxErros} · Acertos: ${e.acertosTotal}/${e.totalNecessario}`;
    mostrarTela('tela-vitoria');
  } else {
    tocar('derrota');
    const d = DERROTA[e.motivoDerrota];
    document.getElementById('derrota-titulo').textContent = d.titulo;
    document.getElementById('derrota-texto').textContent = d.texto;
    document.getElementById('derrota-stats').textContent =
      `Chegou à fase ${e.fase.numero} (${e.fase.sala}) · Acertos: ${e.acertosTotal}/${e.totalNecessario} · Erros: ${e.erros}`;
    mostrarTela('tela-derrota');
  }
}

async function iniciar() {
  const btnSom = document.getElementById('btn-som');
  const rotularSom = () => { btnSom.textContent = estaMudo() ? '🔇' : '🔊'; };
  rotularSom();
  btnSom.addEventListener('click', () => { alternarMudo(); rotularSom(); });
  document.getElementById('btn-como-jogar').addEventListener('click', () => {
    document.getElementById('como-jogar').classList.toggle('oculto');
  });
  document.querySelectorAll('.btn-nova-partida').forEach((b) => b.addEventListener('click', () => {
    tocar('clique');
    novaPartida();
  }));

  const btnComecar = document.getElementById('btn-comecar');
  try {
    bancoPorFase = await carregarBanco();
  } catch (erro) {
    btnComecar.disabled = true;
    document.getElementById('erro-carga').textContent =
      `Não foi possível carregar as questões (${erro.message}). Abra o jogo por um servidor HTTP (npm run dev).`;
    return;
  }
  btnComecar.addEventListener('click', () => {
    tocar('clique');
    novaPartida();
  });
}

iniciar();
