import { useMemo, useState } from 'react';
import Badge from './Badge.jsx';
import { ETAPAS } from '../lib/constants.js';
import { exportarCSV, formatearMonto, iniciales } from '../lib/utils.js';

export default function Clientes({ clientes, onAbrir, onNuevo }) {
  const [q, setQ] = useState('');
  const [etapa, setEtapa] = useState('todas');
  const [orden, setOrden] = useState('recientes');

  const visibles = useMemo(() => {
    const t = q.trim().toLowerCase();
    const lista = clientes.filter(
      (c) =>
        (etapa === 'todas' || c.etapa === etapa) &&
        (!t || `${c.nombre} ${c.empresa} ${c.email} ${c.telefono}`.toLowerCase().includes(t))
    );
    const comparar = {
      recientes: (a, b) => (b.created_at || '').localeCompare(a.created_at || ''),
      valor: (a, b) => (Number(b.valor) || 0) - (Number(a.valor) || 0),
      nombre: (a, b) => a.nombre.localeCompare(b.nombre, 'es'),
    }[orden];
    return [...lista].sort(comparar);
  }, [clientes, q, etapa, orden]);

  return (
    <section className="card">
      <div className="lista-cabecera">
        <h2>Clientes ({visibles.length})</h2>
        <div className="filtros">
          <input
            type="search"
            placeholder="Buscar nombre, empresa, correo…"
            aria-label="Buscar clientes"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select aria-label="Filtrar por etapa" value={etapa} onChange={(e) => setEtapa(e.target.value)}>
            <option value="todas">Todas las etapas</option>
            {ETAPAS.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre}
              </option>
            ))}
          </select>
          <select aria-label="Ordenar por" value={orden} onChange={(e) => setOrden(e.target.value)}>
            <option value="recientes">Más recientes</option>
            <option value="valor">Mayor valor</option>
            <option value="nombre">Nombre A–Z</option>
          </select>
          <button type="button" disabled={visibles.length === 0} onClick={() => exportarCSV(visibles)}>
            Exportar CSV
          </button>
          <button type="button" className="primario" onClick={onNuevo}>
            + Nuevo cliente
          </button>
        </div>
      </div>

      {visibles.length === 0 ? (
        <p className="vacio">
          {clientes.length === 0
            ? 'Aún no hay clientes. Pulsa "Nuevo cliente" para agregar el primero.'
            : 'Ningún cliente coincide con tu búsqueda.'}
        </p>
      ) : (
        <ul className="clientes">
          {visibles.map((c) => (
            <li key={c.id}>
              <button type="button" className="fila-cliente" onClick={() => onAbrir(c.id)}>
                <span className="avatar" aria-hidden="true">
                  {iniciales(c.nombre)}
                </span>
                <span className="cli-info">
                  <span className="mov-titulo">{c.nombre}</span>
                  <span className="mov-meta">{c.empresa || 'Sin empresa'}</span>
                </span>
                <span className="cli-contacto">{c.email || c.telefono || '—'}</span>
                <Badge etapa={c.etapa} />
                <span className="cli-valor">{formatearMonto(c.valor)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
