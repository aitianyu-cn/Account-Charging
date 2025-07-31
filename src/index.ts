/** @format */

import { TianyuCSP } from "@aitianyu.cn/tianyu-csp";

try {
    TianyuCSP.Infra.load();

    const contributor = TianyuCSP.Infra.creator.contributor();

    const dispatcher = new TianyuCSP.Infra.DispatchHandler(undefined, contributor);
    const requester = new TianyuCSP.Infra.RequestHandler(contributor);

    dispatcher.initialize();
    requester.initialize();

    const http1 = new TianyuCSP.Infra.HttpService(
        {
            host: "0.0.0.0",
            port: 3000,
            enablefallback: true,
            advanceRest: true,
        },
        contributor,
    );

    http1.listen(() => {
        // eslint-disable-next-line no-console
        console.log("---- start");
    });
} catch (e) {
    console.error(e);
}
