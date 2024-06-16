import { ReactNode, ReactElement, createElement } from "react";
import classNames from "classnames";
import { RenderAsEnum } from "typings/DynamicDataGridProps";
import { ColumnResizer } from "./ColumnResizer";

interface HeaderProps {
    children: ReactNode;
    className?: string;
    key: string;
    onClick?: () => void;
    renderAs: RenderAsEnum;
    columnWidths: string[];
    index: number;
    handleSetColumnWidth: (index: number, width: number) => void;
    resizable: boolean;
}

export function Header(props: HeaderProps): ReactElement {
    if (props.renderAs === "grid") {
        return (
            <div
                className={classNames("th", props.className, { clickable: !!props.onClick })}
                role="columnheader"
                key={props.key}
                onClick={props.onClick}
                style={{ width: props.columnWidths[props.index] }}
            >
                <div className="column-container">
                    <div className="column-header align-column-left">{props.children}</div>
                    {props.resizable && (
                        <ColumnResizer
                            minWidth={50}
                            setColumnWidth={newWidth => props.handleSetColumnWidth(props.index, newWidth)}
                        />
                    )}
                </div>
            </div>
        );
    }
    return (
        <th
            className={classNames(props.className, { clickable: !!props.onClick })}
            key={props.key}
            onClick={props.onClick}
        >
            {props.children}
        </th>
    );
}
