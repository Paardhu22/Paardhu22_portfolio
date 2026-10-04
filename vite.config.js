import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  publicDir: false,
  build: { outDir: 'dist' },
  // Always revalidate the shell when a tab is reopened after rebuilding.
  preview: { headers: { 'Cache-Control': 'no-cache' } },
});
