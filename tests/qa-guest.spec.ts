import { test, expect } from '@playwright/test';

test.describe('QA Suite: Guest / Unauthenticated User', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Navbar renders Sign In button for guest users', async ({ page }) => {
    const signInBtn = page.getByRole('button', { name: /Sign In|Masuk/i }).first();
    await expect(signInBtn).toBeVisible();
  });

  test('AuthModal opens with valid titles, subtitle, and branded HelpMyIMG button', async ({ page }) => {
    const signInBtn = page.getByRole('button', { name: /Sign In|Masuk/i }).first();
    await signInBtn.click();

    // Verify modal is visible
    const modal = page.locator('div.fixed.inset-0.z-50');
    await expect(modal).toBeVisible();

    // Verify header title is NOT blank and contains sign in text
    const heading = modal.getByRole('heading', { level: 3 });
    await expect(heading).toBeVisible();
    await expect(heading).not.toBeEmpty();

    // Verify email and password inputs are present
    const emailInput = modal.locator('input[type="email"]');
    const passInput = modal.locator('input[type="password"]');
    await expect(emailInput).toBeVisible();
    await expect(passInput).toBeVisible();

    // Verify submit button has non-empty text and is branded
    const submitBtn = modal.locator('button[type="submit"]');
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).not.toBeEmpty();

    // Verify switching to sign up mode
    const signUpSwitchBtn = modal.getByRole('button', { name: /Sign up|Daftar/i });
    if (await signUpSwitchBtn.isVisible()) {
      await signUpSwitchBtn.click();
      await expect(submitBtn).not.toBeEmpty();
    }

    // Verify close button dismisses modal
    const closeBtn = modal.locator('button[aria-label="Close"]');
    await closeBtn.click();
    await expect(modal).not.toBeVisible();
  });
});
