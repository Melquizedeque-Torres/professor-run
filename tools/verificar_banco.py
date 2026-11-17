"""Verifica o banco de questões: estrutura, distribuição, fórmula e força bruta.

Uso: python tools/verificar_banco.py [caminho.json]
Sai com código 0 se tudo estiver certo e 1 se houver qualquer problema.
"""
import json
import re
import sys
from pathlib import Path

import combinatoria as cb
from forca_bruta import FORCA_BRUTA

RAIZ = Path(__file__).resolve().parent.parent
CAMINHO_PADRAO = RAIZ / "data" / "questoes.json"

TOPICOS = {"PFC", "PERM", "PERM_REP", "ARRANJO", "COMB", "RESTRICAO", "RECORRENCIA"}
EXIGEM_FORCA_BRUTA = {"RESTRICAO", "RECORRENCIA"}
CAMPOS = ("id", "fase", "topico", "enunciado", "resposta", "formula", "resolucao", "fonte")
MAX_RESPOSTA = 9_999_999_999  # cabe no cadeado de 10 dígitos

DISTRIBUICAO = {
    1: {"PFC": 7, "PERM": 4, "ARRANJO": 2, "COMB": 2},
    2: {"PFC": 2, "PERM": 2, "PERM_REP": 4, "ARRANJO": 3, "COMB": 3, "RECORRENCIA": 1},
    3: {"PERM_REP": 2, "ARRANJO": 3, "COMB": 3, "RESTRICAO": 5, "RECORRENCIA": 2},
    4: {"COMB": 2, "RESTRICAO": 10, "RECORRENCIA": 3},
    5: {"RESTRICAO": 12, "RECORRENCIA": 3},
}

NOMES_FORMULA = {
    "fat": cb.fat, "A": cb.A, "C": cb.C, "PR": cb.PR,
    "subconjuntos": cb.subconjuntos, "apertos": cb.apertos, "escada": cb.escada,
    "desarranjo": cb.desarranjo, "catalan": cb.catalan,
}


def avaliar_formula(formula: str) -> int:
    # O banco é nosso e versionado; eval sem builtins basta para as fórmulas.
    return eval(formula, {"__builtins__": {}}, dict(NOMES_FORMULA))


def _formatos(n: int) -> set[str]:
    return {str(n), f"{n:,}".replace(",", ".")}


def _resposta_valida(r) -> bool:
    return isinstance(r, int) and not isinstance(r, bool) and 0 < r <= MAX_RESPOSTA


def verificar(questoes, forca_bruta=FORCA_BRUTA, distribuicao=DISTRIBUICAO) -> list[str]:
    erros: list[str] = []
    ids = [q.get("id") for q in questoes]
    for duplicado in sorted({i for i in ids if ids.count(i) > 1}):
        erros.append(f"id duplicado: {duplicado}")

    contagem: dict[int, dict[str, int]] = {}
    for q in questoes:
        qid = q.get("id", "<sem id>")
        faltando = [c for c in CAMPOS if c not in q]
        if faltando:
            erros.append(f"{qid}: campos ausentes {faltando}")
            continue

        if not re.fullmatch(r"F[1-9]-\d{2}", qid) or int(qid[1]) != q["fase"]:
            erros.append(f"{qid}: id não corresponde à fase {q['fase']}")
        if q["topico"] not in TOPICOS:
            erros.append(f"{qid}: tópico desconhecido {q['topico']}")
        if not str(q["enunciado"]).strip():
            erros.append(f"{qid}: enunciado vazio")

        r = q["resposta"]
        if not _resposta_valida(r):
            erros.append(f"{qid}: resposta deve ser inteiro entre 1 e {MAX_RESPOSTA}")

        passos = q["resolucao"]
        if not isinstance(passos, list) or len(passos) < 2:
            erros.append(f"{qid}: resolução precisa de ao menos 2 passos")
        elif _resposta_valida(r) and not any(f in passos[-1] for f in _formatos(r)):
            erros.append(f"{qid}: último passo da resolução não mostra a resposta {r}")

        try:
            valor = avaliar_formula(q["formula"])
            if valor != r:
                erros.append(f"{qid}: fórmula {q['formula']} = {valor}, mas resposta = {r}")
        except Exception as exc:  # noqa: BLE001 - qualquer falha de fórmula vira erro reportado
            erros.append(f"{qid}: fórmula inválida ({exc})")

        if q["topico"] in EXIGEM_FORCA_BRUTA:
            if qid not in forca_bruta:
                erros.append(f"{qid}: tópico {q['topico']} exige verificação por força bruta")
            else:
                bruto = forca_bruta[qid]()
                if bruto != r:
                    erros.append(f"{qid}: força bruta = {bruto}, mas resposta = {r}")

        por_fase = contagem.setdefault(q["fase"], {})
        por_fase[q["topico"]] = por_fase.get(q["topico"], 0) + 1

    for orfa in sorted(set(forca_bruta) - set(ids)):
        erros.append(f"força bruta sem questão: {orfa}")
    if contagem != distribuicao:
        erros.append(f"distribuição incorreta: esperado {distribuicao}, obtido {contagem}")
    return erros


def carregar(caminho) -> list[dict]:
    return json.loads(Path(caminho).read_text(encoding="utf-8"))


def main(argv=None) -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    argv = sys.argv[1:] if argv is None else argv
    caminho = Path(argv[0]) if argv else CAMINHO_PADRAO
    questoes = carregar(caminho)
    erros = verificar(questoes)
    for erro in erros:
        print(f"ERRO  {erro}")
    if erros:
        print(f"\n{len(erros)} problema(s) em {caminho}")
        return 1
    print(f"OK  {len(questoes)} questões verificadas (fórmula + força bruta onde exigido).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
