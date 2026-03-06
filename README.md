# casework-app
Merging Housekeeping and Casework app

## Materials UI – Local Development Guide

This guide explains how to run `materials_ui` locally, including required environment variables and how to run E2E tests.

**Prerequisites:**
- Node.js 18+.


Create a `.env` file inside the `materials_ui` directory with the following variables:

```bash
VITE_MSAL_CLIENT_ID=
VITE_MSAL_TENANT_ID=
VITE_MSAL_REDIRECT_URI=http://localhost:3000/materials-ui/
VITE_POLARIS_GATEWAY_URL=https://polaris-dev-notprod.cps.gov.uk
VITE_POLARIS_GATEWAY_SCOPE=https://CPSGOVUK.onmicrosoft.com/fa-polaris-dev-gateway/user_impersonation

VITE_GLOBAL_SCRIPT_URL=https://sacpsglobalcomponents.blob.core.windows.net/dev/cps-global-components.js
VITE_BASE_URL=/materials-ui
```

**Install dependencies**

```bash
cd materials_ui
npm install
```

**Running the application locally**

1. Start the development server:

```bash
npm run dev
```

2. To obtain the cookie/token required for local  access, open this URL in the same browser:

```text
https://polaris-dev-notprod.cps.gov.uk/api/dev-login-full-cookie/
```

3. After logging in, open a new tab (same browser) and navigate to the local app route to view a specific case:

```text
http://localhost:3000/materials-ui/case-search
```

4. Enter a URN to access the app e.g 16123630825

You should now be able to access the app locally using the authentication cookie set by the dev-login endpoint.

**Running E2E tests**

All tests live in the `materials_ui` directory and must be run from there.

**Environment variables for tests**
Add the following to your `.env` file for E2E test execution:

```bash
# E2E Tests Credentials and Configuration
VITE_E2E=true

E2E_TEST_MS_USERNAME=
E2E_TEST_MS_PASSWORD=
E2E_CIN3_USERNAME=
E2E_CIN3_PASSWORD=
E2E_CMS_COOKIE_URL=https://polaris-dev-notprod.cps.gov.uk/api/dev-login-full-cookie/
E2E_URN=16123630825
E2E_CASE=2167259
```

**Run E2E tests**
- Headless mode:

```bash
npm run e2e
```

- Playwright UI mode (interactive):

```bash
npm run e2e:ui
```
