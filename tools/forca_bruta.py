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
