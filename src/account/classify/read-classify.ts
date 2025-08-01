/** @format */

import { HTTP_STATUS_CODE, NetworkServiceResponseData, TianyuCSP } from "@aitianyu.cn/tianyu-csp";
import { run as readAllMembers } from "../../dao/ReadClassify";
import { run as readLeaveMembers } from "../../dao/ReadClassifyLeaves";
import { getBoolean } from "@aitianyu.cn/types";

export async function runner(): Promise<NetworkServiceResponseData> {
    let status = 200;
    let body: any = {};

    try {
        const leaves = getBoolean(TIANYU.request.params("leaves")?.[0]);
        const flat = getBoolean(TIANYU.request.params("flat")?.[0]);
        const nameOnly = getBoolean(TIANYU.request.params("show-name")?.[0]);
        body = leaves ? await readLeaveMembers(flat, nameOnly) : await readAllMembers(flat);
    } catch (e) {
        status = HTTP_STATUS_CODE.BAD_REQUEST;
        body = TianyuCSP.Utils.ErrorHelper.getError(
            TianyuCSP.Common.SERVICE_ERROR_CODES.INTERNAL_ERROR,
            `to read classify failed`,
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
