/** @format */

import React from "react";

export interface IClassifyItemProp {
    id: number;
    classify: string;
    parent: number;
    children: IClassifyItemProp[];
}

export class ClassifyItem extends React.Component<IClassifyItemProp> {
    public constructor(prop: IClassifyItemProp) {
        super(prop);
    }

    public override render(): React.ReactNode {
        return (
            <div
                key={this.props.id}
                style={{
                    paddingLeft: "40px",
                    marginTop: "5px",
                    marginBottom: "5px",
                    borderRadius: "5px",
                    width: "auto",
                    maxWidth: "300px",
                }}>
                <div
                    style={{
                        borderRadius: "5px",
                        height: "35px",
                        background: "#a3a3a3ff",
                        color: "#000000ff",
                        alignContent: "center",
                        padding: "10px",
                    }}>
                    {this.props.classify}
                </div>
                <div>
                    {this.props.children.map((child) => (
                        <ClassifyItem id={child.id} parent={child.parent} classify={child.classify} children={child.children} />
                    ))}
                </div>
            </div>
        );
    }
}
