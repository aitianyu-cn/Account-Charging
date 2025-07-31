/** @format */

import { Database } from "@aitianyu.cn/tianyu-csp-tools";
import { StringHelper } from "@aitianyu.cn/types";

export type AccountFinancialType = "EXP" | "INC" | "FIX" | "ARR" | "EAR";

export interface IAccountChargeRecorder {
    date: number;
    amount: string;
    invoice: string;
    invoiceDes: string;
    status: boolean;
    financialType: AccountFinancialType;
    accountSRC: string;
    accountTAG: string;
    classify: number;
    desc: string;
    valid: boolean;
}

const SQL =
    "Insert into `{0}`.`{1}` (`date`, `amount`, `invoice`, `invoice_des`, `status`, `financial_type`, `src_account`, `tag_account`, `classify`, `desc`) Values({2}, {3}, '{4}', '{5}', {6}, '{7}', '{8}', '{9}', {10}, '{11}');";

/** 记录一个账目 */
export async function run(database: string, table: string, recorder: IAccountChargeRecorder): Promise<void> {
    const sql = StringHelper.format(SQL, [
        database,
        table,
        recorder.date,
        recorder.amount,
        recorder.invoice,
        recorder.invoiceDes,
        recorder.status ? 1 : 0,
        recorder.financialType,
        recorder.accountSRC,
        recorder.accountTAG,
        recorder.classify,
        recorder.desc,
    ]);

    const db = new Database.MysqlService({
        host: "server.tencent.backend.aitianyu.cn",
        user: "root",
        password: "ysy1998ysy[]",
        database: database,
    });

    await db.execute(sql);
}
