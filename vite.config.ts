import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

function apiDevPlugin(): Plugin {
  return {
    name: 'api-dev-server',
    configureServer(server) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (req.url?.startsWith('/api/reset-password') && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              req.body = body ? JSON.parse(body) : {};
              res.status = (statusCode: number) => {
                res.statusCode = statusCode;
                return res;
              };
              res.json = (data: any) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
                return res;
              };
              const { default: handler } = await import('./api/reset-password.js');
              await handler(req, res);
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err?.message || 'Internal dev error' }));
            }
          });
          return;
        }
        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  define: {
    __BUILD_VERSION__: JSON.stringify(new Date().toISOString().slice(0, 10).replace(/-/g, '')),
  },
  server: {
    port: 5180,
    strictPort: true,
  },
  plugins: [react(), apiDevPlugin()],
  assetsInclude: ['**/*.wasm'],
  worker: {
    format: 'es',
  },
  optimizeDeps: {
    exclude: [
      '@huggingface/transformers',
      '@jsquash/jpeg',
      '@jsquash/oxipng',
      '@jsquash/webp',
      '@jsquash/avif',
      '@jsquash/jxl',
      '@jsquash/resize',
      'heic-to',
      'esm-potrace-wasm',
      '@colorhythm/libraw-wasm',
    ],
    include: ['upng-js', 'utif', 'ag-psd', 'imagetracerjs'],
  },
  build: {
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            if (id.includes('lucide-react') || id.includes('framer-motion')) {
              return 'ui-vendor';
            }
            if (id.includes('i18next')) {
              return 'i18n-vendor';
            }
            if (id.includes('firebase')) {
              return 'firebase-vendor';
            }
            if (id.includes('@huggingface/transformers')) {
              return 'ai-vendor';
            }
          }
        }
      }
    }
  }
})
