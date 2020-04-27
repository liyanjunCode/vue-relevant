
const path = require('path')
const WebpackHtmlPlugin = require('webpack-html-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
console.log( path.resolve(__dirname, '../src/public/index.html'))
module.exports = {
    mode: 'development',
    entry: '../src/index.js',
    output:{
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, '../dist')
    },
    plugins: [
        new CleanWebpackPlugin(),
        new WebpackHtmlPlugin({
            template: path.resolve(__dirname, '../src/public/index.html')
        })
    ]
}