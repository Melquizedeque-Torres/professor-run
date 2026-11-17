import { test } from 'node:test';
import assert from 'node:assert/strict';
import { binomial, linhaPascal, conferirLinha } from '../../src/engine/pascal.js';

test('binomial confere com valores calculados à mão', () => {
  assert.equal(binomial(0, 0), 1);
  assert.equal(binomial(5, 2), 10);
  assert.equal(binomial(10, 4), 210);
  assert.equal(binomial(12, 5), 792);
});

test('binomial fora do triângulo vale 0', () => {
  assert.equal(binomial(5, 7), 0);
  assert.equal(binomial(5, -1), 0);
});

test('memoização permite valores grandes rapidamente', () => {
  assert.equal(binomial(30, 15), 155117520);
});

test('linhaPascal devolve a linha completa', () => {
  assert.deepEqual(linhaPascal(0), [1]);
  assert.deepEqual(linhaPascal(4), [1, 4, 6, 4, 1]);
});

test('conferirLinha marca cada célula como certa ou errada', () => {
  assert.deepEqual(conferirLinha(4, [1, 4, 5, 4, 1]), [true, true, false, true, true]);
});
