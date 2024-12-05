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
          worker: ['web-worker', 'compromise']
        },
      },
    },
  },
  worker: {
    format: 'es',
    plugins: () => [react()]
  },
  server: {
    historyApiFallback: true,
  },
});