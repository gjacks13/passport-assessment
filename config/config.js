const config = {
  development: {
    MONGO_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/tree-list',
    PORT: process.env.PORT || 3001,
  },
  test: {
    MONGO_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/tree-list',
    PORT: process.env.PORT || 3001,
  },
  production: {
    MONGO_URI: process.env.MONGODB_URI || '',
    PORT: process.env.PORT || 3001,
  },
};

module.exports = config;
