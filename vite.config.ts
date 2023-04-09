import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: ['src/cli.ts', 'src/lib.ts'],
      formats: ['cjs', 'es'],
    },
    rollupOptions: {
      external: ['vite', 'cac'],
    },
  },
  plugins: [dts()],
});
