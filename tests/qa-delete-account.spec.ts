import { test, expect } from '@playwright/test';

test.describe('QA Suite: Delete Account Security & Confirmation', () => {
  test.beforeEach(async ({ page }) => {
    // Inject mock user with password provider
    await page.addInitScript(() => {
      (window as any).__TEST_AUTH_USER__ = {
        user: {
          uid: 'test-delete-uid',
          email: 'qa-delete@helpmyimg.com',
          emailVerified: true,
          displayName: 'Tester Delete',
          providerData: [{ providerId: 'password' }],
        },
        profile: {
          uid: 'test-delete-uid',
          email: 'qa-delete@helpmyimg.com',
          displayName: 'Tester Delete',
          plan: 'free',
          subscriptionStatus: 'active',
          emailVerified: true,
          app: 'helpmyimg',
        },
      };
    });

    await page.goto('/');
  });

  test('Delete modal requires password and typing DELETE before button is enabled', async ({ page }) => {
    const avatarBtn = page.getByRole('button', { name: /User Account/i });
    await avatarBtn.click();

    const deleteBtn = page.getByRole('button', { name: /Delete Account|Hapus Akun/i });
    await deleteBtn.click();

    // Verify modal is open
    const modal = page.locator('div.fixed.inset-0.z-50');
    await expect(modal).toBeVisible();

    // Verify 4-website unified account warning is displayed
    const warning = modal.locator('text=4 Connected Websites');
    await expect(warning).toBeVisible();

    // Find the confirm delete button (should initially be disabled)
    const confirmDeleteBtn = modal.getByRole('button', { name: /Delete Account|Hapus Akun/i });
    await expect(confirmDeleteBtn).toBeDisabled();

    // Fill only DELETE text - button should STILL be disabled (password is missing)
    const confirmInput = modal.locator('input[placeholder="DELETE"]');
    await confirmInput.fill('DELETE');
    await expect(confirmDeleteBtn).toBeDisabled();

    // Fill password - now button should become ENABLED
    const passwordInput = modal.locator('input[type="password"]');
    await passwordInput.fill('secret123');
    await expect(confirmDeleteBtn).toBeEnabled();

    // Cancel modal
    const cancelBtn = modal.getByRole('button', { name: /Cancel|Batal/i });
    await cancelBtn.click();
    await expect(modal).not.toBeVisible();
  });
});
