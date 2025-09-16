import { Routes } from './routes';

export const App = () => {
  return (
    <div className="govuk-width-container">
      <cps-global-header></cps-global-header>
      <Routes />
    </div>
  );
};
