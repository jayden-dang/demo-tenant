import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: './src/index.tsx',
      name: 'DemoTenantMiniapp',
      formats: ['es'],
      fileName: 'bundle',
    },
    rollupOptions: {
      // Externalize React and SDK - provided by sandbox runtime
      external: ['react', 'react-dom', '@klyntlabs/miniapp-sdk'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
    minify: true,
    sourcemap: false,
  },
  server: {
    port: 3002,
    open: true,
  },
});
