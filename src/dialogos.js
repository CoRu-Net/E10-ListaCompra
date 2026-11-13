/** Confirmations with the page's dialog and non-blocking status messages. @module dialogos */
const dialogo = document.querySelector('#confirmar');
const pregunta = dialogo.querySelector('.pregunta');
const zonaAvisos = document.querySelector('#avisos');
/** @param {string} texto @param {(respuesta: boolean) => void} alResponder */
export function confirmar(texto, alResponder) {
  pregunta.textContent = texto;
  dialogo.returnValue = '';
  dialogo.addEventListener('close', () => alResponder(dialogo.returnValue === 'si'), {
    once: true,
  });
  dialogo.showModal();
}
/** @param {string} texto @param {number} [duracion=3000] */
export function avisar(texto, duracion = 3000) {
  zonaAvisos.textContent = texto;
  clearTimeout(avisar.temporizador);
  avisar.temporizador = setTimeout(() => {
    zonaAvisos.textContent = '';
  }, duracion);
}
