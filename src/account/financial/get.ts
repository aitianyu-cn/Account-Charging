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

        const endingYear = Number(TIANYU.request.body?.target?.["year"]);
        const endingMonth = Number(TIANYU.request.body?.target?.["month"]);
        const endingDay = Number(TIANYU.request.body?.target?.["day"]);

        const granularity = TIANYU.request.body?.["granularity"] || TIANYU.request.params("granularity")?.[0];
        switch ((granularity as string)?.toLocaleLowerCase() as TimeGranularity) {
            case "year":
                body = await queryForYear(year, Number.isNaN(endingYear) || endingYear <= year ? year + 1 : endingYear);
                break;
            case "half-year":
                body = await queryForHalfYear(year, month);
                break;
            case "month":
                body = await handleMonth(year, month, endingYear, endingMonth);
                break;
            case "day":
            default:
                body = await handleDay(year, month, day, endingYear, endingMonth, endingDay, details);
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

async function handleMonth(year: number, month: number, endingYear: number, endingMonth: number): Promise<any> {
    const bEndMonth = month === 12;
    const bEndYearValid = Number.isNaN(endingYear) || endingYear < year;
    return queryForMonth(
        year,
        month,
        bEndYearValid ? endingYear : year + (bEndMonth ? 1 : 0),
        bEndYearValid
            ? Number.isNaN(endingMonth) || (endingYear === year && endingMonth <= month)
                ? month + 1
                : endingMonth
            : month + 1,
    );
}

async function handleDay(
    year: number,
    month: number,
    day: number,
    endingYear: number,
    endingMonth: number,
    endingDay: number,
    details?: boolean,
): Promise<any> {
    const bEndDayValid = Number.isInteger(endingYear) && Number.isInteger(endingMonth) && Number.isInteger(endingDay);
    const startTime = year * 10000 + month * 100 + day;
    const endTime = bEndDayValid ? endingYear * 10000 + endingMonth * 100 + endingDay : startTime;
    const bEndDayCanUsed = endTime > startTime;
    return queryForDay(
        year,
        month,
        day,
        bEndDayCanUsed ? endingYear : year,
        bEndDayCanUsed ? endingMonth : month,
        bEndDayCanUsed ? endingDay : day,
        details,
    );
}
