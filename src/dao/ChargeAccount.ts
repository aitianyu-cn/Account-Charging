/** @format */

import { Database } from "@aitianyu.cn/tianyu-csp-tools";
import { StringHelper } from "@aitianyu.cn/types";
import { Config } from "../Config";

export type AccountFinancialType = "EXP" | "INC" | "FIX" | "ARR" | "EAR";

export interface IAccountChargeRecorder {
    id: string;
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
export async function run(recorder: IAccountChargeRecorder): Promise<void> {
    return runBatch([recorder]);
}

/** 记录多个账目 */
export async function runBatch(recorders: IAccountChargeRecorder[]): Promise<void> {
    const sqls: string[] = [];
    for (const recorder of recorders) {
        const sql = StringHelper.format(SQL, [
            Config.database,
            Config.accounts_table,
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
        sqls.push(sql);
    }

    const db = new Database.MysqlService({
        ...Config.mysql,
        database: Config.database,
    });

    await db.executeBatch(sqls);
}
