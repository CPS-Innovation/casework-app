import { useMsal } from '@azure/msal-react';
import { useEffect } from 'react';
import { loginRequest } from './msalInstance';
import { Routes } from './routes';

export const App = () => {
  const { instance, accounts } = useMsal();

  useEffect(() => {
    instance.handleRedirectPromise().then((response) => {
      if (response && response.account) {
        instance.setActiveAccount(response.account);
      }

      const activeAccount = instance.getActiveAccount();
      if (!activeAccount && accounts.length === 0) {
        instance.loginRedirect(loginRequest).catch(console.error);
      }
    });
  }, [instance, accounts]);

  useEffect(() => {
    const handleUnauthorisedEvent = (event: Event) => {
      console.dir(event);
    };

    window.addEventListener('cwm-unauthorised', handleUnauthorisedEvent);

    return () => {
      window.removeEventListener('cwm-unauthorised', handleUnauthorisedEvent);
    };
  }, []);

  const account = instance.getActiveAccount() || accounts[0];

  if (!account) {
    return <p>Redirecting to login...</p>;
  }

  return (
    <>
      <div className="govuk-width-container">
        <cps-global-header></cps-global-header>
        <case-info-summary
          caseId="2155068"
          urn="06SC1234571"
        ></case-info-summary>
        {/*<button onClick={() => instance.logoutRedirect()}>Logout</button>*/}
        <Routes />
      </div>

      <footer className="govuk-footer"></footer>
    </>
  );
};
