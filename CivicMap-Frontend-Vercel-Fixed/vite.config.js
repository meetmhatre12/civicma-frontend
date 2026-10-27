import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    proxy: { '/api': 'http://localhost:5000', '/uploads': 'http://localhost:5000' }
  },
  build: { outDir: 'build', emptyOutDir: true, sourcemap: false },
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } }
});
