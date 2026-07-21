// Comunicación de solo lectura con la iTunes Search API.

const BASE_URL = 'https://itunes.apple.com/search';

let controladorActual = null; // para cancelar la búsqueda anterior

export async function buscarCanciones(termino) {
  // Cancela la petición anterior si sigue en vuelo
  if (controladorActual) {
    controladorActual.abort();
  }
  controladorActual = new AbortController();

  const params = new URLSearchParams({
    term: termino,
    entity: 'song',
    attribute: 'mixTerm', // busca por artista o título a la vez
    limit: '10',
  });

  const respuesta = await fetch(`${BASE_URL}?${params}`, {
    signal: controladorActual.signal,
  });

  if (!respuesta.ok) {
    throw new Error(`Error de red: ${respuesta.status}`);
  }

  const data = await respuesta.json();
  return data.results;
}