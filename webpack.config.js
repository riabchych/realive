const path = require('path');

const EXTENSION = process.env.NODE_ENV === 'production' ? '.min.js' : '.js';

module.exports = {
    entry: [
        path.resolve(__dirname, 'src/public/js/lib.js'),
        path.resolve(__dirname, 'src/public/js/profile.js'),
        path.resolve(__dirname, 'src/sass/main.sass'),
        path.resolve(__dirname, 'src/sass/reset.sass')
    ],
    output: {
        path: path.resolve(__dirname, 'src/public/assets'),
        filename: `bundle${EXTENSION}`,
    },

    // watch: true,
    devtool: 'source-map',

    module: {
        rules: [
            {
                test: /\.sass/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader", options: {
                        sourceMap: true,
                        minimize: true
                    }
                }, {
                    loader: "sass-loader", options: {
                        sourceMap: true
                    }
                }]
            }]
    },

    resolve: {
        extensions: ['.js', '.json', '.jsx', '.sass'],
    }
};