import { test, expect } from '@playwright/test';

test.describe('QA Suite: PRO Member User', () => {
  test.beforeEach(async ({ page }) => {
    // Inject mock verified PRO user session
    await page.addInitScript(() => {
      (window as any).__TEST_AUTH_USER__ = {
        user: {
          uid: 'test-pro-uid-999',
          email: 'qa-pro@helpmyimg.com',
          emailVerified: true,
          displayName: 'Tester Pro',
          providerData: [{ providerId: 'password' }],
        },
        profile: {
          uid: 'test-pro-uid-999',
          email: 'qa-pro@helpmyimg.com',
          displayName: 'Tester Pro',
          plan: 'pro',
          subscriptionStatus: 'active',
          emailVerified: true,
          app: 'helpmyimg',
        },
      };
    });

    await page.goto('/');
  });

  test('Navbar displays PRO badge next to user profile', async ({ page }) => {
    const avatarBtn = page.getByRole('button', { name: /User Account/i });
    await expect(avatarBtn).toBeVisible();

    // Has PRO badge
    const proBadge = avatarBtn.locator('text=PRO');
    await expect(proBadge).toBeVisible();

    // Does NOT have unverified pulse dot
    const pulsingDot = avatarBtn.locator('span.animate-pulse');
    await expect(pulsingDot).not.toBeVisible();
  });

  test('User dropdown shows PRO Member with Crown and hides Upgrade link', async ({ page }) => {
    const avatarBtn = page.getByRole('button', { name: /User Account/i });
    await avatarBtn.click();

    // Verify PRO Member status
    const proMember = page.getByText('PRO Member', { exact: true });
    await expect(proMember).toBeVisible();

    // Verify Upgrade to PRO is NOT present for existing PRO users
    const upgradeLink = page.getByRole('link', { name: /Upgrade ke PRO|Upgrade to PRO/i });
    await expect(upgradeLink).not.toBeVisible();
  });
});
