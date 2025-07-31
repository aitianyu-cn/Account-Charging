/** @format */

import { HTTP_STATUS_CODE, NetworkServiceResponseData, TianyuCSP } from "@aitianyu.cn/tianyu-csp";
import { queryForDay, queryForHalfYear, queryForMonth, queryForYear } from "../../dao/financial/SelectForDate";
import { TimeGranularity } from "../../dao/financial/Defines";
import { getBoolean } from "@aitianyu.cn/types";

export async function runner(): Promise<NetworkServiceResponseData> {
    let status = 200;
    let body: any = {};

    try {
        const year = Number(TIANYU.request.body?.["year"] || TIANYU.request.params("year")?.[0]);
        const month = Number(TIANYU.request.body?.["month"] || TIANYU.request.params("month")?.[0]);
        const day = Number(TIANYU.request.body?.["day"] || TIANYU.request.params("day")?.[0]);
        const details = getBoolean(TIANYU.request.body?.["details"] || TIANYU.request.params("details")?.[0]);

        const granularity = TIANYU.request.body?.["granularity"] || TIANYU.request.params("granularity")?.[0];
        switch ((granularity as string)?.toLocaleLowerCase() as TimeGranularity) {
            case "year":
                body = await queryForYear(year);
                break;
            case "half-year":
                body = await queryForHalfYear(year, month);
                break;
            case "month":
                body = await queryForMonth(year, month);
                break;
            case "day":
            default:
                body = await queryForDay(year, month, day, details);
                break;
        }
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
