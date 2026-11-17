# Professor Run: roteiro da apresentação (8 a 10 minutos)

## 1. Problema e proposta (1 min)
O PDF pede um escape room digital em que **resolver problemas de Análise Combinatória é a
única forma de avançar**. Nossa proposta: a resposta de cada problema é o **código de um
cadeado** de um objeto da sala. Não é uma lista de perguntas, é um jogo point-and-click.

## 2. Narrativa e salas (1 min)
Véspera da P2, prédio trancado pelo Prof. Pascoal Fatorial, segurança fechando às 23h
(relógio de 40 min), alarme que sobe a cada erro (6 erros = derrota).
Cinco salas: Sala de Aula (1 tranca), Biblioteca (2), Laboratório (2), Sala dos Professores (3),
Cofre da Diretoria (4): 12 acertos no total.

## 3. Requisitos do PDF e solução (2 min)

| Req. | Solução |
|---|---|
| R1, R3 | 5 fases com 1, 2, 2, 3 e 4 acertos; o motor avança ao atingir a meta |
| R2, R9 | 15 questões por fase (75), sorteio aleatório; matriz fixa de tópicos |
| R4, R5 | Erro sorteia nova questão da mesma fase; saco embaralhado sem repetição |
| R6, R7 | Tempo (40 min) e erros (6); vitória na 5ª fase ou derrota por tempo/erros |
| R8, R16 | Telas de início, vitória e derrota; botão Nova partida |
| R10 | Cada resposta verificada por fórmula e, quando há restrição ou recorrência, por força bruta |
| R11, R12, R17 | 5 cenários SVG autorais; objetos clicáveis; resposta digitada no cadeado |
| R13, R14 | Música e efeitos por Web Audio; transições, tranca abrindo, tremor, alarme pulsando |
| R15 | HUD com fase, trancas, acertos x/12, barra de alarme e relógio |
| R18 | Link (GitHub Pages), código, `docs/BANCO_DE_QUESTOES.md`, esta apresentação |

## 4. Como o banco foi verificado (1,5 min)
- `tools/verificar_banco.py`: campos, formato do id, resposta inteira que cabe no cadeado,
  **fórmula** recalculada, **força bruta** (enumeração real) para restrições e recorrências,
  matriz exata de distribuição (resultado: OK 75).
- Recorrências implementadas de forma **recursiva com memoização** e comparadas com a
  fórmula fechada e com a enumeração.
- `tools/gerar_banco.py` gera o documento do banco a partir do mesmo JSON e recusa gerar se
  a verificação falhar.

## 5. Demonstração ao vivo (2 min), `?tempo=120`
1. Abrir com `?tempo=120` (relógio de 2 min, para mostrar a pressão do tempo).
2. Sala 1: **errar uma vez** de propósito (tela treme, alarme sobe, resolução comentada aparece).
3. Acertar em seguida: a tranca abre e a porta mostra o progresso.
4. Sala 3: abrir o **Quadro de Pascal**, completar uma linha pela relação de Stifel e usar o
   resultado numa questão de combinação.
5. Mostrar o HUD, o botão de som e, se sobrar tempo, a tela de derrota por tempo.

## 6. Arquitetura (1 min)
HTML, CSS e JavaScript (ES modules) sem build; KaTeX via CDN; Web Audio. Lógica pura em
`src/engine/` coberta por testes (`npm test`, 40 testes); interface em `src/ui/`; arte em
`src/art/`; banco único em `data/questoes.json`; ferramentas Python em `tools/` (43 testes).

## 7. Uso de IA e validação (0,5 min)
Desenvolvido com apoio do Claude (Anthropic). A validação não depende da IA: respostas
recalculadas por fórmula e por força bruta, motor coberto por testes automatizados e roteiro
de checagem no navegador. A revisão final da redação dos enunciados e resoluções é da equipe.

## 8. Perguntas prováveis da banca

| Pergunta | Resposta curta |
|---|---|
| Como garantem que as respostas estão certas? | Fórmula e força bruta independentes, executadas pelo verificador; o jogo não sobe sem OK 75. |
| E se o aluno errar? | Alarme +1, resolução comentada e nova questão do mesmo nível; acertos não se perdem. |
| As questões repetem? | Não, enquanto houver inéditas na fase (saco embaralhado). |
| Onde entra a recorrência? | 9 das 75 questões (12%): subconjuntos, apertos de mão, Stifel, Fibonacci/dominós, desarranjos e Catalan. |
| Por que 40 min e 6 erros? | O PDF permite tempo e/ou erros; usamos os dois para dar tensão sem punir a leitura (o relógio pausa na resolução). |
| Dá para trocar questões? | Sim, editando o JSON, desde que o verificador continue verde. |
| Funciona offline? | O jogo precisa de servidor HTTP; só o KaTeX vem de CDN (sem ele o texto segue legível). |
