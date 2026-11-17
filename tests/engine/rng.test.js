import { test } from 'node:test';
import assert from 'node:assert/strict';
import { criarRng } from '../../src/engine/rng.js';

const amostra = (rng, n) => Array.from({ length: n }, () => rng());

test('mesma semente gera a mesma sequência', () => {
  assert.deepEqual(amostra(criarRng(123), 5), amostra(criarRng(123), 5));
});

test('sementes diferentes geram sequências diferentes', () => {
  assert.notDeepEqual(amostra(criarRng(1), 5), amostra(criarRng(2), 5));
});

test('valores ficam no intervalo [0, 1)', () => {
  for (const v of amostra(criarRng(99), 1000)) {
    assert.ok(v >= 0 && v < 1, `fora do intervalo: ${v}`);
  }
});
