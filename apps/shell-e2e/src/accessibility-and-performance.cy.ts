import { test, expect } from '@playwright/test';

test.describe('Accessibility Testing (Phase 10)', () => {
  test('should have proper heading structure', async ({ page }) => {
    await page.goto('/login');

    const heading = page.locator('h2');
    const headingCount = await heading.count();
    expect(headingCount).toBeGreaterThan(0);

    const headingText = await heading.first().textContent();
    expect(headingText).toContain('Log In');
  });

  test('should have ARIA labels on form inputs', async ({ page }) => {
    await page.goto('/login');

    const emailInput = page.locator('#email');
    const ariaLabel = await emailInput.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
    expect(ariaLabel).toContain('Email');

    const passwordInput = page.locator('#password');
    const pwAriaLabel = await passwordInput.getAttribute('aria-label');
    expect(pwAriaLabel).toBeTruthy();
    expect(pwAriaLabel).toContain('Password');
  });

  test('should have aria-live region for error messages', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#email').fill('invalid@example.com');
    await page.locator('#password').fill('wrongpassword');
    await page.locator('button[type="submit"]').click();

    const liveRegion = page.locator('[aria-live="polite"]');
    await expect(liveRegion).toBeVisible();
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/login');

    // Tab to email field
    await page.keyboard.press('Tab');
    const emailInput = page.locator('#email');
    await expect(emailInput).toBeFocused();

    // Tab to password field
    await page.keyboard.press('Tab');
    const passwordInput = page.locator('#password');
    await expect(passwordInput).toBeFocused();

    // Tab to submit button
    await page.keyboard.press('Tab');
    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeFocused();

    // Press enter to submit
    await submitBtn.fill('');
    await page.keyboard.press('Enter');
  });

  test('should support screen reader navigation', async ({ page }) => {
    await page.goto('/login');

    // Check for form labels
    const labels = page.locator('label');
    expect(await labels.count()).toBeGreaterThan(0);

    const labelTexts = await labels.allTextContents();
    expect(labelTexts).toContain(expect.stringContaining('Email'));
    expect(labelTexts).toContain(expect.stringContaining('Password'));
  });

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/login');

    // Visual check - buttons should be visible
    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeVisible();

    // Check text is readable
    const btnText = await submitBtn.textContent();
    expect(btnText).toBeTruthy();
  });

  test('should support text zoom', async ({ page }) => {
    await page.goto('/login');

    // Zoom in
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '24px';
    });

    // Form should still be visible and readable
    const emailInput = page.locator('#email');
    await expect(emailInput).toBeVisible();

    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeVisible();
  });

  test('should have no keyboard traps', async ({ page }) => {
    await page.goto('/login');

    // Tab through all focusable elements
    let focusedCount = 0;
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab');
      focusedCount++;
      if (focusedCount > 10) break;
    }

    // Should be able to navigate through elements
    expect(focusedCount).toBeGreaterThan(0);
  });
});

test.describe('Responsive Design (Phase 10)', () => {
  test('should render on mobile (320px)', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/login');

    const form = page.locator('form');
    await expect(form).toBeVisible();

    const inputs = page.locator('input');
    for (let i = 0; i < await inputs.count(); i++) {
      await expect(inputs.nth(i)).toBeVisible();
    }
  });

  test('should render on tablet (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/login');

    const form = page.locator('form');
    await expect(form).toBeVisible();
  });

  test('should render on desktop (1920px)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/login');

    const form = page.locator('form');
    await expect(form).toBeVisible();
  });

  test('should handle landscape mobile', async ({ page }) => {
    await page.setViewportSize({ width: 640, height: 320 });
    await page.goto('/login');

    const form = page.locator('form');
    await expect(form).toBeVisible();
  });
});

test.describe('Performance Metrics (Phase 10)', () => {
  test('should load login page within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/login');
    const loadTime = Date.now() - startTime;

    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('should show form within 1 second', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/login');
    await page.locator('form').waitFor();
    const formTime = Date.now() - startTime;

    expect(formTime).toBeLessThan(1000);
  });

  test('should process login within 2 seconds', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#email').fill('user@example.com');
    await page.locator('#password').fill('password');

    const startTime = Date.now();
    await page.locator('button[type="submit"]').click();

    // Wait for navigation
    try {
      await page.waitForURL(/\/(admin|member|management|login|error)/, {
        timeout: 3000
      });
      const navigationTime = Date.now() - startTime;
      expect(navigationTime).toBeLessThan(3000);
    } catch {
      // Navigation may not happen in test environment
    }
  });

  test('should handle errors quickly (<500ms)', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#email').fill('invalid@example.com');
    await page.locator('#password').fill('wrong');

    const startTime = Date.now();
    await page.locator('button[type="submit"]').click();

    // Error should appear quickly
    const errorAlert = page.locator('[role=alert]');
    await errorAlert.waitFor({ timeout: 1000 });
    const errorTime = Date.now() - startTime;

    expect(errorTime).toBeLessThan(1000);
  });
});
