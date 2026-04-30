import { test, expect } from '@playwright/test';

test.describe('Login Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test.describe('Happy Path - Valid Login', () => {
    test('should display login form with email and password fields', async ({ page }) => {
      await expect(page.locator('h2')).toContainText('Log In');
      await expect(page.locator('label:has-text("Email Address")')).toBeVisible();
      await expect(page.locator('label:has-text("Password")')).toBeVisible();
    });

    test('should successfully login with valid credentials and navigate to admin module for role 1', async ({ page }) => {
      // Fill in credentials
      await page.locator('#email').fill('admin@example.com');
      await page.locator('#password').fill('password123');

      // Submit form
      await page.locator('button[type="submit"]').click();

      // Should navigate to admin page
      await page.waitForURL('/admin');
      expect(page.url()).toContain('/admin');
    });

    test('should successfully login with valid credentials and navigate to admin module for role 2', async ({ page }) => {
      await page.locator('#email').fill('manager@example.com');
      await page.locator('#password').fill('password123');
      await page.locator('button[type="submit"]').click();

      await page.waitForURL('/admin');
      expect(page.url()).toContain('/admin');
    });

    test('should successfully login with valid credentials and navigate to member module for role 3', async ({ page }) => {
      await page.locator('#email').fill('member@example.com');
      await page.locator('#password').fill('password123');
      await page.locator('button[type="submit"]').click();

      await page.waitForURL('/member');
      expect(page.url()).toContain('/member');
    });

    test('should successfully login with valid credentials and navigate to management module for role 4', async ({ page }) => {
      await page.locator('#email').fill('mgr@example.com');
      await page.locator('#password').fill('password123');
      await page.locator('button[type="submit"]').click();

      await page.waitForURL('/management');
      expect(page.url()).toContain('/management');
    });
  });

  test.describe('Validation & Error Handling', () => {
    test('should show email required validation error', async ({ page }) => {
      const emailInput = page.locator('#email');
      await emailInput.click();
      await emailInput.blur();

      const errorMsg = page.locator('text=Email is required');
      await expect(errorMsg).toBeVisible();
    });

    test('should show invalid email format error', async ({ page }) => {
      await page.locator('#email').fill('invalid-email');
      await page.locator('#password').click(); // trigger validation

      const errorMsg = page.locator('text=Please enter a valid email');
      await expect(errorMsg).toBeVisible();
    });

    test('should show password required validation error', async ({ page }) => {
      const passwordInput = page.locator('#password');
      await passwordInput.click();
      await passwordInput.blur();

      const errorMsg = page.locator('text=Password is required');
      await expect(errorMsg).toBeVisible();
    });

    test('should disable submit button when form is invalid', async ({ page }) => {
      const submitBtn = page.locator('button[type="submit"]');
      await expect(submitBtn).toBeDisabled();
    });

    test('should show error message for invalid credentials (401)', async ({ page }) => {
      await page.locator('#email').fill('invalid@example.com');
      await page.locator('#password').fill('wrongpassword');
      await page.locator('button[type="submit"]').click();

      const errorAlert = page.locator('role=alert');
      await expect(errorAlert).toContainText('Invalid email or password');
    });

    test('should show generic error message for server errors (500)', async ({ page }) => {
      // This test assumes backend returns 500 for specific test user
      await page.locator('#email').fill('servererror@example.com');
      await page.locator('#password').fill('password123');
      await page.locator('button[type="submit"]').click();

      const errorAlert = page.locator('role=alert');
      await expect(errorAlert).toContainText('System unavailable');
    });
  });

  test.describe('Form Interaction', () => {
    test('should clear error message when user changes form input', async ({ page }) => {
      // First submit with invalid credentials to trigger error
      await page.locator('#email').fill('invalid@example.com');
      await page.locator('#password').fill('wrongpassword');
      await page.locator('button[type="submit"]').click();

      // Wait for error to appear
      await expect(page.locator('role=alert')).toBeVisible();

      // Change email - error should clear
      await page.locator('#email').fill('valid@example.com');
      await expect(page.locator('role=alert')).not.toBeVisible();
    });

    test('should disable form inputs during login submission', async ({ page }) => {
      await page.locator('#email').fill('admin@example.com');
      await page.locator('#password').fill('password123');
      await page.locator('button[type="submit"]').click();

      const emailInput = page.locator('#email');
      const passwordInput = page.locator('#password');

      await expect(emailInput).toBeDisabled();
      await expect(passwordInput).toBeDisabled();
    });

    test('should show loading spinner during login', async ({ page }) => {
      await page.locator('#email').fill('admin@example.com');
      await page.locator('#password').fill('password123');
      await page.locator('button[type="submit"]').click();

      const spinner = page.locator('svg.animate-spin');
      await expect(spinner).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper ARIA labels', async ({ page }) => {
      const emailInput = page.locator('#email');
      const passwordInput = page.locator('#password');

      await expect(emailInput).toHaveAttribute('aria-label', 'Email address');
      await expect(passwordInput).toHaveAttribute('aria-label', 'Password');
    });

    test('should have error message with aria-live polite', async ({ page }) => {
      await page.locator('#email').fill('invalid@example.com');
      await page.locator('#password').fill('wrongpassword');
      await page.locator('button[type="submit"]').click();

      const errorAlert = page.locator('[aria-live="polite"]');
      await expect(errorAlert).toBeVisible();
    });

    test('should be keyboard navigable', async ({ page }) => {
      // Tab to email, fill, tab to password, fill, tab to submit, enter
      await page.keyboard.press('Tab'); // Focus email
      await page.keyboard.type('test@example.com');
      await page.keyboard.press('Tab'); // Focus password
      await page.keyboard.type('password123');
      await page.keyboard.press('Tab'); // Focus submit
      await page.keyboard.press('Enter'); // Submit

      // Should navigate to the appropriate role route
      await page.waitForURL(/\/(admin|member|management)/);
    });

    test('should have proper heading hierarchy', async ({ page }) => {
      const heading = page.locator('h2');
      await expect(heading).toContainText('Log In');
    });
  });

  test.describe('Responsive Design', () => {
    test('should display properly on mobile (320px)', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 640 });
      await page.goto('/login');

      const form = page.locator('form');
      await expect(form).toBeVisible();

      const inputs = page.locator('input');
      for (let i = 0; i < await inputs.count(); i++) {
        await expect(inputs.nth(i)).toBeVisible();
      }
    });

    test('should display properly on tablet (768px)', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/login');

      const form = page.locator('form');
      await expect(form).toBeVisible();
    });

    test('should display properly on desktop (1024px)', async ({ page }) => {
      await page.setViewportSize({ width: 1024, height: 768 });
      await page.goto('/login');

      const container = page.locator('div').filter({ hasText: 'Log In' }).first();
      await expect(container).toBeVisible();
    });
  });
});
