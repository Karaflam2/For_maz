import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['pipiest-mayson-factually.ngrok-free.dev'],
  },
})
