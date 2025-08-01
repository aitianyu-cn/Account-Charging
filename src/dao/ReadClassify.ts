/** @format */

import { Database } from "@aitianyu.cn/tianyu-csp-tools";
import { MapOfType, StringHelper } from "@aitianyu.cn/types";
import { Config } from "../Config";

const SQL = "Select * from `{0}`.`{1}`;";

/** 读取所有的个性分类 */
export async function run(flat: boolean): Promise<any> {
    const result: MapOfType<{ id: number; parent: number }> = {};

    const sql = StringHelper.format(SQL, [Config.database, Config.classify_table]);
    const db = new Database.MysqlService({
        ...Config.mysql,
        database: Config.database,
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
            `could not get classify from given database: ${Config.database}.${Config.classify_table}`,
            (e as any)?.message,
        );
    }

    return !flat
        ? result
        : Object.keys(result).map((key) => {
              return {
                  classify: key,
                  ...result[key],
              };
          });
}
