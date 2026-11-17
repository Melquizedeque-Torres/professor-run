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
