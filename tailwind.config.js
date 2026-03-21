/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          light: '#FFB84D',
          DEFAULT: '#FF9933',
          dark: '#E67E22',
        },
        gold: {
          light: '#FFF176',
          DEFAULT: '#FFD700',
          dark: '#DAA520',
        },
        cream: {
          DEFAULT: '#FFF8E7',
          dark: '#F5E6CC',
        },
        celestial: {
          light: '#ADE8F4',
          DEFAULT: '#87CEEB',
          dark: '#48CAE4',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(255, 153, 51, 0.1)',
        'premium': '0 10px 30px -5px rgba(255, 153, 51, 0.15)',
      },
      backgroundImage: {
        'spiritual-gradient': 'linear-gradient(to bottom right, rgba(255, 248, 231, 0.9), rgba(255, 153, 51, 0.05))',
      }
    },
  },
  plugins: [],
}
