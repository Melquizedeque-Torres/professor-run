import { test } from 'node:test';
import assert from 'node:assert/strict';
import { criarJogo } from '../../src/engine/game.js';
import { criarRng } from '../../src/engine/rng.js';
import { FASES } from '../../src/config.js';

const FASES_TESTE = [
  { numero: 1, nivel: 'Fácil', acertosNecessarios: 2, sala: 'Sala A' },
  { numero: 2, nivel: 'Difícil', acertosNecessarios: 1, sala: 'Sala B' },
];
const q = (id, resposta) => ({ id, resposta, enunciado: `Enunciado ${id}`, resolucao: ['passo', String(resposta)] });
const BANCO_TESTE = [
  [q('F1-01', 10), q('F1-02', 20), q('F1-03', 30)],
  [q('F2-01', 40), q('F2-02', 50)],
];
function novoJogo(opcoes = {}) {
  return criarJogo({
    fases: FASES_TESTE, bancoPorFase: BANCO_TESTE, tempoLimiteS: 100, maxErros: 3, rng: criarRng(42), ...opcoes,
  });
}
const acertar = (jogo) => jogo.responder(jogo.estado().questaoAtual.resposta);
const errar = (jogo) => jogo.responder(-1);

test('começa na fase 1, com questão do banco da fase 1 e tempo cheio', () => {
  const e = novoJogo().estado();
  assert.equal(e.status, 'jogando');
  assert.equal(e.fase.numero, 1);
  assert.equal(e.acertosTotal, 0);
  assert.equal(e.erros, 0);
  assert.equal(e.tempoRestanteS, 100);
  assert.equal(e.totalNecessario, 3);
  assert.ok(['F1-01', 'F1-02', 'F1-03'].includes(e.questaoAtual.id));
});

test('acerto soma 1 e permanece na fase enquanto a meta não é atingida', () => {
  const jogo = novoJogo();
  const r = acertar(jogo);
  const e = jogo.estado();
  assert.equal(r.correta, true);
  assert.equal(r.avancouFase, false);
  assert.equal(e.acertosFase, 1);
  assert.equal(e.acertosTotal, 1);
  assert.equal(e.fase.numero, 1);
});

test('atingir a meta avança de fase, zera os acertos da fase e sorteia do banco seguinte', () => {
  const jogo = novoJogo();
  acertar(jogo);
  const r = acertar(jogo);
  const e = jogo.estado();
  assert.equal(r.avancouFase, true);
  assert.equal(e.fase.numero, 2);
  assert.equal(e.acertosFase, 0);
  assert.equal(e.acertosTotal, 2);
  assert.ok(['F2-01', 'F2-02'].includes(e.questaoAtual.id));
});

test('erro soma 1 erro, mantém os acertos e traz outra questão da mesma fase', () => {
  const jogo = novoJogo();
  acertar(jogo);
  const anterior = jogo.estado().questaoAtual.id;
  const r = errar(jogo);
  const e = jogo.estado();
  assert.equal(r.correta, false);
  assert.equal(r.questao.id, anterior);
  assert.equal(e.erros, 1);
  assert.equal(e.acertosTotal, 1);
  assert.equal(e.fase.numero, 1);
  assert.notEqual(e.questaoAtual.id, anterior);
  assert.ok(e.questaoAtual.id.startsWith('F1-'));
});

test('não repete questão na fase enquanto houver inéditas', () => {
  const jogo = novoJogo({ maxErros: 99 });
  const vistas = [jogo.estado().questaoAtual.id];
  errar(jogo);
  vistas.push(jogo.estado().questaoAtual.id);
  errar(jogo);
  vistas.push(jogo.estado().questaoAtual.id);
  assert.deepEqual(vistas.sort(), ['F1-01', 'F1-02', 'F1-03']);
});

test('atingir o máximo de erros encerra com derrota por erros', () => {
  const jogo = novoJogo();
  errar(jogo);
  errar(jogo);
  assert.equal(jogo.estado().status, 'jogando');
  const r = errar(jogo);
  const e = jogo.estado();
  assert.equal(r.status, 'derrota');
  assert.equal(e.motivoDerrota, 'erros');
  assert.equal(e.questaoAtual, null);
});

test('concluir a última fase encerra com vitória', () => {
  const jogo = novoJogo();
  acertar(jogo);
  acertar(jogo);
  const r = acertar(jogo);
  assert.equal(r.status, 'vitoria');
  assert.equal(jogo.estado().status, 'vitoria');
  assert.equal(jogo.estado().questaoAtual, null);
});

test('com as fases oficiais, avança após 1, 3, 5 e 8 acertos e vence no 12º', () => {
  const banco = FASES.map((f) => [1, 2, 3, 4, 5].map((i) => q(`F${f.numero}-0${i}`, f.numero * 100 + i)));
  const jogo = criarJogo({ fases: FASES, bancoPorFase: banco, tempoLimiteS: 100, maxErros: 3, rng: criarRng(7) });
  const avancos = [];
  for (let i = 1; i <= 11; i++) {
    if (acertar(jogo).avancouFase) avancos.push(i);
  }
  assert.deepEqual(avancos, [1, 3, 5, 8]);
  assert.equal(jogo.estado().status, 'jogando');
  assert.equal(acertar(jogo).status, 'vitoria');
});

test('tick desconta o tempo, não fica negativo e zerar causa derrota por tempo', () => {
  const jogo = novoJogo();
  jogo.tick(30);
  assert.equal(jogo.estado().tempoRestanteS, 70);
  jogo.tick(500);
  const e = jogo.estado();
  assert.equal(e.tempoRestanteS, 0);
  assert.equal(e.status, 'derrota');
  assert.equal(e.motivoDerrota, 'tempo');
});

test('responder depois do fim da partida lança erro', () => {
  const jogo = novoJogo();
  jogo.tick(100);
  assert.throws(() => jogo.responder(10), /terminou/);
});

test('tick depois da vitória não altera o estado', () => {
  const jogo = novoJogo();
  acertar(jogo);
  acertar(jogo);
  acertar(jogo);
  jogo.tick(100);
  assert.equal(jogo.estado().status, 'vitoria');
  assert.equal(jogo.estado().tempoRestanteS, 100);
});

test('exige um banco de questões para cada fase', () => {
  assert.throws(
    () => criarJogo({ fases: FASES_TESTE, bancoPorFase: [BANCO_TESTE[0]], tempoLimiteS: 1, maxErros: 1, rng: criarRng(1) }),
    /banco/,
  );
});
