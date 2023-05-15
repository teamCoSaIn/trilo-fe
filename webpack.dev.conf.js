const dotenv = require('dotenv');
const { merge } = require('webpack-merge');

const common = require('./webpack.base.conf.js');

dotenv.config();

const port = process.env.PORT || 3000;

module.exports = merge(common, {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    historyApiFallback: true,
    host: 'localhost',
    port: port,
    open: true,
  },
});
