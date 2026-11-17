import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatarTempo, formatarNumero } from '../../src/ui/formatos.js';

test('formatarTempo usa mm:ss com zeros à esquerda', () => {
  assert.equal(formatarTempo(2400), '40:00');
  assert.equal(formatarTempo(65), '01:05');
  assert.equal(formatarTempo(0), '00:00');
});

test('formatarTempo nunca mostra tempo negativo nem fração', () => {
  assert.equal(formatarTempo(-3), '00:00');
  assert.equal(formatarTempo(59.9), '00:59');
});

test('formatarNumero usa ponto como separador de milhar', () => {
  assert.equal(formatarNumero(56), '56');
  assert.equal(formatarNumero(151200), '151.200');
  assert.equal(formatarNumero(676000), '676.000');
});
