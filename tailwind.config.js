/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./shop.html",
    "./product.html",
    "./checkout.html",
    "./js/**/*.js",
    "./css/**/*.css"
  ],
  theme: {
    extend: {
      colors: {
        'deep-red': '#8B0000',        // Deep Red
        'blush-pink': '#F8B7C3',      // Blush Pink
        'champagne-gold': '#F7E7CE',  // Champagne Gold
        'ivory': '#FFFFF0',           // Ivory
        'charcoal': '#333333',        // Charcoal
      },
    },
  },
  plugins: [],
}
