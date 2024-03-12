import { defineConfig } from 'vite';

export default defineConfig({
  // Other Vite config options...
  plugins: [],
  optimizeDeps: {
  },
  server: {
  },
  build: {
    outDir: 'dist/client',
  },
  test: {
    exclude: ['__test__/e2e/**/*.spec.ts']
  }
});
