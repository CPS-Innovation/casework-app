import '@ministryofjustice/frontend/moj/all.scss';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { App } from './app';

import './App.scss';

const documentRoot = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(documentRoot);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
