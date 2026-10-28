import { useState } from 'react';
import { api } from '../data/index.js';

export default function Auth() {
  const [modo, setModo] = useState('entrar');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');
  const [cargando, setCargando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    setError('');
    setAviso('');
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Ingresa un correo válido.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setCargando(true);
    try {
      if (modo === 'entrar') {
        await api.auth.signIn(email.trim(), password);
      } else {
        const r = await api.auth.signUp(email.trim(), password);
        if (r.requiereConfirmacion) {
          setAviso('Te enviamos un correo para confirmar tu cuenta. Confírmalo y luego inicia sesión.');
          setModo('entrar');
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="centro">
      <form className="card auth" onSubmit={enviar} noValidate>
        <div className="marca grande">🤝 Mini CRM</div>
        <p className="sub">
          {modo === 'entrar' ? 'Inicia sesión para ver tus clientes.' : 'Crea tu cuenta para empezar.'}
        </p>

        <label>
          Correo
          <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            autoComplete={modo === 'entrar' ? 'current-password' : 'new-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        {aviso && <p className="aviso">{aviso}</p>}

        <button type="submit" className="primario" disabled={cargando}>
          {cargando ? 'Un momento…' : modo === 'entrar' ? 'Entrar' : 'Crear cuenta'}
        </button>

        <button
          type="button"
          className="enlace"
          onClick={() => {
            setModo(modo === 'entrar' ? 'registro' : 'entrar');
            setError('');
            setAviso('');
          }}
        >
          {modo === 'entrar' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
        </button>
      </form>
    </div>
  );
}
