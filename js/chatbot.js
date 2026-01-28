// Heart & Petal AI Chatbot - Sitewide Support
// Provides instant customer service and product recommendations

(function() {
  'use strict';
  
  // Chatbot state
  let isOpen = false;
  let conversationHistory = [];
  
  // Product knowledge base
  const productCategories = {
    roses: 'premium rose bouquets in red, pink, white, and rainbow colors',
    chocolates: 'gourmet chocolates, truffles, and chocolate-dipped strawberries',
    teddy: 'soft plush teddy bears and stuffed animals',
    combo: 'gift combos with flowers, chocolates, and teddy bears',
    flowers: 'tulips, lilies, sunflowers, orchids, and mixed arrangements'
  };
  
  // FAQ knowledge
  const faqResponses = {
    delivery: 'We offer FREE DELIVERY on all orders across the USA! Choose from Standard (3-5 days), Express (1-2 days), or Valentine\'s Day Guaranteed shipping - all FREE for a limited time!',
    shipping: 'We offer FREE DELIVERY on all orders across the USA! Choose from Standard (3-5 days), Express (1-2 days), or Valentine\'s Day Guaranteed shipping - all FREE for a limited time!',
    payment: 'We accept secure PayPal payments for all orders. Your payment information is fully encrypted and protected.',
    track: 'You can track your order from your customer profile dashboard. Just log in and go to the "Track Order" tab!',
    returns: 'Due to the perishable nature of our products, we don\'t accept returns. However, if you\'re not satisfied, please contact us at support@heartandpetal.com and we\'ll make it right!',
    valentine: 'Valentine\'s Day is our busiest time! Order now to guarantee delivery. We offer special Valentine\'s Day Guaranteed shipping - completely FREE!',
    sizes: 'Most of our flower arrangements come in multiple sizes (small, medium, large, deluxe) with optional vases. Select your preference at checkout!',
    custom: 'For custom orders or special requests, please call us at (555) PETAL-01 or email custom@heartandpetal.com',
    account: 'Create a customer account to track orders, save favorites to your wishlist, and get exclusive offers! Click "Login | Register" in the top menu.'
  };
  
  // AI Response Generator with Intelligent Categorization
  function generateResponse(userMessage) {
    const msg = userMessage.toLowerCase().trim();
    
    // === CATEGORY 1: GREETINGS ===
    if (msg.match(/^(hi|hello|hey|good morning|good afternoon|good evening|greetings)$/i)) {
      return '<strong>Hello! Welcome to Heart & Petal</strong>\n\nI\'m your personal gift assistant. Here\'s how I can help:\n\n<strong>🛍️ SHOP & BROWSE</strong>\n• View roses, chocolates, teddy bears\n• Get gift recommendations\n\n<strong>📦 ORDERS & DELIVERY</strong>\n• Track your order\n• Delivery information (FREE shipping!)\n\n<strong>💳 CHECKOUT & SUPPORT</strong>\n• Payment options\n• Contact customer service\n\nWhat are you looking for today?';
    }
    
    // === CATEGORY 2: BROWSE & SHOPPING ===
    if (msg.match(/browse|shop|view|see|show|look|products|catalog|selection|available/)) {
      // Check for specific product mentions
      if (msg.includes('rose')) {
        return '<strong>🌹 ROSE COLLECTION</strong>\n\nOur premium rose bouquets include:\n• Classic Red Roses - $29.99-$89.99\n• Pink Romance Roses - $34.99-$94.99\n• White Elegance Roses - $39.99-$99.99\n• Rainbow Roses - $49.99-$124.99\n\n<strong>💡 SUGGESTION:</strong> Pair with chocolates for the perfect gift!\n\n<a href="shop.html" style="color:#C21807;font-weight:bold;">→ Browse All Roses</a>';
      }
      if (msg.includes('chocolate')) {
        return '<strong>🍫 CHOCOLATE COLLECTION</strong>\n\nGourmet chocolate options:\n• Chocolate Truffles Box - $19.99-$49.99\n• Chocolate-Dipped Strawberries - $24.99-$54.99\n• Premium Chocolate Assortment - $29.99-$69.99\n\n<strong>💡 SUGGESTION:</strong> Add roses for a complete romantic gift!\n\n<a href="shop.html" style="color:#C21807;font-weight:bold;">→ Browse All Chocolates</a>';
      }
      if (msg.includes('teddy') || msg.includes('bear') || msg.includes('plush')) {
        return '<strong>🧸 TEDDY BEAR COLLECTION</strong>\n\nCute & cuddly teddy bears:\n• Small Teddy Bear - $14.99\n• Medium Teddy Bear - $24.99\n• Large Teddy Bear - $39.99\n• Giant Teddy Bear - $69.99\n\n<strong>💡 SUGGESTION:</strong> Create a gift combo with flowers!\n\n<a href="shop.html" style="color:#C21807;font-weight:bold;">→ Browse All Teddy Bears</a>';
      }
      if (msg.includes('combo') || msg.includes('package') || msg.includes('bundle')) {
        return '<strong>🎁 GIFT COMBO PACKAGES</strong>\n\nComplete gift sets:\n• Romance Package (Roses + Chocolates) - $54.99\n• Love Bundle (Roses + Teddy) - $64.99\n• Ultimate Gift (All 3!) - $89.99\n\n<strong>💡 BEST VALUE:</strong> Save 20% with combos!\n\n<a href="shop.html" style="color:#C21807;font-weight:bold;">→ Browse All Combos</a>';
      }
      
      // General browse request
      return '<strong>🛍️ OUR PRODUCT CATEGORIES</strong>\n\n<strong>1. ROSES</strong>\nPremium bouquets in red, pink, white, rainbow\n\n<strong>2. CHOCOLATES</strong>\nGourmet truffles, strawberries, assortments\n\n<strong>3. TEDDY BEARS</strong>\nCute plush bears in all sizes\n\n<strong>4. GIFT COMBOS</strong>\nComplete romantic packages (best value!)\n\n<strong>💡 SUGGESTION:</strong> Gift combos are most popular for Valentine\'s Day!\n\n<a href="shop.html" style="color:#C21807;font-weight:bold;">→ Visit Shop Page</a>';
    }
    
    // === CATEGORY 3: DELIVERY & SHIPPING ===
    if (msg.match(/deliver|shipping|ship|send|arrive|when|how long|free/)) {
      return '<strong>📦 DELIVERY INFORMATION</strong>\n\n<strong>✓ ALL SHIPPING IS FREE!</strong>\n\n<strong>OPTIONS:</strong>\n• Standard Delivery: 3-5 business days\n• Express Delivery: 1-2 business days\n• Valentine\'s Day Guaranteed: On-time delivery\n\n<strong>COVERAGE:</strong> Nationwide USA delivery\n\n<strong>💡 SUGGESTION:</strong> Order now for Valentine\'s Day guaranteed delivery!\n\n<a href="checkout.html" style="color:#C21807;font-weight:bold;">→ Complete Your Order</a>';
    }
    
    // === CATEGORY 4: ORDER TRACKING ===
    if (msg.match(/track|where|order|status|check|find|my order|locate/)) {
      return '<strong>📍 TRACK YOUR ORDER</strong>\n\nTo track your order:\n\n<strong>METHOD 1:</strong> Login to your account\n→ Go to "Track Orders" section\n→ View real-time updates\n\n<strong>METHOD 2:</strong> Check confirmation email\n→ Click tracking link\n\n<strong>💡 NOT LOGGED IN?</strong>\n<a href="customer-login.html" style="color:#C21807;font-weight:bold;">→ Login Here</a>\n\n<strong>NEED HELP?</strong>\nEmail: orders@heartandpetal.com';
    }
    
    // === CATEGORY 5: PAYMENT & CHECKOUT ===
    if (msg.match(/pay|payment|checkout|credit|card|paypal|buy|purchase/)) {
      return '<strong>💳 PAYMENT & CHECKOUT</strong>\n\n<strong>ACCEPTED PAYMENT:</strong>\n• PayPal (Secure & Fast)\n• All major credit/debit cards via PayPal\n\n<strong>SECURITY:</strong>\n✓ 256-bit SSL encryption\n✓ Secure payment gateway\n✓ No data stored on our servers\n\n<strong>💡 READY TO CHECKOUT?</strong>\n<a href="checkout.html" style="color:#C21807;font-weight:bold;">→ Go to Cart</a>';
    }
    
    // === CATEGORY 6: PRICING ===
    if (msg.match(/price|cost|how much|expensive|cheap|dollar/)) {
      return '<strong>💰 PRICING OVERVIEW</strong>\n\n<strong>ROSES:</strong> $29.99 - $124.99\n<strong>CHOCOLATES:</strong> $19.99 - $69.99\n<strong>TEDDY BEARS:</strong> $14.99 - $69.99\n<strong>GIFT COMBOS:</strong> $54.99 - $224.99\n\n<strong>✓ FREE SHIPPING on all orders!</strong>\n<strong>✓ Save 20% with combos!</strong>\n\n<strong>💡 BEST VALUE:</strong> Ultimate Gift Combo (All 3 items) - $89.99\n\n<a href="shop.html" style="color:#C21807;font-weight:bold;">→ View All Prices</a>';
    }
    
    // === CATEGORY 7: OCCASIONS & RECOMMENDATIONS ===
    if (msg.match(/valentine|anniversary|birthday|wedding|occasion|recommend|suggest|gift idea/)) {
      return '<strong>💝 GIFT RECOMMENDATIONS</strong>\n\n<strong>VALENTINE\'S DAY:</strong>\nRed roses + chocolates combo (Most popular!)\n\n<strong>ANNIVERSARY:</strong>\nPink roses + teddy bear bundle\n\n<strong>BIRTHDAY:</strong>\nRainbow roses + chocolate strawberries\n\n<strong>WEDDING:</strong>\nWhite roses + premium chocolates\n\n<strong>💡 TOP PICK:</strong> Ultimate Gift Combo includes everything!\n\n<a href="shop.html" style="color:#C21807;font-weight:bold;">→ Browse Gift Ideas</a>';
    }
    
    // === CATEGORY 8: CONTACT & SUPPORT ===
    if (msg.match(/contact|support|help|phone|email|call|reach|customer service/)) {
      return '<strong>📞 CUSTOMER SUPPORT</strong>\n\n<strong>EMAIL:</strong> support@heartandpetal.com\n<strong>PHONE:</strong> (555) PETAL-01\n\n<strong>RESPONSE TIME:</strong>\n• Email: Within 24 hours\n• Phone: Mon-Sat, 9am-6pm EST\n\n<strong>💡 QUICK HELP:</strong>\nI can answer most questions right here!\n\nWhat do you need help with?';
    }
    
    // === CATEGORY 9: ACCOUNT & PROFILE ===
    if (msg.match(/account|profile|login|register|sign up|sign in|password/)) {
      return '<strong>👤 ACCOUNT MANAGEMENT</strong>\n\n<strong>BENEFITS OF CREATING AN ACCOUNT:</strong>\n• Track all your orders\n• Save items to wishlist\n• Faster checkout\n• Exclusive offers\n\n<strong>💡 GET STARTED:</strong>\n<a href="customer-login.html" style="color:#C21807;font-weight:bold;">→ Login / Create Account</a>\n\n<strong>NEED HELP?</strong>\nEmail: accounts@heartandpetal.com';
    }
    
    // === DEFAULT: SMART MENU ===
    return '<strong>🌹 How Can I Help You?</strong>\n\nChoose a category:\n\n<strong>1️⃣ BROWSE PRODUCTS</strong>\nView roses, chocolates, teddy bears, combos\n\n<strong>2️⃣ DELIVERY INFO</strong>\nShipping options (FREE nationwide!)\n\n<strong>3️⃣ TRACK ORDER</strong>\nCheck your order status\n\n<strong>4️⃣ PAYMENT & CHECKOUT</strong>\nSecure PayPal checkout\n\n<strong>5️⃣ GIFT RECOMMENDATIONS</strong>\nFind the perfect gift for any occasion\n\n<strong>6️⃣ CONTACT SUPPORT</strong>\nGet help from our team\n\nType a keyword or ask me anything!';
  }
  
  // Create chatbot UI
  function createChatbot() {
    const chatbotHTML = `
      <!-- AI Chatbot Widget -->
      <div id="hp-chatbot-container" class="hp-chatbot-closed">
        <!-- Chat Button -->
        <button id="hp-chatbot-toggle" class="hp-chat-btn">
          <svg class="hp-chat-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          <svg class="hp-close-icon hidden" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          <span class="hp-chat-badge"></span>
        </button>
        
        <!-- Chat Window -->
        <div id="hp-chatbot-window" class="hp-chat-window hidden">
          <!-- Header -->
          <div class="hp-chat-header">
            <div class="flex items-center gap-2">
              <div class="hp-chat-avatar">
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
                </svg>
              </div>
              <div>
                <div class="font-bold text-white text-sm">Heart & Petal Assistant</div>
                <div class="text-xs text-pink-100">Online • Here to help</div>
              </div>
            </div>
            <button id="hp-chat-close" class="hp-chat-header-close">✕</button>
          </div>
          
          <!-- Messages -->
          <div id="hp-chat-messages" class="hp-chat-messages">
            <div class="hp-chat-message hp-chat-bot">
              <div class="hp-chat-avatar-small">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                </svg>
              </div>
              <div class="hp-chat-bubble">
                Hello! I'm your Heart & Petal assistant. How can I help you today?
              </div>
            </div>
          </div>
          
          <!-- Input -->
          <div class="hp-chat-input-container">
            <input type="text" id="hp-chat-input" placeholder="Type your message..." class="hp-chat-input">
            <button id="hp-chat-send" class="hp-chat-send-btn">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
          
          <!-- Quick Actions -->
          <div class="hp-chat-quick-actions">
            <button class="hp-quick-btn" data-message="browse">Browse Products</button>
            <button class="hp-quick-btn" data-message="delivery">Delivery Info</button>
            <button class="hp-quick-btn" data-message="track order">Track Order</button>
            <button class="hp-quick-btn" data-message="gift recommendations">Gift Ideas</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    attachEventListeners();
  }
  
  // Add message to chat
  function addMessage(message, isBot = false) {
    const messagesContainer = document.getElementById('hp-chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `hp-chat-message ${isBot ? 'hp-chat-bot' : 'hp-chat-user'}`;
    
    if (isBot) {
      messageDiv.innerHTML = `
        <div class="hp-chat-avatar-small">
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
          </svg>
        </div>
        <div class="hp-chat-bubble">${message}</div>
      `;
    } else {
      messageDiv.innerHTML = `
        <div class="hp-chat-bubble">${message}</div>
      `;
    }
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Store in history
    conversationHistory.push({ message, isBot, timestamp: new Date() });
    
    // Save to localStorage
    try {
      localStorage.setItem('hp_chat_history', JSON.stringify(conversationHistory.slice(-20)));
    } catch (e) {
      console.warn('Could not save chat history');
    }
  }
  
  // Handle user message
  function handleUserMessage(message) {
    if (!message.trim()) return;
    
    // Add user message
    addMessage(message, false);
    
    // Show typing indicator
    const messagesContainer = document.getElementById('hp-chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'hp-chat-message hp-chat-bot hp-typing';
    typingDiv.innerHTML = `
      <div class="hp-chat-avatar-small">
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
        </svg>
      </div>
      <div class="hp-chat-bubble">
        <span class="hp-typing-dot"></span>
        <span class="hp-typing-dot"></span>
        <span class="hp-typing-dot"></span>
      </div>
    `;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Simulate AI response delay
    setTimeout(() => {
      typingDiv.remove();
      const response = generateResponse(message);
      addMessage(response, true);
    }, 800);
  }
  
  // Event listeners
  function attachEventListeners() {
    const toggleBtn = document.getElementById('hp-chatbot-toggle');
    const closeBtn = document.getElementById('hp-chat-close');
    const sendBtn = document.getElementById('hp-chat-send');
    const input = document.getElementById('hp-chat-input');
    const container = document.getElementById('hp-chatbot-container');
    const window = document.getElementById('hp-chatbot-window');
    
    // Toggle chat
    toggleBtn.addEventListener('click', () => {
      isOpen = !isOpen;
      if (isOpen) {
        container.classList.remove('hp-chatbot-closed');
        container.classList.add('hp-chatbot-open');
        window.classList.remove('hidden');
        document.querySelector('.hp-chat-icon').classList.add('hidden');
        document.querySelector('.hp-close-icon').classList.remove('hidden');
        input.focus();
      } else {
        container.classList.remove('hp-chatbot-open');
        container.classList.add('hp-chatbot-closed');
        window.classList.add('hidden');
        document.querySelector('.hp-chat-icon').classList.remove('hidden');
        document.querySelector('.hp-close-icon').classList.add('hidden');
      }
    });
    
    // Close button
    closeBtn.addEventListener('click', () => {
      toggleBtn.click();
    });
    
    // Send message
    sendBtn.addEventListener('click', () => {
      const message = input.value;
      handleUserMessage(message);
      input.value = '';
    });
    
    // Enter to send
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendBtn.click();
      }
    });
    
    // Quick action buttons
    document.querySelectorAll('.hp-quick-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const message = btn.getAttribute('data-message');
        handleUserMessage(message);
      });
    });
  }
  
  // Initialize on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createChatbot);
  } else {
    createChatbot();
  }
  
  // Expose to window for external calls
  window.HeartPetalChat = {
    open: () => {
      if (!isOpen) document.getElementById('hp-chatbot-toggle').click();
    },
    sendMessage: (msg) => {
      if (!isOpen) window.HeartPetalChat.open();
      setTimeout(() => handleUserMessage(msg), 300);
    }
  };
})();
