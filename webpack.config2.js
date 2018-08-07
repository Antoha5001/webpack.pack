//переменная для операции с путями
const path = require('path');
const webpack = require('webpack');
const resultPath = path.resolve(__dirname, 'dist');
//plugins
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

//module settings (module это объект node)
module.exports = {
    mode: "none",
    //базовый путь к проекту
    context: path.resolve(__dirname, 'src'),

    //точка входа js
    entry:{
        //основной файл приложения
        app: [
            './js/app.js',
            './scss/style.scss'
        ],
    },

    //путь для собранных файлов
    output:{
        //в скобки подставится имя основного файла (app)
        filename: "js/script.min.js",
        path: path.resolve(__dirname, 'dist'),
        //обновление пути для собранных файлов, точка отсчёта
        publicPath: "../"
    },

    module: {
        //Правила
        rules: [
            //scss
            {
                test: /\.scss$/, //регулярное, все scss
                use: [
                    // fallback to style-loader in development
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            }
        ]
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: "css/style.mini.css",
            chunkFilename: "css/[id].css"
        })
    ],
    //devServer config
    devServer: {
        // contentBase: "./app",
        public: "webpack.pack:82/app"
    },

};