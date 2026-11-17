import { criarSorteio } from './sorteio.js';

// Máquina de estados de uma partida. Lógica pura: sem DOM e sem relógio real.
export function criarJogo({ fases, bancoPorFase, tempoLimiteS, maxErros, rng }) {
  if (bancoPorFase.length !== fases.length) {
    throw new Error('É preciso um banco de questões para cada fase');
  }
  const sorteios = bancoPorFase.map((banco) => criarSorteio(banco, rng));
  const totalNecessario = fases.reduce((soma, f) => soma + f.acertosNecessarios, 0);
  const s = {
    status: 'jogando',
    motivoDerrota: null,
    faseIndex: 0,
    acertosFase: 0,
    acertosTotal: 0,
    erros: 0,
    tempoRestanteS: tempoLimiteS,
    questaoAtual: sorteios[0].proxima(),
  };

  function encerrar(status, motivo = null) {
    s.status = status;
    s.motivoDerrota = motivo;
    s.questaoAtual = null;
  }

  return {
    estado() {
      const fase = fases[s.faseIndex] ?? null;
      return {
        ...s,
        fase,
        totalFases: fases.length,
        acertosNecessarios: fase ? fase.acertosNecessarios : 0,
        totalNecessario,
        maxErros,
      };
    },

    responder(valor) {
      if (s.status !== 'jogando') throw new Error('A partida já terminou');
      const questao = s.questaoAtual;
      const correta = valor === questao.resposta;
      let avancouFase = false;
      if (correta) {
        s.acertosFase += 1;
        s.acertosTotal += 1;
        if (s.acertosFase >= fases[s.faseIndex].acertosNecessarios) {
          s.faseIndex += 1;
          s.acertosFase = 0;
          avancouFase = true;
          if (s.faseIndex === fases.length) encerrar('vitoria');
        }
      } else {
        s.erros += 1; // erro não apaga acertos (regra 3 do PDF)
        if (s.erros >= maxErros) encerrar('derrota', 'erros');
      }
      if (s.status === 'jogando') s.questaoAtual = sorteios[s.faseIndex].proxima();
      return { correta, questao, avancouFase, status: s.status };
    },

    tick(segundos) {
      if (s.status !== 'jogando') return;
      s.tempoRestanteS = Math.max(0, s.tempoRestanteS - segundos);
      if (s.tempoRestanteS === 0) encerrar('derrota', 'tempo');
    },
  };
}
