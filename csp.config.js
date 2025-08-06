/** @format */

const npm_config = require("./package.json");

module.exports = {
    config: {
        name: "Account Charging",
        version: npm_config.version,
        environment: "development",
        src: "build/src",
        language: "zh_CN",
        audit: {},
    },
    rest: {
        file: ".config/rest.js",
        "request-map": {
            language: {
                cookie: "LANGUAGE",
                search: "x-language",
            },
            session: "SESSION_ID",
        },
        loader: "web/build",
    },
    xcall: {
        logger: { log: { package: "xcall", module: "runtime", method: "log" } },
        usage: { record: { package: "xcall", module: "runtime", method: "recordUsage" } },
        trace: { trace: { package: "xcall", module: "runtime", method: "trace" } },

        feature: { "is-active": { package: "xcall", module: "feature", method: "isActive" } },

        session: { get: { package: "xcall", module: "session", method: "getter" } },
        user: { get: { package: "xcall", module: "user", method: "getter" } },
        license: { get: { package: "xcall", module: "license", method: "getter" } },
        role: { get: { package: "xcall", module: "role", method: "getter" } },
    },
};
