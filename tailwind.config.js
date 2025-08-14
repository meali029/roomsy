/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",  // for App Router
  ],
  theme: {
    extend: {
      colors: {
        'darkest-green': '#051f20',
        'deep-teal': '#0b2b26',
        'forest-teal': '#163832',
        'rich-green': '#235347',
        'soft-sage': '#8eb69b',
        'mint-cream': '#daf1de',
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'pill': '50px',
        '4xl': '2rem',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '112': '28rem',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(5, 31, 32, 0.15)',
        'soft': '0 2px 15px -3px rgba(5, 31, 32, 0.07), 0 10px 20px -2px rgba(5, 31, 32, 0.04)',
        'teal-glow': '0 0 20px rgba(22, 56, 50, 0.3)',
        'sage-glow': '0 0 20px rgba(142, 182, 155, 0.3)',
        'deep-teal': '0 4px 20px rgba(11, 43, 38, 0.2)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'teal-glow': 'tealGlow 2s ease-in-out infinite alternate',
        'sage-glow': 'sageGlow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        tealGlow: {
          '0%': { boxShadow: '0 0 20px rgba(22, 56, 50, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(22, 56, 50, 0.6)' },
        },
        sageGlow: {
          '0%': { boxShadow: '0 0 20px rgba(142, 182, 155, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(142, 182, 155, 0.6)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))',
      },
    },
  },
  plugins: [],
}
