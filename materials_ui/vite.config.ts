/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import viteCompression from 'vite-plugin-compression';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: '/materials-ui/',
    define: {
      __MAINTENANCE_MODE__: JSON.stringify(env.VITE_MAINTENANCE_MODE === 'true')
    },
    plugins: [
      svgr(),
      react(),
      viteCompression({ algorithm: 'brotliCompress' }),
      {
        name: 'inject-external-script',
        transformIndexHtml(html) {
          if (env.VITE_GLOBAL_SCRIPT_URL) {
            console.log(env.VITE_GLOBAL_SCRIPT_URL);
            return html.replace(
              '</head>',
              `<script src="${env.VITE_GLOBAL_SCRIPT_URL}" type="module"></script>\n</head>`
            );
          }
          return html;
        }
      }
    ],
    resolve: {
      alias: [{ find: 'node_modules', replacement: '/node_modules' }],
      dedupe: ['react', 'react-dom']
    },
    server: { port: 3000 },
    build: {
      outDir: 'build',
      target: 'esnext',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('msal-browser') || id.includes('msal-react')) {
                return 'vendor-auth'; // Microsoft Authentication chunk
              }
              if (id.includes('axios') || id.includes('swr')) {
                return 'vendor-fetch'; // Networking libraries
              }
              if (
                id.includes('govuk-frontend') ||
                id.includes('@ministryofjustice/frontend') ||
                id.includes('home-office-kit')
              ) {
                return 'vendor-govuk'; // UK government UI libraries
              }
              if (
                id.includes('@microsoft/applicationinsights-web') ||
                id.includes('@microsoft/applicationinsights-react-js')
              ) {
                return 'vendor-monitoring'; // Microsoft Application Insights
              }
              return 'vendor'; // Default fallback for other dependencies
            }
          }
        }
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern',
          silenceDeprecations: [
            'legacy-js-api',
            'import',
            'slash-div',
            'global-builtin',
            'function-units'
          ],
          quietDeps: true
        }
      }
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts',
      silent: true,
      exclude: ['e2e', 'node_modules']
    }
  };
});
