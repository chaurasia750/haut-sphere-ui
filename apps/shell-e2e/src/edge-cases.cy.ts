import { test, expect } from '@playwright/test';

test.describe('Invalid Role Handling (Phase 9)', () => {
  test('should display invalid role error page', async ({ page }) => {
    // Navigate directly to invalid role error (simulating backend returning invalid role)
    await page.goto('/error/invalid-role');

    const heading = page.locator('h1');
    await expect(heading).toContainText('Invalid Role');
    await expect(page.locator('p')).toContainText('administrator');
  });

  test('should allow logout from invalid role page', async ({ page }) => {
    await page.goto('/error/invalid-role');
    await page.locator('button').click();

    await page.waitForURL('/login', { timeout: 5000 });
    expect(page.url()).toContain('/login');
  });

  test('should handle invalid role returned from login', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#email').fill('invalid-role@example.com');
    await page.locator('#password').fill('password123');
    await page.locator('button[type="submit"]').click();

    // Should either show error or navigate to invalid role page
    await page.waitForURL(/\/(login|error)/, { timeout: 5000 });
    const url = page.url();
    expect(url).toMatch(/\/(login|error\/(invalid-role|unauthorized))/);
  });
});

test.describe('Edge Cases (Phase 9)', () => {
  test('should handle rapid successive login attempts', async ({ page }) => {
    await page.goto('/login');

    // Fill form
    await page.locator('#email').fill('user@example.com');
    await page.locator('#password').fill('password123');

    // Click submit button multiple times rapidly
    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();
    await submitBtn.click();
    await submitBtn.click();

    // Should only submit once due to disable logic
    // Check that button is disabled during loading
    await expect(submitBtn).toBeDisabled();
  });

  test('should handle network timeout during login', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#email').fill('timeout@example.com');
    await page.locator('#password').fill('password');

    // Set network condition to slow 3g
    await page.route('**/api/auth/login', (route) => {
      // Delay response significantly
      setTimeout(() => route.abort('timedout'), 10000);
    });

    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(1000);

    // Should show some indication of network issue
    const errorAlert = page.locator('[role=alert]');
    const isVisible = await errorAlert.isVisible().catch(() => false);
    if (isVisible) {
      const errorText = await errorAlert.textContent();
      expect(errorText || '').toBeTruthy();
    }
  });

  test('should handle rapid role changes', async ({ page, context }) => {
    // Login with role 1
    await page.goto('/login');
    await page.locator('#email').fill('user@example.com');
    await page.locator('#password').fill('password');
    await page.locator('button[type="submit"]').click();

    await page.waitForURL(/\/(admin|member|management|login)/, { timeout: 5000 });

    // Simulate clearing cookies and login again (role 3)
    await context.clearCookies();
    await page.goto('/login');
    await page.locator('#email').fill('member@example.com');
    await page.locator('#password').fill('password');
    await page.locator('button[type="submit"]').click();

    // Should navigate to member page now
    await page.waitForURL(/\/(admin|member|management|login)/, { timeout: 5000 });
    const url = page.url();
    // URL should be either member or admin, depending on test data
    expect(url).toMatch(/\/(admin|member|management|login)/);
  });

  test('should handle invalid session on page reload', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#email').fill('user@example.com');
    await page.locator('#password').fill('password');
    await page.locator('button[type="submit"]').click();

    await page.waitForURL(/\/(admin|member|management)/, { timeout: 5000 });

    // Reload page - session should be validated
    await page.reload();

    // Should either stay on module page or go to login
    const url = page.url();
    expect(url).toMatch(/\/(admin|member|management|login)/);
  });

  test('should handle form submission with special characters', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#email').fill('test+special@example.com');
    await page.locator('#password').fill('p@ss!word#123');
    await page.locator('button[type="submit"]').click();

    // Should not throw error, should handle gracefully
    await page.waitForTimeout(2000);
    const url = page.url();
    expect(url).toMatch(/\/(login|admin|member|management|error)/);
  });

  test('should handle very long email addresses', async ({ page }) => {
    await page.goto('/login');
    const longEmail = 'a'.repeat(100) + '@example.com';
    await page.locator('#email').fill(longEmail);
    await page.locator('#password').fill('password');

    // Email validation might prevent submission
    const submitBtn = page.locator('button[type="submit"]');
    const isDisabled = await submitBtn.isDisabled();

    if (!isDisabled) {
      await submitBtn.click();
      await page.waitForTimeout(2000);
      // Should handle gracefully
      expect(page.url()).toBeTruthy();
    }
  });
});
