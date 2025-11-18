import { Page } from '@playwright/test';

export async function mockRoute(page: Page, endpoint: string, data?: unknown) {
  console.log(`Mocking route for endpoint: ${endpoint}`);
  await page.route(
    `**/api/urns/${process.env.E2E_URN}/cases/${process.env.E2E_CASE}/${endpoint}`,
    // https://polaris-dev-cmsproxy.azurewebsites.net/api/urns/16123630825/cases/2167259/case-materials
    (route) =>
      route.fulfill({
        contentType: 'application/json',
        status: 200,
        body: JSON.stringify(data)
      })
  );
  console.log(
    `Route mocked successfully for endpoint: ${endpoint} + data: ${data}`
  );
}

export async function mockServerError(page: Page, endpoint: string) {
  await page.route(`./${endpoint}`, (route) => {
    route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Unauthorized' })
    });
  });
}

export async function clickTab(page: Page, name: string) {
  await page.getByRole('tab', { name: name }).click();
}

export async function navigateToPage(page: Page, name: string) {
  await page.goto('/');
  await clickTab(page, name);
}
