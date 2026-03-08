import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        base: env.VITE_APP_BASE_PATH || '/',
        plugins: [react(), tailwindcss()],
        server: {
            proxy: {
                '/api': {
                    target: 'http://localhost:8080',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, ''),
                },
                '/oauth2': {
                    target: 'http://localhost:8080',
                    changeOrigin: true,
                },
                '/login': {
                    target: 'http://localhost:8080',
                    changeOrigin: true,
                },
                '/notifications': {
                    target: 'http://localhost:8080',
                    changeOrigin: true,
                },
            },
        },
    };
});
