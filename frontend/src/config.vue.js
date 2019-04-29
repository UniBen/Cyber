module.exports = {
    module: {
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue'
            },
            {
                test: /\.s[a|c]ss$/,
                loader: 'style!css!sass'
            }
        ]
    },
    vue: {
        loaders: {
            scss: 'style!css!sass'
        }
    },
    devServer: {
        proxy: 'http://localhost:3000',
    }

};