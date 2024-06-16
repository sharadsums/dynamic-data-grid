import React, { ReactElement, ReactNode, createElement } from "react";
import { ObjectItem } from "mendix";
import { Header } from "./Header"; // Import Header component
import { DynamicDataGridContainerProps } from "../../typings/DynamicDataGridProps";

interface HeadersProps extends DynamicDataGridContainerProps {
    columnWidths: string[];
    handleSetColumnWidth: (index: number, width: number) => void;
    resizable: boolean;
}

function getHeaderValue(column: ObjectItem, props: DynamicDataGridContainerProps): ReactNode {
    const { headerAttribute, headerWidgets, headerTextTemplate, showHeaderAs } = props;
    let value: ReactNode = "";

    if (!column) {
        return "\u00A0";
    }
    if (showHeaderAs === "attribute") {
        value = headerAttribute?.get(column)?.displayValue ?? "\u00A0";
    } else if (showHeaderAs === "dynamicText") {
        value = headerTextTemplate?.get(column)?.value ?? "\u00A0";
    } else if (showHeaderAs === "custom") {
        value = headerWidgets.get(column);
    } else {
        value = "n/a";
    }

    return value;
}

export function Headers(props: HeadersProps): ReactElement {
    const { dataSourceColumn, showRowAs, showRowColumnNameAs, rowColumnNameWidgets } = props;
    const { columnClass, onClickColumnHeader, onClickColumn, rowColumnNameTextTemplate, renderAs } = props;

    const headers =
        dataSourceColumn.items?.map((column, index) => {
            const onClick =
                column && onClickColumnHeader
                    ? (): void => onClickColumnHeader?.get(column).execute()
                    : onClickColumn
                    ? (): void => onClickColumn?.get(column).execute()
                    : undefined;
            return (
                <Header
                    className={columnClass?.get(column).value ?? ""}
                    onClick={onClick}
                    key={column.id}
                    renderAs={renderAs}
                    columnWidths={props.columnWidths}
                    index={index}
                    handleSetColumnWidth={props.handleSetColumnWidth}
                    resizable={props.resizable}
                >
                    {getHeaderValue(column, props)}
                </Header>
            );
        }) ?? [];

    if (showRowAs !== "none") {
        const columnName =
            showRowColumnNameAs === "dynamicText" ? rowColumnNameTextTemplate?.value ?? "" : rowColumnNameWidgets;
        headers?.unshift(
            <Header
                key="row_header"
                renderAs={renderAs}
                columnWidths={props.columnWidths}
                index={-1}
                handleSetColumnWidth={props.handleSetColumnWidth}
                resizable={false}
            >
                {columnName}
            </Header>
        );
    }
    return <React.Fragment> {headers}</React.Fragment>;
}
