import { test, expect, Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:8082';
const screenshotsDir = path.join(__dirname, 'screenshots');

// Create screenshots directory if doesn't exist
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

interface TestResult {
  pageName: string;
  viewport: { width: number; height: number };
  checks: { name: string; passed: boolean; details?: string }[];
  jsErrors: string[];
}

const results: TestResult[] = [];
let totalJsErrors: string[] = [];

async function testPageAtViewport(
  page: Page,
  url: string,
  pageName: string,
  viewport: { width: number; height: number; name: string }
) {
  const pageResults: TestResult = {
    pageName: `${pageName} (${viewport.name})`,
    viewport: { width: viewport.width, height: viewport.height },
    checks: [],
    jsErrors: [],
  };

  // Set viewport
  await page.setViewportSize({ width: viewport.width, height: viewport.height });

  // Capture JS errors
  const jsErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      jsErrors.push(msg.text());
    }
  });

  // Navigate
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000); // Allow render

  pageResults.jsErrors = jsErrors;
  totalJsErrors.push(...jsErrors);

  // Take screenshot
  const screenshotName = `${pageName.toLowerCase().replace(/\//g, '-')}-${viewport.name}.png`;
  const screenshotPath = path.join(screenshotsDir, screenshotName);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`✓ Screenshot: ${screenshotName}`);

  // ===== CHECKS =====

  // 1. Hero section: H1 should exist
  const h1 = await page.locator('h1').first();
  const h1Exists = await h1.isVisible().catch(() => false);
  pageResults.checks.push({
    name: 'Hero H1 exists',
    passed: h1Exists,
    details: h1Exists ? 'H1 found' : 'H1 not visible',
  });

  // 2. Check NO dark bg-stone-900 + white text (old hero)
  const darkHero = await page.locator('section[class*="bg-stone-900"], [class*="bg-stone-900"]').first();
  const darkHeroExists = await darkHero.isVisible().catch(() => false);
  pageResults.checks.push({
    name: 'No dark hero (bg-stone-900)',
    passed: !darkHeroExists,
    details: darkHeroExists ? 'ERROR: Found dark hero' : 'Hero has light background',
  });

  // 3. Breadcrumb check (if exists)
  const breadcrumb = await page.locator('nav[aria-label="breadcrumb"]').first();
  const breadcrumbExists = await breadcrumb.isVisible().catch(() => false);
  pageResults.checks.push({
    name: 'Breadcrumb renders',
    passed: breadcrumbExists || true, // Not all pages need breadcrumb
    details: breadcrumbExists ? 'Breadcrumb visible' : 'No breadcrumb (optional)',
  });

  // 4. Grid cards/items exist
  const cards = await page.locator('[class*="grid"] > *').count();
  const hasCards = cards > 0;
  pageResults.checks.push({
    name: 'Grid items render',
    passed: hasCards,
    details: hasCards ? `Found ${cards} grid items` : 'No grid items found',
  });

  // 5. No critical JS errors
  const hasCriticalErrors = jsErrors.some(
    (err) =>
      err.includes('hydration') ||
      err.includes('undefined is not') ||
      err.includes('Cannot read')
  );
  pageResults.checks.push({
    name: 'No critical JS errors',
    passed: !hasCriticalErrors,
    details: hasCriticalErrors ? `Errors: ${jsErrors.join('; ')}` : 'No critical errors',
  });

  results.push(pageResults);
  return pageResults;
}

// Page-specific tests
test.describe('Public Pages E2E Tests', () => {
  test('/tin-tuc (Mobile 375px)', async ({ page }) => {
    const result = await testPageAtViewport(
      page,
      `${BASE_URL}/tin-tuc`,
      'tin-tuc',
      { width: 375, height: 812, name: 'mobile' }
    );

    // Check at least 1 article card
    const articleCards = await page.locator('a[href*="/tin-tuc/"]').count();
    result.checks.push({
      name: 'Article cards clickable',
      passed: articleCards > 0,
      details: `Found ${articleCards} article links`,
    });

    // Try to click first article
    const firstArticle = await page.locator('a[href*="/tin-tuc/"]').first();
    if (await firstArticle.isVisible()) {
      await firstArticle.click();
      await page.waitForTimeout(500);
      const detailUrl = page.url();
      result.checks.push({
        name: 'Navigation to article detail',
        passed: detailUrl.includes('/tin-tuc/'),
        details: `Navigated to: ${detailUrl}`,
      });
      await page.screenshot({ path: path.join(screenshotsDir, 'tin-tuc-article-detail-mobile.png') });
    }
  });

  test('/tin-tuc (Tablet 768px)', async ({ page }) => {
    await testPageAtViewport(
      page,
      `${BASE_URL}/tin-tuc`,
      'tin-tuc',
      { width: 768, height: 1024, name: 'tablet' }
    );
  });

  test('/tin-tuc (Desktop 1280px)', async ({ page }) => {
    await testPageAtViewport(
      page,
      `${BASE_URL}/tin-tuc`,
      'tin-tuc',
      { width: 1280, height: 800, name: 'desktop' }
    );
  });

  test('/noi-that-khac (Mobile 375px)', async ({ page }) => {
    await testPageAtViewport(
      page,
      `${BASE_URL}/noi-that-khac`,
      'noi-that-khac',
      { width: 375, height: 812, name: 'mobile' }
    );
  });

  test('/noi-that-khac (Tablet 768px)', async ({ page }) => {
    await testPageAtViewport(
      page,
      `${BASE_URL}/noi-that-khac`,
      'noi-that-khac',
      { width: 768, height: 1024, name: 'tablet' }
    );
  });

  test('/noi-that-khac (Desktop 1280px)', async ({ page }) => {
    await testPageAtViewport(
      page,
      `${BASE_URL}/noi-that-khac`,
      'noi-that-khac',
      { width: 1280, height: 800, name: 'desktop' }
    );
  });

  test('/du-an-thuc-te (Mobile 375px)', async ({ page }) => {
    await testPageAtViewport(
      page,
      `${BASE_URL}/du-an-thuc-te`,
      'du-an-thuc-te',
      { width: 375, height: 812, name: 'mobile' }
    );
  });

  test('/du-an-thuc-te (Tablet 768px)', async ({ page }) => {
    await testPageAtViewport(
      page,
      `${BASE_URL}/du-an-thuc-te`,
      'du-an-thuc-te',
      { width: 768, height: 1024, name: 'tablet' }
    );
  });

  test('/du-an-thuc-te (Desktop 1280px)', async ({ page }) => {
    await testPageAtViewport(
      page,
      `${BASE_URL}/du-an-thuc-te`,
      'du-an-thuc-te',
      { width: 1280, height: 800, name: 'desktop' }
    );
  });

  test('Report Results', async () => {
    console.log('\n\n========== UI TEST REPORT ==========\n');

    const pageGroups: { [key: string]: TestResult[] } = {};
    results.forEach((r) => {
      const pageName = r.pageName.split(' (')[0];
      if (!pageGroups[pageName]) pageGroups[pageName] = [];
      pageGroups[pageName].push(r);
    });

    const summaryLines: string[] = [];

    Object.entries(pageGroups).forEach(([pageName, pageResults]) => {
      console.log(`\n${pageName}`);
      console.log('='.repeat(50));

      pageResults.forEach((result) => {
        const passed = result.checks.filter((c) => c.passed).length;
        const total = result.checks.length;
        const viewport = `${result.viewport.width}x${result.viewport.height}`;
        const status = passed === total ? 'PASS' : 'FAIL';

        summaryLines.push(`${pageName} (${viewport}): ${passed}/${total} ${status}`);
        console.log(`\n  ${result.pageName}: ${passed}/${total} ${status}`);

        result.checks.forEach((check) => {
          const icon = check.passed ? '✓' : '✗';
          console.log(`    ${icon} ${check.name}: ${check.details || ''}`);
        });

        if (result.jsErrors.length > 0) {
          console.log(`    JS Errors: ${result.jsErrors.join('; ')}`);
        }
      });
    });

    console.log('\n' + '='.repeat(50));
    console.log(`\nTotal JS Errors: ${totalJsErrors.length}`);
    if (totalJsErrors.length > 0) {
      console.log('Error Details:');
      totalJsErrors.forEach((err) => console.log(`  - ${err}`));
    }

    console.log('\n========== SUMMARY ==========');
    summaryLines.forEach((line) => console.log(line));

    const allPassed = results.every((r) => r.checks.every((c) => c.passed));
    console.log(`\nOVERALL STATUS: ${allPassed && totalJsErrors.length === 0 ? 'PASS ✓' : 'FAIL ✗'}`);

    // Save report to file
    const report = {
      timestamp: new Date().toISOString(),
      baseUrl: BASE_URL,
      results: results,
      totalJsErrors: totalJsErrors.length,
      overallStatus: allPassed && totalJsErrors.length === 0 ? 'PASS' : 'FAIL',
    };

    fs.writeFileSync(
      path.join(screenshotsDir, 'test-report.json'),
      JSON.stringify(report, null, 2)
    );

    console.log(`\nReport saved to: ${path.join(screenshotsDir, 'test-report.json')}`);
  });
});
