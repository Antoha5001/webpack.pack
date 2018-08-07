//переменная для операции с путями
const path = require('path');
const webpack = require('webpack');
const resultPath = path.resolve(__dirname, 'dist');

//plugins
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); //для чистки
const CleanWebpackPlugin = require("clean-webpack-plugin");
const autoprefixer = require("autoprefixer");
const UrlLoader = require("url-loader");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin"); //для копирования дирикторий
const ImageMinPlugin = require("imagemin-webpack-plugin").default; //для оптимизации

// var isProduction = (process.env.NODE_ENV === "production");

//module settings (module это объект node)
var config = {

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
                        loader: "postcss-loader",
                        options: {
                            plugins: [
                                autoprefixer({
                                    browsers:['ie >= 8', 'last 4 version']
                                })
                            ],
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
            },
            //Загрузка изображений
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: '[path][name].[ext]'
                        }
                    },
                    'img-loader'
                ]
            },
            //Fonts
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                use:[
                    {
                        loader: "file-loader",
                        options: {
                            name: '[path][name].[ext]'
                        },
                    }
                    ]
            },
            {
                test: /\.svg$/,
                loader: 'svg-url-loader',
                options: {
                    // Images larger than 10 KB won’t be inlined
                    limit: 10 * 1024,
                    // Remove quotes around the encoded URL –
                    // they’re rarely useful
                    noquotes: true,
                }
            }
        ]
    },

    plugins: [
        new webpack.ProvidePlugin(
            {
                $: 'jquery',
                jQuery: 'jquery',
                jquery: 'jquery',
                Popper: ['popper.js', 'default'],
            }
        ),
        new MiniCssExtractPlugin({
            filename: "css/style.mini.css",
            chunkFilename: "css/[id].css"
        }),
        new CleanWebpackPlugin(["dist"]),
        new CopyWebpackPlugin(
            [{
            from: './img', to:'img'
            }],
            {
                ignore:[{glob:'svg/*'}]
            }
        ),
    ],
    //devServer config
    devServer: {
        contentBase: "./app",
        // public: "webpack.pack:82/app"
        // publicPath: "../"
    },
    // devtool: (isProduction) ? "" : "inline-source-map",

};

module.exports = (env, argv) => {

    console.log(argv.mode);
    if (argv.mode === 'development') {
        config.devtool = 'source-map';
    }

    if (argv.mode === 'production') {
        console.log(argv.mode);
        config.devtool = 'inline-source-map';

        config.plugins.push(
            new UglifyJsPlugin({
                sourceMap: true
            }),
        );

        config.plugins.push(
            new webpack.LoaderOptionsPlugin({
                minimize: true
            })
        );

        config.plugins.push(
            new ImageMinPlugin({
                test: /\.(png|jpe?g|gif|svg)$/i
            })
        );
    }
    if(!argv.mode){
        config.mode = 'none';
    }

    return config;
};

