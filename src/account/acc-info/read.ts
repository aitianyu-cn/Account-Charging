/** @format */

import { HTTP_STATUS_CODE, NetworkServiceResponseData, TianyuCSP } from "@aitianyu.cn/tianyu-csp";
import { run } from "../../dao/SelectAccounts";
import { Config } from "../../Config";

export async function runner(): Promise<NetworkServiceResponseData> {
    let status = 200;
    let body: any = {};

    try {
        body = await run(Config.database, Config.accounts_table);
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
