import { etapaPorId } from '../lib/constants.js';

// Etiqueta de etapa: siempre lleva texto, el color es un refuerzo (no el único canal)
export default function Badge({ etapa }) {
  const e = etapaPorId(etapa);
  return (
    <span className="badge" style={{ '--c': e.color }}>
      {e.nombre}
    </span>
  );
}
