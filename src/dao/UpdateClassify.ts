/** @format */

import { Database } from "@aitianyu.cn/tianyu-csp-tools";
import { StringHelper } from "@aitianyu.cn/types";
import { Config } from "../Config";

export interface IClassifyNode {
    id: number;
    classify: string;
    parent: number;
}

const SQL = "Update `{0}`.`{1}` set `classify` = '{3}', `parent` = {4} where `id` = {2};";

/** 创建新的个性分类 */
export async function run(batches: IClassifyNode[]): Promise<void> {
    const sqls: string[] = [];
    for (const item of batches) {
        sqls.push(StringHelper.format(SQL, [Config.database, Config.classify_table, item.id, item.classify, item.parent]));
    }
    const db = new Database.MysqlService({
        ...Config.mysql,
        database: Config.database,
    });

    await db.executeBatch(sqls);
}
