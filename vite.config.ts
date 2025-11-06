import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
<<<<<<< HEAD
=======
    include: ['socket.io-client'],
    esbuildOptions: {
      // Enable esbuild's CSP-compliant behavior
      // This helps with the 'eval' warning in development
      define: {
        global: 'globalThis',
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    headers: {
      'Content-Security-Policy': "script-src 'self' 'unsafe-eval' 'unsafe-inline'"
    },
    hmr: {
      clientPort: 5173,
      overlay: true,
    },
    watch: {
      usePolling: true,
    },
  },
  preview: {
    port: 5173,
    strictPort: true,
>>>>>>> 7dbaff3 (Resolve merge conflicts)
  },
});
