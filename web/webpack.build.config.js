/**@format */

const path = require("path");

const { handleResolve } = require("./webpack/handler");

const { static } = require("./webpack/config");
const { rules } = require("./webpack/modules");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
// const { sourceMapsEnabled } = require("process");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const baseDir = path.resolve(__dirname);

module.exports = {
    entry: {
        index: path.resolve(baseDir, "tianyu/index.tsx"),
        developing: path.resolve(baseDir, "tianyu/index-new.tsx"),
    },
    output: {
        path: path.join(__dirname, "/build"),
        filename: "package/[name].[contenthash:8].js",
        chunkFilename: "package/[name].chunks.[contenthash:6].js",
        environment: {
            arrowFunction: false,
        },
    },
    module: {
        rules: rules,
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: "resources.aitianyu.cn",
            template: path.resolve(baseDir, "tianyu/index.html"),
            filename: "index.html",
            chunks: ["index"],
            favicon: path.resolve(baseDir, "tianyu/index_favicon.ico"),
        }),
        new HtmlWebpackPlugin({
            title: "resources.aitianyu.cn - dev",
            template: path.resolve(baseDir, "tianyu/index.html"),
            filename: "dev/index.html",
            chunks: ["developing"],
            favicon: path.resolve(baseDir, "tianyu/index_favicon.ico"),
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "./static"),
                    to: path.resolve(__dirname, "./build/static"),
                },
                {
                    from: path.resolve(__dirname, "./public"),
                    to: path.resolve(__dirname, "./build/public"),
                },
                {
                    from: path.resolve(__dirname, "./resources"),
                    to: path.resolve(__dirname, "./build/resources"),
                },
            ],
        }),
        new MiniCssExtractPlugin({
            filename: "package/[name].chunks.css",
            chunkFilename: "package/[name].chunks.css",
        }),
    ],
    resolve: handleResolve(baseDir),
    mode: "production",
    devtool: false,
    devServer: {
        port: 80,
        host: "0.0.0.0",
        allowedHosts: "all",
        static: static,
        proxy: {
            "/remote-resources": {
                target: "http://resource.aitianyu.cn/resources",
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    "^/remote-resources": "",
                },
            },
        },
    },
    performance: {
        hints: "warning",
        maxEntrypointSize: 50000000,
        maxAssetSize: 30000000,
        assetFilter: function (assetFilename) {
            return assetFilename.endsWith(".js");
        },
    },
};
