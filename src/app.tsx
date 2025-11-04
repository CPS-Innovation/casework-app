import { useMsal } from '@azure/msal-react';
import { useEffect } from 'react';
import { RouteChangeListener } from './components';
import { POLARIS_GATEWAY_SCOPE } from './constants/url';
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

  const account = instance.getActiveAccount() || accounts[0];

  if (!account) {
    return <p>Redirecting to login...</p>;
  }

  // set up cpsContext for interaction with cps web components
  if (typeof window !== 'undefined') {
    window.cpsContext = {
      acquireAccessToken: async () => {
        try {
          const accessTokenResponse = await instance.acquireTokenSilent({
            scopes: [POLARIS_GATEWAY_SCOPE],
            account: accounts[0]
          });

          return accessTokenResponse.accessToken;
        } catch {
          console.error('There was an error getting the access token');
        }
      },
      init: () => {
        window.addEventListener('unauthorised', (event) => {
          const customEvent = event as CustomEvent<{ error?: string }>;
          console.error(customEvent.detail);
        });
      }
    };
  }

  return (
    <>
      <div className="govuk-width-container">
        <cps-global-header></cps-global-header>
        <RouteChangeListener />
        <Routes />
      </div>

      <footer className="govuk-footer"></footer>
    </>
  );
};
