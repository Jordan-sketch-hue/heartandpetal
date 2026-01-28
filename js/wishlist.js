// Heart & Petal Wishlist System
const WISHLIST_KEY = 'hp_wishlist';

function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
  } catch (e) {
    console.error('Error loading wishlist:', e);
    return [];
  }
}

function saveWishlist(wishlist) {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    updateWishlistBadge();
    return true;
  } catch (e) {
    console.error('Error saving wishlist:', e);
    return false;
  }
}

function addToWishlist(productId, productName, productPrice, productImg) {
  const wishlist = getWishlist();
  
  // Check if already in wishlist
  if (wishlist.find(item => item.id === productId)) {
    return { success: false, message: 'Already in wishlist' };
  }
  
  wishlist.push({
    id: productId,
    name: productName,
    price: productPrice,
    img: productImg,
    addedAt: new Date().toISOString()
  });
  
  saveWishlist(wishlist);
  return { success: true, message: 'Added to wishlist!' };
}

function removeFromWishlist(productId) {
  const wishlist = getWishlist();
  const filtered = wishlist.filter(item => item.id !== productId);
  saveWishlist(filtered);
  return { success: true, message: 'Removed from wishlist' };
}

function isInWishlist(productId) {
  const wishlist = getWishlist();
  return wishlist.some(item => item.id === productId);
}

function clearWishlist() {
  saveWishlist([]);
  return { success: true, message: 'Wishlist cleared' };
}

function updateWishlistBadge() {
  const wishlist = getWishlist();
  const badges = document.querySelectorAll('.wishlist-badge');
  badges.forEach(badge => {
    badge.textContent = wishlist.length;
    badge.style.display = wishlist.length > 0 ? 'flex' : 'none';
  });
}

// Export globally
window.getWishlist = getWishlist;
window.addToWishlist = addToWishlist;
window.removeFromWishlist = removeFromWishlist;
window.isInWishlist = isInWishlist;
window.clearWishlist = clearWishlist;
window.updateWishlistBadge = updateWishlistBadge;

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updateWishlistBadge);
} else {
  updateWishlistBadge();
}
