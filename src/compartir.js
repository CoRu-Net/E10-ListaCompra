/**
 * Compartir la lista por URL: `?compartir=leche*2,pan`.
 * @module compartir
 */

/** @import { Articulo } from './lista.js' */

/**
 * Enlace con los artículos pendientes en el parámetro `compartir`.
 * @param {string} base URL de la página, sin parámetros.
 * @param {Articulo[]} articulos
 * @returns {string}
 */
export function enlaceCompartir(base, articulos) {
  const url = new URL(base);
  const valor = articulos
    .filter((a) => !a.comprado)
    .map((a) => `${a.nombre}*${a.cantidad}`)
    .join(',');
  if (valor) url.searchParams.set('compartir', valor);
  else url.searchParams.delete('compartir');
  return url.href;
}

/**
 * Lee los artículos de un enlace compartido.
 * @param {string} busqueda Parte `search` de la URL.
 * @returns {Array<{ nombre: string, cantidad: number }>} Vacío si no hay parámetro.
 */
export function leerCompartidos(busqueda) {
  const contenido = new URLSearchParams(busqueda).get('compartir');
  if (!contenido) return [];
  return contenido
    .split(',')
    .map((pieza) => {
      const separador = pieza.lastIndexOf('*');
      const nombre = (separador < 0 ? pieza : pieza.slice(0, separador)).trim();
      const cantidad = separador < 0 ? 1 : Number(pieza.slice(separador + 1));
      return nombre && Number.isInteger(cantidad) && cantidad >= 1 && cantidad <= 99
        ? { nombre, cantidad }
        : null;
    })
    .filter(Boolean);
}
