/** @format */

import { IStore, InstanceId, Unsubscribe } from "@aitianyu.cn/tianyu-store";
import React from "react";
import { FinancialPageStoreImpl } from "../store/FinancialPage.store.operations";
import { XHRLoader } from "@aitianyu.cn/client-base";
import { Message, TianyuShellUIMessageType } from "@aitianyu.cn/tianyu-shell/core";

export interface IFinancialShowFromProp {
    store: IStore;
    parent: InstanceId;
}

interface IFinancialData {
    count: number;
    amount: string;
    record: number;
    financial: {
        EXP: string;
        INC: string;
    };
    accounts_map: {
        account: string;
        deal: number;
        EXP: string;
        INC: string;
        total: string;
    }[];
    details: IAccountChargeRecorder[];
}

interface IAccountChargeRecorder {
    id: number;
    date: number;
    amount: string;
    invoice: string;
    invoiceDes: string;
    status: boolean;
    financialType: "EXP" | "INC" | "FIX" | "ARR" | "EAR";
    accountSRC: string;
    accountTAG: string;
    classify: number;
    desc: string;
    valid: boolean;
}

const FINANCIAL_MAP: any = {
    EXP: "支出",
    INC: "收入",
    FIX: "汇款转账",
    ARR: "投资理财",
    EAR: "投资收益",
};

export class FinancialShowFrom extends React.Component<IFinancialShowFromProp> {
    private _unsubscribeRefreshKey?: Unsubscribe;

    private _fetching: boolean;
    private _first: boolean;

    private _data?: IFinancialData = {
        count: 2,
        amount: "-50",
        record: 2,
        financial: {
            EXP: "50",
            INC: "0",
        },
        accounts_map: [
            {
                account: "招商银行储蓄卡-7959",
                deal: 1,
                EXP: "100",
                INC: "0",
                total: "-100",
            },
            {
                account: "建设银行储蓄卡-0637",
                deal: 2,
                EXP: "50",
                INC: "100",
                total: "50",
            },
        ],
        details: [
            {
                id: 19,
                date: 1754007894000,
                amount: "100",
                invoice: "",
                invoiceDes: "",
                status: true,
                financialType: "FIX",
                accountSRC: "招商银行储蓄卡-7959",
                accountTAG: "建设银行储蓄卡-0637",
                classify: 0,
                desc: "转账",
                valid: true,
            },
            {
                id: 20,
                date: 1754025210000,
                amount: "50",
                invoice: "",
                invoiceDes: "",
                status: true,
                financialType: "EXP",
                accountSRC: "建设银行储蓄卡-0637",
                accountTAG: "",
                classify: 7,
                desc: "充值交通卡",
                valid: true,
            },
        ],
    };
    private _classify?: { classify: string; id: number; parent: number }[] = [
        {
            classify: "固定支出",
            id: 1,
            parent: 0,
        },
        {
            classify: "房贷",
            id: 2,
            parent: 1,
        },
        {
            classify: "车贷",
            id: 3,
            parent: 1,
        },
        {
            classify: "装修贷",
            id: 4,
            parent: 1,
        },
        {
            classify: "生活费",
            id: 5,
            parent: 0,
        },
        {
            classify: "餐饮",
            id: 6,
            parent: 5,
        },
        {
            classify: "出行",
            id: 7,
            parent: 5,
        },
        {
            classify: "养车",
            id: 8,
            parent: 5,
        },
        {
            classify: "房租",
            id: 9,
            parent: 1,
        },
        {
            classify: "服饰美容",
            id: 10,
            parent: 5,
        },
        {
            classify: "收入",
            id: 11,
            parent: 0,
        },
        {
            classify: "红包",
            id: 12,
            parent: 11,
        },
        {
            classify: "其他",
            id: 13,
            parent: 5,
        },
        {
            classify: "工资",
            id: 14,
            parent: 11,
        },
        {
            classify: "股票收益",
            id: 15,
            parent: 11,
        },
    ];

    private _showAccounts: boolean;
    private _showDetails: boolean;

    public constructor(prop: IFinancialShowFromProp) {
        super(prop);

        this._fetching = false;
        this._first = true;

        this._showAccounts = false;
        this._showDetails = false;
    }

    public override componentDidMount(): void {
        this._unsubscribeRefreshKey = this.props.store.subscribe(
            FinancialPageStoreImpl.impl.getRefreshKey(this.props.parent),
            this.refetchData.bind(this),
        );
    }

    public override componentWillUnmount(): void {
        this._unsubscribeRefreshKey?.();
    }

    public override render(): React.ReactNode {
        if (this._first) {
            return (
                <div>
                    <h1>请点击刷新按钮以获取数据</h1>
                </div>
            );
        }
        if (this._fetching) {
            return (
                <div>
                    <h1>数据加载中...</h1>
                </div>
            );
        }
        if (!this._data || !this._classify) {
            return (
                <div>
                    <h1>数据加载失败，请刷新...</h1>
                </div>
            );
        }

        return (
            <div>
                <div style={{ display: "flex" }}>
                    <div
                        style={{
                            fontSize: "35px",
                            marginLeft: "15px",
                        }}>
                        收入支出合计
                    </div>
                    <div
                        style={{
                            fontSize: "35px",
                            marginLeft: "15px",
                            color: this._data.amount.includes("-") ? "#ff5d5dff" : "#00ff48dd",
                        }}>
                        {`${this._data.amount}￥`}
                    </div>
                </div>

                <div style={{ display: "flex", marginLeft: "15px", fontSize: "25px" }}>
                    <div>交易数：</div>
                    <div>{`${this._data.count} 个`}</div>
                </div>

                <div style={{ display: "flex", fontSize: "25px" }}>
                    <div style={{ display: "flex", marginLeft: "15px" }}>
                        <div>支出：</div>
                        <div>{`￥${this._data.financial.EXP}`}</div>
                    </div>
                    <div style={{ display: "flex", marginLeft: "15px" }}>
                        <div>收入：</div>
                        <div>{`￥${this._data.financial.INC}`}</div>
                    </div>
                </div>

                <div style={{ display: "flex" }}>
                    <div style={{ display: "flex", margin: "15px" }}>
                        <div style={{ marginRight: "15px" }}>交易账户</div>
                        {this._data.accounts_map.length && (
                            <div>
                                <button
                                    onClick={() => {
                                        this._showAccounts = !this._showAccounts;
                                        this.forceUpdate();
                                    }}>
                                    {this._showAccounts ? "隐藏所有账户" : `显示所有账户（${this._data.accounts_map.length}个）`}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                {!!this._showAccounts && (
                    <div>
                        {this._data.accounts_map.map((value) => {
                            return (
                                <div
                                    key={value.account}
                                    style={{ background: "#484848ff", margin: "10px", borderRadius: "10px" }}>
                                    <div style={{ color: "#dfdfdfff", padding: "5px" }}>
                                        <div
                                            style={{
                                                fontSize: "25px",
                                                marginLeft: "15px",
                                            }}>{`${value.account}（${value.deal}笔交易）`}</div>
                                        <div
                                            style={{
                                                fontSize: "20px",
                                                margin: "5px",
                                                paddingLeft: "15px",
                                            }}>{`￥${value.total}`}</div>
                                        <div style={{ display: "flex", fontSize: "15px", paddingBottom: "5px" }}>
                                            <div
                                                style={{ color: "#9fffaae2", marginLeft: "15px" }}>{`收入 + ￥${value.INC}`}</div>
                                            <div
                                                style={{ color: "#ff9f9fff", marginLeft: "15px" }}>{`支出 - ￥${value.EXP}`}</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {!!this._data.details.length && this.renderDealsDetails(this._data)}
            </div>
        );
    }

    private renderDealsDetails(data: IFinancialData): React.ReactNode {
        return (
            <div>
                <div style={{ display: "flex", margin: "15px" }}>
                    <div style={{ marginRight: "15px" }}>{`交易详情`}</div>
                    <button
                        onClick={() => {
                            this._showDetails = !this._showDetails;
                            this.forceUpdate();
                        }}>
                        {this._showDetails ? "隐藏所有交易" : `显示所有交易（${data.details.length}个）`}
                    </button>
                </div>
                <div>
                    {this._showDetails && (
                        <div>
                            {data.details.map((value) => {
                                const date = new Date(value.date);
                                return (
                                    <div
                                        key={value.id.toString()}
                                        style={{
                                            background: value.valid ? "#c1fbc3ff" : "#6d6d6dff",
                                            margin: "10px",
                                            borderRadius: "10px",
                                        }}>
                                        <div style={{ display: "flex" }}>
                                            <div
                                                style={{
                                                    background: value.status ? "#00ff48aa" : "#868686aa",
                                                    color: "#6d6d6dff",
                                                    alignContent: "center",
                                                    width: "50px",
                                                    writingMode: "vertical-lr",
                                                    borderRadius: "10px 0 0 10px",
                                                    textAlign: "center",
                                                }}>
                                                {value.status ? "已入账" : "未入账"}
                                            </div>
                                            <div
                                                style={{
                                                    width: "50px",
                                                    alignContent: "center",
                                                    textOverflow: "clip",
                                                    overflowWrap: "anywhere",
                                                    padding: "5px",
                                                    textAlign: "center",
                                                }}>
                                                {(this._classify || [])[Number(value.classify) - 1]?.classify}
                                            </div>
                                            <div
                                                style={{
                                                    height: "auto",
                                                    width: "5px",
                                                    background: value.valid ? "#00ff48aa" : "#868686aa",
                                                    marginRight: "10px",
                                                }}></div>
                                            <div>
                                                <div
                                                    style={{
                                                        fontSize: "30px",
                                                        alignContent: "end",
                                                        color: "#6d6d6dff",
                                                        marginBottom: "5px",
                                                    }}>
                                                    {value.desc}
                                                </div>
                                                <div style={{ display: "flex", marginBottom: "5px" }}>
                                                    <div
                                                        style={{
                                                            fontSize: "20px",
                                                            alignContent: "center",
                                                        }}>{`￥${value.amount}`}</div>
                                                    <div
                                                        style={{
                                                            fontSize: "20px",
                                                            alignContent: "center",
                                                            marginLeft: "25px",
                                                        }}>{`${FINANCIAL_MAP[value.financialType] || ""}`}</div>
                                                </div>

                                                <div style={{ marginBottom: "5px" }}>{`${date.getFullYear()}-${
                                                    date.getMonth() + 1
                                                }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`}</div>
                                                <div style={{ marginBottom: "5px" }}>{`${value.accountSRC} ${
                                                    value.accountTAG ? `-> ${value.accountTAG}` : ""
                                                }`}</div>
                                                {value.invoice && <div style={{ marginBottom: "10px" }}>下载发票</div>}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    private refetchData(): void {
        this._first = false;
        this._fetching = true;
        this._data = undefined;
        this.forceUpdate();

        setTimeout(() => {
            void this.fetchDataFromRemote();
        }, 0);
    }

    private async fetchDataFromRemote(): Promise<void> {
        const [financialResponse, classifyResponse] = await Promise.all([
            await XHRLoader("POST", "/account-charging/account/api/v1/financial/get", {
                granularity: this.props.store.selecteWithThrow(FinancialPageStoreImpl.impl.getGranularity(this.props.parent)),
                details: this.props.store.selecteWithThrow(FinancialPageStoreImpl.impl.getShowDetails(this.props.parent)),
                target: this.props.store.selecteWithThrow(FinancialPageStoreImpl.impl.getTargetDate(this.props.parent)),
                ...this.props.store.selecteWithThrow(FinancialPageStoreImpl.impl.getDate(this.props.parent)),
            }).catch((err) => {
                Message.post(
                    TianyuShellUIMessageType.ERROR,
                    "",
                    `${err?.message}`,
                    "从/account/api/v1/financial/get获取数据失败",
                    [],
                );
                return { valid: false, data: undefined };
            }),
            await XHRLoader("POST", "/account-charging/account/api/v1/classify/read-classify?flat=true", {
                granularity: this.props.store.selecteWithThrow(FinancialPageStoreImpl.impl.getGranularity(this.props.parent)),
                details: this.props.store.selecteWithThrow(FinancialPageStoreImpl.impl.getShowDetails(this.props.parent)),
                ...this.props.store.selecteWithThrow(FinancialPageStoreImpl.impl.getDate(this.props.parent)),
            }).catch((err) => {
                Message.post(
                    TianyuShellUIMessageType.ERROR,
                    "",
                    `${err?.message}`,
                    "从/account/api/v1/classify/read-classify获取数据失败",
                    [],
                );
                return { valid: false, data: undefined };
            }),
        ]);

        this._data = financialResponse.valid ? financialResponse.data : undefined;
        this._classify = classifyResponse.valid ? classifyResponse.data : undefined;
        this._fetching = false;
        if (this._data && this._classify) {
            Message.post(TianyuShellUIMessageType.SUCCESS, "", `加载数据完成！`, "", []);
        }
        this.forceUpdate();
    }
}
