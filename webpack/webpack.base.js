
const path = require('path')
const WebpackHtmlPlugin = require('webpack-html-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    mode: 'development',
    entry:  path.resolve(__dirname, '../src/index.js'),
    output:{
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, '../dist'),
        // library: 'Vue',
        // libraryTarget: "umd",
        // globalObject: 'this',
    },
    devtool: 'source-map',
    resolve:{
        modules: [path.resolve(__dirname, '../source'), path.resolve(__dirname, '../node_modules')]
    },
    plugins: [
        // new WebpackHtmlPlugin({
        //     template: '../public/index.html'
        // }),
        new CleanWebpackPlugin(),
    ]
}