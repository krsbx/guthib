/// <reference types="vitest" />
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  base: process.env.NODE_ENV === 'production' ? '/guthib/' : '/',
  test: {
    globals: true,
    coverage: {
      reporter: ['html-spa'],
      include: ['src/**/*.{js,ts}'],
      // Ignore the index.ts file since we don't want to hit github api and got a rate limit
      exclude: ['src/**/*.d.ts', 'src/utils/github/index.ts'],
    },
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
});
