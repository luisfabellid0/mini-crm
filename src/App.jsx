import { useEffect, useMemo, useState } from 'react';
import { api } from './data/index.js';
import { useCrm } from './hooks/useCrm.js';
import { diasHasta } from './lib/utils.js';
import Auth from './components/Auth.jsx';
import Dashboard from './components/Dashboard.jsx';
import Clientes from './components/Clientes.jsx';
import Pipeline from './components/Pipeline.jsx';
import Tareas from './components/Tareas.jsx';
import ClienteForm from './components/ClienteForm.jsx';
import ClienteDetalle from './components/ClienteDetalle.jsx';

const VISTAS = [
  ['panel', 'Panel'],
  ['clientes', 'Clientes'],
  ['pipeline', 'Pipeline'],
  ['tareas', 'Tareas'],
];

export default function App() {
  const [usuario, setUsuario] = useState(undefined); // undefined = comprobando sesión

  useEffect(() => {
    let vivo = true;
    api.auth.getUser().then((u) => vivo && setUsuario(u));
    const quitar = api.auth.onChange((u) => setUsuario(u));
    return () => {
      vivo = false;
      quitar();
    };
  }, []);

  if (usuario === undefined) return <div className="centro">Cargando…</div>;
  if (!usuario && api.requiereLogin) return <Auth />;
  return <Crm usuario={usuario} />;
}

function Crm({ usuario }) {
  const { datos, cargando, error, limpiarError, acciones } = useCrm(usuario?.id ?? usuario?.email ?? 'anon');
  const [vista, setVista] = useState('panel');
  const [abiertoId, setAbiertoId] = useState(null);
  const [formulario, setFormulario] = useState(null); // null | { cliente?: obj }

  const cliente = useMemo(() => datos.clientes.find((c) => c.id === abiertoId) || null, [datos.clientes, abiertoId]);
  const vencidas = datos.tareas.filter((t) => !t.hecha && diasHasta(t.vence) !== null && diasHasta(t.vence) < 0).length;

  async function guardarCliente(campos) {
    const editando = formulario?.cliente;
    const r = editando ? await acciones.actualizarCliente(editando.id, campos) : await acciones.crearCliente(campos);
    if (r) {
      setFormulario(null);
      if (!editando) setAbiertoId(r.id);
    }
  }

  async function reiniciarDemo() {
    if (window.confirm('¿Restablecer los datos de ejemplo? Se perderán los cambios que hiciste en la demo.')) {
      await api.reiniciar();
      window.location.reload();
    }
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-in">
          <div className="marca">🤝 Mini CRM</div>
          <nav className="nav" aria-label="Secciones">
            {VISTAS.map(([id, nombre]) => (
              <button key={id} type="button" aria-current={vista === id ? 'page' : undefined} onClick={() => setVista(id)}>
                {nombre}
                {id === 'tareas' && vencidas > 0 && (
                  <span className="contador" title={`${vencidas} tareas vencidas`}>
                    {vencidas}
                    <span className="solo-lector"> tareas vencidas</span>
                  </span>
                )}
              </button>
            ))}
          </nav>
          <div className="cuenta">
            {api.modo === 'supabase' ? (
              <>
                <span className="cuenta-email">{usuario?.email}</span>
                <button type="button" onClick={() => api.auth.signOut()}>
                  Salir
                </button>
              </>
            ) : (
              <button type="button" className="enlace chico" onClick={reiniciarDemo}>
                Restablecer demo
              </button>
            )}
            <button type="button" className="primario" onClick={() => setFormulario({})}>
              + Cliente
            </button>
          </div>
        </div>
      </header>

      {api.modo === 'demo' && (
        <div className="banner-demo">
          Modo demo: los datos son de ejemplo y se guardan solo en tu navegador.
        </div>
      )}

      <main className="contenido">
        {error && (
          <div className="banner-error" role="alert">
            <span>{error}</span>
            <button type="button" className="icono" aria-label="Cerrar aviso" onClick={limpiarError}>
              ✕
            </button>
          </div>
        )}

        {cargando ? (
          <p className="vacio">Cargando tus datos…</p>
        ) : (
          <>
            {vista === 'panel' && (
              <Dashboard
                clientes={datos.clientes}
                interacciones={datos.interacciones}
                tareas={datos.tareas}
                onAbrirCliente={setAbiertoId}
                onIrA={setVista}
                onNuevo={() => setFormulario({})}
              />
            )}
            {vista === 'clientes' && (
              <Clientes clientes={datos.clientes} onAbrir={setAbiertoId} onNuevo={() => setFormulario({})} />
            )}
            {vista === 'pipeline' && (
              <Pipeline clientes={datos.clientes} onAbrir={setAbiertoId} onMover={acciones.cambiarEtapa} />
            )}
            {vista === 'tareas' && (
              <Tareas tareas={datos.tareas} clientes={datos.clientes} acciones={acciones} onAbrirCliente={setAbiertoId} />
            )}
          </>
        )}
      </main>

      {cliente && (
        <ClienteDetalle
          cliente={cliente}
          interacciones={datos.interacciones.filter((i) => i.cliente_id === cliente.id)}
          tareas={datos.tareas.filter((t) => t.cliente_id === cliente.id)}
          acciones={acciones}
          onEditar={() => setFormulario({ cliente })}
          onCerrar={() => setAbiertoId(null)}
        />
      )}

      {formulario && (
        <ClienteForm cliente={formulario.cliente} onGuardar={guardarCliente} onCerrar={() => setFormulario(null)} />
      )}

      <footer className="pie">
        {api.modo === 'supabase'
          ? 'Tus datos están protegidos: cada cuenta solo ve su propia información.'
          : 'Proyecto de portafolio · React + Supabase'}
      </footer>
    </div>
  );
}
