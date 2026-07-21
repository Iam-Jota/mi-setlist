// Render + eventos del DOM relacionados a la búsqueda.
// Render + eventos del DOM.
import {
  getState,
  setSearchResults,
  setSearchStatus,
  setSearchTerm,
  agregarPlaylist,
  setFormPlaylistError,
  agregarCancionAPlaylist,
  setFeedbackAgregar,
  setPlaylistActiva,
  abrirModalConfirmacion,
  cerrarModalConfirmacion,
  quitarCancionDePlaylist,
  eliminarPlaylist,
  setOrdenActivo,
  setPlaylists,
  setDatosCorruptos,
} from './state.js';
import { buscarCanciones } from './api.js';
import { Cancion, formatearDuracionTotal } from './cancion.js';
import { cargarPlaylists, guardarPlaylists, limpiarPlaylists } from './storage.js'; // NUEVO

export function initBusqueda() {
  const form = document.querySelector('#form-busqueda');
  const input = document.querySelector('#input-busqueda');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const termino = input.value.trim();

    if (!termino) {
      setSearchResults([]);
      setSearchStatus('idle');
      setSearchTerm('');
      renderEstadoBusqueda();
      renderResultados();
      return;
    }

    setSearchTerm(termino);
    setSearchStatus('loading');
    renderEstadoBusqueda();
    renderResultados();

    try {
      const resultadosCrudos = await buscarCanciones(termino);
      const canciones = resultadosCrudos.map(Cancion.fromItunesResult);

      setSearchResults(canciones);
      setSearchStatus(canciones.length ? 'success' : 'empty');
    } catch (error) {
      if (error.name === 'AbortError') {
        return;
      }
      setSearchResults([]);
      setSearchStatus('error');
    }

    renderEstadoBusqueda();
    renderResultados();
  });
}

export function renderEstadoBusqueda() {
  const contenedor = document.querySelector('#estado-busqueda');
  const { searchStatus } = getState();

  const mensajes = {
    idle: 'Busca la canción perfecta según tu estado de ánimo 🎵',
    loading: 'Buscando...',
    error: 'No pudimos conectar con el catálogo. Intenta de nuevo.',
    empty: 'Hay 2 opciones: o escribiste mal, o es una canción que todavía no existe.',
    success: '',
  };

  contenedor.textContent = mensajes[searchStatus] ?? '';
}

export function renderResultados() {
  const contenedor = document.querySelector('#resultados-busqueda');
  const { searchResults, searchStatus, playlists } = getState();

  contenedor.innerHTML = '';

  if (searchStatus !== 'success') return;

  searchResults.forEach((cancion) => {
    const card = document.createElement('article');
    card.className = 'resultado-cancion';
    card.dataset.id = cancion.id;

    const opcionesPlaylist = playlists
      .map((p) => `<option value="${p.id}">${p.nombre}</option>`)
      .join('');

    card.innerHTML = `
      <img src="${cancion.caratula}" alt="Carátula de ${cancion.nombre}" width="60" height="60">
      <div class="resultado-info">
        <p class="resultado-nombre">${cancion.nombre}</p>
        <p class="resultado-artista">${cancion.artista}</p>
        <span class="resultado-duracion">${cancion.duracionFormateada}</span>
      </div>
      <div class="resultado-agregar">
        <select class="select-playlist">
          <option value="" disabled selected>Elegir playlist</option>
          ${opcionesPlaylist}
        </select>
        <button type="button" class="btn-agregar">Agregar</button>
      </div>
    `;

    contenedor.appendChild(card);
  });
}

export function initAgregarCancion() {
  const contenedor = document.querySelector('#resultados-busqueda');

  contenedor.addEventListener('click', (e) => {
    if (!e.target.classList.contains('btn-agregar')) return;

    const card = e.target.closest('.resultado-cancion');
    const cancionId = card.dataset.id;
    const select = card.querySelector('.select-playlist');
    const playlistId = select.value;

    const { playlists, searchResults } = getState();

    if (playlists.length === 0) {
      setFeedbackAgregar('Crea una playlist primero.');
      renderFeedbackAgregar();
      return;
    }

    if (!playlistId) {
      setFeedbackAgregar('Elige una playlist.');
      renderFeedbackAgregar();
      return;
    }

    const cancion = searchResults.find((c) => c.id === Number(cancionId) || c.id === cancionId);
    const playlist = playlists.find((p) => p.id === playlistId);

    const yaExiste = playlist.canciones.some((c) => c.id === cancion.id);
    if (yaExiste) {
      setFeedbackAgregar(`"${cancion.nombre}" ya está en "${playlist.nombre}".`);
      renderFeedbackAgregar();
      return;
    }

    const cancionConFecha = {
      ...cancion,
      fechaAgregado: new Date().toISOString(),
    };
agregarCancionAPlaylist(playlistId, cancionConFecha);
    guardarPlaylists(getState().playlists); // NUEVO
    setFeedbackAgregar(`Se agregó a "${playlist.nombre}".`);
    renderFeedbackAgregar();
    renderPlaylists(); 
  });
}

export function renderFeedbackAgregar() {
  const contenedor = document.querySelector('#feedback-agregar');
  const { feedbackAgregar } = getState();
  contenedor.textContent = feedbackAgregar;
}

export function initPlaylists() {
  const form = document.querySelector('#form-nueva-playlist');
  const input = document.querySelector('#input-nombre-playlist');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = input.value.trim();

    if (!nombre) {
      setFormPlaylistError('El nombre de la playlist no puede estar vacío.');
      renderErrorPlaylist();
      return;
    }

    const { playlists } = getState();
    const yaExiste = playlists.some(
      (p) => p.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (yaExiste) {
      setFormPlaylistError('Nombre de playlist ya existente.');
      renderErrorPlaylist();
      return;
    }

    agregarPlaylist({
      id: crypto.randomUUID(),
      nombre,
      canciones: [],
    });
    guardarPlaylists(getState().playlists); // NUEVO

    setFormPlaylistError('');
    renderErrorPlaylist();
    renderPlaylists();
    form.reset();
  });
}

export function renderErrorPlaylist() {
  const contenedor = document.querySelector('#error-playlist');
  const { formPlaylistError } = getState();
  contenedor.textContent = formPlaylistError;
}
export function renderPlaylists() {
  const contenedorLista = document.querySelector('#lista-playlists');
  const { playlists, playlistActivaId } = getState();

  if (playlistActivaId) {
    contenedorLista.innerHTML = '';
    contenedorLista.style.display = 'none';
    renderDetallePlaylist();
    return;
  }

  contenedorLista.style.display = '';
  contenedorLista.innerHTML = '';
  document.querySelector('#control-orden').hidden = true;

  playlists.forEach((playlist) => {
    const li = document.createElement('li');
    li.className = 'playlist-item';
    li.dataset.id = playlist.id;
    li.innerHTML = `
      <span class="playlist-nombre">${playlist.nombre}</span>
      <button type="button" class="btn-eliminar-playlist" data-id="${playlist.id}">Eliminar</button>
    `;
    contenedorLista.appendChild(li);
  });

  document.querySelector('#detalle-playlist').innerHTML = '';
}

// NUEVO: click en un item de la lista abre su detalle
export function initDetallePlaylist() {
  const listaContenedor = document.querySelector('#lista-playlists');

  listaContenedor.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-eliminar-playlist')) return; // NUEVO
    const li = e.target.closest('.playlist-item');
    if (!li) return;
    setPlaylistActiva(li.dataset.id);
    renderPlaylists();
  });

  const detalleContenedor = document.querySelector('#detalle-playlist');

  // Delegación: botón "Volver" vive dentro del detalle, se crea dinámicamente
  detalleContenedor.addEventListener('click', (e) => {
    if (!e.target.classList.contains('btn-volver')) return;
    setPlaylistActiva(null);
    renderPlaylists();
  });
}

// NUEVO
export function renderDetallePlaylist() {
  const contenedor = document.querySelector('#detalle-playlist');
  const { playlists, playlistActivaId } = getState();

  const playlist = playlists.find((p) => p.id === playlistActivaId);
  if (!playlist) return;

  const cantidad = playlist.canciones.length;

  // NUEVO: suma de duraciones + formato legible
  const duracionTotalMs = playlist.canciones.reduce(
    (total, cancion) => total + cancion.duracionMs,
    0
  );
  const duracionTexto = formatearDuracionTotal(duracionTotalMs);

const estadisticasTexto = calcularEstadisticasTexto(playlist.canciones);

  // NUEVO: mostrar el control de orden y aplicar el criterio activo
  const { ordenActivo } = getState();
  const controlOrden = document.querySelector('#control-orden');
  controlOrden.hidden = false;
  document.querySelector('#select-orden').value = ordenActivo;

  const cancionesOrdenadas = ordenarCanciones(playlist.canciones, ordenActivo);

  let contenidoCanciones = '';
  if (cantidad === 0) {
    contenidoCanciones = `<p class="detalle-vacio">Esta playlist todavía no tiene canciones. Agrega algunas desde la búsqueda 🎵</p>`;
  } else {
   contenidoCanciones = cancionesOrdenadas
      .map((cancion) => {
        const fecha = new Date(cancion.fechaAgregado);
        const fechaLegible = fecha.toLocaleDateString('es-PE');

        return `
          <article class="detalle-cancion" data-id="${cancion.id}">
            <img src="${cancion.caratula}" alt="Carátula de ${cancion.nombre}" width="60" height="60">
            <div class="detalle-info">
              <p class="detalle-nombre">${cancion.nombre}</p>
              <p class="detalle-artista">${cancion.artista}</p>
              <span class="detalle-duracion">${cancion.duracionFormateada}</span>
              <span class="detalle-fecha">Agregada el ${fechaLegible}</span>
            </div>
            <button type="button" class="btn-quitar-cancion" data-id="${cancion.id}">Quitar</button>
          </article>
        `;
      })
      .join('');
  }

 contenedor.innerHTML = `
    <button type="button" class="btn-volver">← Volver</button>
    <h3>${playlist.nombre} — ${cantidad} canción${cantidad === 1 ? '' : 'es'} — ${duracionTexto}</h3>
    <p class="detalle-estadisticas">${estadisticasTexto}</p>
    <div class="detalle-canciones">
      ${contenidoCanciones}
    </div>
  `;
}
function calcularEstadisticasTexto(canciones) {
  if (canciones.length === 0) {
    return 'Sin datos aún';
  }

  const generoMasFrecuente = obtenerMasFrecuente(canciones, (c) => c.genero);
  const artistaMasFrecuente = obtenerMasFrecuente(canciones, (c) => c.artista);

  return `Género más frecuente: ${generoMasFrecuente} · Artista más repetido: ${artistaMasFrecuente}`;
}

// NUEVO: cuenta ocurrencias con un extractor y devuelve la más repetida (primera en empate)
function obtenerMasFrecuente(canciones, extractor) {
  const conteo = {};

  canciones.forEach((cancion) => {
    const clave = extractor(cancion);
    conteo[clave] = (conteo[clave] || 0) + 1;
  });

  let masFrecuente = null;
  let maxConteo = 0;

  canciones.forEach((cancion) => {
    const clave = extractor(cancion);
    if (conteo[clave] > maxConteo) {
      maxConteo = conteo[clave];
      masFrecuente = clave;
    }
  });

  return masFrecuente;
}
export function initModalConfirmacion() {
  const modal = document.querySelector('#modal-confirmacion');
  const btnCancelar = document.querySelector('#modal-cancelar');
  const btnConfirmar = document.querySelector('#modal-confirmar');

  btnCancelar.addEventListener('click', () => {
    cerrarModalConfirmacion();
    renderModal();
  });

  btnConfirmar.addEventListener('click', () => {
    const { modalConfirmacion } = getState();
    if (!modalConfirmacion) return;

    if (modalConfirmacion.tipo === 'playlist') {
      eliminarPlaylist(modalConfirmacion.playlistId);
    } else if (modalConfirmacion.tipo === 'cancion') {
      quitarCancionDePlaylist(modalConfirmacion.playlistId, modalConfirmacion.cancionId);
    }
      guardarPlaylists(getState().playlists); // NUEVO

    cerrarModalConfirmacion();
    renderModal();
    renderPlaylists();
  });
}

export function renderModal() {
  const modal = document.querySelector('#modal-confirmacion');
  const mensaje = document.querySelector('#modal-mensaje');
  const { modalConfirmacion } = getState();

  if (!modalConfirmacion) {
    modal.hidden = true;
    return;
  }

  mensaje.textContent = '¿Estás seguro de que quieres eliminar esto?';
  modal.hidden = false;
}

// Delegación: click en "Eliminar" de una playlist
export function initEliminarPlaylist() {
  const contenedor = document.querySelector('#lista-playlists');

  contenedor.addEventListener('click', (e) => {
    if (!e.target.classList.contains('btn-eliminar-playlist')) return;
    const playlistId = e.target.dataset.id;
    abrirModalConfirmacion({ tipo: 'playlist', playlistId });
    renderModal();
  });
}

// Delegación: click en "Quitar" de una canción dentro del detalle
export function initQuitarCancion() {
  const contenedor = document.querySelector('#detalle-playlist');

  contenedor.addEventListener('click', (e) => {
    if (!e.target.classList.contains('btn-quitar-cancion')) return;
    const cancionId = e.target.dataset.id;
    const { playlistActivaId } = getState();
    abrirModalConfirmacion({ tipo: 'cancion', playlistId: playlistActivaId, cancionId });
    renderModal();
  });
}
// NUEVO: devuelve una copia ordenada del array de canciones según el criterio
function ordenarCanciones(canciones, criterio) {
  const copia = [...canciones]; // inmutable: no tocamos el array original

  switch (criterio) {
    case 'recientes':
      return copia.sort((a, b) => new Date(b.fechaAgregado) - new Date(a.fechaAgregado));
    case 'antiguas':
      return copia.sort((a, b) => new Date(a.fechaAgregado) - new Date(b.fechaAgregado));
    case 'alfabetico':
      return copia.sort((a, b) =>
        a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
      );
    default:
      return copia; // 'agregado': tal cual está
  }
}

export function initOrdenCanciones() {
  const select = document.querySelector('#select-orden');

  select.addEventListener('change', () => {
    setOrdenActivo(select.value);
    renderDetallePlaylist();
  });
}

export function initPersistencia() {
  const { ok, playlists } = cargarPlaylists();

  if (!ok) {
    setDatosCorruptos(true);
    renderBannerCorrupcion();
    return; // no seguimos inicializando la vista normal
  }

  setPlaylists(playlists);
  renderPlaylists();

  document.querySelector('#btn-empezar-de-cero').addEventListener('click', () => {
    limpiarPlaylists();
    setDatosCorruptos(false);
    setPlaylists([]);
    renderBannerCorrupcion();
    renderPlaylists();
  });
}

export function renderBannerCorrupcion() {
  const banner = document.querySelector('#banner-corrupcion');
  const app = document.querySelector('#app');
  const { datosCorruptos } = getState();

  banner.hidden = !datosCorruptos;
  app.hidden = datosCorruptos; // ocultamos la app normal mientras hay corrupción
}