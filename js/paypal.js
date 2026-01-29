// PayPal Standard SDK integration for Heart & Petal
// Instant render approach - buttons appear immediately

// Backend API URL - update this with your deployed backend URL
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000' 
  : 'https://heartandpetal-api.onrender.com';

// Helper function to safely get cart
function getCartSafely() {
  try {
    if (typeof getCart === 'function') {
      return getCart();
    }
    // Fallback: get cart directly from localStorage
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error getting cart:', error);
    return [];
  }
}

// Render PayPal button as soon as page loads
paypal.Buttons({
  // Create order on backend
  createOrder: function(data, actions) {
    const cart = getCartSafely();
    
    if (!cart || cart.length === 0) {
      alert('Your cart is empty! Please add items before checkout.');
      return Promise.reject(new Error('Empty cart'));
    }
    
    return fetch(`${API_BASE_URL}/paypal-api/checkout/orders/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      return response.json();
    })
    .then(orderData => {
      if (!orderData.id) {
        throw new Error('No order ID received');
      }
      return orderData.id;
    })
    .catch(error => {
      console.error("Error creating order:", error);
      document.getElementById('paypal-error').classList.remove('hidden');
      throw error;
    });
  },
  
  // Capture payment on backend after approval
  onApprove: function(data, actions) {
    return fetch(`${API_BASE_URL}/paypal-api/checkout/orders/${data.orderID}/capture`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
    .then(response => response.json())
    .then(orderData => {
      console.log("Payment captured successfully:", orderData);
      
      // Save order to localStorage
      const customerData = {
        name: document.getElementById('checkout-name')?.value || '',
        email: document.getElementById('checkout-email')?.value || '',
        phone: document.getElementById('checkout-phone')?.value || '',
        address: document.getElementById('checkout-address')?.value || '',
        notes: document.getElementById('checkout-notes')?.value || '',
        shipping: document.getElementById('checkout-shipping')?.value || 'Standard',
        deliveryDate: document.getElementById('checkout-delivery-date')?.value || ''
      };
      
      if (typeof saveOrder === 'function') {
        saveOrder({
          ...customerData,
          items: getCartSafely(),
          total: typeof calculateTotal === 'function' ? calculateTotal() : 0,
          paymentId: data.orderID,
          paymentStatus: 'Completed',
          timestamp: new Date().toISOString()
        });
      }
      
      // Clear cart
      localStorage.removeItem('cart');
      
      // Show success message
      alert('✅ Payment successful! Order confirmation sent to your email.');
      window.location.href = 'tracking.html';
    });
  },
  
  // Handle errors
  onError: function(err) {
    console.error("PayPal error:", err);
    document.getElementById('paypal-error').classList.remove('hidden');
  },
  
  // Handle cancellation
  onCancel: function(data) {
    console.log("Payment cancelled:", data);
    alert('Payment cancelled. You can try again when ready.');
  }
}).render('#paypal-button-container');
