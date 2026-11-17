import json
import tempfile
import unittest
from pathlib import Path

from gerar_banco import gerar_markdown, main

Q1 = {"id": "F1-01", "fase": 1, "topico": "PFC", "enunciado": "Camisetas e calças?",
      "resposta": 12, "formula": "3*4", "resolucao": ["3 e 4 opções.", "$3 \\cdot 4 = 12$"], "fonte": "Autoral"}
Q2 = {"id": "F2-01", "fase": 2, "topico": "PERM_REP", "enunciado": "Anagramas de ARARA?",
      "resposta": 10, "formula": "PR(5,3,2)", "resolucao": ["5 letras: A×3, R×2.", "$\\frac{5!}{3!\\,2!} = 10$"],
      "fonte": "Autoral"}


class TestGerarMarkdown(unittest.TestCase):
    def test_agrupa_por_fase_em_ordem(self):
        md = gerar_markdown([Q2, Q1])
        self.assertLess(md.index("## Fase 1"), md.index("### F1-01"))
        self.assertLess(md.index("### F1-01"), md.index("## Fase 2"))
        self.assertLess(md.index("## Fase 2"), md.index("### F2-01"))

    def test_inclui_enunciado_resolucao_numerada_resposta_e_topico(self):
        md = gerar_markdown([Q2])
        self.assertIn("Anagramas de ARARA?", md)
        self.assertIn("1. 5 letras: A×3, R×2.", md)
        self.assertIn("2. $\\frac{5!}{3!\\,2!} = 10$", md)
        self.assertIn("**Resposta:** 10", md)
        self.assertIn("Permutação com repetição", md)


class TestMain(unittest.TestCase):
    def test_nao_gera_documento_se_o_banco_tem_erros(self):
        with tempfile.TemporaryDirectory() as pasta:
            entrada = Path(pasta) / "q.json"
            saida = Path(pasta) / "saida.md"
            entrada.write_text(json.dumps([dict(Q1, formula="3*5")]), encoding="utf-8")
            self.assertEqual(main([str(entrada), str(saida)]), 1)
            self.assertFalse(saida.exists())


if __name__ == "__main__":
    unittest.main()
