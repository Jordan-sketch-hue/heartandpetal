// Heart & Petal Discount Code System
// Manages promotional codes and discount calculations with one-time use tracking

const DISCOUNTS_KEY = 'hp_discounts';
const USED_COUPONS_KEY = 'hp_used_coupons';

// Pre-defined discount codes
const discountCodes = {
  'LOVE20': { type: 'percent', value: 20, description: 'Valentine\'s Love - 20% off', active: true, minPurchase: 0 },
  'HEART10': { type: 'percent', value: 10, description: 'Heart Discount - 10% off', active: true, minPurchase: 25 },
  'ROSE50': { type: 'fixed', value: 50, description: '$50 off orders $100+', active: true, minPurchase: 100 },
  'SAVE15': { type: 'percent', value: 15, description: '15% off any order', active: true, minPurchase: 0 },
  'CUPID5': { type: 'fixed', value: 5, description: '$5 off orders $30+', active: true, minPurchase: 30 },
  'BLOOM25': { type: 'percent', value: 25, description: 'Spring Bloom - 25% off', active: false, minPurchase: 0 },
  'THANK30': { type: 'percent', value: 30, description: '30% off select items', active: true, minPurchase: 50 },
  'GIFT10': { type: 'fixed', value: 10, description: '$10 off gifts', active: true, minPurchase: 40 }
};

function initializeDiscounts() {
  try {
    if (!localStorage.getItem(DISCOUNTS_KEY)) {
      localStorage.setItem(DISCOUNTS_KEY, JSON.stringify(discountCodes));
      console.log('✅ Discount codes initialized');
    }
  } catch (e) {
    console.error('❌ Failed to initialize discounts:', e);
  }
}

function getDiscountCodes() {
  try {
    return JSON.parse(localStorage.getItem(DISCOUNTS_KEY) || '{}');
  } catch (e) {
    console.error('❌ Failed to parse discounts:', e);
    return discountCodes;
  }
}

// Track used coupons per user
function getUserUsedCoupons(userEmail) {
  try {
    const usedCoupons = JSON.parse(localStorage.getItem(USED_COUPONS_KEY) || '{}');
    return usedCoupons[userEmail] || [];
  } catch (e) {
    console.error('❌ Failed to get used coupons:', e);
    return [];
  }
}

function markCouponAsUsed(userEmail, couponCode) {
  try {
    const usedCoupons = JSON.parse(localStorage.getItem(USED_COUPONS_KEY) || '{}');
    if (!usedCoupons[userEmail]) {
      usedCoupons[userEmail] = [];
    }
    if (!usedCoupons[userEmail].includes(couponCode)) {
      usedCoupons[userEmail].push(couponCode);
      localStorage.setItem(USED_COUPONS_KEY, JSON.stringify(usedCoupons));
      console.log(`✅ Coupon ${couponCode} marked as used for ${userEmail}`);
    }
  } catch (e) {
    console.error('❌ Failed to mark coupon as used:', e);
  }
}

function validateDiscountCode(code, cartTotal = 0, userEmail = null) {
  try {
    const upperCode = (code || '').toUpperCase().trim();
    const discounts = getDiscountCodes();
    const discount = discounts[upperCode];
    
    if (!discount) {
      return { valid: false, error: 'Invalid code', discount: null };
    }
    
    if (!discount.active) {
      return { valid: false, error: 'This code is no longer active', discount: null };
    }
    
    // Check if user already used this coupon (one-time use)
    if (userEmail) {
      const usedCoupons = getUserUsedCoupons(userEmail);
      if (usedCoupons.includes(upperCode)) {
        return { valid: false, error: 'You have already used this coupon', discount: null };
      }
    }
    
    if (cartTotal < discount.minPurchase) {
      return { 
        valid: false, 
        error: `Minimum purchase of $${discount.minPurchase.toFixed(2)} required`, 
        discount: null 
      };
    }
    
    return { valid: true, error: null, discount: discount };
  } catch (e) {
    console.error('❌ Error validating discount code:', e);
    return { valid: false, error: 'Error validating code', discount: null };
  }
}

function calculateDiscount(cartTotal, discount) {
  try {
    if (!discount) return 0;
    
    if (discount.type === 'percent') {
      const discountAmount = (cartTotal * discount.value) / 100;
      return Math.round(discountAmount * 100) / 100; // Round to 2 decimals
    }
    
    if (discount.type === 'fixed') {
      return Math.min(discount.value, cartTotal); // Can't discount more than total
    }
    
    return 0;
  } catch (e) {
    console.error('❌ Error calculating discount:', e);
    return 0;
  }
}

function applyDiscountToCart(code, cartTotal, userEmail = null) {
  const validation = validateDiscountCode(code, cartTotal, userEmail);
  
  if (!validation.valid) {
    console.warn(`⚠️ Discount validation failed: ${validation.error}`);
    return {
      applied: false,
      code: code,
      discount: 0,
      newTotal: cartTotal,
      error: validation.error
    };
  }
  
  const discountAmount = calculateDiscount(cartTotal, validation.discount);
  const newTotal = Math.max(0, cartTotal - discountAmount);
  
  console.log(`✅ Discount applied: ${code} saves $${discountAmount.toFixed(2)}`);
  
  return {
    applied: true,
    code: code,
    discount: discountAmount,
    newTotal: newTotal,
    description: validation.discount.description,
    error: null
  };
}

function getActiveDiscounts() {
  const discounts = getDiscountCodes();
  return Object.entries(discounts)
    .filter(([_, d]) => d.active)
    .map(([code, details]) => ({ code, ...details }));
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeDiscounts);

// Wrapper function for checkout compatibility
function applyDiscount(code, cart, subtotal) {
  const upperCode = (code || '').toUpperCase().trim();
  
  // Get current user email
  let userEmail = null;
  try {
    const session = JSON.parse(localStorage.getItem('hp_session') || 'null');
    userEmail = session ? session.email : null;
  } catch (e) {
    console.error('Could not get user session');
  }
  
  const result = applyDiscountToCart(upperCode, subtotal, userEmail);
  
  if (result.applied) {
    // Mark coupon as used for this user
    if (userEmail) {
      markCouponAsUsed(userEmail, upperCode);
    }
    
    return {
      success: true,
      discountAmount: result.discount,
      message: `Code "${upperCode}" applied! You saved $${result.discount.toFixed(2)} (${result.description})`,
      code: upperCode
    };
  } else {
    return {
      success: false,
      discountAmount: 0,
      message: result.error || 'Invalid discount code',
      code: upperCode
    };
  }
}

// Get available coupons for user (excluding already used ones)
function getAvailableCouponsForUser(userEmail) {
  const discounts = getDiscountCodes();
  const usedCoupons = getUserUsedCoupons(userEmail);
  
  return Object.entries(discounts)
    .filter(([code, details]) => details.active && !usedCoupons.includes(code))
    .map(([code, details]) => ({ 
      code, 
      ...details,
      used: false
    }));
}

// Get used coupons for user
function getUsedCouponsForUser(userEmail) {
  const discounts = getDiscountCodes();
  const usedCoupons = getUserUsedCoupons(userEmail);
  
  return usedCoupons.map(code => ({
    code,
    ...(discounts[code] || {}),
    used: true
  }));
}

// Export globally
window.validateDiscountCode = validateDiscountCode;
window.calculateDiscount = calculateDiscount;
window.applyDiscountToCart = applyDiscountToCart;
window.applyDiscount = applyDiscount;
window.getActiveDiscounts = getActiveDiscounts;
window.getDiscountCodes = getDiscountCodes;
window.getUserUsedCoupons = getUserUsedCoupons;
window.markCouponAsUsed = markCouponAsUsed;
window.getAvailableCouponsForUser = getAvailableCouponsForUser;
window.getUsedCouponsForUser = getUsedCouponsForUser;
