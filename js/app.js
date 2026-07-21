// // js/state.js
// export const mensaje = 'Módulos ESM funcionando ✅';

// // js/app.js
// import { mensaje } from './state.js';
// document.querySelector('#app').textContent = mensaje;
// // Punto de entrada de la app.
import {
  initPersistencia,
  initBusqueda,
  initPlaylists,
  initAgregarCancion,
  initDetallePlaylist,
  initModalConfirmacion,
  initEliminarPlaylist,
  initQuitarCancion,
  initOrdenCanciones,
} from './ui.js';

initPersistencia();
initBusqueda();
initPlaylists();
initAgregarCancion();
initDetallePlaylist();
initModalConfirmacion();
initEliminarPlaylist();
initQuitarCancion();
initOrdenCanciones();