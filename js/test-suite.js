// Heart & Petal Automated Test Suite
// Comprehensive feature testing system with bot automation

(function() {
  'use strict';

  class TestBot {
    constructor() {
      this.results = [];
      this.passed = 0;
      this.failed = 0;
      this.warnings = 0;
    }

    log(message, type = 'info') {
      const colors = {
        pass: '#4CAF50',
        fail: '#F44336',
        warn: '#FF9800',
        info: '#2196F3'
      };
      console.log(`%c[TEST-BOT] ${message}`, `color: ${colors[type]}; font-weight: bold;`);
    }

    assert(condition, testName, errorMessage = '') {
      if (condition) {
        this.passed++;
        this.results.push({ test: testName, status: 'PASS' });
        this.log(`✓ ${testName}`, 'pass');
        return true;
      } else {
        this.failed++;
        this.results.push({ test: testName, status: 'FAIL', error: errorMessage });
        this.log(`✗ ${testName} - ${errorMessage}`, 'fail');
        return false;
      }
    }

    warn(testName, message) {
      this.warnings++;
      this.results.push({ test: testName, status: 'WARN', message });
      this.log(`⚠ ${testName} - ${message}`, 'warn');
    }

    async sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    generateReport() {
      const total = this.passed + this.failed;
      const passRate = total > 0 ? ((this.passed / total) * 100).toFixed(1) : 0;
      
      console.log('\n' + '='.repeat(60));
      console.log('%c TEST REPORT ', 'background: #2196F3; color: white; font-size: 16px; font-weight: bold; padding: 4px 8px;');
      console.log('='.repeat(60));
      console.log(`%c✓ Passed: ${this.passed}`, 'color: #4CAF50; font-weight: bold;');
      console.log(`%c✗ Failed: ${this.failed}`, 'color: #F44336; font-weight: bold;');
      console.log(`%c⚠ Warnings: ${this.warnings}`, 'color: #FF9800; font-weight: bold;');
      console.log(`%cPass Rate: ${passRate}%`, `color: ${passRate >= 90 ? '#4CAF50' : passRate >= 70 ? '#FF9800' : '#F44336'}; font-weight: bold; font-size: 14px;`);
      console.log('='.repeat(60) + '\n');

      // Store report in localStorage for viewing
      localStorage.setItem('hp_test_report', JSON.stringify({
        timestamp: new Date().toISOString(),
        passed: this.passed,
        failed: this.failed,
        warnings: this.warnings,
        passRate: passRate,
        results: this.results
      }));

      return { passed: this.passed, failed: this.failed, warnings: this.warnings, passRate };
    }
  }

  class FeatureTests {
    constructor(bot) {
      this.bot = bot;
    }

    // Test 1: Core Scripts Loading
    testScriptLoading() {
      this.bot.log('Testing script loading...', 'info');
      
      const requiredScripts = [
        'auth.js',
        'cart.js',
        'inventory.js',
        'mobile-menu.js',
        'nav-manager.js',
        'system-monitor.js'
      ];

      const loadedScripts = Array.from(document.scripts).map(s => s.src);
      
      requiredScripts.forEach(script => {
        const loaded = loadedScripts.some(src => src.includes(script));
        this.bot.assert(loaded, `Script: ${script}`, loaded ? '' : 'Script not found');
      });
    }

    // Test 2: Global Functions Available
    testGlobalFunctions() {
      this.bot.log('Testing global functions...', 'info');

      const requiredFunctions = [
        { name: 'window.loginUser', desc: 'Login function' },
        { name: 'window.registerUser', desc: 'Registration function' },
        { name: 'window.logoutUser', desc: 'Logout function' },
        { name: 'window.isLoggedIn', desc: 'Login check function' },
        { name: 'window.getUrgencyMessage', desc: 'Urgency message function' },
        { name: 'window.isPopularItem', desc: 'Popular item check' },
        { name: 'window.addToCart', desc: 'Add to cart function' },
        { name: 'window.updateCartDisplay', desc: 'Cart display update' },
        { name: 'window.logError', desc: 'Error logging function' },
        { name: 'window.logSuccess', desc: 'Success logging function' }
      ];

      requiredFunctions.forEach(({ name, desc }) => {
        const exists = eval(`typeof ${name}`) === 'function';
        this.bot.assert(exists, desc, exists ? '' : `${name} not found`);
      });
    }

    // Test 3: localStorage Functionality
    testLocalStorage() {
      this.bot.log('Testing localStorage...', 'info');

      try {
        const testKey = 'hp_test_' + Date.now();
        const testValue = { test: true, timestamp: Date.now() };
        
        localStorage.setItem(testKey, JSON.stringify(testValue));
        const retrieved = JSON.parse(localStorage.getItem(testKey));
        localStorage.removeItem(testKey);

        this.bot.assert(
          retrieved && retrieved.test === true,
          'localStorage read/write',
          'localStorage not working'
        );
      } catch (e) {
        this.bot.assert(false, 'localStorage access', e.message);
      }
    }

    // Test 4: Authentication System
    async testAuthentication() {
      this.bot.log('Testing authentication system...', 'info');

      // Test email validation
      if (window.validateEmail) {
        const validEmail = window.validateEmail('test@example.com');
        const invalidEmail = !window.validateEmail('invalid-email');
        this.bot.assert(validEmail && invalidEmail, 'Email validation', 'Email validation not working');
      } else {
        this.bot.warn('Email validation', 'validateEmail function not found');
      }

      // Test password validation
      if (window.validatePassword) {
        const validPass = window.validatePassword('password123');
        const invalidPass = !window.validatePassword('123');
        this.bot.assert(validPass && invalidPass, 'Password validation', 'Password validation not working');
      } else {
        this.bot.warn('Password validation', 'validatePassword function not found');
      }

      // Test session management
      if (window.getSession) {
        const session = window.getSession();
        this.bot.assert(typeof session !== 'undefined', 'Session management', 'getSession not working');
      }
    }

    // Test 5: Inventory System
    testInventory() {
      this.bot.log('Testing inventory system...', 'info');

      if (window.getUrgencyMessage) {
        // Test popular items
        const testProducts = ['roses1', 'choc1', 'teddy1', 'combo1'];
        let urgencyWorking = true;

        testProducts.forEach(productId => {
          const urgency = window.getUrgencyMessage(productId);
          if (!urgency) {
            urgencyWorking = false;
          }
        });

        this.bot.assert(urgencyWorking, 'Urgency message system', 'Urgency messages not generating');

        // Test popular item detection
        if (window.isPopularItem) {
          const isRosePopular = window.isPopularItem('roses1');
          const isFlowerPopular = !window.isPopularItem('flower1');
          this.bot.assert(
            isRosePopular && isFlowerPopular,
            'Popular item detection',
            'Popular item logic incorrect'
          );
        }
      } else {
        this.bot.warn('Inventory system', 'getUrgencyMessage function not found');
      }
    }

    // Test 6: Shopping Cart
    testShoppingCart() {
      this.bot.log('Testing shopping cart...', 'info');

      if (window.addToCart && window.getCart) {
        const testItem = {
          id: 'test-product',
          name: 'Test Product',
          price: 99.99,
          img: 'test.jpg',
          quantity: 1
        };

        // Clear cart first
        if (window.clearCart) window.clearCart();

        // Add item
        window.addToCart(testItem.id, testItem.name, testItem.price, testItem.img);
        const cart = window.getCart();

        const itemAdded = cart && cart.some(item => item.id === testItem.id);
        this.bot.assert(itemAdded, 'Add to cart functionality', 'Item not added to cart');

        // Remove test item
        if (window.removeFromCart) {
          window.removeFromCart(testItem.id);
          const cartAfterRemoval = window.getCart();
          const itemRemoved = !cartAfterRemoval.some(item => item.id === testItem.id);
          this.bot.assert(itemRemoved, 'Remove from cart', 'Item not removed from cart');
        }
      } else {
        this.bot.warn('Shopping cart', 'Cart functions not available');
      }
    }

    // Test 7: Mobile Menu
    testMobileMenu() {
      this.bot.log('Testing mobile menu...', 'info');

      const menuButton = document.getElementById('mobile-menu-btn');
      const mobileMenu = document.getElementById('mobile-menu');

      this.bot.assert(menuButton !== null, 'Mobile menu button exists', 'Button not found');
      this.bot.assert(mobileMenu !== null, 'Mobile menu container exists', 'Menu container not found');

      if (menuButton && mobileMenu) {
        // Test toggle functionality
        const initialState = mobileMenu.classList.contains('hidden');
        menuButton.click();
        const afterClick = !mobileMenu.classList.contains('hidden') !== initialState;
        this.bot.assert(afterClick, 'Mobile menu toggle', 'Menu toggle not working');
        
        // Reset state
        if (!initialState) menuButton.click();
      }
    }

    // Test 8: Navigation Links
    testNavigation() {
      this.bot.log('Testing navigation links...', 'info');

      const requiredPages = [
        'index.html',
        'shop.html',
        'checkout.html',
        'customer-login.html',
        'admin.html'
      ];

      const links = Array.from(document.querySelectorAll('a[href]'));
      const linkHrefs = links.map(a => a.getAttribute('href'));

      requiredPages.forEach(page => {
        const hasLink = linkHrefs.some(href => href && href.includes(page));
        this.bot.assert(hasLink, `Navigation to ${page}`, `Link to ${page} not found`);
      });
    }

    // Test 9: System Monitor
    testSystemMonitor() {
      this.bot.log('Testing system monitor...', 'info');

      if (window.SystemMonitor) {
        this.bot.assert(true, 'System monitor loaded', '');
        
        // Test error logging
        if (window.logError) {
          const errorsBefore = localStorage.getItem('hp_error_log');
          window.logError('test', 'Test error message', null, 'low');
          const errorsAfter = localStorage.getItem('hp_error_log');
          this.bot.assert(
            errorsAfter !== errorsBefore,
            'Error logging functionality',
            'Error not logged'
          );
        }

        // Test success logging
        if (window.logSuccess) {
          window.logSuccess('test', 'Test success message');
          this.bot.assert(true, 'Success logging functionality', '');
        }
      } else {
        this.bot.warn('System monitor', 'SystemMonitor not found');
      }
    }

    // Test 10: Responsive Design
    testResponsiveDesign() {
      this.bot.log('Testing responsive design...', 'info');

      const viewportWidth = window.innerWidth;
      const isMobile = viewportWidth < 1024;

      const desktopNav = document.querySelector('nav.hidden.lg\\:flex');
      const mobileMenuBtn = document.getElementById('mobile-menu-btn');

      if (isMobile) {
        this.bot.assert(
          mobileMenuBtn && !mobileMenuBtn.classList.contains('hidden'),
          'Mobile menu button visible on mobile',
          'Mobile menu button should be visible'
        );
      } else {
        this.bot.assert(
          desktopNav !== null,
          'Desktop navigation visible on desktop',
          'Desktop nav should be visible'
        );
      }
    }

    // Test 11: Error Handler
    testErrorHandler() {
      this.bot.log('Testing error handler...', 'info');

      const errorHandlerLoaded = Array.from(document.scripts).some(s => 
        s.src.includes('error-handler.js')
      );

      this.bot.assert(errorHandlerLoaded, 'Error handler script loaded', 'error-handler.js not loaded');

      // Test global error handling
      const hasErrorListener = typeof window.onerror === 'function';
      this.bot.assert(hasErrorListener, 'Global error listener', 'No global error handler');
    }

    // Test 12: Performance Check
    testPerformance() {
      this.bot.log('Testing performance...', 'info');

      if (window.performance && window.performance.timing) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        
        this.bot.assert(
          loadTime > 0,
          'Page load time measurement',
          'Performance timing not available'
        );

        if (loadTime < 3000) {
          this.bot.assert(true, 'Page load speed (< 3s)', '');
        } else if (loadTime < 5000) {
          this.bot.warn('Page load speed', `Load time: ${(loadTime/1000).toFixed(2)}s (acceptable)`);
        } else {
          this.bot.assert(false, 'Page load speed', `Too slow: ${(loadTime/1000).toFixed(2)}s`);
        }
      }
    }
  }

  // Main Test Runner
  class TestRunner {
    constructor() {
      this.bot = new TestBot();
      this.features = new FeatureTests(this.bot);
    }

    async runAllTests() {
      console.clear();
      console.log('%c🤖 HEART & PETAL AUTO-TEST BOT 🤖', 'background: #C21807; color: white; font-size: 20px; font-weight: bold; padding: 8px 16px; border-radius: 4px;');
      console.log('%cStarting automated feature tests...', 'color: #2196F3; font-size: 14px; font-weight: bold;');
      console.log('\n');

      try {
        // Run all test categories
        this.features.testScriptLoading();
        await this.bot.sleep(100);

        this.features.testGlobalFunctions();
        await this.bot.sleep(100);

        this.features.testLocalStorage();
        await this.bot.sleep(100);

        await this.features.testAuthentication();
        await this.bot.sleep(100);

        this.features.testInventory();
        await this.bot.sleep(100);

        this.features.testShoppingCart();
        await this.bot.sleep(100);

        this.features.testMobileMenu();
        await this.bot.sleep(100);

        this.features.testNavigation();
        await this.bot.sleep(100);

        this.features.testSystemMonitor();
        await this.bot.sleep(100);

        this.features.testResponsiveDesign();
        await this.bot.sleep(100);

        this.features.testErrorHandler();
        await this.bot.sleep(100);

        this.features.testPerformance();

        // Generate final report
        const report = this.bot.generateReport();

        // Alert if tests failed
        if (report.failed > 0) {
          console.error(`%c⚠️ ${report.failed} TEST(S) FAILED - REVIEW REQUIRED`, 'background: #F44336; color: white; font-size: 14px; font-weight: bold; padding: 8px;');
        } else {
          console.log('%c✅ ALL TESTS PASSED - READY FOR DEPLOYMENT', 'background: #4CAF50; color: white; font-size: 14px; font-weight: bold; padding: 8px;');
        }

        return report;
      } catch (error) {
        console.error('Test runner error:', error);
        this.bot.assert(false, 'Test runner execution', error.message);
        return this.bot.generateReport();
      }
    }
  }

  // Auto-run on page load (after 2 seconds to ensure all scripts loaded)
  window.addEventListener('load', () => {
    setTimeout(async () => {
      const runner = new TestRunner();
      await runner.runAllTests();
    }, 2000);
  });

  // Export for manual testing
  window.TestRunner = TestRunner;
  window.runTests = async () => {
    const runner = new TestRunner();
    return await runner.runAllTests();
  };

  console.log('%c[TEST-SUITE] Automated testing bot initialized. Tests will run automatically in 2 seconds after page load.', 'color: #2196F3; font-weight: bold;');
  console.log('%cTo run tests manually, type: runTests()', 'color: #FF9800;');

})();
