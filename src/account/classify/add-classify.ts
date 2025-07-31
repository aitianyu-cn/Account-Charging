/** @format */

import { HTTP_STATUS_CODE, NetworkServiceResponseData, TianyuCSP } from "@aitianyu.cn/tianyu-csp";
import { run } from "../../dao/AddClassify";
import { Config } from "../../Config";

export async function runner(): Promise<NetworkServiceResponseData> {
    let status = 200;
    let body: any = "success";

    let newClassify = "";
    let parent = 0;

    try {
        newClassify = TIANYU.request.body?.["classify"] || TIANYU.request.params("classify")?.[0];
        const parentData = TIANYU.request.body?.["parent"] || TIANYU.request.params("parent")?.[0];
        if (Number.isInteger(Number(parentData))) {
            parent = Number(parentData);
        }

        await run(Config.database, Config.classify_table, newClassify, parent);
    } catch (e) {
        status = HTTP_STATUS_CODE.BAD_REQUEST;
        body = TianyuCSP.Utils.ErrorHelper.getError(
            TianyuCSP.Common.SERVICE_ERROR_CODES.INTERNAL_ERROR,
            `to add classify ${newClassify} in ${parent} failed`,
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
