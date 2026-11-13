/**
 * Generación del HTML y los textos de la página. Funciones puras: reciben los datos (y la fecha
 * actual) y devuelven textos.
 * @module vista
 */

/** @import { Articulo } from './lista.js' */

/**
 * Escapa los caracteres especiales del HTML.
 * @param {string} texto
 * @returns {string}
 */
export function escaparHTML(texto) {
  return String(texto).replace(
    /[&<>"']/g,
    (caracter) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[caracter],
  );
}

/**
 * Cuánto hace de una fecha: «hace 5 minutos», «ayer», «ahora».
 * @param {Date} fecha
 * @param {Date} [ahora=new Date()]
 * @returns {string}
 */
export function haceCuanto(fecha, ahora = new Date()) {
  const ms = new Date(fecha) - ahora;
  const minutos = Math.round(ms / 60000);
  if (Math.abs(ms) < 60000) return 'ahora';
  const unidad = Math.abs(ms) >= 86400000 ? 'day' : Math.abs(minutos) >= 60 ? 'hour' : 'minute';
  const valor =
    unidad === 'day'
      ? Math.round(ms / 86400000)
      : unidad === 'hour'
        ? Math.round(ms / 3600000)
        : minutos;
  return new Intl.RelativeTimeFormat('es', { numeric: 'auto' }).format(valor, unidad);
}

/**
 * HTML de la lista: un `<li>` por artículo con su casilla, su nombre escapado, la cantidad,
 * cuándo se añadió y un botón para quitarlo.
 *
 * @param {Articulo[]} articulos Ya ordenados.
 * @param {Date} [ahora=new Date()]
 * @returns {string}
 */
export function htmlLista(articulos, ahora = new Date()) {
  return articulos
    .map((a) => {
      const creado = new Date(a.creado);
      const id = escaparHTML(a.id);
      const fecha = escaparHTML(creado.toISOString());
      return `<li data-id="${id}" class="${a.comprado ? 'comprado' : ''}"><input class="marcar" type="checkbox" aria-label="Marcar ${escaparHTML(a.nombre)}" ${a.comprado ? 'checked' : ''}><span class="nombre">${escaparHTML(a.nombre)}</span><span>× ${a.cantidad}</span><time class="cuando" datetime="${fecha}">${escaparHTML(haceCuanto(creado, ahora))}</time><button type="button" class="quitar" aria-label="Quitar ${escaparHTML(a.nombre)}">🗑️</button></li>`;
    })
    .join('');
}

/**
 * Título de la pestaña con el número de artículos pendientes.
 * @param {Articulo[]} articulos
 * @returns {string} Por ejemplo, «(2) Lista de la compra», o «✅ Lista de la compra» si no queda nada.
 */
export function tituloPestana(articulos) {
  const pendientes = articulos.filter((a) => !a.comprado).length;
  return pendientes ? `(${pendientes}) Lista de la compra` : '✅ Lista de la compra';
}
