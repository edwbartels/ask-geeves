import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    open: true,
<<<<<<< HEAD
    proxy: {
      "/session": process.env.API_URL,
    },
=======
    proxy:{
      '/session': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure:false
      }
    }
>>>>>>> migrations
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/setupTests",
    mockReset: true,
  },
}))
