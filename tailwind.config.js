/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
   ],
  theme: {
    extend: {},
    screens: {
      xs: '100px',
      sm: '481px',
      md: '769px',
      lg: '890px',
      xl: '1280px',
    },
  },
  plugins: [
]
}

