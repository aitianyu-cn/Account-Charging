/**@format */

const path = require("path");
const MineCssExtractPlugin = require("mini-css-extract-plugin");

module.exports.rules = [
    {
        test: /\.ts$/,
        use: [
            {
                loader: "babel-loader",
                options: {
                    presets: [
                        [
                            "@babel/preset-env",
                            {
                                corejs: "3",
                                useBuiltIns: "usage",
                            },
                        ],
                    ],
                },
            },
            "ts-loader",
        ],
        exclude: /node_modules/,
    },
    {
        test: /\.tsx$/,
        use: [
            {
                loader: "babel-loader",
                options: {
                    presets: [
                        [
                            "@babel/preset-env",
                            {
                                corejs: "3",
                                useBuiltIns: "usage",
                            },
                        ],
                    ],
                },
            },
            {
                loader: "ts-loader",
                options: {
                    transpileOnly: true,
                },
            },
        ],
        exclude: /node_modules/,
    },
    {
        test: /\.jsx$/,
        use: [
            {
                loader: "babel-loader",
                options: {
                    presets: [
                        [
                            "@babel/preset-env",
                            {
                                corejs: "3",
                                useBuiltIns: "usage",
                            },
                        ],
                    ],
                },
            },
        ],
    },
    {
        test: /\.properties$/,
        use: [
            {
                loader: "babel-loader",
                options: {
                    presets: [
                        [
                            "@babel/preset-env",
                            {
                                corejs: "3",
                                useBuiltIns: "usage",
                            },
                        ],
                    ],
                },
            },
            path.resolve(__dirname, "loader/i18nLoader.js"),
        ],
    },
    {
        test: /\.css$/i,
        use: [MineCssExtractPlugin.loader, "css-loader"],
    },
    {
        test: /\.(jpe?g)$/,
        use: [
            {
                loader: "file-loader",
                options: {
                    name: "images/[name]-[hash:16].[ext]",
                },
            },
        ],
    },
    {
        test: /\.gif$/,
        use: [
            {
                loader: "url-loader",
                options: {
                    limit: 1024 * 200,
                    name: "images/imms/[name]-[hash:16].gif",
                },
            },
        ],
    },
    {
        test: /\.png$/,
        use: [
            {
                loader: "url-loader",
                options: {
                    limit: 1024 * 200,
                    name: "images/icon/[name]-[hash:16].png",
                },
            },
        ],
    },
    {
        test: /\.svg$/,
        use: [
            {
                loader: "svg-inline-loader",
            },
        ],
    },
];
