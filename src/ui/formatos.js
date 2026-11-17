export function formatarTempo(segundos) {
  const s = Math.max(0, Math.floor(segundos));
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

export function formatarNumero(n) {
  return n.toLocaleString('pt-BR');
}
