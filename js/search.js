// Heart & Petal Search System

function initializeSearch() {
  const searchInput = document.getElementById('product-search-input');
  const searchBtn = document.getElementById('product-search-btn');
  const clearBtn = document.getElementById('search-clear-btn');
  
  if (!searchInput) return;
  
  // Search on button click
  if (searchBtn) {
    searchBtn.onclick = performSearch;
  }
  
  // Search on Enter key
  if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        performSearch();
      }
    });
    
    // Live search on typing (debounced)
    let searchTimeout;
    searchInput.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(performSearch, 300);
    });
  }
  
  // Clear search
  if (clearBtn) {
    clearBtn.onclick = function() {
      searchInput.value = '';
      performSearch();
    };
  }
}

function performSearch() {
  const searchInput = document.getElementById('product-search-input');
  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
  
  const productCards = document.querySelectorAll('.product-card');
  let visibleCount = 0;
  
  productCards.forEach(card => {
    const name = card.dataset.name ? card.dataset.name.toLowerCase() : '';
    const category = card.dataset.category ? card.dataset.category.toLowerCase() : '';
    const desc = card.dataset.desc ? card.dataset.desc.toLowerCase() : '';
    const price = card.dataset.price ? card.dataset.price : '';
    
    const matches = !query || 
                   name.includes(query) || 
                   category.includes(query) || 
                   desc.includes(query) ||
                   price.includes(query);
    
    if (matches) {
      card.style.display = '';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });
  
  // Show/hide no results message
  updateSearchResults(visibleCount, query);

  // Fire Google Shopping App Search conversion event
  if (typeof gtag === 'function') {
    gtag('event', 'conversion', {
      'send_to': 'AW-11161550773/fdyvCNfA584YELX_nsop'
    });
  }
}

function updateSearchResults(count, query) {
  let resultsMsg = document.getElementById('search-results-message');
  
  if (!resultsMsg) {
    resultsMsg = document.createElement('div');
    resultsMsg.id = 'search-results-message';
    resultsMsg.className = 'text-center py-8 col-span-full';
    const grid = document.querySelector('.product-grid, .grid');
    if (grid) grid.appendChild(resultsMsg);
  }
  
  if (count === 0 && query) {
    resultsMsg.innerHTML = `
      <div class="text-center">
        <p class="text-xl text-gray-600 mb-2">No products found for "${query}"</p>
        <p class="text-gray-500">Try different keywords or browse all products</p>
      </div>
    `;
    resultsMsg.style.display = 'block';
  } else if (query) {
    resultsMsg.innerHTML = `<p class="text-gray-600">Found ${count} product${count !== 1 ? 's' : ''} matching "${query}"</p>`;
    resultsMsg.style.display = 'block';
  } else {
    resultsMsg.style.display = 'none';
  }
}

// Filter by category
function filterByCategory(category) {
  const productCards = document.querySelectorAll('.product-card');
  let visibleCount = 0;
  
  productCards.forEach(card => {
    const cardCategory = card.dataset.category ? card.dataset.category.toLowerCase() : '';
    
    if (!category || category === 'all' || cardCategory === category.toLowerCase()) {
      card.style.display = '';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });
  
  // Clear search input
  const searchInput = document.getElementById('product-search-input');
  if (searchInput) searchInput.value = '';
  
  // Update active filter button
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active', 'bg-deep-red', 'text-white');
    btn.classList.add('bg-white', 'text-charcoal');
  });
  
  const activeBtn = document.querySelector(`[data-filter="${category}"]`);
  if (activeBtn) {
    activeBtn.classList.add('active', 'bg-deep-red', 'text-white');
    activeBtn.classList.remove('bg-white', 'text-charcoal');
  }
  
  updateSearchResults(visibleCount, category === 'all' ? '' : category);
}

// Sort products
function sortProducts(sortBy) {
  const grid = document.querySelector('.product-grid, .grid');
  if (!grid) return;
  
  const cards = Array.from(document.querySelectorAll('.product-card'));
  
  cards.sort((a, b) => {
    switch(sortBy) {
      case 'price-low':
        return parseFloat(a.dataset.price || 0) - parseFloat(b.dataset.price || 0);
      case 'price-high':
        return parseFloat(b.dataset.price || 0) - parseFloat(a.dataset.price || 0);
      case 'name':
        return (a.dataset.name || '').localeCompare(b.dataset.name || '');
      case 'newest':
        return (b.dataset.id || '').localeCompare(a.dataset.id || '');
      default:
        return 0;
    }
  });
  
  cards.forEach(card => grid.appendChild(card));
}

// Export globally
window.initializeSearch = initializeSearch;
window.performSearch = performSearch;
window.filterByCategory = filterByCategory;
window.sortProducts = sortProducts;

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeSearch);
} else {
  initializeSearch();
}
