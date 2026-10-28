import { etapaPorId } from './constants.js';

const formatoMoneda = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
  maximumFractionDigits: 0,
});

export const formatearMonto = (n) => formatoMoneda.format(Number(n) || 0);

export function nuevoId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function aISO(d) {
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}

export const hoyISO = () => aISO(new Date());

export function sumarDias(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return aISO(d);
}

// Días desde hoy hasta una fecha YYYY-MM-DD (negativo = ya pasó). null si no hay fecha.
export function diasHasta(fecha) {
  if (!fecha) return null;
  const [y, m, d] = fecha.split('-').map(Number);
  const objetivo = new Date(y, m - 1, d);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return Math.round((objetivo - hoy) / 86400000);
}

export function formatearFecha(fecha) {
  if (!fecha) return '';
  const [y, m, d] = fecha.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' });
}

// Texto + clase para el vencimiento de una tarea (nunca solo color)
export function estadoVencimiento(vence, hecha) {
  if (hecha) return { texto: 'Hecha', clase: 'ok' };
  const dias = diasHasta(vence);
  if (dias === null) return { texto: 'Sin fecha', clase: 'neutro' };
  if (dias < 0) return { texto: `Vencida hace ${-dias} d`, clase: 'vencida' };
  if (dias === 0) return { texto: 'Hoy', clase: 'hoy' };
  if (dias === 1) return { texto: 'Mañana', clase: 'proxima' };
  return { texto: `En ${dias} días`, clase: 'proxima' };
}

export function tiempoRelativo(iso) {
  const min = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (min < 1) return 'ahora';
  if (min < 60) return `hace ${min} min`;
  const horas = Math.floor(min / 60);
  if (horas < 24) return `hace ${horas} h`;
  const dias = Math.floor(horas / 24);
  if (dias < 30) return `hace ${dias} d`;
  return new Date(iso).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function iniciales(nombre = '') {
  const partes = nombre.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return '?';
  return (partes[0][0] + (partes.length > 1 ? partes[partes.length - 1][0] : '')).toUpperCase();
}

export function enlaceWhatsApp(telefono = '') {
  let digitos = telefono.replace(/\D/g, '');
  if (digitos.length === 9) digitos = `51${digitos}`; // celular peruano sin prefijo
  return digitos.length >= 8 ? `https://wa.me/${digitos}` : null;
}

export function exportarCSV(clientes) {
  const escapar = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const filas = [
    ['Nombre', 'Empresa', 'Email', 'Teléfono', 'Etapa', 'Valor (PEN)', 'Origen', 'Notas', 'Creado'],
    ...clientes.map((c) => [
      c.nombre,
      c.empresa,
      c.email,
      c.telefono,
      etapaPorId(c.etapa).nombre,
      Number(c.valor || 0).toFixed(2),
      c.origen,
      c.notas,
      (c.created_at || '').slice(0, 10),
    ]),
  ];
  const csv = '﻿' + filas.map((f) => f.map(escapar).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `clientes-${hoyISO()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
