/** @format */

import { IReactState } from "@aitianyu.cn/tianyu-shell/react";

export interface IClassifyPageProperty {}

export interface IClassifyPageState extends IReactState {}

export interface IClassifyItem {
    id: number;
    classify: string;
    parent: number;
}
