/**
 * Heart & Petal Mobile Menu System
 * Universal mobile navigation handler
 * Works across all pages with consistent behavior
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    buttonIds: ['mobile-menu-btn', 'mobile-menu-toggle'],
    menuId: 'mobile-menu',
    activeClass: 'menu-open',
    debugMode: true
  };

  // Debug logger
  function log(message, data) {
    if (CONFIG.debugMode) {
      console.log(`🔧 [MobileMenu] ${message}`, data || '');
    }
  }

  // Initialize mobile menu
  function initMobileMenu() {
    log('Initializing mobile menu system...');

    // Find menu button (try multiple IDs)
    let menuButton = null;
    for (const id of CONFIG.buttonIds) {
      menuButton = document.getElementById(id);
      if (menuButton) {
        log(`Found menu button with ID: ${id}`);
        break;
      }
    }

    // Find menu container
    const menu = document.getElementById(CONFIG.menuId);

    // Validate elements
    if (!menuButton) {
      log('ERROR: Menu button not found!', CONFIG.buttonIds);
      return false;
    }

    if (!menu) {
      log('ERROR: Menu container not found!', CONFIG.menuId);
      return false;
    }

    log('✅ All elements found', {
      button: menuButton.id,
      menu: menu.id
    });

    // Toggle function
    function toggleMenu(event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      const isHidden = menu.classList.contains('hidden');
      
      if (isHidden) {
        // Open menu
        menu.classList.remove('hidden');
        document.body.classList.add(CONFIG.activeClass);
        log('📱 Menu OPENED');
      } else {
        // Close menu
        menu.classList.add('hidden');
        document.body.classList.remove(CONFIG.activeClass);
        log('📱 Menu CLOSED');
      }
    }

    // Attach click handler to button
    menuButton.addEventListener('click', toggleMenu);
    log('✅ Click handler attached to button');

    // Close menu when clicking on links
    const menuLinks = menu.querySelectorAll('a');
    menuLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        menu.classList.add('hidden');
        document.body.classList.remove(CONFIG.activeClass);
        log('📱 Menu closed (link clicked)');
      });
    });
    log(`✅ Close handlers attached to ${menuLinks.length} links`);

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      const isClickInsideMenu = menu.contains(event.target);
      const isClickOnButton = menuButton.contains(event.target);
      
      if (!isClickInsideMenu && !isClickOnButton && !menu.classList.contains('hidden')) {
        menu.classList.add('hidden');
        document.body.classList.remove(CONFIG.activeClass);
        log('📱 Menu closed (clicked outside)');
      }
    });
    log('✅ Outside click handler attached');

    // Close menu on window resize to desktop
    let resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        if (window.innerWidth >= 1024) {
          menu.classList.add('hidden');
          document.body.classList.remove(CONFIG.activeClass);
          log('📱 Menu closed (resized to desktop)');
        }
      }, 250);
    });
    log('✅ Resize handler attached');

    log('🎉 Mobile menu system fully initialized!');
    return true;
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileMenu);
  } else {
    // DOM already loaded
    initMobileMenu();
  }

  // Expose init function globally for manual initialization if needed
  window.initMobileMenu = initMobileMenu;

})();
