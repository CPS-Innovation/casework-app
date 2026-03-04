import { expect, test } from '@playwright/test';
import { mockRoute } from '../helpers';
import { mockPcdCoreResponse } from '../mocks/pcd/mockPcdCore';
import { mockPcdRequestResponse } from '../mocks/pcd/mockPcdRequest';

// cases/2172759/pcds/145739/pcd-request
test.describe('PCD Request Page', () => {
  test('T-001: page loads list of PCD requests as expected', async ({
    page
  }) => {
    mockRoute(page, 'pcds/2167259/pcd-request-core', mockPcdCoreResponse());
    mockRoute(page, '/pcd-request', mockPcdRequestResponse());
    page.goto('./pcd-request/145739');
    await expect(
      page.getByRole('heading', { name: 'Police details' })
    ).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Case outline')).toBeVisible();
    await expect(
      page.getByText(`Supervising officer's comments`)
    ).toBeVisible();
    await expect(page.getByText('Proposed charges')).toBeVisible();
    await expect(page.getByText('Bail details')).toBeVisible();
    await expect(page.getByText('Materials provided')).toBeVisible();
  });

  test('T-002: should navigate to a specific PCD request when a link is clicked', async ({
    page
  }) => {
    mockRoute(page, 'pcds/2167259/pcd-request-core', mockPcdCoreResponse());
    mockRoute(page, '/pcd-request', mockPcdRequestResponse());

    page.goto('./pcd-request/145739');
    await expect(
      page.getByRole('heading', { name: 'Police details' })
    ).toBeVisible({ timeout: 10000 });
    await page.locator(`a:text("01/01/2000")`).click();
    await expect(page.locator('dd').nth(0)).toHaveText(`02/02/2021`);
  });

  test('T-003: should display a message when no PCD requests are available', async ({
    page
  }) => {
    mockRoute(page, 'pcds/2167259/pcd-request-core', []);
    await page.goto('./pcd-request/');
    await page.waitForLoadState('networkidle');
    await expect(
      page.getByText('There are no PCD Requests to show.')
    ).toBeVisible({ timeout: 10000 });
  });
});
