import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { getLanguageFromUrl, initI18n } from './i18n/i18n.ts'

// Restore cleanly only if restored from BFCache after heavy WASM execution
window.addEventListener('pageshow', (event) => {
  if (event.persisted && (window as any).__helpmyimgWasmActive) {
    window.location.reload();
  }
});

const activeLang = getLanguageFromUrl();

initI18n(activeLang).then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}).catch((err) => {
  console.error("Critical error: Failed to initialize translations", err);
  // Emergency fallback mount to prevent white screen
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
});

