/** @format */

import { Database } from "@aitianyu.cn/tianyu-csp-tools";
import { StringHelper } from "@aitianyu.cn/types";

const SQL = "Update `{0}`.`{1}` Set `valid` = {3} Where `id` = {2};";

/** 入账状态改变 */
export async function run(database: string, table: string, recId: number, valid: boolean): Promise<void> {
    const sql = StringHelper.format(SQL, [database, table, recId, valid ? 1 : 0]);
    const db = new Database.MysqlService({
        host: "server.tencent.backend.aitianyu.cn",
        user: "root",
        password: "ysy1998ysy[]",
        database: database,
    });

    await db.execute(sql);
}
