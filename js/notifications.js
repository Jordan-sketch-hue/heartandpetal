// Heart & Petal - Cute Notification System
// Creates branded, dismissible notifications with optional product images

function showNotification(message, type = 'info', imageUrl = null) {
  // Remove any existing notifications
  const existing = document.querySelector('.hp-notification');
  if (existing) existing.remove();
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `hp-notification hp-notification-${type}`;
  
  // Icon based on type
  const icons = {
    error: '💔',
    success: '✓',
    info: '🌸',
    warning: '⚠'
  };
  
  // Build content with optional image
  let content = '<div class="hp-notification-content">';
  
  if (imageUrl) {
    content += `<img src="${imageUrl}" alt="Product" class="hp-notification-img" onerror="this.style.display='none'">`;
  } else {
    content += `<span class="hp-notification-icon">${icons[type] || icons.info}</span>`;
  }
  
  content += `
    <span class="hp-notification-message">${message}</span>
    <button class="hp-notification-close" onclick="this.parentElement.parentElement.remove()">✕</button>
  </div>`;
  
  notification.innerHTML = content;
  
  // Add to page
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => notification.classList.add('hp-notification-show'), 10);
  
  // Auto-remove after 2.5 seconds (faster)
  setTimeout(() => {
    notification.classList.remove('hp-notification-show');
    setTimeout(() => notification.remove(), 250);
  }, 2500);
}

// Convenience functions - Export all to window for global access
window.showNotification = showNotification;
window.showError = (message, imageUrl = null) => showNotification(message, 'error', imageUrl);
window.showSuccess = (message, imageUrl = null) => showNotification(message, 'success', imageUrl);
window.showInfo = (message, imageUrl = null) => showNotification(message, 'info', imageUrl);
window.showWarning = (message, imageUrl = null) => showNotification(message, 'warning', imageUrl);
