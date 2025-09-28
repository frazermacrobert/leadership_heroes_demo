import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Hard-code your Pages base path to remove any ambiguity
export default defineConfig({
  plugins: [react()],
  base: '/leadership_heroes_demo/',  // <-- exact repo name with slashes
})
