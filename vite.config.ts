import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative Asset-Pfade, damit der Build sowohl unter github.io/<repo>/
  // als auch lokal per `npm run preview` funktioniert.
  base: './',
})
