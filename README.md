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
