const config = {
  development: {
    mongoURI: process.env.MONGODB_URI || '',
    port: process.env.PORT || 3001,
  },
  test: {
    mongoURI: process.env.MONGODB_URI || '',
    port: process.env.PORT || 3001,
  },
  production: {
    mongoURI: process.env.MONGODB_URI || '',
    port: process.env.PORT || 3001,
  },
};

export default config;
