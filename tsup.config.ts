// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/yayfetch.ts'],
  format: ['esm'],
  splitting: false,
  sourcemap: false,
  clean: true,
  cjsInterop: true,
  minify: true,
});
