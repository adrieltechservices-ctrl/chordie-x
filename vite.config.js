import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev
export default defineConfig({
  base: './', // Native relative asset pathing
  plugins: [
    react(),
    tailwindcss(),
  ],
  experimental: {
    // Zero-dependency fix for Electron's local file protocol (CORS / file:// bypass)
    renderBuiltUrl(filename) {
      return './' + filename;
    }
  }
})
