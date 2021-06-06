const { theme } = require('tailwindcss/defaultConfig');

module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundColor: theme => ({
        mainbg: '#0c142c',
        buttonsbg: '#5700C6',
        dorpdown: '#181944',
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
