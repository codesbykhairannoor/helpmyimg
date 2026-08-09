import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, state } = useLocation();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (state && (state as any).preserveScroll) {
      return;
    }

    // Ekstrak slug tool tanpa bahasa untuk membandingkan
    // Path: /id/compress -> ['id', 'compress']
    const getCorePath = (path: string) => {
      const parts = path.split('/').filter(Boolean);
      // Jika bagian pertama adalah kode bahasa 2 huruf, hilangkan
      if (parts.length > 0 && parts[0].length === 2) {
        return parts.slice(1).join('/');
      }
      return parts.join('/');
    };

    const coreCurrent = getCorePath(pathname);
    const corePrev = getCorePath(prevPathname.current);

    // Jika yang berubah HANYA bahasa (core path sama), JANGAN SCROLL!
    if (coreCurrent === corePrev && pathname !== prevPathname.current) {
      prevPathname.current = pathname;
      return;
    }

    // Jika ganti halaman beneran, scroll ke atas secara INSTAN (tanpa smooth)
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto'
    });
    
    prevPathname.current = pathname;
  }, [pathname, state]);

  return null;
}
