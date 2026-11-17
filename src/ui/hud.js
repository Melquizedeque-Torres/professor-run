import { formatarTempo } from './formatos.js';

export function atualizarHud(e) {
  if (e.fase) {
    document.getElementById('hud-sala').textContent = e.fase.sala;
    document.getElementById('hud-fase').textContent = `${e.fase.numero}/${e.totalFases} · ${e.fase.nivel}`;
    document.getElementById('hud-trancas').textContent =
      '🔓'.repeat(e.acertosFase) + '🔒'.repeat(e.acertosNecessarios - e.acertosFase);
  }
  document.getElementById('hud-acertos').textContent = `${e.acertosTotal}/${e.totalNecessario}`;
  const alarme = document.getElementById('hud-alarme');
  alarme.innerHTML = Array.from({ length: e.maxErros }, (_, i) => `<span class="nivel${i < e.erros ? ' ligado' : ''}"></span>`).join('');
  alarme.classList.toggle('critico', e.erros >= e.maxErros - 1);
  alarme.setAttribute('role', 'img');
  alarme.setAttribute('aria-label', `${e.erros} de ${e.maxErros} erros`);
  const relogio = document.getElementById('hud-relogio');
  relogio.textContent = formatarTempo(e.tempoRestanteS);
  relogio.classList.toggle('critico', e.tempoRestanteS <= 300);
}
