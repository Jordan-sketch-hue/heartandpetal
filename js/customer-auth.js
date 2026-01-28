// Heart & Petal Customer Auth (localStorage-based)
const CUSTOMER_KEY = 'hp_customers';
const loginForm = document.getElementById('customer-login-form');
const registerForm = document.getElementById('customer-register-form');
const loginError = document.getElementById('login-error');
const registerSuccess = document.getElementById('register-success');

function getCustomers() {
  return JSON.parse(localStorage.getItem(CUSTOMER_KEY) || '[]');
}
function saveCustomers(customers) {
  localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customers));
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
    let customers = getCustomers();
    const user = customers.find(c => c.email === email && c.password === password);
    if (user) {
      loginError.classList.add('hidden');
      localStorage.setItem('hp_last_login', email); // Set session for profile
      localStorage.setItem('hp_customer_name', user.name); // Store customer name
      
      // Show success message and redirect
      const loginBtn = loginForm.querySelector('button[type="submit"]');
      loginBtn.textContent = 'Logging in...';
      loginBtn.disabled = true;
      
      // Redirect after brief delay
      setTimeout(() => {
        window.location.href = 'profile.html';
      }, 500);
    } else {
      loginError.classList.remove('hidden');
    }
  };
}
