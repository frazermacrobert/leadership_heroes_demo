import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Uses BASE_PATH from GitHub Actions; '/' when running locally
export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_PATH || '/',
})
