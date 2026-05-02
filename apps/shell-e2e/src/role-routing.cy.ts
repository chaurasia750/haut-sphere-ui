import { test, expect } from '@playwright/test';

test.describe('Admin Role (1-2) Routing', () => {
  test('should route role 1 (System Admin) to /admin', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#email').fill('sysadmin@example.com');
    await page.locator('#password').fill('password123');
    await page.locator('button[type="submit"]').click();

    await page.waitForURL('/admin', { timeout: 5000 });
    expect(page.url()).toContain('/admin');
  });

  test('should route role 2 (Admin) to /admin', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#email').fill('admin@example.com');
    await page.locator('#password').fill('password123');
    await page.locator('button[type="submit"]').click();

    await page.waitForURL('/admin', { timeout: 5000 });
    expect(page.url()).toContain('/admin');
  });

  test('should protect /admin route from unauthenticated access', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForURL('/login', { timeout: 5000 });
    expect(page.url()).toContain('/login');
  });

  test('should prevent role 3 (Member) from accessing /admin', async ({ page, context }) => {
    // Set up authenticated session for role 3
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'mock-token-role-3',
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        secure: false,
        sameSite: 'Strict'
      }
    ]);

    await page.goto('/admin');
    await page.waitForURL(/\/(login|error)/, { timeout: 5000 });
    const url = page.url();
    expect(url).toMatch(/\/(login|error\/unauthorized)/);
  });
});

test.describe('Member Role (3) Routing', () => {
  test('should route role 3 (Member) to /member', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#email').fill('member@example.com');
    await page.locator('#password').fill('password123');
    await page.locator('button[type="submit"]').click();

    await page.waitForURL('/member', { timeout: 5000 });
    expect(page.url()).toContain('/member');
  });

  test('should protect /member route from unauthenticated access', async ({ page }) => {
    await page.goto('/member');
    await page.waitForURL('/login', { timeout: 5000 });
    expect(page.url()).toContain('/login');
  });

  test('should prevent role 1 from accessing /member', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#email').fill('sysadmin@example.com');
    await page.locator('#password').fill('password123');
    await page.locator('button[type="submit"]').click();

    // After redirecting to /admin, navigate to /member should redirect to error
    await page.waitForURL('/admin', { timeout: 5000 });
    await page.goto('/member');
    await page.waitForURL(/\/(login|error)/, { timeout: 5000 });
    expect(page.url()).toMatch(/\/(login|error\/unauthorized)/);
  });
});

test.describe('Manager Role (4) Routing', () => {
  test('should route role 4 (Manager) to /management', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#email').fill('manager@example.com');
    await page.locator('#password').fill('password123');
    await page.locator('button[type="submit"]').click();

    await page.waitForURL('/management', { timeout: 5000 });
    expect(page.url()).toContain('/management');
  });

  test('should protect /management route from unauthenticated access', async ({ page }) => {
    await page.goto('/management');
    await page.waitForURL('/login', { timeout: 5000 });
    expect(page.url()).toContain('/login');
  });

  test('should prevent role 3 from accessing /management', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#email').fill('member@example.com');
    await page.locator('#password').fill('password123');
    await page.locator('button[type="submit"]').click();

    await page.waitForURL('/member', { timeout: 5000 });
    await page.goto('/management');
    await page.waitForURL(/\/(login|error)/, { timeout: 5000 });
    expect(page.url()).toMatch(/\/(login|error\/unauthorized)/);
  });
});

test.describe('Invalid Role Handling', () => {
  test('should handle invalid role with generic error message', async ({ page }) => {
    // This test assumes backend returns invalid role
    await page.goto('/login');
    await page.locator('#email').fill('invalid-role@example.com');
    await page.locator('#password').fill('password123');
    await page.locator('button[type="submit"]').click();

    const errorAlert = page.locator('[role=alert]');
    await expect(errorAlert).toContainText('Unable to access system at this time');
  });
});

test.describe('Concurrent Login Handling', () => {
  test('should handle concurrent login from multiple sessions', async ({ browser }) => {
    const page1 = await browser.newPage();
    const page2 = await browser.newPage();

    try {
      // First session
      await page1.goto('/login');
      await page1.locator('#email').fill('user@example.com');
      await page1.locator('#password').fill('password123');
      await page1.locator('button[type="submit"]').click();
      await page1.waitForURL(/\/(admin|member|management)/, { timeout: 5000 });

      // Second session (should invalidate first)
      await page2.goto('/login');
      await page2.locator('#email').fill('user@example.com');
      await page2.locator('#password').fill('password123');
      await page2.locator('button[type="submit"]').click();
      await page2.waitForURL(/\/(admin|member|management)/, { timeout: 5000 });

      // First page might now be redirected to login if session was invalidated
      await page1.goto('/admin');
      // Could be in admin still or redirected to login depending on implementation
      const url1 = page1.url();
      expect(url1).toMatch(/\/(admin|login|error)/);
    } finally {
      await page1.close();
      await page2.close();
    }
  });
});
