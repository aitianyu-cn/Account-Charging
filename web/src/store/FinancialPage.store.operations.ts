/** @format */

import { ActionFactor, ITianyuStoreInterface, SelectorFactor, StoreUtils } from "@aitianyu.cn/tianyu-store";
import { IFinancialPageStoreModel } from "./FinancialPage.store.model";
import { guid } from "@aitianyu.cn/types";

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
const GetShowDetailsSelector = SelectorFactor.makeSelector((state: IFinancialPageStoreModel) => {
    return state.details && state.granularity === "day";
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

        setYear: ActionFactor.makeActionCreator<IFinancialPageStoreModel, number>().withReducer((state, data) => {
            return StoreUtils.State.getNewState(state, ["year"], data);
        }),
        setMonth: ActionFactor.makeActionCreator<IFinancialPageStoreModel, number>().withReducer((state, data) => {
            return StoreUtils.State.getNewState(state, ["month"], data);
        }),
        setDay: ActionFactor.makeActionCreator<IFinancialPageStoreModel, number>().withReducer((state, data) => {
            return StoreUtils.State.getNewState(state, ["day"], data);
        }),

        toggleDetails: ActionFactor.makeActionCreator<IFinancialPageStoreModel>().withReducer((state) => {
            return StoreUtils.State.getNewState(state, ["details"], !state.details);
        }),

        getDate: GetDateSelector,
        getShowDetails: GetShowDetailsSelector,
        getRefreshKey: SelectorFactor.makeSelector((state: IFinancialPageStoreModel) => {
            return state.refreshKey;
        }),

        refresh: ActionFactor.makeActionCreator<IFinancialPageStoreModel>().withReducer((state) => {
            return StoreUtils.State.getNewState(state, ["refreshKey"], guid());
        }),
    },
};

FinancialPageStoreImpl as ITianyuStoreInterface<IFinancialPageStoreModel>;
