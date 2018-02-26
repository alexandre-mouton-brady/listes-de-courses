const { resolve, join } = require('path');
const HTML = require('html-webpack-plugin');
const PWA = require('webpack-pwa-manifest');
const WB = require('workbox-webpack-plugin');
const CLEAN = require('clean-webpack-plugin');
const COPY = require('copy-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';

const plugins = [
  new HTML({
    template: resolve(__dirname, 'src', 'index.html'),
  }),
  new CLEAN(['dist']),
];

if (!isDev) {
  plugins.push(
    new COPY([
      { from: 'public/imgs/*', to: 'imgs/', flatten: true },
      { from: './public/*.webmanifest', to: './', flatten: true },
    ]),
    new WB({
      globDirectory: 'dist',
      globPatterns: ['**/*.{html,js}'],
      swDest: resolve(__dirname, 'dist', 'sw.js'),
      clientsClaim: true,
      skipWaiting: true,
    }),
  );
}

const config = {
  entry: {
    app: resolve(__dirname, 'src', 'index.js'),
  },
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  mode: isDev ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /.jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { modules: false }]],
            plugins: ['inferno', 'transform-class-properties'],
          },
        },
      },
      {
        test: /.styl$/,
        exclude: /(node_modules)/,
        use: ['style-loader', 'css-loader', 'stylus-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: isDev
      ? {
          inferno: resolve(
            __dirname,
            'node_modules',
            'inferno',
            'dist',
            'index.dev.mjs',
          ),
        }
      : {},
  },
  plugins,
};

module.exports = config;
