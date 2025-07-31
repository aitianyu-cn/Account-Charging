/** @format */

import { TianyuCSP } from "@aitianyu.cn/tianyu-csp";
import path from "path";

export async function run(file: string, data: Buffer): Promise<void> {
    const fileOp = new TianyuCSP.Infra.IO.File.FileStreamOperator(
        {
            type: "internal",
            path: path.join("static/invoice", file),
        },
        "write_create",
    );

    await fileOp.open();
    await fileOp.write(data);
    await fileOp.flush();
    await fileOp.close();
}
