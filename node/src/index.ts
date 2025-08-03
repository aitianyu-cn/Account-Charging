/** @format */

import { TianyuCSP } from "@aitianyu.cn/tianyu-csp";
import { reader } from "./RecordFileReader";
import { getBoolean } from "@aitianyu.cn/types";

try {
    TianyuCSP.Infra.load();

    void reader(process.argv[2] || "", getBoolean(process.argv[3])).then(async (value) => {
        for (const rec of value) {
            const client = new TIANYU.import.MODULE.HttpClient("localhost", "/account/api/v1/financial/charge", "POST");
            client.setPort(3000);
            client.setBody(rec);
            await client.send().catch((error) => {
                console.error(error);
            });
            // eslint-disable-next-line no-console
            console.log(client.response || "success");
        }
    });
} catch (e) {
    console.error(e);
}
