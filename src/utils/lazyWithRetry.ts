import React from 'react';

/**
 * Wraps React.lazy with automatic retry and page reload recovery when a Vite chunk mismatch occurs after a new deploy.
 * Prevents "error loading dynamically imported module" / MIME type text/html block when old cached HTML references deleted chunk hashes.
 */
export function lazyWithRetry<T extends React.ComponentType<any>>(
  importer: () => Promise<{ default: T }>,
  chunkName?: string
): React.LazyExoticComponent<T> {
  return React.lazy(async () => {
    const pageHasRefreshedKey = `lazy_retry_${chunkName || 'chunk'}`;
    try {
      const component = await importer();
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.removeItem(pageHasRefreshedKey);
      }
      return component;
    } catch (error: any) {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const hasRefreshed = window.sessionStorage.getItem(pageHasRefreshedKey);
        const isMimeOrModuleError =
          error?.message?.includes('Failed to fetch dynamically imported module') ||
          error?.message?.includes('error loading dynamically imported module') ||
          error?.message?.includes('text/html') ||
          error?.message?.includes('MIME') ||
          error?.name === 'TypeError';

        if (!hasRefreshed && isMimeOrModuleError) {
          console.warn(`[lazyWithRetry] Chunk load error detected for ${chunkName || 'module'}. Refreshing page to fetch latest build...`);
          window.sessionStorage.setItem(pageHasRefreshedKey, 'true');
          window.location.reload();
          // Return a never-resolving promise while reloading to prevent React error boundary flash
          return new Promise<{ default: T }>(() => {});
        }
      }
      throw error;
    }
  });
}
