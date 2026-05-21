/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#08080C",
          card: "rgba(18, 18, 26, 0.7)",
          border: "rgba(255, 255, 255, 0.08)",
          primary: "#A78BFA",     // Sleek lavender accent
          secondary: "#3B82F6",   // Deep royal blue
          muted: "rgba(255, 255, 255, 0.6)"
        },
        light: {
          bg: "#F4F6F9",
          card: "rgba(255, 255, 255, 0.75)",
          border: "rgba(0, 0, 0, 0.06)",
          primary: "#6D28D9",
          secondary: "#2563EB",
          muted: "rgba(0, 0, 0, 0.55)"
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'gradient-slow': 'gradient-shift 12s ease infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'shimmer': {
          '0%': { 'background-position': '-200% 0' },
          '100%': { 'background-position': '200% 0' }
        }
      }
    },
  },
  plugins: [],
}
