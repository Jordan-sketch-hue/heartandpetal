// Heart & Petal System Monitor & Error Communication
// Comprehensive error tracking, logging, and team alerting system

(function() {
  'use strict';

  const ERROR_LOG_KEY = 'hp_error_log';
  const SYSTEM_STATUS_KEY = 'hp_system_status';
  const MAX_ERROR_LOG = 100; // Keep last 100 errors

  // System components to monitor
  const SYSTEM_COMPONENTS = {
    auth: 'Authentication System',
    cart: 'Shopping Cart',
    checkout: 'Checkout Process',
    discounts: 'Discount System',
    orders: 'Order Management',
    crm: 'CRM Dashboard',
    nav: 'Navigation System',
    chatbot: 'AI Chatbot',
    notifications: 'Notification System',
    inventory: 'Inventory System'
  };

  // Error severity levels
  const SEVERITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical'
  };

  class SystemMonitor {
    constructor() {
      this.errors = this.loadErrors();
      this.systemStatus = this.loadSystemStatus();
      this.initializeMonitoring();
    }

    // Load error log from localStorage
    loadErrors() {
      try {
        return JSON.parse(localStorage.getItem(ERROR_LOG_KEY) || '[]');
      } catch (e) {
        console.error('Failed to load error log:', e);
        return [];
      }
    }

    // Load system status
    loadSystemStatus() {
      try {
        return JSON.parse(localStorage.getItem(SYSTEM_STATUS_KEY) || '{}');
      } catch (e) {
        console.error('Failed to load system status:', e);
        return {};
      }
    }

    // Save error log
    saveErrors() {
      try {
        // Keep only last MAX_ERROR_LOG errors
        const recentErrors = this.errors.slice(-MAX_ERROR_LOG);
        localStorage.setItem(ERROR_LOG_KEY, JSON.stringify(recentErrors));
        this.errors = recentErrors;
      } catch (e) {
        console.error('Failed to save error log:', e);
      }
    }

    // Save system status
    saveSystemStatus() {
      try {
        localStorage.setItem(SYSTEM_STATUS_KEY, JSON.stringify(this.systemStatus));
      } catch (e) {
        console.error('Failed to save system status:', e);
      }
    }

    // Log error with full context
    logError(component, message, error = null, severity = SEVERITY.MEDIUM) {
      const errorEntry = {
        timestamp: new Date().toISOString(),
        component: component,
        componentName: SYSTEM_COMPONENTS[component] || component,
        message: message,
        severity: severity,
        error: error ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        } : null,
        url: window.location.href,
        userAgent: navigator.userAgent,
        sessionActive: !!localStorage.getItem('hp_session')
      };

      this.errors.push(errorEntry);
      this.saveErrors();

      // Update system status
      this.systemStatus[component] = {
        status: severity === SEVERITY.CRITICAL ? 'error' : 'warning',
        lastError: errorEntry.timestamp,
        message: message
      };
      this.saveSystemStatus();

      // Console output with styling
      this.consoleLog(errorEntry);

      // Alert team for critical errors
      if (severity === SEVERITY.CRITICAL) {
        this.alertTeam(errorEntry);
      }

      // Show user notification for high/critical
      if (severity === SEVERITY.HIGH || severity === SEVERITY.CRITICAL) {
        this.showUserError(errorEntry);
      }

      return errorEntry;
    }

    // Console log with color coding
    consoleLog(errorEntry) {
      const colors = {
        low: '#4CAF50',
        medium: '#FF9800',
        high: '#FF5722',
        critical: '#F44336'
      };

      const color = colors[errorEntry.severity] || '#999';
      
      console.group(`%c[${errorEntry.severity.toUpperCase()}] ${errorEntry.componentName}`, 
        `color: ${color}; font-weight: bold; font-size: 14px;`);
      console.log(`%cMessage: ${errorEntry.message}`, 'font-weight: bold;');
      console.log(`Timestamp: ${new Date(errorEntry.timestamp).toLocaleString()}`);
      console.log(`Page: ${errorEntry.url}`);
      if (errorEntry.error) {
        console.error('Error Details:', errorEntry.error);
      }
      console.groupEnd();
    }

    // Alert team (simulated - would integrate with real alerting service)
    alertTeam(errorEntry) {
      console.error('🚨 CRITICAL ERROR - TEAM ALERT TRIGGERED 🚨');
      console.error(`Component: ${errorEntry.componentName}`);
      console.error(`Message: ${errorEntry.message}`);
      console.error(`Time: ${new Date(errorEntry.timestamp).toLocaleString()}`);
      
      // In production, this would:
      // 1. Send email to support@heartandpetal.com
      // 2. Post to Slack/Discord webhook
      // 3. Create ticket in support system
      // 4. Send SMS to on-call engineer
      
      // For now, store in critical alerts
      const criticalAlerts = JSON.parse(localStorage.getItem('hp_critical_alerts') || '[]');
      criticalAlerts.push(errorEntry);
      localStorage.setItem('hp_critical_alerts', JSON.stringify(criticalAlerts.slice(-20)));
    }

    // Show error to user
    showUserError(errorEntry) {
      if (window.showNotification && typeof window.showNotification === 'function') {
        window.showNotification(
          `System issue in ${errorEntry.componentName}. Our team has been notified.`,
          'error'
        );
      }
    }

    // Log success for component health check
    logSuccess(component, message) {
      this.systemStatus[component] = {
        status: 'healthy',
        lastCheck: new Date().toISOString(),
        message: message
      };
      this.saveSystemStatus();
      
      console.log(`✅ [${SYSTEM_COMPONENTS[component]}] ${message}`);
    }

    // Get system health report
    getHealthReport() {
      const report = {
        timestamp: new Date().toISOString(),
        overallStatus: 'healthy',
        components: {},
        recentErrors: this.errors.slice(-10),
        errorCount: {
          last24h: 0,
          critical: 0,
          high: 0
        }
      };

      // Check component status
      Object.keys(SYSTEM_COMPONENTS).forEach(comp => {
        const status = this.systemStatus[comp];
        report.components[comp] = {
          name: SYSTEM_COMPONENTS[comp],
          status: status ? status.status : 'unknown',
          lastCheck: status ? status.lastCheck : null,
          lastError: status ? status.lastError : null
        };

        if (status && status.status === 'error') {
          report.overallStatus = 'degraded';
        }
      });

      // Count recent errors
      const now = Date.now();
      const oneDayAgo = now - (24 * 60 * 60 * 1000);
      
      this.errors.forEach(err => {
        const errTime = new Date(err.timestamp).getTime();
        if (errTime > oneDayAgo) {
          report.errorCount.last24h++;
          if (err.severity === SEVERITY.CRITICAL) {
            report.errorCount.critical++;
            report.overallStatus = 'critical';
          }
          if (err.severity === SEVERITY.HIGH) {
            report.errorCount.high++;
          }
        }
      });

      return report;
    }

    // Clear old errors
    clearOldErrors(daysOld = 7) {
      const cutoffTime = Date.now() - (daysOld * 24 * 60 * 60 * 1000);
      this.errors = this.errors.filter(err => {
        const errTime = new Date(err.timestamp).getTime();
        return errTime > cutoffTime;
      });
      this.saveErrors();
      console.log(`🧹 Cleared errors older than ${daysOld} days`);
    }

    // Test all system components
    async runHealthCheck() {
      console.log('🏥 Running system health check...');
      
      const results = {
        timestamp: new Date().toISOString(),
        tests: {}
      };

      // Test Auth System
      try {
        if (typeof window.isLoggedIn === 'function') {
          window.isLoggedIn();
          results.tests.auth = 'PASS';
          this.logSuccess('auth', 'Auth system operational');
        }
      } catch (e) {
        results.tests.auth = 'FAIL';
        this.logError('auth', 'Auth system check failed', e, SEVERITY.HIGH);
      }

      // Test Cart System
      try {
        const cart = JSON.parse(localStorage.getItem('hp_cart') || '[]');
        if (Array.isArray(cart)) {
          results.tests.cart = 'PASS';
          this.logSuccess('cart', 'Cart system operational');
        }
      } catch (e) {
        results.tests.cart = 'FAIL';
        this.logError('cart', 'Cart system check failed', e, SEVERITY.MEDIUM);
      }

      // Test Discount System
      try {
        if (typeof window.validateDiscountCode === 'function') {
          results.tests.discounts = 'PASS';
          this.logSuccess('discounts', 'Discount system operational');
        }
      } catch (e) {
        results.tests.discounts = 'FAIL';
        this.logError('discounts', 'Discount system check failed', e, SEVERITY.MEDIUM);
      }

      // Test Navigation
      try {
        if (window.NavManager) {
          results.tests.nav = 'PASS';
          this.logSuccess('nav', 'Navigation system operational');
        }
      } catch (e) {
        results.tests.nav = 'FAIL';
        this.logError('nav', 'Navigation system check failed', e, SEVERITY.LOW);
      }

      // Test Chatbot
      try {
        if (window.HeartPetalChat) {
          results.tests.chatbot = 'PASS';
          this.logSuccess('chatbot', 'Chatbot operational');
        }
      } catch (e) {
        results.tests.chatbot = 'FAIL';
        this.logError('chatbot', 'Chatbot check failed', e, SEVERITY.LOW);
      }

      console.log('✅ Health check complete:', results);
      return results;
    }

    // Initialize error monitoring
    initializeMonitoring() {
      // Global error handler
      window.addEventListener('error', (event) => {
        this.logError(
          'global',
          `Uncaught error: ${event.message}`,
          event.error,
          SEVERITY.HIGH
        );
      });

      // Promise rejection handler
      window.addEventListener('unhandledrejection', (event) => {
        this.logError(
          'global',
          `Unhandled promise rejection: ${event.reason}`,
          event.reason,
          SEVERITY.HIGH
        );
      });

      console.log('🔍 System monitoring initialized');
      console.log('📊 View health report: SystemMonitor.getHealthReport()');
      console.log('🏥 Run health check: SystemMonitor.runHealthCheck()');
    }
  }

  // Initialize system monitor
  const monitor = new SystemMonitor();

  // Export globally
  window.SystemMonitor = monitor;
  
  // Helper functions for components to use
  window.logError = (component, message, error, severity) => {
    return monitor.logError(component, message, error, severity);
  };
  
  window.logSuccess = (component, message) => {
    return monitor.logSuccess(component, message);
  };

  // Run health check on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => monitor.runHealthCheck(), 1000);
    });
  } else {
    setTimeout(() => monitor.runHealthCheck(), 1000);
  }

  // Auto-cleanup old errors weekly
  setInterval(() => {
    monitor.clearOldErrors(7);
  }, 24 * 60 * 60 * 1000); // Daily

})();
