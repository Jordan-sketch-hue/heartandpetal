// Dynamic Responsive Navigation System
document.addEventListener('DOMContentLoaded', function() {
  // Support both ID variations
  const mobileMenuBtn = document.getElementById('mobile-menu-btn') || document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const logoImg = document.querySelector('header img[alt*="Logo"]');
  
  console.log('🔧 Mobile menu setup:', {
    button: mobileMenuBtn ? 'Found' : 'NOT FOUND',
    menu: mobileMenu ? 'Found' : 'NOT FOUND'
  });
  
  // Mobile menu toggle
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      mobileMenu.classList.toggle('hidden');
      console.log('📱 Mobile menu toggled, hidden:', mobileMenu.classList.contains('hidden'));
    });
    
    // Close menu when link is clicked
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', function() {
        mobileMenu.classList.add('hidden');
      });
    });
    
    console.log('✅ Mobile menu initialized successfully');
  } else {
    console.error('❌ Mobile menu setup failed - missing elements');
  }
  
  // Dynamic logo loading with fallback
  if (logoImg) {
    logoImg.onerror = function() {
      // Fallback: Use a data URI placeholder or simple text
      this.style.display = 'none';
      // Create fallback
      const fallback = document.createElement('div');
      fallback.className = 'h-8 md:h-10 w-8 md:w-10 flex items-center justify-center bg-deep-red text-white font-bold rounded text-xs';
      fallback.textContent = 'HP';
      this.parentNode.insertBefore(fallback, this);
    };
    
    // Force reload with cache bust
    const originalSrc = logoImg.src;
    if (originalSrc && !originalSrc.includes('?')) {
      logoImg.src = originalSrc + '?t=' + Date.now();
    }
  }
  
  // Handle screen resize for responsive adjustments
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      // Close mobile menu on resize to desktop
      if (window.innerWidth >= 1024 && mobileMenu) {
        mobileMenu.classList.add('hidden');
      }
    }, 250);
  });
  
  // Ensure mobile menu is closed on page load
  if (mobileMenu && window.innerWidth >= 1024) {
    mobileMenu.classList.add('hidden');
  }
});

// Dynamic favicon loader with fallback
function loadFavicon() {
  const favicon = document.querySelector('link[rel="icon"]');
  if (favicon) {
    const originalHref = favicon.href;
    
    // Test if favicon loads
    const img = new Image();
    img.onerror = function() {
      // Fallback to data URI with red square
      favicon.href = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%238B3A3A" width="100" height="100"/><text x="50" y="60" font-size="60" font-weight="bold" fill="white" text-anchor="middle" font-family="Arial">H</text></svg>';
    };
    img.src = originalHref + '?t=' + Date.now();
  }
}

// Load favicon when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadFavicon);
} else {
  loadFavicon();
}
