import '@ministryofjustice/frontend/moj/all.scss';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { App } from './app';

import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import './App.scss';
import { msalConfig } from './msalInstance';

if (import.meta.env.DEV) {
  const { worker } = await import('./mocks/browser');
  await worker.start();
}

const pca = new PublicClientApplication(msalConfig);

pca.initialize().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <MsalProvider instance={pca}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MsalProvider>
  );
});
