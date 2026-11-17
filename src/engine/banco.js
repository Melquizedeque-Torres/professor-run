// Separa a lista plana do JSON em um banco por fase: índice 0 = fase 1.
export function agruparPorFase(questoes, totalFases) {
  const grupos = Array.from({ length: totalFases }, () => []);
  for (const q of questoes) {
    if (!Number.isInteger(q.fase) || q.fase < 1 || q.fase > totalFases) {
      throw new Error(`Questão ${q.id} com fase inválida: ${q.fase}`);
    }
    grupos[q.fase - 1].push(q);
  }
  grupos.forEach((grupo, i) => {
    if (grupo.length === 0) throw new Error(`Fase ${i + 1} sem questões`);
  });
  return grupos;
}
