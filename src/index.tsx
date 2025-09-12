import '@ministryofjustice/frontend/moj/all.scss';
import ReactDOM from 'react-dom/client';

const Index = () => {
  return <p>Hello world</p>;
};

const documentRoot = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(documentRoot);
root.render(<Index />);
