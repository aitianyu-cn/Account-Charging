/** @format */

import { Database } from "@aitianyu.cn/tianyu-csp-tools";
import { StringHelper } from "@aitianyu.cn/types";
import { Config } from "../Config";

const SQL = "Insert into `{0}`.`{1}` (`classify`, `parent`) Values('{2}', {3});";

/** 创建新的个性分类 */
export async function run(newClassify: string, parent: number): Promise<void> {
    const sql = StringHelper.format(SQL, [Config.database, Config.classify_table, newClassify, parent]);
    const db = new Database.MysqlService({
        ...Config.mysql,
        database: Config.database,
    });

    await db.execute(sql);
}
