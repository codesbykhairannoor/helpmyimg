/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: 'hsl(var(--color-bg-900) / <alpha-value>)',
          800: 'hsl(var(--color-bg-800) / <alpha-value>)',
          700: 'hsl(var(--color-bg-700) / <alpha-value>)',
          600: 'hsl(var(--color-bg-600) / <alpha-value>)',
          500: 'hsl(var(--color-bg-500) / <alpha-value>)',
        },
        neon: {
          cyan: 'hsl(190, 95%, 50%)',
          indigo: 'hsl(250, 90%, 65%)',
          violet: 'hsl(280, 85%, 60%)',
          pink: 'hsl(330, 85%, 60%)',
          emerald: 'hsl(150, 80%, 48%)',
        },
        official: {
          red: '#DB1514', // Merah CPNS/CASN
          blue: '#00529C', // Biru KTP/Ijazah
        }
      },
      fontFamily: {
        heading: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', '"Inter"', '"Helvetica Neue"', 'sans-serif'],
        body: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', '"SF Pro Display"', '"Inter"', '"Helvetica Neue"', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glow-cyan': '0 0 25px hsla(190, 95%, 50%, 0.35)',
        'glow-indigo': '0 0 30px hsla(250, 90%, 65%, 0.4)',
        'glow-violet': '0 0 30px hsla(280, 85%, 60%, 0.4)',
        'glow-red': '0 0 25px hsla(0, 100%, 50%, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px hsla(190, 95%, 50%, 0.3)' },
          '100%': { boxShadow: '0 0 35px hsla(190, 95%, 50%, 0.7)' },
        }
      }
    },
  },
  plugins: [],
}
