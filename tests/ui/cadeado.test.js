import { test } from 'node:test';
import assert from 'node:assert/strict';
import { criarCadeado } from '../../src/ui/cadeado.js';

const digitarTudo = (c, texto) => [...texto].forEach((d) => c.digitar(d));

test('cadeado vazio não tem valor', () => {
  const c = criarCadeado();
  assert.equal(c.valor(), null);
  assert.equal(c.texto(), '');
});

test('digitar compõe o número', () => {
  const c = criarCadeado();
  digitarTudo(c, '120');
  assert.equal(c.texto(), '120');
  assert.equal(c.valor(), 120);
});

test('zero à esquerda é substituído pelo próximo algarismo', () => {
  const c = criarCadeado();
  digitarTudo(c, '07');
  assert.equal(c.texto(), '7');
});

test('ignora teclas que não são algarismos', () => {
  const c = criarCadeado();
  digitarTudo(c, '1a-2');
  assert.equal(c.texto(), '12');
});

test('respeita o máximo de dígitos', () => {
  const c = criarCadeado(3);
  digitarTudo(c, '12345');
  assert.equal(c.texto(), '123');
});

test('apagar remove o último algarismo e limpar zera tudo', () => {
  const c = criarCadeado();
  digitarTudo(c, '456');
  c.apagar();
  assert.equal(c.valor(), 45);
  c.limpar();
  assert.equal(c.valor(), null);
});
