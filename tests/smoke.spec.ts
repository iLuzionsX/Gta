import { test, expect } from '@playwright/test';

test('boots the city and starts the night run', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('CITY AFTER DARK')).toBeVisible();
  await expect(page.getByRole('button', { name: /take the run/i })).toBeVisible();
  await page.getByRole('button', { name: /take the run/i }).click();
  await expect(page.getByText('Find the package')).toBeVisible();
  await expect(page.getByRole('button', { name: /sprint/i })).toBeVisible();
});
