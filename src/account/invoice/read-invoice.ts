/** @format */

import { HTTP_STATUS_CODE, NetworkServiceResponseData, TianyuCSP } from "@aitianyu.cn/tianyu-csp";
import { run } from "../../dao/ReadInvoice";

export async function runner(): Promise<NetworkServiceResponseData> {
    let status = 200;
    let body: any = {};
    let contentType = "image";

    try {
        const file = TIANYU.request.body?.["file"] || TIANYU.request.params("file")?.[0];
        body = await run(file);

        const split = (file as string).split(".");
        if (split.length) {
            const ext = split[split.length - 1];
            if (ext) {
                contentType += `/${ext}`;
            }
        }
    } catch (e) {
        status = HTTP_STATUS_CODE.BAD_REQUEST;
        body = TianyuCSP.Utils.ErrorHelper.getError(
            TianyuCSP.Common.SERVICE_ERROR_CODES.INTERNAL_ERROR,
            `to read invoice failed`,
            (e as any)?.message,
        );
    } finally {
        //
    }

    return {
        body,
        statusCode: status,
        headers: {
            "content-type": contentType,
        },
    };
}
