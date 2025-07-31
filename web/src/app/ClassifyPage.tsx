/** @format */

import React from "react";
import { TianyuElement } from "@aitianyu.cn/tianyu-shell-react";
// import { IStore, createStore } from "@aitianyu.cn/tianyu-store";
import { MapOfType } from "@aitianyu.cn/types";
import { XHRLoader } from "@aitianyu.cn/client-base";
import { IClassifyItem, IClassifyPageProperty, IClassifyPageState } from "../model/ClassifyPage.model";

export class ClassifyPage extends TianyuElement<IClassifyPageProperty, IClassifyPageState> {
    // private _store: IStore;

    private data: MapOfType<IClassifyItem>;

    public constructor(props: IClassifyPageProperty) {
        super("classify-page", props);

        this.data = {};
        // this._store = createStore();
    }

    public override render(): React.ReactNode {
        if (this.isLoaded()) {
            return this.renderForDone();
        }

        void this.loadData();
        return this.renderForLoading();
    }

    private renderForLoading(): React.ReactNode {
        return (
            <div>
                <h1>数据加载中...</h1>
            </div>
        );
    }

    private renderForDone(): React.ReactNode {
        return <div>{JSON.stringify(this.data)}</div>;
    }

    private async loadData(): Promise<void> {
        const response = await XHRLoader("POST", "/account-charging/account/api/v1/classify/read-classify");
        this.data = response.data;
        this.setLoaded();
    }
}
