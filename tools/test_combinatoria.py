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
