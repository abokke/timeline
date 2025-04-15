import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  // base: '/timeline/', 
  base: '/', 
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'app/src'),
    },
  },
  server: {
    host: '0.0.0.0', 
    port: 5173,
    strictPort: true
  }
});
