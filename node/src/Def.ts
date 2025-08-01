/** @format */

import { AccountFinancialType } from "./interface";

export const STATUS_MAP: any = {
    是: true,
    否: false,
};

export const FINANCIAL_TYPE_MAP: { [key: string]: AccountFinancialType } = {
    转账汇款: "FIX",
    投资理财: "ARR",
    收入: "INC",
    支出: "EXP",
    投资收益: "EAR",
};
