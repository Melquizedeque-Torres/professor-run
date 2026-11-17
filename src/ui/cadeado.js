// Estado do teclado numérico do cadeado (sem DOM).
export function criarCadeado(maxDigitos = 10) {
  let digitos = '';
  return {
    digitar(d) {
      if (!/^[0-9]$/.test(d) || digitos.length >= maxDigitos) return;
      digitos = digitos === '0' ? d : digitos + d;
    },
    apagar() {
      digitos = digitos.slice(0, -1);
    },
    limpar() {
      digitos = '';
    },
    texto() {
      return digitos;
    },
    valor() {
      return digitos === '' ? null : Number(digitos);
    },
  };
}
