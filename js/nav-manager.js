// Heart & Petal Dynamic Navigation Manager
// Intelligent, session-aware navigation that adapts to authentication state

(function() {
  'use strict';

  // Navigation state management
  const NavState = {
    GUEST: 'guest',
    AUTHENTICATED: 'authenticated',
    ADMIN: 'admin'
  };

  class NavigationManager {
    constructor() {
      this.currentState = NavState.GUEST;
      this.currentUser = null;
      this.initialized = false;
    }

    // Initialize navigation system
    init() {
      if (this.initialized) return;
      
      this.updateNavigationState();
      this.attachEventListeners();
      this.initialized = true;
      
      // Monitor session changes
      this.monitorSessionChanges();
    }

    // Determine current navigation state
    updateNavigationState() {
      const session = this.getActiveSession();
      const crmAdminLoggedIn = localStorage.getItem('hp_crm_admin_logged_in') === 'true';
      
      if (!session && !crmAdminLoggedIn) {
        this.currentState = NavState.GUEST;
        this.currentUser = null;
      } else {
        this.currentUser = session ? this.getUserFromSession(session) : null;
        this.currentState = crmAdminLoggedIn || this.isAdminSession(session) ? NavState.ADMIN : NavState.AUTHENTICATED;
      }
      
      this.renderNavigation();
    }

    // Get active session with validation
    getActiveSession() {
      try {
        // Check for customer session
        const sessionData = localStorage.getItem('hp_session');
        if (sessionData) {
          const session = JSON.parse(sessionData);
          
          // Validate session hasn't expired
          if (session.expiresAt && Date.now() < session.expiresAt) {
            return session;
          } else {
            // Session expired - clean up
            this.clearSession();
            return null;
          }
        }
        
        // Fallback: Check legacy login
        const lastLogin = localStorage.getItem('hp_last_login');
        if (lastLogin) {
          return { email: lastLogin, legacy: true };
        }
        
        return null;
      } catch (e) {
        console.error('Session validation error:', e);
        return null;
      }
    }

    // Get user data from session
    getUserFromSession(session) {
      try {
        if (window.getCurrentUser && typeof window.getCurrentUser === 'function') {
          return window.getCurrentUser();
        }
        
        // Fallback: Get from localStorage
        const customers = JSON.parse(localStorage.getItem('hp_customers') || '[]');
        const user = customers.find(c => c.email === session.email);
        
        if (user) {
          return {
            name: user.name,
            email: user.email,
            address: user.address
          };
        }
        
        return null;
      } catch (e) {
        console.error('User retrieval error:', e);
        return null;
      }
    }

    // Check if session is admin
    isAdminSession(session) {
      return session && session.email && session.email.includes('admin');
    }

    // Render navigation based on state
    renderNavigation() {
      const desktopNav = document.querySelector('nav.hidden.lg\\:flex');
      const mobileMenu = document.getElementById('mobile-menu');
      
      if (!desktopNav && !mobileMenu) return;

      switch (this.currentState) {
        case NavState.AUTHENTICATED:
          this.renderAuthenticatedNav(desktopNav, mobileMenu);
          break;
        
        case NavState.ADMIN:
          this.renderAdminNav(desktopNav, mobileMenu);
          break;
        
        case NavState.GUEST:
        default:
          this.renderGuestNav(desktopNav, mobileMenu);
          break;
      }
    }

    // Guest navigation (not logged in)
    renderGuestNav(desktopNav, mobileMenu) {
      if (desktopNav) {
        const authButton = desktopNav.querySelector('.relative.group');
        if (authButton) {
          authButton.innerHTML = `
            <button class="hover:text-champagne-gold transition focus:outline-none text-sm md:text-base">Login | Register</button>
            <div class="absolute right-0 mt-2 w-48 bg-white border border-charcoal rounded shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition z-50">
              <a href="admin.html" class="block px-4 py-2 hover:bg-blush-pink/40 text-sm">Admin</a>
              <a href="customer-login.html" class="block px-4 py-2 hover:bg-blush-pink/40 text-sm">Customer</a>
            </div>
          `;
        }
      }
      
      if (mobileMenu) {
        // Remove authenticated links if present
        const profileLink = mobileMenu.querySelector('[href="profile.html"]');
        const logoutBtn = mobileMenu.querySelector('#mobile-logout-btn');
        
        if (profileLink) profileLink.remove();
        if (logoutBtn) logoutBtn.remove();
        
        // Ensure login links are present
        if (!mobileMenu.querySelector('[href="customer-login.html"]')) {
          mobileMenu.innerHTML += `
            <a href="admin.html" class="block px-4 py-2 text-sm hover:bg-blush-pink/40">Admin Login</a>
            <a href="customer-login.html" class="block px-4 py-2 text-sm hover:bg-blush-pink/40">Customer Login</a>
          `;
        }
      }
    }

    // Authenticated user navigation
    renderAuthenticatedNav(desktopNav, mobileMenu) {
      const userName = this.currentUser ? this.currentUser.name : 'User';
      const firstName = userName.split(' ')[0];
      
      if (desktopNav) {
        const authButton = desktopNav.querySelector('.relative.group');
        if (authButton) {
          authButton.innerHTML = `
            <button class="hover:text-champagne-gold transition focus:outline-none text-sm md:text-base flex items-center gap-1">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>${firstName}</span>
            </button>
            <div class="absolute right-0 mt-2 w-48 bg-white border border-charcoal rounded shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition z-50">
              <a href="profile.html" class="block px-4 py-2 hover:bg-blush-pink/40 text-sm">My Profile</a>
              <a href="tracking.html" class="block px-4 py-2 hover:bg-blush-pink/40 text-sm">Track Orders</a>
              <a href="wishlist.html" class="block px-4 py-2 hover:bg-blush-pink/40 text-sm">Wishlist</a>
              <button id="desktop-logout-btn" class="w-full text-left px-4 py-2 hover:bg-blush-pink/40 text-sm text-deep-red">Logout</button>
            </div>
          `;
          
          // Attach logout handler
          const logoutBtn = authButton.querySelector('#desktop-logout-btn');
          if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
          }
        }
      }
      
      if (mobileMenu) {
        // Remove login links
        const adminLink = mobileMenu.querySelector('[href="admin.html"]');
        const customerLoginLink = mobileMenu.querySelector('[href="customer-login.html"]');
        
        if (adminLink && adminLink.textContent.includes('Login')) adminLink.remove();
        if (customerLoginLink) customerLoginLink.remove();
        
        // Add authenticated links if not present
        if (!mobileMenu.querySelector('[href="profile.html"]')) {
          mobileMenu.innerHTML += `
            <a href="profile.html" class="block px-4 py-2 text-sm hover:bg-blush-pink/40 flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              ${userName}'s Profile
            </a>
            <a href="tracking.html" class="block px-4 py-2 text-sm hover:bg-blush-pink/40">Track Orders</a>
            <a href="wishlist.html" class="block px-4 py-2 text-sm hover:bg-blush-pink/40">Wishlist</a>
            <button id="mobile-logout-btn" class="w-full text-left px-4 py-2 text-sm hover:bg-blush-pink/40 text-deep-red">Logout</button>
          `;
          
          // Attach logout handler
          const logoutBtn = mobileMenu.querySelector('#mobile-logout-btn');
          if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
          }
        }
      }
    }

    // Admin navigation
    renderAdminNav(desktopNav, mobileMenu) {
      if (desktopNav) {
        const authButton = desktopNav.querySelector('.relative.group');
        if (authButton) {
          authButton.innerHTML = `
            <button class="hover:text-champagne-gold transition focus:outline-none text-sm md:text-base flex items-center gap-1">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Admin</span>
            </button>
            <div class="absolute right-0 mt-2 w-48 bg-white border border-charcoal rounded shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition z-50">
              <a href="admin.html" class="block px-4 py-2 hover:bg-blush-pink/40 text-sm">Dashboard</a>
              <button id="desktop-logout-btn" class="w-full text-left px-4 py-2 hover:bg-blush-pink/40 text-sm text-deep-red">Logout</button>
            </div>
          `;
          
          const logoutBtn = authButton.querySelector('#desktop-logout-btn');
          if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
          }
        }
      }
    }

    // Handle logout
    handleLogout() {
      // Use global logout function if available
      if (window.logoutUser && typeof window.logoutUser === 'function') {
        window.logoutUser();
      } else {
        this.clearSession();
      }
      
      // Show notification
      if (window.showNotification && typeof window.showNotification === 'function') {
        window.showNotification('Logged out successfully', 'success');
      }
      
      // Redirect to home with slight delay
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 500);
    }

    // Clear session data
    clearSession() {
      localStorage.removeItem('hp_session');
      localStorage.removeItem('hp_last_login');
      localStorage.removeItem('hp_customer_name');
    }

    // Attach event listeners
    attachEventListeners() {
      // Listen for storage events (cross-tab sync)
      window.addEventListener('storage', (e) => {
        if (e.key === 'hp_session' || e.key === 'hp_last_login') {
          this.updateNavigationState();
        }
      });
      
      // Listen for custom login event
      window.addEventListener('hp:login', () => {
        this.updateNavigationState();
      });
      
      // Listen for custom logout event
      window.addEventListener('hp:logout', () => {
        this.updateNavigationState();
      });
    }

    // Monitor session changes periodically
    monitorSessionChanges() {
      // Check session every 30 seconds
      setInterval(() => {
        const session = this.getActiveSession();
        
        // If session expired while page was open
        if (!session && this.currentState !== NavState.GUEST) {
          this.updateNavigationState();
          
          if (window.showNotification && typeof window.showNotification === 'function') {
            window.showNotification('Session expired. Please login again.', 'info');
          }
        }
      }, 30000);
    }

    // Public method to refresh navigation
    refresh() {
      this.updateNavigationState();
    }
  }

  // Initialize on DOM ready
  const navManager = new NavigationManager();
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => navManager.init());
  } else {
    navManager.init();
  }

  // Export to window for external access
  window.NavManager = navManager;

  // Helper function for other scripts to trigger nav update
  window.updateNavigation = function() {
    if (window.NavManager) {
      window.NavManager.refresh();
    }
  };

})();
