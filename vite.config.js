// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Use root path for Netlify, subpath for GitHub Pages
const base = process.env.NETLIFY === 'true' ? '/' : '/myport/'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: base,
})
