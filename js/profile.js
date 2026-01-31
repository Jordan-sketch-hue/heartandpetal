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
  
  // Show admin dashboard link if admin is logged in
  const isAdminLoggedIn = localStorage.getItem('hp_crm_admin_logged_in') === 'true';
  const adminDashboardLink = document.getElementById('admin-dashboard-link');
  if (adminDashboardLink && isAdminLoggedIn) {
    adminDashboardLink.classList.remove('hidden');
  }
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

  window.__profileOrders = myOrders;
  
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
        <div class="flex flex-wrap gap-2 pt-2">
          <a href="tracking.html?orderId=${encodeURIComponent(order.orderId || order.id)}" class="bg-white border border-deep-red text-deep-red px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blush-pink transition">Track Order</a>
          <button class="reorder-btn bg-deep-red text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition" data-reorder-id="${order.orderId || order.id}">Reorder</button>
        </div>
      </div>
    </div>
  `).join('');

  const reorderButtons = ordersDiv.querySelectorAll('.reorder-btn');
  reorderButtons.forEach(btn => {
    btn.addEventListener('click', () => reorderOrder(btn.dataset.reorderId));
  });
}

function loadWishlist() {
  let wishlist = JSON.parse(localStorage.getItem('hp_wishlist') || '[]');
  if (!Array.isArray(wishlist) || wishlist.length === 0) {
    wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
  }
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
      <div class="flex gap-2">
        <button class="bg-white border border-deep-red text-deep-red px-4 py-2 rounded-lg hover:bg-blush-pink transition" onclick="addWishlistItemToCart('${item.id}')">Add to Cart</button>
        <a href="shop.html" class="bg-deep-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">View</a>
      </div>
    </div>
  `).join('');
}

function reorderOrder(orderId) {
  const orders = window.__profileOrders || [];
  const order = orders.find(o => (o.orderId || o.id) === orderId);
  if (!order || !Array.isArray(order.items)) {
    showError('Order not found or has no items');
    return;
  }
  order.items.forEach(item => {
    if (typeof addToCart === 'function') {
      addToCart({
        id: item.id,
        name: item.name,
        price: parseFloat(item.price) || 0,
        quantity: parseInt(item.quantity) || 1,
        img: item.img || '',
        variant: item.variant || null
      });
    }
  });
  window.location.href = 'checkout.html';
}

function addWishlistItemToCart(productId) {
  const wishlist = JSON.parse(localStorage.getItem('hp_wishlist') || '[]');
  const item = wishlist.find(w => w.id === productId);
  if (!item) return;
  if (typeof addToCart === 'function') {
    addToCart({
      id: item.id,
      name: item.name,
      price: parseFloat(item.price) || 0,
      quantity: 1,
      img: item.img || ''
    });
  }
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
        trackingResult.className = 'mt-6 bg-green-50 border-2 border-green-300 rounded-lg p-4';
        
        // Generate tracking timeline
        const statusTimeline = generateStatusTimeline(order.status || order.paymentStatus);
        
        trackingDetails.innerHTML = `
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-white rounded p-3 border border-green-200">
                <p class="text-sm text-gray-600">Order Number</p>
                <p class="text-xl font-bold text-deep-red">#${order.orderId || order.id}</p>
              </div>
              <div class="bg-white rounded p-3 border border-green-200">
                <p class="text-sm text-gray-600">Order Date</p>
                <p class="text-lg font-semibold text-gray-800">${order.timestamp ? new Date(order.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</p>
              </div>
              <div class="bg-white rounded p-3 border border-green-200">
                <p class="text-sm text-gray-600">Current Status</p>
                <p class="text-lg font-bold text-green-700">${order.status || order.paymentStatus || 'Processing'}</p>
              </div>
              <div class="bg-white rounded p-3 border border-green-200">
                <p class="text-sm text-gray-600">Total Amount</p>
                <p class="text-lg font-bold text-deep-red">$${parseFloat(order.total || 0).toFixed(2)}</p>
              </div>
            </div>

            <div class="bg-white rounded p-4 border border-green-200">
              <p class="font-bold text-gray-800 mb-3">📦 Package Timeline</p>
              <div class="space-y-3">
                ${statusTimeline}
              </div>
            </div>

            <div class="bg-white rounded p-4 border border-green-200">
              <p class="font-bold text-gray-800 mb-2">🚚 Shipping Information</p>
              <div class="space-y-2 text-sm">
                <div><span class="font-semibold">Delivery Service:</span> ${order.deliveryService || order.shipping || 'Standard Delivery (3-5 business days)'}</div>
                <div><span class="font-semibold">Tracking Number:</span> ${order.trackingNumber || 'Will be provided once shipped'}</div>
                ${order.deliveryDate ? `<div><span class="font-semibold">Expected Delivery:</span> ${new Date(order.deliveryDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</div>` : '<div><span class="font-semibold">Expected Delivery:</span> To be determined</div>'}
              </div>
            </div>

            <div class="bg-white rounded p-4 border border-green-200">
              <p class="font-bold text-gray-800 mb-2">📍 Shipping Address</p>
              <p class="text-sm text-gray-700">${order.shippingAddress || order.address || 'N/A'}</p>
            </div>

            ${order.items ? `
              <div class="bg-white rounded p-4 border border-green-200">
                <p class="font-bold text-gray-800 mb-3">📋 Items in Order</p>
                <div class="space-y-2">
                  ${order.items.map(item => `
                    <div class="flex justify-between items-center py-2 border-b border-gray-200">
                      <div>
                        <p class="font-semibold text-gray-800">${item.name}</p>
                        <p class="text-xs text-gray-600">Quantity: ${item.quantity}</p>
                      </div>
                      <p class="font-semibold text-deep-red">$${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <div class="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-800">
              <p class="font-semibold mb-1">💡 Tip:</p>
              <p>Your order is being carefully prepared. You'll receive email updates at each stage of shipping.</p>
            </div>
          </div>
        `;
        
        // Track page view in Google Analytics if available
        if (typeof gtag === 'function') {
          gtag('event', 'view_order_details', {
            order_id: order.orderId || order.id,
            value: parseFloat(order.total || 0),
            currency: 'USD'
          });
        }
      } else {
        trackingResult.classList.remove('hidden');
        trackingResult.className = 'mt-6 bg-red-50 border-2 border-red-300 rounded-lg p-4';
        trackingDetails.innerHTML = '<p class="text-red-800 font-semibold">❌ Order not found</p><p class="text-red-700 text-sm mt-2">Please check your order ID and try again. Order IDs typically look like "HP123456".</p>';
      }
    });
    
    // Allow Enter key to submit
    if (trackInput) {
      trackInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') trackBtn.click();
      });
    }
  }
}

function generateStatusTimeline(status) {
  const timeline = [
    { label: 'Order Confirmed', status: 'Processing', icon: '✅', completed: true },
    { label: 'Preparing Items', status: ['Processing', 'Packing'], icon: '📦', completed: false },
    { label: 'Ready to Ship', status: ['Packing', 'Ready to Ship'], icon: '📬', completed: false },
    { label: 'Shipped', status: ['Shipped', 'In Transit'], icon: '🚚', completed: false },
    { label: 'Delivered', status: 'Delivered', icon: '✨', completed: false }
  ];
  
  let html = '';
  let foundCurrent = false;
  
  timeline.forEach((step, idx) => {
    const isCompleted = Array.isArray(step.completed) ? step.completed.includes(status) : step.completed;
    const isCurrent = Array.isArray(step.status) ? step.status.includes(status) : step.status === status;
    
    // Determine actual completion based on status
    const completionStages = {
      'Processing': 0,
      'Packing': 1,
      'Ready to Ship': 2,
      'Shipped': 3,
      'In Transit': 3,
      'Delivered': 4
    };
    const currentStage = completionStages[status] || 0;
    const stepCompleted = idx <= currentStage;
    
    html += `
      <div class="flex items-center ${stepCompleted ? 'opacity-100' : 'opacity-50'}">
        <div class="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full ${stepCompleted ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'} font-bold">
          ${step.icon}
        </div>
        <div class="ml-4 flex-1">
          <p class="text-sm font-semibold text-gray-800">${step.label}</p>
          ${isCurrent && !stepCompleted ? `<p class="text-xs text-green-600 font-semibold">Currently at this stage</p>` : ''}
          ${stepCompleted && idx < currentStage ? `<p class="text-xs text-gray-600">Completed</p>` : ''}
        </div>
        ${idx < timeline.length - 1 ? `<div class="w-0.5 h-6 bg-${stepCompleted ? 'green-500' : 'gray-300'} ml-4"></div>` : ''}
      </div>
    `;
  });
  
  return html;
}

function setupLogout() {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      if (typeof showBrandedConfirm === 'function') {
        showBrandedConfirm('Are you sure you want to logout?', 'Confirm Logout', () => {
          localStorage.removeItem('hp_last_login');
          localStorage.removeItem('hp_customer_name');
          localStorage.removeItem('hp_session');
          window.location.href = 'customer-login.html';
        }, null);
      } else if (confirm('Are you sure you want to logout?')) {
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
    } else if (typeof showBrandedAlert === 'function') {
      showBrandedAlert(`Coupon code "${code}" copied! Redirecting to shop...`, 'Copied', 'success');
    } else {
      alert(`Coupon code "${code}" copied to clipboard!`);
    }
    
    // Redirect to shop after short delay
    setTimeout(() => {
      window.location.href = 'shop.html';
    }, 1500);
  }).catch(err => {
    if (typeof showBrandedAlert === 'function') {
      showBrandedAlert(`Coupon code: ${code}\n\nPlease copy this code manually.`, 'Copy Code', 'info');
    } else {
      alert(`Coupon code: ${code}\n\nPlease copy this code manually.`);
    }
  });
}

// Export for onclick handlers
window.copyCouponCode = copyCouponCode;
