const path = require('path')
const webpack = require('webpack')

const EXTENSION = process.env.NODE_ENV === 'production' ? '.min.js' : '.js'

module.exports = {
  entry: [
    path.resolve(__dirname, 'src/public/js/app.js')
    // path.resolve(__dirname, 'src/sass/main.sass'),
    // path.resolve(__dirname, 'src/sass/reset.sass')
  ],
  output: {
    path: path.resolve(__dirname, 'src/public/assets'),
    filename: `bundle${EXTENSION}`
  },

  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.(pug)$/,
        loader: 'pug-loader',
        options: {
          pretty: true
        }
      },
      {
        test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        loader: 'file-loader'
      },
      {
        test: /\.(scss|css)$/,
        use: [
          {
            loader: 'style-loader' // inject CSS to page
          }, {
            loader: 'css-loader' // translates CSS into CommonJS modules
          }, {
            loader: 'postcss-loader', // Run post css actions
            options: {
              plugins: function () { // post css plugins, can be exported to postcss.config.js
                return [
                  require('precss'),
                  require('autoprefixer')
                ]
              }
            }
          }, {
            loader: 'sass-loader' // compiles SASS to CSS
          }]
      }]
  },

  plugins: [
    new webpack.ProvidePlugin({
      io: 'socket.io-client',
      Backbone: 'backbone',
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Popper: ['popper.js', 'default'],
      Util: 'exports-loader?Util!bootstrap/js/dist/util',
      Dropdown: 'exports-loader?Dropdown!bootstrap/js/dist/dropdown'
    })
  ],

  resolve: {
    extensions: ['.js', '.json', '.sass', '.css', '.pug']
  }
}
