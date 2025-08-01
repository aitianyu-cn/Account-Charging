/** @format */

import fs from "fs";
import { IFileRecordLine } from "./interface";
import { FINANCIAL_TYPE_MAP, STATUS_MAP } from "./Def";
import { MapOfType } from "@aitianyu.cn/types";

const iconv = require("iconv-lite");

export async function reader(file: string): Promise<IFileRecordLine[]> {
    const fileReaderString = iconv.decode(fs.readFileSync(file), "gb2312");

    const classifies = await getClassify();

    const lines: IFileRecordLine[] = [];
    let lineCount = 0;
    for (const line of fileReaderString.split("\n")) {
        const rec = lineProcessing(line, classifies);
        !Number.isNaN(rec.date) && lines.push(rec);
    }
    return lines;
}

function lineProcessing(line: string, classifies: MapOfType<number>): IFileRecordLine {
    const lineField = line.replace("\r", "").split(",");

    const date = lineField[0];
    const time = lineField[1];

    const dateTime = new Date(`${date} ${time}`).getTime();

    const amount = lineField[2];
    const invoice = lineField[3] || "undefined";
    const invoice_des = lineField[4] || "undefined";

    const status = STATUS_MAP[lineField[5]];
    const financial_type = FINANCIAL_TYPE_MAP[lineField[6]];
    const src_account = lineField[7] || "undefined";
    const tag_account = lineField[8] || "undefined";

    const classify = (classifies[lineField[9]] || 0).toString();
    const desc = lineField[10] || "";
    const valid = STATUS_MAP[lineField[11]];

    return {
        date: dateTime,
        amount,
        invoice,
        invoice_des,
        status,
        financial_type,
        src_account,
        tag_account,
        classify,
        desc,
        valid,
    };
}

async function getClassify(): Promise<MapOfType<number>> {
    const client = new TIANYU.import.MODULE.HttpClient("localhost", "/account/api/v1/classify/read-classify", "POST");
    client.setPort(3000);
    client.setParameter({ leaves: ["true"], flat: ["true"] });

    await client.send();

    const result: MapOfType<number> = {};

    for (const item of client.response as { classify: string; id: number; parent: number }[]) {
        result[item.classify] = item.id;
    }

    return result;
}
