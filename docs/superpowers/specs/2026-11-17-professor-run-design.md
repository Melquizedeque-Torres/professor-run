# Professor Run — Design (Spec)

**Data:** 2026-11-17
**Origem:** `P2_MD_2026_2_INSTRUCAO_GAME.pdf` (Projeto 2 – Escape Room, Jogo Digital de Análise Combinatória)
**Status:** aguardando aprovação

---

## 1. Objetivo

Jogo web estilo *Escape Room* em que o jogador só escapa resolvendo problemas de
Análise Combinatória do Ensino Médio. São 5 fases de dificuldade crescente e são
necessárias 12 respostas corretas. A recorrência entra como **estratégia de contagem**
integrada ao conteúdo obrigatório, nunca como tema à parte.

## 2. Requisitos do PDF → decisão de design

| # | Requisito do PDF | Decisão |
|---|---|---|
| R1 | 5 fases: 1, 2, 2, 3, 4 acertos (total 12) | `FASES` em `src/config.js`; o motor avança ao atingir a meta |
| R2 | Banco próprio por fase, 10–20 questões, sorteio aleatório | 15 questões por fase (75 no total) em `data/questoes.json` |
| R3 | Acerto soma 1; meta atingida → próxima fase | `responder()` no motor |
| R4 | Erro → nova questão do mesmo nível, sem perder acertos | Erro só incrementa `erros` e sorteia a próxima da mesma fase |
| R5 | Sem repetição enquanto houver inéditas | Saco embaralhado por fase; reembaralha só quando esgota e evita repetir a última |
| R6 | Tempo limite e/ou máximo de erros | **Ambos:** 40 min (`TEMPO_LIMITE_S = 2400`) e 6 erros (`MAX_ERROS = 6`) |
| R7 | Termina na vitória (5 fases) ou na derrota | Status `vitoria` / `derrota` com motivo `tempo` ou `erros` |
| R8 | Permitir nova partida | Botão "Nova partida" nas telas de vitória e derrota (recria o motor) |
| R9 | Conteúdos: PFC, permutação simples e com repetição, arranjo, combinação, restrições/integração | Matriz de distribuição fixa (§5), conferida por teste |
| R10 | Questão com enunciado, resposta e resolução verificadas | Fórmula avaliada + força bruta obrigatória para restrição/recorrência (§6) |
| R11 | Narrativa e cenários próprios | História "Professor Run" e 5 salas em SVG autoral |
| R12 | Interface gráfica interativa | Point-and-click: objetos clicáveis + cadeado numérico |
| R13 | Música de fundo e efeitos sonoros | Web Audio API: música procedural por fase + efeitos sintetizados |
| R14 | Animações e transições | Transições CSS entre telas, tranca abrindo, tremor no erro, alarme pulsando |
| R15 | Indicadores de progresso, acertos e erros | HUD: fase, trancas, acertos x/12, barra de alarme, relógio |
| R16 | Telas de início, vitória e derrota | Seções `#tela-inicio`, `#tela-vitoria`, `#tela-derrota` |
| R17 | Desafios integrados à narrativa, não uma lista de perguntas | A **resposta é o código do cadeado** do objeto da sala |
| R18 | Link do jogo, código no GitHub, banco documentado, apresentação | GitHub Pages; `docs/BANCO_DE_QUESTOES.md` gerado do JSON; README |

## 3. Narrativa

É véspera da P2. O aluno ficou estudando até tarde e, quando percebe, o prédio está
trancado. O excêntrico **Prof. Pascoal Fatorial** trancou cada sala com cadeados cujo
código é a resposta de um problema de contagem. O segurança fecha o prédio às 23h
(o cronômetro de 40 min). Cada código errado sobe o nível do alarme, e no 6º erro ele
dispara (derrota). O professor guarda um "Caderno de Recorrências", fio condutor que
justifica as questões de recorrência.

| Fase | Sala | Nível | Trancas (= acertos) |
|---|---|---|---|
| 1 | Sala de Aula | Fácil | 1 |
| 2 | Biblioteca | Básico | 2 |
| 3 | Laboratório de Informática | Intermediário | 2 |
| 4 | Sala dos Professores | Avançado | 3 |
| 5 | Cofre da Diretoria | Difícil | 4 |

## 4. Mecânica

- Cada sala mostra N objetos com cadeado (N = acertos necessários) e uma porta com N trancas.
- Clicar num objeto trancado abre o **enigma**: o enunciado (com fórmulas em KaTeX) e um
  cadeado de teclado numérico com até 10 dígitos. Aceita mouse, toque e teclado físico.
- **Acerto:** a tranca abre (animação e som), o objeto fica marcado como resolvido e a
  resolução fica disponível para leitura.
- **Erro:** a tela treme, o alarme sobe e aparece a resolução comentada da questão
  errada. O objeto continua trancado e passa a ter um novo enigma do mesmo nível.
- O relógio **pausa** enquanto o painel de resolução está aberto, para não punir a leitura.
- Na Sala 3 há uma ferramenta extra, o **Quadro de Pascal**. O jogador constrói as
  linhas do triângulo pela relação de Stifel. Ela não conta acerto: serve de apoio às
  questões de combinação.

## 5. Banco de questões

Formato de cada item em `data/questoes.json`:

```json
{
  "id": "F1-01",
  "fase": 1,
  "topico": "PFC",
  "enunciado": "texto; fórmulas entre $...$ (LaTeX, barras escapadas como \\binom)",
  "resposta": 12,
  "formula": "3*4",
  "resolucao": ["passo 1", "passo 2 ... = 12"],
  "fonte": "Autoral"
}
```

Tópicos: `PFC`, `PERM`, `PERM_REP`, `ARRANJO`, `COMB`, `RESTRICAO`, `RECORRENCIA`.

**Matriz de distribuição (exata, conferida por teste):**

| Fase | PFC | PERM | PERM_REP | ARRANJO | COMB | RESTRICAO | RECORRENCIA | Total |
|---|---|---|---|---|---|---|---|---|
| 1 | 7 | 4 | – | 2 | 2 | – | – | 15 |
| 2 | 2 | 2 | 4 | 3 | 3 | – | 1 | 15 |
| 3 | – | – | 2 | 3 | 3 | 5 | 2 | 15 |
| 4 | – | – | – | – | 2 | 10 | 3 | 15 |
| 5 | – | – | – | – | – | 12 | 3 | 15 |

Recorrência: 9 de 75 questões (12%, abaixo do teto de 20%).

**Recorrências cobertas:**

| Recorrência | Classificação | Questão |
|---|---|---|
| $s_n = 2s_{n-1}$ | 1ª ordem, linear, homogênea, coeficiente constante | F2-15 (subconjuntos) |
| $h_n = h_{n-1} + (n-1)$ | 1ª ordem, linear, **não homogênea** | F3-14 (apertos de mão = $\binom{n}{2}$) |
| $\binom{n}{k} = \binom{n-1}{k-1} + \binom{n-1}{k}$ | Stifel, dois índices | F3-15 + Quadro de Pascal |
| $e_n = e_{n-1} + e_{n-2}$ | **2ª ordem**, linear, homogênea | F4-13, F4-14, F4-15 |
| $D_n = (n-1)(D_{n-1} + D_{n-2})$ | 2ª ordem, coeficiente variável | F5-13, F5-14 |
| $C_{n+1} = \sum C_i C_{n-i}$ | **não linear** | F5-15 |

As questões são autorais no estilo ENEM/vestibular. A equipe pode trocar questões por
itens reais de vestibular citando a fonte, desde que o verificador continue verde.

## 6. Verificação matemática (critério de 25 pontos)

`tools/verificar_banco.py` (Python, só biblioteca padrão) falha se qualquer regra for violada:

1. Campos obrigatórios presentes; `id` no formato `F<fase>-<nn>` e coerente com `fase`.
2. `resposta` inteira, entre 1 e 9.999.999.999 (cabe no cadeado de 10 dígitos).
3. `formula`, avaliada com funções de `tools/combinatoria.py`, é igual à `resposta`.
4. Tópicos `RESTRICAO` e `RECORRENCIA` exigem verificação por **força bruta**
   (`tools/forca_bruta.py`, que enumera de fato os casos), igual à `resposta`.
5. `resolucao` tem pelo menos 2 passos, e o último mostra a resposta.
6. A distribuição é exatamente a matriz do §5; não há ids duplicados nem força bruta órfã.

As recorrências em `combinatoria.py` são **recursivas com memoização** e são testadas
contra a fórmula fechada e contra a enumeração.

`tools/gerar_banco.py` gera `docs/BANCO_DE_QUESTOES.md` (entrega 3) a partir do mesmo
JSON e se recusa a gerar se o verificador acusar erro.

## 7. Arquitetura

**Stack:** HTML5, CSS3 e JavaScript (ES modules) no navegador, sem build. KaTeX 0.16.11
via CDN para as fórmulas. Web Audio API para o som. Python 3 (só biblioteca padrão)
para as ferramentas matemáticas. Testes com `node --test` e `python -m unittest`.
Hospedagem no GitHub Pages.

```
index.html, css/style.css
data/questoes.json
src/config.js                 FASES, TEMPO_LIMITE_S, MAX_ERROS
src/narrativa.js              textos da história
src/engine/rng.js             RNG com semente (testes determinísticos)
src/engine/sorteio.js         saco embaralhado sem repetição
src/engine/banco.js           agruparPorFase
src/engine/game.js            máquina de estados da partida (sem DOM)
src/engine/pascal.js          Stifel recursivo + memo
src/ui/cadeado.js             estado do teclado numérico (sem DOM)
src/ui/formatos.js            formatarTempo, formatarNumero
src/ui/telas.js, hud.js, sala.js, enigma.js, feedback.js, quadroPascal.js, matematica.js
src/art/salas.js              SVG das 5 salas + objetos clicáveis
src/audio/audio.js            efeitos + música procedural + mudo
src/main.js                   orquestra motor ↔ UI ↔ áudio
tools/combinatoria.py, forca_bruta.py, verificar_banco.py, gerar_banco.py, test_*.py
tests/engine/*.test.js, tests/ui/*.test.js
docs/BANCO_DE_QUESTOES.md (gerado), README.md
```

**Fronteira de testes:** toda a lógica (motor, sorteio, banco, Pascal, cadeado,
formatos, ferramentas Python) é pura e coberta por TDD. Os módulos de DOM, arte e áudio
são finos e verificados por roteiro de checagem no navegador.

**Fluxo de dados:** `main.js` carrega o JSON, chama `agruparPorFase`, depois `criarJogo`.
Um clique no objeto chama `enigma` com a questão atual e o valor do cadeado vai para
`jogo.responder(valor)`. O resultado aciona feedback, HUD, áudio e, se for o caso, a
transição de sala ou a tela final. Um `setInterval` de 1 s chama `jogo.tick(1)`,
exceto quando está pausado.

## 8. Erros e casos-limite

- O JSON não carrega: a tela inicial mostra uma mensagem de erro (precisa de servidor HTTP).
- KaTeX indisponível (CDN fora do ar): o texto aparece com `$...$` cru e continua legível.
- Cadeado vazio ao enviar: o visor treme e nada é enviado.
- `responder()` depois do fim da partida lança erro (protege contra duplo clique).
- O áudio só inicia após o primeiro clique (política dos navegadores); o botão de mudo persiste em `localStorage` com try/catch.

## 9. Fora do escopo (YAGNI)

Ranking online, login, várias línguas e dificuldade selecionável. A Torre de Hanói
fica como extra opcional, só se sobrar tempo depois de tudo pronto.
