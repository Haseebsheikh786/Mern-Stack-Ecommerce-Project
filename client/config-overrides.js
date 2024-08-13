const { alias } = require('react-app-rewire-alias');

module.exports = function override(config) {
  alias({
    '@': './src', // adjust this according to your project structure
  })(config);

  return config;
}
