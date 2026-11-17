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
