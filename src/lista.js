/**
 * Operaciones sobre la lista de la compra. Funciones puras: reciben la lista y devuelven una nueva,
 * sin modificar la recibida.
 * @module lista
 */

/**
 * Artículo de la lista.
 * @typedef {object} Articulo
 * @property {string} id
 * @property {string} nombre
 * @property {number} cantidad Entero mayor que 0.
 * @property {boolean} comprado
 * @property {Date} creado
 */

/**
 * Añade un artículo. Si ya hay uno con el mismo nombre (sin distinguir mayúsculas ni tildes),
 * suma la cantidad y lo marca como pendiente.
 *
 * @param {Articulo[]} articulos
 * @param {string} nombre
 * @param {number} [cantidad=1]
 * @param {Date} [ahora=new Date()]
 * @returns {Articulo[]}
 * @throws {Error} Si el nombre está vacío.
 * @throws {RangeError} Si la cantidad no es un entero entre 1 y 99.
 */
export function anadir(articulos, nombre, cantidad = 1, ahora = new Date()) {
  const limpio = String(nombre).trim();
  if (!limpio) throw new Error('El nombre no puede estar vacío');
  if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 99) {
    throw new RangeError(`Cantidad no válida: ${cantidad}`);
  }
  const comparar = new Intl.Collator('es', { sensitivity: 'base' }).compare;
  const indice = articulos.findIndex((articulo) => comparar(articulo.nombre, limpio) === 0);
  if (indice >= 0) {
    return articulos.map((articulo, i) =>
      i === indice
        ? { ...articulo, cantidad: Math.min(99, articulo.cantidad + cantidad), comprado: false }
        : articulo,
    );
  }
  const id =
    globalThis.crypto?.randomUUID?.() ??
    `${ahora.getTime()}-${Math.random().toString(36).slice(2)}`;
  return [...articulos, { id, nombre: limpio, cantidad, comprado: false, creado: new Date(ahora) }];
}

/**
 * Marca o desmarca un artículo como comprado.
 * @param {Articulo[]} articulos
 * @param {string} id
 * @returns {Articulo[]}
 */
export function alternarComprado(articulos, id) {
  return articulos.map((articulo) =>
    articulo.id === id ? { ...articulo, comprado: !articulo.comprado } : articulo,
  );
}

/**
 * Quita un artículo.
 * @param {Articulo[]} articulos
 * @param {string} id
 * @returns {Articulo[]}
 */
export function quitar(articulos, id) {
  return articulos.filter((articulo) => articulo.id !== id);
}

/**
 * Quita todos los artículos comprados.
 * @param {Articulo[]} articulos
 * @returns {Articulo[]}
 */
export function quitarComprados(articulos) {
  return articulos.filter((articulo) => !articulo.comprado);
}

/**
 * Ordena: primero los pendientes y, dentro de cada grupo, por nombre según las reglas del español.
 * @param {Articulo[]} articulos
 * @returns {Articulo[]}
 */
export function ordenar(articulos) {
  const comparar = new Intl.Collator('es', { sensitivity: 'base' }).compare;
  return [...articulos].sort(
    (a, b) => Number(a.comprado) - Number(b.comprado) || comparar(a.nombre, b.nombre),
  );
}

/**
 * Resumen de la lista: «3 artículos · 1 comprado», «1 artículo · 0 comprados» o «La lista está vacía».
 * @param {Articulo[]} articulos
 * @returns {string}
 */
export function resumen(articulos) {
  if (!articulos.length) return 'La lista está vacía';
  const comprados = articulos.filter((articulo) => articulo.comprado).length;
  const plural = new Intl.PluralRules('es');
  const nombre = plural.select(articulos.length) === 'one' ? 'artículo' : 'artículos';
  const participio = plural.select(comprados) === 'one' ? 'comprado' : 'comprados';
  return `${articulos.length} ${nombre} · ${comprados} ${participio}`;
}
