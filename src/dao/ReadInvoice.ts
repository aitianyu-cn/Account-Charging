/** @format */

import { TianyuCSP } from "@aitianyu.cn/tianyu-csp";
import path from "path";

export async function run(file: string): Promise<string> {
    const fileOp = new TianyuCSP.Infra.IO.File.FileStreamOperator(
        {
            type: "internal",
            path: path.join("static/invoice", file),
        },
        "read",
    );

    await fileOp.open();
    const data = await fileOp.read(fileOp.size);
    await fileOp.close();

    return data.toString("base64");
}
