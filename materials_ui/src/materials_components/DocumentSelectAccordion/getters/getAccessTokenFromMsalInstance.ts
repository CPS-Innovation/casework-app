import { IPublicClientApplication } from '@azure/msal-browser';

export const getAccessTokenFromMsalInstance = async (
  msalInstance: IPublicClientApplication,
  scopes?: string[]
) => {
  const tokenResponse = await msalInstance.acquireTokenSilent({
    scopes: scopes || [import.meta.env.VITE_POLARIS_GATEWAY_SCOPE],
    account: msalInstance.getActiveAccount()!
  });

  return tokenResponse.accessToken;
};
