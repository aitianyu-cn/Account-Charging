/** @format */

import React from "react";
import { XHRLoader } from "@aitianyu.cn/client-base";
import { IClassifyItem, IClassifyPageProperty, IClassifyPageState } from "../model/ClassifyPage.model";
import { ClassifyItem, IClassifyItemProp } from "../modules/ClassifyItem";

export class ClassifyPage extends React.Component<IClassifyPageProperty, IClassifyPageState> {
    // private _store: IStore;

    private data: IClassifyItemProp[];

    private _loaded: boolean;

    public constructor(props: IClassifyPageProperty) {
        super(props);

        this._loaded = false;
        this.data = [];
        // this._store = createStore();
    }

    public override render(): React.ReactNode {
        if (this._loaded) {
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
        return (
            <div style={{ userSelect: "none" }}>
                {this.data.map((item) => (
                    <ClassifyItem id={item.id} parent={item.parent} classify={item.classify} children={item.children} />
                ))}
            </div>
        );
    }

    private async loadData(): Promise<void> {
        const response = await XHRLoader("POST", "/account-charging/account/api/v1/classify/read-classify?flat=true");

        this.processData(response.data);
        setTimeout(() => {
            this._loaded = true;
            this.forceUpdate();
        }, 0);
    }

    private processData(src: IClassifyItem[]): void {
        const source_list: IClassifyItemProp[] = src.map((value) => {
            const node: IClassifyItemProp = {
                id: value.id,
                parent: value.parent,
                classify: value.classify,
                children: [],
            };
            if (value.parent === 0) {
                this.data.push(node);
            }

            return node;
        });

        source_list.forEach((value) => {
            if (value.parent !== 0) {
                const index = source_list.findIndex((parent) => parent.id === value.parent);
                source_list[index].children.push(value);
            }
        });
    }
}
