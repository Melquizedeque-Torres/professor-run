import { test } from 'node:test';
import assert from 'node:assert/strict';
import { agruparPorFase } from '../../src/engine/banco.js';

test('agrupa as questões pela fase, preservando a ordem', () => {
  const grupos = agruparPorFase(
    [{ id: 'F2-01', fase: 2 }, { id: 'F1-01', fase: 1 }, { id: 'F2-02', fase: 2 }],
    2,
  );
  assert.deepEqual(grupos.map((g) => g.map((q) => q.id)), [['F1-01'], ['F2-01', 'F2-02']]);
});

test('rejeita questão com fase fora do intervalo, citando o id', () => {
  assert.throws(() => agruparPorFase([{ id: 'F1-01', fase: 1 }, { id: 'X-9', fase: 3 }], 2), /X-9/);
});

test('rejeita fase sem nenhuma questão', () => {
  assert.throws(() => agruparPorFase([{ id: 'F1-01', fase: 1 }], 2), /Fase 2/);
});
