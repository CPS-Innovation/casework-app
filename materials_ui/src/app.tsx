import { RouteChangeListener } from './components';
import { Routes } from './routes';

export const App = () => {
  return (
    <>
      <div className="govuk-width-container custom-width-container">
        <cps-global-header></cps-global-header>
        <RouteChangeListener />
        <Routes />
      </div>

      <footer className="govuk-footer"></footer>
    </>
  );
};
