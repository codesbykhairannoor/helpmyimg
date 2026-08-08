import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Force disable BFCache to prevent WebAssembly memory stacking across pages
window.addEventListener('unload', () => {});
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    window.location.reload();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
