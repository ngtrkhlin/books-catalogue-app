import { defineConfig } from 'vite';

export default defineConfig({
  // Vitest configuration — runs unit tests with a simulated browser environment
  test: {
    environment: 'jsdom',
  },

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/index-[hash].js',
        chunkFileNames: 'assets/index-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
});
