const path = require('path');
const pkg = require('./package.json');

const libraryName = pkg.name.split('-').map((x, i) => {
  if(i === 0) {
    return x;
  }

  var cap = x[0].toUpperCase();
  return cap + x.slice(1, x.length);
}).join('');

// Define the Webpack config.
const config = {
  performance: {
    hints: false,
  },
  entry: {
    index: [
      './index.js',
    ],
  },
  output: {
    library: [libraryName],
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'index.js',
  },
};

module.exports = config;
