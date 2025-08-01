/** @format */

import { createStore, InstanceId, IStore, StoreHelper, TianyuStoreEntityInterfaceExpose } from "@aitianyu.cn/tianyu-store";
import React from "react";
import { FinancialPageStoreImpl } from "../store/FinancialPage.store.operations";
import { FinancialSearchForm } from "../modules/FinancialSearchForm";
import { FinancialShowFrom } from "../modules/FinancialShowFrom";

export class GetFinancialPage extends React.Component {
    private _store: IStore;
    private _instance: InstanceId;

    private _loaded: boolean;
    private _initStorePromise: Promise<void>;

    public constructor(props: {}) {
        super(props);

        const rootIns = StoreHelper.generateStoreInstanceId();

        this._loaded = false;
        this._store = createStore();
        this._instance = StoreHelper.generateInstanceId(rootIns, "financial-page", "financial-page");

        this._store.registerInterface("financial-page", FinancialPageStoreImpl);
        this._initStorePromise = this._store.dispatch(
            TianyuStoreEntityInterfaceExpose["tianyu-store-entity-core"].core.creator(rootIns),
        );
    }

    public override componentDidMount(): void {
        this._initStorePromise.then(() => {
            this._store.dispatch(FinancialPageStoreImpl.core.creator(this._instance, undefined)).then(() => {
                this._loaded = true;
                this.forceUpdate();
            });
        });
    }

    public override componentWillUnmount(): void {
        this._store.dispatch(FinancialPageStoreImpl.core.destroy(this._instance));
        this._loaded = false;
    }

    public override render(): React.ReactNode {
        if (!this._loaded) {
            return <div></div>;
        }

        return (
            <div style={{ height: "100%" }}>
                <div style={{ boxShadow: "0px 5px 5px 0px rgba(67, 67, 67, 0.37)", height: "max-content", position: "sticky" }}>
                    <div
                        style={{
                            paddingBottom: "5px",
                            width: "85%",
                            height: "max-content",
                            marginBottom: "auto",
                            marginTop: "auto",
                            marginLeft: "auto",
                            marginRight: "auto",
                        }}>
                        <FinancialSearchForm store={this._store} parent={this._instance} />
                    </div>
                    <div style={{ height: "1px" }}></div>
                </div>
                <div
                    style={{
                        height: "calc(100vh - 100px)",
                        width: "85%",
                        overflowY: "auto",
                        paddingTop: "10px",
                        marginLeft: "auto",
                        marginRight: "auto",
                    }}>
                    <FinancialShowFrom store={this._store} parent={this._instance} />
                </div>
            </div>
        );
    }
}
