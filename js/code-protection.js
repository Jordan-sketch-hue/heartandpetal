// Heart & Petal - Code Protection System
// Discourages casual code inspection (NOT foolproof - real security is server-side)

(function() {
  'use strict';

  // 1. Disable Right-Click
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    console.log('🔒 Right-click disabled');
    return false;
  });

  // 2. Disable Common Keyboard Shortcuts
  document.addEventListener('keydown', function(e) {
    // F12 (DevTools)
    if (e.keyCode === 123) {
      e.preventDefault();
      return false;
    }
    
    // Ctrl+Shift+I (Inspect)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
      e.preventDefault();
      return false;
    }
    
    // Ctrl+Shift+J (Console)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
      e.preventDefault();
      return false;
    }
    
    // Ctrl+U (View Source)
    if (e.ctrlKey && e.keyCode === 85) {
      e.preventDefault();
      return false;
    }
    
    // Ctrl+S (Save Page)
    if (e.ctrlKey && e.keyCode === 83) {
      e.preventDefault();
      return false;
    }
    
    // Ctrl+Shift+C (Inspect Element)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
      e.preventDefault();
      return false;
    }
  });

  // 3. Detect DevTools Opening
  let devtoolsOpen = false;
  const threshold = 160;

  const detectDevTools = () => {
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    
    if (widthThreshold || heightThreshold) {
      if (!devtoolsOpen) {
        devtoolsOpen = true;
        console.clear();
        console.log('%c🔒 STOP!', 'color: red; font-size: 50px; font-weight: bold;');
        console.log('%cThis is a browser feature intended for developers.', 'font-size: 18px;');
        console.log('%cIf someone told you to copy-paste something here, it is a scam.', 'font-size: 16px; color: red;');
        console.log('%cUnauthorized access to source code violates our Terms of Service.', 'font-size: 14px;');
        
        // Optional: Redirect after warning
        // setTimeout(() => window.location.href = 'index.html', 3000);
      }
    } else {
      devtoolsOpen = false;
    }
  };

  // Check every 1 second
  setInterval(detectDevTools, 1000);

  // 4. Disable Text Selection on Sensitive Areas
  const style = document.createElement('style');
  style.textContent = `
    .no-select {
      -webkit-user-select: none !important;
      -moz-user-select: none !important;
      -ms-user-select: none !important;
      user-select: none !important;
    }
  `;
  document.head.appendChild(style);

  // 5. Console Warning on Page Load
  console.clear();
  console.log('%c🔒 Heart & Petal - Protected Content', 'color: #8B0000; font-size: 24px; font-weight: bold;');
  console.log('%cWARNING: Unauthorized access to this code is prohibited.', 'color: red; font-size: 16px;');
  console.log('%cAll activities are monitored and logged.', 'font-size: 14px;');
  console.log('%c©2026 Heart & Petal. All rights reserved.', 'color: gray; font-size: 12px;');

  // 6. Detect Debugger
  setInterval(function() {
    (function() {
      return false;
    })
    ['constructor']('debugger')();
  }, 100);

  // 7. Clear Console Periodically
  setInterval(function() {
    if (devtoolsOpen) {
      console.clear();
      console.log('%c🔒 Console Cleared - DevTools Detected', 'color: red; font-size: 20px;');
    }
  }, 2000);

  // 8. Prevent Drag & Drop (to prevent downloading images/code)
  document.addEventListener('dragstart', function(e) {
    e.preventDefault();
    return false;
  });

  // 9. Watermark Console with Ownership
  const watermark = () => {
    console.log(
      '%c ',
      `font-size: 1px;
       padding: 100px 200px;
       background-image: url('https://res.cloudinary.com/dij2fdtw4/image/upload/v1769602073/give_a_rosebud_favicon_in_red_please_xqnp4v.jpg');
       background-size: contain;
       background-repeat: no-repeat;`
    );
  };
  watermark();

  // 10. Obfuscate Critical Variables (example)
  window._hp_protected = true;
  window._hp_timestamp = Date.now();
  
  console.log('✅ Code protection active');
})();
