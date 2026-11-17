import { criarCadeado } from './cadeado.js';
import { renderizarMatematica, escreverTexto } from './matematica.js';
import { tocar } from '../audio/audio.js';

let ouvinteTeclado = null;
const modal = () => document.getElementById('modal-enigma');

function sacudir(el) {
  el.classList.remove('tremer');
  void el.offsetWidth; // reinicia a animação
  el.classList.add('tremer');
}

export function fecharEnigma() {
  modal().classList.add('oculto');
  if (ouvinteTeclado) document.removeEventListener('keydown', ouvinteTeclado);
  ouvinteTeclado = null;
}

export function abrirEnigma({ questao, objeto, aoEnviar }) {
  fecharEnigma();
  const m = modal();
  const cadeado = criarCadeado(10);
  const visor = m.querySelector('#cadeado-visor');
  const enunciado = m.querySelector('#enigma-enunciado');
  m.querySelector('#enigma-objeto').textContent = objeto.nome;
  escreverTexto(enunciado, questao.enunciado);
  renderizarMatematica(enunciado);
  const atualizar = () => { visor.textContent = cadeado.texto() || '—'; };
  atualizar();

  const enviar = () => {
    const valor = cadeado.valor();
    if (valor === null) {
      sacudir(visor);
      return;
    }
    fecharEnigma();
    aoEnviar(valor);
  };
  const acao = (tecla) => {
    if (tecla === 'abrir') return enviar();
    if (/^[0-9]$/.test(tecla)) cadeado.digitar(tecla);
    else if (tecla === 'apagar') cadeado.apagar();
    else if (tecla === 'limpar') cadeado.limpar();
    tocar('clique');
    atualizar();
  };

  m.querySelector('#cadeado-teclas').onclick = (ev) => {
    const botao = ev.target.closest('button[data-tecla]');
    if (botao) acao(botao.dataset.tecla);
  };
  m.querySelector('#enigma-fechar').onclick = fecharEnigma;
  ouvinteTeclado = (ev) => {
    if (/^[0-9]$/.test(ev.key)) acao(ev.key);
    else if (ev.key === 'Backspace') acao('apagar');
    else if (ev.key === 'Enter') { ev.preventDefault(); acao('abrir'); }
    else if (ev.key === 'Escape') fecharEnigma();
  };
  document.addEventListener('keydown', ouvinteTeclado);
  m.classList.remove('oculto');
  const caixa = m.querySelector('.modal-caixa');
  caixa.tabIndex = -1;
  caixa.focus(); // tira o foco do objeto da sala, para Enter/Espaço não reabrirem o enigma
}
