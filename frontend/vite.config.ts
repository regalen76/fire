import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@design': fileURLToPath(new URL('../Design', import.meta.url)) },
    // Design/ has no node_modules; make its `import React from 'react'` use ours.
    dedupe: ['react', 'react-dom'],
  },
  server: {
    fs: { allow: ['..'] },
    proxy: { '/api': 'http://localhost:3000' },
  },
});
