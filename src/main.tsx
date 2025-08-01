import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import useServiceWorker from './hooks/useServiceWorker';
import { analytics } from './firebase';
import { logEvent } from 'firebase/analytics';

// Initialize Firebase Analytics (optional, if you want to log a page view on app load)
// if (analytics) logEvent(analytics, 'page_view');

window.addEventListener('appinstalled', () => {
  if (analytics) logEvent(analytics, 'pwa_installed');
  console.log('PWA was installed');
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);