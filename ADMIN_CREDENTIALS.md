# Heart & Petal - Admin Credentials & System Access

## 🔐 Admin CRM Login

**Access URL:** `https://heartandpetal.cloud/admin.html`

### Admin Credentials:
- **Username:** `admin`
- **Password:** `petal2026`

**⚠️ IMPORTANT:** Change these credentials in production! Update in `js/crm.js` lines 3-4.

---

## 📊 CRM Dashboard Features

After logging in with admin credentials, you get access to:

### 1. **Customer Management**
- Register new customers
- View all registered customers
- Sync with customer registrations from the public site
- Customer data stored in localStorage: `hp_crm_customers` and `hp_customers`

### 2. **Order Management**
- Add new orders manually
- View all orders in the system
- Update order status (Processing, Shipped, Delivered, etc.)
- Track customer orders by email
- Order data stored in localStorage: `hp_crm_orders` and `hp_orders`

### 3. **Review Management**
- View pending customer reviews
- Approve reviews to display on the site
- Reject inappropriate reviews
- Review data stored in localStorage: `hp_reviews_pending` and `hp_reviews_approved`

---

## 🔄 Customer Login Flow

### Customer Registration & Login:
**Access URL:** `https://heartandpetal.cloud/customer-login.html`

1. **New Customer Registration:**
   - Customer fills out: Name, Email, Password, Address
   - Account created in localStorage
   - Can immediately log in

2. **Customer Login:**
   - Customer enters: Email & Password
   - Upon successful login → Redirected to **Profile Page**
   - Session stored in localStorage: `hp_last_login`

3. **Profile Page Features:**
   - View personal information
   - View order history
   - Track current orders
   - Access wishlist

---

## 📂 Data Storage Structure

### LocalStorage Keys Used:

| Key | Purpose |
|-----|---------|
| `hp_customers` | Customer accounts (email, password, name, address) |
| `hp_crm_customers` | CRM registered customers |
| `hp_orders` | All orders from checkout |
| `hp_crm_orders` | CRM manually added orders |
| `hp_last_login` | Last logged in customer email |
| `hp_customer_name` | Current logged in customer name |
| `hp_reviews_pending` | Pending reviews awaiting approval |
| `hp_reviews_approved` | Approved reviews shown on site |
| `cart` | Shopping cart items |
| `appliedDiscountCode` | Current discount code |
| `appliedDiscountAmount` | Current discount amount |

---

## 🔒 Security Notes

### Current Implementation:
- ✅ Basic authentication system
- ✅ localStorage-based data storage
- ✅ Session management
- ⚠️ Passwords stored in plain text (client-side only)
- ⚠️ No server-side validation

### Production Recommendations:
1. **Implement server-side authentication:**
   - Use backend API (Node.js, Python, PHP)
   - Implement bcrypt password hashing
   - Use JWT tokens for sessions
   - Add rate limiting

2. **Database Migration:**
   - Move from localStorage to proper database
   - Recommended: MongoDB, PostgreSQL, or MySQL
   - Implement proper data backup

3. **Security Enhancements:**
   - Add HTTPS (already configured in DNS)
   - Implement CSRF protection
   - Add input sanitization
   - Enable 2FA for admin access
   - Add password reset functionality

---

## 🎯 Quick Access Links

- **Customer Login:** [customer-login.html](customer-login.html)
- **Admin CRM:** [admin.html](admin.html)
- **Customer Profile:** [profile.html](profile.html)
- **Checkout:** [checkout.html](checkout.html)

---

## 📞 System Integration

### Workflow:
```
Customer Flow:
1. Browse shop → Add to cart
2. Go to checkout → Enter details
3. PayPal payment → Order created
4. Email confirmation sent (EmailJS)
5. Order saved to localStorage
6. Can track in profile page

Admin Flow:
1. Login to CRM (admin.html)
2. View all orders
3. Update order status
4. Manage customers
5. Approve reviews
```

---

## 🔧 Configuration Files

- **Customer Auth:** `js/customer-auth.js`
- **Admin Auth:** `js/auth.js`
- **CRM Logic:** `js/crm.js`
- **Order Management:** `js/orders.js`
- **Email Service:** EmailJS (configured in checkout.html)

---

## 📝 Notes

- All data is currently stored client-side in browser localStorage
- Data persists until browser cache is cleared
- No data is sent to external servers except PayPal payments and EmailJS
- For production, migrate to server-side database
- Admin credentials should be changed immediately for production use

---

**Last Updated:** January 28, 2026
**Version:** 1.0
