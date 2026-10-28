import { nuevoId } from '../lib/utils.js';
import { semilla } from './seed.js';

// Modo demo: misma interfaz que supabaseApi, pero guardando en localStorage.
const KEY = 'minicrm.demo.v1';
let cache = null;

function datos() {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) cache = JSON.parse(raw);
  } catch {
    /* almacenamiento bloqueado: seguimos en memoria */
  }
  if (!cache) {
    cache = semilla();
    guardar();
  }
  return cache;
}

function guardar() {
  try {
    localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    /* sin persistencia, la app sigue funcionando en memoria */
  }
}

const copia = (x) => JSON.parse(JSON.stringify(x));
const nuevaFila = (campos) => ({ id: nuevoId(), created_at: new Date().toISOString(), ...campos });

function actualizarFila(lista, id, cambios) {
  const fila = lista.find((x) => x.id === id);
  if (!fila) throw new Error('No se encontró el registro.');
  Object.assign(fila, cambios);
  guardar();
  return copia(fila);
}

const USUARIO_DEMO = { id: 'demo', email: 'demo@mini-crm.app' };

export const localApi = {
  modo: 'demo',
  requiereLogin: false,

  auth: {
    async getUser() {
      return USUARIO_DEMO;
    },
    onChange() {
      return () => {};
    },
    async signIn() {},
    async signUp() {
      return { requiereConfirmacion: false };
    },
    async signOut() {},
  },

  async cargarTodo() {
    return copia(datos());
  },

  async reiniciar() {
    cache = semilla();
    guardar();
  },

  clientes: {
    async crear(campos) {
      const fila = nuevaFila(campos);
      datos().clientes.unshift(fila);
      guardar();
      return copia(fila);
    },
    async actualizar(id, cambios) {
      return actualizarFila(datos().clientes, id, cambios);
    },
    async eliminar(id) {
      const d = datos();
      d.clientes = d.clientes.filter((c) => c.id !== id);
      d.interacciones = d.interacciones.filter((i) => i.cliente_id !== id);
      d.tareas = d.tareas.filter((t) => t.cliente_id !== id);
      guardar();
    },
  },

  interacciones: {
    async crear(campos) {
      const fila = nuevaFila(campos);
      datos().interacciones.unshift(fila);
      guardar();
      return copia(fila);
    },
    async eliminar(id) {
      const d = datos();
      d.interacciones = d.interacciones.filter((i) => i.id !== id);
      guardar();
    },
  },

  tareas: {
    async crear(campos) {
      const fila = nuevaFila(campos);
      datos().tareas.unshift(fila);
      guardar();
      return copia(fila);
    },
    async actualizar(id, cambios) {
      return actualizarFila(datos().tareas, id, cambios);
    },
    async eliminar(id) {
      const d = datos();
      d.tareas = d.tareas.filter((t) => t.id !== id);
      guardar();
    },
  },
};
