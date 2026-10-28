import { useState } from 'react';
import { ETAPAS } from '../lib/constants.js';
import { formatearMonto } from '../lib/utils.js';

// Tablero kanban. Se arrastra con el mouse y, para teclado/móvil, cada tarjeta tiene un selector "Mover a".
export default function Pipeline({ clientes, onAbrir, onMover }) {
  const [arrastrando, setArrastrando] = useState(null);
  const [sobre, setSobre] = useState(null);

  return (
    <section>
      <p className="nota margen">Arrastra las tarjetas entre columnas, o usa el selector "Mover a" de cada una.</p>
      <div className="kanban">
        {ETAPAS.map((e) => {
          const items = clientes.filter((c) => c.etapa === e.id);
          const total = items.reduce((s, c) => s + (Number(c.valor) || 0), 0);
          return (
            <div
              key={e.id}
              className={`col ${sobre === e.id ? 'sobre' : ''}`}
              onDragOver={(ev) => {
                ev.preventDefault();
                if (sobre !== e.id) setSobre(e.id);
              }}
              onDragLeave={(ev) => {
                if (!ev.currentTarget.contains(ev.relatedTarget)) setSobre(null);
              }}
              onDrop={(ev) => {
                ev.preventDefault();
                const id = ev.dataTransfer.getData('text/plain') || arrastrando;
                setSobre(null);
                setArrastrando(null);
                const c = clientes.find((x) => x.id === id);
                if (c && c.etapa !== e.id) onMover(id, e.id);
              }}
            >
              <header className="col-cab">
                <span className="punto" style={{ background: e.color }} aria-hidden="true" />
                <h3>{e.nombre}</h3>
                <span className="col-cuenta">{items.length}</span>
              </header>
              <p className="col-total">{formatearMonto(total)}</p>

              <ul className="kcards">
                {items.map((c) => (
                  <li
                    key={c.id}
                    className={`kcard ${arrastrando === c.id ? 'arrastrando' : ''}`}
                    draggable
                    onDragStart={(ev) => {
                      ev.dataTransfer.setData('text/plain', c.id);
                      ev.dataTransfer.effectAllowed = 'move';
                      setArrastrando(c.id);
                    }}
                    onDragEnd={() => {
                      setArrastrando(null);
                      setSobre(null);
                    }}
                  >
                    <button type="button" className="kcard-abrir" onClick={() => onAbrir(c.id)}>
                      <span className="mov-titulo">{c.nombre}</span>
                      <span className="mov-meta">{c.empresa || 'Sin empresa'}</span>
                      <strong className="kcard-valor">{formatearMonto(c.valor)}</strong>
                    </button>
                    <select
                      className="mover"
                      aria-label={`Mover a ${c.nombre} a otra etapa`}
                      value={c.etapa}
                      onChange={(ev) => onMover(c.id, ev.target.value)}
                    >
                      {ETAPAS.map((x) => (
                        <option key={x.id} value={x.id}>
                          Mover a: {x.nombre}
                        </option>
                      ))}
                    </select>
                  </li>
                ))}
                {items.length === 0 && <li className="kvacio">Sin clientes</li>}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
