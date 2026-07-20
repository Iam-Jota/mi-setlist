## Sprint 1 (Clase 18) — Meta: tener una app donde puedo buscar canciones reales, crear una playlist y ver las canciones ya agregadas dentro de ella.

- HU-1: Buscar canciones en el catálogo (va primero porque es el punto de entrada de datos; sin resultados de la API no hay nada que agregar a ninguna playlist).
- HU-2: Ver el estado de la búsqueda (va después de HU-1 porque solo tiene sentido mostrar loading/error/vacío una vez que existe una búsqueda real disparándose).
- HU-3: Crear una playlist con nombre propio (es independiente de la búsqueda, pero debe estar lista antes de poder agregarle algo).
- HU-4: Agregar canciones a una playlist (va después porque necesita resultados de HU-1 y una playlist destino de HU-3; es donde convergen ambas ramas).
- HU-5: Ver el contenido de una playlist (cierra el sprint porque depende de que ya haya canciones agregadas en HU-4; completa el circuito buscar → crear → agregar → ver).

## Sprint 2 (Clase 19) — Meta: la playlist ya construida se puede gestionar (borrar con confirmación), se calculan sus números (duración, stats) y sobrevive a un recargo de página aunque los datos se dañen.

- HU-6: Quitar canciones y eliminar playlists con confirmación (va primero porque es CRUD directo sobre el contenido que ya existe desde el sprint 1).
- HU-7: Ver duración total de la playlist (cálculo derivado del arreglo de canciones existente, sin dependencias nuevas).
- HU-8: Ver estadísticas de la playlist (comparte lógica de recorrido/agregación del arreglo con HU-7, por eso va justo después).
- HU-9: Ordenar canciones de una playlist (depende de que las canciones ya tengan fecha de agregado y nombre; es una transformación de vista, no de datos).
- HU-10: Persistir y restaurar datos, con recuperación ante corrupción (va al final porque envuelve todo lo anterior; solo se puede probar de forma realista si ya hay playlists, canciones, duración y stats funcionando).

## Dependencias detectadas
- Para HU-4 necesito antes HU-1 y HU-3 porque necesito resultados de búsqueda reales y al menos una playlist donde agregarlos.
- Para HU-5 necesito antes HU-4 porque no hay contenido que mostrar si todavía no se agregó ninguna canción.
- Para HU-6, HU-7, HU-8 y HU-9 necesito antes HU-5 porque todas operan, calculan u ordenan sobre canciones que ya deben existir visiblemente en una playlist.
- Para HU-10 necesito antes todas las demás (HU-1 a HU-9) porque persiste y rehidrata el estado completo de la app, y solo se puede validar con datos reales generados por esas historias.
- Para HU-2 necesito antes HU-1 porque el estado de búsqueda no existe sin una búsqueda que lo dispare.

## Mi reto técnico principal
La HU que más me intimida es HU-10 (persistencia y recuperación ante corrupción) porque no es un CRUD simple: implica serializar y deserializar con `JSON.stringify`/`parse` manejando errores reales, rehidratar fechas correctamente (un `Date` guardado en localStorage vuelve como string y hay que reconstruirlo), y diseñar un flujo de fallback completo para datos corruptos que no rompa el render y ofrezca "Empezar de cero" de forma funcional.