# 🤝 Mini CRM

CRM sencillo para negocios pequeños: lleva tus clientes, mueve oportunidades por un **pipeline de ventas**, registra llamadas y reuniones, y no se te olvide ningún seguimiento gracias a las **tareas con vencimiento**.

Hecho con **React + Vite + Supabase** (login, base de datos PostgreSQL y seguridad por usuario). Incluye un **modo demo** que funciona sin backend, ideal para publicar una demo en vivo.

<!-- Agrega aquí una captura: ![Panel del Mini CRM](docs/captura-panel.png) -->

## ✨ Funcionalidades

- **Panel**: clientes, valor del pipeline, ventas ganadas, tasa de cierre, embudo por etapa, tareas pendientes y actividad reciente.
- **Clientes**: alta, edición y borrado; búsqueda por nombre/empresa/correo, filtro por etapa, orden y exportación a CSV.
- **Pipeline (kanban)**: Lead → Contactado → Negociación → Ganado / Perdido. Se arrastra con el mouse o se mueve con un selector (teclado y celular).
- **Seguimiento**: historial de notas, llamadas, correos y reuniones por cliente.
- **Tareas**: con fecha de vencimiento, estados (vencida / hoy / próximas) y vínculo a un cliente.
- **Contacto rápido**: enlaces directos a correo, llamada y WhatsApp.
- **Seguridad real**: cada usuario solo ve sus datos (Row Level Security en Supabase).
- **Modo demo** sin configurar nada, con datos de ejemplo ficticios.
- Tema claro/oscuro automático, responsive y accesible (etiquetas, foco visible, estados con texto y no solo color).

## 🛠️ Tecnologías

[React 18](https://react.dev/) · [Vite](https://vitejs.dev/) · [Supabase](https://supabase.com/) (Auth + Postgres + RLS) · CSS puro con variables

## 🚀 Correrlo en tu computadora

Necesitas [Node.js](https://nodejs.org/) 18 o superior.

```bash
git clone https://github.com/luisfabellid0/mini-crm.git
cd mini-crm
npm install
npm run dev
```

Abre `http://localhost:5173`. Sin configurar nada arranca en **modo demo**, con datos de ejemplo guardados en tu navegador.

## 🗄️ Conectarlo a Supabase (login + datos reales)

1. Crea un proyecto gratis en [supabase.com](https://supabase.com).
2. En **SQL Editor → New query**, pega todo el contenido de [`supabase/schema.sql`](supabase/schema.sql) y pulsa **Run**. Crea las tablas `clientes`, `interacciones` y `tareas` con sus políticas de seguridad.
3. En **Project Settings → API** copia la *Project URL* y la clave *anon public*.
4. Copia `.env.example` como `.env` y completa:
   ```
   VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-anon-public-key
   ```
5. Reinicia `npm run dev`. Ahora la app pide registro/inicio de sesión.

> **Tip para pruebas:** en Supabase → *Authentication → Providers → Email* puedes desactivar "Confirm email" para entrar sin confirmar el correo mientras desarrollas.

> **Nunca subas tu `.env`** (ya está en `.gitignore`). La clave `anon` es pública por diseño; lo que protege los datos son las políticas RLS del esquema. **Jamás uses la clave `service_role` en el frontend.**

## 🌐 Publicarlo gratis (GitHub Pages)

1. Sube el proyecto a un repositorio `mini-crm` en tu GitHub (rama `main`).
2. En el repo: **Settings → Pages → Source: GitHub Actions**.
3. El workflow `.github/workflows/deploy.yml` publica en cada `git push`.

Por defecto la versión publicada corre en **modo demo**, perfecta como vitrina de portafolio. Para que la versión publicada use tu Supabase, agrega en **Settings → Secrets and variables → Actions → New repository secret**:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

y vuelve a ejecutar el workflow (**Actions → Run workflow**).

Alternativa: Vercel o Netlify, con *Build command* `npm run build`, *Output directory* `dist` y las dos variables de entorno.

## 📁 Estructura

```
src/
├── App.jsx                   # Sesión, navegación y composición
├── hooks/useCrm.js           # Carga de datos y acciones (crear, editar, mover…)
├── data/
│   ├── index.js              # Elige Supabase o demo según las variables de entorno
│   ├── supabaseApi.js        # Backend real (Auth + Postgres)
│   ├── localApi.js           # Modo demo (localStorage)
│   └── seed.js               # Datos de ejemplo ficticios
├── lib/                      # Constantes, utilidades, cliente de Supabase
└── components/               # Dashboard, Clientes, Pipeline, Tareas, formularios…
supabase/schema.sql           # Tablas + Row Level Security
```

## 🗺️ Ideas para seguir mejorándolo

- Editar y reasignar notas; adjuntar archivos (Supabase Storage).
- Recordatorios por correo o WhatsApp de tareas vencidas.
- Varios usuarios por negocio (equipos y roles).
- Importar clientes desde CSV.
- Campos personalizados y etiquetas.
- Reportes por mes y por origen de cliente.

## 📄 Licencia

MIT. Mira el archivo [LICENSE](LICENSE).
