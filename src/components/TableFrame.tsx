import { createElement, ReactNode, ReactElement, CSSProperties } from "react";
import classNames from "classnames";
import { RenderAsEnum, PagingPositionEnum } from "typings/DynamicDataGridProps";
import { DynamicDataGridContainerProps } from "../../typings/DynamicDataGridProps";

interface TableFrameProps extends DynamicDataGridContainerProps {
    children: ReactNode;
    className: string;
    style?: CSSProperties | undefined;
    columnCount: number;
    renderAs: RenderAsEnum;
    pagingPosition: PagingPositionEnum;
    pagination: ReactNode;
    columnWidths: string[];
    handleSetColumnWidth: (index: number, width: number) => void;
}

export function TableFrame(props: TableFrameProps): ReactElement {
    const { children, className, style, pagingPosition, pagination, columnWidths } = props;
    console.log(columnWidths);

    const rowStyle = { gridTemplateColumns: columnWidths.join(" ") };

    return (
        <div className={classNames(className, "widget-dynamic-data-grid")} style={style}>
            <div className="table-header">
                {props.paging !== "none" && (pagingPosition === "top" || pagingPosition === "both") && pagination}
            </div>
            <div className="table" role="table">
                <div className="table-content" role="rowgroup" style={rowStyle}>
                    {children}
                </div>
            </div>
            <div className="table-footer">
                {props.paging !== "none" && (pagingPosition === "bottom" || pagingPosition === "both") && pagination}
            </div>
        </div>
    );
}
