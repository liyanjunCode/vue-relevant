
const path = require('path')
const WebpackHtmlPlugin = require('webpack-html-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    mode: 'development',
    entry:  path.resolve(__dirname, '../src/index.js'),
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 8080
    },
    output:{
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, '../dist')
    },
    devtool: 'source-map',
    resolve:{
        modules: [path.resolve(__dirname, '../source'), path.resolve(__dirname, '../node_modules')]
    },
    plugins: [
        // new WebpackHtmlPlugin({
        //     template: path.resolve(__dirname, '../public/index.html')
        // }),
        new CleanWebpackPlugin(),
    ]
}