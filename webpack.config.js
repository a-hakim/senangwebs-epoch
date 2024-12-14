const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    swe: './src/js/swe.js',
    style: './src/css/swe.css',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: 'SWE',
      type: 'umd',
      export: 'default'
    },
    globalObject: 'this',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'swe.css'
    })
  ]
};