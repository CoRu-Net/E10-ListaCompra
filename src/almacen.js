/**
 * Guardar y cargar la lista en el navegador.
 *
 * Usa la clave `lista-compra` del almacenamiento (por defecto, `localStorage`) con el JSON
 * `{ version: 1, articulos: [...] }`. Las fechas se guardan como texto ISO y se convierten
 * de nuevo en `Date` al cargar.
 *
 * @module almacen
 */

/** @import { Articulo } from './lista.js' */

export const CLAVE = 'lista-compra';
export const VERSION = 1;

/**
 * Carga la lista guardada.
 * @param {Storage} [almacen=globalThis.localStorage]
 * @returns {Articulo[]} La lista, o `[]` si no hay nada, el JSON está roto o es de otra versión.
 *   Los artículos con datos incorrectos se descartan.
 */
export function cargar(almacen = globalThis.localStorage) {
  try {
    const texto = almacen.getItem(CLAVE);
    if (!texto) return [];
    const dato = JSON.parse(texto);
    if (dato?.version !== VERSION || !Array.isArray(dato.articulos)) return [];
    return dato.articulos
      .filter(
        (a) =>
          a &&
          (typeof a.id === 'string' || typeof a.id === 'number') &&
          typeof a.nombre === 'string' &&
          a.nombre.trim() &&
          Number.isInteger(a.cantidad) &&
          a.cantidad >= 1 &&
          a.cantidad <= 99 &&
          typeof a.comprado === 'boolean' &&
          typeof a.creado === 'string' &&
          !Number.isNaN(new Date(a.creado).getTime()),
      )
      .map((a) => ({ ...a, creado: new Date(a.creado) }));
  } catch {
    return [];
  }
}

/**
 * Guarda la lista.
 * @param {Articulo[]} articulos
 * @param {Storage} [almacen=globalThis.localStorage]
 * @returns {boolean} `false` si no se ha podido guardar.
 */
export function guardar(articulos, almacen = globalThis.localStorage) {
  try {
    almacen.setItem(CLAVE, JSON.stringify({ version: VERSION, articulos }));
    return true;
  } catch {
    return false;
  }
}
