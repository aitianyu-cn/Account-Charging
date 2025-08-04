/** @format */

import { HTTP_STATUS_CODE, NetworkServiceResponseData } from "@aitianyu.cn/tianyu-csp";

export async function redirect(): Promise<NetworkServiceResponseData> {
    return {
        statusCode: HTTP_STATUS_CODE.MOVED_PERMANENTLY,
        headers: {
            Location: "https://aitianyu.cn",
        },
        body: null,
    };
}
