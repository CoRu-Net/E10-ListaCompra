// E10 · Lista de la compra: une los módulos y gestiona la página
import { anadir, alternarComprado, quitar, quitarComprados, ordenar, resumen } from './lista.js';
import { cargar, guardar } from './almacen.js';
import { htmlLista, tituloPestana } from './vista.js';
import { enlaceCompartir, leerCompartidos } from './compartir.js';
import { avisar, confirmar } from './dialogos.js';
import { avisarCambio, escucharCambios } from './sincronizar.js';
const lista = document.querySelector('#lista');
const form = document.querySelector('#formulario');
const nombre = document.querySelector('#nombre');
const cantidad = document.querySelector('#cantidad');
let articulos = cargar();
function pintar() {
  const ordenados = ordenar(articulos);
  lista.innerHTML = htmlLista(ordenados);
  document.querySelector('#resumen').textContent = resumen(articulos);
  document.title = tituloPestana(articulos);
}
function actualizar(nueva) {
  articulos = nueva;
  if (!guardar(articulos)) avisar('No se pudo guardar la lista en este navegador.');
  avisarCambio();
  pintar();
}
const compartidos = leerCompartidos(location.search);
if (compartidos.length) {
  try {
    for (const articulo of compartidos)
      articulos = anadir(articulos, articulo.nombre, articulo.cantidad);
    if (!guardar(articulos)) avisar('No se pudo guardar la lista compartida.');
    avisarCambio();
    avisar(`Se añadieron ${compartidos.length} artículo(s) compartidos.`);
  } catch (error) {
    avisar(error.message);
  }
  const url = new URL(location.href);
  url.searchParams.delete('compartir');
  history.replaceState({}, '', url);
}
pintar();
form.addEventListener('submit', (evento) => {
  evento.preventDefault();
  try {
    actualizar(anadir(articulos, nombre.value, Number(cantidad.value)));
    nombre.value = '';
    cantidad.value = '1';
  } catch (error) {
    avisar(error.message);
  }
});
lista.addEventListener('click', (evento) => {
  const id = evento.target.closest('li')?.dataset.id;
  if (!id) return;
  const articulo = articulos.find((elemento) => String(elemento.id) === id);
  if (evento.target.matches('.marcar') && articulo) {
    actualizar(alternarComprado(articulos, articulo.id));
  } else if (evento.target.matches('.quitar') && articulo) {
    confirmar(`¿Quitar «${articulo.nombre}»?`, (si) => {
      if (si) actualizar(quitar(articulos, articulo.id));
    });
  }
});
document.querySelector('#vaciar-comprados').addEventListener('click', () => {
  const total = articulos.filter((a) => a.comprado).length;
  if (!total) return avisar('No hay artículos comprados.');
  confirmar(`¿Quitar los ${total} artículos comprados?`, (si) => {
    if (si) actualizar(quitarComprados(articulos));
  });
});
document.querySelector('#compartir').addEventListener('click', async () => {
  const enlace = enlaceCompartir(location.href.split('?')[0], articulos);
  if ('clipboard' in navigator && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(enlace);
      avisar('Enlace copiado.');
    } catch {
      avisar(enlace, 10000);
    }
  } else avisar(enlace, 10000);
});
escucharCambios(() => {
  articulos = cargar();
  pintar();
});
const consultaTema = matchMedia('(prefers-color-scheme: dark)');
function aplicarTema(oscuro) {
  document.documentElement.dataset.tema = oscuro ? 'oscuro' : 'claro';
  document.querySelector('#cambiar-tema').textContent = oscuro ? '☀️ Claro' : '🌙 Oscuro';
}
aplicarTema(consultaTema.matches);
document.querySelector('#cambiar-tema').addEventListener('click', () => {
  aplicarTema(document.documentElement.dataset.tema !== 'oscuro');
});
setInterval(pintar, 60_000);
