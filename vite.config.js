import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(async () => {
  let polyfillPlugins = [];

  try {
    const mod = await import('rollup-plugin-node-polyfills');
    polyfillPlugins = [mod.default()];
  } catch {
    polyfillPlugins = [];
  }

  return {
    plugins: [react()],
    resolve: {
      alias: {
        crypto: 'crypto-browserify',
      },
    },
    build: {
      rollupOptions: {
        plugins: polyfillPlugins,
      },
    },
  };
});
