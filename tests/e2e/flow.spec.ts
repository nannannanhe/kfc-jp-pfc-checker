import { test, expect } from '@playwright/test';

test('page loads with four category tabs', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'チキン' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'バーガー' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'サイド' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'ドリンク' })).toBeVisible();
});

test('select item → appears in selected list → total appears', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('add').first().click();
  await expect(page.getByText('選択中')).toBeVisible();
  await expect(page.getByText('合計')).toBeVisible();
});

test('deselect item → removed from list → total hidden', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('add').first().click();
  await expect(page.getByText('選択中')).toBeVisible();
  await page.getByLabel('remove').click();
  await expect(page.getByText('選択中')).not.toBeVisible();
  await expect(page.getByText('合計')).not.toBeVisible();
});

test('drink category shows "-" for fiber (null value)', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'ドリンク' }).click();
  const fibers = page.getByText(/繊 -g/);
  await expect(fibers.first()).toBeVisible();
});

test('language toggle switches labels to English', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'English' }).click();
  await expect(page.getByRole('button', { name: 'Chicken' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Burger' })).toBeVisible();
  await expect(page.getByRole('button', { name: '日本語' })).toBeVisible();
});

test('quantity increases and total updates', async ({ page }) => {
  await page.goto('/');
  const addBtn = page.getByLabel('add').first();
  await addBtn.click();
  await addBtn.click();
  await expect(page.getByText('× 2')).toBeVisible();
  const totalSection = page.getByText('合計');
  await expect(totalSection).toBeVisible();
});
