import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import App from './App.tsx'

// Warm up the Render backend on app load.
const API_BASE = import.meta.env.VITE_API_BASE_URL;
if (API_BASE) {
  fetch(`${API_BASE}/health`).catch(() => {
    // Intentionally silent — best-effort warm-up only.
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
