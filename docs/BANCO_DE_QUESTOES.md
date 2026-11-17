# Banco de Questões — Professor Run

Documento gerado a partir de `data/questoes.json`. Toda resposta foi conferida pela fórmula e, nos problemas com restrição ou recorrência, também por força bruta (`python tools/verificar_banco.py`).

## Fase 1 — Fácil (Sala de Aula)

### F1-01 · Princípio Fundamental da Contagem

No armário do aluno há 3 camisetas e 4 calças diferentes. Quantos conjuntos (camiseta + calça) distintos ele pode vestir?

**Resolução:**

1. São duas escolhas independentes e sucessivas: camiseta (3 opções) e depois calça (4 opções).
2. Pelo Princípio Fundamental da Contagem: $3 \cdot 4 = 12$.

**Resposta:** 12  
**Fórmula verificada:** `3*4`  
**Fonte:** Autoral

### F1-02 · Princípio Fundamental da Contagem

Na cantina da escola, cada refeição é montada com uma entrada, um prato principal e uma sobremesa. Há 3 entradas, 4 pratos principais e 2 sobremesas disponíveis. Quantas refeições diferentes podem ser montadas escolhendo uma opção de cada tipo?

**Resolução:**

1. Montar a refeição são três escolhas sucessivas e independentes — entrada (3 opções), prato principal (4) e sobremesa (2) —, situação do Princípio Fundamental da Contagem (PFC).
2. Multiplicando as opções de cada etapa: $3 \cdot 4 \cdot 2 = 24$.

**Resposta:** 24  
**Fórmula verificada:** `3*4*2`  
**Fonte:** Autoral

### F1-03 · Princípio Fundamental da Contagem

O cadeado do armário da sala tem 3 rodas, e cada roda mostra um algarismo de 0 a 9 (os algarismos podem se repetir). Quantos códigos diferentes esse cadeado admite?

**Resolução:**

1. Cada roda é uma escolha independente com 10 opções (0 a 9) e repetir algarismos é permitido — aplica-se o PFC.
2. São 3 rodas: $10 \cdot 10 \cdot 10 = 10^3 = 1000$.

**Resposta:** 1000  
**Fórmula verificada:** `10**3`  
**Fonte:** Autoral

### F1-04 · Princípio Fundamental da Contagem

As salas da escola são identificadas por uma letra de A a E seguida de um algarismo de 1 a 9 (por exemplo, C7). Quantas identificações diferentes existem?

**Resolução:**

1. A identificação é formada em duas etapas independentes: a letra (5 opções: A, B, C, D, E) e o algarismo (9 opções: 1 a 9) — PFC.
2. $5 \cdot 9 = 45$.

**Resposta:** 45  
**Fórmula verificada:** `5*9`  
**Fonte:** Autoral

### F1-05 · Princípio Fundamental da Contagem

Na aula de probabilidade, uma moeda é lançada 4 vezes seguidas e anota-se a sequência de resultados (cara ou coroa) na ordem em que saíram. Quantas sequências diferentes são possíveis?

**Resolução:**

1. Cada lançamento é uma etapa independente com 2 resultados possíveis (cara ou coroa), e a ordem importa — PFC.
2. $2 \cdot 2 \cdot 2 \cdot 2 = 2^4 = 16$.

**Resposta:** 16  
**Fórmula verificada:** `2**4`  
**Fonte:** Autoral

### F1-06 · Princípio Fundamental da Contagem

Da sala de aula ao laboratório há 3 corredores diferentes; do laboratório à biblioteca há 2 escadas diferentes. De quantos modos um aluno pode ir da sala à biblioteca passando pelo laboratório?

**Resolução:**

1. O trajeto tem duas etapas sucessivas: sala → laboratório (3 corredores) e laboratório → biblioteca (2 escadas). Qualquer corredor combina com qualquer escada — PFC.
2. $3 \cdot 2 = 6$.

**Resposta:** 6  
**Fórmula verificada:** `3*2`  
**Fonte:** Autoral

### F1-07 · Princípio Fundamental da Contagem

Um dado comum, de 6 faces numeradas de 1 a 6, é lançado duas vezes e anota-se o par ordenado (1º resultado, 2º resultado). Quantos pares ordenados diferentes são possíveis?

**Resolução:**

1. Cada lançamento tem 6 resultados possíveis, independentes entre si, e a ordem conta: (2, 5) é diferente de (5, 2) — PFC.
2. $6 \cdot 6 = 36$.

**Resposta:** 36  
**Fórmula verificada:** `6*6`  
**Fonte:** Autoral

### F1-08 · Permutação simples

De quantas maneiras diferentes 4 alunos podem se sentar em 4 cadeiras enfileiradas, um aluno por cadeira?

**Resolução:**

1. Cada arrumação é uma ordenação dos 4 alunos nas 4 cadeiras — permutação simples, $P_4 = 4!$.
2. A 1ª cadeira tem 4 opções, a 2ª tem 3, a 3ª tem 2 e a 4ª tem 1: $4! = 4 \cdot 3 \cdot 2 \cdot 1 = 24$.

**Resposta:** 24  
**Fórmula verificada:** `fat(4)`  
**Fonte:** Autoral

### F1-09 · Permutação simples

Um anagrama é qualquer reordenação das letras de uma palavra, com ou sem sentido. Quantos anagramas tem a palavra LIVRO?

**Resolução:**

1. LIVRO tem 5 letras, todas diferentes; cada anagrama é uma ordenação dessas 5 letras — permutação simples, $P_5 = 5!$.
2. $5! = 5 \cdot 4 \cdot 3 \cdot 2 \cdot 1 = 120$.

**Resposta:** 120  
**Fórmula verificada:** `fat(5)`  
**Fonte:** Autoral

### F1-10 · Permutação simples

Seis grupos apresentarão seus trabalhos na feira de ciências da sala, um de cada vez. Quantas ordens de apresentação diferentes existem?

**Resolução:**

1. Definir a ordem é ordenar os 6 grupos, todos distintos — permutação simples, $P_6 = 6!$.
2. $6! = 6 \cdot 5 \cdot 4 \cdot 3 \cdot 2 \cdot 1 = 720$.

**Resposta:** 720  
**Fórmula verificada:** `fat(6)`  
**Fonte:** Autoral

### F1-11 · Permutação simples

Sobre a mesa do professor há 3 livros diferentes. De quantos modos eles podem ser empilhados, um sobre o outro?

**Resolução:**

1. Empilhar é ordenar os 3 livros (de baixo para cima) — permutação simples, $P_3 = 3!$.
2. $3! = 3 \cdot 2 \cdot 1 = 6$.

**Resposta:** 6  
**Fórmula verificada:** `fat(3)`  
**Fonte:** Autoral

### F1-12 · Arranjo simples

Numa turma de 8 alunos serão eleitos um representante e um vice-representante (duas pessoas diferentes). Quantos resultados diferentes a eleição pode ter?

**Resolução:**

1. Escolhem-se 2 dos 8 alunos e a ordem importa (Ana representante e Bruno vice é diferente de Bruno representante e Ana vice) — arranjo simples, $A_{8,2}$.
2. $A_{8,2} = \frac{8!}{6!} = 8 \cdot 7 = 56$.

**Resposta:** 56  
**Fórmula verificada:** `A(8,2)`  
**Fonte:** Autoral

### F1-13 · Arranjo simples

Seis alunos disputam a final da olimpíada de matemática da escola, que premia ouro, prata e bronze, sem empates. Quantos pódios diferentes podem ocorrer?

**Resolução:**

1. Escolhem-se 3 dos 6 alunos e a ordem importa (ouro, prata e bronze são posições diferentes) — arranjo simples, $A_{6,3}$.
2. $A_{6,3} = \frac{6!}{3!} = 6 \cdot 5 \cdot 4 = 120$.

**Resposta:** 120  
**Fórmula verificada:** `A(6,3)`  
**Fonte:** Autoral

### F1-14 · Combinação simples

O professor escolherá 2 de 5 alunos para a monitoria, e os dois terão exatamente a mesma função. Quantas duplas diferentes podem ser formadas?

**Resolução:**

1. Escolhem-se 2 de 5 alunos e a ordem não importa (a dupla Ana–Bruno é a mesma que Bruno–Ana) — combinação simples, $C_{5,2}$.
2. $C_{5,2} = \frac{5!}{2!\,3!} = \frac{5 \cdot 4}{2} = 10$.

**Resposta:** 10  
**Fórmula verificada:** `C(5,2)`  
**Fonte:** Autoral

### F1-15 · Combinação simples

Na estante da sala há 6 livros diferentes, e você pode levar 3 deles para casa. Quantas escolhas diferentes de 3 livros existem?

**Resolução:**

1. Escolhe-se um grupo de 3 entre 6 livros; a ordem em que são pegos não muda o grupo — combinação simples, $C_{6,3}$.
2. $C_{6,3} = \frac{6!}{3!\,3!} = \frac{6 \cdot 5 \cdot 4}{3 \cdot 2 \cdot 1} = 20$.

**Resposta:** 20  
**Fórmula verificada:** `C(6,3)`  
**Fonte:** Autoral

## Fase 2 — Básico (Biblioteca)

### F2-01 · Princípio Fundamental da Contagem

Na biblioteca, cada livro recebe um código com 2 letras (do alfabeto de 26 letras) seguidas de 3 algarismos (0 a 9), sendo permitido repetir letras e algarismos — por exemplo, KK305. Quantos códigos diferentes existem?

**Resolução:**

1. O código tem 5 posições preenchidas uma a uma, com repetição permitida: 26 opções para cada letra e 10 para cada algarismo — PFC.
2. $26 \cdot 26 \cdot 10 \cdot 10 \cdot 10 = 676 \cdot 1000 = 676.000$.

**Resposta:** 676000  
**Fórmula verificada:** `26**2*10**3`  
**Fonte:** Autoral

### F2-02 · Princípio Fundamental da Contagem

A bibliotecária quer etiquetar as estantes apenas com números pares de três algarismos (de 100 a 999). Quantas etiquetas diferentes ela pode usar?

**Resolução:**

1. Preenche-se cada posição do número respeitando sua restrição (PFC). Centenas: não pode ser 0, então 9 opções (1 a 9). Dezenas: qualquer algarismo, 10 opções.
2. Para o número ser par, o algarismo das unidades deve ser 0, 2, 4, 6 ou 8: 5 opções.
3. $9 \cdot 10 \cdot 5 = 450$.

**Resposta:** 450  
**Fórmula verificada:** `9*10*5`  
**Fonte:** Autoral

### F2-03 · Permutação simples

De quantas formas 7 livros diferentes podem ser organizados lado a lado numa prateleira da biblioteca?

**Resolução:**

1. Organizar é ordenar os 7 livros, todos distintos — permutação simples, $P_7 = 7!$.
2. $7! = 7 \cdot 6 \cdot 5 \cdot 4 \cdot 3 \cdot 2 \cdot 1 = 5040$.

**Resposta:** 5040  
**Fórmula verificada:** `fat(7)`  
**Fonte:** Autoral

### F2-04 · Permutação simples

Um anagrama é qualquer reordenação das letras de uma palavra, com ou sem sentido. Quantos anagramas tem a palavra ESTUDO?

**Resolução:**

1. ESTUDO tem 6 letras, todas distintas (E, S, T, U, D, O); cada anagrama é uma ordenação delas — permutação simples, $P_6 = 6!$.
2. $6! = 6 \cdot 5 \cdot 4 \cdot 3 \cdot 2 \cdot 1 = 720$.

**Resposta:** 720  
**Fórmula verificada:** `fat(6)`  
**Fonte:** Autoral

### F2-05 · Permutação com repetição

Um anagrama é qualquer reordenação das letras de uma palavra, com ou sem sentido. Quantos anagramas tem a palavra ARARA?

**Resolução:**

1. ARARA tem 5 letras com repetições: A aparece 3 vezes e R, 2 vezes. Trocar de lugar letras iguais não gera anagrama novo — permutação com repetição, $P_5^{3,2}$.
2. $P_5^{3,2} = \frac{5!}{3!\,2!} = \frac{120}{6 \cdot 2} = 10$.

**Resposta:** 10  
**Fórmula verificada:** `PR(5,3,2)`  
**Fonte:** Autoral

### F2-06 · Permutação com repetição

Um anagrama é qualquer reordenação das letras de uma palavra, com ou sem sentido. Quantos anagramas tem a palavra BANANA?

**Resolução:**

1. BANANA tem 6 letras: A aparece 3 vezes, N aparece 2 vezes e B, 1 vez. Letras iguais trocadas não geram anagrama novo — permutação com repetição, $P_6^{3,2}$.
2. $P_6^{3,2} = \frac{6!}{3!\,2!} = \frac{720}{6 \cdot 2} = 60$.

**Resposta:** 60  
**Fórmula verificada:** `PR(6,3,2)`  
**Fonte:** Autoral

### F2-07 · Permutação com repetição

Um anagrama é qualquer reordenação das letras de uma palavra, com ou sem sentido. Quantos anagramas tem a palavra MATEMATICA (escrita sem acento)?

**Resolução:**

1. MATEMATICA tem 10 letras: M aparece 2 vezes, A 3 vezes, T 2 vezes, e E, I e C uma vez cada — permutação com repetição, $P_{10}^{2,3,2}$.
2. $P_{10}^{2,3,2} = \frac{10!}{2!\,3!\,2!} = \frac{3.628.800}{2 \cdot 6 \cdot 2} = \frac{3.628.800}{24} = 151.200$.

**Resposta:** 151200  
**Fórmula verificada:** `PR(10,2,3,2)`  
**Fonte:** Autoral

### F2-08 · Permutação com repetição

Numa prateleira da biblioteca serão colocados lado a lado 4 exemplares idênticos de um livro de Física e 2 exemplares idênticos de um livro de Química. Quantas disposições diferentes existem?

**Resolução:**

1. Cada disposição é um anagrama de FFFFQQ: 6 posições, com 4 livros iguais (F) e 2 iguais (Q) — permutação com repetição, $P_6^{4,2}$.
2. $P_6^{4,2} = \frac{6!}{4!\,2!} = \frac{720}{24 \cdot 2} = 15$.

**Resposta:** 15  
**Fórmula verificada:** `PR(6,4,2)`  
**Fonte:** Autoral

### F2-09 · Arranjo simples

O cofre da biblioteca usa senhas de 4 algarismos (0 a 9), todos distintos entre si; a senha pode começar com 0. Quantas senhas são possíveis?

**Resolução:**

1. A ordem dos algarismos importa (1234 é diferente de 4321) e não há repetição — arranjo simples dos 10 algarismos tomados 4 a 4, $A_{10,4}$.
2. $A_{10,4} = 10 \cdot 9 \cdot 8 \cdot 7 = 5040$.

**Resposta:** 5040  
**Fórmula verificada:** `A(10,4)`  
**Fonte:** Autoral

### F2-10 · Arranjo simples

Para numerar as estantes, a biblioteca usa apenas os algarismos 1, 2, 3, 4, 5, 6 e 7, sem repetir nenhum. Quantos números de 3 algarismos podem ser formados?

**Resolução:**

1. A ordem importa (123 é diferente de 321) e os algarismos não se repetem; como o 0 não está disponível, a 1ª posição não tem restrição extra — arranjo simples, $A_{7,3}$.
2. $A_{7,3} = 7 \cdot 6 \cdot 5 = 210$.

**Resposta:** 210  
**Fórmula verificada:** `A(7,3)`  
**Fonte:** Autoral

### F2-11 · Arranjo simples

O clube do livro da biblioteca, com 9 membros, vai eleger presidente, secretário e tesoureiro, que devem ser três pessoas diferentes. Quantas chapas diferentes são possíveis?

**Resolução:**

1. Escolhem-se 3 das 9 pessoas para cargos diferentes, então a ordem da escolha importa — arranjo simples, $A_{9,3}$.
2. $A_{9,3} = 9 \cdot 8 \cdot 7 = 504$.

**Resposta:** 504  
**Fórmula verificada:** `A(9,3)`  
**Fonte:** Autoral

### F2-12 · Combinação simples

De uma lista com 10 livros, você deve escolher 4 para resenhar; a ordem de leitura não importa. Quantas escolhas diferentes existem?

**Resolução:**

1. Escolhe-se um grupo de 4 entre 10 livros, sem ordem — combinação simples, $C_{10,4}$.
2. $C_{10,4} = \frac{10 \cdot 9 \cdot 8 \cdot 7}{4!} = \frac{5040}{24} = 210$.

**Resposta:** 210  
**Fórmula verificada:** `C(10,4)`  
**Fonte:** Autoral

### F2-13 · Combinação simples

Uma comissão de 3 pessoas, todas com a mesma função, será formada entre os 8 bibliotecários da escola. Quantas comissões diferentes são possíveis?

**Resolução:**

1. Na comissão não há cargos, logo a ordem de escolha não importa — combinação simples, $C_{8,3}$.
2. $C_{8,3} = \frac{8 \cdot 7 \cdot 6}{3!} = \frac{336}{6} = 56$.

**Resposta:** 56  
**Fórmula verificada:** `C(8,3)`  
**Fonte:** Autoral

### F2-14 · Combinação simples

Numa prova aplicada na biblioteca com 7 questões, o aluno deve escolher exatamente 5 para responder. De quantos modos ele pode fazer essa escolha?

**Resolução:**

1. Importa apenas quais questões são escolhidas, não a ordem em que serão respondidas — combinação simples, $C_{7,5}$.
2. Escolher as 5 que serão feitas equivale a escolher as 2 que ficarão de fora: $C_{7,5} = C_{7,2} = \frac{7 \cdot 6}{2} = 21$.

**Resposta:** 21  
**Fórmula verificada:** `C(7,5)`  
**Fonte:** Autoral

### F2-15 · Recorrência aplicada à contagem

Quantos subconjuntos (incluindo o conjunto vazio e o próprio conjunto) tem um conjunto de 6 livros? Dica do Caderno: se $s_n$ é o número de subconjuntos de um conjunto com $n$ elementos, então $s_0 = 1$ e $s_n = 2s_{n-1}$.

**Resolução:**

1. Ao acrescentar o $n$-ésimo livro, cada subconjunto antigo gera dois: um sem e outro com esse livro. Logo $s_n = 2\,s_{n-1}$, com $s_0 = 1$ (só o vazio) — recorrência linear **homogênea** de **1ª ordem**.
2. $s_1 = 2,\ s_2 = 4,\ s_3 = 8,\ s_4 = 16,\ s_5 = 32,\ s_6 = 2 \cdot 32 = 64$.
3. Conferência pela fórmula fechada $s_n = 2^n$ (cada livro entra ou não entra — PFC): $s_6 = 2^6 = 64$.

**Resposta:** 64  
**Fórmula verificada:** `subconjuntos(6)`  
**Fonte:** Autoral

## Fase 3 — Intermediário (Laboratório de Informática)

### F3-01 · Permutação com repetição

No laboratório de informática, uma senha binária de 8 bits é uma sequência de 8 dígitos, cada um 0 ou 1 (por exemplo, 01001100). Quantas senhas binárias de 8 bits têm exatamente três dígitos 1?

**Resolução:**

1. Cada senha é um anagrama de 11100000: 8 posições com 3 uns iguais e 5 zeros iguais — permutação com repetição, $P_8^{3,5}$ (o mesmo que escolher as 3 posições dos uns, $\binom{8}{3}$).
2. $P_8^{3,5} = \frac{8!}{3!\,5!} = \frac{8 \cdot 7 \cdot 6}{3 \cdot 2 \cdot 1} = 56$.

**Resposta:** 56  
**Fórmula verificada:** `PR(8,3,5)`  
**Fonte:** Autoral

### F3-02 · Permutação com repetição

Um robô do laboratório anda numa grade quadriculada, e cada movimento o leva uma unidade para a direita ou uma unidade para cima. Quantos caminhos diferentes ele pode fazer do ponto (0, 0) ao ponto (4, 3) usando o menor número possível de movimentos?

**Resolução:**

1. Todo caminho mínimo usa exatamente 4 movimentos para a direita (D) e 3 para cima (C), em alguma ordem: é um anagrama de DDDDCCC — permutação com repetição, $P_7^{4,3}$.
2. $P_7^{4,3} = \frac{7!}{4!\,3!} = \frac{7 \cdot 6 \cdot 5}{3 \cdot 2 \cdot 1} = 35$.

**Resposta:** 35  
**Fórmula verificada:** `PR(7,4,3)`  
**Fonte:** Autoral

### F3-03 · Arranjo simples

Os logins dos computadores do laboratório são formados por 3 letras distintas do alfabeto de 26 letras (por exemplo, KTZ é válido, mas KKT não). Quantos logins diferentes existem?

**Resolução:**

1. A ordem das letras importa (KTZ é diferente de ZTK) e não há repetição — arranjo simples, $A_{26,3}$.
2. $A_{26,3} = 26 \cdot 25 \cdot 24 = 15.600$.

**Resposta:** 15600  
**Fórmula verificada:** `A(26,3)`  
**Fonte:** Autoral

### F3-04 · Arranjo simples

O sistema do laboratório gera números de patrimônio com 4 algarismos distintos. Quantos números de 4 algarismos distintos existem? (O primeiro algarismo não pode ser 0, senão o número teria só 3 algarismos.)

**Resolução:**

1. Arranjo com restrição na 1ª posição: começa-se pela posição restrita (PFC) e completa-se com um arranjo. O 1º algarismo tem 9 opções (1 a 9).
2. Sobram 9 algarismos (agora incluindo o 0) para as 3 posições restantes, em ordem e sem repetição: $A_{9,3} = 9 \cdot 8 \cdot 7 = 504$.
3. Total: $9 \cdot A_{9,3} = 9 \cdot 504 = 4536$.

**Resposta:** 4536  
**Fórmula verificada:** `9*A(9,3)`  
**Fonte:** Autoral

### F3-05 · Arranjo simples

O laboratório terá 4 turnos de monitoria (segunda, terça, quarta e quinta), cada um com um monitor diferente, escolhidos entre 12 candidatos. Quantas escalas diferentes podem ser montadas?

**Resolução:**

1. Escolhem-se 4 dos 12 candidatos e a ordem importa, pois cada escolhido fica num dia diferente — arranjo simples, $A_{12,4}$.
2. $A_{12,4} = 12 \cdot 11 \cdot 10 \cdot 9 = 11.880$.

**Resposta:** 11880  
**Fórmula verificada:** `A(12,4)`  
**Fonte:** Autoral

### F3-06 · Combinação simples

Uma equipe de 4 programadores, sem funções definidas, será escolhida entre os 9 alunos do clube de programação. Quantas equipes diferentes são possíveis?

**Resolução:**

1. A equipe é um grupo sem ordem nem cargos — combinação simples, $C_{9,4}$.
2. $C_{9,4} = \frac{9 \cdot 8 \cdot 7 \cdot 6}{4!} = \frac{3024}{24} = 126$.

**Resposta:** 126  
**Fórmula verificada:** `C(9,4)`  
**Fonte:** Autoral

### F3-07 · Combinação simples

Num programa de geometria do laboratório, marcam-se 10 pontos distintos sobre uma circunferência. Quantos triângulos têm os três vértices entre esses pontos?

**Resolução:**

1. Três pontos de uma circunferência nunca estão alinhados, então qualquer trio forma um triângulo, e a ordem dos vértices não muda o triângulo — combinação simples, $C_{10,3}$.
2. $C_{10,3} = \frac{10 \cdot 9 \cdot 8}{3!} = \frac{720}{6} = 120$.

**Resposta:** 120  
**Fórmula verificada:** `C(10,3)`  
**Fonte:** Autoral

### F3-08 · Combinação simples

O logotipo do laboratório é um octógono convexo (polígono de 8 lados). Quantas diagonais tem esse octógono? (Diagonal é o segmento que liga dois vértices não vizinhos.)

**Resolução:**

1. Todo segmento que liga 2 dos 8 vértices é um lado ou uma diagonal; escolher 2 vértices sem ordem é uma combinação: $C_{8,2} = \frac{8 \cdot 7}{2} = 28$ segmentos.
2. Desses 28 segmentos, 8 são os lados do octógono, que não são diagonais.
3. Diagonais: $28 - 8 = 20$.

**Resposta:** 20  
**Fórmula verificada:** `C(8,2)-8`  
**Fonte:** Autoral

### F3-09 · Problemas com restrições e integração de conceitos

Um anagrama é qualquer reordenação das letras de uma palavra, com ou sem sentido. Quantos anagramas da palavra PROVA começam por vogal?

**Resolução:**

1. Permutação com restrição na 1ª posição: trata-se primeiro a posição restrita e depois permutam-se as demais (PFC). PROVA tem 2 vogais (O e A), então a 1ª letra tem 2 opções.
2. As 4 letras restantes, todas distintas, ocupam as 4 posições seguintes: $4! = 24$.
3. Total: $2 \cdot 4! = 2 \cdot 24 = 48$.

**Resposta:** 48  
**Fórmula verificada:** `2*fat(4)`  
**Fonte:** Autoral

### F3-10 · Problemas com restrições e integração de conceitos

Um anagrama é qualquer reordenação das letras de uma palavra, com ou sem sentido. Quantos anagramas da palavra CADERNO começam e terminam por consoante?

**Resolução:**

1. Permutação com restrições nas pontas: preenchem-se primeiro as posições restritas (PFC). CADERNO tem 7 letras distintas, das quais 4 são consoantes (C, D, R, N).
2. 1ª letra: 4 consoantes; última letra: 3 consoantes restantes. As 5 letras que sobram permutam nas posições do meio: $5! = 120$.
3. Total: $4 \cdot 3 \cdot 5! = 12 \cdot 120 = 1440$.

**Resposta:** 1440  
**Fórmula verificada:** `4*3*fat(5)`  
**Fonte:** Autoral

### F3-11 · Problemas com restrições e integração de conceitos

Uma comissão de 4 alunos, sem cargos, será formada numa turma de 10 alunos do laboratório, e Ana obrigatoriamente faz parte dela. Quantas comissões diferentes são possíveis?

**Resolução:**

1. Combinação com elemento obrigatório: como Ana já está garantida, basta escolher os outros 3 membros entre os 9 alunos restantes, sem ordem.
2. $C_{9,3} = \frac{9 \cdot 8 \cdot 7}{3!} = \frac{504}{6} = 84$.

**Resposta:** 84  
**Fórmula verificada:** `C(9,3)`  
**Fonte:** Autoral

### F3-12 · Problemas com restrições e integração de conceitos

Seis amigos, entre eles Bia e Caio, fazem fila para usar a impressora do laboratório. Em quantas filas Bia e Caio ficam juntos (lado a lado)?

**Resolução:**

1. Permutação com elementos juntos: 'cola-se' Bia e Caio num único bloco, que se comporta como uma só pessoa.
2. Ficam 5 elementos a ordenar (o bloco e os outros 4 amigos): $5! = 120$. Dentro do bloco, a ordem pode ser Bia–Caio ou Caio–Bia: 2 modos.
3. Total: $2 \cdot 5! = 2 \cdot 120 = 240$.

**Resposta:** 240  
**Fórmula verificada:** `2*fat(5)`  
**Fonte:** Autoral

### F3-13 · Problemas com restrições e integração de conceitos

Com os algarismos 0, 1, 2, 3, 4 e 5, sem repetir nenhum, quantos números de 3 algarismos podem ser formados para etiquetar os computadores do laboratório? (Um número não começa com 0.)

**Resolução:**

1. PFC com restrição na 1ª posição: começa-se pela casa das centenas, que não pode ser 0 — 5 opções (1 a 5).
2. Dezenas: qualquer um dos 5 algarismos restantes (o 0 passa a valer); unidades: qualquer um dos 4 que sobram.
3. Total: $5 \cdot 5 \cdot 4 = 100$.

**Resposta:** 100  
**Fórmula verificada:** `5*5*4`  
**Fonte:** Autoral

### F3-14 · Recorrência aplicada à contagem

Doze programadores se cumprimentam, cada par uma única vez. Com $h_1 = 0$ e $h_n = h_{n-1} + (n-1)$ (quem chega cumprimenta os $n-1$ presentes), quantos cumprimentos ocorrem?

**Resolução:**

1. Quando a $n$-ésima pessoa chega, cumprimenta as $n-1$ presentes: $h_n = h_{n-1} + (n-1)$, $h_1 = 0$ — recorrência linear de 1ª ordem **não homogênea**.
2. Desenrolando: $h_n = 0 + 1 + 2 + \dots + (n-1) = \frac{n(n-1)}{2} = \binom{n}{2}$.
3. Para $n = 12$: $\frac{12 \cdot 11}{2} = 66$.

**Resposta:** 66  
**Fórmula verificada:** `apertos(12)`  
**Fonte:** Autoral

### F3-15 · Recorrência aplicada à contagem

No Caderno do laboratório está anotado: $\binom{9}{3} = 84$ e $\binom{9}{4} = 126$. Pela relação de Stifel, $\binom{n}{k} = \binom{n-1}{k-1} + \binom{n-1}{k}$, quanto vale $\binom{10}{4}$?

**Resolução:**

1. A relação de Stifel é a recorrência do triângulo de Pascal: cada linha $n$ sai da linha $n-1$ — recorrência linear, homogênea, de **1ª ordem** em $n$. Ela vale porque, entre $n$ objetos, os grupos de $k$ que contêm um objeto fixo são $\binom{n-1}{k-1}$ e os que não o contêm são $\binom{n-1}{k}$.
2. $\binom{10}{4} = \binom{9}{3} + \binom{9}{4} = 84 + 126 = 210$.
3. Conferência pela fórmula fechada: $\binom{10}{4} = \frac{10 \cdot 9 \cdot 8 \cdot 7}{4!} = \frac{5040}{24} = 210$.

**Resposta:** 210  
**Fórmula verificada:** `C(9,3)+C(9,4)`  
**Fonte:** Autoral

## Fase 4 — Avançado (Sala dos Professores)

### F4-01 · Combinação simples

Uma banca de 5 professores, sem cargos, será sorteada entre os 12 professores da escola. Quantas bancas diferentes são possíveis?

**Resolução:**

1. A banca é um grupo sem ordem nem cargos — combinação simples, $C_{12,5}$.
2. $C_{12,5} = \frac{12 \cdot 11 \cdot 10 \cdot 9 \cdot 8}{5!} = \frac{95.040}{120} = 792$.

**Resposta:** 792  
**Fórmula verificada:** `C(12,5)`  
**Fonte:** Autoral

### F4-02 · Combinação simples

Na sala dos professores há 6 professores de Matemática e 4 de Física. Quantas comissões diferentes podem ser formadas com exatamente 3 professores de Matemática e 2 de Física?

**Resolução:**

1. Duas combinações independentes ligadas pelo PFC: escolhem-se os professores de Matemática e, depois, os de Física, sem ordem dentro de cada grupo.
2. Matemática: $C_{6,3} = \frac{6 \cdot 5 \cdot 4}{3!} = 20$. Física: $C_{4,2} = \frac{4 \cdot 3}{2} = 6$.
3. Total: $C_{6,3} \cdot C_{4,2} = 20 \cdot 6 = 120$.

**Resposta:** 120  
**Fórmula verificada:** `C(6,3)*C(4,2)`  
**Fonte:** Autoral

### F4-03 · Problemas com restrições e integração de conceitos

Na sala dos professores estão 6 homens e 5 mulheres. Quantas comissões de 4 pessoas, sem cargos, têm pelo menos uma mulher?

**Resolução:**

1. 'Pelo menos uma' pede o complementar: do total de comissões retiram-se as que não têm nenhuma mulher (combinação + complementar).
2. Total: $C_{11,4} = \frac{11 \cdot 10 \cdot 9 \cdot 8}{4!} = 330$. Só com homens: $C_{6,4} = 15$.
3. Com pelo menos uma mulher: $330 - 15 = 315$.

**Resposta:** 315  
**Fórmula verificada:** `C(11,4)-C(6,4)`  
**Fonte:** Autoral

### F4-04 · Problemas com restrições e integração de conceitos

Um anagrama é qualquer reordenação das letras de uma palavra, com ou sem sentido. Quantos anagramas da palavra PROFESSOR começam com P?

**Resolução:**

1. Fixa-se a restrição: o P ocupa a 1ª posição (e só há um P na palavra). Restam 8 letras para ordenar: R, O, F, E, S, S, O, R.
2. Entre elas, R, O e S aparecem 2 vezes cada — permutação com repetição, $P_8^{2,2,2}$.
3. $P_8^{2,2,2} = \frac{8!}{2!\,2!\,2!} = \frac{40.320}{8} = 5040$.

**Resposta:** 5040  
**Fórmula verificada:** `PR(8,2,2,2)`  
**Fonte:** Autoral

### F4-05 · Problemas com restrições e integração de conceitos

Sete professores, entre eles Alberto e Bruna, posam em fila para a foto do mural. Em quantas filas Alberto e Bruna NÃO ficam lado a lado?

**Resolução:**

1. Restrição negativa: conta-se pelo complementar — todas as filas menos aquelas em que os dois ficam juntos.
2. Total: $7! = 5040$. Juntos: a dupla vira um bloco, com $6!$ ordens para os 6 elementos e 2 ordens dentro do bloco: $2 \cdot 6! = 1440$.
3. Não lado a lado: $5040 - 1440 = 3600$.

**Resposta:** 3600  
**Fórmula verificada:** `fat(7)-2*fat(6)`  
**Fonte:** Autoral

### F4-06 · Problemas com restrições e integração de conceitos

Um anagrama é qualquer reordenação das letras de uma palavra, com ou sem sentido. Quantos anagramas da palavra CADERNO têm as três vogais juntas, em qualquer ordem (como em CDAEORN)?

**Resolução:**

1. Permutação com elementos juntos: as vogais A, E e O formam um bloco, que conta como uma letra só.
2. Ordenam-se 5 elementos (o bloco e as consoantes C, D, R, N): $5! = 120$. Dentro do bloco, as 3 vogais permutam: $3! = 6$.
3. Total: $5! \cdot 3! = 120 \cdot 6 = 720$.

**Resposta:** 720  
**Fórmula verificada:** `fat(5)*fat(3)`  
**Fonte:** Autoral

### F4-07 · Problemas com restrições e integração de conceitos

Um anagrama é qualquer reordenação das letras de uma palavra, com ou sem sentido. Em quantos anagramas da palavra LIVRO a letra L aparece antes da letra V (não necessariamente vizinhas)?

**Resolução:**

1. Argumento de simetria: trocando L e V de lugar, cada anagrama com L antes de V corresponde a exatamente um anagrama com V antes de L.
2. Logo os $5! = 120$ anagramas se dividem em duas metades do mesmo tamanho.
3. L antes de V: $\frac{120}{2} = 60$.

**Resposta:** 60  
**Fórmula verificada:** `fat(5)//2`  
**Fonte:** Autoral

### F4-08 · Problemas com restrições e integração de conceitos

Os armários da sala dos professores serão numerados com números pares de 4 algarismos distintos (o primeiro algarismo não pode ser 0). Quantos números desse tipo existem?

**Resolução:**

1. Há restrições na 1ª e na última posição que interagem por causa do 0, então separam-se casos pelo algarismo das unidades (PFC + arranjo em cada caso).
2. Caso 1 — termina em 0: as 3 primeiras posições usam 3 dos 9 algarismos restantes, em ordem: $A_{9,3} = 9 \cdot 8 \cdot 7 = 504$.
3. Caso 2 — termina em 2, 4, 6 ou 8 (4 opções): o 1º algarismo não pode ser 0 nem o das unidades (8 opções), e as 2 posições do meio usam 2 dos 8 restantes: $4 \cdot 8 \cdot A_{8,2} = 4 \cdot 8 \cdot 56 = 1792$.
4. Total: $504 + 1792 = 2296$.

**Resposta:** 2296  
**Fórmula verificada:** `A(9,3)+4*8*A(8,2)`  
**Fonte:** Autoral

### F4-09 · Problemas com restrições e integração de conceitos

As senhas do armário dos professores têm 4 dígitos de 0 a 9, podendo repetir. Quantas senhas têm pelo menos um dígito repetido?

**Resolução:**

1. 'Pelo menos um repetido' é o complementar de 'todos distintos': do total retiram-se as senhas sem repetição.
2. Total (PFC): $10^4 = 10.000$. Todos distintos (arranjo): $A_{10,4} = 10 \cdot 9 \cdot 8 \cdot 7 = 5040$.
3. Com algum dígito repetido: $10.000 - 5040 = 4960$.

**Resposta:** 4960  
**Fórmula verificada:** `10**4-A(10,4)`  
**Fonte:** Autoral

### F4-10 · Problemas com restrições e integração de conceitos

Uma comissão de 5 pessoas, sem cargos, será escolhida entre 8 professores, mas Paulo e Rita não podem participar juntos (pode entrar um deles, ou nenhum dos dois). Quantas comissões são possíveis?

**Resolução:**

1. Restrição 'não juntos': conta-se pelo complementar — total de comissões menos as que têm Paulo e Rita ao mesmo tempo.
2. Total: $C_{8,5} = C_{8,3} = 56$. Com os dois: faltam 3 membros escolhidos entre os 6 outros, $C_{6,3} = 20$.
3. Comissões válidas: $56 - 20 = 36$.

**Resposta:** 36  
**Fórmula verificada:** `C(8,5)-C(6,3)`  
**Fonte:** Autoral

### F4-11 · Problemas com restrições e integração de conceitos

Cinco livros distintos de Matemática e três livros distintos de Física serão arrumados numa prateleira da sala dos professores, de modo que os livros de mesma matéria fiquem juntos. Quantas arrumações são possíveis?

**Resolução:**

1. Permutação em blocos: os livros de cada matéria formam um bloco; ordenam-se os blocos e, depois, os livros dentro de cada bloco (PFC).
2. Ordem dos 2 blocos: $2! = 2$. Dentro do bloco de Matemática: $5! = 120$; dentro do de Física: $3! = 6$.
3. Total: $2! \cdot 5! \cdot 3! = 2 \cdot 120 \cdot 6 = 1440$.

**Resposta:** 1440  
**Fórmula verificada:** `fat(2)*fat(5)*fat(3)`  
**Fonte:** Autoral

### F4-12 · Problemas com restrições e integração de conceitos

Quantos subconjuntos de 3 elementos do conjunto $\{1, 2, 3, \dots, 10\}$ contêm pelo menos dois números consecutivos (como 4 e 5)?

**Resolução:**

1. Combinação + complementar: do total de subconjuntos de 3 elementos retiram-se os que não têm nenhum par de números consecutivos.
2. Total: $C_{10,3} = 120$. Sem consecutivos: se $a < b < c$ não têm vizinhos, então $a < b-1 < c-2$ é um trio qualquer de $\{1, \dots, 8\}$, e vice-versa; logo são $C_{8,3} = 56$.
3. Com pelo menos dois consecutivos: $120 - 56 = 64$.

**Resposta:** 64  
**Fórmula verificada:** `C(10,3)-C(8,3)`  
**Fonte:** Autoral

### F4-13 · Recorrência aplicada à contagem

A escada da sala dos professores tem 8 degraus. Subindo 1 ou 2 degraus por passo, de quantas maneiras diferentes se chega ao topo?

**Resolução:**

1. Seja $e_n$ o número de modos de subir $n$ degraus. O último passo tem 1 degrau (restam $e_{n-1}$ modos) ou 2 (restam $e_{n-2}$).
2. Logo $e_n = e_{n-1} + e_{n-2}$ — recorrência linear homogênea de **2ª ordem**, com $e_1 = 1$ e $e_2 = 2$.
3. $e_3 = 3,\ e_4 = 5,\ e_5 = 8,\ e_6 = 13,\ e_7 = 21$.
4. Conferência por combinação ($k$ passos duplos): $\binom{8}{0}+\binom{7}{1}+\binom{6}{2}+\binom{5}{3}+\binom{4}{4} = 1+7+15+10+1$, logo $e_8 = 34$.

**Resposta:** 34  
**Fórmula verificada:** `escada(8)`  
**Fonte:** Autoral

### F4-14 · Recorrência aplicada à contagem

O corredor da sala dos professores é uma faixa de $2 \times 7$ (2 de largura por 7 de comprimento) e será coberto com dominós de $2 \times 1$, sem sobras nem sobreposições. De quantas maneiras diferentes isso pode ser feito?

**Resolução:**

1. Seja $t_n$ o número de coberturas de uma faixa $2 \times n$. Na ponta da faixa há um dominó atravessado na largura (sobra uma faixa $2 \times (n-1)$) ou dois dominós no sentido do comprimento, um em cada linha, ocupando juntos um quadrado $2 \times 2$ (sobra uma faixa $2 \times (n-2)$).
2. Logo $t_n = t_{n-1} + t_{n-2}$ — recorrência linear homogênea de **2ª ordem**, com $t_1 = 1$ e $t_2 = 2$: a mesma da escada de 1 ou 2 degraus.
3. $t_3 = 3,\ t_4 = 5,\ t_5 = 8,\ t_6 = 13,\ t_7 = t_6 + t_5 = 13 + 8 = 21$.
4. Conferência por combinação ($k$ pares de dominós deitados): $\binom{7}{0}+\binom{6}{1}+\binom{5}{2}+\binom{4}{3} = 1+6+10+4$, logo $t_7 = 21$.

**Resposta:** 21  
**Fórmula verificada:** `escada(7)`  
**Fonte:** Autoral

### F4-15 · Recorrência aplicada à contagem

Uma senha binária de 9 bits é uma sequência de 9 dígitos, cada um 0 ou 1. Quantas senhas binárias de 9 bits não têm dois dígitos 1 consecutivos? Dica: sendo $b_n$ o número dessas senhas com $n$ bits, vale $b_n = b_{n-1} + b_{n-2}$, com $b_1 = 2$ e $b_2 = 3$.

**Resolução:**

1. Recorrência pelo último bit: se a senha termina em 0, os $n-1$ bits anteriores formam qualquer senha válida ($b_{n-1}$); se termina em 1, o bit anterior é 0 e antes dele vem qualquer senha válida de $n-2$ bits ($b_{n-2}$). Logo $b_n = b_{n-1} + b_{n-2}$ — linear homogênea de **2ª ordem**, com $b_1 = 2$ (0, 1) e $b_2 = 3$ (00, 01, 10).
2. $b_3 = 5,\ b_4 = 8,\ b_5 = 13,\ b_6 = 21,\ b_7 = 34,\ b_8 = 55$.
3. Ligação com a escada ($e_1 = 1$, $e_2 = 2$, $e_n = e_{n-1} + e_{n-2}$): $b_1 = 2 = e_2$ e $b_2 = 3 = e_3$, e as duas sequências seguem a mesma recorrência, então $b_n = e_{n+1}$ para todo $n$. Por isso $b_9 = e_{10} = 34 + 55 = 89$.

**Resposta:** 89  
**Fórmula verificada:** `escada(10)`  
**Fonte:** Autoral

## Fase 5 — Difícil (Cofre da Diretoria)

### F5-01 · Problemas com restrições e integração de conceitos

Para abrir o cofre da diretoria, será formada uma comissão de 5 pessoas, sem cargos, escolhidas entre 7 alunos e 5 professores, com pelo menos 2 professores. Quantas comissões são possíveis?

**Resolução:**

1. 'Pelo menos 2' pede o complementar: do total de comissões retiram-se as que têm 0 ou exatamente 1 professor (combinação + PFC).
2. Total: $C_{12,5} = 792$. Nenhum professor: $C_{7,5} = 21$. Exatamente 1 professor: $C_{5,1} \cdot C_{7,4} = 5 \cdot 35 = 175$.
3. Com pelo menos 2 professores: $792 - 21 - 175 = 596$.

**Resposta:** 596  
**Fórmula verificada:** `C(12,5)-C(7,5)-C(5,1)*C(7,4)`  
**Fonte:** Autoral

### F5-02 · Problemas com restrições e integração de conceitos

Um anagrama é qualquer reordenação das letras de uma palavra, com ou sem sentido. Quantos anagramas da palavra COMBINAR começam por consoante e terminam por vogal?

**Resolução:**

1. Permutação com restrições nas pontas: preenchem-se primeiro as posições restritas (PFC). COMBINAR tem 8 letras distintas: 5 consoantes (C, M, B, N, R) e 3 vogais (O, I, A).
2. 1ª letra: 5 consoantes; última letra: 3 vogais. As 6 letras restantes permutam nas posições do meio: $6! = 720$.
3. Total: $5 \cdot 3 \cdot 6! = 15 \cdot 720 = 10.800$.

**Resposta:** 10800  
**Fórmula verificada:** `5*3*fat(6)`  
**Fonte:** Autoral

### F5-03 · Problemas com restrições e integração de conceitos

Um anagrama é qualquer reordenação das letras de uma palavra, com ou sem sentido. Em quantos anagramas da palavra ESCOLA não há duas vogais vizinhas?

**Resolução:**

1. Técnica das lacunas para elementos 'não vizinhos': primeiro ordenam-se as consoantes S, C e L: $3! = 6$ modos.
2. As consoantes criam 4 lacunas ( _ S _ C _ L _ ). Para nenhuma vogal ficar ao lado de outra, cada vogal (E, O, A) vai para uma lacuna diferente, e a ordem importa: $A_{4,3} = 4 \cdot 3 \cdot 2 = 24$.
3. Total: $3! \cdot A_{4,3} = 6 \cdot 24 = 144$.

**Resposta:** 144  
**Fórmula verificada:** `fat(3)*A(4,3)`  
**Fonte:** Autoral

### F5-04 · Problemas com restrições e integração de conceitos

O número de série do cofre tem 5 algarismos distintos e é divisível por 5. Quantos números de 5 algarismos distintos (o primeiro não pode ser 0) são divisíveis por 5?

**Resolução:**

1. Um número é divisível por 5 quando termina em 0 ou em 5. Como o 0 também afeta a 1ª posição, separam-se dois casos (PFC + arranjo em cada um).
2. Termina em 0: as 4 primeiras posições usam 4 dos 9 algarismos restantes, em ordem: $A_{9,4} = 9 \cdot 8 \cdot 7 \cdot 6 = 3024$.
3. Termina em 5: o 1º algarismo não pode ser 0 nem 5 (8 opções), e as 3 posições do meio usam 3 dos 8 restantes: $8 \cdot A_{8,3} = 8 \cdot 336 = 2688$.
4. Total: $3024 + 2688 = 5712$.

**Resposta:** 5712  
**Fórmula verificada:** `A(9,4)+8*A(8,3)`  
**Fonte:** Autoral

### F5-05 · Problemas com restrições e integração de conceitos

No painel do cofre, um ponto luminoso anda numa grade, sempre uma unidade para a direita ou uma unidade para cima. Quantos caminhos mínimos do ponto (0, 0) ao ponto (6, 4) passam pelo ponto (2, 2)?

**Resolução:**

1. Caminho com ponto obrigatório: divide-se em dois trechos ligados pelo PFC; cada trecho é uma permutação com repetição de movimentos D (direita) e C (cima).
2. De (0, 0) a (2, 2): 2 D e 2 C, $\binom{4}{2} = 6$ caminhos. De (2, 2) a (6, 4): 4 D e 2 C, $\binom{6}{2} = 15$ caminhos.
3. Total: $6 \cdot 15 = 90$.

**Resposta:** 90  
**Fórmula verificada:** `C(4,2)*C(6,2)`  
**Fonte:** Autoral

### F5-06 · Problemas com restrições e integração de conceitos

Para chegar ao cofre, é preciso atravessar uma grade do ponto (0, 0) ao ponto (5, 5), andando sempre uma unidade para a direita ou uma unidade para cima (caminho mínimo). No ponto (2, 2) há um sensor do alarme. Quantos caminhos mínimos NÃO passam por (2, 2)?

**Resolução:**

1. Complementar: todos os caminhos mínimos menos os que passam pelo sensor; cada caminho é um anagrama de movimentos D (direita) e C (cima).
2. Total: 5 D e 5 C, $\binom{10}{5} = 252$. Pelo sensor (PFC nos dois trechos): $\binom{4}{2} \cdot \binom{6}{3} = 6 \cdot 20 = 120$.
3. Sem passar pelo sensor: $252 - 120 = 132$.

**Resposta:** 132  
**Fórmula verificada:** `C(10,5)-C(4,2)*C(6,3)`  
**Fonte:** Autoral

### F5-07 · Problemas com restrições e integração de conceitos

Oito alunos serão divididos em 2 grupos de 4 para a gincana do cofre, sem nome, cor ou ordem entre os grupos. De quantas maneiras a divisão pode ser feita?

**Resolução:**

1. Combinação com correção de contagem dupla: escolher os 4 alunos de um grupo define a divisão (os outros 4 formam o segundo grupo): $C_{8,4} = 70$.
2. Como os grupos não têm nome, escolher um grupo ou o seu complementar produz a mesma divisão — cada divisão foi contada 2 vezes.
3. Divisões: $\frac{70}{2} = 35$.

**Resposta:** 35  
**Fórmula verificada:** `C(8,4)//2`  
**Fonte:** Autoral

### F5-08 · Problemas com restrições e integração de conceitos

Quatro casais posam em fila para a foto da diretoria, e cada casal deve ficar junto (lado a lado). Quantas filas diferentes são possíveis?

**Resolução:**

1. Permutação em blocos: cada casal vira um bloco; ordenam-se os 4 blocos e, depois, as pessoas dentro de cada bloco (PFC).
2. Ordem dos blocos: $4! = 24$. Cada casal pode ficar em 2 ordens internas, e são 4 casais: $2^4 = 16$.
3. Total: $4! \cdot 2^4 = 24 \cdot 16 = 384$.

**Resposta:** 384  
**Fórmula verificada:** `fat(4)*2**4`  
**Fonte:** Autoral

### F5-09 · Problemas com restrições e integração de conceitos

De um grupo de 5 casais, serão escolhidas 4 pessoas para guardar as chaves do cofre, sem que haja um casal entre as escolhidas. Quantas escolhas são possíveis?

**Resolução:**

1. Combinação + PFC: como não pode haver casal, as 4 pessoas vêm de 4 casais diferentes. Primeiro escolhem-se esses casais: $C_{5,4} = 5$.
2. De cada casal escolhido, pega-se uma das 2 pessoas: $2^4 = 16$.
3. Total: $5 \cdot 16 = 80$.

**Resposta:** 80  
**Fórmula verificada:** `C(5,4)*2**4`  
**Fonte:** Autoral

### F5-10 · Problemas com restrições e integração de conceitos

Um anagrama é qualquer reordenação das letras de uma palavra, com ou sem sentido. Quantos anagramas da palavra ARARAQUARA começam com Q?

**Resolução:**

1. Fixa-se o Q na 1ª posição (há um só Q). Restam 9 letras: A (5 vezes), R (3 vezes) e U (1 vez) — permutação com repetição, $P_9^{5,3}$.
2. $P_9^{5,3} = \frac{9!}{5!\,3!} = \frac{9 \cdot 8 \cdot 7 \cdot 6}{3 \cdot 2 \cdot 1} = \frac{3024}{6} = 504$.

**Resposta:** 504  
**Fórmula verificada:** `PR(9,5,3)`  
**Fonte:** Autoral

### F5-11 · Problemas com restrições e integração de conceitos

A senha do cofre tem 4 caracteres; cada caractere é uma vogal (A, E, I, O, U) ou um algarismo (0 a 9), com repetição permitida. Quantas senhas têm exatamente 2 vogais?

**Resolução:**

1. Combinação + PFC: primeiro escolhem-se as 2 posições (entre as 4) que receberão vogais, sem ordem: $C_{4,2} = 6$.
2. Cada posição de vogal tem 5 opções e cada posição de algarismo tem 10, com repetição: $5^2 \cdot 10^2 = 2500$.
3. Total: $6 \cdot 2500 = 15.000$.

**Resposta:** 15000  
**Fórmula verificada:** `C(4,2)*5**2*10**2`  
**Fonte:** Autoral

### F5-12 · Problemas com restrições e integração de conceitos

Quantos subconjuntos de 4 elementos do conjunto $\{1, 2, 3, \dots, 12\}$ não têm dois números consecutivos (como 4 e 5)?

**Resolução:**

1. Bijeção para 'sem consecutivos': se $a < b < c < d$ não têm vizinhos, os números $a,\ b-1,\ c-2,\ d-3$ continuam distintos e estão em $\{1, \dots, 9\}$; e todo quarteto de $\{1, \dots, 9\}$ volta a um subconjunto sem consecutivos somando $0, 1, 2, 3$.
2. Logo a contagem é a dos quartetos quaisquer de 9 números: $C_{9,4} = \frac{9 \cdot 8 \cdot 7 \cdot 6}{4!} = \frac{3024}{24} = 126$.

**Resposta:** 126  
**Fórmula verificada:** `C(9,4)`  
**Fonte:** Autoral

### F5-13 · Recorrência aplicada à contagem

Cinco professores fazem amigo secreto e ninguém pode tirar o próprio nome. Seja $D_n$ o número de sorteios válidos com $n$ pessoas; vale $D_1 = 0$, $D_2 = 1$ e $D_n = (n-1)(D_{n-1} + D_{n-2})$. Quantos sorteios válidos existem para os 5 professores?

**Resolução:**

1. Trata-se de desarranjos (permutações em que ninguém fica no próprio lugar). A pessoa 1 tira alguém $k$ ($n-1$ opções); se $k$ tirar a 1, sobram $D_{n-2}$ sorteios para os demais; se não, a situação equivale a um desarranjo de $n-1$ pessoas, $D_{n-1}$.
2. Logo $D_n = (n-1)(D_{n-1} + D_{n-2})$ — recorrência linear homogênea de **2ª ordem**, com coeficiente variável $(n-1)$.
3. $D_3 = 2(1 + 0) = 2$, $D_4 = 3(2 + 1) = 9$, $D_5 = 4(9 + 2) = 44$.
4. Conferência pela fórmula fechada $D_n = n! \sum_{i=0}^{n} \frac{(-1)^i}{i!}$: $D_5 = 120 - 120 + 60 - 20 + 5 - 1 = 44$.

**Resposta:** 44  
**Fórmula verificada:** `desarranjo(5)`  
**Fonte:** Autoral

### F5-14 · Recorrência aplicada à contagem

O professor devolve aleatoriamente as 6 provas corrigidas a seus 6 alunos, uma para cada. Em quantas distribuições exatamente 2 alunos recebem a própria prova? (Desarranjos: $D_1 = 0$, $D_2 = 1$ e $D_n = (n-1)(D_{n-1} + D_{n-2})$ contam as distribuições de $n$ provas em que ninguém recebe a própria.)

**Resolução:**

1. Combinação + desarranjo: primeiro escolhem-se os 2 alunos que recebem a própria prova, $C_{6,2} = 15$; os outros 4 não podem receber a própria prova.
2. Esses 4 formam um desarranjo, dado pela recorrência linear homogênea de **2ª ordem** (coeficiente variável) $D_n = (n-1)(D_{n-1} + D_{n-2})$: $D_3 = 2$, $D_4 = 3(2 + 1) = 9$. Conferência pela fórmula fechada: $D_4 = 24 - 24 + 12 - 4 + 1 = 9$.
3. Total: $C_{6,2} \cdot D_4 = 15 \cdot 9 = 135$.

**Resposta:** 135  
**Fórmula verificada:** `C(6,2)*desarranjo(4)`  
**Fonte:** Autoral

### F5-15 · Recorrência aplicada à contagem

No painel do cofre, um ponto anda do ponto (0, 0) ao ponto (4, 4), uma unidade por vez, para a direita ou para cima. Quantos desses caminhos mínimos nunca passam acima da diagonal $y = x$ (tocá-la é permitido)? Dica: são os números de Catalan, $c_0 = 1$ e $c_n = \sum_{i=0}^{n-1} c_i\,c_{n-1-i}$.

**Resolução:**

1. Seja $c_n$ o número de caminhos de (0, 0) a $(n, n)$ que nunca ficam acima de $y = x$. Separando pelo primeiro retorno à diagonal, no ponto $(i+1, i+1)$, obtém-se $c_n = \sum_{i=0}^{n-1} c_i\,c_{n-1-i}$, $c_0 = 1$ — recorrência **não linear** (multiplica termos entre si), em que cada termo depende de todos os anteriores.
2. $c_1 = 1$, $c_2 = 1 \cdot 1 + 1 \cdot 1 = 2$, $c_3 = c_0c_2 + c_1c_1 + c_2c_0 = 2 + 1 + 2 = 5$.
3. $c_4 = c_0c_3 + c_1c_2 + c_2c_1 + c_3c_0 = 5 + 2 + 2 + 5 = 14$.
4. Conferência pela fórmula fechada: $c_4 = \frac{1}{4+1}\binom{8}{4} = \frac{70}{5} = 14$.

**Resposta:** 14  
**Fórmula verificada:** `catalan(4)`  
**Fonte:** Autoral
