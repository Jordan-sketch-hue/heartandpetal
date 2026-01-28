// Heart & Petal Global Error Handler & Page Load Monitor
// Handles missing pages, broken images, and runtime errors with branded messaging

(function() {
  'use strict';

  // Error logging function
  function logError(type, message, details = {}) {
    console.error(`[${type}] ${message}`, details);
  }

  // Handle page load errors
  window.addEventListener('error', (event) => {
    if (event.message.includes('Cannot find module')) {
      logError('MODULE_ERROR', event.message);
      showErrorMessage('Module loading failed');
    }
  }, true);

  // Handle fetch/network errors
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason instanceof Response && !event.reason.ok) {
      logError('FETCH_ERROR', `HTTP ${event.reason.status}`, { url: event.reason.url });
      showErrorMessage('Failed to load resource');
    }
  });

  // Handle broken images - use CSS gradient instead of external file
  document.addEventListener('error', (event) => {
    if (event.target.tagName === 'IMG') {
      // Replace image with CSS placeholder (no external file needed)
      event.target.style.background = 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)';
      event.target.style.color = '#999';
      event.target.style.display = 'flex';
      event.target.style.alignItems = 'center';
      event.target.style.justifyContent = 'center';
      event.target.style.fontSize = '12px';
      event.target.style.minHeight = '200px';
      event.target.alt = 'Image unavailable';
      event.target.textContent = 'Image unavailable';
      logError('IMAGE_ERROR', 'Failed to load image', { src: event.target.src });
    }
  }, true);

  // Monitor page readiness
  function checkPageReady() {
    const requiredElements = {
      header: () => document.querySelector('header'),
      footer: () => document.querySelector('footer'),
      main: () => document.querySelector('main') || document.querySelector('[role="main"]')
    };

    const missing = Object.entries(requiredElements)
      .filter(([key, checker]) => !checker())
      .map(([key]) => key);

    if (missing.length > 0) {
      logError('STRUCTURE_WARNING', 'Missing page elements', { missing });
    }
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkPageReady);
  } else {
    checkPageReady();
  }

  // Handle page visibility/redirect errors
  function showErrorMessage(message) {
    // Only show if we're not already on error page
    if (!window.location.pathname.includes('error.html')) {
      console.warn('Page error detected:', message);
    }
  }

  // Prevent localStorage errors
  window.getLocalStorage = function(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      logError('STORAGE_ERROR', 'Failed to read from localStorage', { key, error: e.message });
      return defaultValue;
    }
  };

  window.setLocalStorage = function(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      logError('STORAGE_ERROR', 'Failed to write to localStorage', { key, error: e.message });
      return false;
    }
  };

  // Performance monitoring
  window.addEventListener('load', () => {
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      console.info(`Page loaded in ${loadTime}ms`);
      
      if (loadTime > 5000) {
        logError('PERFORMANCE_WARNING', 'Page took too long to load', { time: loadTime });
      }
    }
  });

  // Graceful degradation for missing features
  if (!window.localStorage) {
    console.warn('localStorage not available - using in-memory fallback');
    window._memoryStorage = {};
    window.localStorage = {
      getItem: (key) => window._memoryStorage[key] || null,
      setItem: (key, value) => { window._memoryStorage[key] = value; },
      removeItem: (key) => { delete window._memoryStorage[key]; },
      clear: () => { window._memoryStorage = {}; }
    };
  }

  // Log initial page info
  console.log('%c❤️ Heart & Petal', 'font-size: 14px; color: #C21807; font-weight: bold;');
  console.log('Page loaded successfully - monitoring for errors');

})();
