/** @format */

import { Database } from "@aitianyu.cn/tianyu-csp-tools";
import { StringHelper } from "@aitianyu.cn/types";

export interface IClassifyNode {
    id: number;
    classify: string;
    parent: number;
}

const SQL = "Update `{0}`.`{1}` set `classify` = '{3}', `parent` = {4} where `id` = {2};";

/** 创建新的个性分类 */
export async function run(database: string, table: string, batches: IClassifyNode[]): Promise<void> {
    const sqls: string[] = [];
    for (const item of batches) {
        sqls.push(StringHelper.format(SQL, [database, table, item.id, item.classify, item.parent]));
    }
    const db = new Database.MysqlService({
        host: "server.tencent.backend.aitianyu.cn",
        user: "root",
        password: "ysy1998ysy[]",
        database: database,
    });

    await db.executeBatch(sqls);
}
