// Heart & Petal Customer Profile & Order History
// Loads customer info and orders from localStorage

function getCurrentCustomer() {
  // For demo: use the last logged-in customer from registration/login (simulate session)
  // In production, use a real session or JWT
  const customers = JSON.parse(localStorage.getItem('hp_customers') || '[]');
  // Try to get from a session key
  const email = localStorage.getItem('hp_last_login');
  if (!email) return null;
  return customers.find(c => c.email === email);
}

function renderProfile() {
  const customer = getCurrentCustomer();
  const profileDiv = document.getElementById('profile-info');
  if (!customer) {
    profileDiv.innerHTML = '<div class="text-center text-red-600">You must be logged in to view your profile. <a href="customer-login.html" class="text-deep-red underline">Login here</a>.</div>';
    document.getElementById('orders-list').innerHTML = '';
    return;
  }
  profileDiv.innerHTML = `
    <div class="mb-2"><span class="font-bold">Name:</span> ${customer.name}</div>
    <div class="mb-2"><span class="font-bold">Email:</span> ${customer.email}</div>
    <div class="mb-2"><span class="font-bold">Address:</span> ${customer.address}</div>
  `;
}

function renderOrders() {
  const customer = getCurrentCustomer();
  const ordersDiv = document.getElementById('orders-list');
  if (!customer) return;
  const orders = JSON.parse(localStorage.getItem('hp_crm_orders') || '[]');
  const myOrders = orders.filter(o => o.email === customer.email);
  if (myOrders.length === 0) {
    ordersDiv.innerHTML = '<div class="text-center text-gray-500">No orders found.</div>';
    return;
  }
  ordersDiv.innerHTML = myOrders.map(order => `
    <div class="mb-6 border-b border-champagne-gold pb-4">
      <div class="mb-1"><span class="font-bold">Order ID:</span> ${order.id}</div>
      <div class="mb-1"><span class="font-bold">Date:</span> ${new Date(order.created).toLocaleDateString()}</div>
      <div class="mb-1"><span class="font-bold">Status:</span> <span class="text-green-700">${order.status}</span></div>
      <div class="mb-1"><span class="font-bold">Total:</span> $${order.total}</div>
      <div class="mb-1"><span class="font-bold">Shipping:</span> ${order.shipping} ${order.deliveryDate ? '('+order.deliveryDate+')' : ''}</div>
      <div class="mb-1"><span class="font-bold">Gift Note:</span> ${order.giftNote || ''}</div>
      <div class="mb-2"><span class="font-bold">Items:</span>
        <ul class="ml-4 list-disc">
          ${order.items.map(item => `<li>${item.name} x${item.quantity} ($${item.price})</li>`).join('')}
        </ul>
      </div>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', function() {
  renderProfile();
  renderOrders();
});
