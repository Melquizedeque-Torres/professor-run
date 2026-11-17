import { test } from 'node:test';
import assert from 'node:assert/strict';
import { criarSorteio, embaralhar } from '../../src/engine/sorteio.js';
import { criarRng } from '../../src/engine/rng.js';

const tirar = (sorteio, n) => Array.from({ length: n }, () => sorteio.proxima());

test('entrega todas as questões antes de repetir alguma', () => {
  const sorteio = criarSorteio(['a', 'b', 'c', 'd', 'e'], criarRng(1));
  assert.deepEqual(tirar(sorteio, 5).sort(), ['a', 'b', 'c', 'd', 'e']);
});

test('depois de esgotar, recomeça entregando o banco inteiro de novo', () => {
  const sorteio = criarSorteio(['a', 'b', 'c'], criarRng(2));
  const seis = tirar(sorteio, 6);
  assert.deepEqual(seis.slice(3).sort(), ['a', 'b', 'c']);
});

test('ao reembaralhar, nunca repete imediatamente a última questão', () => {
  for (let semente = 1; semente <= 300; semente++) {
    const seq = tirar(criarSorteio([1, 2, 3], criarRng(semente)), 9);
    for (let i = 1; i < seq.length; i++) {
      assert.notEqual(seq[i], seq[i - 1], `semente ${semente}: ${seq.join(',')}`);
    }
  }
});

test('a ordem do sorteio varia com a semente (é aleatória)', () => {
  const ordens = new Set();
  for (let semente = 1; semente <= 20; semente++) {
    ordens.add(tirar(criarSorteio(['a', 'b', 'c', 'd', 'e'], criarRng(semente)), 5).join(''));
  }
  assert.ok(ordens.size > 1);
});

test('embaralhar não altera a lista original', () => {
  const original = [1, 2, 3, 4];
  embaralhar(original, criarRng(5));
  assert.deepEqual(original, [1, 2, 3, 4]);
});

test('banco vazio é rejeitado', () => {
  assert.throws(() => criarSorteio([], criarRng(1)), /vazio/);
});
