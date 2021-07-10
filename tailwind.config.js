const { theme } = require('tailwindcss/defaultConfig');

module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      borderWidth: {
        DEFAULT: '1px',
        '0': '0',
        '2': '2px',
        '3': '3px',
        '4': '4px',
        '6': '6px',
        '8': '8px',
      },
      backgroundColor: theme => ({
        mainbg: '#0c142c',
        buttonsbg: '#5700C6',
        dorpdown: '#181944',
        servercard: '#142045',
        popupcard: '#152761',
        listingcard: '#181944',
        footer: '#050514',
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
    extend: {},
  },
  plugins: [],
};
