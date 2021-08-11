module.exports = {
  env: {
    BASE_URL: process.env.NODE_ENV === 'production' ? "https://beta.dmod.gg/api/v1" : 'http://localhost:3000/api/v1',
  },
};
