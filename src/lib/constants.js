// Etapas del pipeline (orden fijo). Cada etapa conserva siempre su color.
export const ETAPAS = [
  { id: 'lead', nombre: 'Lead', color: 'var(--cat-1)' },
  { id: 'contactado', nombre: 'Contactado', color: 'var(--cat-7)' },
  { id: 'negociacion', nombre: 'Negociación', color: 'var(--cat-4)' },
  { id: 'ganado', nombre: 'Ganado', color: 'var(--cat-3)' },
  { id: 'perdido', nombre: 'Perdido', color: 'var(--cat-8)' },
];

export const ETAPAS_ABIERTAS = ['lead', 'contactado', 'negociacion'];

export const ORIGENES = ['Referido', 'Redes sociales', 'Sitio web', 'Evento', 'Otro'];

export const TIPOS = [
  { id: 'nota', nombre: 'Nota', icono: '📝' },
  { id: 'llamada', nombre: 'Llamada', icono: '📞' },
  { id: 'email', nombre: 'Email', icono: '✉️' },
  { id: 'reunion', nombre: 'Reunión', icono: '🤝' },
];

export const etapaPorId = (id) => ETAPAS.find((e) => e.id === id) || ETAPAS[0];
export const tipoPorId = (id) => TIPOS.find((t) => t.id === id) || TIPOS[0];
