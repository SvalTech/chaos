import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'path'; // Required to resolve file paths

export default defineConfig({
    base: './', // <--- THIS IS THE FIX
    build: {
        outDir: 'docs',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                // Define all your HTML entry points here
                main: resolve(__dirname, 'index.html'),
                documentation: resolve(__dirname, 'docs.html'),
                pp: resolve(__dirname, 'privacypolicy.html'),
                toc: resolve(__dirname, 'termsandconditions.html'),
                google: resolve(__dirname, 'google0097fb2ca9512ed8.html')
            }
        }
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