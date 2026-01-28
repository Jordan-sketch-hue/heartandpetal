# How to Upload Favicon and Enable HTTPS

## OPTION 1: Upload Favicon via GitHub (RECOMMENDED)

### Step 1: Go to GitHub Repository
1. Visit: https://github.com/Jordan-sketch-hue/heartandpetal
2. Click on `assets` folder
3. Click on `images` folder
4. Click "Add file" → "Upload files"
5. Drag and drop your `give_a_rosebud_favicon_in_red_please_xqnp4v.png` file
6. Rename it to `favicon.png` before uploading
7. Click "Commit changes"
8. Wait 1-2 minutes for GitHub Pages to sync

### Step 2: Verify
- Visit https://heartandpetal.cloud
- Check if favicon appears in browser tab
- Clear browser cache if needed (Ctrl+Shift+R)

---

## OPTION 2: Use Cloudflare-Hosted Favicon

If you have the favicon already uploaded to Cloudflare Images:

### Step 1: Get Your Cloudflare Image URL
1. Log into Cloudflare Dashboard
2. Go to Images section
3. Find your `give_a_rosebud_favicon_in_red_please_xqnp4v` image
4. Copy the full public URL (should look like):
   - `https://imagedelivery.net/[YOUR-ACCOUNT-ID]/[IMAGE-ID]/public`
   - OR `https://your-custom-domain.com/cdn-cgi/imagedelivery/[hash]`

### Step 2: Update Code
I can update all HTML files to use this Cloudflare URL instead. Just provide me the full URL.

---

## ENABLE HTTPS (SECURE CONNECTION) 🔒

Your site **heartandpetal.cloud** needs HTTPS configured. Here's how:

### Method 1: Through GitHub Repository Settings

1. Go to: https://github.com/Jordan-sketch-hue/heartandpetal/settings/pages
2. Under "Custom domain", you should see: `heartandpetal.cloud`
3. **CHECK THE BOX** that says "Enforce HTTPS"
4. Wait 5-10 minutes for SSL certificate to provision
5. Your site will be accessible at: `https://heartandpetal.cloud`

### Method 2: Through Cloudflare Dashboard

1. Log into Cloudflare: https://dash.cloudflare.com
2. Select your domain: **heartandpetal.cloud**
3. Go to **SSL/TLS** section in left sidebar
4. Set SSL mode to: **Full** or **Full (strict)**
5. Go to **SSL/TLS → Edge Certificates**
6. Enable these settings:
   - ✅ Always Use HTTPS
   - ✅ Automatic HTTPS Rewrites
   - ✅ Minimum TLS Version: 1.2
7. Go to **Page Rules** (optional but recommended)
8. Create a rule:
   - URL: `http://heartandpetal.cloud/*`
   - Setting: Always Use HTTPS

### Verify HTTPS is Working

1. Visit: https://heartandpetal.cloud (note the `https://`)
2. Look for **padlock icon 🔒** in browser address bar
3. Click the padlock to view certificate details
4. Should show: "Connection is secure"

### Check SSL Status Online

Test your SSL configuration:
- Visit: https://www.ssllabs.com/ssltest/analyze.html?d=heartandpetal.cloud
- Should get an A or A+ rating

---

## DNS SETTINGS (Double Check)

Your Cloudflare DNS should have these records:

### For GitHub Pages:
```
Type: CNAME
Name: @ (or heartandpetal.cloud)
Content: jordan-sketch-hue.github.io
Proxy: Enabled (orange cloud)
```

OR

```
Type: A
Name: @
Content: 185.199.108.153
Proxy: Enabled

Type: A
Name: @
Content: 185.199.109.153
Proxy: Enabled

Type: A
Name: @
Content: 185.199.110.153
Proxy: Enabled

Type: A
Name: @
Content: 185.199.111.153
Proxy: Enabled
```

---

## QUICK CHECKLIST

- [ ] Favicon uploaded to GitHub (Option 1) OR using Cloudflare URL (Option 2)
- [ ] "Enforce HTTPS" enabled in GitHub Pages settings
- [ ] Cloudflare SSL set to "Full" or "Full (strict)"
- [ ] "Always Use HTTPS" enabled in Cloudflare
- [ ] Verified site loads with https:// and shows padlock 🔒
- [ ] Tested site after clearing browser cache

---

## CURRENT STATUS

✅ Custom domain configured: heartandpetal.cloud
✅ CNAME file exists in repository
✅ All HTML files ready for favicon
⏳ Favicon image needs upload (placeholder currently exists)
⏳ HTTPS needs to be enabled
⏳ SSL certificate needs provisioning (automatic after HTTPS enabled)

---

## NEED HELP?

If you want me to:
1. Update all HTML files to use a Cloudflare URL → Provide the full image URL
2. Check if something isn't working → Share any error messages
3. Create additional configuration → Just ask!
