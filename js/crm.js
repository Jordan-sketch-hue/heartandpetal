// Heart & Petal CRM logic
// Preset admin credentials
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'petal2026';

// LocalStorage keys
const CUSTOMERS_KEY = 'hp_crm_customers';
const ORDERS_KEY = 'hp_crm_orders';

const loginForm = document.getElementById('crm-login-form');
const loginDiv = document.getElementById('crm-login');
const dashDiv = document.getElementById('crm-dashboard');
const loginError = document.getElementById('crm-login-error');

if (loginForm) {
  loginForm.onsubmit = function(e) {
    e.preventDefault();
    
    try {
      const user = document.getElementById('crm-username').value.trim();
      const pass = document.getElementById('crm-password').value;
      
      if (user === ADMIN_USER && pass === ADMIN_PASS) {
        loginDiv.classList.add('hidden');
        dashDiv.classList.remove('hidden');
        
        // Log successful login
        if (window.logSuccess) {
          window.logSuccess('crm', 'Admin login successful');
        }
        console.log('✅ CRM Admin login successful');
        
      } else {
        loginError.classList.remove('hidden');
        
        // Log failed login attempt
        if (window.logError) {
          window.logError('crm', 'Failed login attempt', null, 'medium');
        }
        console.warn('⚠️ CRM login attempt failed');
      }
    } catch (error) {
      console.error('CRM Login Error:', error);
      if (window.logError) {
        window.logError('crm', 'Login system error', error, 'critical');
      }
      loginError.textContent = 'System error. Please try again.';
      loginError.classList.remove('hidden');
    }
  };
}

// Customer registration (sync with customer-login.html)
const regForm = document.getElementById('crm-register-form');
const customersTable = document.getElementById('crm-customers');

function loadCustomers() {
  if (!customersTable) return;
  
  try {
    // Merge CRM and customer-login.html customers
    const crmCustomers = JSON.parse(localStorage.getItem(CUSTOMERS_KEY) || '[]');
    const authCustomers = JSON.parse(localStorage.getItem('hp_customers') || '[]');
    
    // Merge by email, prefer CRM data for address, but add name/email/address from both
    const merged = [...crmCustomers];
    authCustomers.forEach(c => {
      if (!merged.find(m => m.email === c.email)) {
        merged.push({ name: c.name, email: c.email, address: c.address });
      }
    });
    
    customersTable.innerHTML = merged.map(c => 
      `<tr><td class='p-2'>${c.name || 'N/A'}</td><td class='p-2'>${c.email || 'N/A'}</td><td class='p-2'>${c.address || 'N/A'}</td></tr>`
    ).join('');
    
    if (window.logSuccess) {
      window.logSuccess('crm', `Loaded ${merged.length} customers`);
    }
    
  } catch (error) {
    console.error('Error loading customers:', error);
    if (window.logError) {
      window.logError('crm', 'Failed to load customers', error, 'high');
    }
    if (customersTable) {
      customersTable.innerHTML = '<tr><td colspan="3" class="p-2 text-red-600">Error loading customers</td></tr>';
    }
  }
}
if (regForm) {
  regForm.onsubmit = function(e) {
    e.preventDefault();
    
    try {
      const name = document.getElementById('reg-name').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const address = document.getElementById('reg-address').value.trim();
      
      if (name && email && address) {
        const customers = JSON.parse(localStorage.getItem(CUSTOMERS_KEY) || '[]');
        
        // Check for duplicate email
        if (customers.find(c => c.email === email)) {
          if (window.showNotification) {
            window.showNotification('Customer with this email already exists', 'warning');
          }
          if (window.logError) {
            window.logError('crm', 'Duplicate customer email', null, 'low');
          }
          return;
        }
        
        customers.push({ name, email, address });
        localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
        
        if (window.logSuccess) {
          window.logSuccess('crm', `Registered customer: ${email}`);
        }
        
        loadCustomers();
        regForm.reset();
        
        if (window.showNotification) {
          window.showNotification('Customer registered successfully', 'success');
        }
      }
    } catch (error) {
      console.error('Error registering customer:', error);
      if (window.logError) {
        window.logError('crm', 'Failed to register customer', error, 'high');
      }
      if (window.showNotification) {
        window.showNotification('Failed to register customer', 'error');
      }
    }
  };
  loadCustomers();
} else {
  // If not on CRM registration form, still load merged customers
  loadCustomers();
}

// Order tracking
const orderForm = document.getElementById('crm-order-form');
const ordersTable = document.getElementById('crm-orders');
function loadOrders() {
  if (!ordersTable) return;
  const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
  ordersTable.innerHTML = orders.map((o, idx) => `
    <tr>
      <td class='p-2'>${o.id}</td>
      <td class='p-2'>${o.email}</td>
      <td class='p-2'>${o.address || ''}</td>
      <td class='p-2'>${o.type || ''}</td>
      <td class='p-2'>
        <input type='text' value='${o.status}' data-idx='${idx}' class='border border-charcoal rounded px-2 py-1 w-24 status-input'>
      </td>
      <td class='p-2'>
        <button data-idx='${idx}' class='bg-deep-red text-ivory px-2 py-1 rounded update-status-btn'>Update</button>
      </td>
    </tr>
  `).join('');
  // Add event listeners for update buttons
  document.querySelectorAll('.update-status-btn').forEach(btn => {
    btn.onclick = function() {
      const idx = this.getAttribute('data-idx');
      const statusInput = document.querySelector(`input.status-input[data-idx='${idx}']`);
      const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
      orders[idx].status = statusInput.value;
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
      showSuccess('Order status updated!');
      loadOrders();
    };
  });
}
if (orderForm) {
  orderForm.onsubmit = function(e) {
    e.preventDefault();
    const id = document.getElementById('order-id').value.trim();
    const email = document.getElementById('order-email').value.trim();
    const address = document.getElementById('order-address').value.trim();
    const type = document.getElementById('order-type').value.trim();
    const status = document.getElementById('order-status').value.trim();
    if (id && email && status) {
      const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
      orders.push({ id, email, address, type, status });
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
      loadOrders();
      orderForm.reset();
      // Simulate confirmation/follow-up email
      setTimeout(() => {
        showSuccess('Order confirmation/follow-up email sent to ' + email + ' (simulated).');
      }, 500);
    }
  };
  loadOrders();
} else {
  loadOrders();
}
