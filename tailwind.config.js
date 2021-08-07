const { theme } = require('tailwindcss/defaultConfig');

module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      boxShadow: {
        lgLight: '0 20px 25px -5px rgba(255, 255, 255, 0.05)',
      },
      borderWidth: {
        DEFAULT: '1px',
        '0': '0',
        '2': '2px',
        '3': '3px',
        '4': '4px',
        '6': '6px',
        '8': '8px',
      },
      backgroundColor: () => ({
        mainbg: '#0c142c',
        buttonsbg: '#5700C6',
        dorpdown: '#181944',
        servercard: '#142045',
        popupcard: '#152761',
        listingcard: '#181944',
        footer: '#0C142C',
      }),
    },
    animation: {
      ...theme.animation,
      floting: 'floting 1.5s ease-in-out infinite',
    },
    keyframes: {
      ...theme.keyframes,
      floting: {
        '0%, 100%': { transform: 'translateY(-2px)' },
        '50%': { transform: 'translateY(0)' },
      },
    },
  },
  variants: {
    extend: {
      display: ['hover', 'focus', 'group-hover'],
      inset: ['hover', 'focus', 'group-hover'],
    },
  },
  plugins: [],
};
