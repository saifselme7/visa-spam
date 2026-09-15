import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { assertDemoModeSafety } from '@/config/env';
import App from './App';
import './styles/index.css';

// Fails loudly if demo auth/payments are active in a production build.
assertDemoModeSafety();

const container = document.getElementById('root');
if (!container) throw new Error('Root element #root is missing from index.html.');

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
