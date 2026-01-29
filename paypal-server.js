require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const app = express();
app.use(express.json());

// Enable CORS for your live site
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

const PAYPAL_CLIENT_ID = process.env.PAYPAL_SANDBOX_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_SANDBOX_CLIENT_SECRET;
const PAYPAL_API_BASE = 'https://api-m.paypal.com';

// Get client token for JS SDK
app.get('/paypal-api/client-token', async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    const response = await fetch(`${PAYPAL_API_BASE}/v1/identity/generate-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    if (!data.client_token) throw new Error('No client_token');
    res.json({ clientToken: data.client_token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create order
app.post('/paypal-api/checkout/orders/create', async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    const cart = req.body.cart || [];
    // Calculate total from cart
    let total = 0;
    for (const item of cart) {
      total += (item.price * item.quantity);
    }
    if (total < 0.01) total = 0.01;
    const orderPayload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: total.toFixed(2),
          },
          items: cart.map(item => ({
            name: item.name,
            unit_amount: { currency_code: 'USD', value: item.price.toFixed(2) },
            quantity: String(item.quantity),
            category: 'PHYSICAL_GOODS',
          })),
        },
      ],
    };
    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(orderPayload),
    });
    const data = await response.json();
    if (!data.id) throw new Error('Order creation failed');
    res.json({ id: data.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Capture order
app.post('/paypal-api/checkout/orders/:orderId/capture', async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    const { orderId } = req.params;
    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: '{}',
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helper: Get PayPal access token
async function getAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  const data = await response.json();
  if (!data.access_token) throw new Error('Failed to get access token');
  return data.access_token;
}

// Serve static files (for local dev)
app.use(express.static('.'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
