import { useCallback, useEffect, useState } from 'react';
import { api } from '../data/index.js';

const VACIO = { clientes: [], interacciones: [], tareas: [] };

// Carga todos los datos del usuario y expone las acciones que los modifican.
// `clave` identifica al usuario activo: al cambiar (login/logout) se recarga todo.
export function useCrm(clave) {
  const [datos, setDatos] = useState(VACIO);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!clave) {
      setDatos(VACIO);
      return undefined;
    }
    let vivo = true;
    setCargando(true);
    api
      .cargarTodo()
      .then((d) => {
        if (vivo) {
          setDatos(d);
          setError('');
        }
      })
      .catch((e) => vivo && setError(e.message || 'No se pudieron cargar los datos.'))
      .finally(() => vivo && setCargando(false));
    return () => {
      vivo = false;
    };
  }, [clave]);

  // Ejecuta una acción mostrando el error en pantalla en vez de romper la app
  const ejecutar = useCallback(async (fn) => {
    try {
      setError('');
      return await fn();
    } catch (e) {
      setError(e.message || 'Ocurrió un error.');
      return null;
    }
  }, []);

  const reemplazar = (clave, fila) =>
    setDatos((d) => ({ ...d, [clave]: d[clave].map((x) => (x.id === fila.id ? fila : x)) }));

  const acciones = {
    crearCliente: (campos) =>
      ejecutar(async () => {
        const fila = await api.clientes.crear(campos);
        setDatos((d) => ({ ...d, clientes: [fila, ...d.clientes] }));
        return fila;
      }),

    actualizarCliente: (id, cambios) =>
      ejecutar(async () => {
        const fila = await api.clientes.actualizar(id, cambios);
        reemplazar('clientes', fila);
        return fila;
      }),

    cambiarEtapa: (id, etapa) =>
      ejecutar(async () => {
        const fila = await api.clientes.actualizar(id, { etapa });
        reemplazar('clientes', fila);
        return fila;
      }),

    eliminarCliente: (id) =>
      ejecutar(async () => {
        await api.clientes.eliminar(id);
        setDatos((d) => ({
          clientes: d.clientes.filter((c) => c.id !== id),
          interacciones: d.interacciones.filter((i) => i.cliente_id !== id),
          tareas: d.tareas.filter((t) => t.cliente_id !== id),
        }));
        return true;
      }),

    agregarInteraccion: (campos) =>
      ejecutar(async () => {
        const fila = await api.interacciones.crear(campos);
        setDatos((d) => ({ ...d, interacciones: [fila, ...d.interacciones] }));
        return fila;
      }),

    eliminarInteraccion: (id) =>
      ejecutar(async () => {
        await api.interacciones.eliminar(id);
        setDatos((d) => ({ ...d, interacciones: d.interacciones.filter((i) => i.id !== id) }));
        return true;
      }),

    crearTarea: (campos) =>
      ejecutar(async () => {
        const fila = await api.tareas.crear(campos);
        setDatos((d) => ({ ...d, tareas: [fila, ...d.tareas] }));
        return fila;
      }),

    alternarTarea: (tarea) =>
      ejecutar(async () => {
        const fila = await api.tareas.actualizar(tarea.id, { hecha: !tarea.hecha });
        reemplazar('tareas', fila);
        return fila;
      }),

    eliminarTarea: (id) =>
      ejecutar(async () => {
        await api.tareas.eliminar(id);
        setDatos((d) => ({ ...d, tareas: d.tareas.filter((t) => t.id !== id) }));
        return true;
      }),
  };

  return { datos, cargando, error, limpiarError: () => setError(''), acciones };
}
