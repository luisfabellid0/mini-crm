import { supabaseConfigurado } from '../lib/supabase.js';
import { localApi } from './localApi.js';
import { supabaseApi } from './supabaseApi.js';

// Con variables de Supabase → backend real con login. Sin ellas → modo demo local.
export const api = supabaseConfigurado ? supabaseApi : localApi;
