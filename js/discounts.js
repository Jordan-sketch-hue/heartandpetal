// Heart & Petal Discount Code System
// Manages promotional codes and discount calculations

const DISCOUNTS_KEY = 'hp_discounts';

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

function validateDiscountCode(code, cartTotal = 0) {
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

function applyDiscountToCart(code, cartTotal) {
  const validation = validateDiscountCode(code, cartTotal);
  
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
  const result = applyDiscountToCart(upperCode, subtotal);
  
  if (result.applied) {
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

// Export globally
window.validateDiscountCode = validateDiscountCode;
window.calculateDiscount = calculateDiscount;
window.applyDiscountToCart = applyDiscountToCart;
window.applyDiscount = applyDiscount;
window.getActiveDiscounts = getActiveDiscounts;
window.getDiscountCodes = getDiscountCodes;
