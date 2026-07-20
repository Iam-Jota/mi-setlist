# Mi Setlist — Historias de Usuario (2 Sprints, 1 sesión c/u)

> Desarrollador único. Cada sprint agrupa funcionalidades que se pueden completar y probar en una sola sesión de trabajo.

---

## SPRINT 1 — Buscar, crear y poblar playlists

### HU-1: Buscar canciones en el catálogo
**Como** usuario de la app,
**quiero** buscar canciones por artista o título,
**para** encontrar música real que pueda agregar a mis playlists.

**Criterios de aceptación:**
- Al escribir un término y confirmar la búsqueda, se muestra una lista de resultados con carátula, nombre de canción, artista y duración.
- Si el término de búsqueda está vacío, no se dispara ninguna búsqueda.
- Cada resultado se muestra como una tarjeta/fila individual, sin datos faltantes o rotos (ej. carátula ausente muestra un placeholder).
- Los resultados se reemplazan completamente en cada nueva búsqueda (no se acumulan con la anterior).

---

### HU-2: Ver el estado de la búsqueda
**Como** usuario de la app,
**quiero** saber si la búsqueda está cargando, falló o no encontró nada,
**para** entender qué está pasando y no pensar que la app está congelada o rota.

**Criterios de aceptación:**
- Mientras la búsqueda está en curso, se muestra un indicador visual de carga.
- Si la API falla o no responde, se muestra un mensaje de error comprensible (no un error técnico crudo).
- Si la búsqueda no arroja resultados, se muestra un mensaje amigable indicando que no se encontró nada.
- El indicador de carga desaparece siempre al finalizar la búsqueda, sea exitosa o no.

---

### HU-3: Crear una playlist con nombre propio
**Como** usuario de la app,
**quiero** crear una playlist y ponerle un nombre,
**para** organizar mi música según mis propios criterios (ej. "Road trip").

**Criterios de aceptación:**
- Existe un formulario o control visible para ingresar el nombre de una nueva playlist.
- Al confirmar con un nombre válido, la nueva playlist aparece inmediatamente en la lista de playlists.
- No se permite crear una playlist con nombre vacío (se informa al usuario de alguna forma visible).
- La playlist recién creada aparece vacía, sin canciones.

---

### HU-4: Agregar canciones a una playlist
**Como** usuario de la app,
**quiero** agregar canciones desde los resultados de búsqueda a una playlist existente,
**para** ir armando mi lista de música.

**Criterios de aceptación:**
- Desde cada resultado de búsqueda hay una acción visible para agregarlo a una playlist.
- Si existe más de una playlist, el usuario puede elegir a cuál agregar la canción.
- Al agregar una canción, se refleja de inmediato en el contenido de esa playlist.
- Si se intenta agregar una canción ya existente en la playlist, la app lo comunica en vez de duplicarla silenciosamente.
- Si no existe ninguna playlist creada todavía, se informa al usuario en vez de dejarlo sin opciones.

---

### HU-5: Ver el contenido de una playlist
**Como** usuario de la app,
**quiero** ver el detalle de las canciones dentro de una playlist,
**para** revisar qué contiene y cuándo agregué cada canción.

**Criterios de aceptación:**
- Al abrir/seleccionar una playlist, se listan todas sus canciones con carátula, nombre, artista y duración.
- Cada canción muestra la fecha en la que fue agregada a la playlist.
- Si la playlist no tiene canciones, se muestra un estado vacío amigable (no una lista en blanco sin contexto).
- La información mostrada corresponde exactamente a la playlist seleccionada (no mezcla datos de otra).

---

## SPRINT 2 — Gestión, cálculos y persistencia

### HU-6: Quitar canciones y eliminar playlists con confirmación
**Como** usuario de la app,
**quiero** quitar una canción de una playlist o eliminar una playlist completa, con una confirmación previa,
**para** evitar borrar algo por error.

**Criterios de aceptación:**
- Al intentar quitar una canción o eliminar una playlist, aparece un modal propio de confirmación (no el `confirm()` nativo del navegador).
- Si el usuario cancela en el modal, no se elimina nada y la app permanece igual que antes.
- Si el usuario confirma, la canción o playlist desaparece de la vista inmediatamente.
- Eliminar una playlist quita también todas sus canciones asociadas de la vista.

---

### HU-7: Ver duración total de la playlist
**Como** usuario de la app,
**quiero** ver la duración total de una playlist en un formato legible,
**para** saber cuánto dura mi música en conjunto (ej. "1 h 23 min").

**Criterios de aceptación:**
- En la vista de la playlist se muestra la suma total de duración de todas sus canciones.
- El formato mostrado es legible para humanos (ej. "1 h 23 min", no segundos o milisegundos crudos).
- Si la playlist está vacía, la duración total se muestra como "0 min" (o equivalente), sin errores visuales.
- La duración total se actualiza automáticamente al agregar o quitar canciones.

---

### HU-8: Ver estadísticas de la playlist
**Como** usuario de la app,
**quiero** ver estadísticas de mi playlist (cantidad de canciones, género más frecuente, artista más repetido),
**para** entender mejor el perfil de mi música.

**Criterios de aceptación:**
- Se muestra la cantidad total de canciones en la playlist.
- Se muestra el género musical más frecuente entre las canciones de la playlist.
- Se muestra el artista que más se repite en la playlist.
- Si hay empate entre dos o más géneros/artistas, se muestra alguno de forma consistente (sin romper la vista).
- Si la playlist está vacía, las estadísticas se muestran de forma amigable (ej. "Sin datos aún"), no en blanco o con errores.

---

### HU-9: Ordenar canciones de una playlist
**Como** usuario de la app,
**quiero** ordenar las canciones de una playlist por fecha (recientes/antiguas) o alfabéticamente,
**para** encontrar canciones más fácilmente según cómo prefiera verlas.

**Criterios de aceptación:**
- Existe un control visible para elegir el criterio de orden (recientes, antiguas, alfabético).
- Al cambiar el criterio, el orden de las canciones en pantalla se actualiza de inmediato.
- El orden alfabético agrupa correctamente considerando mayúsculas/minúsculas y tildes de forma consistente.
- El criterio de orden aplicado se mantiene visible/activo mientras el usuario no lo cambie.

---

### HU-10: Persistir y restaurar datos, con recuperación ante corrupción
**Como** usuario de la app,
**quiero** que mis playlists se guarden automáticamente y se restauren al recargar la página, incluso si algo sale mal con los datos guardados,
**para** no perder mi trabajo y no quedarme con una app rota.

**Criterios de aceptación:**
- Al recargar la página, todas las playlists y sus canciones aparecen tal como estaban antes (incluyendo fechas de agregado).
- Si los datos guardados están corruptos o ilegibles, la app no se rompe (no queda en pantalla blanca ni con errores visibles).
- Ante datos corruptos, se ofrece al usuario una opción visible de "Empezar de cero".
- Al elegir "Empezar de cero", la app queda en un estado limpio y utilizable, sin playlists previas.

---

## Resumen de cobertura

| Sprint | Historias | Funcionalidades del MVP cubiertas |
|--------|-----------|-------------------------------------|
| Sprint 1 | HU-1 a HU-5 | Búsqueda, estado de búsqueda, crear playlist, agregar canciones, ver contenido de playlist |
| Sprint 2 | HU-6 a HU-10 | Quitar/eliminar con confirmación, duración total, estadísticas, ordenar, persistencia y recuperación |
