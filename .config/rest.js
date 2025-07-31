/** @format */

module.exports = {
    // "/": {
    //     handlers: {
    //         GET: { package: "$", module: "default-loader", method: "html" },
    //     },
    // },
    "/account/api/v1/{classify}/{mod}": {
        handler: { package: "account/{classify}", module: "{mod}", method: "runner" },
    },
};
