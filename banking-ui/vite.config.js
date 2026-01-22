import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  define: {
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify('http://localhost:3001'),
    'import.meta.env.VITE_APP_ENV': JSON.stringify('development'),
    'import.meta.env.VITE_APP_NAME': JSON.stringify('SecureBank'),
  },
  build: {
    // Optimize for production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Generate source maps for better debugging
    sourcemap: false,
    // Optimize chunk size
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
      },
    },
  },
  server: {
    // Configure for development
    host: true,
    port: 5173
  },
  preview: {
    // Configure preview server
    port: 4173,
    host: true,
  },
})
