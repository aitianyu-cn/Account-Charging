/** @format */

import { IReactProperty, IReactState } from "@aitianyu.cn/tianyu-shell/react";

export interface IClassifyPageProperty extends IReactProperty {}

export interface IClassifyPageState extends IReactState {}

export interface IClassifyItem {
    id: number;
    parent: number;
}
