/** @format */

import { HTTP_STATUS_CODE, NetworkServiceResponseData, TianyuCSP } from "@aitianyu.cn/tianyu-csp";
import { IClassifyNode, run } from "../../dao/UpdateClassify";

export async function runner(): Promise<NetworkServiceResponseData> {
    let status = 200;
    let body: any = "success";

    try {
        const updates: IClassifyNode[] = [];

        if (
            Number.isInteger(Number(TIANYU.request.params("id")?.[0])) &&
            TIANYU.request.params("classify")?.[0] &&
            Number.isInteger(Number(TIANYU.request.params("parent")?.[0]))
        ) {
            const id = Number(TIANYU.request.params("id")?.[0]);
            const classify = TIANYU.request.params("classify")?.[0];
            const parent = Number(TIANYU.request.params("parent")?.[0]);

            updates.push({ id, classify, parent });
        } else {
            if (Array.isArray(TIANYU.request.body["updates"])) {
                for (const item of TIANYU.request.body["updates"]) {
                    const id = Number(item("id"));
                    const classify = item["classify"];
                    const parent = Number(item("parent"));

                    Number.isInteger(id) && Number.isInteger(parent) && updates.push({ id, classify, parent });
                }
            }
        }

        await run(updates);
    } catch (e) {
        status = HTTP_STATUS_CODE.BAD_REQUEST;
        body = TianyuCSP.Utils.ErrorHelper.getError(
            TianyuCSP.Common.SERVICE_ERROR_CODES.INTERNAL_ERROR,
            `to update classifies failed`,
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
