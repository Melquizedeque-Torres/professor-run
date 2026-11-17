import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tempoLimiteDaUrl } from '../../src/ui/parametros.js';

test('usa ?tempo=SEGUNDOS quando válido (modo demonstração)', () => {
  assert.equal(tempoLimiteDaUrl('?tempo=10', 2400), 10);
});

test('cai no padrão quando ausente ou inválido', () => {
  for (const busca of ['', '?tempo=abc', '?tempo=0', '?tempo=99999', '?tempo=12.5', '?outro=5']) {
    assert.equal(tempoLimiteDaUrl(busca, 2400), 2400, busca);
  }
});
