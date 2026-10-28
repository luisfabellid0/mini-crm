import { sumarDias } from '../lib/utils.js';

const hace = (dias, horas = 0) => new Date(Date.now() - dias * 86400000 - horas * 3600000).toISOString();

// Datos de ejemplo 100% ficticios para el modo demo
export function semilla() {
  const clientes = [
    { id: 'c1', nombre: 'Marco Quispe', empresa: 'Canchas Los Pinos', email: 'marco@example.com', telefono: '987654321', etapa: 'negociacion', valor: 3200, origen: 'Referido', notas: 'Quiere un sistema de reservas para 4 canchas. Decide a fin de mes.', created_at: hace(14) },
    { id: 'c2', nombre: 'Lucía Paredes', empresa: 'Clínica Dental Sonríe', email: 'lucia@example.com', telefono: '912345678', etapa: 'contactado', valor: 1800, origen: 'Sitio web', notas: 'Pidió una landing con agenda de citas.', created_at: hace(9) },
    { id: 'c3', nombre: 'Jorge Valdivia', empresa: 'Academia Cima', email: 'jorge@example.com', telefono: '956781234', etapa: 'lead', valor: 900, origen: 'Redes sociales', notas: '', created_at: hace(3) },
    { id: 'c4', nombre: 'Rosa Mendoza', empresa: 'Restaurante Sabor Sureño', email: 'rosa@example.com', telefono: '934567812', etapa: 'ganado', valor: 2400, origen: 'Evento', notas: 'Cerrado: carta digital + pedidos por WhatsApp.', created_at: hace(30) },
    { id: 'c5', nombre: 'Carlos Huamán', empresa: 'Gimnasio Titán', email: 'carlos@example.com', telefono: '945612378', etapa: 'negociacion', valor: 4100, origen: 'Referido', notas: 'Control de membresías y asistencia.', created_at: hace(20) },
    { id: 'c6', nombre: 'Andrea Salas', empresa: 'Boutique Luna', email: 'andrea@example.com', telefono: '923456781', etapa: 'lead', valor: 700, origen: 'Redes sociales', notas: '', created_at: hace(2) },
    { id: 'c7', nombre: 'Pedro Condori', empresa: 'Ferretería El Maestro', email: 'pedro@example.com', telefono: '978123456', etapa: 'perdido', valor: 1500, origen: 'Sitio web', notas: 'Eligió una solución más barata.', created_at: hace(40) },
    { id: 'c8', nombre: 'Silvia Ramos', empresa: 'Colegio Horizonte', email: 'silvia@example.com', telefono: '965432187', etapa: 'contactado', valor: 5200, origen: 'Evento', notas: 'Reunión con la dirección pendiente.', created_at: hace(6) },
    { id: 'c9', nombre: 'Daniel Flores', empresa: 'Panadería La Espiga', email: 'daniel@example.com', telefono: '918273645', etapa: 'ganado', valor: 1200, origen: 'Referido', notas: '', created_at: hace(25) },
  ];

  const interacciones = [
    { id: 'i1', cliente_id: 'c1', tipo: 'reunion', detalle: 'Visita a las canchas. Mostré la demo de reservas, le gustó el calendario.', created_at: hace(3) },
    { id: 'i2', cliente_id: 'c1', tipo: 'llamada', detalle: 'Primera llamada: necesita pagos por Yape y horarios por cancha.', created_at: hace(10) },
    { id: 'i3', cliente_id: 'c2', tipo: 'email', detalle: 'Envié la propuesta con precios y plazos.', created_at: hace(2) },
    { id: 'i4', cliente_id: 'c5', tipo: 'llamada', detalle: 'Pidió rebaja si contrata también el mantenimiento mensual.', created_at: hace(1, 4) },
    { id: 'i5', cliente_id: 'c8', tipo: 'nota', detalle: 'El contacto es la subdirectora; la decisión final es de la dirección.', created_at: hace(4) },
    { id: 'i6', cliente_id: 'c4', tipo: 'reunion', detalle: 'Entrega y capacitación al personal. Quedó muy contenta.', created_at: hace(12) },
    { id: 'i7', cliente_id: 'c3', tipo: 'nota', detalle: 'Escribió por Instagram preguntando precios.', created_at: hace(3, 2) },
  ];

  const tareas = [
    { id: 't1', cliente_id: 'c2', titulo: 'Llamar para resolver dudas de la propuesta', vence: sumarDias(-2), hecha: false, created_at: hace(5) },
    { id: 't2', cliente_id: 'c1', titulo: 'Enviar contrato de reservas', vence: sumarDias(0), hecha: false, created_at: hace(3) },
    { id: 't3', cliente_id: 'c5', titulo: 'Preparar descuento por mantenimiento', vence: sumarDias(1), hecha: false, created_at: hace(1) },
    { id: 't4', cliente_id: 'c8', titulo: 'Agendar reunión con la dirección', vence: sumarDias(3), hecha: false, created_at: hace(4) },
    { id: 't5', cliente_id: 'c3', titulo: 'Responder consulta de precios', vence: sumarDias(0), hecha: false, created_at: hace(3) },
    { id: 't6', cliente_id: null, titulo: 'Actualizar portafolio con los últimos proyectos', vence: sumarDias(7), hecha: false, created_at: hace(6) },
    { id: 't7', cliente_id: 'c4', titulo: 'Pedir reseña y recomendación', vence: sumarDias(-5), hecha: true, created_at: hace(8) },
  ];

  return { clientes, interacciones, tareas };
}
