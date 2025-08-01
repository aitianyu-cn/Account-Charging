/** @format */

import { HTTP_STATUS_CODE, NetworkServiceResponseData, TianyuCSP } from "@aitianyu.cn/tianyu-csp";
import { run } from "../../dao/ValidationAccount";
import { getBoolean } from "@aitianyu.cn/types";

export async function runner(): Promise<NetworkServiceResponseData> {
    let http_status = HTTP_STATUS_CODE.OK;
    let body: any = "success";

    try {
        const id = Number(TIANYU.request.body?.["id"] || TIANYU.request.params("id")?.[0]);
        const valid = getBoolean(TIANYU.request.body?.["valid"] || TIANYU.request.params("valid")?.[0]);

        await run(id, valid);
    } catch (e) {
        http_status = HTTP_STATUS_CODE.BAD_REQUEST;
        body = TianyuCSP.Utils.ErrorHelper.getError(
            TianyuCSP.Common.SERVICE_ERROR_CODES.INTERNAL_ERROR,
            `to change the account validation status failed`,
            (e as any)?.message,
        );
    } finally {
        //
    }

    return {
        body,
        statusCode: http_status,
        headers: {},
    };
}
