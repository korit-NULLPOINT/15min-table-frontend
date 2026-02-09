import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        proxy: {
            '/user': {
                target: 'http://localhost:8080',
                changeOrigin: true,
            },
            '/ai': {
                target: 'http://localhost:8080',
                changeOrigin: true,
            },
            '/mail': {
                target: 'http://localhost:8080',
                changeOrigin: true,
            },
            '/oauth2': {
                target: 'http://localhost:8080',
                changeOrigin: true,
            },
            '/login': {
                target: 'http://localhost:8080',
                changeOrigin: true,
            },
            '/board': {
                target: 'http://localhost:8080',
                changeOrigin: true,
            },
            '/comment': {
                target: 'http://localhost:8080',
                changeOrigin: true,
            },
            '/bookmark': {
                target: 'http://localhost:8080',
                changeOrigin: true,
            },
            '/rating': {
                target: 'http://localhost:8080',
                changeOrigin: true,
            },
            '/recipe-hashtag': {
                target: 'http://localhost:8080',
                changeOrigin: true,
            },
            '/follow': {
                target: 'http://localhost:8080',
                changeOrigin: true,
            },
            // ✅ SSE 포함 알림
            '/notifications': {
                target: 'http://localhost:8080',
                changeOrigin: true,
            },

            '/users/profile': {
                target: 'http://localhost:8080',
                changeOrigin: true,
            },
            '/recipes': {
                target: 'http://localhost:8080',
                changeOrigin: true,
            },
            '/posts': {
                target: 'http://localhost:8080',
                changeOrigin: true,
            },
            // Admin API (API 요청만 프록시)
            '/admin/manage': {
                target: 'http://localhost:8080',
                changeOrigin: true,
            },
        },
    },
});
