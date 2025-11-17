import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

const config = {
    plugins: [react()],
    build: {
        outDir: '../backend/src/main/resources/static',
        emptyOutDir: true
    },
    server: {
        port: 3000,
        proxy: {
            '/api': 'http://localhost:8080'
        }
    },
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./setupTests.ts",
    }
}

export default defineConfig(config)
