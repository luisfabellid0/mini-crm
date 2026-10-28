import { supabase } from '../lib/supabase.js';

function traducir(mensaje = '') {
  if (/invalid login credentials/i.test(mensaje)) return 'Correo o contraseña incorrectos.';
  if (/already registered/i.test(mensaje)) return 'Ese correo ya está registrado. Inicia sesión.';
  if (/at least \d+ characters/i.test(mensaje)) return 'La contraseña debe tener al menos 6 caracteres.';
  if (/email not confirmed/i.test(mensaje)) return 'Confirma tu correo antes de iniciar sesión.';
  if (/rate limit/i.test(mensaje)) return 'Demasiados intentos. Espera un momento e inténtalo de nuevo.';
  return mensaje || 'Ocurrió un error. Inténtalo de nuevo.';
}

function resultado({ data, error }) {
  if (error) throw new Error(traducir(error.message));
  return data;
}

export const supabaseApi = {
  modo: 'supabase',
  requiereLogin: true,

  auth: {
    async getUser() {
      const { data } = await supabase.auth.getSession();
      return data.session?.user ?? null;
    },
    onChange(callback) {
      const { data } = supabase.auth.onAuthStateChange((_evento, sesion) => callback(sesion?.user ?? null));
      return () => data.subscription.unsubscribe();
    },
    async signIn(email, password) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(traducir(error.message));
    },
    async signUp(email, password) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw new Error(traducir(error.message));
      return { requiereConfirmacion: !data.session };
    },
    async signOut() {
      await supabase.auth.signOut();
    },
  },

  async cargarTodo() {
    const [c, i, t] = await Promise.all([
      supabase.from('clientes').select('*').order('created_at', { ascending: false }),
      supabase.from('interacciones').select('*').order('created_at', { ascending: false }),
      supabase.from('tareas').select('*').order('created_at', { ascending: false }),
    ]);
    return { clientes: resultado(c), interacciones: resultado(i), tareas: resultado(t) };
  },

  clientes: {
    async crear(campos) {
      return resultado(await supabase.from('clientes').insert(campos).select().single());
    },
    async actualizar(id, cambios) {
      return resultado(await supabase.from('clientes').update(cambios).eq('id', id).select().single());
    },
    async eliminar(id) {
      resultado(await supabase.from('clientes').delete().eq('id', id));
    },
  },

  interacciones: {
    async crear(campos) {
      return resultado(await supabase.from('interacciones').insert(campos).select().single());
    },
    async eliminar(id) {
      resultado(await supabase.from('interacciones').delete().eq('id', id));
    },
  },

  tareas: {
    async crear(campos) {
      return resultado(await supabase.from('tareas').insert(campos).select().single());
    },
    async actualizar(id, cambios) {
      return resultado(await supabase.from('tareas').update(cambios).eq('id', id).select().single());
    },
    async eliminar(id) {
      resultado(await supabase.from('tareas').delete().eq('id', id));
    },
  },
};
