// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// For a project site at https://frazermacrobert.github.io/leadership_heroes_demo/
export default defineConfig({
  plugins: [react()],
  base: '/leadership_heroes_demo/',  // keep this!
})
