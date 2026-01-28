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
    delivery: 'We offer FREE DELIVERY on all orders across the USA! Choose from Standard (3-5 days), Express (1-2 days), or Valentine\'s Day Guaranteed shipping - all FREE for a limited time! 💐',
    shipping: 'We offer FREE DELIVERY on all orders across the USA! Choose from Standard (3-5 days), Express (1-2 days), or Valentine\'s Day Guaranteed shipping - all FREE for a limited time! 💐',
    payment: 'We accept secure PayPal payments for all orders. Your payment information is fully encrypted and protected.',
    track: 'You can track your order from your customer profile dashboard. Just log in and go to the "Track Order" tab!',
    returns: 'Due to the perishable nature of our products, we don\'t accept returns. However, if you\'re not satisfied, please contact us at support@heartandpetal.com and we\'ll make it right!',
    valentine: 'Valentine\'s Day is our busiest time! Order now to guarantee delivery. We offer special Valentine\'s Day Guaranteed shipping - completely FREE! 💝',
    sizes: 'Most of our flower arrangements come in multiple sizes (small, medium, large, deluxe) with optional vases. Select your preference at checkout!',
    custom: 'For custom orders or special requests, please call us at (555) PETAL-01 or email custom@heartandpetal.com',
    account: 'Create a customer account to track orders, save favorites to your wishlist, and get exclusive offers! Click "Login | Register" in the top menu.'
  };
  
  // AI Response Generator
  function generateResponse(userMessage) {
    const msg = userMessage.toLowerCase();
    
    // Greeting detection
    if (msg.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/)) {
      return 'Hello! 🌹 Welcome to Heart & Petal! I\'m here to help you find the perfect gift. What can I help you with today?';
    }
    
    // FAQ detection
    for (const [keyword, response] of Object.entries(faqResponses)) {
      if (msg.includes(keyword)) {
        return response;
      }
    }
    
    // Product category detection
    for (const [category, description] of Object.entries(productCategories)) {
      if (msg.includes(category) || msg.includes(description.split(' ')[0])) {
        return `We have beautiful ${description}! You can browse our ${category} collection on our shop page. Would you like me to direct you there? 🌸`;
      }
    }
    
    // Price inquiry
    if (msg.includes('price') || msg.includes('cost') || msg.includes('how much')) {
      return 'Our products range from $9.99 to $224.99 depending on the item and size. Plus, all shipping is FREE right now! Browse our shop to see our full collection and pricing. 💐';
    }
    
    // Occasion detection
    if (msg.includes('valentine') || msg.includes('anniversary') || msg.includes('birthday') || msg.includes('wedding')) {
      return 'Perfect timing! We specialize in gifts for special occasions. I recommend checking out our gift combos - they include flowers, chocolates, and a teddy bear. Very romantic! 💝';
    }
    
    // Contact/Support
    if (msg.includes('contact') || msg.includes('phone') || msg.includes('email') || msg.includes('support')) {
      return 'You can reach us at:\n📞 Phone: (555) PETAL-01\n📧 Email: support@heartandpetal.com\n\nOr I can help you right here! What do you need? 😊';
    }
    
    // Default helpful response
    return 'I\'d be happy to help! Here are some things I can assist with:\n\n🌹 Browse products (roses, chocolates, teddy bears)\n🚚 Delivery information\n📦 Track your order\n💳 Payment & checkout\n💝 Gift recommendations\n\nWhat would you like to know?';
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
          <span class="hp-chat-badge">💬</span>
        </button>
        
        <!-- Chat Window -->
        <div id="hp-chatbot-window" class="hp-chat-window hidden">
          <!-- Header -->
          <div class="hp-chat-header">
            <div class="flex items-center gap-2">
              <div class="hp-chat-avatar">🌹</div>
              <div>
                <div class="font-bold text-white text-sm">Heart & Petal Assistant</div>
                <div class="text-xs text-pink-100">Online • Here to help!</div>
              </div>
            </div>
            <button id="hp-chat-close" class="hp-chat-header-close">✕</button>
          </div>
          
          <!-- Messages -->
          <div id="hp-chat-messages" class="hp-chat-messages">
            <div class="hp-chat-message hp-chat-bot">
              <div class="hp-chat-avatar-small">🌹</div>
              <div class="hp-chat-bubble">
                Hello! 👋 I'm your Heart & Petal assistant. How can I help you today?
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
            <button class="hp-quick-btn" data-message="Tell me about delivery">📦 Delivery</button>
            <button class="hp-quick-btn" data-message="Show me roses">🌹 Roses</button>
            <button class="hp-quick-btn" data-message="Track my order">📍 Track Order</button>
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
        <div class="hp-chat-avatar-small">🌹</div>
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
      <div class="hp-chat-avatar-small">🌹</div>
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
