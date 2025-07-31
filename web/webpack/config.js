/**@format */

const path = require("path");

module.exports.extensions = [".ts", ".js", ".css", ".view.json", ".i18n.js", ".tsx", "png", "svg"];

module.exports.static = [
    {
        directory: path.resolve(__dirname, "..", "public"),
        publicPath: "/public",
    },
    {
        directory: path.resolve(__dirname, "..", "static"),
        publicPath: "/static",
    },
    {
        directory: path.resolve(__dirname, "..", "resources"),
        publicPath: "/resources",
    },
];

module.exports.resolve = {
    fallback: {},
};
