/** @format */

import { HTTP_STATUS_CODE, NetworkServiceResponseData, TianyuCSP } from "@aitianyu.cn/tianyu-csp";
import { run } from "../../dao/ChargeAccount";
import { Config } from "../../Config";
import { getBoolean } from "@aitianyu.cn/types";

export async function runner(): Promise<NetworkServiceResponseData> {
    let http_status = HTTP_STATUS_CODE.OK;
    let body: any = "success";

    try {
        const date = Number(TIANYU.request.body?.["date"] || TIANYU.request.params("date")?.[0]);
        const amount = TIANYU.request.body?.["amount"] || TIANYU.request.params("amount")?.[0];
        const invoice = TIANYU.request.body?.["invoice"] || TIANYU.request.params("invoice")?.[0];
        const invoiceDes = TIANYU.request.body?.["invoice_des"] || TIANYU.request.params("invoice_des")?.[0];
        const status = getBoolean(TIANYU.request.body?.["status"] || TIANYU.request.params("status")?.[0]);
        const financialType = TIANYU.request.body?.["financial_type"] || TIANYU.request.params("financial_type")?.[0];
        const accountSRC = TIANYU.request.body?.["src_account"] || TIANYU.request.params("src_account")?.[0];
        const accountTAG = TIANYU.request.body?.["tag_account"] || TIANYU.request.params("tag_account")?.[0];
        const classify = Number(TIANYU.request.body?.["classify"] || TIANYU.request.params("classify")?.[0]);
        const desc = TIANYU.request.body?.["desc"] || TIANYU.request.params("desc")?.[0];
        const valid = getBoolean(TIANYU.request.body?.["valid"] || TIANYU.request.params("valid")?.[0]);

        await run(Config.database, Config.accounts_table, {
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
        });
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
