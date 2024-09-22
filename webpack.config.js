const HtmlWebpackPlugin = require('html-webpack-plugin');
const {VueLoaderPlugin} = require('vue-loader');

module.exports = {
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            title: 'Voir App Web'
        }),
        new VueLoaderPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                            plugins: ['@babel/plugin-transform-runtime'],
                        }
                    }
                ],
            },
            {
                test: /\.vue$/,
                use: 'vue-loader',
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            }
            ,{
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                {
                    loader: 'file-loader',
                    options: {
                        outputPath: 'assets/imgs',
                    }
                }
                ]
            }
        ]
    }
}
