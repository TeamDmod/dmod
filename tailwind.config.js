module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundColor: theme => ({
        mainbg: '#0c142c',
      }),
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
