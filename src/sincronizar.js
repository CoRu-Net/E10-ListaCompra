/** Cross-tab notifications using BroadcastChannel, with storage-event fallback. @module sincronizar */
const CANAL = 'lista-compra';
const CLAVE = 'lista-compra-cambio';
let canal;
let secuencia = 0;
/** Notifica a las demás pestañas que cambió la lista. */
export function avisarCambio() {
  if ('BroadcastChannel' in globalThis) {
    canal ??= new BroadcastChannel(CANAL);
    canal.postMessage({ tipo: 'cambio' });
  } else {
    try {
      localStorage.setItem(CLAVE, `${Date.now()}-${++secuencia}`);
    } catch {
      /* el almacenamiento puede estar deshabilitado */
    }
  }
}
/** @param {() => void} alCambiar */
export function escucharCambios(alCambiar) {
  if ('BroadcastChannel' in globalThis) {
    canal ??= new BroadcastChannel(CANAL);
    const recibir = (evento) => {
      if (evento.data?.tipo === 'cambio') alCambiar();
    };
    canal.addEventListener('message', recibir);
    return () => canal.removeEventListener('message', recibir);
  }
  const recibir = (evento) => {
    if (evento.key === CLAVE) alCambiar();
  };
  window.addEventListener('storage', recibir);
  return () => window.removeEventListener('storage', recibir);
}
