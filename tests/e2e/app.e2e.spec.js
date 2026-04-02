const { test, expect } = require('@playwright/test');

const { seedConstants } = require('./e2e.constants');

test.describe.configure({ mode: 'serial' });

async function login(page, { email, password }) {
  await page.goto('/login');
  await page.getByPlaceholder('you@university.edu').fill(email);
  await page.locator('input[type="password"]').first().fill(password);
  await page.getByRole('button', { name: 'Login' }).last().click();
  await expect(page).toHaveURL('/');
}

test('user can register, login, create a post, search it, view matches, and update status', async ({
  page,
}) => {
  const email = `student.${Date.now()}@matchproof.test`;
  const title = `E2E Black Wallet ${Date.now()}`;

  await page.goto('/login');
  await page.getByRole('button', { name: 'Register' }).click();
  await page.getByPlaceholder('Jane Doe').fill('E2E Student');
  await page.getByPlaceholder('you@university.edu').fill(email);
  await page.locator('input[type="password"]').last().fill('Password123!');
  await page.getByRole('button', { name: 'Register' }).last().click();

  await expect(page).toHaveURL('/');
  await page.getByRole('button', { name: 'Logout' }).click();
  await expect(page).toHaveURL('/login');

  await login(page, { email, password: 'Password123!' });

  await page.getByRole('button', { name: '+ New Post' }).click();
  await expect(page).toHaveURL('/new');

  await page.getByPlaceholder('e.g. Black leather wallet').fill(title);
  await page.getByLabel('Category').selectOption('Wallet');
  await page.getByPlaceholder('e.g. Library, Floor 2').fill('Central Library');
  await page
    .getByPlaceholder('Describe the item in detail…')
    .fill('Black leather wallet with student card lost near the central library.');
  await page.getByRole('button', { name: 'Save Post' }).click();

  await expect(page.getByRole('heading', { name: title })).toBeVisible();
  await expect(page.getByText('AI Possible Matches')).toBeVisible();
  await expect(page.getByText(seedConstants.seededMatchTitle)).toBeVisible();

  await page.getByRole('button', { name: '← Back to Listings' }).click();
  await expect(page).toHaveURL('/');

  await page.getByPlaceholder('keywords…').fill(title);
  await page.getByRole('button', { name: 'Find' }).click();
  await expect(page.getByText(title)).toBeVisible();

  await page.getByText(title).click();
  await expect(page).toHaveURL(/\/items\/\d+$/);

  await page.getByRole('button', { name: 'Mark as Claimed' }).click();
  await expect(page.getByText('claimed', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Mark as Resolved' }).click();
  await expect(page.getByText('resolved', { exact: true })).toBeVisible();
});

test('admin can remove a seeded post from the moderation panel', async ({ page }) => {
  await login(page, {
    email: seedConstants.adminEmail,
    password: seedConstants.adminPassword,
  });

  await page.getByRole('link', { name: 'Admin' }).click();
  await expect(page).toHaveURL('/admin');
  await expect(page.getByText(seedConstants.moderationTargetTitle)).toBeVisible();

  const targetCard = page
    .locator('[data-testid^="moderation-card-"]')
    .filter({ hasText: seedConstants.moderationTargetTitle })
    .first();

  await targetCard.getByTestId(/remove-item-/).click();
  await page
    .getByPlaceholder('e.g. Duplicate post, inappropriate content…')
    .fill('duplicate listing');
  await page.getByRole('button', { name: 'Remove' }).last().click();

  await expect(page.getByText(seedConstants.moderationTargetTitle)).toHaveCount(0);
});
