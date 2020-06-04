
const path = require('path')
module.exports = {
    configureWebpack: {    
        resolve: { 
            extensions: [".ts", ".tsx", ".js", ".json"],
            modules: [path.resolve(__dirname, './source'), path.resolve(__dirname, './node_modules')]
        },    
        module: {        
            rules: [    
                {    
                    test: /\.tsx?$/,    
                    loader: 'ts-loader',    
                    exclude: /node_modules/,    
                    options: {
                        appendTsSuffixTo: [/\.vue$/],    
                    }    
                }        
            ]    
        }    
    }  
}