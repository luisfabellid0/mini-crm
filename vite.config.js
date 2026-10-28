import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' permite publicar en GitHub Pages (usuario.github.io/repo) sin tocar nada
export default defineConfig({
  plugins: [react()],
  base: './',
  build: { chunkSizeWarningLimit: 800 },
});
