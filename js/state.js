// Estado central plano de la app.
// Nadie fuera de este archivo debe mutar `state` directamente:
// todo pasa por los setters exportados.

const state = {
  searchResults: [],
  searchStatus: 'idle',
  searchTerm: '',
  playlists: [],
  formPlaylistError: '',
  feedbackAgregar: '',
  playlistActivaId: null,
  modalConfirmacion: null,
  ordenActivo: 'agregado', // NUEVO: 'agregado' | 'recientes' | 'antiguas' | 'alfabetico'
 datosCorruptos: false, // NUEVO
};

export function getState() {
  return state;
}

export function setSearchResults(canciones) {
  state.searchResults = canciones;
}

export function setSearchStatus(status) {
  state.searchStatus = status;
}

export function setSearchTerm(termino) {
  state.searchTerm = termino;
}

export function agregarPlaylist(playlist) {
  state.playlists = [...state.playlists, playlist];
}

export function setFormPlaylistError(mensaje) {
  state.formPlaylistError = mensaje;
}

export function agregarCancionAPlaylist(playlistId, cancion) {
  state.playlists = state.playlists.map((playlist) => {
    if (playlist.id !== playlistId) return playlist;
    return {
      ...playlist,
      canciones: [...playlist.canciones, cancion],
    };
  });
}

export function setFeedbackAgregar(mensaje) {
  state.feedbackAgregar = mensaje;
}

export function setPlaylistActiva(playlistId) {
  state.playlistActivaId = playlistId;
}

// NUEVO
export function abrirModalConfirmacion(datos) {
  state.modalConfirmacion = datos; // { tipo: 'cancion' | 'playlist', playlistId, cancionId? }
}

// NUEVO
export function cerrarModalConfirmacion() {
  state.modalConfirmacion = null;
}

// NUEVO
export function quitarCancionDePlaylist(playlistId, cancionId) {
  state.playlists = state.playlists.map((playlist) => {
    if (playlist.id !== playlistId) return playlist;
    return {
      ...playlist,
       canciones: playlist.canciones.filter((c) => String(c.id) !== String(cancionId)),
    };
  });
}

// NUEVO
export function eliminarPlaylist(playlistId) {
  state.playlists = state.playlists.filter((p) => p.id !== playlistId);
  if (state.playlistActivaId === playlistId) {
    state.playlistActivaId = null;
  }
}
// NUEVO
export function setOrdenActivo(orden) {
  state.ordenActivo = orden;
}

// NUEVO: reemplaza playlists completas (usado al cargar desde storage)
export function setPlaylists(playlists) {
  state.playlists = playlists;
}

// NUEVO
export function setDatosCorruptos(valor) {
  state.datosCorruptos = valor;
}