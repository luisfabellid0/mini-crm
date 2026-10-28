import { useEffect, useRef } from 'react';

// Ventana modal centrada o panel lateral. Se cierra con Escape o haciendo clic fuera.
export default function Modal({ titulo, subtitulo, onClose, lateral = false, children }) {
  const caja = useRef(null);
  const cerrar = useRef(onClose);
  cerrar.current = onClose;

  useEffect(() => {
    const anterior = document.activeElement;
    const alTeclear = (e) => {
      if (e.key === 'Escape') cerrar.current();
    };
    document.addEventListener('keydown', alTeclear);
    document.body.style.overflow = 'hidden';
    caja.current?.focus();
    return () => {
      document.removeEventListener('keydown', alTeclear);
      document.body.style.overflow = '';
      anterior?.focus?.();
    };
  }, []);

  return (
    <div
      className={`overlay ${lateral ? 'lateral' : ''}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        tabIndex={-1}
        ref={caja}
      >
        <header className="modal-cab">
          <div>
            <h2>{titulo}</h2>
            {subtitulo && <p className="sub">{subtitulo}</p>}
          </div>
          <button type="button" className="icono" aria-label="Cerrar" onClick={onClose}>
            ✕
          </button>
        </header>
        <div className="modal-cuerpo">{children}</div>
      </div>
    </div>
  );
}
