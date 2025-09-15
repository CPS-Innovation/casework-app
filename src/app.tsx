import { Routes } from './routes.tsx';

import { CaseInfo } from './components';

export const App = () => {
  return (
    <div className="govuk-width-container">
      <cps-global-header></cps-global-header>
      <CaseInfo />
      <Routes />
    </div>
  );
};
