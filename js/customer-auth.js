// Heart & Petal Customer Auth (localStorage-based)
const CUSTOMER_KEY = 'hp_customers';

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('customer-login-form');
  const registerForm = document.getElementById('customer-register-form');
  const loginError = document.getElementById('login-error');
  const registerSuccess = document.getElementById('register-success');

  function getCustomers() {
    try {
      return JSON.parse(localStorage.getItem(CUSTOMER_KEY) || '[]');
    } catch (e) {
      console.error('Error loading customers:', e);
      return [];
    }
  }
  
  function saveCustomers(customers) {
    try {
      localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customers));
    } catch (e) {
      console.error('Error saving customers:', e);
    }
  }

  if (registerForm) {
    registerForm.onsubmit = function(e) {
      e.preventDefault();
      const name = document.getElementById('reg-name').value.trim();
      const email = document.getElementById('reg-email').value.trim().toLowerCase();
      const password = document.getElementById('reg-password').value;
      const address = document.getElementById('reg-address').value.trim();
      if (!name || !email || !password || !address) return;
      let customers = getCustomers();
      if (customers.find(c => c.email === email)) {
        registerSuccess.textContent = 'Email already registered.';
        registerSuccess.classList.remove('hidden');
        registerSuccess.classList.remove('text-green-700');
        registerSuccess.classList.add('text-red-600');
        return;
      }
      customers.push({ name, email, password, address });
      saveCustomers(customers);
      registerSuccess.textContent = 'Registration successful! You can now log in.';
      registerSuccess.classList.remove('hidden', 'text-red-600');
      registerSuccess.classList.add('text-green-700');
      registerForm.reset();
    };
  }

  if (loginForm) {
    loginForm.onsubmit = function(e) {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim().toLowerCase();
      const password = document.getElementById('login-password').value;
      
      // Use modern auth system if available
      if (window.loginUser && typeof window.loginUser === 'function') {
        const loginBtn = loginForm.querySelector('button[type="submit"]');
        loginBtn.textContent = 'Logging in...';
        loginBtn.disabled = true;
        
        const result = window.loginUser(email, password);
        
        if (result.success) {
          loginError.classList.add('hidden');
          
          // Trigger navigation update
          if (window.updateNavigation) {
            window.updateNavigation();
          }
          
          // Dispatch login event for cross-component sync
          window.dispatchEvent(new CustomEvent('hp:login', { 
            detail: { user: result.user } 
          }));
          
          // Show success notification
          if (window.showNotification) {
            window.showNotification(`Welcome back, ${result.user.name}!`, 'success');
          }
          
          setTimeout(() => {
            window.location.href = 'profile.html';
          }, 500);
        } else {
          loginBtn.textContent = 'Login';
          loginBtn.disabled = false;
          loginError.textContent = result.error || 'Invalid email or password';
          loginError.classList.remove('hidden');
        }
      } else {
        // Fallback to legacy auth
        let customers = getCustomers();
        const user = customers.find(c => c.email === email && c.password === password);
        if (user) {
          loginError.classList.add('hidden');
          localStorage.setItem('hp_last_login', email);
          localStorage.setItem('hp_customer_name', user.name);
          
          const loginBtn = loginForm.querySelector('button[type="submit"]');
          loginBtn.textContent = 'Logging in...';
          loginBtn.disabled = true;
          
          // Trigger navigation update
          if (window.updateNavigation) {
            window.updateNavigation();
          }
          
          setTimeout(() => {
            window.location.href = 'profile.html';
          }, 500);
        } else {
          loginError.classList.remove('hidden');
        }
      }
    };
  }
});
