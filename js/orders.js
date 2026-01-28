// Heart & Petal Order & Email Confirmation System
// Simulates email sending and order confirmation

const ORDERS_KEY = 'hp_crm_orders';
const SENT_EMAILS_KEY = 'hp_sent_emails';

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
    
    const order = {
      id: generateOrderId(),
      name: orderData.name.trim(),
      email: orderData.email.toLowerCase().trim(),
      phone: orderData.phone.trim(),
      address: orderData.address.trim(),
      shipping: orderData.shipping || 'Standard Delivery (3-5 days)',
      deliveryDate: orderData.deliveryDate || null,
      giftNote: orderData.giftNote || '',
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

function simulateEmailConfirmation(order) {
  try {
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
    
    // Save email record
    const emails = JSON.parse(localStorage.getItem(SENT_EMAILS_KEY) || '[]');
    emails.push(emailRecord);
    localStorage.setItem(SENT_EMAILS_KEY, JSON.stringify(emails));
    
    // Log as if email was sent
    console.log(`📧 Email confirmation sent to ${order.email}`);
    console.log(`📦 Order ID: ${order.id}`);
    console.log(`💳 Total: $${order.total}`);
    
    return { success: true, emailRecord: emailRecord };
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
    return orders.find(order => order.id === orderId) || null;
  } catch (e) {
    console.error('❌ Error fetching order:', e);
    return null;
  }
}

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
