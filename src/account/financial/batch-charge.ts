/** @format */

import { HTTP_STATUS_CODE, NetworkServiceResponseData, TianyuCSP } from "@aitianyu.cn/tianyu-csp";
import { IAccountChargeRecorder, runBatch } from "../../dao/ChargeAccount";
import { getBoolean } from "@aitianyu.cn/types";

export async function runner(): Promise<NetworkServiceResponseData> {
    let http_status = HTTP_STATUS_CODE.OK;
    let body: any = "success";

    try {
        const data = typeof TIANYU.request.body === "string" ? JSON.stringify(TIANYU.request.body) : TIANYU.request.body;

        const recs: IAccountChargeRecorder[] = [];
        if (Array.isArray(data)) {
            for (const item of data) {
                const date = Number(item["date"]);
                const amount = item["amount"];
                const invoice = item["invoice"];
                const invoiceDes = item["invoice_des"];
                const status = getBoolean(item["status"]);
                const financialType = item["financial_type"];
                const accountSRC = item["src_account"];
                const accountTAG = item["tag_account"];
                const classify = Number(item["classify"]);
                const desc = item["desc"];
                const valid = getBoolean(item["valid"]);

                const rec: IAccountChargeRecorder = {
                    id: "",
                    date,
                    amount,
                    invoice,
                    invoiceDes,
                    status,
                    financialType,
                    accountSRC,
                    accountTAG,
                    classify,
                    desc,
                    valid,
                };
                if (validate(rec)) {
                    recs.push(rec);
                } else {
                    return {
                        body: TianyuCSP.Utils.ErrorHelper.getError(
                            TianyuCSP.Common.SERVICE_ERROR_CODES.INTERNAL_ERROR,
                            `to add new account chargings failed`,
                            `the account data validation failed: ${JSON.stringify(rec)}`,
                        ),
                        statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
                        headers: {},
                    };
                }
            }
        } else {
            return {
                body: TianyuCSP.Utils.ErrorHelper.getError(
                    TianyuCSP.Common.SERVICE_ERROR_CODES.INTERNAL_ERROR,
                    `to add new account chargings failed`,
                    `wrong payload data`,
                ),
                statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
                headers: {},
            };
        }

        await runBatch(recs);
    } catch (e) {
        http_status = HTTP_STATUS_CODE.BAD_REQUEST;
        body = TianyuCSP.Utils.ErrorHelper.getError(
            TianyuCSP.Common.SERVICE_ERROR_CODES.INTERNAL_ERROR,
            `to add a new account charging failed`,
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

function validate(recorder: IAccountChargeRecorder): boolean {
    if (!Number.isNaN(recorder.date)) {
        return false;
    }
    if (!recorder.financialType) {
        return false;
    }
    if (!Number.isNaN(recorder.classify)) {
        return false;
    }

    return true;
}
