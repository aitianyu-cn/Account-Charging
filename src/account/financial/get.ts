/** @format */

import { HTTP_STATUS_CODE, NetworkServiceResponseData, TianyuCSP } from "@aitianyu.cn/tianyu-csp";
import { queryForDay } from "../../dao/financial/SelectForDate";

export async function runner(): Promise<NetworkServiceResponseData> {
    let status = 200;
    let body: any = {};

    try {
        const year = Number(TIANYU.request.body?.["year"] || TIANYU.request.params("year")?.[0]);
        const month = Number(TIANYU.request.body?.["month"] || TIANYU.request.params("month")?.[0]);
        const day = Number(TIANYU.request.body?.["day"] || TIANYU.request.params("day")?.[0]);

        body = await queryForDay(year, month, day, true);
    } catch (e) {
        status = HTTP_STATUS_CODE.BAD_REQUEST;
        body = TianyuCSP.Utils.ErrorHelper.getError(
            TianyuCSP.Common.SERVICE_ERROR_CODES.INTERNAL_ERROR,
            `to read financial records failed`,
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
