/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1e3a5f',
          dark: '#152a45',
          light: '#2a4d75',
        },
        secondary: {
          DEFAULT: '#6b8e23',
          dark: '#556b1c',
          light: '#7fa32a',
        },
        status: {
          submitted: '#3b82f6',
          'under-review': '#f59e0b',
          verified: '#10b981',
          approved: '#10b981',
          rejected: '#ef4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro', 'Segoe UI', 'system-ui', 'sans-serif'],
        arabic: ['Noto Sans Arabic', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

