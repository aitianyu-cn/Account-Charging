/** @format */

module.exports = {
    "/*": {
        handlers: {
            GET: { package: "$", module: "default-loader", method: "auto" },
        },
    },
    "/account/api/v1/{classify}/{mod}": {
        handler: { package: "account/{classify}", module: "{mod}", method: "runner" },
    },
    "/test": {
        handler: { package: "account", module: "red", method: "redirect" },
    },

    "/remote-resources/*": {
        proxy: {
            host: "resource.aitianyu.cn",
            protocol: "https",
            rewrite: {
                "/remote-resources": "/",
            },
        },
    },
    "/account-charging/*": {
        proxy: {
            host: "localhost:3000",
            protocol: "http",
            rewrite: {
                "/account-charging": "/",
            },
        },
    },
};
