/** @format */

import { ActionFactor, ITianyuStoreInterface, SelectorFactor, StoreUtils } from "@aitianyu.cn/tianyu-store";
import { IFinancialPageStoreModel } from "./FinancialPage.store.model";
import { guid, ObjectHelper } from "@aitianyu.cn/types";

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

const GetGranularitySelector = SelectorFactor.makeSelector((state: IFinancialPageStoreModel) => {
    return state.granularity;
});
const GetDateSelector = SelectorFactor.makeSelector((state: IFinancialPageStoreModel) => {
    return {
        year: state.year,
        month: state.month,
        day: state.day,
    } as { year: number; month: number; day: number };
});
const GetTargetDateSelector = SelectorFactor.makeSelector((state: IFinancialPageStoreModel) => {
    return state.target.enable
        ? ({
              year: state.target.year,
              month: state.target.month,
              day: state.target.day,
          } as { year: number; month: number; day: number })
        : ({
              year: state.year,
              month: state.month,
              day: state.day,
          } as { year: number; month: number; day: number });
});
const GetShowDetailsSelector = SelectorFactor.makeSelector((state: IFinancialPageStoreModel) => {
    return state.details && state.granularity === "day";
});
const GetEnableTargetDateSelector = SelectorFactor.makeSelector((state: IFinancialPageStoreModel) => {
    return state.target.enable;
});

const SetDayAction = ActionFactor.makeActionCreator<IFinancialPageStoreModel, number>()
    .withHandler(function* ({ instanceId, params }) {
        const date = yield* StoreUtils.Handler.doSelectorWithThrow(GetDateSelector(instanceId));
        yield* StoreUtils.Handler.doAction(
            HandleTargetYearAction(instanceId, {
                year: date.year,
                month: date.month,
                day: params,
            }),
        );
        return params;
    })
    .withReducer((state, data) => {
        return StoreUtils.State.getNewState(state, ["day"], data);
    });

const SetTargetYearAction = ActionFactor.makeActionCreator<IFinancialPageStoreModel, number>().withReducer((state, data) => {
    return StoreUtils.State.getNewState(state, ["target", "year"], data);
});
const SetTargetMonthAction = ActionFactor.makeActionCreator<IFinancialPageStoreModel, number>().withReducer((state, data) => {
    return StoreUtils.State.getNewState(state, ["target", "month"], data);
});
const SetTargetDayAction = ActionFactor.makeActionCreator<IFinancialPageStoreModel, number>().withReducer((state, data) => {
    return StoreUtils.State.getNewState(state, ["target", "day"], data);
});

const HandleTargetYearAction = ActionFactor.makeActionCreator<
    IFinancialPageStoreModel,
    { year: number; month: number; day: number }
>().withHandler(function* ({ instanceId, params: { year, month, day } }) {
    const targetDate = yield* StoreUtils.Handler.doSelectorWithThrow(GetTargetDateSelector(instanceId));
    const startDate = year * 10000 + month * 100 + day;
    const endDate = targetDate.year * 10000 + targetDate.month * 100 + targetDate.day;
    if (startDate > endDate) {
        yield* StoreUtils.Handler.doAction(SetTargetYearAction(instanceId, year));
        yield* StoreUtils.Handler.doAction(SetTargetMonthAction(instanceId, month));
        yield* StoreUtils.Handler.doAction(SetTargetDayAction(instanceId, day));
    }
});

export const FinancialPageStoreImpl = {
    core: {
        creator: ActionFactor.makeCreateStoreAction<IFinancialPageStoreModel>().withReducer(() => {
            const now = new Date();
            const state: IFinancialPageStoreModel = {
                granularity: "year",
                year: now.getFullYear(),
                month: now.getMonth() + 1,
                day: now.getDate(),
                details: true,

                target: {
                    enable: false,
                    year: now.getFullYear(),
                    month: now.getMonth() + 1,
                    day: now.getDate(),
                },

                refreshKey: guid(),
            };
            return state;
        }),
        destroy: ActionFactor.makeDestroyStoreAction(),
    },
    impl: {
        setGranularity: ActionFactor.makeActionCreator<
            IFinancialPageStoreModel,
            "year" | "half-year" | "month" | "day"
        >().withReducer((state, data) => {
            return StoreUtils.State.getNewState(state, ["granularity"], data);
        }),
        getGranularity: GetGranularitySelector,

        setYear: ActionFactor.makeActionCreator<IFinancialPageStoreModel, number>()
            .withHandler(function* ({ instanceId, params }) {
                const date = yield* StoreUtils.Handler.doSelectorWithThrow(GetDateSelector(instanceId));
                let newDay = date.day;
                if (date.month === 2 && date.day === 29 && !isLeapYear(params)) {
                    yield* StoreUtils.Handler.doAction(SetDayAction(instanceId, 28));
                    newDay = 28;
                }

                yield* StoreUtils.Handler.doAction(
                    HandleTargetYearAction(instanceId, {
                        year: params,
                        month: date.month,
                        day: newDay,
                    }),
                );
                return params;
            })
            .withReducer((state, data) => {
                return StoreUtils.State.getNewState(state, ["year"], data);
            }),
        setMonth: ActionFactor.makeActionCreator<IFinancialPageStoreModel, number>()
            .withHandler(function* ({ instanceId, params }) {
                const date = yield* StoreUtils.Handler.doSelectorWithThrow(GetDateSelector(instanceId));
                const maxDays = MonthDayMap[date.month.toString()];
                let newDay = date.day;
                if (date.day > maxDays) {
                    yield* StoreUtils.Handler.doAction(SetDayAction(instanceId, maxDays));
                    newDay = maxDays;
                }

                yield* StoreUtils.Handler.doAction(
                    HandleTargetYearAction(instanceId, {
                        year: date.year,
                        month: params,
                        day: newDay,
                    }),
                );
                return params;
            })
            .withReducer((state, data) => {
                return StoreUtils.State.getNewState(state, ["month"], data);
            }),
        setDay: SetDayAction,

        toggleDetails: ActionFactor.makeActionCreator<IFinancialPageStoreModel>().withReducer((state) => {
            return StoreUtils.State.getNewState(state, ["details"], !state.details);
        }),

        setTargetYear: SetTargetYearAction,
        setTargetMonth: SetTargetMonthAction,
        setTargetDay: SetTargetDayAction,

        toggleTargetEnablement: ActionFactor.makeActionCreator<IFinancialPageStoreModel>().withReducer((state) => {
            return StoreUtils.State.getNewState(state, ["target", "enable"], !state.target.enable);
        }),

        getDate: GetDateSelector,
        getTargetDate: GetTargetDateSelector,
        getTargetDateEnable: GetEnableTargetDateSelector,
        getShowDetails: GetShowDetailsSelector,
        getRefreshKey: SelectorFactor.makeSelector((state: IFinancialPageStoreModel) => {
            return state.refreshKey;
        }),
        getAllDate: SelectorFactor.makeSelector((state: IFinancialPageStoreModel) => {
            return {
                start: {
                    year: state.year,
                    month: state.month,
                    day: state.day,
                },
                end: {
                    year: state.target.year,
                    month: state.target.month,
                    day: state.target.day,
                },
            };
        }),

        refresh: ActionFactor.makeActionCreator<IFinancialPageStoreModel>().withReducer((state) => {
            return StoreUtils.State.getNewState(state, ["refreshKey"], guid());
        }),
    },

    internal: {
        _handleTarget: HandleTargetYearAction,
    },
};

FinancialPageStoreImpl as ITianyuStoreInterface<IFinancialPageStoreModel>;
