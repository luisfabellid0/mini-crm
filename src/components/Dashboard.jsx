import { ETAPAS, ETAPAS_ABIERTAS, tipoPorId } from '../lib/constants.js';
import { estadoVencimiento, formatearMonto, tiempoRelativo, diasHasta } from '../lib/utils.js';

const suma = (lista) => lista.reduce((s, c) => s + (Number(c.valor) || 0), 0);

export default function Dashboard({ clientes, interacciones, tareas, onAbrirCliente, onIrA, onNuevo }) {
  if (clientes.length === 0) {
    return (
      <section className="card vacio-grande">
        <h2>Bienvenido a tu Mini CRM</h2>
        <p className="nota">Aún no tienes clientes. Agrega el primero y empieza a seguir tus ventas.</p>
        <button type="button" className="primario" onClick={onNuevo}>
          + Agregar mi primer cliente
        </button>
      </section>
    );
  }

  const nombrePorId = Object.fromEntries(clientes.map((c) => [c.id, c]));
  const abiertos = clientes.filter((c) => ETAPAS_ABIERTAS.includes(c.etapa));
  const ganados = clientes.filter((c) => c.etapa === 'ganado');
  const perdidos = clientes.filter((c) => c.etapa === 'perdido');
  const cerrados = ganados.length + perdidos.length;
  const tasa = cerrados ? Math.round((ganados.length / cerrados) * 100) : null;

  const maxCantidad = Math.max(1, ...ETAPAS.map((e) => clientes.filter((c) => c.etapa === e.id).length));
  const embudo = ETAPAS.map((e) => {
    const lista = clientes.filter((c) => c.etapa === e.id);
    return { ...e, cantidad: lista.length, valor: suma(lista), ancho: (lista.length / maxCantidad) * 100 };
  });

  const pendientes = tareas
    .filter((t) => !t.hecha)
    .sort((a, b) => {
      const da = diasHasta(a.vence);
      const db = diasHasta(b.vence);
      if (da === null && db === null) return 0;
      if (da === null) return 1;
      if (db === null) return -1;
      return da - db;
    })
    .slice(0, 5);

  const actividad = [...interacciones].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 6);

  return (
    <>
      <section className="tiles" aria-label="Resumen">
        <div className="card tile">
          <span className="tile-label">Clientes</span>
          <strong className="tile-valor">{clientes.length}</strong>
          <span className="tile-nota">{abiertos.length} en proceso</span>
        </div>
        <div className="card tile">
          <span className="tile-label">En el pipeline</span>
          <strong className="tile-valor">{formatearMonto(suma(abiertos))}</strong>
          <span className="tile-nota">Oportunidades abiertas</span>
        </div>
        <div className="card tile">
          <span className="tile-label">Ganado</span>
          <strong className="tile-valor">{formatearMonto(suma(ganados))}</strong>
          <span className="tile-nota">{ganados.length} cierres</span>
        </div>
        <div className="card tile">
          <span className="tile-label">Tasa de cierre</span>
          <strong className="tile-valor">{tasa === null ? '—' : `${tasa}%`}</strong>
          <span className="tile-nota">
            {cerrados ? `${ganados.length} de ${cerrados} cerrados` : 'Aún sin cierres'}
          </span>
        </div>
      </section>

      <div className="grid-2">
        <section className="card">
          <h2>Embudo de ventas</h2>
          <ul className="embudo">
            {embudo.map((f) => (
              <li key={f.id} title={`${f.nombre}: ${f.cantidad} clientes · ${formatearMonto(f.valor)}`}>
                <span className="e-nombre">{f.nombre}</span>
                <div className="e-pista">
                  <div className="e-relleno" style={{ width: `${f.ancho}%`, background: f.color }} />
                </div>
                <span className="e-valor">
                  {f.cantidad} · {formatearMonto(f.valor)}
                </span>
              </li>
            ))}
          </ul>
          <button type="button" className="enlace" onClick={() => onIrA('pipeline')}>
            Ver pipeline →
          </button>
        </section>

        <section className="card">
          <h2>Tareas pendientes</h2>
          {pendientes.length === 0 ? (
            <p className="vacio">Todo al día. No tienes tareas pendientes.</p>
          ) : (
            <ul className="tareas">
              {pendientes.map((t) => {
                const estado = estadoVencimiento(t.vence, t.hecha);
                const cliente = t.cliente_id ? nombrePorId[t.cliente_id] : null;
                return (
                  <li key={t.id} className="tarea">
                    <div className="tarea-titulo">
                      {t.titulo}
                      {cliente && (
                        <button type="button" className="enlace chico" onClick={() => onAbrirCliente(cliente.id)}>
                          {cliente.empresa || cliente.nombre}
                        </button>
                      )}
                    </div>
                    <span className={`estado-venc ${estado.clase}`}>{estado.texto}</span>
                  </li>
                );
              })}
            </ul>
          )}
          <button type="button" className="enlace" onClick={() => onIrA('tareas')}>
            Ver todas las tareas →
          </button>
        </section>
      </div>

      <section className="card">
        <h2>Actividad reciente</h2>
        {actividad.length === 0 ? (
          <p className="vacio">Cuando registres llamadas, correos o reuniones, aparecerán aquí.</p>
        ) : (
          <ul className="timeline">
            {actividad.map((i) => {
              const t = tipoPorId(i.tipo);
              const c = nombrePorId[i.cliente_id];
              return (
                <li key={i.id}>
                  <span className="tl-icono" aria-hidden="true">
                    {t.icono}
                  </span>
                  <div className="tl-texto">
                    <span>
                      {c && (
                        <button type="button" className="enlace chico" onClick={() => onAbrirCliente(c.id)}>
                          {c.nombre}
                        </button>
                      )}{' '}
                      {i.detalle}
                    </span>
                    <span className="mov-meta">
                      {t.nombre} · {tiempoRelativo(i.created_at)}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
