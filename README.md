# Lista de la compra

## Cómo ejecutarlo

Abre esta carpeta en VS Code, reabre su Dev Container y visita `http://localhost:3410`. Ejecuta `npm test`, `npm run lint` y `npm run format:check` en el contenedor. No hay `npm start`: el Dev Container sirve la página.

## Módulos

| Módulo | Responsabilidad | ¿Usa el navegador? |
|---|---|---|
| `lista.js` | Operaciones inmutables, ordenación y resumen | No |
| `almacen.js` | Cargar/guardar lista y fechas | Sí, Storage inyectable |
| `vista.js` | Escape HTML, plantilla, tiempo relativo y título | No |
| `compartir.js` | Codificar/leer lista de URL | API URL nativa |
| `dialogos.js` | Confirmación y zona de avisos | Sí, DOM |
| `sincronizar.js` | Notificar cambios a otras pestañas | Sí, BroadcastChannel o storage |
| `main.js` | Integración DOM, eventos, tema y URL | Sí |

Las reglas de negocio y formato se mantienen puras para ser predecibles y probarse en Node; acceso a DOM, almacenamiento y pestañas queda en módulos adaptadores.

## Objetos predefinidos

`Intl.Collator` ordena/fusiona nombres ignorando acentos y mayúsculas; `Intl.PluralRules` pluraliza el resumen; `Intl.RelativeTimeFormat` da antigüedad; `Date` gestiona marcas de tiempo; `JSON` serializa. `URL`/`URLSearchParams` crean enlaces. `document`, `location`, `history`, `navigator.clipboard`, `matchMedia`, `BroadcastChannel` y evento `storage` conectan la página al navegador.

## Qué se guarda y dónde

`localStorage`, clave `lista-compra`, guarda JSON `{ version: 1, articulos }`; fechas se serializan como ISO y se reconstruyen como `Date`. Un JSON roto, versión distinta o artículo inválido se ignora (se carga una lista vacía o los registros válidos). Si falla escritura, se avisa sin romper la interfaz.

## Varias pestañas

Se envía `{tipo: 'cambio'}` por `BroadcastChannel('lista-compra')`; cuando no existe, se utiliza el evento `storage` sobre la clave de la lista. No se verificó manualmente el intercambio en dos pestañas; queda como comprobación del navegador.

## Seguridad

Los nombres y valores se escapan con `escaparHTML` antes de construir la plantilla; diálogos y avisos usan `textContent`. Se valida el contenido persistido antes de renderizar. No se interpola texto de usuario sin escapar en el HTML.

## Pruebas

`npm test`: 4 ficheros, 15 tests pasados.

Se añadieron suites por módulo puro: lista inmutable, nombres con tildes/capitalización, cantidades y plurales; almacenamiento con fechas y datos dañados; escape, tiempo y título; enlace compartido de ida/vuelta. `AlmacenFalso` evita tocar el almacenamiento real; `vi.useFakeTimers()` fija fechas y `vi.fn()` verifica una escritura fallida. Los tests se ejecutaron con las dependencias instaladas localmente sin generar lockfile.

## Depuración

No se inspeccionó DevTools aquí. Para comprobar: crea elementos, revisa `Application → Local Storage → lista-compra`, confirma el JSON/versionado y fechas. Edita a JSON roto o versión distinta y recarga: la aplicación debe continuar con lista vacía. Para probar sincronización abre dos pestañas del mismo origen.

## Herramientas

`npm run lint` y `npm run format:check` finalizaron sin errores. Las pruebas automáticas no sustituyen la comprobación manual de sincronización y persistencia en varias pestañas.

## Integración continua (opcional)

No implementada. No se creó workflow, no se tomaron capturas y no se publicó en GitHub.
