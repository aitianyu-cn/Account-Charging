/** @format */

export type AccountFinancialType = "EXP" | "INC" | "FIX" | "ARR" | "EAR";

export interface IFileRecordLine {
    date: number;
    amount: string;
    invoice: string;
    invoice_des: string;
    status: boolean;
    financial_type: AccountFinancialType;
    src_account: string;
    tag_account: string;
    classify: string;
    desc: string;
    valid: boolean;
}
