import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import TrafficApp from './TrafficApp';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TrafficApp />
  </StrictMode>,
);
