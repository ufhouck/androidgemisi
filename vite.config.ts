import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          worker: ['web-worker', 'compromise'],
          ui: ['lucide-react', 'clsx', 'tailwind-merge'],
          data: ['idb-keyval', 'node-cache']
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: true
  },
  worker: {
    format: 'es',
    plugins: () => [react()]
  },
  server: {
    hmr: {
      overlay: false
    },
    watch: {
      usePolling: true
    }
  }
});