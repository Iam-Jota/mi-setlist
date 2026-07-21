# Mi Setlist 🎵

Aplicación web para buscar canciones reales (API de iTunes) y organizarlas en playlists personales que persisten en `localStorage`. Calcula duración total y estadísticas de cada playlist.

## Stack

- HTML5 semántico
- CSS3
- JavaScript vanilla con módulos ESM (`import`/`export`)
- Sin frameworks, sin librerías de estado, sin backend

## Arquitectura

- **Estado central plano** (`js/state.js`) con setters exportados — nada fuera de ese archivo muta el estado directamente.
- **Patrón `cambias el estado → llamas render()`**: cada acción del usuario actualiza el estado y vuelve a pintar la UI afectada.
- **CRUD inmutable**: todas las operaciones sobre arrays usan `.filter`, `.map` y spread (`...`), nunca mutación directa.
- **Delegación de eventos** para listas dinámicas (resultados de búsqueda, playlists, canciones del detalle).
- **IDs** generados con `crypto.randomUUID()`.

## Estructura del proyecto

```
mi-setlist/
├── index.html
├── css/styles.css
├── js/
│   ├── app.js             # Punto de entrada, inicialización
│   ├── models/Cancion.js  # Clase Cancion + helper de duración total
│   ├── state.js           # Estado central (playlists, búsqueda, UI)
│   ├── storage.js         # Persistencia en localStorage (guardar/cargar/limpiar)
│   ├── api.js              # Fetch a la iTunes Search API
│   └── ui.js               # Render + eventos del DOM
├── PROMPTS.md              # Registro de trabajo con la IA
└── README.md
```

## Funcionalidades

1. Buscar canciones por artista o título (carátula, nombre, artista, duración).
2. Estados de búsqueda: carga, error de red, sin resultados.
3. Crear playlists con nombre propio (sin vacíos ni duplicados).
4. Agregar canciones desde los resultados a una playlist elegida.
5. Ver el detalle de una playlist: canciones, fecha de agregado.
6. Quitar canciones y eliminar playlists, con modal de confirmación propio.
7. Duración total de la playlist en formato legible (`H h M min`).
8. Estadísticas: cantidad de canciones, género más frecuente, artista más repetido.
9. Ordenar canciones: recientes, antiguas o alfabético.
10. Persistencia automática en `localStorage`, con detección de datos corruptos y opción de "Empezar de cero".

## Cómo ejecutar

Este proyecto usa módulos ESM, que **no funcionan abriendo `index.html` directamente** (`file://`). Es necesario un servidor local:

1. Abre la carpeta en VS Code.
2. Instala la extensión **Live Server**.
3. Clic derecho en `index.html` → **Open with Live Server**.

## Registro de prompts

Todo prompt usado para generar código con IA está documentado en [`PROMPTS.md`](./PROMPTS.md), junto con el objetivo de cada uno y el resultado obtenido.