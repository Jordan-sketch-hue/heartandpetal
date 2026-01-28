// Headless Browser Test Runner for CI/CD
// Run with: node run-tests.js

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function runHeadlessTests() {
  console.log('🤖 Starting headless automated tests...\n');

  let browser;
  try {
    // Launch browser
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Set console listener to capture test output
    const testLogs = [];
    page.on('console', msg => {
      const text = msg.text();
      testLogs.push(text);
      
      // Only show important logs
      if (text.includes('TEST-BOT') || text.includes('TEST REPORT') || text.includes('===')) {
        console.log(text);
      }
    });

    // Navigate to test dashboard
    const testDashboardPath = 'file://' + path.resolve(__dirname, 'test-dashboard.html');
    console.log(`Loading: ${testDashboardPath}\n`);
    
    await page.goto(testDashboardPath, { waitUntil: 'networkidle0' });

    // Wait for tests to complete (max 30 seconds)
    console.log('⏳ Running tests...\n');
    await page.waitForTimeout(30000);

    // Extract test results from localStorage
    const results = await page.evaluate(() => {
      const report = localStorage.getItem('hp_test_report');
      return report ? JSON.parse(report) : null;
    });

    if (!results) {
      throw new Error('No test results found. Tests may not have run.');
    }

    // Generate report
    console.log('\n' + '='.repeat(60));
    console.log('📊 AUTOMATED TEST RESULTS');
    console.log('='.repeat(60));
    console.log(`Timestamp: ${results.timestamp || new Date().toISOString()}`);
    console.log(`\n✓ Passed:   ${results.passed}`);
    console.log(`✗ Failed:   ${results.failed}`);
    console.log(`⚠ Warnings: ${results.warnings}`);
    console.log(`📈 Pass Rate: ${results.passRate}%`);
    console.log('='.repeat(60) + '\n');

    // Show detailed results
    if (results.results && results.results.length > 0) {
      console.log('Detailed Results:');
      results.results.forEach(result => {
        const icon = result.status === 'PASS' ? '✓' : result.status === 'FAIL' ? '✗' : '⚠';
        const message = result.error || result.message || '';
        console.log(`  ${icon} ${result.test}${message ? ' - ' + message : ''}`);
      });
      console.log('');
    }

    // Save report to file
    const reportText = `
HEART & PETAL - AUTOMATED TEST REPORT
Generated: ${new Date().toLocaleString()}
========================================

SUMMARY:
--------
Passed: ${results.passed}
Failed: ${results.failed}
Warnings: ${results.warnings}
Pass Rate: ${results.passRate}%

DETAILED RESULTS:
-----------------
${results.results ? results.results.map(r => 
  `${r.status === 'PASS' ? '✓' : r.status === 'FAIL' ? '✗' : '⚠'} ${r.test}${r.error ? ' - ' + r.error : ''}${r.message ? ' - ' + r.message : ''}`
).join('\n') : 'No detailed results available'}

========================================
    `.trim();

    fs.writeFileSync('test-report.txt', reportText);
    console.log('📄 Report saved to: test-report.txt\n');

    // Determine exit code
    if (results.failed > 0) {
      console.error('❌ TESTS FAILED - DO NOT DEPLOY\n');
      await browser.close();
      process.exit(1);
    } else if (results.passRate < 90) {
      console.warn('⚠️  PASS RATE BELOW 90% - REVIEW WARNINGS\n');
      await browser.close();
      process.exit(0); // Don't fail build, but warn
    } else {
      console.log('✅ ALL TESTS PASSED - READY FOR DEPLOYMENT\n');
      await browser.close();
      process.exit(0);
    }

  } catch (error) {
    console.error('\n❌ Test execution error:', error.message);
    console.error(error.stack);
    
    if (browser) await browser.close();
    process.exit(1);
  }
}

// Run tests
runHeadlessTests();
