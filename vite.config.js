import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        proxy: {
            // API는 항상 /api로 호출 (배포/개발 통일)
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },

            // 라우저 네비게이션으로 직접 호출되는 경로들(소셜 로그인/SSE 등)
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
});
