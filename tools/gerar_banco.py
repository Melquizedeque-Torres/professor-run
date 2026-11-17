"""Gera docs/BANCO_DE_QUESTOES.md a partir de data/questoes.json (entrega 3).

Uso: python tools/gerar_banco.py [entrada.json] [saida.md]
Recusa-se a gerar o documento se o banco não passar no verificador.
"""
import sys
from pathlib import Path

from verificar_banco import CAMINHO_PADRAO, RAIZ, carregar, verificar

SAIDA_PADRAO = RAIZ / "docs" / "BANCO_DE_QUESTOES.md"

FASES = {
    1: ("Fácil", "Sala de Aula"),
    2: ("Básico", "Biblioteca"),
    3: ("Intermediário", "Laboratório de Informática"),
    4: ("Avançado", "Sala dos Professores"),
    5: ("Difícil", "Cofre da Diretoria"),
}

NOMES_TOPICO = {
    "PFC": "Princípio Fundamental da Contagem",
    "PERM": "Permutação simples",
    "PERM_REP": "Permutação com repetição",
    "ARRANJO": "Arranjo simples",
    "COMB": "Combinação simples",
    "RESTRICAO": "Problemas com restrições e integração de conceitos",
    "RECORRENCIA": "Recorrência aplicada à contagem",
}


def gerar_markdown(questoes) -> str:
    linhas = [
        "# Banco de Questões — Professor Run",
        "",
        "Documento gerado a partir de `data/questoes.json`. Toda resposta foi conferida pela fórmula "
        "e, nos problemas com restrição ou recorrência, também por força bruta "
        "(`python tools/verificar_banco.py`).",
        "",
    ]
    for fase in sorted({q["fase"] for q in questoes}):
        nivel, sala = FASES[fase]
        linhas += [f"## Fase {fase} — {nivel} ({sala})", ""]
        for q in sorted((q for q in questoes if q["fase"] == fase), key=lambda q: q["id"]):
            linhas += [f"### {q['id']} · {NOMES_TOPICO[q['topico']]}", "", q["enunciado"], "", "**Resolução:**", ""]
            linhas += [f"{i}. {passo}" for i, passo in enumerate(q["resolucao"], start=1)]
            linhas += [
                "",
                f"**Resposta:** {q['resposta']}  ",
                f"**Fórmula verificada:** `{q['formula']}`  ",
                f"**Fonte:** {q['fonte']}",
                "",
            ]
    return "\n".join(linhas)


def main(argv=None) -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    argv = sys.argv[1:] if argv is None else argv
    entrada = Path(argv[0]) if len(argv) > 0 else CAMINHO_PADRAO
    saida = Path(argv[1]) if len(argv) > 1 else SAIDA_PADRAO
    questoes = carregar(entrada)
    if verificar(questoes):
        print("Banco com erros: documento NÃO gerado. Rode: python tools/verificar_banco.py")
        return 1
    saida.parent.mkdir(parents=True, exist_ok=True)
    saida.write_text(gerar_markdown(questoes), encoding="utf-8")
    print(f"OK  {saida} gerado com {len(questoes)} questões.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
