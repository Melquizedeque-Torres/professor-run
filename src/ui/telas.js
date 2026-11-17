export function mostrarTela(id) {
  document.querySelectorAll('.tela').forEach((t) => t.classList.toggle('ativa', t.id === id));
  document.querySelector(`#${id} .btn-primario`)?.focus(); // o teclado continua de onde o jogador está
}

const GUARDA_MS = 250;

// Resolve no próximo clique "de verdade": ignora tecla mantida (repeat) e cliques logo após a tela surgir.
export function aguardarClique(btn) {
  const aparecidoEm = performance.now();
  // Enter mantido dispararia um clique a cada repetição
  const aoTeclar = (ev) => { if (ev.repeat) ev.preventDefault(); };
  return new Promise((resolve) => {
    const aoClicar = () => {
      if (performance.now() - aparecidoEm < GUARDA_MS) return;
      btn.removeEventListener('click', aoClicar);
      btn.removeEventListener('keydown', aoTeclar);
      resolve();
    };
    btn.addEventListener('click', aoClicar);
    btn.addEventListener('keydown', aoTeclar);
  });
}

export function mostrarHistoria({ titulo, texto, botao = 'Continuar' }) {
  document.getElementById('historia-titulo').textContent = titulo;
  document.getElementById('historia-texto').textContent = texto;
  const btn = document.getElementById('btn-historia');
  btn.textContent = botao;
  mostrarTela('tela-historia');
  return aguardarClique(btn);
}
