# Professor Run — Escape Room de Análise Combinatória

Jogo digital (Projeto 2 de Matemática Discreta) em que o jogador escapa do prédio da
faculdade resolvendo problemas de Análise Combinatória: **a resposta de cada problema
é o código de um cadeado**.

**Jogar:** <link do GitHub Pages>

## Narrativa e salas
É véspera da P2 e o prédio da faculdade foi trancado pelo excêntrico Prof. Pascoal Fatorial:
cada cadeado só abre com a resposta de um problema de contagem. O relógio de 40 minutos é o
segurança fechando o prédio, e cada código errado sobe o alarme. O "Caderno de Recorrências"
do professor justifica as questões de recorrência.

| Sala | Nível | Trancas | Foco |
|---|---|---|---|
| 1. Sala de Aula | Fácil | 1 | PFC, permutação, arranjo e combinação simples |
| 2. Biblioteca | Básico | 2 | PFC, permutação com repetição, arranjo, combinação; 1 recorrência |
| 3. Laboratório de Informática | Intermediário | 2 | Restrições, combinação e arranjo; Quadro de Pascal; 2 recorrências |
| 4. Sala dos Professores | Avançado | 3 | Restrições e combinação; 3 recorrências (Fibonacci) |
| 5. Cofre da Diretoria | Difícil | 4 | Restrições difíceis; desarranjos e Catalan |

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

## Recorrências no jogo
| Recorrência | Classificação | Questão |
|---|---|---|
| `s(n) = 2·s(n-1)` | 1ª ordem, linear, homogênea | F2-15 (subconjuntos) |
| `h(n) = h(n-1) + (n-1)` | 1ª ordem, linear, não homogênea | F3-14 (apertos de mão) |
| `C(n,k) = C(n-1,k-1) + C(n-1,k)` | Relação de Stifel, dois índices | F3-15 e Quadro de Pascal |
| `e(n) = e(n-1) + e(n-2)` | 2ª ordem, linear, homogênea | F4-13, F4-14, F4-15 |
| `D(n) = (n-1)·(D(n-1) + D(n-2))` | 2ª ordem, coeficiente variável | F5-13, F5-14 |
| `C(n+1) = soma de C(i)·C(n-i)` | não linear (Catalan) | F5-15 |

## Como rodar localmente
Requisitos: Node 22+ (só para `npm test`) e Python 3.10+ (servidor local e ferramentas).
```bash
npm run dev        # servidor em http://localhost:8000 (requer Python)
```
Use `?tempo=SEG` na URL (de 1 a 3600 segundos; valor inválido volta aos 40 minutos) para uma
demonstração com relógio curto, por exemplo `?tempo=120`. Abrir o `index.html` direto no
navegador (`file://`) não funciona, porque módulos e `fetch` exigem HTTP: use `npm run dev`.
Roteiro da apresentação: [`docs/APRESENTACAO.md`](docs/APRESENTACAO.md).

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
recorrência, por enumeração exaustiva. As respostas são conferidas automaticamente; a revisão final da redação de enunciados e
resoluções é responsabilidade da equipe.

## Créditos
Equipe: <nomes>. Arte e música originais geradas em código.
