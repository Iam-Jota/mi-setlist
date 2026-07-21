// Modelo que representa una canción normalizada, sin importar
// si viene de la API de iTunes o de una playlist guardada.

const PLACEHOLDER_CARATULA =
  'data:image/svg+xml;utf8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
      <rect width="100" height="100" fill="#2a2a2a"/>
      <text x="50" y="55" font-size="40" text-anchor="middle" fill="#888">♪</text>
    </svg>
  `);

export class Cancion {
  constructor({ id, nombre, artista, caratula, duracionMs, genero }) {
    this.id = id;
    this.nombre = nombre;
    this.artista = artista;
    this.caratula = caratula || PLACEHOLDER_CARATULA;
    this.duracionMs = duracionMs || 0;
    this.genero = genero || 'Desconocido';
  }

  // Crea una Cancion a partir de un item crudo de la respuesta de iTunes
  static fromItunesResult(item) {
    return new Cancion({
      id: item.trackId,
      nombre: item.trackName,
      artista: item.artistName,
      caratula: item.artworkUrl100,
      duracionMs: item.trackTimeMillis,
      genero: item.primaryGenreName,
    });
  }

  // Formatea la duración en mm:ss (ej. 3:42)
  get duracionFormateada() {
    const totalSegundos = Math.floor(this.duracionMs / 1000);
    const min = Math.floor(totalSegundos / 60);
    const seg = totalSegundos % 60;
    return `${min}:${String(seg).padStart(2, '0')}`;
  }
}

// ... (todo lo que ya existe en Cancion.js queda igual) ...

// NUEVO: convierte milisegundos totales a formato "H h M min"
export function formatearDuracionTotal(totalMs) {
  const totalMinutos = Math.floor(totalMs / 1000 / 60);
  const horas = Math.floor(totalMinutos / 60);
  const minutos = totalMinutos % 60;
  return `${horas} h ${minutos} min`;
}