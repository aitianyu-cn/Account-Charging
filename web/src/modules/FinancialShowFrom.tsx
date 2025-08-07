/** @format */

import { IStore, InstanceId, Unsubscribe } from "@aitianyu.cn/tianyu-store";
import React from "react";
import { FinancialPageStoreImpl } from "../store/FinancialPage.store.operations";
import { XHRLoader } from "@aitianyu.cn/client-base";
import { Message, TianyuShellUIMessageType } from "@aitianyu.cn/tianyu-shell/core";
import ReactEcharts from "echarts-for-react";
import { Row, Col } from "antd";
import { MapOfType } from "@aitianyu.cn/types";

export interface IFinancialShowFromProp {
    store: IStore;
    parent: InstanceId;
}

interface IFinancialData {
    count: number;
    amount: string;
    unmount: string;
    total: string;
    record: number;
    financial: {
        EXP: string;
        INC: string;
        unmount: {
            EXP: string;
            INC: string;
        };
    };
    accounts_map: {
        account: string;
        deal: number;
        EXP: string;
        INC: string;
        total: string;
        unmount: {
            EXP: string;
            INC: string;
            total: string;
        };
        amount: string;
    }[];
    details: IAccountChargeRecorder[];
    graphic: {
        count: {
            exp: number;
            inc: number;
        };
        classify: {
            exp: { classify: string; value: string; count: number }[];
            inc: { classify: string; value: string; count: number }[];
        };
    };
}

interface IAccountChargeRecorder {
    id: number;
    date: number;
    amount: string;
    invoice: string;
    invoiceDes: string;
    status: boolean;
    financialType: "EXP" | "INC" | "FIX" | "ARR" | "EAR" | "UIN";
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
    UIN: "还贷&退款",
};

export class FinancialShowFrom extends React.Component<IFinancialShowFromProp> {
    private _unsubscribeRefreshKey?: Unsubscribe;

    private _fetching: boolean;
    private _first: boolean;

    private _data?: IFinancialData = {
        amount: "2469.24",
        unmount: "-289.23",
        count: 65,
        total: "2180.01",
        record: 64,
        financial: {
            EXP: "31851.72",
            INC: "34320.96",
            unmount: {
                EXP: "289.23",
                INC: "0",
            },
        },
        accounts_map: [
            {
                account: "招商银行储蓄卡-2291",
                deal: 26,
                EXP: "31929.28",
                INC: "33863.08",
                total: "1933.8",
                unmount: {
                    EXP: "0",
                    INC: "0",
                    total: "0",
                },
                amount: "1933.8",
            },
            {
                account: "招商银行储蓄卡-7959",
                deal: 15,
                EXP: "337.98",
                INC: "342.38",
                total: "-284.83",
                unmount: {
                    EXP: "289.23",
                    INC: "0",
                    total: "-289.23",
                },
                amount: "4.4",
            },
            {
                account: "建设银行储蓄卡-0637",
                deal: 10,
                EXP: "125.51",
                INC: "644.33",
                total: "518.82",
                unmount: {
                    EXP: "0",
                    INC: "0",
                    total: "0",
                },
                amount: "518.82",
            },
            {
                account: "微信-姚森匀",
                deal: 6,
                EXP: "1100",
                INC: "1100",
                total: "0",
                unmount: {
                    EXP: "0",
                    INC: "0",
                    total: "0",
                },
                amount: "0",
            },
            {
                account: "支付宝-姚森匀",
                deal: 7,
                EXP: "598",
                INC: "600.21",
                total: "2.21",
                unmount: {
                    EXP: "0",
                    INC: "0",
                    total: "0",
                },
                amount: "2.21",
            },
            {
                account: "支付宝-龙丽娟",
                deal: 3,
                EXP: "72.25",
                INC: "79.49",
                total: "7.24",
                unmount: {
                    EXP: "0",
                    INC: "0",
                    total: "0",
                },
                amount: "7.24",
            },
            {
                account: "微信-龙丽娟",
                deal: 2,
                EXP: "0",
                INC: "2.77",
                total: "2.77",
                unmount: {
                    EXP: "0",
                    INC: "0",
                    total: "0",
                },
                amount: "2.77",
            },
        ],
        details: [],
        graphic: {
            count: {
                exp: 46,
                inc: 3,
            },
            classify: {
                exp: [
                    {
                        classify: "6",
                        value: "658.52",
                        count: 21,
                    },
                    {
                        classify: "7",
                        value: "600.27",
                        count: 8,
                    },
                    {
                        classify: "9",
                        value: "28800",
                        count: 2,
                    },
                    {
                        classify: "10",
                        value: "108.53",
                        count: 3,
                    },
                    {
                        classify: "12",
                        value: "0",
                        count: 0,
                    },
                    {
                        classify: "13",
                        value: "13.01",
                        count: 3,
                    },
                    {
                        classify: "16",
                        value: "9",
                        count: 1,
                    },
                    {
                        classify: "17",
                        value: "1488.54",
                        count: 4,
                    },
                    {
                        classify: "19",
                        value: "50",
                        count: 1,
                    },
                    {
                        classify: "24",
                        value: "73.1",
                        count: 2,
                    },
                    {
                        classify: "27",
                        value: "50.75",
                        count: 1,
                    },
                ],
                inc: [
                    {
                        classify: "6",
                        value: "0",
                        count: 0,
                    },
                    {
                        classify: "7",
                        value: "0",
                        count: 0,
                    },
                    {
                        classify: "9",
                        value: "0",
                        count: 0,
                    },
                    {
                        classify: "10",
                        value: "0",
                        count: 0,
                    },
                    {
                        classify: "12",
                        value: "3",
                        count: 3,
                    },
                    {
                        classify: "13",
                        value: "0",
                        count: 0,
                    },
                    {
                        classify: "16",
                        value: "0",
                        count: 0,
                    },
                    {
                        classify: "17",
                        value: "0",
                        count: 0,
                    },
                    {
                        classify: "19",
                        value: "0",
                        count: 0,
                    },
                    {
                        classify: "24",
                        value: "0",
                        count: 0,
                    },
                    {
                        classify: "27",
                        value: "0",
                        count: 0,
                    },
                ],
            },
        },
    };
    private _classify?: { classify: string; id: number; parent: number }[] = [
        { classify: "固定支出", id: 1, parent: 0 },
        { classify: "房贷", id: 2, parent: 1 },
        { classify: "车贷", id: 3, parent: 1 },
        { classify: "装修贷", id: 4, parent: 1 },
        { classify: "生活费", id: 5, parent: 0 },
        { classify: "餐饮", id: 6, parent: 5 },
        { classify: "出行", id: 7, parent: 5 },
        { classify: "养车", id: 8, parent: 5 },
        { classify: "房租", id: 9, parent: 1 },
        { classify: "服饰美容", id: 10, parent: 5 },
        { classify: "收入", id: 11, parent: 0 },
        { classify: "红包", id: 12, parent: 11 },
        { classify: "其他", id: 13, parent: 5 },
        { classify: "工资", id: 14, parent: 11 },
        { classify: "股票收益", id: 15, parent: 11 },
        { classify: "医药", id: 16, parent: 5 },
        { classify: "生活用品", id: 17, parent: 5 },
        { classify: "缴费", id: 18, parent: 5 },
        { classify: "电话费", id: 19, parent: 18 },
        { classify: "水费", id: 20, parent: 18 },
        { classify: "煤气费", id: 21, parent: 18 },
        { classify: "电费", id: 22, parent: 18 },
        { classify: "停车费", id: 23, parent: 18 },
        { classify: "云服务", id: 24, parent: 18 },
        { classify: "电子信息", id: 25, parent: 5 },
        { classify: "计算机相关", id: 26, parent: 25 },
        { classify: "移动设备", id: 27, parent: 25 },
        { classify: "游戏相关", id: 28, parent: 25 },
    ];

    private _showAccounts: boolean;
    private _showDetails: boolean;
    private _showGraphic: boolean;

    public constructor(prop: IFinancialShowFromProp) {
        super(prop);

        this._fetching = false;
        this._first = true;

        this._showAccounts = false;
        this._showDetails = false;
        this._showGraphic = false;
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
                        {`${this._data.total}￥`}
                    </div>
                </div>

                <div style={{ display: "flex", marginLeft: "15px", fontSize: "25px" }}>
                    <div>交易数：</div>
                    <div>{`${this._data.count} 个`}</div>
                </div>

                <div
                    style={{
                        display: "flex",
                        fontSize: "18px",
                        marginLeft: "15px",
                        marginTop: "15px",
                        marginBottom: "15px",
                    }}>
                    <div style={{ padding: "10px", color: "white", background: "black", borderRadius: "15px" }}>
                        <div style={{ fontSize: "25px" }}>已入账</div>
                        <div style={{ display: "flex" }}>
                            <div>支出：</div>
                            <div>{`￥${this._data.financial.EXP}`}</div>
                        </div>
                        <div style={{ display: "flex" }}>
                            <div>收入：</div>
                            <div>{`￥${this._data.financial.INC}`}</div>
                        </div>
                        <div style={{ display: "flex" }}>
                            <div>合计：</div>
                            <div>{`￥${this._data.amount}`}</div>
                        </div>
                    </div>

                    <div
                        style={{
                            color: "gray",
                            background: "lightgray",
                            marginLeft: "40px",
                            padding: "10px",
                            borderRadius: "15px",
                        }}>
                        <div style={{ fontSize: "25px" }}>未入账</div>
                        <div style={{ display: "flex" }}>
                            <div>支出：</div>
                            <div>{`￥${this._data.financial.unmount.EXP}`}</div>
                        </div>
                        <div style={{ display: "flex" }}>
                            <div>收入：</div>
                            <div>{`￥${this._data.financial.unmount.INC}`}</div>
                        </div>
                        <div style={{ display: "flex" }}>
                            <div>合计：</div>
                            <div>{`￥${this._data.unmount}`}</div>
                        </div>
                    </div>
                </div>

                <div style={{ display: "flex" }}>
                    <div style={{ display: "flex", margin: "15px" }}>
                        <div style={{ marginRight: "15px" }}>交易面板</div>
                        <div>
                            <button
                                onClick={() => {
                                    this._showGraphic = !this._showGraphic;
                                    this.forceUpdate();
                                }}>
                                {this._showGraphic ? "隐藏交易面板" : `显示交易面板`}
                            </button>
                        </div>
                    </div>
                </div>
                {!!this._showGraphic && this._data.graphic && (
                    <div style={{ display: "inline-flex", flexWrap: "wrap" }}>
                        {this.generateGraphicOptions(this._data.graphic).map((item) => {
                            return (
                                <div style={{ border: "lightgray", borderStyle: "solid", borderRadius: "30px", margin: "10px" }}>
                                    <div
                                        style={{
                                            textAlign: "center",
                                            marginBottom: "-30px",
                                            marginTop: "15px",
                                            color: "darkgray",
                                            fontSize: "20px",
                                        }}>
                                        {item.series.name}
                                    </div>
                                    <Row gutter={24}>
                                        <Col span={24}>
                                            <ReactEcharts
                                                option={item}
                                                style={{ margin: "25px", width: "500px", height: "500px" }}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                            );
                        })}
                    </div>
                )}
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
                    <div style={{ display: "inline-flex", flexWrap: "wrap" }}>
                        {this._data.accounts_map.map((value) => {
                            return (
                                <div
                                    key={value.account}
                                    style={{
                                        background: "#484848ff",
                                        margin: "10px",
                                        borderRadius: "10px",
                                        width: "max-content",
                                    }}>
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
                                        <div style={{ marginRight: "15px" }}>{`已入账：￥${value.amount}`}</div>
                                        <div style={{ display: "flex", fontSize: "15px", paddingBottom: "5px" }}>
                                            <div
                                                style={{ color: "#9fffaae2", marginLeft: "15px" }}>{`收入 + ￥${value.INC}`}</div>
                                            <div
                                                style={{ color: "#ff9f9fff", marginLeft: "15px" }}>{`支出 - ￥${value.EXP}`}</div>
                                        </div>
                                        <div style={{ marginRight: "15px" }}>{`未入账：￥${value.unmount.total}`}</div>
                                        <div style={{ display: "flex", fontSize: "15px", paddingBottom: "5px" }}>
                                            <div
                                                style={{
                                                    color: "#9fffaae2",
                                                    marginLeft: "15px",
                                                }}>{`收入 + ￥${value.unmount.INC}`}</div>
                                            <div
                                                style={{
                                                    color: "#ff9f9fff",
                                                    marginLeft: "15px",
                                                }}>{`支出 - ￥${value.unmount.EXP}`}</div>
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
                                                    color: value.valid ? "#6d6d6dff" : "white",
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
        this._classify = undefined;
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

    private generateGraphicOptions(src: {
        count: {
            exp: number;
            inc: number;
        };
        classify: {
            exp: { classify: string; value: string; count: number }[];
            inc: { classify: string; value: string; count: number }[];
        };
    }) {
        const exp_classifyList: string[] = [];
        const exp: { value: number; name: string; groupId: string; childGroupId: string }[] = [];
        const exp_count: { value: number; name: string; groupId: string; childGroupId: string }[] = [];

        for (const item of src.classify.exp) {
            const classify = (this._classify || []).find((value) => value.id === Number(item.classify));
            if (classify) {
                exp_classifyList.push(classify.classify);
                exp.push({
                    value: Number(item.value),
                    name: classify.classify,
                    groupId: this._classify?.[classify.parent].classify || "",
                    childGroupId: classify.classify,
                });
                exp_count.push({
                    value: item.count, //src.count.exp === 0 ? 0 : item.count / src.count.exp,
                    name: classify.classify,
                    groupId: this._classify?.[classify.parent].classify || "",
                    childGroupId: classify.classify,
                });
            }
        }

        const inc_classifyList: string[] = [];
        const inc: { value: number; name: string; groupId: string; childGroupId: string }[] = [];
        const inc_count: { value: number; name: string; groupId: string; childGroupId: string }[] = [];

        for (const item of src.classify.inc) {
            const classify = (this._classify || []).find((value) => value.id === Number(item.classify));
            if (classify) {
                inc_classifyList.push(classify.classify);
                inc.push({
                    value: Number(item.value),
                    name: classify.classify,
                    groupId: this._classify?.[classify.parent].classify || "",
                    childGroupId: classify.classify,
                });
                inc_count.push({
                    value: src.count.inc === 0 ? 0 : item.count / src.count.inc,
                    name: classify.classify,
                    groupId: this._classify?.[classify.parent].classify || "",
                    childGroupId: classify.classify,
                });
            }
        }

        const tooltip = {
            trigger: "item",
        };
        const legend = {
            left: 10,
            top: 30,
            textStype: {
                fontSize: 13,
                color: "#FFFFFF",
            },
            data: exp_classifyList,
        };
        const fnGenerateSeries = (
            title: string,
            data: { value: number; name: string; groupId: string; childGroupId: string }[],
            unit: string,
        ) => {
            return {
                data,
                name: title,
                type: "pie",
                radius: "50%",
                center: ["50%", "50%"],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: "rgba(0,0,0,0.5)",
                    },
                },
                labelLine: {
                    show: false,
                },
                label: {
                    show: false,
                    position: "center",
                },
                tooltip: {
                    formatter: `{b}: {c} ${unit}<br/>占比: {d}%`,
                },
            };
        };

        return [
            { tooltip, legend, series: fnGenerateSeries("支出金额占比", exp, "元") },
            { tooltip, legend, series: fnGenerateSeries("支出交易占比", exp_count, "笔") },
            { tooltip, legend, series: fnGenerateSeries("收入金额占比", inc, "元") },
            { tooltip, legend, series: fnGenerateSeries("收入交易占比", inc_count, "笔") },
        ];
    }
}
