import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    // The @ghar-doc/shared workspace package is a pnpm symlink whose real
    // path lives outside node_modules, so Rollup's default commonjs
    // interop (which only looks inside node_modules) misses it.
    commonjsOptions: {
      include: [/packages\/shared/, /node_modules/],
    },
  },
  optimizeDeps: {
    // Same reason as above, but for the dev server: esbuild's dep
    // pre-bundling (which does the CJS -> ESM named-export interop) only
    // auto-detects packages inside node_modules by default.
    include: ['@ghar-doc/shared'],
  },
});
