# EmailJS Template Setup Guide

## Step 1: Log into EmailJS Dashboard
Go to: https://dashboard.emailjs.com/
Login with your account credentials

## Step 2: Navigate to Email Templates
1. Click on "Email Templates" in the left sidebar
2. Click the "Create New Template" button

## Step 3: Template Configuration

### Basic Settings:
- **Template Name:** Heart & Petal Order Confirmation
- **Template ID:** `heartandpetal_order` (or keep the auto-generated one and update js/orders.js)

### Email Subject:
```
Order Confirmation #{{order_id}} - Heart & Petal 🌹
```

### Email Content (HTML):
Copy and paste the ENTIRE content below:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - Heart & Petal</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #b80038 0%, #d32f2f 100%); padding: 30px 40px; text-align: center;">
              <h1 style="color: #ffffff; font-family: 'Playfair Display', serif; font-size: 32px; margin: 0; font-weight: 700;">Heart & Petal</h1>
              <p style="color: #ffffff; font-size: 14px; margin: 10px 0 0 0; opacity: 0.95;">Premium Flowers, Chocolates & Gifts</p>
            </td>
          </tr>
          
          <!-- Greeting -->
          <tr>
            <td style="padding: 30px 40px 20px 40px;">
              <h2 style="color: #b80038; font-size: 24px; margin: 0 0 15px 0;">Thank You, {{to_name}}! 🌹</h2>
              <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0;">We've received your order and we're excited to prepare your beautiful gifts!</p>
            </td>
          </tr>
          
          <!-- Order Info Box -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <table width="100%" cellpadding="15" cellspacing="0" style="background-color: #fff5f8; border-radius: 8px; border: 2px solid #f7cac9;">
                <tr>
                  <td>
                    <p style="margin: 0 0 10px 0; color: #666; font-size: 14px; font-weight: 600;">ORDER CONFIRMATION</p>
                    <p style="margin: 0; color: #b80038; font-size: 20px; font-weight: 700;">Order #{{order_id}}</p>
                    <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">Order Date: {{order_date}}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Delivery Details -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <h3 style="color: #333; font-size: 18px; margin: 0 0 15px 0; border-bottom: 2px solid #f7cac9; padding-bottom: 10px;">📦 Delivery Details</h3>
              <table width="100%" cellpadding="5" cellspacing="0">
                <tr>
                  <td style="color: #666; font-size: 14px; padding: 5px 0;"><strong>Delivery Date:</strong></td>
                  <td style="color: #333; font-size: 14px; text-align: right; padding: 5px 0;">{{delivery_date}}</td>
                </tr>
                <tr>
                  <td colspan="2" style="color: #666; font-size: 14px; padding: 10px 0 5px 0;"><strong>Shipping Address:</strong></td>
                </tr>
                <tr>
                  <td colspan="2" style="color: #333; font-size: 14px; padding: 5px 0;">{{shipping_address}}</td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Order Items -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <h3 style="color: #333; font-size: 18px; margin: 0 0 15px 0; border-bottom: 2px solid #f7cac9; padding-bottom: 10px;">🛍️ Order Summary</h3>
              <div style="color: #333; font-size: 14px; line-height: 1.8;">{{items_list}}</div>
            </td>
          </tr>
          
          <!-- Pricing -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <table width="100%" cellpadding="8" cellspacing="0" style="border-top: 1px solid #e0e0e0;">
                <tr>
                  <td style="color: #b80038; font-size: 18px; font-weight: 700; padding-top: 10px;">Total Paid:</td>
                  <td style="color: #b80038; font-size: 18px; font-weight: 700; text-align: right; padding-top: 10px;">${{total}}</td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- What's Next -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <h3 style="color: #333; font-size: 18px; margin: 0 0 15px 0;">What Happens Next?</h3>
              <ul style="color: #666; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li>Your order is being prepared with care</li>
                <li>You'll receive updates as your order progresses</li>
                <li>We guarantee 7-day freshness on all flowers</li>
                <li>Any questions? Reply to this email or visit our website</li>
              </ul>
            </td>
          </tr>
          
          <!-- CTA Button -->
          <tr>
            <td style="padding: 0 40px 30px 40px; text-align: center;">
              <a href="https://heartandpetal.cloud/tracking.html" style="display: inline-block; background: linear-gradient(135deg, #b80038 0%, #d32f2f 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 50px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(184,0,56,0.3);">Track Your Order</a>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9f9f9; padding: 30px 40px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0 0 10px 0; color: #666; font-size: 14px; font-weight: 600;">Thank You for Choosing Heart & Petal!</p>
              <p style="margin: 0 0 15px 0; color: #999; font-size: 13px;">Spreading love, one petal at a time 🌹</p>
              <p style="margin: 0 0 5px 0; color: #999; font-size: 12px;">
                <a href="https://heartandpetal.cloud" style="color: #b80038; text-decoration: none;">Visit Our Website</a> | 
                <a href="mailto:contact@heartandpetal.com" style="color: #b80038; text-decoration: none;">Contact Us</a>
              </p>
              <p style="margin: 15px 0 0 0; color: #999; font-size: 11px;">&copy; 2026 Heart & Petal. All rights reserved.</p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

## Step 4: Configure Template Variables

Make sure these variables are properly mapped in the template editor:
- `{{to_name}}` - Customer's name
- `{{to_email}}` - Customer's email (auto-filled by EmailJS)
- `{{order_id}}` - Order number
- `{{order_date}}` - Date of order
- `{{delivery_date}}` - Expected delivery date
- `{{shipping_address}}` - Full shipping address
- `{{items_list}}` - HTML formatted list of items
- `{{total}}` - Total price paid

## Step 5: Update Template ID in Code

If EmailJS auto-generates a different template ID, you need to update it in your code:

**File:** `js/orders.js` (around line 95)

Change this line:
```javascript
emailjs.send('service_qw61mye', 'YOUR_TEMPLATE_ID_HERE', emailParams)
```

Replace `YOUR_TEMPLATE_ID_HERE` with the actual template ID from EmailJS.

## Step 6: Test the Template

1. In EmailJS dashboard, click "Test Template"
2. Fill in sample data for all variables
3. Send a test email to yourself
4. Verify formatting and all variables display correctly

## Step 7: Activate Template

1. Save the template
2. Make sure it's set to "Active"
3. Test a real order on your website to confirm emails send properly

## Troubleshooting

**Emails not sending?**
- Check EmailJS monthly quota (free tier: 200 emails/month)
- Verify public key is correct in checkout.html
- Check browser console for errors
- Ensure template ID matches in js/orders.js

**Variables not showing?**
- Make sure variable names match exactly (case-sensitive)
- Use double curly braces: `{{variable_name}}`
- Check that variables are being passed in emailParams object

**Formatting issues?**
- Use the HTML editor, not plain text
- Test on different email clients (Gmail, Outlook, etc.)
- Inline CSS is required for email HTML

## Support

For EmailJS specific issues, visit: https://www.emailjs.com/docs/
For Heart & Petal site issues, contact your developer.
