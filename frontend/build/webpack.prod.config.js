const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.config')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')


// For NamedChunksPlugin
const seen = new Set()
const nameLength = 4

const prodWebpackConfig = merge(baseWebpackConfig, {
    // webpack 4.x add
    mode: 'production',

    output: {
        publicPath: config.build.assetsPublicPath,
        path: config.build.assetsRoot,
        filename: utils.assetsPath('js/[name].[chunkhash:8].js'),
        chunkFilename: utils.assetsPath('js/[name].[chunkhash:8].js')
    },

    module: {
        // add style loader
        rules: utils.styleLoaders({
            sourceMap: false,
            extract: true,
            usePostCSS: true
        })
    },
    plugins: [
        // define plugin
        new webpack.DefinePlugin({
            'process.env': require('../config/prod.env')
        }),

        // extract css into its own file
        new MiniCssExtractPlugin({
            filename: utils.assetsPath('css/[name].[contenthash:8].css'),
            chunkFilename: utils.assetsPath('css/[name].[contenthash:8].css')
        }),

        new HtmlWebpackPlugin({
            //
            filename: config.build.index,
            template: 'src/index.html',
            inject: true,
            templateParameters: {
                BASE_URL: config.build.assetsPublicPath + config.build.assetsSubDirectory,
            },
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
            }
        }),

        new ScriptExtHtmlWebpackPlugin({
            //`runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/
        }),

        // keep chunk.id stable when chunk has no name
        //
        new webpack.NamedChunksPlugin(chunk => {
            if (chunk.name) {
                return chunk.name
            }
            const modules = Array.from(chunk.modulesIterable)
            if (modules.length > 1) {
                const hash = require('hash-sum')
                const joinedHash = hash(modules.map(m => m.id).join('_'))
                let len = nameLength
                while (seen.has(joinedHash.substr(0, len))) len++
                seen.add(joinedHash.substr(0, len))
                return `chunk-${joinedHash.substr(0, len)}`
            } else {
                return modules[0].id
            }
        }),

        // keep module.id stable when vender modules does not change
        new webpack.HashedModuleIdsPlugin(),
    ],

    optimization: {
        // split chunks
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                libs: {
                    name: 'chunk-libs',
                    test: /[\\/]node_modules[\\/]/,
                    priority: 10,
                    chunks: 'initial' // ????????????????????????????????????
                },
                elementUI: {
                    name: 'chunk-elementUI', // ????????? elementUI ??????
                    priority: 20, // ??????????????? libs ??? app ????????????????????? libs ?????? app
                    test: /[\\/]node_modules[\\/]element-ui[\\/]/
                },
                /*commons: {
                    name: 'chunk-commons',
                    test: path.resolve(__dirname, '../src/components'), // ??????????????????????????????
                    minChunks: 3, // ??????????????????
                    priority: 5,
                    reuseExistingChunk: true
                }*/
            }
        },

        runtimeChunk: 'single',

        minimizer: [
            // uglify js plugin
            new UglifyJsPlugin({
                uglifyOptions: {
                    mangle: {
                        safari10: true
                    }
                },
                cache: true,
                parallel: true
            }),

            // Compress extracted CSS. We are using this plugin so that possible
            // duplicated CSS from different components can be deduped.
            new OptimizeCSSAssetsPlugin()
        ]
    }
});

module.exports = prodWebpackConfig;
