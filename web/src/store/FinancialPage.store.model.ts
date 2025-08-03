/** @format */

import { IterableType } from "@aitianyu.cn/tianyu-store";

export interface IFinancialPageStoreModel extends IterableType {
    granularity: "year" | "half-year" | "month" | "day";
    year: number;
    month: number;
    day: number;

    target: {
        enable: boolean;
        year: number;
        month: number;
        day: number;
    };

    details: boolean;

    refreshKey: string;
}
