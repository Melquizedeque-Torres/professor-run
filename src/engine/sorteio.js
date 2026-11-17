// Embaralhamento de Fisher–Yates sobre uma cópia.
export function embaralhar(itens, rng) {
  const copia = [...itens];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// "Saco" de questões: entrega todas antes de repetir (regra 4 do PDF).
// Quando esgota, reembaralha evitando repetir de imediato a última.
export function criarSorteio(itens, rng) {
  if (itens.length === 0) throw new Error('Banco de questões vazio');
  let fila = embaralhar(itens, rng);
  let ultimo;
  return {
    proxima() {
      if (fila.length === 0) {
        fila = embaralhar(itens, rng);
        if (fila.length > 1 && fila[0] === ultimo) {
          [fila[0], fila[fila.length - 1]] = [fila[fila.length - 1], fila[0]];
        }
      }
      ultimo = fila.shift();
      return ultimo;
    },
  };
}
