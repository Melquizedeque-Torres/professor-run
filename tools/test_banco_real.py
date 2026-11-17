import unittest

from verificar_banco import CAMINHO_PADRAO, carregar, verificar


class TestBancoOficial(unittest.TestCase):
    def test_banco_oficial_passa_em_todas_as_verificacoes(self):
        erros = verificar(carregar(CAMINHO_PADRAO))
        self.assertEqual(erros, [], "\n".join(erros))


if __name__ == "__main__":
    unittest.main()
