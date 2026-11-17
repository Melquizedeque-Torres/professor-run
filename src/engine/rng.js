// Gerador pseudoaleatório com semente (algoritmo mulberry32).
// Em produção o jogo usa Math.random; nos testes, uma semente fixa
// torna o sorteio reproduzível.
export function criarRng(semente) {
  let a = semente >>> 0;
  return function rng() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
