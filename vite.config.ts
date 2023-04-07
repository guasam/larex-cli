import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: ['src/cli.js', 'src/lib.ts'],
      formats: ['cjs', 'es'],
    },
  },
  plugins: [dts()],
});
