/** @format */

import { InstanceId, IStore, Missing, Unsubscribe } from "@aitianyu.cn/tianyu-store";
import { guid } from "@aitianyu.cn/types";
import React from "react";
import { FinancialPageStoreImpl } from "../store/FinancialPage.store.operations";

const MonthDayMap: any = {
    "1": 31,
    "2": 28,
    "3": 31,
    "4": 30,
    "5": 31,
    "6": 30,
    "7": 31,
    "8": 31,
    "9": 30,
    "10": 31,
    "11": 30,
    "12": 31,
};

function isLeapYear(year: number): boolean {
    return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);
}

export interface IFinancialSearchFormProp {
    store: IStore;
    parent: InstanceId;
}

export class FinancialSearchForm extends React.Component<IFinancialSearchFormProp> {
    private _id: string;
    private _unsubscribeGranularity?: Unsubscribe;
    private _unsubscribeDate?: Unsubscribe;
    private _unsubscribeDetails?: Unsubscribe;
    private _unsubscribeEnableEnding?: Unsubscribe;

    public constructor(props: IFinancialSearchFormProp) {
        super(props);

        this._id = guid();
    }

    public override componentDidMount(): void {
        this._unsubscribeGranularity = this.props.store.subscribe(
            FinancialPageStoreImpl.impl.getGranularity(this.props.parent),
            () => {
                this.forceUpdate();
            },
        );
        this._unsubscribeDate = this.props.store.subscribe(FinancialPageStoreImpl.impl.getAllDate(this.props.parent), () => {
            this.forceUpdate();
        });
        this._unsubscribeDetails = this.props.store.subscribe(
            FinancialPageStoreImpl.impl.getShowDetails(this.props.parent),
            () => {
                this.forceUpdate();
            },
        );
        this._unsubscribeEnableEnding = this.props.store.subscribe(
            FinancialPageStoreImpl.impl.getTargetDateEnable(this.props.parent),
            () => {
                this.forceUpdate();
            },
        );
    }

    public override componentWillUnmount(): void {
        this._unsubscribeGranularity?.();
        this._unsubscribeDate?.();
        this._unsubscribeDetails?.();
        this._unsubscribeEnableEnding?.();
    }

    public override render(): React.ReactNode {
        const granularity = this.props.store.selecte(FinancialPageStoreImpl.impl.getGranularity(this.props.parent));
        const details = this.props.store.selecte(FinancialPageStoreImpl.impl.getShowDetails(this.props.parent));
        const endDateEnabled =
            this.props.store.selecte(FinancialPageStoreImpl.impl.getTargetDateEnable(this.props.parent)) === true;

        return (
            <div style={{ display: "flex" }}>
                <button
                    style={{
                        width: "80px",
                        height: "80px",
                        marginTop: "auto",
                        marginBottom: "auto",
                        marginLeft: "10px",
                        marginRight: "10px",
                        fontSize: "20px",
                        borderRadius: "15px",
                    }}
                    onClick={() => {
                        this.props.store.dispatch(FinancialPageStoreImpl.impl.refresh(this.props.parent));
                    }}>
                    刷新
                </button>
                <form style={{ marginTop: "auto", marginBottom: "auto" }}>
                    <div style={{ display: "flex", fontSize: "15px", margin: "10px" }}>
                        <section style={{ display: "flex", marginRight: "15px" }}>
                            <div style={{ marginRight: "15px" }}>查询周期</div>
                            <select
                                style={{
                                    width: "200px",
                                    height: "30px",
                                    fontSize: "15px",
                                }}
                                defaultValue={granularity instanceof Missing ? "" : granularity}
                                onChange={(event) => {
                                    this.props.store.dispatch(
                                        FinancialPageStoreImpl.impl.setGranularity(this.props.parent, event.target.value as any),
                                    );
                                }}>
                                <option style={{ fontSize: "15px" }} value="year">
                                    年
                                </option>
                                <option style={{ fontSize: "15px" }} value="half-year">
                                    半年
                                </option>
                                <option style={{ fontSize: "15px" }} value="month">
                                    月
                                </option>
                                <option style={{ fontSize: "15px" }} value="day">
                                    天
                                </option>
                            </select>
                        </section>

                        {granularity === "day" && (
                            <section style={{ display: "flex" }}>
                                <div style={{ marginRight: "15px" }}>显示账目详情</div>
                                <input
                                    type="checkbox"
                                    checked={details === true}
                                    onChange={() => {
                                        this.props.store.dispatch(FinancialPageStoreImpl.impl.toggleDetails(this.props.parent));
                                    }}
                                />
                            </section>
                        )}
                    </div>

                    <section style={{ display: "flex", margin: "10px" }}>
                        <div style={{ marginRight: "15px" }}>开始日期</div>
                        {this.renderDatePicker(granularity instanceof Missing ? "year" : granularity)}
                    </section>
                    <section style={{ display: "flex", fontSize: "15px", margin: "10px" }}>
                        <div style={{ marginRight: "15px" }}>自定义结束日期</div>
                        <input
                            type="checkbox"
                            checked={endDateEnabled}
                            onChange={() => {
                                this.props.store.dispatch(FinancialPageStoreImpl.impl.toggleTargetEnablement(this.props.parent));
                            }}
                        />
                    </section>
                    <section style={{ display: "flex", margin: "10px" }}>
                        <div style={{ marginRight: "15px" }}>结束日期</div>
                        {this.renderEndDatePicker(granularity instanceof Missing ? "year" : granularity, endDateEnabled)}
                    </section>
                </form>
            </div>
        );
    }

    private renderDatePicker(granularity: "year" | "half-year" | "month" | "day"): React.ReactNode {
        const dateOrMissing = this.props.store.selecte(FinancialPageStoreImpl.impl.getDate(this.props.parent));
        const date = dateOrMissing instanceof Missing ? { year: new Date().getFullYear(), month: 1, day: 1 } : dateOrMissing;
        return (
            <div style={{ display: "flex" }}>
                <div>
                    <select
                        style={{ width: "100px", height: "30px", fontSize: "15px", marginRight: "10px" }}
                        defaultValue={date.year}
                        onChange={(event) => {
                            this.props.store.dispatch(
                                FinancialPageStoreImpl.impl.setYear(this.props.parent, Number(event.target.value)),
                            );
                        }}>
                        {this.generateYearsOption()}
                    </select>
                </div>
                {granularity !== "year" && (
                    <div>
                        <select
                            style={{ width: "100px", height: "30px", fontSize: "15px", marginRight: "10px" }}
                            defaultValue={date.month}
                            onChange={(event) => {
                                this.props.store.dispatch(
                                    FinancialPageStoreImpl.impl.setMonth(this.props.parent, Number(event.target.value)),
                                );
                            }}>
                            {this.generateMonth(granularity)}
                        </select>
                    </div>
                )}

                {granularity === "day" && (
                    <div>
                        <select
                            style={{ width: "100px", height: "30px", fontSize: "15px" }}
                            defaultValue={date.day}
                            onChange={(event) => {
                                this.props.store.dispatch(
                                    FinancialPageStoreImpl.impl.setDay(this.props.parent, Number(event.target.value)),
                                );
                            }}>
                            {this.generateDayOption(date.year, date.month.toString())}
                        </select>
                    </div>
                )}
            </div>
        );
    }

    private renderEndDatePicker(granularity: "year" | "half-year" | "month" | "day", enabled: boolean): React.ReactNode {
        const date = this.props.store.selecteWithThrow(FinancialPageStoreImpl.impl.getTargetDate(this.props.parent));
        const startDate = this.props.store.selecteWithThrow(FinancialPageStoreImpl.impl.getDate(this.props.parent));
        return (
            <div style={{ display: "flex" }}>
                <div>
                    <select
                        disabled={!enabled}
                        style={{ width: "100px", height: "30px", fontSize: "15px", marginRight: "10px" }}
                        value={date.year}
                        onChange={(event) => {
                            this.props.store.dispatch(
                                FinancialPageStoreImpl.impl.setTargetYear(this.props.parent, Number(event.target.value)),
                            );
                        }}>
                        {this.generateYearsOption(startDate.year)}
                    </select>
                </div>
                {granularity !== "year" && (
                    <div>
                        <select
                            disabled={!enabled}
                            style={{ width: "100px", height: "30px", fontSize: "15px", marginRight: "10px" }}
                            value={date.month}
                            onChange={(event) => {
                                this.props.store.dispatch(
                                    FinancialPageStoreImpl.impl.setTargetMonth(this.props.parent, Number(event.target.value)),
                                );
                            }}>
                            {this.generateMonth(granularity, startDate.year === date.year ? startDate.month : 1)}
                        </select>
                    </div>
                )}

                {granularity === "day" && (
                    <div>
                        <select
                            disabled={!enabled}
                            style={{ width: "100px", height: "30px", fontSize: "15px" }}
                            value={date.day}
                            onChange={(event) => {
                                this.props.store.dispatch(
                                    FinancialPageStoreImpl.impl.setTargetDay(this.props.parent, Number(event.target.value)),
                                );
                            }}>
                            {this.generateDayOption(
                                date.year,
                                date.month.toString(),
                                startDate.year === date.year && startDate.month === date.month ? startDate.day : 1,
                            )}
                        </select>
                    </div>
                )}
            </div>
        );
    }

    private generateYearsOption(sYear = 2025): React.ReactNode {
        const nodes: React.ReactNode[] = [];
        const endYear = new Date().getFullYear();
        let startYear = sYear;
        do {
            nodes.push(
                <option style={{ fontSize: "15px" }} value={startYear.toString()}>
                    {startYear}
                </option>,
            );
            startYear++;
        } while (startYear <= endYear);
        return nodes;
    }

    private generateMonth(granularity: "year" | "half-year" | "month" | "day", startMonth = 1): React.ReactNode {
        const nodes: React.ReactNode[] = [];
        if (granularity === "half-year") {
            nodes.push(
                <option style={{ fontSize: "15px" }} value={"1"}>
                    上半年
                </option>,
            );
            nodes.push(
                <option style={{ fontSize: "15px" }} value={"2"}>
                    下半年
                </option>,
            );
        } else {
            for (let i = 1; i <= 12; ++i) {
                nodes.push(
                    <option disabled={i < startMonth} style={{ fontSize: "15px" }} value={i.toString()}>
                        {i}
                    </option>,
                );
            }
        }
        return nodes;
    }

    private generateDayOption(year: number, month: string, startDay = 1): React.ReactNode {
        const nodes: React.ReactNode[] = [];
        const days = (MonthDayMap[month] ?? 0) + (isLeapYear(year) ? 1 : 0);
        for (let i = 1; i <= days; ++i) {
            nodes.push(
                <option disabled={i < startDay} style={{ fontSize: "15px" }} value={i.toString()}>
                    {i}
                </option>,
            );
        }
        return nodes;
    }
}
