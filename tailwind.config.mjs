/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'astro-blue': '#3245ff',
        'astro-purple': '#bc52ee',
        'primary-blue': '#0099ff',
        'facebook': '#1877F2',
      },
      backgroundImage: {
        'gradient-astro': 'linear-gradient(83.21deg, var(--tw-gradient-from) 0%, var(--tw-gradient-to) 100%)',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'pulse-soft': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 }
        }
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        float: 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite'
      },
      boxShadow: {
        'inner-glow': 'inset 0 0 60px rgba(50, 69, 255, 0.1)',
        'glow': '0 0 60px rgba(50, 69, 255, 0.1)'
      },
      fontFamily: {
        sans: ['Inter Variable', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}