import { test, expect } from '@playwright/test';

// Sample 1x1 transparent PNG buffer for testing uploads
const SAMPLE_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
);

test.describe('QA Suite: PRO Features, Batch Limits & Quotas', () => {
  test('Guest Batch Limit: Uploading > 5 photos triggers Free Trial Batch Gate modal', async ({ page }) => {
    await page.goto('/remove-background');

    const fileInput = page.locator('#workspace input[type="file"]').first();

    // Create 6 files to exceed guest limit of 5
    const files = Array.from({ length: 6 }, (_, i) => ({
      name: `guest_test_${i + 1}.png`,
      mimeType: 'image/png',
      buffer: SAMPLE_PNG,
    }));

    await fileInput.setInputFiles(files);

    // Verify ProGateModal opened with Trial Sign-In batch limit message
    const gateModal = page.locator('div.fixed.inset-0.z-\\[1000\\]');
    await expect(gateModal).toBeVisible();

    const heading = gateModal.getByRole('heading', { level: 3 });
    await expect(heading).toContainText(/Batch|Foto|Photo/i);
  });

  test('Free Member: Single rename is unlocked, but Batch rename (>1 photo) is PRO-locked', async ({ page }) => {
    await page.addInitScript(() => {
      (window as any).__TEST_AUTH_USER__ = {
        user: {
          uid: 'free-batch-tester',
          email: 'free-batch@helpmyimg.com',
          emailVerified: true,
          displayName: 'Free Batch Tester',
          providerData: [{ providerId: 'password' }],
        },
        profile: {
          uid: 'free-batch-tester',
          email: 'free-batch@helpmyimg.com',
          displayName: 'Free Batch Tester',
          plan: 'free',
          subscriptionStatus: 'active',
          emailVerified: true,
          app: 'helpmyimg',
        },
      };
    });

    await page.goto('/remove-background');

    const fileInput = page.locator('#workspace input[type="file"]').first();

    // Upload 2 files (within free limit of 10, but batch mode)
    await fileInput.setInputFiles([
      { name: 'test_a.png', mimeType: 'image/png', buffer: SAMPLE_PNG },
      { name: 'test_b.png', mimeType: 'image/png', buffer: SAMPLE_PNG },
    ]);

    // Open Export Settings accordion
    const settingsBtn = page.getByRole('button', { name: /Export Settings|Pengaturan Ekspor/i });
    await settingsBtn.click();

    // Verify Batch Rename PRO Lock card is visible
    const proLock = page.locator('text=exclusive PRO feature');
    await expect(proLock).toBeVisible();

    // Verify Upgrade PRO button is present on lock card
    const upgradeProBtn = page.getByRole('button', { name: /Upgrade PRO/i }).first();
    await expect(upgradeProBtn).toBeVisible();
  });

  test('Free Member Batch Limit: Uploading > 10 photos triggers PRO Upgrade Gate modal', async ({ page }) => {
    await page.addInitScript(() => {
      (window as any).__TEST_AUTH_USER__ = {
        user: {
          uid: 'free-limit-tester',
          email: 'free-limit@helpmyimg.com',
          emailVerified: true,
          displayName: 'Free Limit Tester',
          providerData: [{ providerId: 'password' }],
        },
        profile: {
          uid: 'free-limit-tester',
          email: 'free-limit@helpmyimg.com',
          displayName: 'Free Limit Tester',
          plan: 'free',
          subscriptionStatus: 'active',
          emailVerified: true,
          app: 'helpmyimg',
        },
      };
    });

    await page.goto('/remove-background');

    const fileInput = page.locator('#workspace input[type="file"]').first();

    // Create 11 files to exceed free limit of 10
    const files = Array.from({ length: 11 }, (_, i) => ({
      name: `overflow_${i + 1}.png`,
      mimeType: 'image/png',
      buffer: SAMPLE_PNG,
    }));

    await fileInput.setInputFiles(files);

    // Verify ProGateModal opened with PRO batch upgrade message (100+ photos)
    const gateModal = page.locator('div.fixed.inset-0.z-\\[1000\\]');
    await expect(gateModal).toBeVisible();

    const heading = gateModal.getByRole('heading', { level: 3 });
    await expect(heading).toContainText(/100|Batch|PRO/i);
  });

  test('PRO Member: Batch rename & Custom ZIP are UNLOCKED, 4K is Unlimited', async ({ page }) => {
    await page.addInitScript(() => {
      (window as any).__TEST_AUTH_USER__ = {
        user: {
          uid: 'pro-full-tester',
          email: 'pro-full@helpmyimg.com',
          emailVerified: true,
          displayName: 'PRO Full Tester',
          providerData: [{ providerId: 'password' }],
        },
        profile: {
          uid: 'pro-full-tester',
          email: 'pro-full@helpmyimg.com',
          displayName: 'PRO Full Tester',
          plan: 'pro',
          subscriptionStatus: 'active',
          emailVerified: true,
          app: 'helpmyimg',
        },
      };
    });

    await page.goto('/remove-background');

    const fileInput = page.locator('#workspace input[type="file"]').first();

    // Upload 3 files
    await fileInput.setInputFiles([
      { name: 'pro_1.png', mimeType: 'image/png', buffer: SAMPLE_PNG },
      { name: 'pro_2.png', mimeType: 'image/png', buffer: SAMPLE_PNG },
      { name: 'pro_3.png', mimeType: 'image/png', buffer: SAMPLE_PNG },
    ]);

    // Open Export Settings
    const settingsBtn = page.getByRole('button', { name: /Export Settings|Pengaturan Ekspor/i });
    await settingsBtn.click();

    // Batch rename input fields should be present and unlocked (one for each file)
    const renameInputs = page.locator('input[placeholder="Name"]');
    await expect(renameInputs).toHaveCount(3);

    // Custom ZIP filename input should be present and editable
    const zipInput = page.locator('input[placeholder*="ZIP"]');
    await expect(zipInput).toBeVisible();
    await zipInput.fill('My_Custom_Batch_Export');
    await expect(zipInput).toHaveValue('My_Custom_Batch_Export');

    // Resolution pill should indicate PRO Unlocked
    const proUnlockedBadge = page.locator('text=PRO UNLOCKED');
    await expect(proUnlockedBadge).toBeVisible();
  });
});
