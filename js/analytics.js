// Heart & Petal - Analytics System
// Tracks website visits, locations, and live users (Admin only)

const ANALYTICS_KEY = 'hp_analytics_data';
const SESSION_KEY = 'hp_analytics_session';
const ADMIN_IP_EXCLUDE = ''; // Will be set dynamically

class AnalyticsSystem {
  constructor() {
    this.data = this.loadData();
    this.sessionId = this.getOrCreateSession();
    this.currentIP = null;
    this.adminIP = null;
  }

  loadData() {
    const stored = localStorage.getItem(ANALYTICS_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        // Convert uniqueVisitors array back to Set
        if (Array.isArray(data.uniqueVisitors)) {
          data.uniqueVisitors = new Set(data.uniqueVisitors);
        } else if (!data.uniqueVisitors) {
          data.uniqueVisitors = new Set();
        }
        // Ensure all required fields exist
        data.productViews = data.productViews || {};
        data.cartActivity = data.cartActivity || [];
        return data;
      } catch (e) {
        console.error('Failed to parse analytics data:', e);
      }
    }
    return {
      visits: [],
      uniqueVisitors: new Set(),
      pageViews: {},
      locations: {},
      productViews: {},
      cartActivity: [],
      totalVisits: 0,
      lastUpdated: Date.now()
    };
  }

  saveData() {
    try {
      const dataToSave = {
        ...this.data,
        uniqueVisitors: Array.from(this.data.uniqueVisitors)
      };
      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.error('Failed to save analytics data:', e);
    }
  }

  getOrCreateSession() {
    let session = sessionStorage.getItem(SESSION_KEY);
    if (!session) {
      session = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem(SESSION_KEY, session);
    }
    return session;
  }

  async getVisitorInfo() {
    try {
      // Use ipapi.co for IP and location data (free tier: 1000 requests/day)
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      this.currentIP = data.ip;
      
      // Check if this is admin's first visit to set their IP
      if (!this.adminIP && window.location.pathname.includes('admin.html')) {
        this.adminIP = data.ip;
        localStorage.setItem('hp_admin_ip', data.ip);
      } else {
        this.adminIP = localStorage.getItem('hp_admin_ip');
      }
      
      return {
        ip: data.ip,
        city: data.city || 'Unknown',
        region: data.region || 'Unknown',
        country: data.country_name || 'Unknown',
        countryCode: data.country_code || 'XX',
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone,
        isp: data.org || 'Unknown'
      };
    } catch (error) {
      console.error('Failed to get visitor info:', error);
      return {
        ip: 'unknown',
        city: 'Unknown',
        region: 'Unknown',
        country: 'Unknown',
        countryCode: 'XX'
      };
    }
  }

  async trackPageView(pageName) {
    const visitorInfo = await this.getVisitorInfo();
    
    // Exclude admin IP from tracking
    if (this.adminIP && visitorInfo.ip === this.adminIP) {
      console.log('Admin IP detected - not tracking this visit');
      return;
    }

    const visit = {
      id: Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      sessionId: this.sessionId,
      page: pageName,
      timestamp: Date.now(),
      date: new Date().toISOString(),
      ...visitorInfo
    };

    // Add to visits array
    this.data.visits.push(visit);

    // Track unique visitors by IP
    if (!this.data.uniqueVisitors) {
      this.data.uniqueVisitors = new Set();
    }
    this.data.uniqueVisitors.add(visitorInfo.ip);

    // Track page views
    if (!this.data.pageViews[pageName]) {
      this.data.pageViews[pageName] = 0;
    }
    this.data.pageViews[pageName]++;

    // Track locations
    const locationKey = `${visitorInfo.city}, ${visitorInfo.country}`;
    if (!this.data.locations[locationKey]) {
      this.data.locations[locationKey] = 0;
    }
    this.data.locations[locationKey]++;

    this.data.totalVisits++;
    this.data.lastUpdated = Date.now();

    // Keep only last 1000 visits to prevent storage issues
    if (this.data.visits.length > 1000) {
      this.data.visits = this.data.visits.slice(-1000);
    }

    this.saveData();
  }

  getLiveUsers() {
    const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
    const recentVisits = this.data.visits.filter(v => v.timestamp > fiveMinutesAgo);
    const uniqueSessions = new Set(recentVisits.map(v => v.sessionId));
    return uniqueSessions.size;
  }

  getStats() {
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);

    const todayVisits = this.data.visits.filter(v => v.timestamp > oneDayAgo);
    const weekVisits = this.data.visits.filter(v => v.timestamp > oneWeekAgo);

    // Get top pages
    const topPages = Object.entries(this.data.pageViews)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    // Get top locations
    const topLocations = Object.entries(this.data.locations)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    // Recent visits (last 20)
    const recentVisits = [...this.data.visits]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 20);

    return {
      totalVisits: this.data.totalVisits,
      uniqueVisitors: this.data.uniqueVisitors ? this.data.uniqueVisitors.size : 0,
      liveUsers: this.getLiveUsers(),
      todayVisits: todayVisits.length,
      weekVisits: weekVisits.length,
      topPages,
      topLocations,
      recentVisits,
      lastUpdated: this.data.lastUpdated
    };
  }

  getVisitorsByCountry() {
    const countries = {};
    this.data.visits.forEach(visit => {
      const country = visit.country || 'Unknown';
      if (!countries[country]) {
        countries[country] = {
          count: 0,
          code: visit.countryCode || 'XX',
          cities: new Set()
        };
      }
      countries[country].count++;
      if (visit.city) {
        countries[country].cities.add(visit.city);
      }
    });

    return Object.entries(countries)
      .map(([country, data]) => ({
        country,
        code: data.code,
        count: data.count,
        cities: Array.from(data.cities)
      }))
      .sort((a, b) => b.count - a.count);
  }

  clearOldData(daysToKeep = 30) {
    const cutoffDate = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
    this.data.visits = this.data.visits.filter(v => v.timestamp > cutoffDate);
    this.data.cartActivity = this.data.cartActivity.filter(v => v.timestamp > cutoffDate);
    this.saveData();
  }

  // Track product views
  trackProductView(productId, productName, price) {
    if (!this.data.productViews) this.data.productViews = {};
    
    if (!this.data.productViews[productId]) {
      this.data.productViews[productId] = {
        id: productId,
        name: productName,
        price: price,
        views: 0,
        lastViewed: Date.now()
      };
    }
    
    this.data.productViews[productId].views++;
    this.data.productViews[productId].lastViewed = Date.now();
    this.saveData();
  }

  // Track cart activity
  trackCartActivity(action, productId, productName, price, quantity = 1) {
    if (!this.data.cartActivity) this.data.cartActivity = [];
    
    const activity = {
      action: action, // 'add', 'remove', 'update'
      productId: productId,
      productName: productName,
      price: price,
      quantity: quantity,
      timestamp: Date.now(),
      sessionId: this.sessionId
    };
    
    this.data.cartActivity.push(activity);
    
    // Keep only last 500 cart activities
    if (this.data.cartActivity.length > 500) {
      this.data.cartActivity = this.data.cartActivity.slice(-500);
    }
    
    this.saveData();
  }

  // Get cart insights
  getCartInsights() {
    if (!this.data.cartActivity) return { activeCartsCount: 0, topCartProducts: [], totalCartValue: 0 };
    
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    const recentActivity = this.data.cartActivity.filter(a => a.timestamp > oneHourAgo);
    
    // Count unique sessions with items in cart
    const activeSessions = new Set();
    const cartProducts = {};
    
    recentActivity.forEach(activity => {
      if (activity.action === 'add') {
        activeSessions.add(activity.sessionId);
        
        if (!cartProducts[activity.productId]) {
          cartProducts[activity.productId] = {
            id: activity.productId,
            name: activity.productName,
            price: activity.price,
            timesAdded: 0,
            totalQuantity: 0,
            totalValue: 0
          };
        }
        
        cartProducts[activity.productId].timesAdded++;
        cartProducts[activity.productId].totalQuantity += activity.quantity;
        cartProducts[activity.productId].totalValue += (activity.price * activity.quantity);
      }
    });
    
    const topCartProducts = Object.values(cartProducts)
      .sort((a, b) => b.timesAdded - a.timesAdded)
      .slice(0, 10);
    
    const totalCartValue = topCartProducts.reduce((sum, p) => sum + p.totalValue, 0);
    
    return {
      activeCartsCount: activeSessions.size,
      topCartProducts,
      totalCartValue,
      recentActivity: recentActivity.slice(-20)
    };
  }

  // Get product insights
  getProductInsights() {
    if (!this.data.productViews) return { topProducts: [], avgPrice: 0 };
    
    const products = Object.values(this.data.productViews)
      .sort((a, b) => b.views - a.views);
    
    const avgPrice = products.length > 0 
      ? products.reduce((sum, p) => sum + p.price, 0) / products.length 
      : 0;
    
    return {
      topProducts: products.slice(0, 10),
      totalProducts: products.length,
      avgPrice: avgPrice
    };
  }

  // Get pricing suggestions
  getPricingSuggestions() {
    const insights = this.getProductInsights();
    const cartInsights = this.getCartInsights();
    const suggestions = [];
    
    // Analyze products with high views but low cart additions
    if (this.data.productViews && this.data.cartActivity) {
      insights.topProducts.forEach(product => {
        const cartAdds = cartInsights.topCartProducts.find(p => p.id === product.id);
        const conversionRate = cartAdds ? (cartAdds.timesAdded / product.views) * 100 : 0;
        
        if (conversionRate < 5 && product.views > 10) {
          suggestions.push({
            productId: product.id,
            productName: product.name,
            currentPrice: product.price,
            suggestion: 'decrease',
            reason: `Low conversion rate (${conversionRate.toFixed(1)}%)`,
            recommendedChange: Math.round(product.price * 0.9 * 100) / 100, // 10% decrease
            views: product.views,
            cartAdds: cartAdds ? cartAdds.timesAdded : 0
          });
        } else if (conversionRate > 20 && product.views > 10) {
          suggestions.push({
            productId: product.id,
            productName: product.name,
            currentPrice: product.price,
            suggestion: 'increase',
            reason: `High conversion rate (${conversionRate.toFixed(1)}%)`,
            recommendedChange: Math.round(product.price * 1.1 * 100) / 100, // 10% increase
            views: product.views,
            cartAdds: cartAdds ? cartAdds.timesAdded : 0
          });
        }
      });
    }
    
    return suggestions;
  }
}

// Initialize analytics
const analytics = new AnalyticsSystem();

// Enhance window.addToCart to track cart activity
if (typeof window.addToCart === 'function') {
  const originalAddToCart = window.addToCart;
  window.addToCart = function(item) {
    const result = originalAddToCart.call(this, item);
    if (result && analytics) {
      analytics.trackCartActivity('add', item.id, item.name, item.price, item.quantity || 1);
      // Dispatch custom event for other systems
      document.dispatchEvent(new CustomEvent('cartUpdated', { detail: { item, action: 'add' } }));
    }
    return result;
  };
}

// Auto-track page view on load (only if not admin page)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const pageName = window.location.pathname.split('/').pop() || 'index.html';
    analytics.trackPageView(pageName);
  });
} else {
  const pageName = window.location.pathname.split('/').pop() || 'index.html';
  analytics.trackPageView(pageName);
}

// Make analytics available globally for admin dashboard
window.heartAndPetalAnalytics = analytics;
