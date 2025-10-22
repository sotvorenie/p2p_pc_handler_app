import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // 🔥 ДОБАВЬ ЭТУ СТРОКУ - ОНА КРИТИЧЕСКИ ВАЖНА!
  base: './',

  server: {
    host: '0.0.0.0',
    port: 3000
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    target: 'es2019'
  }
})