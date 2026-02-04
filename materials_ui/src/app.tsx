import { useMsal } from '@azure/msal-react';
import { useEffect } from 'react';
import { RouteChangeListener } from './components';
import { POLARIS_GATEWAY_SCOPE } from './constants/url';
import { useBanner } from './hooks';
import { loginRequest } from './msalInstance';
import { Routes } from './routes';

export const App = () => {
  const { instance, accounts } = useMsal();
  const { setBanner } = useBanner();

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

  window.acquireAccessToken = async () =>
    await instance
      .acquireTokenSilent({
        scopes: [POLARIS_GATEWAY_SCOPE],
        account: accounts[0]
      })
      .then((accessTokenResponse) => accessTokenResponse.accessToken)
      .catch(() => null);

  window.addEventListener('cwm-unauthorised', (event) => {
    const customEvent = event as CustomEvent<{ error?: string }>;

    setBanner({ type: 'error', header: customEvent.detail.error || '' });
    console.log(customEvent.detail);
  });

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
