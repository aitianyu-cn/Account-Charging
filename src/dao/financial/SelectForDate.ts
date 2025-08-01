/** @format */

import { Database } from "@aitianyu.cn/tianyu-csp-tools";
import { MapOfType, StringHelper } from "@aitianyu.cn/types";
import { AccountFinancialType, IAccountChargeRecorder } from "../ChargeAccount";
import { Config } from "../../Config";

const BigNumber = require("bignumber.js");

const SQL = "SELECT * FROM `{0}`.`{1}` WHERE `date` BETWEEN {2} AND {3};";

async function queryData(sql: string, details: boolean): Promise<any> {
    const db = new Database.MysqlService({
        ...Config.mysql,
        database: Config.database,
    });

    const result: IAccountChargeRecorder[] = [];

    let totalCount = 0;
    let recordCount = 0;

    let totalMount_EXP = new BigNumber(0);
    let totalMount_INC = new BigNumber(0);

    const accounts_map: MapOfType<{
        deal: number;
        exp: any;
        inc: any;
        total: any;
    }> = {};

    const fnCreateAccountsMapItem = (acc: string) => {
        if (acc && !accounts_map[acc]) {
            accounts_map[acc] = {
                deal: 0,
                exp: new BigNumber(0),
                inc: new BigNumber(0),
                total: new BigNumber(0),
            };
        }
    };

    try {
        const query = await db.query(sql);
        if (Array.isArray(query) && query.length) {
            for (const item of query) {
                const rec: IAccountChargeRecorder = {
                    id: item["id"],
                    date: item["date"],
                    amount: item["amount"],
                    invoice: filterString(item["invoice"]),
                    invoiceDes: filterString(item["invoice_des"]),
                    status: !!item["status"],
                    financialType: item["financial_type"],
                    accountSRC: filterString(item["src_account"]),
                    accountTAG: filterString(item["tag_account"]),
                    classify: item["classify"],
                    desc: filterString(item["desc"]),
                    valid: !!item["valid"],
                };

                // calculations
                totalCount += 1;
                if (rec.status && rec.valid) {
                    recordCount += 1;

                    fnCreateAccountsMapItem(rec.accountSRC);
                    fnCreateAccountsMapItem(rec.accountTAG);

                    const amount = new BigNumber(rec.amount);

                    switch (rec.financialType.toLocaleUpperCase() as AccountFinancialType) {
                        case "EXP":
                            totalMount_EXP = totalMount_EXP.plus(amount);

                            accounts_map[rec.accountSRC].deal += 1;
                            accounts_map[rec.accountSRC].exp = accounts_map[rec.accountSRC].exp.plus(amount);
                            accounts_map[rec.accountSRC].total = accounts_map[rec.accountSRC].total.minus(amount);
                            break;
                        case "INC":
                            totalMount_INC = totalMount_INC.plus(amount);

                            accounts_map[rec.accountSRC].deal += 1;
                            accounts_map[rec.accountSRC].inc = accounts_map[rec.accountSRC].inc.plus(amount);
                            accounts_map[rec.accountSRC].total = accounts_map[rec.accountSRC].total.plus(amount);
                            break;
                        case "FIX":
                        case "ARR":
                            if (!!rec.accountSRC) {
                                accounts_map[rec.accountSRC].deal += 1;
                                accounts_map[rec.accountSRC].exp = accounts_map[rec.accountSRC].exp.plus(amount);
                                accounts_map[rec.accountSRC].total = accounts_map[rec.accountSRC].total.minus(amount);
                            }

                            accounts_map[rec.accountTAG].deal += 1;
                            accounts_map[rec.accountTAG].inc = accounts_map[rec.accountTAG].inc.plus(amount);
                            accounts_map[rec.accountTAG].total = accounts_map[rec.accountTAG].total.plus(amount);
                            break;
                        case "EAR":
                            totalMount_INC = totalMount_INC.plus(amount);

                            accounts_map[rec.accountSRC].deal += 1;
                            accounts_map[rec.accountSRC].inc = accounts_map[rec.accountSRC].exp.plus(amount);
                            accounts_map[rec.accountSRC].total = accounts_map[rec.accountSRC].total.plus(amount);
                            break;
                        default:
                            break;
                    }
                }

                if (details) {
                    result.push(rec);
                }
            }
        }
    } catch (e) {
        void TIANYU.audit.error(
            "account-charging/dao/financial-reader",
            `could not get records from given database: ${Config.database}.${Config.accounts_table}`,
            (e as any)?.message,
        );
    }

    return {
        count: totalCount,
        amount: totalMount_INC.minus(totalMount_EXP).toString(),
        record: recordCount,
        financial: {
            EXP: totalMount_EXP.toString(),
            INC: totalMount_INC.toString(),
        },
        accounts_map: Object.keys(accounts_map).map((acc) => {
            const detail = accounts_map[acc];
            return {
                account: acc,
                deal: detail.deal,
                EXP: detail.exp.toString(),
                INC: detail.inc.toString(),
                total: detail.total.toString(),
            };
        }),
        details: result,
    };
}

export async function queryForDay(year: number, month: number, day: number, details?: boolean): Promise<any> {
    const start_time = new Date(`${year}-${month}-${day} 00:00:00`).getTime();
    const end_time = new Date(`${year}-${month}-${day} 23:59:59.999`).getTime();

    const sql = StringHelper.format(SQL, [Config.database, Config.accounts_table, start_time, end_time]);
    return queryData(sql, !!details);
}

function filterString(str: string): string {
    switch (str) {
        case "undefined":
            return "";
        default:
            return str;
    }
}

export async function queryForMonth(year: number, month: number): Promise<any> {
    const start_time = new Date(`${year}-${month}-01 00:00:00`).getTime();

    const bEndMonth = month === 12;
    const end_time = new Date(`${bEndMonth ? year + 1 : year}-${bEndMonth ? 1 : month + 1}-01 00:00:00`).getTime();

    const sql = StringHelper.format(SQL, [Config.database, Config.accounts_table, start_time, end_time]);
    return queryData(sql, false);
}

export async function queryForHalfYear(year: number, half: number): Promise<any> {
    const bBeforeHelp = half === 1;

    const start_time = new Date(`${year}-${bBeforeHelp ? 1 : 7}-01 00:00:00`).getTime();
    const end_time = new Date(`${bBeforeHelp ? year : year + 1}-${bBeforeHelp ? 7 : 1}-01 00:00:00`).getTime();

    const sql = StringHelper.format(SQL, [Config.database, Config.accounts_table, start_time, end_time]);
    return queryData(sql, false);
}

export async function queryForYear(year: number): Promise<any> {
    const start_time = new Date(`${year}-01-01 00:00:00`).getTime();
    const end_time = new Date(`${year + 1}-01-01 00:00:00`).getTime();

    const sql = StringHelper.format(SQL, [Config.database, Config.accounts_table, start_time, end_time]);
    return queryData(sql, false);
}
