/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'os-bg': '#f8fafc',
        'os-glass': 'rgba(255, 255, 255, 0.85)',
        'os-border': 'rgba(0, 0, 0, 0.1)',
        'os-text': '#ffffff',
        'os-text-muted': '#d1d5db',
        'os-accent': '#ffffffff',
      },
      boxShadow: {
        'os-window': '0 20px 50px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.1)',
        'os-window-active': '0 25px 60px rgba(0,0,0,0.2), 0 0 0 1px rgba(59,130,246,0.3)',
      },
      backdropBlur: {
        'os': '20px',
      },
      animation: {
        'boot-line': 'boot-line 0.3s ease-out',
      },
      keyframes: {
        'boot-line': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
