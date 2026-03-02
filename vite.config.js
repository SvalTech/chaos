import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    build: {
        outDir: 'docs',
        emptyOutDir: true,
    },
    plugins: [
        VitePWA({
            registerType: 'autoUpdate', // This automatically updates the SW when you push new code
            manifest: false, // Set to false because you already have a custom manifest.json in the public folder
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg}'] // Tells the SW to cache all these file types
            }
        })
    ]
});