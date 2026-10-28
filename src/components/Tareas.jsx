import { useMemo, useState } from 'react';
import { diasHasta, estadoVencimiento } from '../lib/utils.js';

export default function Tareas({ tareas, clientes, acciones, onAbrirCliente }) {
  const [filtro, setFiltro] = useState('pendientes');
  const [titulo, setTitulo] = useState('');
  const [vence, setVence] = useState('');
  const [clienteId, setClienteId] = useState('');

  const clientePorId = useMemo(() => Object.fromEntries(clientes.map((c) => [c.id, c])), [clientes]);

  const visibles = useMemo(() => {
    const lista = tareas.filter((t) => (filtro === 'todas' ? true : filtro === 'hechas' ? t.hecha : !t.hecha));
    return [...lista].sort((a, b) => {
      if (a.hecha !== b.hecha) return a.hecha ? 1 : -1;
      const da = diasHasta(a.vence);
      const db = diasHasta(b.vence);
      if (da === null && db === null) return 0;
      if (da === null) return 1;
      if (db === null) return -1;
      return da - db;
    });
  }, [tareas, filtro]);

  async function crear(e) {
    e.preventDefault();
    if (!titulo.trim()) return;
    const r = await acciones.crearTarea({
      titulo: titulo.trim(),
      vence: vence || null,
      cliente_id: clienteId || null,
      hecha: false,
    });
    if (r) {
      setTitulo('');
      setVence('');
      setClienteId('');
    }
  }

  const pendientes = tareas.filter((t) => !t.hecha).length;

  return (
    <section className="card">
      <div className="lista-cabecera">
        <h2>Tareas ({pendientes} pendientes)</h2>
        <div className="toggle tres" role="group" aria-label="Filtrar tareas">
          {[
            ['pendientes', 'Pendientes'],
            ['hechas', 'Hechas'],
            ['todas', 'Todas'],
          ].map(([id, nombre]) => (
            <button
              key={id}
              type="button"
              className={filtro === id ? 'activo' : ''}
              aria-pressed={filtro === id}
              onClick={() => setFiltro(id)}
            >
              {nombre}
            </button>
          ))}
        </div>
      </div>

      <form className="form-linea" onSubmit={crear}>
        <input
          type="text"
          placeholder="Nueva tarea… Ej. Llamar a Marco"
          aria-label="Título de la tarea"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <input type="date" aria-label="Fecha de vencimiento" value={vence} onChange={(e) => setVence(e.target.value)} />
        <select aria-label="Cliente asociado" value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
          <option value="">Sin cliente</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
        <button type="submit" className="primario" disabled={!titulo.trim()}>
          Agregar
        </button>
      </form>

      {visibles.length === 0 ? (
        <p className="vacio">
          {filtro === 'hechas' ? 'Todavía no completaste ninguna tarea.' : 'No hay tareas pendientes. ¡Buen trabajo!'}
        </p>
      ) : (
        <ul className="tareas">
          {visibles.map((t) => {
            const estado = estadoVencimiento(t.vence, t.hecha);
            const cliente = t.cliente_id ? clientePorId[t.cliente_id] : null;
            return (
              <li key={t.id} className={t.hecha ? 'tarea hecha' : 'tarea'}>
                <input
                  type="checkbox"
                  checked={t.hecha}
                  aria-label={`Marcar "${t.titulo}" como ${t.hecha ? 'pendiente' : 'hecha'}`}
                  onChange={() => acciones.alternarTarea(t)}
                />
                <div className="tarea-titulo">
                  {t.titulo}
                  {cliente && (
                    <button type="button" className="enlace chico" onClick={() => onAbrirCliente(cliente.id)}>
                      {cliente.nombre}
                    </button>
                  )}
                </div>
                <span className={`estado-venc ${estado.clase}`}>{estado.texto}</span>
                <button
                  type="button"
                  className="icono"
                  aria-label={`Eliminar tarea ${t.titulo}`}
                  onClick={() => acciones.eliminarTarea(t.id)}
                >
                  ✕
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
