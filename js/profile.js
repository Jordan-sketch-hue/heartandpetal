// Heart & Petal Customer Profile & Order History with Tabbed Navigation
// Loads customer info and orders from localStorage

function getCurrentCustomer() {
  const customers = JSON.parse(localStorage.getItem('hp_customers') || '[]');
  const email = localStorage.getItem('hp_last_login');
  if (!email) return null;
  return customers.find(c => c.email === email);
}

// Tab Navigation
document.addEventListener('DOMContentLoaded', function() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const tabName = this.getAttribute('data-tab');
      
      // Update button styles
      tabBtns.forEach(b => {
        b.classList.remove('border-deep-red', 'bg-pink-50', 'text-deep-red');
        b.classList.add('border-transparent', 'text-gray-600');
      });
      this.classList.add('border-deep-red', 'bg-pink-50', 'text-deep-red');
      this.classList.remove('border-transparent', 'text-gray-600');
      
      // Show active tab panel
      tabPanels.forEach(panel => panel.classList.add('hidden'));
      document.getElementById(tabName + '-tab').classList.remove('hidden');
    });
  });

  // Initialize
  checkLogin();
  renderProfile();
  renderOrders();
  loadWishlist();
  renderCoupons();
  setupTracking();
  setupLogout();
});

function checkLogin() {
  const customer = getCurrentCustomer();
  if (!customer) {
    window.location.href = 'customer-login.html';
    return;
  }
  // Update welcome message
  const nameSpan = document.getElementById('customer-name');
  if (nameSpan) nameSpan.textContent = customer.name;
}

function renderProfile() {
  const customer = getCurrentCustomer();
  if (!customer) return;
  
  document.getElementById('profile-name').value = customer.name;
  document.getElementById('profile-email').value = customer.email;
  document.getElementById('profile-address').value = customer.address || '';
}

function renderOrders() {
  const customer = getCurrentCustomer();
  const ordersDiv = document.getElementById('orders-list');
  if (!customer) return;
  
  // Get orders from both checkout and CRM
  const checkoutOrders = JSON.parse(localStorage.getItem('hp_orders') || '[]');
  const crmOrders = JSON.parse(localStorage.getItem('hp_crm_orders') || '[]');
  const allOrders = [...checkoutOrders, ...crmOrders];
  
  const myOrders = allOrders.filter(o => o.customerEmail === customer.email || o.email === customer.email);
  
  if (myOrders.length === 0) {
    ordersDiv.innerHTML = '<div class="text-center text-gray-500 py-8">No orders found. Start shopping in our <a href="shop.html" class="text-deep-red font-semibold underline">shop</a>!</div>';
    return;
  }
  
  ordersDiv.innerHTML = myOrders.map(order => `
    <div class="mb-4 border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
      <div class="flex justify-between items-start mb-3">
        <div>
          <span class="font-bold text-lg text-deep-red">Order #${order.orderId || order.id}</span>
          <p class="text-sm text-gray-600">${order.timestamp ? new Date(order.timestamp).toLocaleDateString() : 'N/A'}</p>
        </div>
        <span class="px-3 py-1 rounded-full text-sm font-semibold ${order.status === 'Completed' || order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
          ${order.status || order.paymentStatus || 'Processing'}
        </span>
      </div>
      <div class="border-t pt-3 space-y-2">
        <div class="text-sm"><span class="font-semibold">Total:</span> $${order.total}</div>
        ${order.deliveryService ? `<div class="text-sm"><span class="font-semibold">Delivery:</span> ${order.deliveryService}</div>` : ''}
        ${order.shippingAddress ? `<div class="text-sm"><span class="font-semibold">Address:</span> ${order.shippingAddress}</div>` : ''}
        ${order.items ? `<div class="text-sm mt-2">
          <span class="font-semibold">Items:</span>
          <ul class="ml-4 mt-1 space-y-1">
            ${order.items.map(item => `<li class="text-gray-700">• ${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}</li>`).join('')}
          </ul>
        </div>` : ''}
      </div>
    </div>
  `).join('');
}

function loadWishlist() {
  const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
  const wishlistDiv = document.getElementById('wishlist-items');
  
  if (wishlist.length === 0) {
    wishlistDiv.innerHTML = '<p class="text-gray-500 text-center py-8">Your wishlist is empty. Browse our <a href="shop.html" class="text-deep-red font-semibold underline">shop</a> to add items!</p>';
    return;
  }
  
  wishlistDiv.innerHTML = wishlist.map(item => `
    <div class="flex items-center gap-4 border-b py-4">
      <img src="${item.img}" alt="${item.name}" class="w-20 h-20 object-cover rounded">
      <div class="flex-1">
        <h3 class="font-semibold">${item.name}</h3>
        <p class="text-deep-red font-bold">$${item.price}</p>
      </div>
      <a href="shop.html" class="bg-deep-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">View</a>
    </div>
  `).join('');
}

function setupTracking() {
  const trackBtn = document.getElementById('track-btn');
  const trackInput = document.getElementById('track-order-id');
  const trackingResult = document.getElementById('tracking-result');
  const trackingDetails = document.getElementById('tracking-details');
  
  if (trackBtn) {
    trackBtn.addEventListener('click', function() {
      const orderId = trackInput.value.trim();
      if (!orderId) {
        showError('Please enter an order ID');
        return;
      }
      
      const checkoutOrders = JSON.parse(localStorage.getItem('hp_orders') || '[]');
      const crmOrders = JSON.parse(localStorage.getItem('hp_crm_orders') || '[]');
      const allOrders = [...checkoutOrders, ...crmOrders];
      
      const order = allOrders.find(o => (o.orderId === orderId || o.id === orderId));
      
      if (order) {
        trackingResult.classList.remove('hidden');
        trackingDetails.innerHTML = `
          <p><strong>Order ID:</strong> ${order.orderId || order.id}</p>
          <p><strong>Status:</strong> ${order.status || order.paymentStatus}</p>
          <p><strong>Delivery Service:</strong> ${order.deliveryService || 'Standard Delivery'}</p>
          ${order.deliveryDate ? `<p><strong>Expected Date:</strong> ${order.deliveryDate}</p>` : ''}
          <p><strong>Shipping Address:</strong> ${order.shippingAddress || order.address}</p>
        `;
      } else {
        trackingResult.classList.remove('hidden');
        trackingResult.className = 'mt-6 bg-red-50 border-2 border-red-300 rounded-lg p-4';
        trackingDetails.innerHTML = '<p class="text-red-800">Order not found. Please check your order ID.</p>';
      }
    });
  }
}

function setupLogout() {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('hp_last_login');
        localStorage.removeItem('hp_customer_name');
        localStorage.removeItem('hp_session');
        window.location.href = 'customer-login.html';
      }
    });
  }
}

function renderCoupons() {
  const customer = getCurrentCustomer();
  const couponsDiv = document.getElementById('coupons-list');
  if (!customer || !couponsDiv) return;
  
  // Check if discount functions are available
  if (typeof getAvailableCouponsForUser !== 'function') {
    couponsDiv.innerHTML = '<div class="col-span-2 text-center text-gray-500 py-8">Discount system loading...</div>';
    return;
  }
  
  const availableCoupons = getAvailableCouponsForUser(customer.email);
  const usedCoupons = getUsedCouponsForUser(customer.email);
  
  if (availableCoupons.length === 0 && usedCoupons.length === 0) {
    couponsDiv.innerHTML = '<div class="col-span-2 text-center text-gray-500 py-8">No coupons available at this time.</div>';
    return;
  }
  
  let html = '';
  
  // Show available coupons
  if (availableCoupons.length > 0) {
    html += availableCoupons.map(coupon => `
      <div class="border-2 border-deep-red rounded-lg p-4 bg-gradient-to-br from-white to-pink-50 hover:shadow-lg transition relative">
        <div class="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">AVAILABLE</div>
        <div class="mb-3">
          <div class="text-2xl font-bold text-deep-red font-mono">${coupon.code}</div>
          <div class="text-sm text-gray-600 mt-1">${coupon.description}</div>
        </div>
        <div class="border-t border-gray-200 pt-3 space-y-2">
          <div class="flex items-center justify-between text-sm">
            <span class="font-semibold">Discount:</span>
            <span class="text-lg font-bold text-deep-red">
              ${coupon.type === 'percent' ? `${coupon.value}% OFF` : `$${coupon.value} OFF`}
            </span>
          </div>
          ${coupon.minPurchase > 0 ? `
            <div class="flex items-center justify-between text-sm">
              <span class="font-semibold">Min. Purchase:</span>
              <span class="text-gray-700">$${coupon.minPurchase.toFixed(2)}</span>
            </div>
          ` : '<div class="text-sm text-green-600 font-semibold">✓ No minimum purchase</div>'}
          <div class="mt-3 pt-3 border-t">
            <button onclick="copyCouponCode('${coupon.code}')" class="w-full bg-deep-red text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition">
              Copy Code & Shop Now
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }
  
  // Show used coupons
  if (usedCoupons.length > 0) {
    html += usedCoupons.map(coupon => `
      <div class="border-2 border-gray-300 rounded-lg p-4 bg-gray-50 opacity-60 relative">
        <div class="absolute top-3 right-3 bg-gray-500 text-white text-xs px-2 py-1 rounded-full font-bold">USED</div>
        <div class="mb-3">
          <div class="text-2xl font-bold text-gray-500 font-mono line-through">${coupon.code}</div>
          <div class="text-sm text-gray-500 mt-1">${coupon.description}</div>
        </div>
        <div class="border-t border-gray-300 pt-3 space-y-2">
          <div class="flex items-center justify-between text-sm">
            <span class="font-semibold text-gray-600">Discount:</span>
            <span class="text-lg font-bold text-gray-500">
              ${coupon.type === 'percent' ? `${coupon.value}% OFF` : `$${coupon.value} OFF`}
            </span>
          </div>
          <div class="text-sm text-gray-500 italic mt-2">
            ✓ Already redeemed - Each coupon can only be used once
          </div>
        </div>
      </div>
    `).join('');
  }
  
  couponsDiv.innerHTML = html;
}

function copyCouponCode(code) {
  // Copy to clipboard
  navigator.clipboard.writeText(code).then(() => {
    if (window.showNotification && typeof window.showNotification === 'function') {
      window.showNotification(`Coupon code "${code}" copied! Redirecting to shop...`, 'success');
    } else {
      alert(`Coupon code "${code}" copied to clipboard!`);
    }
    
    // Redirect to shop after short delay
    setTimeout(() => {
      window.location.href = 'shop.html';
    }, 1500);
  }).catch(err => {
    alert(`Coupon code: ${code}\n\nPlease copy this code manually.`);
  });
}

// Export for onclick handlers
window.copyCouponCode = copyCouponCode;
        </ul>
      </div>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', function() {
  renderProfile();
  renderOrders();
});
