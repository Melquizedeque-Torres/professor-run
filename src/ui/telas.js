export function mostrarTela(id) {
  document.querySelectorAll('.tela').forEach((t) => t.classList.toggle('ativa', t.id === id));
}

export function mostrarHistoria({ titulo, texto, botao = 'Continuar' }) {
  document.getElementById('historia-titulo').textContent = titulo;
  document.getElementById('historia-texto').textContent = texto;
  const btn = document.getElementById('btn-historia');
  btn.textContent = botao;
  mostrarTela('tela-historia');
  return new Promise((resolve) => btn.addEventListener('click', resolve, { once: true }));
}
