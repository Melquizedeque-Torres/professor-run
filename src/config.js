// Estrutura oficial do PDF: 5 fases, 1 + 2 + 2 + 3 + 4 = 12 acertos.
export const FASES = [
  { numero: 1, nivel: 'Fácil', acertosNecessarios: 1, sala: 'Sala de Aula' },
  { numero: 2, nivel: 'Básico', acertosNecessarios: 2, sala: 'Biblioteca' },
  { numero: 3, nivel: 'Intermediário', acertosNecessarios: 2, sala: 'Laboratório de Informática' },
  { numero: 4, nivel: 'Avançado', acertosNecessarios: 3, sala: 'Sala dos Professores' },
  { numero: 5, nivel: 'Difícil', acertosNecessarios: 4, sala: 'Cofre da Diretoria' },
];

export const TEMPO_LIMITE_S = 40 * 60; // o segurança fecha o prédio em 40 minutos
export const MAX_ERROS = 6; // no 6º erro o alarme dispara
