// Relação de Stifel: C(n,k) = C(n-1,k-1) + C(n-1,k)
// Recursão com memoização: cada valor é calculado uma única vez.
const memo = new Map();

export function binomial(n, k) {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  const chave = `${n},${k}`;
  if (!memo.has(chave)) memo.set(chave, binomial(n - 1, k - 1) + binomial(n - 1, k));
  return memo.get(chave);
}

export function linhaPascal(n) {
  return Array.from({ length: n + 1 }, (_, k) => binomial(n, k));
}

export function conferirLinha(n, valores) {
  return linhaPascal(n).map((v, i) => valores[i] === v);
}
