import { useMemo, useState } from 'react';
import Modal from './Modal.jsx';
import { ETAPAS, TIPOS, tipoPorId } from '../lib/constants.js';
import { enlaceWhatsApp, estadoVencimiento, formatearMonto, tiempoRelativo } from '../lib/utils.js';

export default function ClienteDetalle({ cliente, interacciones, tareas, acciones, onEditar, onCerrar }) {
  const [tipo, setTipo] = useState('nota');
  const [detalle, setDetalle] = useState('');
  const [titulo, setTitulo] = useState('');
  const [vence, setVence] = useState('');

  const wa = enlaceWhatsApp(cliente.telefono);

  const historial = useMemo(
    () => [...interacciones].sort((a, b) => b.created_at.localeCompare(a.created_at)),
    [interacciones]
  );
  const pendientes = tareas.filter((t) => !t.hecha);
  const hechas = tareas.filter((t) => t.hecha);

  async function agregarInteraccion(e) {
    e.preventDefault();
    if (!detalle.trim()) return;
    const r = await acciones.agregarInteraccion({ cliente_id: cliente.id, tipo, detalle: detalle.trim() });
    if (r) setDetalle('');
  }

  async function agregarTarea(e) {
    e.preventDefault();
    if (!titulo.trim()) return;
    const r = await acciones.crearTarea({
      cliente_id: cliente.id,
      titulo: titulo.trim(),
      vence: vence || null,
      hecha: false,
    });
    if (r) {
      setTitulo('');
      setVence('');
    }
  }

  async function eliminar() {
    if (window.confirm(`¿Eliminar a ${cliente.nombre}? También se borrarán sus notas y tareas.`)) {
      const ok = await acciones.eliminarCliente(cliente.id);
      if (ok) onCerrar();
    }
  }

  const filaTarea = (t) => {
    const estado = estadoVencimiento(t.vence, t.hecha);
    return (
      <li key={t.id} className={t.hecha ? 'tarea hecha' : 'tarea'}>
        <input
          type="checkbox"
          checked={t.hecha}
          aria-label={`Marcar "${t.titulo}" como ${t.hecha ? 'pendiente' : 'hecha'}`}
          onChange={() => acciones.alternarTarea(t)}
        />
        <span className="tarea-titulo">{t.titulo}</span>
        <span className={`estado-venc ${estado.clase}`}>{estado.texto}</span>
        <button type="button" className="icono" aria-label={`Eliminar tarea ${t.titulo}`} onClick={() => acciones.eliminarTarea(t.id)}>
          ✕
        </button>
      </li>
    );
  };

  return (
    <Modal lateral titulo={cliente.nombre} subtitulo={cliente.empresa || 'Sin empresa'} onClose={onCerrar}>
      <div className="detalle-barra">
        <label className="etapa-select">
          Etapa
          <select value={cliente.etapa} onChange={(e) => acciones.cambiarEtapa(cliente.id, e.target.value)}>
            {ETAPAS.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre}
              </option>
            ))}
          </select>
        </label>
        <div className="detalle-valor">
          <span className="tile-label">Valor estimado</span>
          <strong>{formatearMonto(cliente.valor)}</strong>
        </div>
      </div>

      <ul className="contacto">
        {cliente.email && (
          <li>
            <a href={`mailto:${cliente.email}`}>✉️ {cliente.email}</a>
          </li>
        )}
        {cliente.telefono && (
          <li>
            <a href={`tel:${cliente.telefono.replace(/\s/g, '')}`}>📞 {cliente.telefono}</a>
            {wa && (
              <>
                {' · '}
                <a href={wa} target="_blank" rel="noreferrer">
                  WhatsApp
                </a>
              </>
            )}
          </li>
        )}
        {cliente.origen && <li>Origen: {cliente.origen}</li>}
      </ul>

      {cliente.notas && <p className="notas-cliente">{cliente.notas}</p>}

      <div className="acciones-form izq">
        <button type="button" onClick={onEditar}>
          Editar
        </button>
        <button type="button" className="peligro" onClick={eliminar}>
          Eliminar
        </button>
      </div>

      <section className="bloque">
        <h3>Seguimiento</h3>
        <form className="form-linea" onSubmit={agregarInteraccion}>
          <select aria-label="Tipo de interacción" value={tipo} onChange={(e) => setTipo(e.target.value)}>
            {TIPOS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.icono} {t.nombre}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="¿Qué pasó? Ej. Pidió cotización…"
            aria-label="Detalle de la interacción"
            value={detalle}
            onChange={(e) => setDetalle(e.target.value)}
          />
          <button type="submit" className="primario" disabled={!detalle.trim()}>
            Agregar
          </button>
        </form>

        {historial.length === 0 ? (
          <p className="vacio">Aún no hay notas. Registra tu primera llamada, correo o reunión.</p>
        ) : (
          <ul className="timeline">
            {historial.map((i) => {
              const t = tipoPorId(i.tipo);
              return (
                <li key={i.id}>
                  <span className="tl-icono" aria-hidden="true">
                    {t.icono}
                  </span>
                  <div className="tl-texto">
                    <span>{i.detalle}</span>
                    <span className="mov-meta">
                      {t.nombre} · {tiempoRelativo(i.created_at)}
                    </span>
                  </div>
                  <button type="button" className="icono" aria-label="Eliminar nota" onClick={() => acciones.eliminarInteraccion(i.id)}>
                    ✕
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="bloque">
        <h3>Tareas</h3>
        <form className="form-linea" onSubmit={agregarTarea}>
          <input
            type="text"
            placeholder="Nueva tarea… Ej. Enviar propuesta"
            aria-label="Título de la tarea"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
          <input type="date" aria-label="Fecha de vencimiento" value={vence} onChange={(e) => setVence(e.target.value)} />
          <button type="submit" className="primario" disabled={!titulo.trim()}>
            Agregar
          </button>
        </form>
        {tareas.length === 0 ? (
          <p className="vacio">Sin tareas para este cliente.</p>
        ) : (
          <ul className="tareas">
            {pendientes.map(filaTarea)}
            {hechas.map(filaTarea)}
          </ul>
        )}
      </section>
    </Modal>
  );
}
