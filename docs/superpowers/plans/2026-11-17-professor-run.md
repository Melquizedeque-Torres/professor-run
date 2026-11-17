# Professor Run — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir o jogo web *Professor Run* (Escape Room de Análise Combinatória, 5 fases, 12 acertos) com banco de 75 questões verificadas por fórmula e força bruta, publicado no GitHub Pages.

**Architecture:** Lógica pura em ES modules (motor, sorteio, Pascal, cadeado), testada com `node --test`; camada fina de DOM/SVG/Web Audio orquestrada por `src/main.js`. Ferramentas matemáticas em Python (só biblioteca padrão) verificam o banco `data/questoes.json` e geram `docs/BANCO_DE_QUESTOES.md`.

**Tech Stack:** HTML5, CSS3, JavaScript ES2022 (sem build, sem npm deps), KaTeX 0.16.11 (CDN jsDelivr), Web Audio API, Node 24 (`node --test`), Python 3.13 (`unittest`), Git, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-11-17-professor-run-design.md`

## Global Constraints

- Zero dependências instaladas: nada de `npm install` nem `pip install`. Testes JS com `node --test`; testes Python com `python -m unittest`.
- Node ≥ 18 (ambiente atual: 24.19.0). Python ≥ 3.10 (ambiente atual: 3.13.15).
- Identificadores, textos de UI e mensagens em **português do Brasil**.
- `FASES`: (1, Fácil, 1 acerto, Sala de Aula), (2, Básico, 2, Biblioteca), (3, Intermediário, 2, Laboratório de Informática), (4, Avançado, 3, Sala dos Professores), (5, Difícil, 4, Cofre da Diretoria). Total = 12 acertos.
- `TEMPO_LIMITE_S = 2400` (40 min); `MAX_ERROS = 6`.
- Respostas inteiras de 1 a 9.999.999.999 (cadeado de 10 dígitos).
- KaTeX somente em `https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/...`.
- Arte 100% autoral (SVG em código). Sem assets de terceiros.
- Mensagens de commit terminam com a linha `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- **Nunca** criar repositório remoto, dar push ou publicar sem confirmação explícita do usuário (Task 11).
- TDD (superpowers:test-driven-development) em toda lógica. Exceções (sujeitas à aprovação do usuário antes da execução): conteúdo de dados (`questoes.json`, validado pelo verificador), DOM/arte/áudio (validados por roteiro no navegador), arquivos de configuração.

## Mapa de arquivos

| Arquivo | Responsabilidade | Task |
|---|---|---|
| `package.json`, `.gitignore` | scripts de teste/servidor | 1 |
| `src/engine/rng.js` | RNG com semente (mulberry32) | 1 |
| `src/engine/sorteio.js` | saco embaralhado sem repetição | 1 |
| `src/engine/banco.js` | `agruparPorFase` | 1 |
| `src/config.js` | `FASES`, `TEMPO_LIMITE_S`, `MAX_ERROS` | 2 |
| `src/engine/game.js` | máquina de estados da partida | 2 |
| `src/engine/pascal.js` | Stifel recursivo + memo | 3 |
| `src/ui/cadeado.js` | estado do teclado numérico | 3 |
| `src/ui/formatos.js` | `formatarTempo`, `formatarNumero` | 3 |
| `src/ui/parametros.js` | `tempoLimiteDaUrl` (modo demonstração) | 3 |
| `tools/combinatoria.py` | fórmulas + recorrências recursivas | 4 |
| `tools/forca_bruta.py` | enumeração por questão | 5 |
| `tools/verificar_banco.py` | validação completa do banco | 5 |
| `data/questoes.json` | 75 questões | 6 |
| `tools/gerar_banco.py`, `docs/BANCO_DE_QUESTOES.md` | documento de entrega | 7 |
| `index.html`, `css/style.css`, `src/narrativa.js`, `src/art/salas.js`, `src/audio/audio.js`, `src/ui/{telas,hud,sala,enigma,feedback,matematica}.js`, `src/main.js`, `.claude/launch.json` | interface jogável | 8 |
| `src/ui/quadroPascal.js` (+ edições) | ferramenta da Sala 3 | 9 |
| ajustes de polimento | verificação ponta a ponta | 10 |
| `README.md` | documentação e publicação | 11 |

**Dependências entre tasks:** 1 → 2 → 3 (JS) e 4 → 5 → 6 → 7 (Python) são cadeias independentes. A Task 8 precisa de 1–3 e 6. A 9 precisa da 8, a 10 de todas, e a 11 vem por último.

---

### Task 1: Fundação do repositório + RNG + sorteio + agrupamento do banco

**Files:**
- Create: `package.json`, `.gitignore`
- Create: `src/engine/rng.js`, `src/engine/sorteio.js`, `src/engine/banco.js`
- Test: `tests/engine/rng.test.js`, `tests/engine/sorteio.test.js`, `tests/engine/banco.test.js`

**Interfaces:**
- Consumes: nada.
- Produces:
  - `criarRng(semente: number): () => number` (valores em [0, 1))
  - `embaralhar<T>(itens: T[], rng): T[]` (cópia embaralhada)
  - `criarSorteio<T>(itens: T[], rng): { proxima(): T }`. Lança `Error('Banco de questões vazio')` se `itens` vazio.
  - `agruparPorFase(questoes: {id:string, fase:number}[], totalFases: number): Array<Array<questao>>`

- [ ] **Step 1: Inicializar o repositório e os arquivos de projeto**

```bash
cd "/c/Users/mellq/OneDrive/Área de Trabalho/professor run"
git init -b main
```

`package.json`:
```json
{
  "name": "professor-run",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "description": "Escape Room de Análise Combinatória",
  "scripts": {
    "test": "node --test \"tests/**/*.test.js\"",
    "test:py": "python -m unittest discover -s tools -v",
    "verificar": "python tools/verificar_banco.py",
    "banco": "python tools/gerar_banco.py",
    "dev": "python -m http.server 8000"
  }
}
```

`.gitignore`:
```
__pycache__/
*.pyc
.DS_Store
Thumbs.db
```

- [ ] **Step 2: Escrever os testes do RNG (falham)**

`tests/engine/rng.test.js`:
```js
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
```

- [ ] **Step 3: Rodar e ver falhar**

Run: `node --test tests/engine/rng.test.js`
Expected: FAIL com `Cannot find module ... src/engine/rng.js`

- [ ] **Step 4: Implementar `src/engine/rng.js`**

```js
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
```

- [ ] **Step 5: Rodar e ver passar**

Run: `node --test tests/engine/rng.test.js`
Expected: PASS (3 testes)

- [ ] **Step 6: Escrever os testes do sorteio (falham)**

`tests/engine/sorteio.test.js`:
```js
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
```

- [ ] **Step 7: Rodar e ver falhar**

Run: `node --test tests/engine/sorteio.test.js`
Expected: FAIL com `Cannot find module ... sorteio.js`

- [ ] **Step 8: Implementar `src/engine/sorteio.js`**

```js
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
```

- [ ] **Step 9: Rodar e ver passar**

Run: `node --test tests/engine/sorteio.test.js`
Expected: PASS (6 testes)

- [ ] **Step 10: Escrever os testes do agrupamento (falham)**

`tests/engine/banco.test.js`:
```js
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
```

- [ ] **Step 11: Rodar e ver falhar**

Run: `node --test tests/engine/banco.test.js`
Expected: FAIL com `Cannot find module ... banco.js`

- [ ] **Step 12: Implementar `src/engine/banco.js`**

```js
// Separa a lista plana do JSON em um banco por fase: índice 0 = fase 1.
export function agruparPorFase(questoes, totalFases) {
  const grupos = Array.from({ length: totalFases }, () => []);
  for (const q of questoes) {
    if (!Number.isInteger(q.fase) || q.fase < 1 || q.fase > totalFases) {
      throw new Error(`Questão ${q.id} com fase inválida: ${q.fase}`);
    }
    grupos[q.fase - 1].push(q);
  }
  grupos.forEach((grupo, i) => {
    if (grupo.length === 0) throw new Error(`Fase ${i + 1} sem questões`);
  });
  return grupos;
}
```

- [ ] **Step 13: Rodar a suíte inteira**

Run: `npm test`
Expected: PASS (12 testes), sem warnings

- [ ] **Step 14: Commit (inclui spec e plano)**

```bash
git add package.json .gitignore src/engine tests/engine docs/superpowers
# o PDF do professor NÃO é versionado (o repositório será público)
git commit -m "feat: fundação do projeto, RNG, sorteio sem repetição e agrupamento por fase" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Motor da partida + configuração das fases

**Files:**
- Create: `src/config.js`, `src/engine/game.js`
- Test: `tests/engine/game.test.js`

**Interfaces:**
- Consumes: `criarSorteio` (Task 1), `criarRng` (testes).
- Produces:
  - `FASES: Array<{numero, nivel, acertosNecessarios, sala}>`, `TEMPO_LIMITE_S = 2400`, `MAX_ERROS = 6`
  - `criarJogo({ fases, bancoPorFase, tempoLimiteS, maxErros, rng })` → objeto com:
    - `estado(): { status: 'jogando'|'vitoria'|'derrota', motivoDerrota: null|'tempo'|'erros', faseIndex, fase: FASE|null, totalFases, acertosFase, acertosNecessarios, acertosTotal, totalNecessario, erros, maxErros, tempoRestanteS, questaoAtual: questao|null }`
    - `responder(valor: number): { correta: boolean, questao, avancouFase: boolean, status }`. Lança `Error('A partida já terminou')` fora do status `jogando`.
    - `tick(segundos: number): void`

- [ ] **Step 1: Criar `src/config.js`**

```js
// Estrutura oficial do PDF: 5 fases, 1 + 2 + 2 + 3 + 4 = 12 acertos.
export const FASES = [
  { numero: 1, nivel: 'Fácil', acertosNecessarios: 1, sala: 'Sala de Aula' },
  { numero: 2, nivel: 'Básico', acertosNecessarios: 2, sala: 'Biblioteca' },
  { numero: 3, nivel: 'Intermediário', acertosNecessarios: 2, sala: 'Laboratório de Informática' },
  { numero: 4, nivel: 'Avançado', acertosNecessarios: 3, sala: 'Sala dos Professores' },
  { numero: 5, nivel: 'Difícil', acertosNecessarios: 4, sala: 'Cofre da Diretoria' },
];

export const TEMPO_LIMITE_S = 40 * 60; // o segurança fecha o prédio em 40 minutos
export const MAX_ERROS = 6; // no 6º erro o alarme dispara
```

- [ ] **Step 2: Escrever os testes do ciclo principal (falham)**

`tests/engine/game.test.js`:
```js
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
```

- [ ] **Step 3: Rodar e ver falhar**

Run: `node --test tests/engine/game.test.js`
Expected: FAIL com `Cannot find module ... game.js`

- [ ] **Step 4: Implementar o ciclo principal em `src/engine/game.js`**

```js
import { criarSorteio } from './sorteio.js';

// Máquina de estados de uma partida. Lógica pura: sem DOM e sem relógio real.
export function criarJogo({ fases, bancoPorFase, tempoLimiteS, maxErros, rng }) {
  const sorteios = bancoPorFase.map((banco) => criarSorteio(banco, rng));
  const totalNecessario = fases.reduce((soma, f) => soma + f.acertosNecessarios, 0);
  const s = {
    status: 'jogando',
    motivoDerrota: null,
    faseIndex: 0,
    acertosFase: 0,
    acertosTotal: 0,
    erros: 0,
    tempoRestanteS: tempoLimiteS,
    questaoAtual: sorteios[0].proxima(),
  };

  function encerrar(status, motivo = null) {
    s.status = status;
    s.motivoDerrota = motivo;
    s.questaoAtual = null;
  }

  return {
    estado() {
      const fase = fases[s.faseIndex] ?? null;
      return {
        ...s,
        fase,
        totalFases: fases.length,
        acertosNecessarios: fase ? fase.acertosNecessarios : 0,
        totalNecessario,
        maxErros,
      };
    },

    responder(valor) {
      const questao = s.questaoAtual;
      const correta = valor === questao.resposta;
      let avancouFase = false;
      if (correta) {
        s.acertosFase += 1;
        s.acertosTotal += 1;
        if (s.acertosFase >= fases[s.faseIndex].acertosNecessarios) {
          s.faseIndex += 1;
          s.acertosFase = 0;
          avancouFase = true;
          if (s.faseIndex === fases.length) encerrar('vitoria');
        }
      } else {
        s.erros += 1; // erro não apaga acertos (regra 3 do PDF)
        if (s.erros >= maxErros) encerrar('derrota', 'erros');
      }
      if (s.status === 'jogando') s.questaoAtual = sorteios[s.faseIndex].proxima();
      return { correta, questao, avancouFase, status: s.status };
    },
  };
}
```

- [ ] **Step 5: Rodar e ver passar**

Run: `node --test tests/engine/game.test.js`
Expected: PASS (8 testes)

- [ ] **Step 6: Escrever os testes de tempo e de fim de partida (falham)**

Acrescentar ao final de `tests/engine/game.test.js`:
```js
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
```

- [ ] **Step 7: Rodar e ver falhar**

Run: `node --test tests/engine/game.test.js`
Expected: FAIL nos 4 novos testes (`jogo.tick is not a function`, TypeError em vez de /terminou/, nenhum erro lançado)

- [ ] **Step 8: Completar `src/engine/game.js`**

Logo no início de `criarJogo`, antes de `const sorteios`:
```js
  if (bancoPorFase.length !== fases.length) {
    throw new Error('É preciso um banco de questões para cada fase');
  }
```
Na primeira linha de `responder(valor)`:
```js
      if (s.status !== 'jogando') throw new Error('A partida já terminou');
```
Novo método, depois de `responder`:
```js
    tick(segundos) {
      if (s.status !== 'jogando') return;
      s.tempoRestanteS = Math.max(0, s.tempoRestanteS - segundos);
      if (s.tempoRestanteS === 0) encerrar('derrota', 'tempo');
    },
```

- [ ] **Step 9: Rodar a suíte inteira**

Run: `npm test`
Expected: PASS (24 testes)

- [ ] **Step 10: Commit**

```bash
git add src/config.js src/engine/game.js tests/engine/game.test.js
git commit -m "feat: motor da partida com fases, erros, tempo, vitória e derrota" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Módulos puros de apoio: Pascal, cadeado, formatos e parâmetros

**Files:**
- Create: `src/engine/pascal.js`, `src/ui/cadeado.js`, `src/ui/formatos.js`, `src/ui/parametros.js`
- Test: `tests/engine/pascal.test.js`, `tests/ui/cadeado.test.js`, `tests/ui/formatos.test.js`, `tests/ui/parametros.test.js`

**Interfaces:**
- Produces:
  - `binomial(n, k): number` (Stifel recursivo com memo; 0 se k<0 ou k>n)
  - `linhaPascal(n): number[]`
  - `conferirLinha(n, valores: number[]): boolean[]`
  - `criarCadeado(maxDigitos = 10): { digitar(d: string), apagar(), limpar(), texto(): string, valor(): number|null }`
  - `formatarTempo(segundos): 'mm:ss'`, `formatarNumero(n): string` (pt-BR, ex.: `151.200`)
  - `tempoLimiteDaUrl(busca: string, padrao: number): number`

- [ ] **Step 1: Testes de Pascal (falham)**

`tests/engine/pascal.test.js`:
```js
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
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `node --test tests/engine/pascal.test.js`
Expected: FAIL com `Cannot find module ... pascal.js`

- [ ] **Step 3: Implementar `src/engine/pascal.js`**

```js
// Relação de Stifel: C(n,k) = C(n-1,k-1) + C(n-1,k)
// Recursão com memoização: cada valor é calculado uma única vez.
const memo = new Map();

export function binomial(n, k) {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  const chave = `${n},${k}`;
  if (!memo.has(chave)) memo.set(chave, binomial(n - 1, k - 1) + binomial(n - 1, k));
  return memo.get(chave);
}

export function linhaPascal(n) {
  return Array.from({ length: n + 1 }, (_, k) => binomial(n, k));
}

export function conferirLinha(n, valores) {
  return linhaPascal(n).map((v, i) => valores[i] === v);
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `node --test tests/engine/pascal.test.js`
Expected: PASS (5 testes)

- [ ] **Step 5: Testes do cadeado (falham)**

`tests/ui/cadeado.test.js`:
```js
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
```

- [ ] **Step 6: Rodar e ver falhar**

Run: `node --test tests/ui/cadeado.test.js`
Expected: FAIL com `Cannot find module ... cadeado.js`

- [ ] **Step 7: Implementar `src/ui/cadeado.js`**

```js
// Estado do teclado numérico do cadeado (sem DOM).
export function criarCadeado(maxDigitos = 10) {
  let digitos = '';
  return {
    digitar(d) {
      if (!/^[0-9]$/.test(d) || digitos.length >= maxDigitos) return;
      digitos = digitos === '0' ? d : digitos + d;
    },
    apagar() {
      digitos = digitos.slice(0, -1);
    },
    limpar() {
      digitos = '';
    },
    texto() {
      return digitos;
    },
    valor() {
      return digitos === '' ? null : Number(digitos);
    },
  };
}
```

- [ ] **Step 8: Rodar e ver passar**

Run: `node --test tests/ui/cadeado.test.js`
Expected: PASS (6 testes)

- [ ] **Step 9: Testes de formatos e parâmetros (falham)**

`tests/ui/formatos.test.js`:
```js
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
```

`tests/ui/parametros.test.js`:
```js
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
```

- [ ] **Step 10: Rodar e ver falhar**

Run: `node --test tests/ui/formatos.test.js tests/ui/parametros.test.js`
Expected: FAIL com `Cannot find module`

- [ ] **Step 11: Implementar `src/ui/formatos.js` e `src/ui/parametros.js`**

`src/ui/formatos.js`:
```js
export function formatarTempo(segundos) {
  const s = Math.max(0, Math.floor(segundos));
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

export function formatarNumero(n) {
  return n.toLocaleString('pt-BR');
}
```

`src/ui/parametros.js`:
```js
// ?tempo=SEG encurta o relógio (1 a 3600 s) para demonstrações e testes.
export function tempoLimiteDaUrl(busca, padrao) {
  const valor = Number(new URLSearchParams(busca).get('tempo'));
  return Number.isInteger(valor) && valor >= 1 && valor <= 3600 ? valor : padrao;
}
```

- [ ] **Step 12: Rodar a suíte inteira**

Run: `npm test`
Expected: PASS (40 testes)

- [ ] **Step 13: Commit**

```bash
git add src/engine/pascal.js src/ui tests/engine/pascal.test.js tests/ui
git commit -m "feat: Stifel recursivo, cadeado numérico, formatos e modo demonstração" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Biblioteca combinatória em Python (recorrências recursivas)

**Files:**
- Create: `tools/combinatoria.py`
- Test: `tools/test_combinatoria.py`

**Interfaces:**
- Produces: `fat(n)`, `A(n,k)`, `C(n,k)`, `PR(n, *repeticoes)`, `subconjuntos(n)`, `apertos(n)`, `escada(n)`, `desarranjo(n)`, `catalan(n)` (todos `int`; `ValueError` em entradas inválidas), `permutacoes_distintas(letras: str) -> Iterator[str]`.

- [ ] **Step 1: Escrever os testes (falham)**

`tools/test_combinatoria.py`:
```python
import unittest
from itertools import permutations

from combinatoria import (A, C, PR, apertos, catalan, desarranjo, escada, fat,
                          permutacoes_distintas, subconjuntos)


class TestFormulasFechadas(unittest.TestCase):
    def test_fatorial(self):
        self.assertEqual(fat(0), 1)
        self.assertEqual(fat(5), 120)

    def test_arranjo(self):
        self.assertEqual(A(8, 2), 56)
        self.assertEqual(A(6, 3), 120)
        self.assertEqual(A(5, 0), 1)

    def test_combinacao(self):
        self.assertEqual(C(5, 2), 10)
        self.assertEqual(C(10, 4), 210)
        self.assertEqual(C(4, 5), 0)

    def test_permutacao_com_repeticao(self):
        self.assertEqual(PR(5, 3, 2), 10)          # ARARA
        self.assertEqual(PR(10, 2, 3, 2), 151200)  # MATEMATICA

    def test_permutacao_com_repeticao_rejeita_repeticoes_maiores_que_n(self):
        with self.assertRaises(ValueError):
            PR(3, 2, 2)


class TestRecorrencias(unittest.TestCase):
    def test_subconjuntos_dobra_a_cada_elemento(self):
        self.assertEqual([subconjuntos(n) for n in range(7)], [1, 2, 4, 8, 16, 32, 64])

    def test_apertos_de_mao(self):
        self.assertEqual([apertos(n) for n in range(1, 6)], [0, 1, 3, 6, 10])
        self.assertEqual(apertos(12), 66)

    def test_escada(self):
        self.assertEqual([escada(n) for n in range(1, 9)], [1, 2, 3, 5, 8, 13, 21, 34])

    def test_desarranjos(self):
        self.assertEqual([desarranjo(n) for n in range(7)], [1, 0, 1, 2, 9, 44, 265])

    def test_catalan(self):
        self.assertEqual([catalan(n) for n in range(6)], [1, 1, 2, 5, 14, 42])

    def test_entradas_invalidas(self):
        for funcao, n in ((subconjuntos, -1), (apertos, 0), (escada, 0), (desarranjo, -1), (catalan, -1)):
            with self.subTest(funcao=funcao.__name__), self.assertRaises(ValueError):
                funcao(n)


class TestRecorrenciaContraEnumeracao(unittest.TestCase):
    """As recorrências batem com contagens obtidas por outro caminho."""

    def test_desarranjo_igual_a_permutacoes_sem_ponto_fixo(self):
        for n in range(1, 8):
            bruto = sum(1 for p in permutations(range(n)) if all(p[i] != i for i in range(n)))
            self.assertEqual(desarranjo(n), bruto, n)

    def test_escada_igual_a_soma_de_combinacoes(self):
        for n in range(1, 15):
            self.assertEqual(escada(n), sum(C(n - k, k) for k in range(n // 2 + 1)), n)

    def test_catalan_igual_a_formula_fechada(self):
        for n in range(10):
            self.assertEqual(catalan(n), C(2 * n, n) // (n + 1), n)


class TestPermutacoesDistintas(unittest.TestCase):
    def test_gera_anagramas_sem_repetir(self):
        anagramas = list(permutacoes_distintas("ARARA"))
        self.assertEqual(len(anagramas), 10)
        self.assertEqual(len(set(anagramas)), 10)
        self.assertIn("AARRA", anagramas)

    def test_palavra_sem_letras_repetidas(self):
        self.assertEqual(sorted(permutacoes_distintas("ABC")),
                         ["ABC", "ACB", "BAC", "BCA", "CAB", "CBA"])


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `python -m unittest discover -s tools -v`
Expected: FAIL com `ModuleNotFoundError: No module named 'combinatoria'`

- [ ] **Step 3: Implementar `tools/combinatoria.py`**

```python
"""Funções de contagem usadas para verificar o banco de questões.

As recorrências são recursivas (com memoização via lru_cache) de propósito:
o próprio código ilustra os conceitos de recorrência apresentados no jogo.
"""
from functools import lru_cache
from math import comb, factorial, perm, prod


def fat(n: int) -> int:
    return factorial(n)


def A(n: int, k: int) -> int:
    """Arranjo simples: A(n, k) = n! / (n - k)!"""
    return perm(n, k)


def C(n: int, k: int) -> int:
    """Combinação simples: C(n, k) = n! / (k! (n - k)!)"""
    return comb(n, k)


def PR(n: int, *repeticoes: int) -> int:
    """Permutação com repetição: n! / (r1! r2! ...)"""
    if sum(repeticoes) > n:
        raise ValueError("as repetições somam mais que n")
    return factorial(n) // prod(factorial(r) for r in repeticoes)


@lru_cache(maxsize=None)
def subconjuntos(n: int) -> int:
    """s_0 = 1; s_n = 2 s_{n-1}  (1ª ordem, linear, homogênea)."""
    if n < 0:
        raise ValueError("n deve ser >= 0")
    return 1 if n == 0 else 2 * subconjuntos(n - 1)


@lru_cache(maxsize=None)
def apertos(n: int) -> int:
    """h_1 = 0; h_n = h_{n-1} + (n - 1)  (1ª ordem, linear, NÃO homogênea)."""
    if n < 1:
        raise ValueError("n deve ser >= 1")
    return 0 if n == 1 else apertos(n - 1) + (n - 1)


@lru_cache(maxsize=None)
def escada(n: int) -> int:
    """e_1 = 1, e_2 = 2; e_n = e_{n-1} + e_{n-2}  (2ª ordem, linear, homogênea)."""
    if n < 1:
        raise ValueError("n deve ser >= 1")
    if n <= 2:
        return n
    return escada(n - 1) + escada(n - 2)


@lru_cache(maxsize=None)
def desarranjo(n: int) -> int:
    """D_0 = 1, D_1 = 0; D_n = (n - 1)(D_{n-1} + D_{n-2})  (2ª ordem, coeficiente variável)."""
    if n < 0:
        raise ValueError("n deve ser >= 0")
    if n == 0:
        return 1
    if n == 1:
        return 0
    return (n - 1) * (desarranjo(n - 1) + desarranjo(n - 2))


@lru_cache(maxsize=None)
def catalan(n: int) -> int:
    """C_0 = 1; C_{n+1} = soma C_i * C_{n-i}  (recorrência NÃO linear)."""
    if n < 0:
        raise ValueError("n deve ser >= 0")
    if n == 0:
        return 1
    return sum(catalan(i) * catalan(n - 1 - i) for i in range(n))


def permutacoes_distintas(letras: str):
    """Gera recursivamente os anagramas distintos, sem gerar repetidos."""
    if len(letras) <= 1:
        yield letras
        return
    usadas = set()
    for i, letra in enumerate(letras):
        if letra in usadas:
            continue
        usadas.add(letra)
        for resto in permutacoes_distintas(letras[:i] + letras[i + 1:]):
            yield letra + resto
```

- [ ] **Step 4: Rodar e ver passar**

Run: `python -m unittest discover -s tools -v`
Expected: PASS (16 testes)

- [ ] **Step 5: Commit**

```bash
git add tools/combinatoria.py tools/test_combinatoria.py
git commit -m "feat: biblioteca combinatória com recorrências recursivas verificadas" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Verificador do banco + força bruta

**Files:**
- Create: `tools/forca_bruta.py`, `tools/verificar_banco.py`
- Test: `tools/test_forca_bruta.py`, `tools/test_verificar_banco.py`

**Interfaces:**
- Consumes: `combinatoria` (Task 4).
- Produces:
  - `FORCA_BRUTA: dict[str, Callable[[], int]]` (id → contagem por enumeração)
  - `verificar(questoes, forca_bruta=FORCA_BRUTA, distribuicao=DISTRIBUICAO) -> list[str]` (lista vazia = OK)
  - `carregar(caminho) -> list[dict]`, `CAMINHO_PADRAO`, `RAIZ`, `DISTRIBUICAO`
  - CLI: `python tools/verificar_banco.py [arquivo.json]` sai com 0 se OK, 1 se houver erro

- [ ] **Step 1: Testes dos auxiliares de força bruta (falham)**

`tools/test_forca_bruta.py`:
```python
import unittest

from forca_bruta import _caminhos, _composicoes_1_2, _contiguos, _juntos, _passa_por


class TestAuxiliares(unittest.TestCase):
    def test_caminhos_minimos_2x2(self):
        self.assertEqual(sorted(_caminhos(2, 2)),
                         ["CCDD", "CDCD", "CDDC", "DCCD", "DCDC", "DDCC"])

    def test_passa_por(self):
        self.assertTrue(_passa_por("DDCC", (2, 0)))
        self.assertFalse(_passa_por("CCDD", (2, 0)))

    def test_composicoes_de_4_com_passos_1_e_2(self):
        self.assertEqual(sorted(_composicoes_1_2(4)),
                         [(1, 1, 1, 1), (1, 1, 2), (1, 2, 1), (2, 1, 1), (2, 2)])

    def test_juntos(self):
        self.assertTrue(_juntos("XABY", "A", "B"))
        self.assertTrue(_juntos("XBAY", "A", "B"))
        self.assertFalse(_juntos("AXB", "A", "B"))

    def test_contiguos(self):
        vogal = lambda x: x in "AEO"
        self.assertTrue(_contiguos("CAEOR", vogal))
        self.assertFalse(_contiguos("CADEO", vogal))


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `python -m unittest discover -s tools -v`
Expected: FAIL com `ModuleNotFoundError: No module named 'forca_bruta'`

- [ ] **Step 3: Implementar `tools/forca_bruta.py`**

```python
"""Verificação por força bruta: enumera de fato os casos de cada questão.

Obrigatória para os tópicos RESTRICAO e RECORRENCIA, que são onde os erros de
raciocínio costumam acontecer. Cada entrada é independente das fórmulas.
"""
from itertools import combinations, permutations, product

from combinatoria import permutacoes_distintas

DIGITOS = "0123456789"
VOGAIS = "AEIOU"


def _caminhos(dx, dy):
    """Gera recursivamente os caminhos mínimos ('D' = direita, 'C' = cima)."""
    if dx == 0 and dy == 0:
        yield ""
        return
    if dx > 0:
        for resto in _caminhos(dx - 1, dy):
            yield "D" + resto
    if dy > 0:
        for resto in _caminhos(dx, dy - 1):
            yield "C" + resto


def _passa_por(caminho, ponto):
    x = y = 0
    for passo in caminho:
        x, y = (x + 1, y) if passo == "D" else (x, y + 1)
        if (x, y) == ponto:
            return True
    return False


def _nunca_acima_da_diagonal(caminho):
    x = y = 0
    for passo in caminho:
        x, y = (x + 1, y) if passo == "D" else (x, y + 1)
        if y > x:
            return False
    return True


def _composicoes_1_2(n):
    """Sequências de passos 1 e 2 que somam n (recursivo)."""
    if n == 0:
        yield ()
        return
    for passo in (1, 2):
        if passo <= n:
            for resto in _composicoes_1_2(n - passo):
                yield (passo,) + resto


def _juntos(seq, a, b):
    return abs(seq.index(a) - seq.index(b)) == 1


def _contiguos(seq, pertence):
    posicoes = [i for i, x in enumerate(seq) if pertence(x)]
    return posicoes[-1] - posicoes[0] == len(posicoes) - 1


def _pares_4_digitos_distintos():
    return sum(1 for p in permutations(DIGITOS, 4) if p[0] != "0" and int(p[3]) % 2 == 0)


PESSOAS_F4_03 = [f"H{i}" for i in range(6)] + [f"M{i}" for i in range(5)]
LIVROS_F4_11 = [f"M{i}" for i in range(5)] + [f"F{i}" for i in range(3)]
PESSOAS_F5_01 = [f"A{i}" for i in range(7)] + [f"P{i}" for i in range(5)]

FORCA_BRUTA = {
    # Fase 2
    "F2-15": lambda: sum(1 for _ in product((0, 1), repeat=6)),
    # Fase 3
    "F3-09": lambda: sum(1 for p in permutations("PROVA") if p[0] in "OA"),
    "F3-10": lambda: sum(1 for p in permutations("CADERNO") if p[0] in "CDRN" and p[-1] in "CDRN"),
    "F3-11": lambda: sum(1 for c in combinations(range(10), 4) if 0 in c),
    "F3-12": lambda: sum(1 for p in permutations("BCDEFG") if _juntos(p, "B", "C")),
    "F3-13": lambda: sum(1 for p in permutations("012345", 3) if p[0] != "0"),
    "F3-14": lambda: sum(1 for _ in combinations(range(12), 2)),
    "F3-15": lambda: sum(1 for _ in combinations(range(10), 4)),
    # Fase 4
    "F4-03": lambda: sum(1 for c in combinations(PESSOAS_F4_03, 4) if any(x[0] == "M" for x in c)),
    "F4-04": lambda: sum(1 for a in permutacoes_distintas("PROFESSOR") if a[0] == "P"),
    "F4-05": lambda: sum(1 for p in permutations("ABCDEFG") if not _juntos(p, "A", "B")),
    "F4-06": lambda: sum(1 for p in permutations("CADERNO") if _contiguos(p, lambda x: x in "AEO")),
    "F4-07": lambda: sum(1 for p in permutations("LIVRO") if p.index("L") < p.index("V")),
    "F4-08": _pares_4_digitos_distintos,
    "F4-09": lambda: sum(1 for s in product(DIGITOS, repeat=4) if len(set(s)) < 4),
    "F4-10": lambda: sum(1 for c in combinations("PRABCDEF", 5) if not ("P" in c and "R" in c)),
    "F4-11": lambda: sum(1 for p in permutations(LIVROS_F4_11)
                         if _contiguos(p, lambda x: x[0] == "M") and _contiguos(p, lambda x: x[0] == "F")),
    "F4-12": lambda: sum(1 for c in combinations(range(1, 11), 3) if any(b - a == 1 for a, b in zip(c, c[1:]))),
    "F4-13": lambda: sum(1 for _ in _composicoes_1_2(8)),
    "F4-14": lambda: sum(1 for _ in _composicoes_1_2(7)),  # 1 = dominó em pé; 2 = par de dominós deitados
    "F4-15": lambda: sum(1 for s in product("01", repeat=9) if "11" not in "".join(s)),
    # Fase 5
    "F5-01": lambda: sum(1 for c in combinations(PESSOAS_F5_01, 5) if sum(x[0] == "P" for x in c) >= 2),
    "F5-02": lambda: sum(1 for p in permutations("COMBINAR") if p[0] in "CMBNR" and p[-1] in "OIA"),
    "F5-03": lambda: sum(1 for p in permutations("ESCOLA")
                         if not any(a in "EOA" and b in "EOA" for a, b in zip(p, p[1:]))),
    "F5-04": lambda: sum(1 for p in permutations(DIGITOS, 5) if p[0] != "0" and p[-1] in "05"),
    "F5-05": lambda: sum(1 for c in _caminhos(6, 4) if _passa_por(c, (2, 2))),
    "F5-06": lambda: sum(1 for c in _caminhos(5, 5) if not _passa_por(c, (2, 2))),
    "F5-07": lambda: len({frozenset([frozenset(g), frozenset(set(range(8)) - set(g))])
                          for g in combinations(range(8), 4)}),
    "F5-08": lambda: sum(1 for p in permutations("AaBbCcDd") if all(_juntos(p, x, x.lower()) for x in "ABCD")),
    "F5-09": lambda: sum(1 for c in combinations("AaBbCcDdEe", 4) if len({x.upper() for x in c}) == 4),
    "F5-10": lambda: sum(1 for a in permutacoes_distintas("ARARAQUARA") if a[0] == "Q"),
    "F5-11": lambda: sum(1 for s in product(VOGAIS + DIGITOS, repeat=4) if sum(ch in VOGAIS for ch in s) == 2),
    "F5-12": lambda: sum(1 for c in combinations(range(1, 13), 4) if all(b - a > 1 for a, b in zip(c, c[1:]))),
    "F5-13": lambda: sum(1 for p in permutations(range(5)) if all(p[i] != i for i in range(5))),
    "F5-14": lambda: sum(1 for p in permutations(range(6)) if sum(p[i] == i for i in range(6)) == 2),
    "F5-15": lambda: sum(1 for c in _caminhos(4, 4) if _nunca_acima_da_diagonal(c)),
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `python -m unittest discover -s tools -v`
Expected: PASS (21 testes)

- [ ] **Step 5: Testes do verificador (falham)**

`tools/test_verificar_banco.py`:
```python
import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from verificar_banco import verificar


def questao(**alteracoes):
    base = {
        "id": "F1-01", "fase": 1, "topico": "PFC",
        "enunciado": "3 camisetas e 4 calças: quantos conjuntos?",
        "resposta": 12, "formula": "3*4",
        "resolucao": ["3 opções de camiseta e 4 de calça.", "$3 \\cdot 4 = 12$"],
        "fonte": "Autoral",
    }
    base.update(alteracoes)
    return base


DIST_UM = {1: {"PFC": 1}}


class TestVerificar(unittest.TestCase):
    def assertErro(self, erros, *trechos):
        self.assertTrue(any(all(t in e for t in trechos) for e in erros),
                        f"esperava erro contendo {trechos}; obtive {erros}")

    def test_questao_valida_nao_gera_erros(self):
        self.assertEqual(verificar([questao()], forca_bruta={}, distribuicao=DIST_UM), [])

    def test_formula_divergente(self):
        erros = verificar([questao(formula="3*5")], forca_bruta={}, distribuicao=DIST_UM)
        self.assertErro(erros, "F1-01", "fórmula")

    def test_formula_invalida(self):
        erros = verificar([questao(formula="fat(")], forca_bruta={}, distribuicao=DIST_UM)
        self.assertErro(erros, "F1-01", "fórmula inválida")

    def test_restricao_exige_forca_bruta(self):
        erros = verificar([questao(topico="RESTRICAO")], forca_bruta={}, distribuicao={1: {"RESTRICAO": 1}})
        self.assertErro(erros, "F1-01", "força bruta")

    def test_forca_bruta_divergente(self):
        erros = verificar([questao(topico="RESTRICAO")], forca_bruta={"F1-01": lambda: 13},
                          distribuicao={1: {"RESTRICAO": 1}})
        self.assertErro(erros, "F1-01", "força bruta = 13")

    def test_forca_bruta_correta_passa(self):
        erros = verificar([questao(topico="RECORRENCIA")], forca_bruta={"F1-01": lambda: 12},
                          distribuicao={1: {"RECORRENCIA": 1}})
        self.assertEqual(erros, [])

    def test_id_duplicado(self):
        erros = verificar([questao(), questao()], forca_bruta={}, distribuicao={1: {"PFC": 2}})
        self.assertErro(erros, "duplicado", "F1-01")

    def test_id_incoerente_com_fase(self):
        erros = verificar([questao(fase=2)], forca_bruta={}, distribuicao={2: {"PFC": 1}})
        self.assertErro(erros, "F1-01", "fase")

    def test_resposta_nao_inteira(self):
        erros = verificar([questao(resposta=12.5)], forca_bruta={}, distribuicao=DIST_UM)
        self.assertErro(erros, "F1-01", "resposta")

    def test_resolucao_com_um_passo(self):
        erros = verificar([questao(resolucao=["3 · 4 = 12"])], forca_bruta={}, distribuicao=DIST_UM)
        self.assertErro(erros, "F1-01", "resolução")

    def test_ultimo_passo_sem_a_resposta(self):
        erros = verificar([questao(resolucao=["a", "b"])], forca_bruta={}, distribuicao=DIST_UM)
        self.assertErro(erros, "F1-01", "último passo")

    def test_resposta_com_separador_de_milhar_e_aceita(self):
        q = questao(resposta=151200, formula="PR(10,2,3,2)", resolucao=["MATEMATICA", "$= 151.200$"])
        self.assertEqual(verificar([q], forca_bruta={}, distribuicao=DIST_UM), [])

    def test_distribuicao_diferente_da_exigida(self):
        erros = verificar([questao()], forca_bruta={}, distribuicao={1: {"PFC": 2}})
        self.assertErro(erros, "distribuição")

    def test_forca_bruta_sem_questao(self):
        erros = verificar([questao()], forca_bruta={"F9-99": lambda: 1}, distribuicao=DIST_UM)
        self.assertErro(erros, "F9-99")

    def test_campos_ausentes(self):
        q = questao()
        del q["formula"]
        erros = verificar([q], forca_bruta={}, distribuicao=DIST_UM)
        self.assertErro(erros, "F1-01", "campos ausentes")

    def test_topico_desconhecido(self):
        erros = verificar([questao(topico="XYZ")], forca_bruta={}, distribuicao={1: {"XYZ": 1}})
        self.assertErro(erros, "F1-01", "tópico")


class TestLinhaDeComando(unittest.TestCase):
    def test_sai_com_codigo_1_e_lista_o_erro(self):
        with tempfile.TemporaryDirectory() as pasta:
            arquivo = Path(pasta) / "q.json"
            arquivo.write_text(json.dumps([questao(formula="3*5")]), encoding="utf-8")
            script = Path(__file__).with_name("verificar_banco.py")
            r = subprocess.run([sys.executable, str(script), str(arquivo)], capture_output=True,
                               env={**os.environ, "PYTHONIOENCODING": "utf-8"})
            self.assertEqual(r.returncode, 1)
            self.assertIn("F1-01", r.stdout.decode("utf-8"))


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 6: Rodar e ver falhar**

Run: `python -m unittest discover -s tools -v`
Expected: FAIL com `ModuleNotFoundError: No module named 'verificar_banco'`

- [ ] **Step 7: Implementar `tools/verificar_banco.py`**

```python
"""Verifica o banco de questões: estrutura, distribuição, fórmula e força bruta.

Uso: python tools/verificar_banco.py [caminho.json]
Sai com código 0 se tudo estiver certo e 1 se houver qualquer problema.
"""
import json
import re
import sys
from pathlib import Path

import combinatoria as cb
from forca_bruta import FORCA_BRUTA

RAIZ = Path(__file__).resolve().parent.parent
CAMINHO_PADRAO = RAIZ / "data" / "questoes.json"

TOPICOS = {"PFC", "PERM", "PERM_REP", "ARRANJO", "COMB", "RESTRICAO", "RECORRENCIA"}
EXIGEM_FORCA_BRUTA = {"RESTRICAO", "RECORRENCIA"}
CAMPOS = ("id", "fase", "topico", "enunciado", "resposta", "formula", "resolucao", "fonte")
MAX_RESPOSTA = 9_999_999_999  # cabe no cadeado de 10 dígitos

DISTRIBUICAO = {
    1: {"PFC": 7, "PERM": 4, "ARRANJO": 2, "COMB": 2},
    2: {"PFC": 2, "PERM": 2, "PERM_REP": 4, "ARRANJO": 3, "COMB": 3, "RECORRENCIA": 1},
    3: {"PERM_REP": 2, "ARRANJO": 3, "COMB": 3, "RESTRICAO": 5, "RECORRENCIA": 2},
    4: {"COMB": 2, "RESTRICAO": 10, "RECORRENCIA": 3},
    5: {"RESTRICAO": 12, "RECORRENCIA": 3},
}

NOMES_FORMULA = {
    "fat": cb.fat, "A": cb.A, "C": cb.C, "PR": cb.PR,
    "subconjuntos": cb.subconjuntos, "apertos": cb.apertos, "escada": cb.escada,
    "desarranjo": cb.desarranjo, "catalan": cb.catalan,
}


def avaliar_formula(formula: str) -> int:
    # O banco é nosso e versionado; eval sem builtins basta para as fórmulas.
    return eval(formula, {"__builtins__": {}}, dict(NOMES_FORMULA))


def _formatos(n: int) -> set[str]:
    return {str(n), f"{n:,}".replace(",", ".")}


def _resposta_valida(r) -> bool:
    return isinstance(r, int) and not isinstance(r, bool) and 0 < r <= MAX_RESPOSTA


def verificar(questoes, forca_bruta=FORCA_BRUTA, distribuicao=DISTRIBUICAO) -> list[str]:
    erros: list[str] = []
    ids = [q.get("id") for q in questoes]
    for duplicado in sorted({i for i in ids if ids.count(i) > 1}):
        erros.append(f"id duplicado: {duplicado}")

    contagem: dict[int, dict[str, int]] = {}
    for q in questoes:
        qid = q.get("id", "<sem id>")
        faltando = [c for c in CAMPOS if c not in q]
        if faltando:
            erros.append(f"{qid}: campos ausentes {faltando}")
            continue

        if not re.fullmatch(r"F[1-9]-\d{2}", qid) or int(qid[1]) != q["fase"]:
            erros.append(f"{qid}: id não corresponde à fase {q['fase']}")
        if q["topico"] not in TOPICOS:
            erros.append(f"{qid}: tópico desconhecido {q['topico']}")
        if not str(q["enunciado"]).strip():
            erros.append(f"{qid}: enunciado vazio")

        r = q["resposta"]
        if not _resposta_valida(r):
            erros.append(f"{qid}: resposta deve ser inteiro entre 1 e {MAX_RESPOSTA}")

        passos = q["resolucao"]
        if not isinstance(passos, list) or len(passos) < 2:
            erros.append(f"{qid}: resolução precisa de ao menos 2 passos")
        elif _resposta_valida(r) and not any(f in passos[-1] for f in _formatos(r)):
            erros.append(f"{qid}: último passo da resolução não mostra a resposta {r}")

        try:
            valor = avaliar_formula(q["formula"])
            if valor != r:
                erros.append(f"{qid}: fórmula {q['formula']} = {valor}, mas resposta = {r}")
        except Exception as exc:  # noqa: BLE001 - qualquer falha de fórmula vira erro reportado
            erros.append(f"{qid}: fórmula inválida ({exc})")

        if q["topico"] in EXIGEM_FORCA_BRUTA:
            if qid not in forca_bruta:
                erros.append(f"{qid}: tópico {q['topico']} exige verificação por força bruta")
            else:
                bruto = forca_bruta[qid]()
                if bruto != r:
                    erros.append(f"{qid}: força bruta = {bruto}, mas resposta = {r}")

        por_fase = contagem.setdefault(q["fase"], {})
        por_fase[q["topico"]] = por_fase.get(q["topico"], 0) + 1

    for orfa in sorted(set(forca_bruta) - set(ids)):
        erros.append(f"força bruta sem questão: {orfa}")
    if contagem != distribuicao:
        erros.append(f"distribuição incorreta: esperado {distribuicao}, obtido {contagem}")
    return erros


def carregar(caminho) -> list[dict]:
    return json.loads(Path(caminho).read_text(encoding="utf-8"))


def main(argv=None) -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    argv = sys.argv[1:] if argv is None else argv
    caminho = Path(argv[0]) if argv else CAMINHO_PADRAO
    questoes = carregar(caminho)
    erros = verificar(questoes)
    for erro in erros:
        print(f"ERRO  {erro}")
    if erros:
        print(f"\n{len(erros)} problema(s) em {caminho}")
        return 1
    print(f"OK  {len(questoes)} questões verificadas (fórmula + força bruta onde exigido).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
```

- [ ] **Step 8: Rodar e ver passar**

Run: `python -m unittest discover -s tools -v`
Expected: PASS (38 testes)

- [ ] **Step 9: Commit**

```bash
git add tools/forca_bruta.py tools/verificar_banco.py tools/test_forca_bruta.py tools/test_verificar_banco.py
git commit -m "feat: verificador do banco com fórmula, força bruta e matriz de distribuição" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Banco de 75 questões (`data/questoes.json`)

Task de **conteúdo**. O "teste que falha primeiro" é o verificador rodando sobre o banco oficial.

**Files:**
- Create: `data/questoes.json`
- Test: `tools/test_banco_real.py`

**Interfaces:**
- Consumes: `verificar`, `carregar`, `CAMINHO_PADRAO` (Task 5); `FORCA_BRUTA` já contém os 36 ids de RESTRICAO/RECORRENCIA abaixo.
- Produces: `data/questoes.json`, uma lista de 75 objetos no formato da spec §5, lida por `src/main.js` (Task 8) e por `tools/gerar_banco.py` (Task 7).

**Regras de redação (valem para toda questão):**
- `enunciado` em português, autocontido, com fórmulas entre `$...$`. No JSON, toda barra invertida do LaTeX é dobrada (`\\binom`, `\\cdot`, `\\frac`).
- `resolucao`: de 2 a 5 passos. O primeiro identifica a ferramenta (PFC, arranjo etc.) e por que ela se aplica; o último termina com a resposta (`= 34` ou `= 151.200`).
- Em `RECORRENCIA`, a resolução **nomeia a classificação** (ordem, linear ou não, homogênea ou não) e, quando houver, confere pela fórmula fechada.
- `fonte`: `"Autoral"` ou `"Autoral (estilo ENEM)"`. Se a equipe trocar por questão real, use, por exemplo, `"ENEM 2017 (adaptada)"` e mantenha o verificador verde.

**Exemplos completos (copiar o padrão):**

```json
{
  "id": "F1-01", "fase": 1, "topico": "PFC",
  "enunciado": "No armário do aluno há 3 camisetas e 4 calças diferentes. Quantos conjuntos (camiseta + calça) distintos ele pode vestir?",
  "resposta": 12, "formula": "3*4",
  "resolucao": [
    "São duas escolhas independentes e sucessivas: camiseta (3 opções) e depois calça (4 opções).",
    "Pelo Princípio Fundamental da Contagem: $3 \\cdot 4 = 12$."
  ],
  "fonte": "Autoral"
}
```
```json
{
  "id": "F3-14", "fase": 3, "topico": "RECORRENCIA",
  "enunciado": "Doze programadores se cumprimentam, cada par uma única vez. Com $h_1 = 0$ e $h_n = h_{n-1} + (n-1)$ (quem chega cumprimenta os $n-1$ presentes), quantos cumprimentos ocorrem?",
  "resposta": 66, "formula": "apertos(12)",
  "resolucao": [
    "Quando a $n$-ésima pessoa chega, cumprimenta as $n-1$ presentes: $h_n = h_{n-1} + (n-1)$, $h_1 = 0$ — recorrência linear de 1ª ordem **não homogênea**.",
    "Desenrolando: $h_n = 0 + 1 + 2 + \\dots + (n-1) = \\frac{n(n-1)}{2} = \\binom{n}{2}$.",
    "Para $n = 12$: $\\frac{12 \\cdot 11}{2} = 66$."
  ],
  "fonte": "Autoral"
}
```
```json
{
  "id": "F4-13", "fase": 4, "topico": "RECORRENCIA",
  "enunciado": "A escada da sala dos professores tem 8 degraus. Subindo 1 ou 2 degraus por passo, de quantas maneiras diferentes se chega ao topo?",
  "resposta": 34, "formula": "escada(8)",
  "resolucao": [
    "Seja $e_n$ o número de modos de subir $n$ degraus. O último passo tem 1 degrau (restam $e_{n-1}$ modos) ou 2 (restam $e_{n-2}$).",
    "Logo $e_n = e_{n-1} + e_{n-2}$ — recorrência linear homogênea de **2ª ordem**, com $e_1 = 1$ e $e_2 = 2$.",
    "$e_3 = 3,\\ e_4 = 5,\\ e_5 = 8,\\ e_6 = 13,\\ e_7 = 21$.",
    "Conferência por combinação ($k$ passos duplos): $\\binom{8}{0}+\\binom{7}{1}+\\binom{6}{2}+\\binom{5}{3}+\\binom{4}{4} = 1+7+15+10+1$, logo $e_8 = 34$."
  ],
  "fonte": "Autoral"
}
```

**Catálogo oficial (id · tópico · enunciado · fórmula · resposta):**

*Fase 1 — Fácil (Sala de Aula)*

| id | tópico | enunciado | fórmula | resp. |
|---|---|---|---|---|
| F1-01 | PFC | No armário há 3 camisetas e 4 calças diferentes. Quantos conjuntos camiseta + calça? | `3*4` | 12 |
| F1-02 | PFC | A cantina oferece 3 entradas, 4 pratos principais e 2 sobremesas. Quantas refeições com uma opção de cada? | `3*4*2` | 24 |
| F1-03 | PFC | O cadeado do armário tem 3 rodas com algarismos de 0 a 9. Quantos códigos são possíveis? | `10**3` | 1000 |
| F1-04 | PFC | Salas são identificadas por uma letra de A a E seguida de um algarismo de 1 a 9. Quantas identificações existem? | `5*9` | 45 |
| F1-05 | PFC | Uma moeda é lançada 4 vezes e anota-se a sequência de caras e coroas. Quantas sequências são possíveis? | `2**4` | 16 |
| F1-06 | PFC | Da sala ao laboratório há 3 corredores; do laboratório à biblioteca, 2 escadas. De quantos modos se vai da sala à biblioteca passando pelo laboratório? | `3*2` | 6 |
| F1-07 | PFC | Um dado é lançado duas vezes e anota-se o par ordenado de resultados. Quantos pares são possíveis? | `6*6` | 36 |
| F1-08 | PERM | De quantas maneiras 4 alunos podem se sentar em 4 cadeiras enfileiradas? | `fat(4)` | 24 |
| F1-09 | PERM | Quantos anagramas tem a palavra LIVRO? | `fat(5)` | 120 |
| F1-10 | PERM | Seis grupos apresentarão trabalhos, um de cada vez. Quantas ordens de apresentação existem? | `fat(6)` | 720 |
| F1-11 | PERM | De quantos modos é possível empilhar 3 livros diferentes? | `fat(3)` | 6 |
| F1-12 | ARRANJO | Numa turma de 8 alunos serão eleitos representante e vice. Quantos resultados são possíveis? | `A(8,2)` | 56 |
| F1-13 | ARRANJO | Seis alunos disputam ouro, prata e bronze na olimpíada da escola. Quantos pódios diferentes podem ocorrer? | `A(6,3)` | 120 |
| F1-14 | COMB | O professor escolherá 2 de 5 alunos para a monitoria. Quantas duplas podem ser formadas? | `C(5,2)` | 10 |
| F1-15 | COMB | Você pode levar 3 dos 6 livros da estante. Quantas escolhas existem? | `C(6,3)` | 20 |

*Fase 2 — Básico (Biblioteca)*

| id | tópico | enunciado | fórmula | resp. |
|---|---|---|---|---|
| F2-01 | PFC | Códigos de livro têm 2 letras (de 26) seguidas de 3 algarismos, com repetição. Quantos códigos existem? | `26**2*10**3` | 676000 |
| F2-02 | PFC | Quantos números pares de três algarismos existem? | `9*10*5` | 450 |
| F2-03 | PERM | De quantas formas 7 livros diferentes podem ser organizados numa prateleira? | `fat(7)` | 5040 |
| F2-04 | PERM | Quantos anagramas tem a palavra ESTUDO? | `fat(6)` | 720 |
| F2-05 | PERM_REP | Quantos anagramas tem a palavra ARARA? | `PR(5,3,2)` | 10 |
| F2-06 | PERM_REP | Quantos anagramas tem a palavra BANANA? | `PR(6,3,2)` | 60 |
| F2-07 | PERM_REP | Quantos anagramas tem a palavra MATEMATICA (sem acento)? | `PR(10,2,3,2)` | 151200 |
| F2-08 | PERM_REP | Quatro exemplares idênticos de Física e dois idênticos de Química ficarão lado a lado. Quantas disposições existem? | `PR(6,4,2)` | 15 |
| F2-09 | ARRANJO | O cofre da biblioteca usa senhas de 4 algarismos distintos. Quantas senhas existem? | `A(10,4)` | 5040 |
| F2-10 | ARRANJO | Quantos números de 3 algarismos distintos podem ser formados com 1, 2, 3, 4, 5, 6 e 7? | `A(7,3)` | 210 |
| F2-11 | ARRANJO | Um clube do livro de 9 membros escolherá presidente, secretário e tesoureiro. Quantas chapas são possíveis? | `A(9,3)` | 504 |
| F2-12 | COMB | De uma lista de 10 livros, você deve escolher 4 para resenhar. Quantas escolhas? | `C(10,4)` | 210 |
| F2-13 | COMB | Uma comissão de 3 pessoas será formada entre 8 bibliotecários. Quantas comissões? | `C(8,3)` | 56 |
| F2-14 | COMB | Numa prova com 7 questões, o aluno escolhe 5 para responder. De quantos modos? | `C(7,5)` | 21 |
| F2-15 | RECORRENCIA | Quantos subconjuntos (incluindo o vazio) tem um conjunto de 6 livros? Dica do Caderno: $s_n = 2s_{n-1}$, $s_0 = 1$. | `subconjuntos(6)` | 64 |

*Fase 3 — Intermediário (Laboratório de Informática)*

| id | tópico | enunciado | fórmula | resp. |
|---|---|---|---|---|
| F3-01 | PERM_REP | Quantas senhas binárias de 8 bits têm exatamente três dígitos 1? | `PR(8,3,5)` | 56 |
| F3-02 | PERM_REP | Um robô anda numa grade só para a direita ou para cima. Quantos caminhos mínimos de (0,0) a (4,3)? | `PR(7,4,3)` | 35 |
| F3-03 | ARRANJO | Logins têm 3 letras distintas (alfabeto de 26 letras). Quantos logins existem? | `A(26,3)` | 15600 |
| F3-04 | ARRANJO | Quantos números de 4 algarismos distintos existem (o primeiro não pode ser 0)? | `9*A(9,3)` | 4536 |
| F3-05 | ARRANJO | Quatro turnos de monitoria (seg a qui) terão 4 monitores distintos escolhidos entre 12 candidatos. Quantas escalas? | `A(12,4)` | 11880 |
| F3-06 | COMB | Uma equipe de 4 programadores será escolhida entre 9. Quantas equipes? | `C(9,4)` | 126 |
| F3-07 | COMB | Marcam-se 10 pontos numa circunferência. Quantos triângulos têm vértices nesses pontos? | `C(10,3)` | 120 |
| F3-08 | COMB | Quantas diagonais tem um octógono convexo? | `C(8,2)-8` | 20 |
| F3-09 | RESTRICAO | Quantos anagramas da palavra PROVA começam por vogal? | `2*fat(4)` | 48 |
| F3-10 | RESTRICAO | Quantos anagramas da palavra CADERNO começam e terminam por consoante? | `4*3*fat(5)` | 1440 |
| F3-11 | RESTRICAO | Comissão de 4 entre 10 alunos em que Ana obrigatoriamente participa. Quantas comissões? | `C(9,3)` | 84 |
| F3-12 | RESTRICAO | Seis amigos, entre eles Bia e Caio, fazem fila. Em quantas filas Bia e Caio ficam juntos? | `2*fat(5)` | 240 |
| F3-13 | RESTRICAO | Quantos números de 3 algarismos distintos podem ser formados com 0, 1, 2, 3, 4 e 5? | `5*5*4` | 100 |
| F3-14 | RECORRENCIA | (ver exemplo completo acima) | `apertos(12)` | 66 |
| F3-15 | RECORRENCIA | O Caderno diz: $\binom{9}{3} = 84$ e $\binom{9}{4} = 126$. Pela relação de Stifel, quanto vale $\binom{10}{4}$? | `C(9,3)+C(9,4)` | 210 |

*Fase 4 — Avançado (Sala dos Professores)*

| id | tópico | enunciado | fórmula | resp. |
|---|---|---|---|---|
| F4-01 | COMB | Uma banca de 5 professores será sorteada entre 12. Quantas bancas são possíveis? | `C(12,5)` | 792 |
| F4-02 | COMB | Há 6 professores de Matemática e 4 de Física. Quantas comissões com 3 de Matemática e 2 de Física? | `C(6,3)*C(4,2)` | 120 |
| F4-03 | RESTRICAO | Entre 6 homens e 5 mulheres, quantas comissões de 4 pessoas têm pelo menos uma mulher? | `C(11,4)-C(6,4)` | 315 |
| F4-04 | RESTRICAO | Quantos anagramas da palavra PROFESSOR começam com P? | `PR(8,2,2,2)` | 5040 |
| F4-05 | RESTRICAO | Sete professores, entre eles Alberto e Bruna, posam em fila. Em quantas filas os dois NÃO ficam lado a lado? | `fat(7)-2*fat(6)` | 3600 |
| F4-06 | RESTRICAO | Quantos anagramas da palavra CADERNO têm as vogais juntas (em qualquer ordem)? | `fat(5)*fat(3)` | 720 |
| F4-07 | RESTRICAO | Em quantos anagramas da palavra LIVRO a letra L aparece antes da letra V? | `fat(5)//2` | 60 |
| F4-08 | RESTRICAO | Quantos números pares de 4 algarismos distintos existem? | `A(9,3)+4*8*A(8,2)` | 2296 |
| F4-09 | RESTRICAO | Quantas senhas de 4 dígitos (0 a 9, com repetição) têm pelo menos um dígito repetido? | `10**4-A(10,4)` | 4960 |
| F4-10 | RESTRICAO | Comissão de 5 entre 8 professores, mas Paulo e Rita não podem participar juntos. Quantas comissões? | `C(8,5)-C(6,3)` | 36 |
| F4-11 | RESTRICAO | Cinco livros distintos de Matemática e três distintos de Física numa prateleira, com os de mesma matéria juntos. Quantas arrumações? | `fat(2)*fat(5)*fat(3)` | 1440 |
| F4-12 | RESTRICAO | Quantos subconjuntos de 3 elementos de {1, …, 10} contêm pelo menos dois números consecutivos? | `C(10,3)-C(8,3)` | 64 |
| F4-13 | RECORRENCIA | (ver exemplo completo acima) | `escada(8)` | 34 |
| F4-14 | RECORRENCIA | Um corredor 2 × 7 será coberto com dominós 2 × 1, sem sobras nem sobreposição. De quantas maneiras? | `escada(7)` | 21 |
| F4-15 | RECORRENCIA | Quantas senhas binárias de 9 bits não têm dois dígitos 1 consecutivos? ($b_n = b_{n-1} + b_{n-2}$, $b_1 = 2$, $b_2 = 3$) | `escada(10)` | 89 |

*Fase 5 — Difícil (Cofre da Diretoria)*

| id | tópico | enunciado | fórmula | resp. |
|---|---|---|---|---|
| F5-01 | RESTRICAO | Comissão de 5 pessoas entre 7 alunos e 5 professores, com pelo menos 2 professores. Quantas comissões? | `C(12,5)-C(7,5)-C(5,1)*C(7,4)` | 596 |
| F5-02 | RESTRICAO | Quantos anagramas da palavra COMBINAR começam por consoante e terminam por vogal? | `5*3*fat(6)` | 10800 |
| F5-03 | RESTRICAO | Em quantos anagramas da palavra ESCOLA não há duas vogais vizinhas? | `fat(3)*A(4,3)` | 144 |
| F5-04 | RESTRICAO | Quantos números de 5 algarismos distintos são divisíveis por 5? | `A(9,4)+8*A(8,3)` | 5712 |
| F5-05 | RESTRICAO | Quantos caminhos mínimos (direita/cima) de (0,0) a (6,4) passam pelo ponto (2,2)? | `C(4,2)*C(6,2)` | 90 |
| F5-06 | RESTRICAO | Quantos caminhos mínimos de (0,0) a (5,5) NÃO passam por (2,2), onde há um sensor do alarme? | `C(10,5)-C(4,2)*C(6,3)` | 132 |
| F5-07 | RESTRICAO | Oito alunos serão divididos em 2 grupos de 4, sem nome nem ordem entre os grupos. De quantas maneiras? | `C(8,4)//2` | 35 |
| F5-08 | RESTRICAO | Quatro casais posam em fila e cada casal deve ficar junto. Quantas filas são possíveis? | `fat(4)*2**4` | 384 |
| F5-09 | RESTRICAO | De 5 casais, escolhem-se 4 pessoas sem que haja um casal entre elas. Quantas escolhas? | `C(5,4)*2**4` | 80 |
| F5-10 | RESTRICAO | Quantos anagramas da palavra ARARAQUARA começam com Q? | `PR(9,5,3)` | 504 |
| F5-11 | RESTRICAO | Senha de 4 caracteres, cada um vogal (A, E, I, O, U) ou algarismo, com repetição, e exatamente 2 vogais. Quantas senhas? | `C(4,2)*5**2*10**2` | 15000 |
| F5-12 | RESTRICAO | Quantos subconjuntos de 4 elementos de {1, …, 12} não têm dois números consecutivos? | `C(9,4)` | 126 |
| F5-13 | RECORRENCIA | Cinco professores fazem amigo secreto e ninguém pode tirar o próprio nome. Com $D_1=0$, $D_2=1$ e $D_n=(n-1)(D_{n-1}+D_{n-2})$, quantos sorteios válidos? | `desarranjo(5)` | 44 |
| F5-14 | RECORRENCIA | O professor devolve aleatoriamente 6 provas a seus 6 donos. Em quantas distribuições exatamente 2 alunos recebem a própria prova? | `C(6,2)*desarranjo(4)` | 135 |
| F5-15 | RECORRENCIA | Quantos caminhos mínimos de (0,0) a (4,4) nunca passam acima da diagonal $y = x$? (Recorrência não linear de Catalan.) | `catalan(4)` | 14 |

- [ ] **Step 1: Escrever o teste do banco oficial (falha)**

`tools/test_banco_real.py`:
```python
import unittest

from verificar_banco import CAMINHO_PADRAO, carregar, verificar


class TestBancoOficial(unittest.TestCase):
    def test_banco_oficial_passa_em_todas_as_verificacoes(self):
        erros = verificar(carregar(CAMINHO_PADRAO))
        self.assertEqual(erros, [], "\n".join(erros))


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `python -m unittest discover -s tools -v`
Expected: FAIL em `test_banco_oficial_...` com `FileNotFoundError` (`data/questoes.json` ainda não existe)

- [ ] **Step 3: Escrever a Fase 1 e rodar o verificador**

Criar `data/questoes.json` com as 15 questões da Fase 1, no padrão dos exemplos.
Run: `python tools/verificar_banco.py`
Expected: só sobra o erro de `distribuição incorreta` (fases 2–5 ainda faltam) e a lista de `força bruta sem questão` das fases ainda não escritas. Nenhum erro de fórmula, resolução ou estrutura em F1-xx.

- [ ] **Step 4: Escrever a Fase 2 e rodar o verificador**

Acrescentar F2-01 a F2-15. Run: `python tools/verificar_banco.py`
Expected: nenhum erro em F1-xx/F2-xx (F2-15 confere com a força bruta).

- [ ] **Step 5: Escrever a Fase 3 e rodar o verificador**

Acrescentar F3-01 a F3-15. Run: `python tools/verificar_banco.py`
Expected: nenhum erro em F1–F3.

- [ ] **Step 6: Escrever a Fase 4 e rodar o verificador**

Acrescentar F4-01 a F4-15. Run: `python tools/verificar_banco.py`
Expected: nenhum erro em F1–F4.

- [ ] **Step 7: Escrever a Fase 5 e rodar o verificador**

Acrescentar F5-01 a F5-15. Run: `python tools/verificar_banco.py`
Expected: `OK  75 questões verificadas (fórmula + força bruta onde exigido).`

- [ ] **Step 8: Rodar a suíte Python inteira**

Run: `python -m unittest discover -s tools -v`
Expected: PASS (39 testes)

- [ ] **Step 9: Commit**

```bash
git add data/questoes.json tools/test_banco_real.py
git commit -m "feat: banco de 75 questões verificadas por fórmula e força bruta" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

> **Revisão humana obrigatória (PDF §4):** a equipe lê cada enunciado e resolução de `docs/BANCO_DE_QUESTOES.md` (Task 7) e confirma a clareza. O verificador garante as contas, não a redação.

---

### Task 7: Gerador do documento do banco (entrega 3)

**Files:**
- Create: `tools/gerar_banco.py`
- Generated: `docs/BANCO_DE_QUESTOES.md`
- Test: `tools/test_gerar_banco.py`

**Interfaces:**
- Consumes: `verificar`, `carregar`, `CAMINHO_PADRAO`, `RAIZ` (Task 5).
- Produces: `gerar_markdown(questoes) -> str`; `main(argv) -> int` (0 = gerado; 1 = banco inválido, nada é escrito).

- [ ] **Step 1: Escrever os testes (falham)**

`tools/test_gerar_banco.py`:
```python
import json
import tempfile
import unittest
from pathlib import Path

from gerar_banco import gerar_markdown, main

Q1 = {"id": "F1-01", "fase": 1, "topico": "PFC", "enunciado": "Camisetas e calças?",
      "resposta": 12, "formula": "3*4", "resolucao": ["3 e 4 opções.", "$3 \\cdot 4 = 12$"], "fonte": "Autoral"}
Q2 = {"id": "F2-01", "fase": 2, "topico": "PERM_REP", "enunciado": "Anagramas de ARARA?",
      "resposta": 10, "formula": "PR(5,3,2)", "resolucao": ["5 letras: A×3, R×2.", "$\\frac{5!}{3!\\,2!} = 10$"],
      "fonte": "Autoral"}


class TestGerarMarkdown(unittest.TestCase):
    def test_agrupa_por_fase_em_ordem(self):
        md = gerar_markdown([Q2, Q1])
        self.assertLess(md.index("## Fase 1"), md.index("### F1-01"))
        self.assertLess(md.index("### F1-01"), md.index("## Fase 2"))
        self.assertLess(md.index("## Fase 2"), md.index("### F2-01"))

    def test_inclui_enunciado_resolucao_numerada_resposta_e_topico(self):
        md = gerar_markdown([Q2])
        self.assertIn("Anagramas de ARARA?", md)
        self.assertIn("1. 5 letras: A×3, R×2.", md)
        self.assertIn("2. $\\frac{5!}{3!\\,2!} = 10$", md)
        self.assertIn("**Resposta:** 10", md)
        self.assertIn("Permutação com repetição", md)


class TestMain(unittest.TestCase):
    def test_nao_gera_documento_se_o_banco_tem_erros(self):
        with tempfile.TemporaryDirectory() as pasta:
            entrada = Path(pasta) / "q.json"
            saida = Path(pasta) / "saida.md"
            entrada.write_text(json.dumps([dict(Q1, formula="3*5")]), encoding="utf-8")
            self.assertEqual(main([str(entrada), str(saida)]), 1)
            self.assertFalse(saida.exists())


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `python -m unittest discover -s tools -v`
Expected: FAIL com `ModuleNotFoundError: No module named 'gerar_banco'`

- [ ] **Step 3: Implementar `tools/gerar_banco.py`**

```python
"""Gera docs/BANCO_DE_QUESTOES.md a partir de data/questoes.json (entrega 3).

Uso: python tools/gerar_banco.py [entrada.json] [saida.md]
Recusa-se a gerar o documento se o banco não passar no verificador.
"""
import sys
from pathlib import Path

from verificar_banco import CAMINHO_PADRAO, RAIZ, carregar, verificar

SAIDA_PADRAO = RAIZ / "docs" / "BANCO_DE_QUESTOES.md"

FASES = {
    1: ("Fácil", "Sala de Aula"),
    2: ("Básico", "Biblioteca"),
    3: ("Intermediário", "Laboratório de Informática"),
    4: ("Avançado", "Sala dos Professores"),
    5: ("Difícil", "Cofre da Diretoria"),
}

NOMES_TOPICO = {
    "PFC": "Princípio Fundamental da Contagem",
    "PERM": "Permutação simples",
    "PERM_REP": "Permutação com repetição",
    "ARRANJO": "Arranjo simples",
    "COMB": "Combinação simples",
    "RESTRICAO": "Problemas com restrições e integração de conceitos",
    "RECORRENCIA": "Recorrência aplicada à contagem",
}


def gerar_markdown(questoes) -> str:
    linhas = [
        "# Banco de Questões — Professor Run",
        "",
        "Documento gerado a partir de `data/questoes.json`. Toda resposta foi conferida pela fórmula "
        "e, nos problemas com restrição ou recorrência, também por força bruta "
        "(`python tools/verificar_banco.py`).",
        "",
    ]
    for fase in sorted({q["fase"] for q in questoes}):
        nivel, sala = FASES[fase]
        linhas += [f"## Fase {fase} — {nivel} ({sala})", ""]
        for q in sorted((q for q in questoes if q["fase"] == fase), key=lambda q: q["id"]):
            linhas += [f"### {q['id']} · {NOMES_TOPICO[q['topico']]}", "", q["enunciado"], "", "**Resolução:**", ""]
            linhas += [f"{i}. {passo}" for i, passo in enumerate(q["resolucao"], start=1)]
            linhas += [
                "",
                f"**Resposta:** {q['resposta']}  ",
                f"**Fórmula verificada:** `{q['formula']}`  ",
                f"**Fonte:** {q['fonte']}",
                "",
            ]
    return "\n".join(linhas)


def main(argv=None) -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    argv = sys.argv[1:] if argv is None else argv
    entrada = Path(argv[0]) if len(argv) > 0 else CAMINHO_PADRAO
    saida = Path(argv[1]) if len(argv) > 1 else SAIDA_PADRAO
    questoes = carregar(entrada)
    if verificar(questoes):
        print("Banco com erros: documento NÃO gerado. Rode: python tools/verificar_banco.py")
        return 1
    saida.parent.mkdir(parents=True, exist_ok=True)
    saida.write_text(gerar_markdown(questoes), encoding="utf-8")
    print(f"OK  {saida} gerado com {len(questoes)} questões.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
```

- [ ] **Step 4: Rodar e ver passar**

Run: `python -m unittest discover -s tools -v`
Expected: PASS (42 testes)

- [ ] **Step 5: Gerar o documento real**

Run: `python tools/gerar_banco.py`
Expected: `OK  ...docs\BANCO_DE_QUESTOES.md gerado com 75 questões.` Abrir o arquivo e conferir que as 5 fases aparecem em ordem.

- [ ] **Step 6: Commit**

```bash
git add tools/gerar_banco.py tools/test_gerar_banco.py docs/BANCO_DE_QUESTOES.md
git commit -m "feat: gerador do documento do banco de questões" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Interface jogável (telas, salas, enigma, HUD, áudio)

Camada de DOM, arte e áudio. Pela exceção aprovada, é verificada por roteiro no navegador em vez de testes unitários. Toda a lógica que ela usa já está testada (Tasks 1–3).

**Files:**
- Create: `index.html`, `css/style.css`, `src/narrativa.js`, `src/art/salas.js`, `src/audio/audio.js`
- Create: `src/ui/telas.js`, `src/ui/hud.js`, `src/ui/sala.js`, `src/ui/enigma.js`, `src/ui/feedback.js`, `src/ui/matematica.js`, `src/main.js`
- Create: `.claude/launch.json`

**Interfaces:**
- Consumes: `FASES`, `TEMPO_LIMITE_S`, `MAX_ERROS`; `agruparPorFase`; `criarJogo`; `criarCadeado`; `formatarTempo`, `formatarNumero`; `tempoLimiteDaUrl`.
- Produces (usados na Task 9):
  - `SALAS[n] = { fundo: string, objetos: Array<{id, nome, x, y, desenho}>, ferramenta?: {id, nome, x, y, desenho} }`
  - `renderizarSala(cena: HTMLElement, estado, { aoClicarObjeto(objeto), aoClicarFerramenta(id) })`
  - `tocar(nome)`, `iniciarMusica(fase)`, `pararMusica()`, `alternarMudo(): boolean`, `estaMudo(): boolean`
  - `mostrarTela(id)`, `mostrarHistoria({titulo, texto, botao}) => Promise`
  - `abrirEnigma({ questao, objeto, aoEnviar(valor) })`, `fecharEnigma()`
  - `mostrarFeedback({ correta, questao }) => Promise`
  - `renderizarMatematica(elemento)`

- [ ] **Step 1: `index.html`**

```html
<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Professor Run — Escape Room Combinatório</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js"></script>
  <link rel="stylesheet" href="css/style.css">
  <script type="module" src="src/main.js"></script>
</head>
<body>
  <main id="app">
    <section id="tela-inicio" class="tela ativa">
      <h1 class="titulo">Professor Run</h1>
      <p class="subtitulo">Escape Room de Análise Combinatória</p>
      <button id="btn-comecar" class="btn-primario">Começar</button>
      <button id="btn-como-jogar" class="btn-secundario">Como jogar</button>
      <div id="como-jogar" class="painel oculto">
        <p>Você está trancado no prédio da faculdade. Cada sala tem objetos com cadeados: clique num objeto, resolva o problema de contagem e digite a resposta — ela é o código do cadeado.</p>
        <ul>
          <li>5 salas e 12 cadeados no total (1 + 2 + 2 + 3 + 4).</li>
          <li>Errou? O alarme sobe um nível e o objeto recebe um novo enigma. Seus acertos ficam guardados.</li>
          <li>Você perde se o alarme chegar a 6 ou se o relógio de 40 minutos zerar.</li>
          <li>Teclado: algarismos para digitar, Backspace para apagar, Enter para abrir e Esc para fechar.</li>
        </ul>
      </div>
      <p id="erro-carga" class="erro-carga" role="alert"></p>
    </section>

    <section id="tela-historia" class="tela">
      <div class="caixa-historia">
        <h2 id="historia-titulo"></h2>
        <p id="historia-texto"></p>
        <button id="btn-historia" class="btn-primario">Continuar</button>
      </div>
    </section>

    <section id="tela-sala" class="tela">
      <header id="hud" aria-label="Progresso">
        <div class="hud-item"><span class="hud-rotulo">Sala</span><span id="hud-sala"></span></div>
        <div class="hud-item"><span class="hud-rotulo">Fase</span><span id="hud-fase"></span></div>
        <div class="hud-item"><span class="hud-rotulo">Trancas</span><span id="hud-trancas"></span></div>
        <div class="hud-item"><span class="hud-rotulo">Acertos</span><span id="hud-acertos"></span></div>
        <div class="hud-item"><span class="hud-rotulo">Alarme</span><span id="hud-alarme"></span></div>
        <div class="hud-item"><span class="hud-rotulo">Tempo</span><span id="hud-relogio"></span></div>
      </header>
      <div id="cena"></div>
    </section>

    <section id="tela-vitoria" class="tela">
      <h1 class="titulo">Você escapou!</h1>
      <p id="vitoria-texto" class="painel"></p>
      <p id="vitoria-stats" class="resultado-stats"></p>
      <button class="btn-primario btn-nova-partida">Nova partida</button>
    </section>

    <section id="tela-derrota" class="tela">
      <h1 id="derrota-titulo" class="titulo"></h1>
      <p id="derrota-texto" class="painel"></p>
      <p id="derrota-stats" class="resultado-stats"></p>
      <button class="btn-primario btn-nova-partida">Nova partida</button>
    </section>
  </main>

  <div id="modal-enigma" class="modal oculto" role="dialog" aria-modal="true" aria-labelledby="enigma-objeto">
    <div class="modal-caixa">
      <button id="enigma-fechar" class="btn-fechar" aria-label="Fechar">×</button>
      <h2 id="enigma-objeto"></h2>
      <p id="enigma-enunciado" class="enunciado"></p>
      <div class="cadeado">
        <output id="cadeado-visor" aria-live="polite">—</output>
        <div id="cadeado-teclas">
          <button data-tecla="1">1</button><button data-tecla="2">2</button><button data-tecla="3">3</button>
          <button data-tecla="4">4</button><button data-tecla="5">5</button><button data-tecla="6">6</button>
          <button data-tecla="7">7</button><button data-tecla="8">8</button><button data-tecla="9">9</button>
          <button data-tecla="limpar" aria-label="Limpar">C</button><button data-tecla="0">0</button><button data-tecla="apagar" aria-label="Apagar">⌫</button>
          <button data-tecla="abrir" class="abrir">Abrir cadeado</button>
        </div>
      </div>
    </div>
  </div>

  <div id="modal-feedback" class="modal oculto" role="dialog" aria-modal="true" aria-labelledby="feedback-titulo">
    <div class="modal-caixa">
      <h2 id="feedback-titulo"></h2>
      <p id="feedback-resposta"></p>
      <details id="feedback-detalhes"><summary>Ver resolução</summary><ol id="feedback-resolucao"></ol></details>
      <button id="btn-feedback" class="btn-primario">Continuar</button>
    </div>
  </div>

  <div id="transicao" aria-hidden="true"></div>
  <button id="btn-som" class="btn-som" aria-label="Ligar ou desligar o som">🔊</button>
</body>
</html>
```

- [ ] **Step 2: `css/style.css`**

```css
:root {
  --fundo: #0e1020; --painel: #1b1f3a; --painel-2: #252a4d; --texto: #eef0ff; --texto-suave: #aab0d6;
  --destaque: #ffcc4d; --sucesso: #4ade80; --perigo: #f87171; --borda: #3a4070;
  --fonte: "Segoe UI", system-ui, -apple-system, Roboto, sans-serif;
}
* { box-sizing: border-box; }
html, body { margin: 0; min-height: 100%; }
body { background: var(--fundo); color: var(--texto); font-family: var(--fonte); overflow-x: hidden; }
button { font: inherit; cursor: pointer; }
.oculto { display: none !important; }

#app { position: relative; min-height: 100vh; }
.tela {
  position: absolute; inset: 0; overflow-y: auto; display: flex; flex-direction: column; align-items: center;
  justify-content: center; gap: 1rem; padding: 16px; opacity: 0; visibility: hidden; transform: scale(1.02);
  transition: opacity .6s ease, transform .6s ease, visibility 0s linear .6s;
}
.tela.ativa { opacity: 1; visibility: visible; transform: none; transition: opacity .6s ease, transform .6s ease; }

.titulo { font-size: clamp(2.4rem, 8vw, 4.5rem); margin: 0; text-align: center; letter-spacing: .05em; color: var(--destaque);
  text-shadow: 0 0 24px rgba(255, 204, 77, .35); animation: piscar-luz 4s infinite; }
.subtitulo { margin: 0; color: var(--texto-suave); text-align: center; }
@keyframes piscar-luz { 0%, 92%, 100% { opacity: 1 } 94% { opacity: .4 } 96% { opacity: .9 } 98% { opacity: .5 } }

.btn-primario, .btn-secundario { border-radius: 10px; padding: .8rem 1.6rem; border: 2px solid var(--destaque); transition: transform .15s, filter .15s; }
.btn-primario { background: var(--destaque); color: #1a1400; font-weight: 700; }
.btn-secundario { background: transparent; color: var(--destaque); }
.btn-primario:hover, .btn-secundario:hover { filter: brightness(1.1); transform: translateY(-1px); }
.btn-primario:disabled { opacity: .5; cursor: not-allowed; }
.painel { background: var(--painel); border: 1px solid var(--borda); border-radius: 12px; padding: 1rem 1.25rem; max-width: 640px; line-height: 1.5; }
.erro-carga { color: var(--perigo); max-width: 640px; text-align: center; }

.caixa-historia { max-width: 680px; background: var(--painel); border: 1px solid var(--borda); border-radius: 14px;
  padding: 1.5rem; line-height: 1.6; animation: surgir .7s ease both; }
.caixa-historia h2 { margin-top: 0; color: var(--destaque); }
@keyframes surgir { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: none } }

#tela-sala { justify-content: flex-start; }
#hud { width: 100%; max-width: 1000px; display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: .5rem;
  background: var(--painel); border: 1px solid var(--borda); border-radius: 12px; padding: .6rem .9rem; }
.hud-item { display: flex; flex-direction: column; gap: .15rem; }
.hud-rotulo { font-size: .75rem; color: var(--texto-suave); text-transform: uppercase; letter-spacing: .06em; }
#hud-relogio { font-variant-numeric: tabular-nums; font-size: 1.2rem; font-weight: 700; }
#hud-relogio.critico { color: var(--perigo); animation: pulsar 1s infinite; }
#hud-alarme { display: flex; gap: 4px; align-items: center; min-height: 1.2rem; }
#hud-alarme .nivel { width: 16px; height: 12px; border-radius: 3px; background: var(--painel-2); border: 1px solid var(--borda); }
#hud-alarme .nivel.ligado { background: var(--perigo); box-shadow: 0 0 8px var(--perigo); }
#hud-alarme.critico .nivel.ligado { animation: pulsar .6s infinite; }
@keyframes pulsar { 50% { opacity: .45 } }

#cena { width: 100%; max-width: 1000px; }
.svg-sala { width: 100%; height: auto; display: block; border-radius: 12px; border: 1px solid var(--borda); }
.objeto { cursor: pointer; outline: none; transition: filter .2s; }
.objeto:not(.resolvido):hover, .objeto:not(.resolvido):focus-visible { filter: drop-shadow(0 0 10px var(--destaque)); }
.objeto.resolvido { cursor: default; opacity: .7; }
.selo-fechado { animation: pulsar 2s infinite; }
.giz { fill: #f4f4f4; font: 22px "Segoe Print", "Comic Sans MS", cursive; }
.rotulo-svg { fill: #fff; font: 14px var(--fonte); }
.porta-folha { fill: #5b3a22; stroke: #2e1d10; stroke-width: 4; }
.macaneta { fill: var(--destaque); }
.tranca rect { fill: #c9c9c9; stroke: #555; stroke-width: 2; transition: fill .4s; }
.tranca .haste { fill: none; stroke: #c9c9c9; stroke-width: 4; transition: transform .5s ease, stroke .4s; }
.tranca.aberta rect { fill: var(--sucesso); }
.tranca.aberta .haste { transform: translateY(-7px); stroke: var(--sucesso); }
.tremer { animation: tremer .45s; }
@keyframes tremer { 20%, 60% { transform: translateX(-8px) } 40%, 80% { transform: translateX(8px) } }

.modal { position: fixed; inset: 0; background: rgba(5, 6, 15, .78); display: flex; align-items: center; justify-content: center;
  padding: 16px; z-index: 10; animation: surgir .3s ease both; }
.modal-caixa { background: var(--painel); border: 1px solid var(--borda); border-radius: 14px; padding: 1.25rem; width: min(640px, 100%);
  max-height: 90vh; overflow-y: auto; }
.modal-caixa h2 { margin: 0 0 .5rem; color: var(--destaque); }
.enunciado { line-height: 1.6; font-size: 1.05rem; }
.cadeado { display: grid; gap: .6rem; justify-items: center; margin-top: 1rem; }
#cadeado-visor { min-width: 12ch; text-align: center; font: 700 1.8rem ui-monospace, Consolas, monospace; letter-spacing: .15em;
  background: #0a0c18; border: 2px solid var(--borda); border-radius: 8px; padding: .4rem .8rem; }
#cadeado-teclas { display: grid; grid-template-columns: repeat(3, 64px); gap: .5rem; }
#cadeado-teclas button { height: 52px; border-radius: 10px; border: 1px solid var(--borda); background: var(--painel-2); color: var(--texto); font-size: 1.2rem; }
#cadeado-teclas button:active { transform: scale(.95); }
#cadeado-teclas .abrir { grid-column: span 3; background: var(--destaque); color: #1a1400; font-weight: 700; }
.btn-fechar { float: right; background: none; border: none; color: var(--texto-suave); font-size: 1.4rem; }
#modal-feedback.correto h2 { color: var(--sucesso); }
#modal-feedback.errado h2 { color: var(--perigo); }
#feedback-resolucao { line-height: 1.6; }
#btn-feedback { margin-top: 1rem; }

#transicao { position: fixed; inset: 0; background: #000; opacity: 0; pointer-events: none; transition: opacity .45s ease; z-index: 20; }
#transicao.ativa { opacity: 1; }

.btn-som { position: fixed; right: 16px; bottom: 16px; z-index: 30; width: 48px; height: 48px; border-radius: 50%;
  border: 1px solid var(--borda); background: var(--painel); color: var(--texto); font-size: 1.3rem; }
.resultado-stats { color: var(--texto-suave); text-align: center; }
#tela-vitoria .titulo { color: var(--sucesso); }
#tela-derrota .titulo { color: var(--perigo); animation: pulsar 1.2s infinite; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

- [ ] **Step 3: `src/narrativa.js`**

```js
export const INTRO = {
  titulo: 'Véspera da P2',
  texto: 'Você estudou até tarde na faculdade e cochilou sobre o caderno. Ao acordar, as luzes piscam e todas as portas estão trancadas. Na lousa, um bilhete: "Quem domina a contagem encontra a saída. — Prof. Pascoal Fatorial". O segurança fecha o prédio em 40 minutos. E cuidado: cada código errado aciona o alarme.',
};

export const ENTRADAS = {
  1: { titulo: 'Sala de Aula', texto: 'A lousa ainda guarda a aula de hoje. No canto, o professor escreveu: "Contar é multiplicar escolhas." A porta tem 1 tranca.' },
  2: { titulo: 'Biblioteca', texto: 'Estantes até o teto e cheiro de livro velho. Um marcador de página avisa: "Letras repetidas não mudam o anagrama — divida pelas repetições." A porta tem 2 trancas.' },
  3: { titulo: 'Laboratório de Informática', texto: 'Os computadores ligam sozinhos e um terminal pisca. Na parede, o Quadro de Pascal espera ser completado. Pense: a ordem importa (arranjo) ou não importa (combinação)? A porta tem 2 trancas.' },
  4: { titulo: 'Sala dos Professores', texto: 'Café frio, provas corrigidas e o famoso Caderno de Recorrências aberto sobre a mesa. Agora há restrições: às vezes é mais fácil contar o que NÃO pode e subtrair. A porta tem 3 trancas.' },
  5: { titulo: 'Cofre da Diretoria', texto: 'O cofre guarda a chave mestra do prédio. Quatro painéis, quatro códigos. Último recado do professor: "Integre tudo o que aprendeu." O cofre tem 4 trancas.' },
};

export const VITORIA = {
  texto: 'O último painel acende em verde e o cofre se abre: lá dentro, a chave mestra e um bilhete — "Parabéns, você está pronto para a P2. — Prof. Pascoal Fatorial". Você sai do prédio segundos antes de o portão fechar.',
};

export const DERROTA = {
  tempo: { titulo: 'O prédio fechou!', texto: 'O relógio chegou ao fim e o segurança trancou o portão. Vai ser uma longa noite com os livros... Tente de novo e conte mais rápido!' },
  erros: { titulo: 'O alarme disparou!', texto: 'Códigos errados demais acionaram o alarme. O segurança encontrou você antes da saída. Revise as resoluções e tente outra vez.' },
};
```

- [ ] **Step 4: `src/art/salas.js`**

```js
// Cenários SVG autorais (viewBox 0 0 800 450). A faixa x 650–760 fica livre
// para a porta com as trancas, desenhada por src/ui/sala.js.
const parede = (cor) => `<rect width="800" height="330" fill="${cor}"/>`;
const chao = (cor) => `<rect y="330" width="800" height="120" fill="${cor}"/><rect y="326" width="800" height="6" fill="#000" opacity=".35"/>`;
const rotulo = (texto, x, y) => `<text x="${x}" y="${y}" class="rotulo-svg" text-anchor="middle">${texto}</text>`;
const janela = (x, y) => `<g transform="translate(${x} ${y})"><rect width="110" height="90" fill="#0b1630" stroke="#6b6f86" stroke-width="6"/><circle cx="78" cy="28" r="11" fill="#f4f1c9"/><line x1="55" y1="0" x2="55" y2="90" stroke="#6b6f86" stroke-width="4"/><line x1="0" y1="45" x2="110" y2="45" stroke="#6b6f86" stroke-width="4"/></g>`;
const relogioParede = (x, y) => `<g transform="translate(${x} ${y})"><circle r="26" fill="#f5f5f5" stroke="#333" stroke-width="4"/><line x2="0" y2="-16" stroke="#333" stroke-width="3"/><line x2="13" y2="6" stroke="#c0392b" stroke-width="3"/></g>`;
const carteira = (x) => `<g transform="translate(${x} 300)"><rect width="90" height="12" fill="#8b5a2b"/><rect x="8" y="12" width="6" height="40" fill="#5b3a1a"/><rect x="76" y="12" width="6" height="40" fill="#5b3a1a"/></g>`;
const CORES_LIVROS = ['#c0392b', '#2980b9', '#27ae60', '#f39c12', '#8e44ad', '#16a085', '#d35400'];
const estante = (x) => `<g transform="translate(${x} 40)"><rect width="150" height="290" fill="#5b3a22"/>${[0, 1, 2, 3]
  .map((i) => `<rect x="8" y="${10 + i * 70}" width="134" height="60" fill="#3a2414"/>${[0, 1, 2, 3, 4, 5, 6]
    .map((j) => `<rect x="${12 + j * 18}" y="${18 + i * 70}" width="14" height="52" fill="${CORES_LIVROS[(i + j) % 7]}"/>`).join('')}`)
  .join('')}</g>`;
const mesa = (x, y, w) => `<g transform="translate(${x} ${y})"><rect width="${w}" height="14" fill="#7a5230"/><rect x="10" y="14" width="8" height="${330 - y + 30}" fill="#4d331d"/><rect x="${w - 18}" y="14" width="8" height="${330 - y + 30}" fill="#4d331d"/></g>`;
const monitor = `<rect width="130" height="90" rx="6" fill="#222" stroke="#555" stroke-width="4"/><rect x="10" y="10" width="110" height="64" fill="#0b1a10"/><text x="18" y="40" fill="#4ade80" font-family="monospace" font-size="14">&gt; senha_</text><rect x="55" y="90" width="20" height="20" fill="#444"/><rect x="30" y="108" width="70" height="8" fill="#555"/>`;
const painelCofre = (letra) => `<rect width="240" height="105" rx="8" fill="#2c3e50" stroke="#95a5a6" stroke-width="4"/><circle cx="55" cy="52" r="30" fill="#7f8c8d" stroke="#bdc3c7" stroke-width="4"/><line x1="55" y1="52" x2="55" y2="28" stroke="#ecf0f1" stroke-width="4"/>${rotulo(`Painel ${letra}`, 160, 58)}`;

export const SALAS = {
  1: {
    fundo: parede('#34395a') + chao('#3b2c20') + janela(40, 60) + relogioParede(570, 70) + carteira(70) + carteira(210) + carteira(350) + carteira(490),
    objetos: [
      { id: 'lousa', nome: 'Lousa do professor', x: 200, y: 50,
        desenho: `<rect width="300" height="160" rx="4" fill="#1f4d3a" stroke="#8b5a2b" stroke-width="10"/><text x="24" y="60" class="giz">n! = n·(n−1)!</text><text x="24" y="110" class="giz">P.F.C.</text>${rotulo('Lousa', 150, 185)}` },
    ],
  },
  2: {
    fundo: parede('#4a3426') + chao('#2a1d14') + estante(20) + estante(480),
    objetos: [
      { id: 'livro-antigo', nome: 'Livro antigo no atril', x: 200, y: 170,
        desenho: `<rect x="40" y="70" width="40" height="90" fill="#6d4c2f"/><path d="M0 70 L60 48 L120 70 L60 88 Z" fill="#f3e9d2" stroke="#8b6b45" stroke-width="3"/>${rotulo('Livro antigo', 60, 180)}` },
      { id: 'fichario', nome: 'Fichário da biblioteca', x: 350, y: 160,
        desenho: `<rect width="100" height="150" fill="#7f8c8d" stroke="#2c3e50" stroke-width="3"/>${[0, 1, 2].map((i) => `<rect x="10" y="${12 + i * 46}" width="80" height="36" fill="#95a5a6" stroke="#2c3e50"/><rect x="40" y="${26 + i * 46}" width="20" height="6" fill="#2c3e50"/>`).join('')}${rotulo('Fichário', 50, 170)}` },
    ],
  },
  3: {
    fundo: parede('#1e2a38') + chao('#2b2f36') + mesa(30, 270, 400),
    objetos: [
      { id: 'computador', nome: 'Computador do laboratório', x: 60, y: 150, desenho: `${monitor}${rotulo('Computador', 65, 140)}` },
      { id: 'servidor', nome: 'Rack do servidor', x: 470, y: 110,
        desenho: `<rect width="100" height="215" rx="4" fill="#111" stroke="#444" stroke-width="3"/>${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="10" y="${12 + i * 33}" width="80" height="24" fill="#222"/><circle cx="78" cy="${24 + i * 33}" r="4" fill="${i % 2 ? '#4ade80' : '#f87171'}" class="selo-fechado"/>`).join('')}${rotulo('Servidor', 50, 235)}` },
    ],
  },
  4: {
    fundo: parede('#3d3a2f') + chao('#2e261c') + janela(530, 50) + mesa(40, 280, 260),
    objetos: [
      { id: 'cafeteira', nome: 'Cafeteira', x: 70, y: 200,
        desenho: `<rect width="70" height="80" rx="6" fill="#444"/><rect x="10" y="30" width="50" height="40" fill="#6b3e1f" opacity=".85"/><rect x="20" y="-12" width="30" height="12" fill="#222"/>${rotulo('Cafeteira', 35, 100)}` },
      { id: 'armario', nome: 'Armário de provas', x: 180, y: 70,
        desenho: `<rect width="120" height="210" fill="#6b5b3e" stroke="#3b3222" stroke-width="4"/><line x1="60" y1="0" x2="60" y2="210" stroke="#3b3222" stroke-width="3"/><circle cx="50" cy="105" r="4" fill="#ffcc4d"/><circle cx="70" cy="105" r="4" fill="#ffcc4d"/>${rotulo('Armário', 60, 230)}` },
      { id: 'mural', nome: 'Mural de avisos', x: 340, y: 60,
        desenho: `<rect width="160" height="110" fill="#b58b5a" stroke="#6b4f2f" stroke-width="6"/><rect x="15" y="15" width="50" height="40" fill="#fff8c4" transform="rotate(-4 40 35)"/><rect x="85" y="20" width="55" height="45" fill="#d6f5ff" transform="rotate(3 112 42)"/><rect x="40" y="62" width="60" height="38" fill="#ffd6e0"/>${rotulo('Mural', 80, 130)}` },
    ],
  },
  5: {
    fundo: parede('#1a1a24') + chao('#121218') + `<rect x="40" y="40" width="600" height="275" rx="14" fill="#3b4652" stroke="#95a5a6" stroke-width="6"/>`,
    objetos: [
      { id: 'painel-a', nome: 'Painel A do cofre', x: 70, y: 60, desenho: painelCofre('A') },
      { id: 'painel-b', nome: 'Painel B do cofre', x: 370, y: 60, desenho: painelCofre('B') },
      { id: 'painel-c', nome: 'Painel C do cofre', x: 70, y: 190, desenho: painelCofre('C') },
      { id: 'painel-d', nome: 'Painel D do cofre', x: 370, y: 190, desenho: painelCofre('D') },
    ],
  },
};
```

- [ ] **Step 5: `src/audio/audio.js`**

```js
// Todo o som é sintetizado com Web Audio API: sem arquivos e sem questões de licença.
let ctx = null;
let mestre = null;
let mudo = lerMudo();
let musica = null;

function lerMudo() {
  try { return localStorage.getItem('pr-mudo') === '1'; } catch { return false; }
}
function salvarMudo() {
  try { localStorage.setItem('pr-mudo', mudo ? '1' : '0'); } catch { /* armazenamento indisponível */ }
}

function contexto() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    mestre = ctx.createGain();
    mestre.gain.value = mudo ? 0 : 1;
    mestre.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function nota(freq, inicio, dur, tipo = 'sine', vol = 0.15) {
  const c = contexto();
  if (!c) return;
  const osc = c.createOscillator();
  const ganho = c.createGain();
  osc.type = tipo;
  osc.frequency.value = freq;
  ganho.gain.setValueAtTime(0.0001, inicio);
  ganho.gain.exponentialRampToValueAtTime(vol, inicio + 0.02);
  ganho.gain.exponentialRampToValueAtTime(0.0001, inicio + dur);
  osc.connect(ganho).connect(mestre);
  osc.start(inicio);
  osc.stop(inicio + dur + 0.05);
}

// [frequência Hz, atraso s, duração s, forma de onda, volume]
const EFEITOS = {
  clique: [[880, 0, 0.05, 'square', 0.05]],
  acerto: [[523.25, 0, 0.15, 'triangle'], [659.25, 0.1, 0.15, 'triangle'], [783.99, 0.2, 0.3, 'triangle']],
  tranca: [[1400, 0, 0.04, 'square', 0.08], [900, 0.06, 0.08, 'square', 0.08]],
  erro: [[196, 0, 0.3, 'sawtooth', 0.12], [147, 0.18, 0.4, 'sawtooth', 0.12]],
  alarme: [[880, 0, 0.18, 'square', 0.08], [660, 0.2, 0.18, 'square', 0.08], [880, 0.4, 0.18, 'square', 0.08]],
  fase: [[392, 0, 0.2, 'triangle'], [523.25, 0.15, 0.2, 'triangle'], [659.25, 0.3, 0.2, 'triangle'], [1046.5, 0.45, 0.5, 'triangle']],
  vitoria: [[523.25, 0, 0.2, 'triangle'], [659.25, 0.15, 0.2, 'triangle'], [783.99, 0.3, 0.2, 'triangle'],
    [1046.5, 0.45, 0.6, 'triangle'], [783.99, 0.75, 0.2, 'triangle'], [1046.5, 0.9, 0.8, 'triangle']],
  derrota: [[392, 0, 0.4, 'sawtooth', 0.1], [349.23, 0.35, 0.4, 'sawtooth', 0.1], [311.13, 0.7, 0.4, 'sawtooth', 0.1], [261.63, 1.05, 0.9, 'sawtooth', 0.1]],
};

export function tocar(nome) {
  const c = contexto();
  if (!c) return;
  for (const [f, atraso, dur, tipo, vol] of EFEITOS[nome]) nota(f, c.currentTime + atraso, dur, tipo, vol);
}

// Música procedural: progressão Am–F–C–G. O andamento e as camadas crescem com a fase.
const ACORDES = [[220, 261.63, 329.63], [174.61, 220, 261.63], [261.63, 329.63, 392], [196, 246.94, 293.66]];

export function iniciarMusica(fase) {
  pararMusica();
  const c = contexto();
  if (!c) return;
  const batida = 60 / (64 + fase * 8);
  let passo = 0;
  const tocarBatida = () => {
    const t = c.currentTime + 0.05;
    const acorde = ACORDES[Math.floor(passo / 4) % ACORDES.length];
    if (passo % 4 === 0) acorde.forEach((f) => nota(f / 2, t, batida * 4, 'sine', 0.035));
    nota(acorde[0] / 4, t, batida * 0.9, 'triangle', 0.06);
    if (fase >= 3) nota(acorde[passo % 3] * 2, t, batida * 0.5, 'triangle', 0.025);
    if (fase >= 5) nota(acorde[(passo + 1) % 3] * 4, t + batida / 2, batida * 0.25, 'square', 0.012);
    passo += 1;
  };
  tocarBatida();
  musica = setInterval(tocarBatida, batida * 1000);
}

export function pararMusica() {
  if (musica) clearInterval(musica);
  musica = null;
}

export function alternarMudo() {
  mudo = !mudo;
  salvarMudo();
  if (mestre) mestre.gain.value = mudo ? 0 : 1;
  return mudo;
}

export function estaMudo() {
  return mudo;
}
```

- [ ] **Step 6: Módulos de UI**

`src/ui/matematica.js`:
```js
const DELIMITADORES = [
  { left: '$$', right: '$$', display: true },
  { left: '$', right: '$', display: false },
];

// Se o KaTeX (CDN) não carregar, o texto continua legível com $...$.
export function renderizarMatematica(elemento) {
  if (typeof window.renderMathInElement === 'function') {
    window.renderMathInElement(elemento, { delimiters: DELIMITADORES, throwOnError: false });
  }
}
```

`src/ui/telas.js`:
```js
export function mostrarTela(id) {
  document.querySelectorAll('.tela').forEach((t) => t.classList.toggle('ativa', t.id === id));
}

export function mostrarHistoria({ titulo, texto, botao = 'Continuar' }) {
  document.getElementById('historia-titulo').textContent = titulo;
  document.getElementById('historia-texto').textContent = texto;
  const btn = document.getElementById('btn-historia');
  btn.textContent = botao;
  mostrarTela('tela-historia');
  return new Promise((resolve) => btn.addEventListener('click', resolve, { once: true }));
}
```

`src/ui/hud.js`:
```js
import { formatarTempo } from './formatos.js';

export function atualizarHud(e) {
  if (e.fase) {
    document.getElementById('hud-sala').textContent = e.fase.sala;
    document.getElementById('hud-fase').textContent = `${e.fase.numero}/${e.totalFases} · ${e.fase.nivel}`;
    document.getElementById('hud-trancas').textContent =
      '🔓'.repeat(e.acertosFase) + '🔒'.repeat(e.acertosNecessarios - e.acertosFase);
  }
  document.getElementById('hud-acertos').textContent = `${e.acertosTotal}/${e.totalNecessario}`;
  const alarme = document.getElementById('hud-alarme');
  alarme.innerHTML = Array.from({ length: e.maxErros }, (_, i) => `<span class="nivel${i < e.erros ? ' ligado' : ''}"></span>`).join('');
  alarme.classList.toggle('critico', e.erros >= e.maxErros - 1);
  alarme.setAttribute('aria-label', `${e.erros} de ${e.maxErros} erros`);
  const relogio = document.getElementById('hud-relogio');
  relogio.textContent = formatarTempo(e.tempoRestanteS);
  relogio.classList.toggle('critico', e.tempoRestanteS <= 300);
}
```

`src/ui/sala.js`:
```js
import { SALAS } from '../art/salas.js';

const SELO_FECHADO = '<g class="selo-fechado"><circle r="14" fill="#ffcc4d"/><text y="5" text-anchor="middle" font-size="14">🔒</text></g>';
const SELO_ABERTO = '<g><circle r="14" fill="#4ade80"/><text y="5" text-anchor="middle" font-size="14">🔓</text></g>';

function ativar(el, acao) {
  el.addEventListener('click', acao);
  el.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      acao();
    }
  });
}

function porta(e) {
  const n = e.acertosNecessarios;
  const trancas = Array.from({ length: n }, (_, i) => {
    const y = 140 + i * Math.min(55, 190 / n);
    return `<g class="tranca${i < e.acertosFase ? ' aberta' : ''}" transform="translate(705 ${y})"><path class="haste" d="M-8 0 v-8 a8 8 0 0 1 16 0 v8"/><rect x="-14" y="0" width="28" height="22" rx="4"/></g>`;
  }).join('');
  return `<g class="porta"><rect class="porta-folha" x="660" y="110" width="90" height="260" rx="6"/><circle class="macaneta" cx="672" cy="250" r="5"/>${trancas}</g>`;
}

export function renderizarSala(cena, e, { aoClicarObjeto, aoClicarFerramenta }) {
  const sala = SALAS[e.fase.numero];
  const objetos = sala.objetos.slice(0, e.acertosNecessarios).map((o, i) => {
    const resolvido = i < e.acertosFase;
    return `<g class="objeto${resolvido ? ' resolvido' : ''}" data-indice="${i}" tabindex="${resolvido ? -1 : 0}" role="button"
      aria-label="${o.nome}${resolvido ? ' (resolvido)' : ''}" transform="translate(${o.x} ${o.y})">${o.desenho}${resolvido ? SELO_ABERTO : SELO_FECHADO}</g>`;
  }).join('');
  const f = sala.ferramenta;
  const ferramenta = f
    ? `<g class="objeto ferramenta" data-ferramenta="${f.id}" tabindex="0" role="button" aria-label="${f.nome}" transform="translate(${f.x} ${f.y})">${f.desenho}</g>`
    : '';
  cena.innerHTML = `<svg class="svg-sala" viewBox="0 0 800 450" role="group" aria-label="${e.fase.sala}">${sala.fundo}${porta(e)}${objetos}${ferramenta}</svg>`;
  cena.querySelectorAll('.objeto[data-indice]:not(.resolvido)').forEach((el) => {
    ativar(el, () => aoClicarObjeto(sala.objetos[Number(el.dataset.indice)]));
  });
  cena.querySelectorAll('.objeto[data-ferramenta]').forEach((el) => {
    ativar(el, () => aoClicarFerramenta(el.dataset.ferramenta));
  });
}
```

`src/ui/enigma.js`:
```js
import { criarCadeado } from './cadeado.js';
import { renderizarMatematica } from './matematica.js';
import { tocar } from '../audio/audio.js';

let ouvinteTeclado = null;
const modal = () => document.getElementById('modal-enigma');

function sacudir(el) {
  el.classList.remove('tremer');
  void el.offsetWidth; // reinicia a animação
  el.classList.add('tremer');
}

export function fecharEnigma() {
  modal().classList.add('oculto');
  if (ouvinteTeclado) document.removeEventListener('keydown', ouvinteTeclado);
  ouvinteTeclado = null;
}

export function abrirEnigma({ questao, objeto, aoEnviar }) {
  fecharEnigma();
  const m = modal();
  const cadeado = criarCadeado(10);
  const visor = m.querySelector('#cadeado-visor');
  const enunciado = m.querySelector('#enigma-enunciado');
  m.querySelector('#enigma-objeto').textContent = objeto.nome;
  enunciado.textContent = questao.enunciado;
  renderizarMatematica(enunciado);
  const atualizar = () => { visor.textContent = cadeado.texto() || '—'; };
  atualizar();

  const enviar = () => {
    const valor = cadeado.valor();
    if (valor === null) {
      sacudir(visor);
      return;
    }
    fecharEnigma();
    aoEnviar(valor);
  };
  const acao = (tecla) => {
    if (tecla === 'abrir') return enviar();
    if (/^[0-9]$/.test(tecla)) cadeado.digitar(tecla);
    else if (tecla === 'apagar') cadeado.apagar();
    else if (tecla === 'limpar') cadeado.limpar();
    tocar('clique');
    atualizar();
  };

  m.querySelector('#cadeado-teclas').onclick = (ev) => {
    const botao = ev.target.closest('button[data-tecla]');
    if (botao) acao(botao.dataset.tecla);
  };
  m.querySelector('#enigma-fechar').onclick = fecharEnigma;
  ouvinteTeclado = (ev) => {
    if (/^[0-9]$/.test(ev.key)) acao(ev.key);
    else if (ev.key === 'Backspace') acao('apagar');
    else if (ev.key === 'Enter') { ev.preventDefault(); acao('abrir'); }
    else if (ev.key === 'Escape') fecharEnigma();
  };
  document.addEventListener('keydown', ouvinteTeclado);
  m.classList.remove('oculto');
}
```

`src/ui/feedback.js`:
```js
import { formatarNumero } from './formatos.js';
import { renderizarMatematica } from './matematica.js';

export function mostrarFeedback({ correta, questao }) {
  const m = document.getElementById('modal-feedback');
  m.classList.toggle('correto', correta);
  m.classList.toggle('errado', !correta);
  m.querySelector('#feedback-titulo').textContent = correta ? 'Tranca aberta!' : 'Código incorreto: o alarme subiu!';
  m.querySelector('#feedback-resposta').textContent = `Código correto: ${formatarNumero(questao.resposta)}`;
  const lista = m.querySelector('#feedback-resolucao');
  lista.innerHTML = '';
  for (const passo of questao.resolucao) {
    const item = document.createElement('li');
    item.textContent = passo;
    lista.appendChild(item);
  }
  renderizarMatematica(lista);
  m.querySelector('#feedback-detalhes').open = !correta; // no erro, a resolução já vem aberta
  m.classList.remove('oculto');
  const botao = m.querySelector('#btn-feedback');
  botao.focus();
  return new Promise((resolve) => {
    botao.addEventListener('click', () => {
      m.classList.add('oculto');
      resolve();
    }, { once: true });
  });
}
```

- [ ] **Step 7: `src/main.js`**

```js
import { FASES, TEMPO_LIMITE_S, MAX_ERROS } from './config.js';
import { agruparPorFase } from './engine/banco.js';
import { criarJogo } from './engine/game.js';
import { INTRO, ENTRADAS, VITORIA, DERROTA } from './narrativa.js';
import { mostrarTela, mostrarHistoria } from './ui/telas.js';
import { atualizarHud } from './ui/hud.js';
import { renderizarSala } from './ui/sala.js';
import { abrirEnigma, fecharEnigma } from './ui/enigma.js';
import { mostrarFeedback } from './ui/feedback.js';
import { formatarTempo } from './ui/formatos.js';
import { tempoLimiteDaUrl } from './ui/parametros.js';
import { tocar, iniciarMusica, pararMusica, alternarMudo, estaMudo } from './audio/audio.js';

const tempoLimite = tempoLimiteDaUrl(location.search, TEMPO_LIMITE_S);
let bancoPorFase = null;
let jogo = null;
let relogio = null;
let pausado = true;

async function carregarBanco() {
  const resposta = await fetch('data/questoes.json');
  if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
  return agruparPorFase(await resposta.json(), FASES.length);
}

async function novaPartida() {
  clearInterval(relogio);
  jogo = criarJogo({ fases: FASES, bancoPorFase, tempoLimiteS: tempoLimite, maxErros: MAX_ERROS, rng: Math.random });
  pausado = true;
  await mostrarHistoria({ ...INTRO, botao: 'Procurar a saída' });
  iniciarRelogio();
  await entrarNaSala();
}

async function entrarNaSala() {
  pausado = true;
  const { fase } = jogo.estado();
  await mostrarHistoria({ ...ENTRADAS[fase.numero], botao: 'Entrar' });
  iniciarMusica(fase.numero);
  mostrarTela('tela-sala');
  desenharSala();
  pausado = false;
}

function desenharSala() {
  const e = jogo.estado();
  atualizarHud(e);
  renderizarSala(document.getElementById('cena'), e, {
    aoClicarObjeto: abrirObjeto,
    aoClicarFerramenta: () => {},
  });
}

function abrirObjeto(objeto) {
  tocar('clique');
  abrirEnigma({ questao: jogo.estado().questaoAtual, objeto, aoEnviar: enviarResposta });
}

function animar(el, classe) {
  el.classList.remove(classe);
  void el.offsetWidth;
  el.classList.add(classe);
}

async function enviarResposta(valor) {
  const r = jogo.responder(valor);
  const e = jogo.estado();
  if (r.correta) {
    tocar('tranca');
    tocar('acerto');
  } else {
    tocar('erro');
    animar(document.getElementById('cena'), 'tremer');
    if (e.status === 'jogando' && e.erros >= MAX_ERROS - 2) tocar('alarme');
  }
  if (r.status === 'jogando' && !r.avancouFase) desenharSala();
  else atualizarHud(e);

  pausado = true; // o relógio não corre enquanto a resolução está aberta
  await mostrarFeedback({ correta: r.correta, questao: r.questao });
  if (r.status !== 'jogando') return finalizar(r.status);
  if (r.avancouFase) {
    tocar('fase');
    await transicao();
    await entrarNaSala();
    return;
  }
  pausado = false;
}

function transicao() {
  return new Promise((resolve) => {
    const veu = document.getElementById('transicao');
    veu.classList.add('ativa');
    setTimeout(() => {
      veu.classList.remove('ativa');
      resolve();
    }, 900);
  });
}

function iniciarRelogio() {
  clearInterval(relogio);
  relogio = setInterval(() => {
    if (pausado || !jogo) return;
    jogo.tick(1);
    const e = jogo.estado();
    if (e.status === 'derrota') {
      finalizar('derrota');
      return;
    }
    atualizarHud(e);
  }, 1000);
}

function finalizar(resultado) {
  clearInterval(relogio);
  pausado = true;
  pararMusica();
  fecharEnigma();
  document.querySelectorAll('.modal').forEach((m) => m.classList.add('oculto'));
  const e = jogo.estado();
  const usado = formatarTempo(tempoLimite - e.tempoRestanteS);
  if (resultado === 'vitoria') {
    tocar('vitoria');
    document.getElementById('vitoria-texto').textContent = VITORIA.texto;
    document.getElementById('vitoria-stats').textContent =
      `Tempo: ${usado} · Erros: ${e.erros}/${e.maxErros} · Acertos: ${e.acertosTotal}/${e.totalNecessario}`;
    mostrarTela('tela-vitoria');
  } else {
    tocar('derrota');
    const d = DERROTA[e.motivoDerrota];
    document.getElementById('derrota-titulo').textContent = d.titulo;
    document.getElementById('derrota-texto').textContent = d.texto;
    document.getElementById('derrota-stats').textContent =
      `Chegou à fase ${e.fase.numero} (${e.fase.sala}) · Acertos: ${e.acertosTotal}/${e.totalNecessario} · Erros: ${e.erros}`;
    mostrarTela('tela-derrota');
  }
}

async function iniciar() {
  const btnSom = document.getElementById('btn-som');
  const rotularSom = () => { btnSom.textContent = estaMudo() ? '🔇' : '🔊'; };
  rotularSom();
  btnSom.addEventListener('click', () => { alternarMudo(); rotularSom(); });
  document.getElementById('btn-como-jogar').addEventListener('click', () => {
    document.getElementById('como-jogar').classList.toggle('oculto');
  });
  document.querySelectorAll('.btn-nova-partida').forEach((b) => b.addEventListener('click', () => {
    tocar('clique');
    novaPartida();
  }));

  const btnComecar = document.getElementById('btn-comecar');
  try {
    bancoPorFase = await carregarBanco();
  } catch (erro) {
    btnComecar.disabled = true;
    document.getElementById('erro-carga').textContent =
      `Não foi possível carregar as questões (${erro.message}). Abra o jogo por um servidor HTTP (npm run dev).`;
    return;
  }
  btnComecar.addEventListener('click', () => {
    tocar('clique');
    novaPartida();
  });
}

iniciar();
```

- [ ] **Step 8: Configuração do servidor de preview**

`.claude/launch.json`:
```json
{
  "version": "0.0.1",
  "configurations": [
    { "name": "professor-run", "runtimeExecutable": "python", "runtimeArgs": ["-m", "http.server", "8000"], "port": 8000 }
  ]
}
```

- [ ] **Step 9: Verificar no navegador (roteiro)**

Iniciar o preview `professor-run` (ferramenta `preview_start` com `name: "professor-run"`) e abrir `http://localhost:8000/?tempo=120`. Para descobrir o código de um enigma durante o teste, rodar no console da página: `(await (await fetch('data/questoes.json')).json()).find(q => document.getElementById('enigma-enunciado').textContent.startsWith(q.enunciado.slice(0, 20))).resposta`.

Conferir, um a um:
1. Tela inicial com título animado; "Como jogar" abre e fecha o painel; o console não mostra erros.
2. "Começar" leva à história de introdução e "Procurar a saída" leva à história da Sala de Aula; "Entrar" mostra a sala com o HUD: `1/5 · Fácil`, `🔒`, `0/12`, 6 níveis de alarme apagados e relógio `02:00` descendo.
3. Clicar na lousa abre o enigma com o enunciado; as fórmulas `$...$` aparecem renderizadas pelo KaTeX.
4. Enviar o cadeado vazio faz o visor tremer e não envia nada.
5. Código errado: a sala treme, aparece o feedback vermelho com a resolução aberta, o alarme fica com 1 nível aceso e o relógio fica parado enquanto o feedback está aberto.
6. Código certo: o feedback fica verde, depois vem a transição e a história da Biblioteca; a música muda de andamento.
7. Biblioteca: 2 objetos e 2 trancas; acertar um deles deixa esse objeto marcado como resolvido (🔓) e não mais clicável.
8. Deixar o relógio zerar leva à tela "O prédio fechou!", com as estatísticas.
9. "Nova partida" recomeça zerado. Errar 6 vezes leva a "O alarme disparou!".
10. O botão 🔊/🔇 silencia e reativa, e a escolha persiste ao recarregar a página.
11. Teclado: algarismos, Backspace, Enter e Esc funcionam no enigma; Tab percorre os objetos e Enter os abre.

- [ ] **Step 10: Rodar todas as suítes**

Run: `npm test` e `python -m unittest discover -s tools -v`
Expected: PASS em ambas

- [ ] **Step 11: Commit**

```bash
git add index.html css src .claude/launch.json
git commit -m "feat: interface jogável com salas SVG, cadeado, HUD, narrativa e áudio procedural" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Quadro de Pascal interativo (Sala 3)

**Files:**
- Create: `src/ui/quadroPascal.js`
- Modify: `index.html` (modal antes de `<div id="transicao"`), `css/style.css` (fim do arquivo), `src/art/salas.js` (sala 3), `src/main.js` (import + `aoClicarFerramenta`)

**Interfaces:**
- Consumes: `linhaPascal`, `conferirLinha` (Task 3); `renderizarSala` já renderiza `sala.ferramenta` (Task 8).
- Produces: `abrirQuadroPascal(): void`

- [ ] **Step 1: Inserir o modal em `index.html`**, imediatamente antes de `<div id="transicao" aria-hidden="true"></div>`:

```html
  <div id="modal-pascal" class="modal oculto" role="dialog" aria-modal="true" aria-labelledby="pascal-titulo">
    <div class="modal-caixa">
      <button id="btn-pascal-fechar" class="btn-fechar" aria-label="Fechar">×</button>
      <h2 id="pascal-titulo">Quadro de Pascal</h2>
      <p id="pascal-dica"></p>
      <div id="pascal-triangulo"></div>
      <button id="btn-pascal-conferir" class="btn-primario">Conferir linha</button>
    </div>
  </div>
```

- [ ] **Step 2: Acrescentar ao fim de `css/style.css`**

```css
#pascal-triangulo { display: grid; gap: .35rem; justify-items: center; margin: 1rem 0; font-variant-numeric: tabular-nums; }
.linha-pascal { display: flex; gap: .35rem; }
.linha-pascal .celula { min-width: 2.6rem; text-align: center; padding: .25rem; border-radius: 6px; background: var(--painel-2); }
.linha-pascal input.celula { border: 2px solid var(--borda); color: var(--texto); font: inherit; width: 2.8rem; }
.linha-pascal input.celula.erro { border-color: var(--perigo); }
.linha-pascal input.celula.certo { border-color: var(--sucesso); }
```

- [ ] **Step 3: Criar `src/ui/quadroPascal.js`**

```js
import { linhaPascal, conferirLinha } from '../engine/pascal.js';

const LINHA_MAXIMA = 10;
let linhaAlvo = 2; // as linhas 0 e 1 vêm prontas; o progresso vale para a partida inteira

export function abrirQuadroPascal() {
  const m = document.getElementById('modal-pascal');
  const area = m.querySelector('#pascal-triangulo');

  const desenhar = () => {
    area.innerHTML = '';
    for (let n = 0; n < linhaAlvo; n++) {
      const linha = document.createElement('div');
      linha.className = 'linha-pascal';
      linha.innerHTML = linhaPascal(n).map((v) => `<span class="celula">${v}</span>`).join('');
      area.appendChild(linha);
    }
    const alvo = document.createElement('div');
    alvo.className = 'linha-pascal alvo';
    alvo.innerHTML = Array.from({ length: linhaAlvo + 1 }, (_, k) =>
      `<input class="celula" inputmode="numeric" maxlength="4" aria-label="C(${linhaAlvo}, ${k})">`).join('');
    area.appendChild(alvo);
    m.querySelector('#pascal-dica').textContent =
      `Complete a linha ${linhaAlvo}: cada número é a soma dos dois logo acima (relação de Stifel).`;
    alvo.querySelector('input').focus();
  };

  m.querySelector('#btn-pascal-conferir').onclick = () => {
    const entradas = [...area.querySelectorAll('.alvo input')];
    const resultado = conferirLinha(linhaAlvo, entradas.map((i) => Number(i.value)));
    entradas.forEach((inp, i) => {
      inp.classList.toggle('erro', !resultado[i]);
      inp.classList.toggle('certo', resultado[i]);
    });
    if (resultado.every(Boolean) && linhaAlvo < LINHA_MAXIMA) {
      linhaAlvo += 1;
      setTimeout(desenhar, 400);
    }
  };
  m.querySelector('#btn-pascal-fechar').onclick = () => m.classList.add('oculto');
  desenhar();
  m.classList.remove('oculto');
}
```

- [ ] **Step 4: Adicionar a ferramenta à sala 3 em `src/art/salas.js`**

Na entrada `3:`, depois do array `objetos: [ ... ],`, acrescentar:
```js
    ferramenta: {
      id: 'pascal', nome: 'Quadro de Pascal (ferramenta)', x: 220, y: 40,
      desenho: `<rect width="210" height="150" rx="4" fill="#f5f5f0" stroke="#7f8c8d" stroke-width="6"/>${[['1'], ['1 1'], ['1 2 1'], ['1 3 3 1'], ['?  ?  ?  ?  ?']]
        .map(([t], i) => `<text x="105" y="${30 + i * 24}" text-anchor="middle" font-family="monospace" font-size="16" fill="#2c3e50">${t}</text>`).join('')}${rotulo('Quadro de Pascal', 105, 172)}`,
    },
```

- [ ] **Step 5: Ligar a ferramenta em `src/main.js`**

Acrescentar o import:
```js
import { abrirQuadroPascal } from './ui/quadroPascal.js';
```
Substituir a linha `aoClicarFerramenta: () => {},` por:
```js
    aoClicarFerramenta: (id) => { if (id === 'pascal') { tocar('clique'); abrirQuadroPascal(); } },
```

- [ ] **Step 6: Verificar no navegador**

Com `?tempo=600`, chegar à Sala 3 (usando o snippet de console da Task 8 para descobrir os códigos). Conferir:
1. O quadro aparece na parede, com brilho ao passar o mouse.
2. O clique abre o modal com as linhas 0 e 1 e 3 campos para a linha 2.
3. Digitar `1 2 1` e conferir: as bordas ficam verdes e a linha 3 aparece.
4. Digitar `1 3 4 1`: só a 3ª célula fica vermelha.
5. Fechar e reabrir o quadro mantém o progresso.
6. O quadro não altera acertos nem o HUD.

- [ ] **Step 7: Commit**

```bash
git add index.html css/style.css src/ui/quadroPascal.js src/art/salas.js src/main.js
git commit -m "feat: Quadro de Pascal interativo (relação de Stifel) na Sala 3" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: Verificação ponta a ponta e polimento

**Files:**
- Modify: apenas o que a verificação apontar (registrar cada ajuste no commit)

- [ ] **Step 1: Partida completa até a vitória**, em `http://localhost:8000/?tempo=1800`, usando o snippet de console para os códigos. Esperado: 12 acertos, transições entre as 5 salas (1, 2, 2, 3, 4 objetos e trancas), Quadro de Pascal na Sala 3, tela "Você escapou!" com tempo, erros e `12/12`, e som de vitória.

- [ ] **Step 2: Regra de não repetição na prática.** Numa sala, errar de propósito várias vezes e anotar os ids (comparando o enunciado com o JSON). Esperado: nenhum enunciado se repete antes de se esgotarem as 15 questões da fase.

- [ ] **Step 3: Derrotas.** Com `?tempo=15`, esperar o relógio zerar com o enigma aberto: o modal fecha e aparece "O prédio fechou!". Em partida normal, errar 6 vezes: aparece "O alarme disparou!". Nos dois casos, "Nova partida" recomeça zerado.

- [ ] **Step 4: Responsivo e acessibilidade.** Viewport mobile (375×812): sem rolagem horizontal, teclado do cadeado utilizável com toque e HUD em grade. Navegação só por teclado do início à vitória. Com `prefers-reduced-motion`, sem animações.

- [ ] **Step 5: Console limpo.** `read_console_messages` com `onlyErrors: true` durante toda a partida não traz erros.

- [ ] **Step 6: Suítes verdes**

Run: `npm test` e `python -m unittest discover -s tools -v` e `python tools/verificar_banco.py`
Expected: tudo PASS / `OK  75 questões verificadas`

- [ ] **Step 7: Commit dos ajustes (se houver)**

```bash
git add -A
git commit -m "fix: ajustes da verificação ponta a ponta" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 11: README e publicação (GitHub + GitHub Pages)

**Files:**
- Create: `README.md`

- [ ] **Step 1: Escrever `README.md`**

````markdown
# Professor Run — Escape Room de Análise Combinatória

Jogo digital (Projeto 2 de Matemática Discreta) em que o jogador escapa do prédio da
faculdade resolvendo problemas de Análise Combinatória: **a resposta de cada problema
é o código de um cadeado**.

**Jogar:** <link do GitHub Pages>

## Regras
- 5 salas (Fácil → Difícil) que exigem 1, 2, 2, 3 e 4 acertos: 12 no total.
- Erro: nova questão do mesmo nível, sem perder acertos; o alarme sobe 1 nível.
- Derrota: 6 erros ou fim do relógio de 40 minutos. Vitória: abrir o cofre da Sala 5.
- As questões não se repetem enquanto houver inéditas na fase.

## Conteúdo matemático
Princípio Fundamental da Contagem, permutação simples e com repetição, arranjo simples,
combinação simples, problemas com restrições e **recorrências aplicadas à contagem**
(1ª e 2ª ordem, homogêneas e não homogêneas, e a recorrência não linear de Catalan).
O banco completo, com resoluções, está em [`docs/BANCO_DE_QUESTOES.md`](docs/BANCO_DE_QUESTOES.md).

## Como rodar localmente
```bash
npm run dev        # servidor em http://localhost:8000 (requer Python)
```
Use `?tempo=60` na URL para uma demonstração com relógio curto.

## Testes e verificação matemática
```bash
npm test                         # motor do jogo (node --test)
npm run test:py                  # ferramentas Python (unittest)
python tools/verificar_banco.py  # confere as 75 respostas por fórmula e força bruta
python tools/gerar_banco.py      # regenera docs/BANCO_DE_QUESTOES.md
```

## Arquitetura
- `src/engine/`: lógica pura (partida, sorteio sem repetição, Stifel recursivo), coberta por testes.
- `src/ui/`, `src/art/`, `src/audio/`: interface, cenários SVG autorais e som sintetizado (Web Audio).
- `data/questoes.json`: banco único, usado pelo jogo e pelo documento.
- `tools/`: verificação matemática em Python (recorrências recursivas + enumeração).

## Uso de IA
Desenvolvido com apoio do Claude (Anthropic). Toda a lógica tem testes automatizados, e
toda resposta do banco é recalculada por fórmula e, nos casos com restrição ou
recorrência, por enumeração exaustiva. A equipe revisou enunciados e resoluções.

## Créditos
Equipe: <nomes>. Arte e música originais geradas em código.
````

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: README com regras, conteúdo, testes e arquitetura" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

- [ ] **Step 3: ⚠️ PARAR e pedir confirmação ao usuário** para: (a) nome e visibilidade do repositório, (b) conta do GitHub, (c) criar o repositório e dar push, (d) ativar o GitHub Pages. Nada desta etapa roda sem um "sim" explícito.

- [ ] **Step 4: Publicar (somente após o "sim")**

```bash
gh auth status
gh repo create professor-run --public --source . --remote origin --push
gh api -X POST "repos/{owner}/professor-run/pages" -f "source[branch]=main" -f "source[path]=/"
```
Esperado: a URL `https://<usuario>.github.io/professor-run/` responde em 1–2 minutos. Abrir no navegador, repetir os passos 1–3 do roteiro da Task 8 e substituir `<link do GitHub Pages>` no README (novo commit e push, também confirmados).

---

## Auto-revisão (feita)

- **Cobertura da spec:** R1–R8 → Task 2; R5 → Task 1; R9–R10 → Tasks 4–6; R11–R17 → Task 8 (+ R17/Stifel na Task 9); R18 → Tasks 7 e 11; recorrências (spec §5) → Tasks 4, 5, 6 e 9; modo demonstração → Task 3 + `main.js`; casos-limite (§8) → `main.js` (erro de carga), `matematica.js` (sem KaTeX), `enigma.js` (cadeado vazio), `game.js` (responder após o fim), `audio.js` (mudo persistido com try/catch).
- **Placeholders:** apenas `<link do GitHub Pages>` e `<nomes>` no README, que dependem de dados que só existem depois da publicação ou que a equipe informa.
- **Consistência de nomes:** `criarJogo/estado/responder/tick`, `criarSorteio/proxima`, `agruparPorFase`, `binomial/linhaPascal/conferirLinha`, `criarCadeado`, `formatarTempo/formatarNumero`, `tempoLimiteDaUrl`, `renderizarSala`, `abrirEnigma/fecharEnigma`, `mostrarFeedback`, `abrirQuadroPascal`, `tocar/iniciarMusica/pararMusica/alternarMudo/estaMudo`, `verificar/carregar/CAMINHO_PADRAO/RAIZ`, `FORCA_BRUTA`, `gerar_markdown/main`: todos conferidos entre as tasks.
