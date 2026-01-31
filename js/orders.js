// Heart & Petal Order & Email Confirmation System
// Simulates email sending and order confirmation

const ORDERS_KEY = 'hp_crm_orders';
const SENT_EMAILS_KEY = 'hp_sent_emails';

function normalizeUpdatesOptIn(orderData) {
  return {
    email: orderData.updatesEmail === true,
    sms: orderData.updatesSms === true
  };
}

function calculateEtaTimestamp(orderData) {
  const baseDate = orderData.deliveryDate ? new Date(orderData.deliveryDate) : new Date();
  if (!orderData.deliveryDate) {
    const shipping = (orderData.shipping || '').toLowerCase();
    const daysToAdd = shipping.includes('express') ? 2 : shipping.includes('valentine') ? 1 : 5;
    baseDate.setDate(baseDate.getDate() + daysToAdd);
  }
  const timeWindow = (orderData.deliveryTime || '').toLowerCase();
  if (timeWindow.includes('morning')) baseDate.setHours(10, 0, 0, 0);
  else if (timeWindow.includes('afternoon')) baseDate.setHours(15, 0, 0, 0);
  else if (timeWindow.includes('evening')) baseDate.setHours(19, 0, 0, 0);
  else baseDate.setHours(17, 0, 0, 0);
  return baseDate.getTime();
}

function buildInitialUpdateLog(orderData, updatesOptIn, etaTimestamp) {
  const updates = [];
  updates.push({
    id: Math.random().toString(36).substring(2),
    message: 'Order placed successfully.',
    channel: 'system',
    timestamp: new Date().toISOString()
  });
  if (updatesOptIn.email) {
    updates.push({
      id: Math.random().toString(36).substring(2),
      message: 'Email updates enabled for this order.',
      channel: 'email',
      timestamp: new Date().toISOString()
    });
  }
  if (updatesOptIn.sms) {
    updates.push({
      id: Math.random().toString(36).substring(2),
      message: 'SMS updates enabled for this order.',
      channel: 'sms',
      timestamp: new Date().toISOString()
    });
  }
  if (etaTimestamp) {
    updates.push({
      id: Math.random().toString(36).substring(2),
      message: 'Estimated delivery scheduled.',
      channel: 'system',
      timestamp: new Date().toISOString()
    });
  }
  return updates;
}

function generateOrderId() {
  return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9).toUpperCase();
}

function validateOrderData(orderData) {
  const required = ['name', 'email', 'phone', 'address', 'items', 'total'];
  for (let field of required) {
    if (!orderData[field]) {
      console.error(`❌ Missing required field: ${field}`);
      return false;
    }
  }
  
  if (!window.validateEmail(orderData.email)) {
    console.error('❌ Invalid email address');
    return false;
  }
  
  if (!window.validatePhoneNumber(orderData.phone)) {
    console.error('❌ Invalid phone number');
    return false;
  }
  
  if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
    console.error('❌ Cart is empty');
    return false;
  }
  
  if (typeof orderData.total !== 'number' || orderData.total <= 0) {
    console.error('❌ Invalid total amount');
    return false;
  }
  
  return true;
}

function createOrder(orderData) {
  try {
    if (!validateOrderData(orderData)) {
      return { success: false, error: 'Invalid order data' };
    }

    const updatesOptIn = normalizeUpdatesOptIn(orderData);
    const etaTimestamp = calculateEtaTimestamp(orderData);
    const updateLog = buildInitialUpdateLog(orderData, updatesOptIn, etaTimestamp);
    
    const order = {
      id: generateOrderId(),
      name: orderData.name.trim(),
      email: orderData.email.toLowerCase().trim(),
      phone: orderData.phone.trim(),
      address: orderData.address.trim(),
      shipping: orderData.shipping || 'Standard Delivery (3-5 days)',
      deliveryDate: orderData.deliveryDate || null,
      deliveryTime: orderData.deliveryTime || null,
      giftNote: orderData.giftNote || '',
      updatesOptIn,
      etaTimestamp,
      updateLog,
      discountCode: orderData.discountCode || null,
      discountAmount: orderData.discountAmount || 0,
      subtotal: orderData.subtotal || orderData.total + (orderData.discountAmount || 0),
      items: orderData.items,
      total: parseFloat(orderData.total).toFixed(2),
      status: 'Pending',
      created: new Date().toISOString(),
      paymentMethod: orderData.paymentMethod || 'PayPal'
    };
    
    // Save order
    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    orders.push(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    
    console.log(`✅ Order created: ${order.id}`);
    
    return { success: true, order: order };
  } catch (e) {
    console.error('❌ Error creating order:', e);
    return { success: false, error: 'Failed to create order' };
  }
}

function saveOrder(orderData) {
  const result = createOrder(orderData);
  if (result.success && result.order) {
    if (typeof simulateEmailConfirmation === 'function') {
      simulateEmailConfirmation(result.order);
    }
  }
  return result;
}

function simulateEmailConfirmation(order) {
  try {
    // Send REAL email using EmailJS
    const emailParams = {
      to_email: order.email,
      to_name: order.name,
      order_id: order.id,
      order_date: new Date(order.created).toLocaleDateString(),
      shipping_method: order.shipping,
      delivery_date: order.deliveryDate || 'To be confirmed',
      shipping_address: order.address,
      items_list: order.items.map(item => 
        `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
      ).join('\n'),
      subtotal: order.subtotal,
      discount_code: order.discountCode || '',
      discount_amount: order.discountAmount > 0 ? `$${order.discountAmount.toFixed(2)}` : '',
      total: order.total,
      gift_note: order.giftNote || '',
      message: generateEmailContent(order)
    };
    
    // Send via EmailJS (Service ID: service_qw61mye, Template ID: heartandpetal_order)
    emailjs.send('service_qw61mye', 'heartandpetal_order', emailParams)
      .then(function(response) {
        console.log('✅ REAL Email sent successfully!', response.status, response.text);
        
        // Also save email record locally for admin tracking
        const emailRecord = {
          id: Math.random().toString(36).substring(2),
          type: 'order-confirmation',
          to: order.email,
          recipientName: order.name,
          orderId: order.id,
          subject: `Order Confirmation #${order.id}`,
          sentAt: new Date().toISOString(),
          status: 'sent',
          content: generateEmailContent(order)
        };
        
        const emails = JSON.parse(localStorage.getItem(SENT_EMAILS_KEY) || '[]');
        emails.push(emailRecord);
        localStorage.setItem(SENT_EMAILS_KEY, JSON.stringify(emails));
      }, function(error) {
        console.error('❌ EmailJS sending failed:', error);
        // Still log as attempt
        const emailRecord = {
          id: Math.random().toString(36).substring(2),
          type: 'order-confirmation',
          to: order.email,
          recipientName: order.name,
          orderId: order.id,
          subject: `Order Confirmation #${order.id}`,
          sentAt: new Date().toISOString(),
          status: 'failed',
          error: error.text,
          content: generateEmailContent(order)
        };
        
        const emails = JSON.parse(localStorage.getItem(SENT_EMAILS_KEY) || '[]');
        emails.push(emailRecord);
        localStorage.setItem(SENT_EMAILS_KEY, JSON.stringify(emails));
      });
    
    console.log(`📧 Email sending initiated to ${order.email}`);
    console.log(`📦 Order ID: ${order.id}`);
    console.log(`💳 Total: $${order.total}`);
    
    return { success: true };
  } catch (e) {
    console.error('❌ Error sending confirmation email:', e);
    return { success: false, error: 'Failed to send email' };
  }
}

function generateEmailContent(order) {
  const itemsList = order.items.map(item => 
    `  • ${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
  ).join('\n');
  
  const content = `
Hello ${order.name},

Thank you for your order! We're delighted to have you as a customer.

ORDER CONFIRMATION
Order ID: ${order.id}
Order Date: ${new Date(order.created).toLocaleDateString()}

DELIVERY DETAILS
Shipping Method: ${order.shipping}
Delivery Date: ${order.deliveryDate || 'To be confirmed'}
${order.deliveryTime ? `Delivery Window: ${order.deliveryTime}\n` : ''}Shipping Address: ${order.address}
Shipping Address: ${order.address}

ORDER SUMMARY
${itemsList}

Subtotal: $${order.subtotal}
${order.discountAmount > 0 ? `Discount (${order.discountCode}): -$${order.discountAmount.toFixed(2)}\n` : ''}
Total: $${order.total}

${order.giftNote ? `GIFT NOTE:\n${order.giftNote}\n` : ''}

Your order is being prepared and will be sent shortly. You'll receive a shipping confirmation with tracking information.

For questions about your order, please reply to this email or visit our website.

Thank you for choosing Heart & Petal!

Best wishes,
The Heart & Petal Team
  `;
  
  return content.trim();
}

function getOrderHistory(email) {
  try {
    if (!window.validateEmail(email)) {
      return [];
    }
    
    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    return orders.filter(order => order.email === email.toLowerCase());
  } catch (e) {
    console.error('❌ Error fetching order history:', e);
    return [];
  }
}

function getOrderById(orderId) {
  try {
    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    const match = orders.find(order => order.id === orderId);
    if (match) return match;

    const legacyOrders = JSON.parse(localStorage.getItem('hp_orders') || '[]');
    const legacyMatch = legacyOrders.find(order => order.orderId === orderId || order.id === orderId);
    if (!legacyMatch) return null;

    return {
      id: legacyMatch.orderId || legacyMatch.id,
      name: legacyMatch.name || legacyMatch.customerName || 'Customer',
      email: legacyMatch.email || legacyMatch.customerEmail || '',
      phone: legacyMatch.phone || '',
      address: legacyMatch.address || legacyMatch.shippingAddress || '',
      shipping: legacyMatch.shipping || legacyMatch.deliveryService || 'Standard Delivery (3-5 days)',
      deliveryDate: legacyMatch.deliveryDate || null,
      deliveryTime: legacyMatch.deliveryTime || null,
      giftNote: legacyMatch.giftNote || '',
      items: legacyMatch.items || [],
      total: legacyMatch.total || 0,
      status: legacyMatch.status || legacyMatch.paymentStatus || 'Processing',
      created: legacyMatch.timestamp || new Date().toISOString(),
      updatesOptIn: legacyMatch.updatesOptIn || { email: false, sms: false },
      updateLog: legacyMatch.updateLog || []
    };
  } catch (e) {
    console.error('❌ Error fetching order:', e);
    return null;
  }
}

function updateOrderPreferences(orderId, updatesOptIn) {
  try {
    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx === -1) return { success: false, error: 'Order not found' };
    orders[idx].updatesOptIn = updatesOptIn;
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    return { success: true, order: orders[idx] };
  } catch (e) {
    console.error('❌ Error updating order preferences:', e);
    return { success: false, error: 'Failed to update preferences' };
  }
}

function appendOrderUpdate(orderId, message, channel = 'system') {
  try {
    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx === -1) return { success: false, error: 'Order not found' };
    const entry = {
      id: Math.random().toString(36).substring(2),
      message,
      channel,
      timestamp: new Date().toISOString()
    };
    orders[idx].updateLog = Array.isArray(orders[idx].updateLog) ? orders[idx].updateLog : [];
    orders[idx].updateLog.push(entry);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    return { success: true, order: orders[idx] };
  } catch (e) {
    console.error('❌ Error appending order update:', e);
    return { success: false, error: 'Failed to append update' };
  }
}

// Export helpers
window.saveOrder = saveOrder;
window.updateOrderPreferences = updateOrderPreferences;
window.appendOrderUpdate = appendOrderUpdate;

function updateOrderStatus(orderId, newStatus) {
  try {
    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex === -1) {
      return { success: false, error: 'Order not found' };
    }
    
    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(newStatus)) {
      return { success: false, error: 'Invalid status' };
    }
    
    orders[orderIndex].status = newStatus;
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    
    console.log(`✅ Order ${orderId} status updated to: ${newStatus}`);
    return { success: true, order: orders[orderIndex] };
  } catch (e) {
    console.error('❌ Error updating order status:', e);
    return { success: false, error: 'Failed to update order' };
  }
}

function getSentEmails(filter = {}) {
  try {
    const emails = JSON.parse(localStorage.getItem(SENT_EMAILS_KEY) || '[]');
    
    if (filter.type) {
      return emails.filter(e => e.type === filter.type);
    }
    
    if (filter.to) {
      return emails.filter(e => e.to === filter.to);
    }
    
    return emails;
  } catch (e) {
    console.error('❌ Error fetching sent emails:', e);
    return [];
  }
}

// Export globally
window.createOrder = createOrder;
window.simulateEmailConfirmation = simulateEmailConfirmation;
window.getOrderHistory = getOrderHistory;
window.getOrderById = getOrderById;
window.updateOrderStatus = updateOrderStatus;
window.getSentEmails = getSentEmails;
window.generateEmailContent = generateEmailContent;
