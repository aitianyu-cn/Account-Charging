/**@format */

import React from "react";
import ReactDOM from "react-dom/client";

import(/*webpackChunkName: "resources/core" */ "./utils/Loading").then(({ loading }) => {
    loading().then(async (_CORE) => {
        // import(/*webpackChunkName: "resources/home" */ "./ui/Home").then(async ({ Home }) => {
        //     const { init } = await import(/*webpackChunkName: "resources/cache" */ "./utils/Cache");
        //     await init();
        //     const rootHtml = document.createElement("div");
        //     document.body.appendChild(rootHtml);
        //     const reactRoot = ReactDOM.createRoot(rootHtml);
        //     reactRoot.render(<Home />);
        // });

        // const rootHtml = document.createElement("div");
        // document.body.appendChild(rootHtml);
        // const reactRoot = ReactDOM.createRoot(rootHtml);
        // reactRoot.render(<div>Test Run Page</div>);
        const rootHtml = document.createElement("div");
        rootHtml.style.height = "100vh";
        rootHtml.style.width = "100%";
        _CORE.Major.append(rootHtml);

        const { ClassifyPage } = await import("./app/ClassifyPage");
        const { GetFinancialPage } = await import("./app/GetFinancialPage");

        const reactRoot = ReactDOM.createRoot(rootHtml);
        // reactRoot.render(<div>Test Run Page</div>);
        reactRoot.render(<GetFinancialPage />);
    });
});
