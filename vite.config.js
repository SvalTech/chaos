import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    base: './', // <--- THIS IS THE FIX
    build: {
        outDir: 'docs',
        emptyOutDir: true,
    },
    plugins: [
        VitePWA({
            registerType: 'autoUpdate',
            manifest: false,
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg}']
            }
        })
    ]
});