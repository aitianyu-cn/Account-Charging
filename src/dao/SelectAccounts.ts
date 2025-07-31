/** @format */

import { Database } from "@aitianyu.cn/tianyu-csp-tools";
import { StringHelper } from "@aitianyu.cn/types";

const SQL =
    "Select Distinct `src_account` as `accounts` from `{0}`.`{1}` UNION Select Distinct `tag_account` as `accounts` from `{0}`.`{1}`;";

/** 读取所有操作过的账户 */
export async function run(database: string, table: string): Promise<string[]> {
    const result: string[] = [];

    const sql = StringHelper.format(SQL, [database, table]);
    const db = new Database.MysqlService({
        host: "server.tencent.backend.aitianyu.cn",
        user: "root",
        password: "ysy1998ysy[]",
        database: database,
    });

    try {
        const query = await db.query(sql);
        if (Array.isArray(query) && query.length) {
            for (const item of query) {
                checkValid(item["accounts"]) && result.push(item["accounts"]);
            }
        }
    } catch (e) {
        void TIANYU.audit.error(
            "account-charging/dao/accounts-reader",
            `could not get accounts from given database: ${database}.${table}`,
            (e as any)?.message,
        );
    }

    return result;
}

const INVALID_ACCOUNT_NAMES = ["undefined", "null"];

function checkValid(acc: string): boolean {
    if (!acc) {
        return false;
    }

    return !INVALID_ACCOUNT_NAMES.includes(acc);
}
