/** @format */

/** @format */

import { Database } from "@aitianyu.cn/tianyu-csp-tools";
import { MapOfType, StringHelper } from "@aitianyu.cn/types";
import { Config } from "../Config";

const SQL = "Select * from `{0}`.`{1}`;";

/** 读取所有的个性分类 */
export async function run(flat: boolean, nameOnly: boolean): Promise<any> {
    const leavesTesting: Record<string, boolean> = {};
    const allMembers: MapOfType<{ id: number; parent: number }> = {};

    const sql = StringHelper.format(SQL, [Config.database, Config.classify_table]);
    const db = new Database.MysqlService({
        ...Config.mysql,
        database: Config.database,
    });

    try {
        const query = await db.query(sql);
        if (Array.isArray(query) && query.length) {
            for (const item of query) {
                if (leavesTesting[item["id"]] === undefined) {
                    leavesTesting[item["id"]] = true;
                }
                allMembers[item["classify"]] = {
                    id: Number(item["id"]),
                    parent: Number(item["parent"]),
                };
                leavesTesting[item["parent"]] = false;
            }
        }
    } catch (e) {
        void TIANYU.audit.error(
            "account-charging/dao/classify-reader",
            `could not get classify from given database: ${Config.database}.${Config.classify_table}`,
            (e as any)?.message,
        );
    }

    if (flat) {
        if (nameOnly) {
            return Object.keys(allMembers).filter((key) => leavesTesting[allMembers[key].id]);
        }

        const leaveMembers: { id: number; classify: string; parent: number }[] = [];
        for (const key of Object.keys(allMembers)) {
            if (leavesTesting[allMembers[key].id]) {
                leaveMembers.push({
                    classify: key,
                    ...allMembers[key],
                });
            }
        }
        return leaveMembers;
    } else {
        const leaveMembers: MapOfType<{ id: number; parent: number }> = {};
        for (const key of Object.keys(allMembers)) {
            if (leavesTesting[allMembers[key].id]) {
                leaveMembers[key] = allMembers[key];
            }
        }
        return leaveMembers;
    }
}
