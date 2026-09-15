import { defineConfig } from 'vite';
import path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, 'src/popup/popup.html'),
        background: path.resolve(__dirname, 'src/background/service-worker.ts')
      },
      output: {
        // JS files ka naam/location decide karta hai
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'background') {
            return 'background/service-worker.js';
          }
          if (chunkInfo.name === 'popup') {
            return 'assets/popup.js'; // popup.ts -> assets/popup.js
          }
          return 'assets/[name].js';
        },
        chunkFileNames: 'assets/[name].js',
        // CSS aur baaki static assets yahan handle hote hain
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'assets/popup.css'; // popup.css -> assets/popup.css
          }
          return 'assets/[name][extname]';
        }
      },
      external: ['imap', 'mailparser', 'path', 'fs']
    }
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'public/icons/*',
          dest: 'icons'
        },
        {
          src: 'manifest.json',
          dest: '.'
        }
      ]
    })
  ]
});