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

// Branded Modal Alert (with OK button)
function showBrandedAlert(message, title = 'Alert', type = 'info', onClose = null) {
  const modal = document.getElementById('branded-modal-alert');
  if (!modal) {
    console.error('Branded alert modal not found on page');
    alert(message); // Fallback
    return;
  }
  
  const titleEl = modal.querySelector('#branded-modal-title');
  const msgEl = modal.querySelector('#branded-modal-message');
  const iconEl = modal.querySelector('#branded-modal-icon');
  const okBtn = modal.querySelector('#branded-modal-ok');
  const closeBtn = modal.querySelector('#branded-modal-close');
  
  if (titleEl) titleEl.textContent = title;
  if (msgEl) msgEl.innerHTML = message;
  
  // Set icon based on type
  const icons = {
    success: '<svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    error: '<svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l-2 2m8-8l-2 2m0 0l-2-2m2 2l2-2m-2 2l-2 2M9 12a9 9 0 1118 0 9 9 0 01-18 0z"/></svg>',
    warning: '<svg class="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    info: '<svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
  };
  
  if (iconEl) iconEl.innerHTML = icons[type] || icons.info;
  
  const close = () => {
    modal.classList.add('hidden');
    if (onClose) onClose();
  };
  
  if (okBtn) okBtn.onclick = close;
  if (closeBtn) closeBtn.onclick = close;
  
  modal.classList.remove('hidden');
}

// Branded Modal Confirm (with Yes/No buttons)
function showBrandedConfirm(message, title = 'Confirm', onConfirm = null, onCancel = null) {
  const modal = document.getElementById('branded-modal-confirm');
  if (!modal) {
    console.error('Branded confirm modal not found on page');
    if (confirm(message)) {
      if (onConfirm) onConfirm();
    } else {
      if (onCancel) onCancel();
    }
    return;
  }
  
  const titleEl = modal.querySelector('#branded-confirm-title');
  const msgEl = modal.querySelector('#branded-confirm-message');
  const yesBtn = modal.querySelector('#branded-confirm-yes');
  const noBtn = modal.querySelector('#branded-confirm-no');
  const closeBtn = modal.querySelector('#branded-confirm-close');
  
  if (titleEl) titleEl.textContent = title;
  if (msgEl) msgEl.textContent = message;
  
  const close = () => modal.classList.add('hidden');
  
  if (yesBtn) {
    yesBtn.onclick = () => {
      close();
      if (onConfirm) onConfirm();
    };
  }
  
  if (noBtn) {
    noBtn.onclick = () => {
      close();
      if (onCancel) onCancel();
    };
  }
  
  if (closeBtn) closeBtn.onclick = () => {
    close();
    if (onCancel) onCancel();
  };
  
  modal.classList.remove('hidden');
}

// Convenience functions - Export all to window for global access
window.showNotification = showNotification;
window.showError = (message, imageUrl = null) => showNotification(message, 'error', imageUrl);
window.showSuccess = (message, imageUrl = null) => showNotification(message, 'success', imageUrl);
window.showInfo = (message, imageUrl = null) => showNotification(message, 'info', imageUrl);
window.showWarning = (message, imageUrl = null) => showNotification(message, 'warning', imageUrl);
window.showBrandedAlert = showBrandedAlert;
window.showBrandedConfirm = showBrandedConfirm;

