import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from verificar_banco import verificar


def questao(**alteracoes):
    base = {
        "id": "F1-01", "fase": 1, "topico": "PFC",
        "enunciado": "3 camisetas e 4 calças: quantos conjuntos?",
        "resposta": 12, "formula": "3*4",
        "resolucao": ["3 opções de camiseta e 4 de calça.", "$3 \\cdot 4 = 12$"],
        "fonte": "Autoral",
    }
    base.update(alteracoes)
    return base


DIST_UM = {1: {"PFC": 1}}


class TestVerificar(unittest.TestCase):
    def assertErro(self, erros, *trechos):
        self.assertTrue(any(all(t in e for t in trechos) for e in erros),
                        f"esperava erro contendo {trechos}; obtive {erros}")

    def test_questao_valida_nao_gera_erros(self):
        self.assertEqual(verificar([questao()], forca_bruta={}, distribuicao=DIST_UM), [])

    def test_formula_divergente(self):
        erros = verificar([questao(formula="3*5")], forca_bruta={}, distribuicao=DIST_UM)
        self.assertErro(erros, "F1-01", "fórmula")

    def test_formula_invalida(self):
        erros = verificar([questao(formula="fat(")], forca_bruta={}, distribuicao=DIST_UM)
        self.assertErro(erros, "F1-01", "fórmula inválida")

    def test_restricao_exige_forca_bruta(self):
        erros = verificar([questao(topico="RESTRICAO")], forca_bruta={}, distribuicao={1: {"RESTRICAO": 1}})
        self.assertErro(erros, "F1-01", "força bruta")

    def test_forca_bruta_divergente(self):
        erros = verificar([questao(topico="RESTRICAO")], forca_bruta={"F1-01": lambda: 13},
                          distribuicao={1: {"RESTRICAO": 1}})
        self.assertErro(erros, "F1-01", "força bruta = 13")

    def test_forca_bruta_correta_passa(self):
        erros = verificar([questao(topico="RECORRENCIA")], forca_bruta={"F1-01": lambda: 12},
                          distribuicao={1: {"RECORRENCIA": 1}})
        self.assertEqual(erros, [])

    def test_id_duplicado(self):
        erros = verificar([questao(), questao()], forca_bruta={}, distribuicao={1: {"PFC": 2}})
        self.assertErro(erros, "duplicado", "F1-01")

    def test_id_incoerente_com_fase(self):
        erros = verificar([questao(fase=2)], forca_bruta={}, distribuicao={2: {"PFC": 1}})
        self.assertErro(erros, "F1-01", "fase")

    def test_resposta_nao_inteira(self):
        erros = verificar([questao(resposta=12.5)], forca_bruta={}, distribuicao=DIST_UM)
        self.assertErro(erros, "F1-01", "resposta deve ser inteiro")

    def test_resposta_fora_do_intervalo(self):
        for valor in (0, -5, 10_000_000_000, True):
            with self.subTest(resposta=valor):
                erros = verificar([questao(resposta=valor)], forca_bruta={}, distribuicao=DIST_UM)
                self.assertErro(erros, "F1-01", "resposta deve ser inteiro")

    def test_resolucao_com_um_passo(self):
        erros = verificar([questao(resolucao=["3 · 4 = 12"])], forca_bruta={}, distribuicao=DIST_UM)
        self.assertErro(erros, "F1-01", "resolução")

    def test_ultimo_passo_sem_a_resposta(self):
        erros = verificar([questao(resolucao=["a", "b"])], forca_bruta={}, distribuicao=DIST_UM)
        self.assertErro(erros, "F1-01", "último passo")

    def test_resposta_com_separador_de_milhar_e_aceita(self):
        q = questao(resposta=151200, formula="PR(10,2,3,2)", resolucao=["MATEMATICA", "$= 151.200$"])
        self.assertEqual(verificar([q], forca_bruta={}, distribuicao=DIST_UM), [])

    def test_distribuicao_diferente_da_exigida(self):
        erros = verificar([questao()], forca_bruta={}, distribuicao={1: {"PFC": 2}})
        self.assertErro(erros, "distribuição")

    def test_forca_bruta_sem_questao(self):
        erros = verificar([questao()], forca_bruta={"F9-99": lambda: 1}, distribuicao=DIST_UM)
        self.assertErro(erros, "F9-99")

    def test_campos_ausentes(self):
        q = questao()
        del q["formula"]
        erros = verificar([q], forca_bruta={}, distribuicao=DIST_UM)
        self.assertErro(erros, "F1-01", "campos ausentes")

    def test_topico_desconhecido(self):
        erros = verificar([questao(topico="XYZ")], forca_bruta={}, distribuicao={1: {"XYZ": 1}})
        self.assertErro(erros, "F1-01", "tópico")


class TestLinhaDeComando(unittest.TestCase):
    def test_sai_com_codigo_1_e_lista_o_erro(self):
        with tempfile.TemporaryDirectory() as pasta:
            arquivo = Path(pasta) / "q.json"
            arquivo.write_text(json.dumps([questao(formula="3*5")]), encoding="utf-8")
            script = Path(__file__).with_name("verificar_banco.py")
            r = subprocess.run([sys.executable, str(script), str(arquivo)], capture_output=True,
                               env={**os.environ, "PYTHONIOENCODING": "utf-8"})
            self.assertEqual(r.returncode, 1)
            self.assertIn("F1-01", r.stdout.decode("utf-8"))


if __name__ == "__main__":
    unittest.main()
