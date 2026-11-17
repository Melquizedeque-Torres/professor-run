import { linhaPascal, conferirLinha } from '../engine/pascal.js';

const LINHA_MAXIMA = 10;
let linhaAlvo = 2; // as linhas 0 e 1 vêm prontas; o progresso vale para a partida inteira

export function abrirQuadroPascal() {
  const focoAnterior = document.activeElement;
  const m = document.getElementById('modal-pascal');
  const area = m.querySelector('#pascal-triangulo');

  const desenhar = () => {
    area.innerHTML = '';
    for (let n = 0; n < linhaAlvo; n++) {
      const linha = document.createElement('div');
      linha.className = 'linha-pascal';
      linha.innerHTML = linhaPascal(n).map((v) => `<span class="celula">${v}</span>`).join('');
      area.appendChild(linha);
    }
    const alvo = document.createElement('div');
    alvo.className = 'linha-pascal alvo';
    alvo.innerHTML = Array.from({ length: linhaAlvo + 1 }, (_, k) =>
      `<input class="celula" inputmode="numeric" maxlength="4" aria-label="C(${linhaAlvo}, ${k})">`).join('');
    area.appendChild(alvo);
    m.querySelector('#pascal-dica').textContent =
      `Complete a linha ${linhaAlvo}: cada número é a soma dos dois logo acima (relação de Stifel).`;
    alvo.querySelector('input').focus();
  };

  const conferir = m.querySelector('#btn-pascal-conferir');
  const fechar = () => {
    m.classList.add('oculto');
    if (focoAnterior && focoAnterior.isConnected) focoAnterior.focus();
  };
  const conferirLinhaAtual = () => {
    if (conferir.disabled) return;
    const entradas = [...area.querySelectorAll('.alvo input')];
    const resultado = conferirLinha(linhaAlvo, entradas.map((i) => Number(i.value)));
    entradas.forEach((inp, i) => {
      inp.classList.toggle('erro', !resultado[i]);
      inp.classList.toggle('certo', resultado[i]);
    });
    if (!resultado.every(Boolean)) return;
    conferir.disabled = true; // evita conferir a mesma linha duas vezes antes do redesenho
    if (linhaAlvo < LINHA_MAXIMA) {
      linhaAlvo += 1;
      setTimeout(() => { desenhar(); conferir.disabled = false; }, 400);
    } else {
      m.querySelector('#pascal-dica').textContent =
        `Linha ${LINHA_MAXIMA} completa! Você dominou a relação de Stifel: cada número é a soma dos dois acima.`;
    }
  };
  conferir.disabled = false;
  conferir.onclick = conferirLinhaAtual;
  m.onkeydown = (ev) => {
    if (ev.key === 'Escape') fechar();
    else if (ev.key === 'Enter' && ev.target.matches('input.celula')) {
      ev.preventDefault();
      conferirLinhaAtual();
    }
  };
  m.querySelector('#btn-pascal-fechar').onclick = fechar;
  desenhar();
  m.classList.remove('oculto');
}
