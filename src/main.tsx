window.addEventListener('error', (e) => {
  if (e.message && e.message.includes('Loading chunk failed')) {
    if (confirm('New version available. Updating Tamil Buddy...')) {
      window.location.reload();
    }
  }
});

import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('New version available. Update Tamil Buddy?')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('App ready to work offline');
  },
});

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
