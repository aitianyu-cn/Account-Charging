/** @format */

import { HTTP_STATUS_CODE, NetworkServiceResponseData, TianyuCSP } from "@aitianyu.cn/tianyu-csp";
import { run } from "../../dao/UploadInvoice";

export async function runner(): Promise<NetworkServiceResponseData> {
    let status = 200;
    let body: any = "success";

    try {
        const img = TIANYU.request.body?.["img"] || TIANYU.request.params("img")?.[0];
        const file = TIANYU.request.body?.["file"] || TIANYU.request.params("file")?.[0];
        await run(file, Buffer.from(img, "hex"));
    } catch (e) {
        status = HTTP_STATUS_CODE.BAD_REQUEST;
        body = TianyuCSP.Utils.ErrorHelper.getError(
            TianyuCSP.Common.SERVICE_ERROR_CODES.INTERNAL_ERROR,
            `to save invoice failed`,
            (e as any)?.message,
        );
    } finally {
        //
    }

    return {
        body,
        statusCode: status,
        headers: {},
    };
}
