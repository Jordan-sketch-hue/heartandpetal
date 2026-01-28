// Heart & Petal - Minimalistic Notification System
// Creates branded, dismissible notifications with optional product images

function showNotification(message, type = 'info', imageUrl = null) {
  // Remove any existing notifications
  const existing = document.querySelector('.hp-notification');
  if (existing) existing.remove();
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `hp-notification hp-notification-${type}`;
  
  // SVG icons based on type (no emojis)
  const icons = {
    error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
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
