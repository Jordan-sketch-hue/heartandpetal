// PayPal Standard SDK integration for Heart & Petal
// Instant render approach - buttons appear immediately

// Backend API URL - update this with your deployed backend URL
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000' 
  : 'https://heartandpetal-api.onrender.com';

// Render PayPal button as soon as page loads
paypal.Buttons({
  // Create order on backend
  createOrder: function(data, actions) {
    const cart = getCart();
    return fetch(`${API_BASE_URL}/paypal-api/checkout/orders/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart }),
    })
    .then(response => response.json())
    .then(orderData => orderData.id);
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
        name: document.getElementById('checkout-name').value,
        email: document.getElementById('checkout-email').value,
        phone: document.getElementById('checkout-phone').value,
        address: document.getElementById('checkout-address').value,
        notes: document.getElementById('checkout-notes').value,
        shipping: document.getElementById('checkout-shipping').value,
        deliveryDate: document.getElementById('checkout-delivery-date').value
      };
      
      saveOrder({
        ...customerData,
        items: getCart(),
        total: calculateTotal(),
        paymentId: data.orderID,
        paymentStatus: 'Completed',
        timestamp: new Date().toISOString()
      });
      
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
