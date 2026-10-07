import { test, expect } from '@playwright/test';

test.describe('Tamil Buddy Core User Journeys & Phase 2 Features', () => {
  test('Application loads with branding and navigation', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=தமிழ் Buddy')).toBeVisible();
    await expect(page.locator('text=Start Learning')).toBeVisible();
  });

  test('Navigation to Learn page and letter audio controls', async ({ page }) => {
    await page.goto('/learn');
    await expect(page.url()).toContain('/learn');
    // Verify Tamil letters load
    await expect(page.locator('text=அ').first()).toBeVisible();
  });

  test('Navigation to Stories page and bilingual reading', async ({ page }) => {
    await page.goto('/stories');
    await expect(page.url()).toContain('/stories');
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('Navigation to Rhymes & Heritage songs', async ({ page }) => {
    await page.goto('/rhymes');
    await expect(page.url()).toContain('/rhymes');
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('Navigation to AI Buddy Chat and interaction flow', async ({ page }) => {
    await page.goto('/chat');
    await expect(page.url()).toContain('/chat');
    await expect(page.locator('text=Ask Tamil Buddy')).toBeVisible();

    // Verify chat input is present
    const chatInput = page.locator('input[placeholder*="Ask something"]');
    await expect(chatInput).toBeVisible();
  });

  test('Navigation to Adventure Map and 100-level system', async ({ page }) => {
    await page.goto('/adventure');
    await expect(page.url()).toContain('/adventure');
    await expect(page.locator('text=Tamil Adventure Map')).toBeVisible();
  });

  test('Phase 2 User Validation testing flow and dashboard', async ({ page }) => {
    await page.goto('/validation');
    await expect(page.url()).toContain('/validation');
    await expect(page.locator('text=Phase 2 User Validation')).toBeVisible();

    // Verify Run Evaluation tab is functional
    await page.click('text=+ Run Evaluation');
    await expect(page.locator('text=Step 1: Participant Identity')).toBeVisible();
    await expect(page.locator('text=Participant P01')).toBeVisible();
  });

  test('Phase 2 System Performance & Telemetry dashboard', async ({ page }) => {
    await page.goto('/performance');
    await expect(page.url()).toContain('/performance');
    await expect(page.locator('text=System Performance & Telemetry')).toBeVisible();
    await expect(page.locator('text=Network State')).toBeVisible();
    await expect(page.locator('text=Client Audio Cache')).toBeVisible();
  });

  test('Parent / Teacher Dashboard displays analytics', async ({ page }) => {
    await page.goto('/parent');
    await expect(page.url()).toContain('/parent');
    await expect(page.locator('text=Parent / Teacher Dashboard')).toBeVisible();
    await expect(page.locator('text=Levels Completed')).toBeVisible();
  });
});
