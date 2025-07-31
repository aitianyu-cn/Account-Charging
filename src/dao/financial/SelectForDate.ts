/** @format */

import { Database } from "@aitianyu.cn/tianyu-csp-tools";
import { MapOfType, StringHelper } from "@aitianyu.cn/types";
import { IAccountChargeRecorder } from "../ChargeAccount";
import { Config } from "../../Config";

const BigNumber = require("bignumber");

const DAY_SQL = "SELECT * FROM `{0}`.`{1}` WHERE `date` BETWEEN {2} AND {3};";

export async function queryForDay(year: number, month: number, day: number, details?: boolean): Promise<any> {
    const start_time = new Date(`${year}-${month}-${day} 00:00:00`).getTime();
    const end_time = new Date(`${year}-${month}-${day} 23:59:59.999`).getTime();

    const sql = StringHelper.format(DAY_SQL, [Config.database, Config.accounts_table, start_time, end_time]);
    const db = new Database.MysqlService({
        host: "server.tencent.backend.aitianyu.cn",
        user: "root",
        password: "ysy1998ysy[]",
        database: Config.database,
    });

    const result: IAccountChargeRecorder[] = [];

    const totalCount = 0;

    const totalMount_EXP = new BigNumber(0);
    const totalMount_INC = new BigNumber(0);
    const totalMount_FIX = new BigNumber(0);
    const totalMount_ARR = new BigNumber(0);
    const totalMount_EAR = new BigNumber(0);

    const totalAmount = new BigNumber(0);

    const accounts_map: MapOfType<{
        deal: number;
        exp: any;
        inc: any;
        fix: any;
        arr: any;
        ear: any;
        total: any;
    }> = {};

    try {
        const query = await db.query(sql);
        if (Array.isArray(query) && query.length) {
            for (const item of query) {
                const rec: IAccountChargeRecorder = {
                    date: item["date"],
                    amount: item["amount"],
                    invoice: filterString(item["invoice"]),
                    invoiceDes: filterString(item["invoice_des"]),
                    status: !!item["status"],
                    financialType: item["financial_type"],
                    accountSRC: filterString(item["src_account"]),
                    accountTAG: filterString(item["tag_account"]),
                    classify: item["classify"],
                    desc: filterString(item["desc"]),
                    valid: !!item["valid"],
                };

                // calculations

                details && result.push(rec);
            }
        }
    } catch (e) {
        void TIANYU.audit.error(
            "account-charging/dao/financial-reader",
            `could not get records from given database: ${Config.database}.${Config.accounts_table}`,
            (e as any)?.message,
        );
    }

    return {
        count: totalCount,
        amount: totalAmount,
        financial: {
            EXP: totalMount_EXP,
            INC: totalMount_INC,
            FIX: totalMount_FIX,
            ARR: totalMount_ARR,
            EAR: totalMount_EAR,
        },
        accounts_map: Object.keys(accounts_map).map((acc) => {
            const detail = accounts_map[acc];
            return {
                account: acc,
                deal: detail.deal,
                EXP: detail.exp,
                INC: detail.inc,
                FIX: detail.fix,
                ARR: detail.arr,
                EAR: detail.ear,
                total: detail.total,
            };
        }),
    };
}

function filterString(str: string): string {
    switch (str) {
        case "undefined":
            return "";
        default:
            return str;
    }
}
