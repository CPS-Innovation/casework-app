import '@ministryofjustice/frontend/moj/all.scss';
import ReactDOM from 'react-dom/client';
import './App.scss';

const Index = () => {
  return (
    <div className="govuk-width-container">
      <cps-global-header></cps-global-header>
      <p className="govuk-body">Hello world</p>
    </div>
  );
};

const documentRoot = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(documentRoot);
root.render(<Index />);
