import '@ministryofjustice/frontend/moj/all.scss';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { App } from './app';

import './App.scss';

if (import.meta.env.DEV) {
  const { worker } = await import('./mocks/browser');
  await worker.start();
}

const documentRoot = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(documentRoot);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
