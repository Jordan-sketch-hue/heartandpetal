// Heart & Petal - Smart Cart Reminder System
// Sends notifications for abandoned carts and product interest

class CartReminderSystem {
  constructor() {
    this.CHECK_INTERVAL = 30000; // Check every 30 seconds
    this.REMINDER_DELAY = 300000; // 5 minutes
    this.VIEW_TIME_THRESHOLD = 30000; // 30 seconds viewing a product
    this.productViewStartTime = null;
    this.currentProductId = null;
    this.hasShownCartReminder = false;
    this.hasShownProductReminder = false;
  }

  init() {
    // Track when user adds items to cart
    this.trackCartActivity();
    
    // Track product viewing time
    this.trackProductViewing();
    
    // Start checking for reminders
    setInterval(() => this.checkReminders(), this.CHECK_INTERVAL);
    
    // Listen for page visibility changes (user switches tabs)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.handlePageHidden();
      }
    });
  }

  trackCartActivity() {
    // Listen for cart updates via storage event or direct tracking
    window.addEventListener('storage', (e) => {
      if (e.key === 'cart') {
        this.onItemAddedToCart();
      }
    });
    
    // Also track via custom event
    document.addEventListener('cartUpdated', () => {
      this.onItemAddedToCart();
    });
  }

  trackProductViewing() {
    // Check if we're on a product page
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (productId && window.location.pathname.includes('product.html')) {
      this.currentProductId = productId;
      this.productViewStartTime = Date.now();
      
      // Wait for product details to load before storing
      setTimeout(() => {
        const productName = document.getElementById('product-name')?.textContent;
        const productPrice = document.getElementById('product-price')?.textContent;
        const productImg = document.querySelector('#carousel-image')?.src;
        
        if (productName && productPrice) {
          localStorage.setItem('lastViewedProduct', JSON.stringify({
            id: productId,
            timestamp: Date.now(),
            name: productName,
            price: productPrice,
            img: productImg || ''
          }));
        }
      }, 500);
    }
  }

  onItemAddedToCart() {
    // Record that user added item to cart
    localStorage.setItem('lastCartAddTime', Date.now());
    this.hasShownCartReminder = false; // Reset for next session
  }

  handlePageHidden() {
    // User switched tabs/minimized - check if they've been viewing a product
    if (this.currentProductId && this.productViewStartTime) {
      const viewTime = Date.now() - this.productViewStartTime;
      if (viewTime > this.VIEW_TIME_THRESHOLD) {
        localStorage.setItem('interestedProductView', JSON.stringify({
          id: this.currentProductId,
          timestamp: Date.now(),
          viewTime: viewTime
        }));
      }
    }
  }

  checkReminders() {
    this.checkCartReminder();
    this.checkProductReminder();
  }

  checkCartReminder() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const lastCartAddTime = parseInt(localStorage.getItem('lastCartAddTime') || '0');
    const now = Date.now();

    // If cart has items and user hasn't checked out in 5 minutes
    if (cart.length > 0 && lastCartAddTime > 0 && !this.hasShownCartReminder) {
      const timeSinceAdd = now - lastCartAddTime;
      
      if (timeSinceAdd > this.REMINDER_DELAY) {
        this.showCartReminder(cart);
        this.hasShownCartReminder = true;
      }
    }
  }

  checkProductReminder() {
    const lastViewedProduct = JSON.parse(localStorage.getItem('lastViewedProduct') || 'null');
    
    if (lastViewedProduct && !this.hasShownProductReminder) {
      const timeSinceView = Date.now() - lastViewedProduct.timestamp;
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const inCart = cart.some(item => item.id === lastViewedProduct.id);
      
      // If user viewed product for 30+ seconds but didn't add to cart
      if (timeSinceView > this.REMINDER_DELAY && !inCart && 
          !window.location.pathname.includes('product.html')) {
        this.showProductReminder(lastViewedProduct);
        this.hasShownProductReminder = true;
      }
    }
  }

  showCartReminder(cart) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    this.showNotification({
      title: '🛒 Your Cart is Waiting!',
      message: `You have ${totalItems} item(s) worth $${totalValue.toFixed(2)} in your cart. Complete your order now!`,
      action: 'Go to Checkout',
      actionUrl: 'checkout.html',
      type: 'cart'
    });
  }

  showProductReminder(product) {
    this.showNotification({
      title: '👀 Still Interested?',
      message: `The ${product.name} you were viewing is still available at ${product.price}!`,
      action: 'View Product',
      actionUrl: `product.html?id=${product.id}`,
      type: 'product',
      image: product.img
    });
  }

  showNotification({title, message, action, actionUrl, type, image}) {
    // Create custom branded notification
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-white rounded-xl shadow-2xl border-2 border-deep-red p-4 max-w-sm z-50 animate-slide-up';
    notification.innerHTML = `
      <div class="flex items-start gap-3">
        ${image ? `<img src="${image}" class="w-16 h-16 object-cover rounded-lg" alt="Product">` : ''}
        <div class="flex-1">
          <h4 class="font-bold text-gray-900 mb-1">${title}</h4>
          <p class="text-sm text-gray-700 mb-3">${message}</p>
          <div class="flex gap-2">
            <button onclick="window.location.href='${actionUrl}'" class="bg-deep-red text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition">
              ${action}
            </button>
            <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700 text-sm font-semibold">
              Dismiss
            </button>
          </div>
        </div>
        <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    `;

    document.body.appendChild(notification);

    // Auto-dismiss after 10 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        setTimeout(() => notification.remove(), 300);
      }
    }, 10000);

    // Store that we showed this reminder
    localStorage.setItem(`reminder_shown_${type}_${Date.now()}`, 'true');
  }

  // Email reminder simulation (would need backend in production)
  sendEmailReminder(email, cart) {
    console.log('📧 Email reminder would be sent to:', email);
    console.log('Cart contents:', cart);
    
    // In production, this would call your backend API
    // Example: fetch('/api/send-cart-reminder', { method: 'POST', body: JSON.stringify({ email, cart }) })
    
    return true;
  }
}

// Initialize cart reminder system
const cartReminders = new CartReminderSystem();

// Start reminders when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => cartReminders.init());
} else {
  cartReminders.init();
}

// Make available globally
window.cartReminderSystem = cartReminders;

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
  @keyframes slide-up {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-slide-up {
    animation: slide-up 0.3s ease-out;
  }
`;
document.head.appendChild(style);
