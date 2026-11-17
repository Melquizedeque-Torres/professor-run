import { formatarNumero } from './formatos.js';
import { aguardarClique } from './telas.js';
import { renderizarMatematica, escreverTexto } from './matematica.js';

export function mostrarFeedback({ correta, questao }) {
  const m = document.getElementById('modal-feedback');
  m.classList.toggle('correto', correta);
  m.classList.toggle('errado', !correta);
  m.querySelector('#feedback-titulo').textContent = correta ? 'Tranca aberta!' : 'Código incorreto: o alarme subiu!';
  m.querySelector('#feedback-resposta').textContent = `Código correto: ${formatarNumero(questao.resposta)}`;
  const lista = m.querySelector('#feedback-resolucao');
  lista.innerHTML = '';
  for (const passo of questao.resolucao) {
    const item = document.createElement('li');
    escreverTexto(item, passo);
    lista.appendChild(item);
  }
  renderizarMatematica(lista);
  m.querySelector('#feedback-detalhes').open = !correta; // no erro, a resolução já vem aberta
  m.classList.remove('oculto');
  const botao = m.querySelector('#btn-feedback');
  botao.focus();
  return aguardarClique(botao).then(() => m.classList.add('oculto'));
}
