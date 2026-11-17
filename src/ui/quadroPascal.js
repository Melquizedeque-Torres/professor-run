import { linhaPascal, conferirLinha } from '../engine/pascal.js';

const LINHA_MAXIMA = 10;
let linhaAlvo = 2; // as linhas 0 e 1 vêm prontas; o progresso vale para a partida inteira

export function abrirQuadroPascal() {
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

  m.querySelector('#btn-pascal-conferir').onclick = () => {
    const entradas = [...area.querySelectorAll('.alvo input')];
    const resultado = conferirLinha(linhaAlvo, entradas.map((i) => Number(i.value)));
    entradas.forEach((inp, i) => {
      inp.classList.toggle('erro', !resultado[i]);
      inp.classList.toggle('certo', resultado[i]);
    });
    if (resultado.every(Boolean) && linhaAlvo < LINHA_MAXIMA) {
      linhaAlvo += 1;
      setTimeout(desenhar, 400);
    }
  };
  m.querySelector('#btn-pascal-fechar').onclick = () => m.classList.add('oculto');
  desenhar();
  m.classList.remove('oculto');
}
