// Cart and checkout functionality for Heart and Petal site
// Heart & Petal Cart Logic with Error Handling & Inventory
// Features: add/remove/update, total calculation, localStorage, validation, stock tracking

const CART_KEY = 'heartAndPetalCart';

function getCart() {
	try {
		const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
		if (!Array.isArray(cart)) {
			console.warn('⚠️ Cart corrupted, resetting');
			return [];
		}
		return cart;
	} catch (e) {
		console.error('❌ Failed to parse cart:', e);
		return [];
	}
}

function saveCart(cart) {
	try {
		if (!Array.isArray(cart)) {
			console.error('❌ Invalid cart structure');
			return false;
		}
		localStorage.setItem(CART_KEY, JSON.stringify(cart));
		console.log('✅ Cart saved successfully');
		return true;
	} catch (e) {
		console.error('❌ Failed to save cart:', e);
		return false;
	}
}

function validateCartItem(item) {
	if (!item || typeof item !== 'object') {
		console.error('❌ Invalid item object');
		return false;
	}
	
	if (!item.id || typeof item.id !== 'string') {
		console.error('❌ Invalid product ID');
		return false;
	}
	
	if (!item.name || typeof item.name !== 'string') {
		console.error('❌ Invalid product name');
		return false;
	}
	
	if (typeof item.price !== 'number' || item.price < 0) {
		console.error('❌ Invalid price:', item.price);
		return false;
	}
	
	if (typeof item.quantity !== 'number' || item.quantity < 1) {
		console.error('❌ Invalid quantity:', item.quantity);
		return false;
	}
	
	return true;
}

function addToCart(product) {
	try {
		// Handle both old (id, name, price, img, qty) and new (object) signatures
		let cartItem;
		
		if (typeof product === 'object' && product.id !== undefined) {
			cartItem = {
				id: product.id,
				name: product.name,
				price: parseFloat(product.price) || 0,
				quantity: parseInt(product.quantity) || 1,
				img: product.img || '',
				variant: product.variant || null,
				giftNote: product.giftNote || ''
			};
		} else {
			// Legacy support: old function signature
			cartItem = {
				id: arguments[0],
				name: arguments[1],
				price: parseFloat(arguments[2]) || 0,
				img: arguments[3] || '',
				quantity: parseInt(arguments[4]) || 1,
				variant: null,
				giftNote: ''
			};
		}
		
		// Validate cart item
		if (!validateCartItem(cartItem)) {
			console.error('❌ Cart item validation failed', cartItem);
			if (window.showError) window.showError('Invalid product details. Please try again.');
			return false;
		}
		
		// Check inventory if function exists
		if (window.isProductInStock && !window.isProductInStock(cartItem.id, cartItem.quantity)) {
			console.error('❌ Insufficient stock for product:', cartItem.id);
			if (window.showError) window.showError('Sorry, this item is out of stock.');
			return false;
		}
		
		const cart = getCart();
		
		// IMPROVED: Find item by id AND variant to properly deduplicate
		const existingIndex = cart.findIndex(item => 
			item.id === cartItem.id && 
			JSON.stringify(item.variant) === JSON.stringify(cartItem.variant)
		);
		
		if (existingIndex > -1) {
			// Merge with existing item
			const newQuantity = cart[existingIndex].quantity + cartItem.quantity;
			
			// Validate total quantity doesn't exceed stock
			if (window.isProductInStock && !window.isProductInStock(cartItem.id, newQuantity)) {
				console.error('❌ Total quantity exceeds available stock');
				if (window.showError) window.showError('Sorry, we don\'t have enough stock for this quantity.');
				return false;
			}
			
			cart[existingIndex].quantity = newQuantity;
			if (cartItem.giftNote) cart[existingIndex].giftNote = cartItem.giftNote;
			console.log(`✅ Updated quantity for ${cartItem.name}: ${newQuantity}`);
		} else {
			// Add new item
			cart.push(cartItem);
			console.log(`✅ Added new item to cart: ${cartItem.name}`);
		}
		
		if (saveCart(cart)) {
			// Use cute notification system if available, fallback to old popup
			if (window.showSuccess) {
				const productImg = cartItem.img || cartItem.baseProduct?.img || null;
				window.showSuccess(`${cartItem.name} added to cart!`, productImg);
			} else {
				showCartPopup(cartItem);
			}
			updateCartDisplay();
			return true;
		}
		return false;
	} catch (e) {
		console.error('❌ Error adding to cart:', e);
		return false;
	}
}

function removeFromCart(productId) {
	try {
		if (!productId) {
			console.error('❌ No product ID provided');
			return false;
		}
		
		let cart = getCart();
		const originalLength = cart.length;
		cart = cart.filter(item => item.id !== productId);
		
		if (cart.length === originalLength) {
			console.warn('⚠️ Product not found in cart');
			return false;
		}
		
		if (saveCart(cart)) {
			console.log(`✅ Removed product from cart: ${productId}`);
			updateCartDisplay();
			return true;
		}
		return false;
	} catch (e) {
		console.error('❌ Error removing from cart:', e);
		return false;
	}
}

function updateQuantity(productId, quantity) {
	try {
		if (!productId) {
			console.error('❌ No product ID provided');
			return false;
		}
		
		quantity = parseInt(quantity) || 1;
		
		if (quantity < 1) {
			console.warn('⚠️ Quantity must be at least 1');
			return removeFromCart(productId);
		}
		
		const cart = getCart();
		const idx = cart.findIndex(item => item.id === productId);
		
		if (idx === -1) {
			console.error('❌ Product not found in cart');
			return false;
		}
		
		// Check inventory
		if (window.isProductInStock && !window.isProductInStock(productId, quantity)) {
			console.error('❌ Requested quantity exceeds available stock');
			return false;
		}
		
		cart[idx].quantity = quantity;
		
		if (saveCart(cart)) {
			console.log(`✅ Updated quantity for ${cart[idx].name} to ${quantity}`);
			updateCartDisplay();
			return true;
		}
		return false;
	} catch (e) {
		console.error('❌ Error updating quantity:', e);
		return false;
	}
}

function getCartTotal() {
	try {
		const cart = getCart();
		const total = cart.reduce((sum, item) => {
			const itemTotal = item.price * item.quantity;
			if (isNaN(itemTotal)) {
				console.warn(`⚠️ Invalid price calculation for ${item.name}`);
				return sum;
			}
			return sum + itemTotal;
		}, 0);
		
		// Return rounded to 2 decimals
		return Math.round(total * 100) / 100;
	} catch (e) {
		console.error('❌ Error calculating cart total:', e);
		return 0;
	}
}

// Example integration for Product Page
// This is now handled by product.html's own script section
// The addToCart function is exported globally at the bottom

// Example integration for Shop Page
// Add event listeners to all Add to Cart buttons and pass product info
// Example:
// document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
//   btn.onclick = function() {
//     addToCart({ id, name, price, quantity: 1 });
//   };
// });

// Branded popup when item is added to cart
function showCartPopup(product) {
	let popup = document.getElementById('cart-popup');
	if (!popup) {
		popup = document.createElement('div');
		popup.id = 'cart-popup';
		popup.style.position = 'fixed';
		popup.style.top = '2rem';
		popup.style.right = '2rem';
		popup.style.background = 'linear-gradient(135deg, #C21807 60%, #FFD1DC 100%)';
		popup.style.color = '#fff';
		popup.style.padding = '1.5rem 2.5rem 1.5rem 2rem';
		popup.style.borderRadius = '1.5rem';
		popup.style.boxShadow = '0 8px 32px rgba(44,44,44,0.18)';
		popup.style.fontFamily = 'Montserrat, Arial, sans-serif';
		popup.style.fontSize = '1.1rem';
		popup.style.zIndex = '10010';
		popup.style.display = 'flex';
		popup.style.alignItems = 'center';
		popup.innerHTML = '';
		document.body.appendChild(popup);
	}
	popup.innerHTML = `<img src='https://res.cloudinary.com/dij2fdtw4/image/upload/samples/logo.png' alt='Heart & Petal' style='height:2.5rem;margin-right:1rem;border-radius:1rem;background:#fff;'>
		<div><b>${product.name}</b> added to cart!<br><span style='font-size:0.95rem;'>View your cart or continue shopping.</span></div>`;
	popup.style.opacity = '1';
	popup.style.pointerEvents = 'auto';
	setTimeout(() => {
		popup.style.transition = 'opacity 0.5s';
		popup.style.opacity = '0';
		popup.style.pointerEvents = 'none';
	}, 2000);
}

// Update cart display (for nav/cart icon, etc.)
function updateCartDisplay() {
	// Example: update cart count in nav if element exists
	const cart = getCart();
	let count = 0;
	cart.forEach(item => count += item.quantity);
	let cartBtn = document.querySelector('a[href="checkout.html"]');
	if (cartBtn) {
		let badge = cartBtn.querySelector('.cart-count-badge');
		if (!badge) {
			badge = document.createElement('span');
			badge.className = 'cart-count-badge';
			badge.style.background = '#C21807';
			badge.style.color = '#fff';
			badge.style.fontSize = '0.9rem';
			badge.style.fontWeight = 'bold';
			badge.style.borderRadius = '1rem';
			badge.style.padding = '0.1rem 0.6rem';
			badge.style.marginLeft = '0.5rem';
			cartBtn.appendChild(badge);
		}
		badge.textContent = count > 0 ? count : '';
	}
}

// Export for shop.html dynamic use
window.addToCart = addToCart;
window.updateCartDisplay = updateCartDisplay;
