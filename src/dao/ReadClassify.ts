/** @format */

import { Database } from "@aitianyu.cn/tianyu-csp-tools";
import { MapOfType, StringHelper } from "@aitianyu.cn/types";

const SQL = "Select * from `{0}`.`{1}`;";

/** 读取所有的个性分类 */
export async function run(database: string, table: string): Promise<MapOfType<{ id: number; parent: number }>> {
    const result: MapOfType<{ id: number; parent: number }> = {};

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
                result[item["classify"]] = {
                    id: Number(item["id"]),
                    parent: Number(item["parent"]),
                };
            }
        }
    } catch (e) {
        void TIANYU.audit.error(
            "account-charging/dao/classify-reader",
            `could not get classify from given database: ${database}.${table}`,
            (e as any)?.message,
        );
    }

    return result;
}
