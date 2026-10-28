import { useState } from 'react';
import Modal from './Modal.jsx';
import { ETAPAS, ORIGENES } from '../lib/constants.js';

export default function ClienteForm({ cliente, onGuardar, onCerrar }) {
  const [f, setF] = useState({
    nombre: cliente?.nombre ?? '',
    empresa: cliente?.empresa ?? '',
    email: cliente?.email ?? '',
    telefono: cliente?.telefono ?? '',
    etapa: cliente?.etapa ?? 'lead',
    valor: cliente?.valor ?? '',
    origen: cliente?.origen ?? ORIGENES[0],
    notas: cliente?.notas ?? '',
  });
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  const set = (campo) => (e) => setF((prev) => ({ ...prev, [campo]: e.target.value }));

  async function enviar(e) {
    e.preventDefault();
    if (!f.nombre.trim()) {
      setError('El nombre es obligatorio.');
      return;
    }
    if (f.email.trim() && !/^\S+@\S+\.\S+$/.test(f.email.trim())) {
      setError('El correo no parece válido.');
      return;
    }
    const valor = f.valor === '' ? 0 : parseFloat(String(f.valor).replace(',', '.'));
    if (!Number.isFinite(valor) || valor < 0) {
      setError('El valor estimado debe ser un número igual o mayor a 0.');
      return;
    }
    setError('');
    setGuardando(true);
    await onGuardar({
      nombre: f.nombre.trim(),
      empresa: f.empresa.trim(),
      email: f.email.trim(),
      telefono: f.telefono.trim(),
      etapa: f.etapa,
      valor,
      origen: f.origen,
      notas: f.notas.trim(),
    });
    setGuardando(false);
  }

  return (
    <Modal titulo={cliente ? 'Editar cliente' : 'Nuevo cliente'} onClose={onCerrar}>
      <form className="formulario" onSubmit={enviar} noValidate>
        <div className="fila-2">
          <label>
            Nombre *
            <input type="text" value={f.nombre} onChange={set('nombre')} autoFocus />
          </label>
          <label>
            Empresa / negocio
            <input type="text" value={f.empresa} onChange={set('empresa')} />
          </label>
        </div>
        <div className="fila-2">
          <label>
            Correo
            <input type="email" value={f.email} onChange={set('email')} />
          </label>
          <label>
            Teléfono / WhatsApp
            <input type="tel" value={f.telefono} onChange={set('telefono')} />
          </label>
        </div>
        <div className="fila-3">
          <label>
            Etapa
            <select value={f.etapa} onChange={set('etapa')}>
              {ETAPAS.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nombre}
                </option>
              ))}
            </select>
          </label>
          <label>
            Valor estimado (S/)
            <input type="text" inputMode="decimal" placeholder="0" value={f.valor} onChange={set('valor')} />
          </label>
          <label>
            Origen
            <select value={f.origen} onChange={set('origen')}>
              {ORIGENES.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label>
          Notas
          <textarea rows={3} value={f.notas} onChange={set('notas')} />
        </label>

        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}

        <div className="acciones-form">
          <button type="button" onClick={onCerrar}>
            Cancelar
          </button>
          <button type="submit" className="primario" disabled={guardando}>
            {guardando ? 'Guardando…' : cliente ? 'Guardar cambios' : 'Crear cliente'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
