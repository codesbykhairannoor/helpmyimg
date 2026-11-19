import { test, expect } from '@playwright/test';

test.describe('QA Suite: Free Starter User (Unverified & Features)', () => {
  test.beforeEach(async ({ page }) => {
    // Inject mock unverified Free user session before page load
    await page.addInitScript(() => {
      (window as any).__TEST_AUTH_USER__ = {
        user: {
          uid: 'test-free-uid-123',
          email: 'qa-free@helpmyimg.com',
          emailVerified: false,
          displayName: 'Tester Free',
          providerData: [{ providerId: 'password' }],
        },
        profile: {
          uid: 'test-free-uid-123',
          email: 'qa-free@helpmyimg.com',
          displayName: 'Tester Free',
          plan: 'free',
          subscriptionStatus: 'active',
          emailVerified: false,
          app: 'helpmyimg',
        },
      };
    });

    await page.goto('/');
  });

  test('Navbar shows user avatar with Unverified indicator', async ({ page }) => {
    // Check that user avatar button is rendered
    const avatarBtn = page.getByRole('button', { name: /User Account/i });
    await expect(avatarBtn).toBeVisible();

    // Check that unverified pulsing dot exists
    const pulsingDot = avatarBtn.locator('span.animate-pulse');
    await expect(pulsingDot).toBeVisible();
  });

  test('User dropdown menu displays Unverified badge, Verify button, and Free Starter status', async ({ page }) => {
    const avatarBtn = page.getByRole('button', { name: /User Account/i });
    await avatarBtn.click();

    // Verify unverified badge text
    const unverifiedBadge = page.locator('text=Unverified');
    await expect(unverifiedBadge).toBeVisible();

    // Verify branded Verify button
    const verifyBtn = page.getByRole('button', { name: /Verify|Verifikasi/i });
    await expect(verifyBtn).toBeVisible();

    // Verify Free Starter status indicator
    const freeStarterStatus = page.locator('text=Free Starter');
    await expect(freeStarterStatus).toBeVisible();

    // Verify Upgrade to PRO option is present
    const upgradeLink = page.getByRole('link', { name: /Upgrade/i });
    await expect(upgradeLink).toBeVisible();

    // Verify Change Password button exists
    const changePassBtn = page.getByRole('button', { name: /Change Password|Ganti Kata Sandi/i });
    await expect(changePassBtn).toBeVisible();
  });

  test('Change Password modal opens with HelpMyIMG brand colors and dual views', async ({ page }) => {
    const avatarBtn = page.getByRole('button', { name: /User Account/i });
    await avatarBtn.click();

    const changePassBtn = page.getByRole('button', { name: /Change Password|Ganti Kata Sandi/i });
    await changePassBtn.click();

    // Modal should be visible
    const modal = page.locator('div.fixed.inset-0.z-50');
    await expect(modal).toBeVisible();

    // Header has Change Password title
    const title = modal.getByRole('heading', { name: /Change Password/i });
    await expect(title).toBeVisible();

    // View A: Has input for current password, new password, confirm password
    const currentPassInput = modal.locator('input[type="password"]').first();
    await expect(currentPassInput).toBeVisible();

    // Check link to switch to View B (Email reset link)
    const switchLink = modal.getByRole('button', { name: /Forgot current password|Send reset link/i });
    await expect(switchLink).toBeVisible();
    await switchLink.click();

    // View B: Read-only email field and Send Password Reset Link button
    const emailField = modal.locator('input[type="email"]');
    await expect(emailField).toBeVisible();
    await expect(emailField).toHaveValue('qa-free@helpmyimg.com');

    const sendResetBtn = modal.getByRole('button', { name: /Send Password Reset Link/i });
    await expect(sendResetBtn).toBeVisible();

    // Switch back to View A
    const backLink = modal.getByRole('button', { name: /Know your current password|Update directly/i });
    await expect(backLink).toBeVisible();
    await backLink.click();

    // Close modal
    const closeBtn = modal.locator('button[aria-label="Close"]');
    await closeBtn.click();
    await expect(modal).not.toBeVisible();
  });
});
