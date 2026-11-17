// ?tempo=SEG encurta o relógio (1 a 3600 s) para demonstrações e testes.
export function tempoLimiteDaUrl(busca, padrao) {
  const valor = Number(new URLSearchParams(busca).get('tempo'));
  return Number.isInteger(valor) && valor >= 1 && valor <= 3600 ? valor : padrao;
}
