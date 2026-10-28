import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Sin variables de entorno la app funciona en modo demo (datos locales en el navegador)
export const supabaseConfigurado = Boolean(url && key);
export const supabase = supabaseConfigurado ? createClient(url, key) : null;
