import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <-- Import the Tailwind plugin

// https://vite.dev
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <-- Add it to the plugins execution array
  ],
})
