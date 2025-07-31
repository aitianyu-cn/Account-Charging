/** @format */

import { Database } from "@aitianyu.cn/tianyu-csp-tools";

interface IXCallLog {
    user: string; // the user id of current session or job
    level: string; // the message level to string formatting
    time: string; // the time of message occurs
    message: string; // the message main body
}

export async function recordUsage(): Promise<void> {
    //
}

export async function trace(): Promise<void> {
    //
}

export async function log(data: IXCallLog): Promise<void> {
    const db = new Database.RedisService({
        host: "server.tencent.backend.aitianyu.cn",
        password: "ysy1998ysy[]",
        database: "1",
    });

    await db.lpush("log", JSON.stringify(data));
    await db.close();
}
