module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-url': {},
    'postcss-preset-env': {
      features: {
        customProperties: true
      }
    },
    'postcss-nested': {}
  }
};
