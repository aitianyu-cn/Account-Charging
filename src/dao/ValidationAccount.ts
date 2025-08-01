/** @format */

import { Database } from "@aitianyu.cn/tianyu-csp-tools";
import { StringHelper } from "@aitianyu.cn/types";
import { Config } from "../Config";

const SQL = "Update `{0}`.`{1}` Set `valid` = {3} Where `id` = {2};";

/** 入账状态改变 */
export async function run(recId: number, valid: boolean): Promise<void> {
    const sql = StringHelper.format(SQL, [Config.database, Config.accounts_table, recId, valid ? 1 : 0]);
    const db = new Database.MysqlService({
        ...Config.mysql,
        database: Config.database,
    });

    await db.execute(sql);
}
