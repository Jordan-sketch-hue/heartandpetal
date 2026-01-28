// Heart & Petal Inventory System
// Manages stock levels, limited supplies, and product availability

const INVENTORY_KEY = 'hp_inventory';

// Product stock - popular items have limited stock
const productStock = {
  'roses1': { stock: 2, limited: true },    // Almost Gone
  'roses2': { stock: 4, limited: true },    // Few Items Left
  'roses3': { stock: 8, limited: true },    // Limited Stock
  'roses4': { stock: 20, limited: false },
  'roses5': { stock: 3, limited: true },    // Few Items Left
  'roses6': { stock: 25, limited: false },
  'roses7': { stock: 18, limited: false },
  'roses8': { stock: 5, limited: true },    // Few Items Left
  'roses9': { stock: 30, limited: false },
  'roses10': { stock: 1, limited: true },   // Almost Gone
  'choc1': { stock: 2, limited: true },     // Almost Gone
  'choc2': { stock: 14, limited: false },
  'choc3': { stock: 4, limited: true },     // Few Items Left
  'choc4': { stock: 22, limited: false },
  'choc5': { stock: 1, limited: true },     // Almost Gone
  'choc6': { stock: 28, limited: false },
  'choc7': { stock: 16, limited: false },
  'choc8': { stock: 5, limited: true },     // Few Items Left
  'choc9': { stock: 32, limited: false },
  'choc10': { stock: 3, limited: true },    // Few Items Left
  'teddy1': { stock: 2, limited: true },    // Almost Gone
  'teddy2': { stock: 11, limited: false },
  'teddy3': { stock: 4, limited: true },    // Few Items Left
  'teddy4': { stock: 24, limited: false },
  'teddy5': { stock: 1, limited: true },    // Almost Gone
  'teddy6': { stock: 27, limited: false },
  'teddy7': { stock: 19, limited: false },
  'teddy8': { stock: 5, limited: true },    // Few Items Left
  'teddy9': { stock: 35, limited: false },
  'teddy10': { stock: 3, limited: true },   // Few Items Left
  'combo1': { stock: 2, limited: true },    // Almost Gone
  'combo2': { stock: 13, limited: false },
  'combo3': { stock: 4, limited: true },    // Few Items Left
  'combo4': { stock: 21, limited: false },
  'combo5': { stock: 1, limited: true },    // Almost Gone
  'combo6': { stock: 26, limited: false },
  'combo7': { stock: 17, limited: false },
  'combo8': { stock: 8, limited: true },    // Limited Stock
  'combo9': { stock: 33, limited: false },
  'combo10': { stock: 2, limited: true },   // Almost Gone
  'flower1': { stock: 9, limited: true },
  'flower2': { stock: 15, limited: false },
  'flower3': { stock: 11, limited: false },
  'flower4': { stock: 23, limited: false },
  'flower5': { stock: 6, limited: true },
  'flower6': { stock: 29, limited: false },
  'flower7': { stock: 20, limited: false },
  'flower8': { stock: 8, limited: true },
  'flower9': { stock: 31, limited: false },
  'flower10': { stock: 8, limited: true }
};

function initializeInventory() {
  try {
    if (!localStorage.getItem(INVENTORY_KEY)) {
      localStorage.setItem(INVENTORY_KEY, JSON.stringify(productStock));
      console.log('✅ Inventory initialized');
    }
  } catch (e) {
    console.error('❌ Failed to initialize inventory:', e);
  }
}

function getInventory() {
  try {
    return JSON.parse(localStorage.getItem(INVENTORY_KEY) || '{}');
  } catch (e) {
    console.error('❌ Failed to parse inventory:', e);
    return productStock;
  }
}

function saveInventory(inventory) {
  try {
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(inventory));
  } catch (e) {
    console.error('❌ Failed to save inventory:', e);
  }
}

function getProductStock(productId) {
  const inventory = getInventory();
  return inventory[productId] || { stock: 999, limited: false };
}

function isProductInStock(productId, quantity = 1) {
  const { stock } = getProductStock(productId);
  return stock >= quantity;
}

function isProductLimited(productId) {
  const { limited } = getProductStock(productId);
  return limited;
}

// Get urgency messaging for popular items regardless of inventory
// Popular categories: roses, teddy bears, chocolates, combos
function getUrgencyMessage(productId) {
  const { stock, limited } = getProductStock(productId);
  
  // Determine if this is a popular item category
  const isPopular = isPopularItem(productId);
  
  // Show urgency for popular items with limited stock OR any item with very low stock
  if (isPopular || limited) {
    if (stock <= 2) {
      return {
        text: 'Almost Gone',
        class: 'urgency-critical',
        color: '#C21807'
      };
    } else if (stock <= 5) {
      return {
        text: 'Few Items Left',
        class: 'urgency-high',
        color: '#FF5722'
      };
    } else if (stock <= 10) {
      return {
        text: 'Limited Stock',
        class: 'urgency-medium',
        color: '#FF9800'
      };
    }
  }
  
  return null;
}

// Identify if product is in popular category (high demand items)
function isPopularItem(productId) {
  // Popular items: roses, teddies, chocolates, combos
  const category = productId.split(/(\d+)/)[0].toLowerCase();
  const popularCategories = ['roses', 'teddy', 'choc', 'combo'];
  return popularCategories.includes(category);
}

function getStockStatus(productId) {
  const { stock, limited } = getProductStock(productId);
  
  if (stock <= 0) {
    return { status: 'out-of-stock', text: 'Out of Stock', color: 'text-red-700' };
  }
  
  if (limited && stock <= 5) {
    return { status: 'low-stock', text: 'Low Stock', color: 'text-orange-700' };
  }
  
  if (limited) {
    return { status: 'limited', text: 'Limited Supply', color: 'text-amber-700' };
  }
  
  return { status: 'in-stock', text: 'In Stock', color: 'text-green-700' };
}

function reserveStock(productId, quantity = 1) {
  try {
    const inventory = getInventory();
    const product = inventory[productId];
    
    if (!product) {
      console.warn(`⚠️ Product ${productId} not found in inventory`);
      return false;
    }
    
    if (product.stock < quantity) {
      console.error(`❌ Insufficient stock for ${productId}. Need: ${quantity}, Available: ${product.stock}`);
      return false;
    }
    
    product.stock -= quantity;
    saveInventory(inventory);
    console.log(`✅ Reserved ${quantity} units of ${productId}. Remaining: ${product.stock}`);
    return true;
  } catch (e) {
    console.error('❌ Failed to reserve stock:', e);
    return false;
  }
}

function releaseStock(productId, quantity = 1) {
  try {
    const inventory = getInventory();
    const product = inventory[productId];
    
    if (!product) {
      console.warn(`⚠️ Product ${productId} not found in inventory`);
      return false;
    }
    
    product.stock += quantity;
    saveInventory(inventory);
    console.log(`✅ Released ${quantity} units of ${productId}. Available: ${product.stock}`);
    return true;
  } catch (e) {
    console.error('❌ Failed to release stock:', e);
    return false;
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initializeInventory();
  
  // Test urgency system
  console.log('🎯 Testing Urgency System:');
  console.log('roses1 urgency:', window.getUrgencyMessage('roses1'));
  console.log('choc1 urgency:', window.getUrgencyMessage('choc1'));
  console.log('teddy1 urgency:', window.getUrgencyMessage('teddy1'));
  console.log('combo1 urgency:', window.getUrgencyMessage('combo1'));
});

// Export globally
window.getProductStock = getProductStock;
window.isProductInStock = isProductInStock;
window.isProductLimited = isProductLimited;
window.getStockStatus = getStockStatus;
window.reserveStock = reserveStock;
window.releaseStock = releaseStock;
window.getUrgencyMessage = getUrgencyMessage;
window.isPopularItem = isPopularItem;
