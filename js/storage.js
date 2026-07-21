// Persistencia en localStorage: guardar, cargar y limpiar.
const CLAVE = 'mi-setlist-playlists';

export function guardarPlaylists(playlists) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(playlists));
    return true;
  } catch (error) {
    return false;
  }
}

export function cargarPlaylists() {
  const crudo = localStorage.getItem(CLAVE);

  if (crudo === null) {
    return { ok: true, playlists: [] };
  }

  try {
    const data = JSON.parse(crudo);

    if (!esPlaylistsValido(data)) {
      return { ok: false, playlists: [] };
    }

    return { ok: true, playlists: data };
  } catch (error) {
    return { ok: false, playlists: [] };
  }
}

export function limpiarPlaylists() {
  try {
    localStorage.removeItem(CLAVE);
    return true;
  } catch (error) {
    return false;
  }
}

function esPlaylistsValido(data) {
  if (!Array.isArray(data)) return false;

  return data.every((playlist) => {
    return (
      typeof playlist === 'object' &&
      playlist !== null &&
      typeof playlist.id === 'string' &&
      typeof playlist.nombre === 'string' &&
      Array.isArray(playlist.canciones)
    );
  });
}