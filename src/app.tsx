import { Routes } from './routes.tsx';

export const App = () => {
  return (
    <div className="govuk-width-container">
      <cps-global-header></cps-global-header>
      <Routes />
    </div>
  );
};
