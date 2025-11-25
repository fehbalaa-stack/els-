import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // EZ A SOR KAPCSOLJA BE A WIFI MEGOSZTÁST!
    port: 5173  // Ez pedig fixálja a portot
  }
})