/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#b469ff',
        secondary: '#cd9cff',
        background: '#040814',
        accent: '#0c193e',
        black: '#000000',
        // For semantic usage
        'primary-navbar': '#b469ff',
        'primary-navbar-hover': '#cd9cff',
        'footer-bg': '#040814',
        'footer-text': '#cd9cff',
        'admin-dashboard-bg': '#040814',
        'admin-dashboard-title': '#b469ff',
        'admin-dashboard-stat-bg': '#0c193e',
        'admin-dashboard-section-bg': '#0c193e',
        'admin-products-bg': '#040814',
        'admin-products-title': '#b469ff',
        'admin-product-card-bg': '#0c193e',
        'admin-orders-bg': '#040814',
        'admin-orders-title': '#b469ff',
        'admin-order-card-bg': '#0c193e',
        'home-bg': '#040814',
        'home-text': '#cd9cff',
      },
    },
  },
  plugins: [],
}