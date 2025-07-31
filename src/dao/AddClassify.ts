/** @format */

import { Database } from "@aitianyu.cn/tianyu-csp-tools";
import { StringHelper } from "@aitianyu.cn/types";

const SQL = "Insert into `{0}`.`{1}` (`classify`, `parent`) Values('{2}', {3});";

/** 创建新的个性分类 */
export async function run(database: string, table: string, newClassify: string, parent: number): Promise<void> {
    const sql = StringHelper.format(SQL, [database, table, newClassify, parent]);
    const db = new Database.MysqlService({
        host: "server.tencent.backend.aitianyu.cn",
        user: "root",
        password: "ysy1998ysy[]",
        database: database,
    });

    await db.execute(sql);
}
