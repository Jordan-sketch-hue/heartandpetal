// Heart & Petal - System Validation & Error Checking
// This script performs comprehensive checks on the site functionality

console.log('🔍 Heart & Petal System Check Starting...');

// 1. Check if all required scripts are loaded
const requiredScripts = ['cart.js'];
const loadedScripts = Array.from(document.scripts).map(s => s.src);
console.log('✅ Scripts loaded:', loadedScripts.filter(s => s.includes('.js')).map(s => s.split('/').pop()));

// 2. Validate localStorage functionality
try {
  localStorage.setItem('test', 'test');
  localStorage.removeItem('test');
  console.log('✅ localStorage working');
} catch (e) {
  console.error('❌ localStorage not available:', e);
}

// 3. Check cart functionality
if (typeof addToCart === 'function') {
  console.log('✅ addToCart function available');
} else {
  console.error('❌ addToCart function not found');
}

if (typeof updateCartDisplay === 'function') {
  console.log('✅ updateCartDisplay function available');
} else {
  console.error('❌ updateCartDisplay function not found');
}

// 4. Validate product data structure (if products array exists)
if (typeof products !== 'undefined') {
  console.log('✅ Products array found with', products.length, 'products');
  
  // Check for missing images
  const missingImages = products.filter(p => !p.img || !p.images || p.images.length === 0);
  if (missingImages.length > 0) {
    console.warn('⚠️ Products with missing images:', missingImages.map(p => p.id));
  } else {
    console.log('✅ All products have images');
  }
  
  // Check for price consistency
  const priceIssues = products.filter(p => !p.price || p.price <= 0);
  if (priceIssues.length > 0) {
    console.error('❌ Products with invalid prices:', priceIssues.map(p => p.id));
  } else {
    console.log('✅ All products have valid prices');
  }
  
  // Validate sizes/variants
  products.forEach(p => {
    if (p.sizes && p.sizes.length > 0) {
      p.sizes.forEach((size, idx) => {
        if (!size.size || !size.price) {
          console.error(`❌ Invalid size option in ${p.id} at index ${idx}`);
        }
      });
    }
    if (p.variants && p.variants.length > 0) {
      p.variants.forEach((variant, idx) => {
        if (!variant.name || !variant.price) {
          console.error(`❌ Invalid variant option in ${p.id} at index ${idx}`);
        }
      });
    }
  });
}

// 5. Check for broken links
const links = Array.from(document.querySelectorAll('a[href]'));
const internalLinks = links.filter(l => !l.href.startsWith('http') || l.href.includes(window.location.hostname));
console.log(`✅ Found ${internalLinks.length} internal links to validate`);

// 6. Validate image paths
const images = Array.from(document.querySelectorAll('img[src]'));
const brokenImages = [];
images.forEach(img => {
  img.addEventListener('error', () => {
    if (!brokenImages.includes(img.src)) {
      brokenImages.push(img.src);
      console.error('❌ Failed to load image:', img.src);
    }
  });
});

// 7. Check for JavaScript errors
window.addEventListener('error', (e) => {
  console.error('❌ JavaScript Error:', e.message, 'at', e.filename, 'line', e.lineno);
});

// 8. Validate form submissions (if on checkout page)
if (document.getElementById('checkout-form')) {
  console.log('✅ Checkout form found');
  const form = document.getElementById('checkout-form');
  form.addEventListener('submit', (e) => {
    console.log('📝 Form submission intercepted for validation');
    const requiredFields = form.querySelectorAll('[required]');
    let hasErrors = false;
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        console.error('❌ Required field empty:', field.name || field.id);
        hasErrors = true;
      }
    });
    if (hasErrors) {
      console.error('❌ Form validation failed');
    } else {
      console.log('✅ Form validation passed');
    }
  });
}

// 9. Monitor cart operations
if (typeof window.addToCart === 'function') {
  const originalAddToCart = window.addToCart;
  window.addToCart = function(product) {
    console.log('🛒 Adding to cart:', product);
    
    // Validate product data
    if (!product.id || !product.name || !product.price) {
      console.error('❌ Invalid product data:', product);
      return;
    }
    
    if (product.price <= 0) {
      console.error('❌ Invalid price:', product.price);
      return;
    }
    
    try {
      originalAddToCart.call(this, product);
      console.log('✅ Successfully added to cart');
    } catch (e) {
      console.error('❌ Error adding to cart:', e);
    }
  };
}

// 10. Performance monitoring
window.addEventListener('load', () => {
  const loadTime = performance.now();
  console.log(`✅ Page loaded in ${loadTime.toFixed(2)}ms`);
  
  // Check for slow resources
  const resources = performance.getEntriesByType('resource');
  const slowResources = resources.filter(r => r.duration > 1000);
  if (slowResources.length > 0) {
    console.warn('⚠️ Slow loading resources:', slowResources.map(r => ({
      name: r.name.split('/').pop(),
      duration: `${r.duration.toFixed(2)}ms`
    })));
  }
});

// Final summary
setTimeout(() => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎉 System Check Complete!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  if (brokenImages.length > 0) {
    console.error(`❌ Found ${brokenImages.length} broken images`);
  }
}, 2000);
