import { test, expect } from '@playwright/test';

test('page loads with four category tabs', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'チキン' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'バーガー' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'サイド' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'ドリンク' })).toBeVisible();
});

test('selected and total sections visible on load with placeholder', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('選択中')).toBeVisible();
  await expect(page.getByText('合計')).toBeVisible();
  await expect(page.getByText('品目を選択してください').first()).toBeVisible();
});

test('select item → placeholder disappears, item appears in list', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('add').first().click();
  await expect(page.getByText('品目を選択してください').first()).not.toBeVisible();
  await expect(page.getByText('選択中')).toBeVisible();
  await expect(page.getByText('合計')).toBeVisible();
});

test('deselect item → sections stay visible, placeholder returns', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('add').first().click();
  await page.getByLabel('remove').click();
  await expect(page.getByText('選択中')).toBeVisible();
  await expect(page.getByText('合計')).toBeVisible();
  await expect(page.getByText('品目を選択してください').first()).toBeVisible();
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
  await expect(page.getByText('合計')).toBeVisible();
});

test('announce bar shows data source link and date in Japanese', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'KFC Japan 公式栄養成分表' })).toBeVisible();
  await expect(page.getByText(/掲載データ更新日/)).toBeVisible();
});

test('announce bar switches to English with language toggle', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'English' }).click();
  await expect(page.getByRole('link', { name: 'KFC Japan official nutrition table' })).toBeVisible();
  await expect(page.getByText(/Data updated/)).toBeVisible();
});

test('fat label shows 脂 in Japanese and F in English', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText(/脂 \d/).first()).toBeVisible();
  await page.getByRole('button', { name: 'English' }).click();
  await expect(page.getByText(/F \d/).first()).toBeVisible();
});

async function getLayoutBoxes(page: import('@playwright/test').Page) {
  const menu = await page.getByTestId('menu-section').boundingBox();
  const selection = await page.getByTestId('selection-section').boundingBox();
  expect(menu).not.toBeNull();
  expect(selection).not.toBeNull();
  return { menu: menu!, selection: selection! };
}

for (const [device, viewport] of [
  ['desktop', { width: 1280, height: 800 }],
  ['tablet', { width: 768, height: 1024 }],
] as const) {
  test.describe(`${device} layout`, () => {
    test.use({ viewport });

    test('two columns: menu on the left, selection + total on the right', async ({ page }) => {
      await page.goto('/');
      const { menu, selection } = await getLayoutBoxes(page);
      expect(menu.x + menu.width).toBeLessThanOrEqual(selection.x);
      expect(menu.y).toBeLessThan(selection.y + selection.height);
      expect(selection.y).toBeLessThan(menu.y + menu.height);
    });
  });
}

test.describe('mobile layout', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('single column: selection, total, then menu', async ({ page }) => {
    await page.goto('/');
    const { menu, selection } = await getLayoutBoxes(page);
    expect(selection.y + selection.height).toBeLessThanOrEqual(menu.y);

    const selectedHeading = await page.getByText('選択中').boundingBox();
    const totalRow = await page.getByText('合計').boundingBox();
    expect(selectedHeading).not.toBeNull();
    expect(totalRow).not.toBeNull();
    expect(selectedHeading!.y).toBeLessThan(totalRow!.y);
    expect(totalRow!.y + totalRow!.height).toBeLessThanOrEqual(menu.y);
  });
});
