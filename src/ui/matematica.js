const DELIMITADORES = [
  { left: '$$', right: '$$', display: true },
  { left: '$', right: '$', display: false },
];

// Se o KaTeX (CDN) não carregar, o texto continua legível com $...$.
export function renderizarMatematica(elemento) {
  if (typeof window.renderMathInElement === 'function') {
    window.renderMathInElement(elemento, { delimiters: DELIMITADORES, throwOnError: false });
  }
}

// Escreve o texto no elemento, convertendo **negrito** em <strong> sem usar innerHTML.
export function escreverTexto(elemento, texto) {
  elemento.replaceChildren();
  texto.split(/(\*\*[^*]+\*\*)/g).forEach((parte) => {
    if (parte.startsWith('**') && parte.endsWith('**') && parte.length > 4) {
      const forte = document.createElement('strong');
      forte.textContent = parte.slice(2, -2);
      elemento.appendChild(forte);
    } else if (parte) {
      elemento.appendChild(document.createTextNode(parte));
    }
  });
}
