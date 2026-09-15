import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    // The sandbox preview is served from an arbitrary *.e2b.app host.
    allowedHosts: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    allowedHosts: true,
  },
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        // Keep the framework and the animation library in stable long-cache
        // chunks so page chunks stay small.
        manualChunks(id: string) {
          if (id.includes('node_modules/framer-motion')) return 'motion';
          if (
            id.includes('node_modules/react-router') ||
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/scheduler')
          ) {
            return 'react';
          }
          return undefined;
        },
      },
    },
  },
})
