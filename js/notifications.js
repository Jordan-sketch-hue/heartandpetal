// Heart & Petal - Cute Notification System
// Creates branded, dismissible notifications

function showNotification(message, type = 'info') {
  // Remove any existing notifications
  const existing = document.querySelector('.hp-notification');
  if (existing) existing.remove();
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `hp-notification hp-notification-${type}`;
  
  // Icon based on type
  const icons = {
    error: '💔',
    success: '💐',
    info: '🌸',
    warning: '🌹'
  };
  
  notification.innerHTML = `
    <div class="hp-notification-content">
      <span class="hp-notification-icon">${icons[type] || icons.info}</span>
      <span class="hp-notification-message">${message}</span>
      <button class="hp-notification-close" onclick="this.parentElement.parentElement.remove()">✕</button>
    </div>
  `;
  
  // Add to page
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => notification.classList.add('hp-notification-show'), 10);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    notification.classList.remove('hp-notification-show');
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// Convenience functions - Export all to window for global access
window.showNotification = showNotification;
window.showError = (message) => showNotification(message, 'error');
window.showSuccess = (message) => showNotification(message, 'success');
window.showInfo = (message) => showNotification(message, 'info');
window.showWarning = (message) => showNotification(message, 'warning');
