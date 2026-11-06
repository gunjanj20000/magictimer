/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        garden: {
          sky: '#E0F2FE',
          skyDark: '#BAE6FD',
          sun: '#FDE047',
          grass: '#86EFAC',
          grassDark: '#4ADE80',
          flowerPink: '#F472B6',
          flowerPurple: '#C084FC',
          flowerYellow: '#FBBF24',
          flowerBlue: '#60A5FA',
          flowerOrange: '#FB923C',
          rainbowRed: '#F87171',
          rainbowOrange: '#FB923C',
          rainbowYellow: '#FACC15',
          rainbowGreen: '#4ADE80',
          rainbowBlue: '#38BDF8',
          rainbowIndigo: '#818CF8',
          rainbowViolet: '#C084FC',
        },
        pastel: {
          pink: '#FDF2F8',
          mint: '#F0FDF4',
          yellow: '#FEFCE8',
          blue: '#F0F9FF',
          lavender: '#FAF5FF',
          peach: '#FFF7ED',
        }
      },
      fontFamily: {
        magic: ['"Nunito"', '"Quicksand"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        'bounce-gentle': 'bounce 2.5s infinite ease-in-out',
        'pulse-gentle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'flutter': 'flutter 1.5s ease-in-out infinite',
        'sun-spin': 'spin 30s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        flutter: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-6px) rotate(4deg)' },
        }
      }
    },
  },
  plugins: [],
}
