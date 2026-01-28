// Heart & Petal Secure Authentication
// Session management, password hashing, and login security

const CUSTOMER_KEY = 'hp_customers';
const SESSION_KEY = 'hp_session';
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

// Simple password hashing (for demo - use bcrypt in production)
function hashPassword(password) {
  try {
    let hash = 0;
    if (password.length === 0) return hash;
    
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Convert to hex string
    return Math.abs(hash).toString(16);
  } catch (e) {
    console.error('❌ Error hashing password:', e);
    return null;
  }
}

function validatePassword(password) {
  if (!password || typeof password !== 'string') return false;
  if (password.length < 6) {
    console.warn('⚠️ Password must be at least 6 characters');
    return false;
  }
  if (password.length > 50) {
    console.warn('⚠️ Password too long');
    return false;
  }
  return true;
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateName(name) {
  if (!name || typeof name !== 'string') return false;
  if (name.length < 2) return false;
  if (name.length > 50) return false;
  return true;
}

function validatePhoneNumber(phone) {
  // Remove non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10;
}

function validateAddress(address) {
  if (!address || typeof address !== 'string') return false;
  if (address.length < 5) return false;
  if (address.length > 200) return false;
  return true;
}

function getCustomers() {
  try {
    const customers = JSON.parse(localStorage.getItem(CUSTOMER_KEY) || '[]');
    return Array.isArray(customers) ? customers : [];
  } catch (e) {
    console.error('❌ Failed to parse customers:', e);
    return [];
  }
}

function saveCustomers(customers) {
  try {
    localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customers));
    return true;
  } catch (e) {
    console.error('❌ Failed to save customers:', e);
    return false;
  }
}

function createSession(email, userId) {
  try {
    const session = {
      userId: userId,
      email: email,
      token: Math.random().toString(36).substring(2) + Date.now(),
      createdAt: Date.now(),
      expiresAt: Date.now() + SESSION_TIMEOUT
    };
    
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    console.log(`✅ Session created for ${email}`);
    return session;
  } catch (e) {
    console.error('❌ Failed to create session:', e);
    return null;
  }
}

function getSession() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    
    if (!session) return null;
    
    // Check if session expired
    if (Date.now() > session.expiresAt) {
      console.log('⚠️ Session expired');
      destroySession();
      return null;
    }
    
    return session;
  } catch (e) {
    console.error('❌ Failed to parse session:', e);
    return null;
  }
}

function destroySession() {
  try {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('hp_last_login');
    console.log('✅ Session destroyed');
    return true;
  } catch (e) {
    console.error('❌ Failed to destroy session:', e);
    return false;
  }
}

function isLoggedIn() {
  return getSession() !== null;
}

function getCurrentUser() {
  const session = getSession();
  if (!session) return null;
  
  try {
    const customers = getCustomers();
    const user = customers.find(c => c.email === session.email);
    return user ? { name: user.name, email: user.email, address: user.address } : null;
  } catch (e) {
    console.error('❌ Failed to get current user:', e);
    return null;
  }
}

function registerUser(name, email, password, address) {
  try {
    // Validate all inputs
    if (!validateName(name)) {
      return { success: false, error: 'Invalid name' };
    }
    
    if (!validateEmail(email)) {
      return { success: false, error: 'Invalid email address' };
    }
    
    if (!validatePassword(password)) {
      return { success: false, error: 'Password must be 6-50 characters' };
    }
    
    if (!validateAddress(address)) {
      return { success: false, error: 'Invalid address (5-200 characters)' };
    }
    
    const customers = getCustomers();
    const lowerEmail = email.toLowerCase().trim();
    
    // Check if email already exists
    if (customers.find(c => c.email === lowerEmail)) {
      return { success: false, error: 'Email already registered' };
    }
    
    // Hash password before storing
    const passwordHash = hashPassword(password);
    if (!passwordHash) {
      return { success: false, error: 'Error hashing password' };
    }
    
    const newUser = {
      id: Math.random().toString(36).substring(2),
      name: name.trim(),
      email: lowerEmail,
      passwordHash: passwordHash,
      address: address.trim(),
      createdAt: Date.now()
    };
    
    customers.push(newUser);
    
    if (saveCustomers(customers)) {
      console.log(`✅ User registered: ${email}`);
      return { success: true, user: newUser };
    }
    
    return { success: false, error: 'Failed to save customer' };
  } catch (e) {
    console.error('❌ Registration error:', e);
    return { success: false, error: 'Registration failed' };
  }
}

function loginUser(email, password) {
  try {
    if (!validateEmail(email)) {
      return { success: false, error: 'Invalid email address' };
    }
    
    if (!password) {
      return { success: false, error: 'Password required' };
    }
    
    const customers = getCustomers();
    const lowerEmail = email.toLowerCase().trim();
    const passwordHash = hashPassword(password);
    
    if (!passwordHash) {
      return { success: false, error: 'Error processing password' };
    }
    
    const user = customers.find(c => c.email === lowerEmail && c.passwordHash === passwordHash);
    
    if (!user) {
      console.warn('⚠️ Login failed: invalid credentials');
      return { success: false, error: 'Invalid email or password' };
    }
    
    // Create session
    const session = createSession(user.email, user.id);
    if (!session) {
      return { success: false, error: 'Failed to create session' };
    }
    
    // Legacy support for profile.js
    localStorage.setItem('hp_last_login', user.email);
    
    console.log(`✅ User logged in: ${email}`);
    return { success: true, user: { name: user.name, email: user.email, address: user.address } };
  } catch (e) {
    console.error('❌ Login error:', e);
    return { success: false, error: 'Login failed' };
  }
}

function logoutUser() {
  return destroySession();
}

function updateUserProfile(name, address) {
  try {
    const session = getSession();
    if (!session) {
      return { success: false, error: 'Not logged in' };
    }
    
    if (!validateName(name) || !validateAddress(address)) {
      return { success: false, error: 'Invalid input' };
    }
    
    const customers = getCustomers();
    const userIndex = customers.findIndex(c => c.email === session.email);
    
    if (userIndex === -1) {
      return { success: false, error: 'User not found' };
    }
    
    customers[userIndex].name = name.trim();
    customers[userIndex].address = address.trim();
    
    if (saveCustomers(customers)) {
      console.log('✅ Profile updated');
      return { success: true };
    }
    
    return { success: false, error: 'Failed to update profile' };
  } catch (e) {
    console.error('❌ Profile update error:', e);
    return { success: false, error: 'Update failed' };
  }
}

// Export globally
window.validateEmail = validateEmail;
window.validatePassword = validatePassword;
window.validateName = validateName;
window.validatePhoneNumber = validatePhoneNumber;
window.validateAddress = validateAddress;
window.registerUser = registerUser;
window.loginUser = loginUser;
window.logoutUser = logoutUser;
window.updateUserProfile = updateUserProfile;
window.isLoggedIn = isLoggedIn;
window.getCurrentUser = getCurrentUser;
window.getSession = getSession;
