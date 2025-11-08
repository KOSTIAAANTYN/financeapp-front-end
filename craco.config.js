const path = require('path');
module.exports = {
  webpack: {
    alias: {
      '@slices': path.resolve(__dirname, './src/store/slices'),
      '@imgs': path.resolve(__dirname, './src/assets/imgs')
    }
  }
};