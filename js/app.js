// js/state.js
export const mensaje = 'Módulos ESM funcionando ✅';

// js/app.js
import { mensaje } from './state.js';
document.querySelector('#app').textContent = mensaje;