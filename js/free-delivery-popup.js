// Heart & Petal - Free Delivery Popup (site-wide)
// Shows once per day per browser

(function () {
  function buildModal() {
    const modal = document.createElement('div');
    modal.id = 'free-delivery-popup';
    modal.className = 'fixed inset-0 bg-black/60 z-[100] flex items-center justify-center hidden';
    modal.innerHTML = `
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden transform transition-all">
        <button id="free-delivery-close" class="absolute top-4 right-4 text-gray-400 hover:text-deep-red text-3xl font-bold z-10">&times;</button>
        <div class="hp-promo-header text-white text-center py-8 px-6 relative">
          <h2 class="font-playfair text-3xl font-bold mb-2">Free Delivery</h2>
          <p class="text-lg">Limited Time Offer</p>
        </div>
        <div class="p-8 text-center">
          <div class="mb-6">
            <p class="text-2xl font-bold text-deep-red mb-2">FREE DELIVERY</p>
            <p class="text-gray-600 text-sm mb-1">on ALL orders across the USA</p>
            <p class="text-xs text-gray-500">Includes Express & Same-Day options</p>
          </div>
          <div class="bg-blush-pink/30 rounded-lg p-4 mb-6">
            <p class="text-sm font-semibold text-gray-700 mb-2">All shipping is FREE</p>
            <p class="text-xs text-gray-600">Order now to lock in free delivery</p>
          </div>
          <div class="space-y-3">
            <button id="free-delivery-shop" class="w-full bg-deep-red text-white py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition shadow-lg">
              Shop Now & Save
            </button>
            <button id="free-delivery-remind" class="w-full text-gray-600 text-sm hover:text-deep-red transition">
              Remind me later
            </button>
          </div>
          <p class="text-xs text-gray-400 mt-4">Offer valid through February 14, 2026</p>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    return modal;
  }

  function init() {
    const today = new Date().toDateString();
    const lastSeen = localStorage.getItem('hp_free_delivery_last_seen');

    let modal = document.getElementById('free-delivery-popup');
    if (!modal) {
      modal = buildModal();
    }

    const closeBtn = modal.querySelector('#free-delivery-close');
    const shopBtn = modal.querySelector('#free-delivery-shop');
    const remindBtn = modal.querySelector('#free-delivery-remind');

    function closeModal() {
      modal.classList.add('hidden');
      localStorage.setItem('hp_free_delivery_last_seen', today);
    }

    if (lastSeen !== today) {
      setTimeout(() => {
        modal.classList.remove('hidden');
      }, 1500);
    }

    closeBtn?.addEventListener('click', closeModal);

    shopBtn?.addEventListener('click', function () {
      closeModal();
      if (window.location.pathname.includes('shop.html')) {
        document.querySelector('#product-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.location.href = 'shop.html';
      }
      if (typeof showSuccess === 'function') {
        showSuccess('Great choice! Browse our collection below');
      }
    });

    remindBtn?.addEventListener('click', function () {
      closeModal();
      if (typeof showInfo === 'function') {
        showInfo('We\'ll remind you next time!');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
