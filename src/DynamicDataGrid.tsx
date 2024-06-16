import { ReactElement, createElement, useCallback, useEffect, useState } from "react";
import classNames from "classnames";

import { Headers } from "./components/Headers";
import { Row } from "./components/Row";
import { TableFrame } from "./components/TableFrame";
import { EmptyPlaceholder } from "./components/EmptyPlaceholder";
import { Cells } from "./components/Cells";
import { Pagination } from "./components/Pagination";
import { DynamicDataGridContainerProps } from "../typings/DynamicDataGridProps";

import "./ui/DynamicDataGrid.css";

export default function DynamicDataGrid(props: DynamicDataGridContainerProps): ReactElement {
    const { style, dataSourceColumn, dataSourceRow, showRowAs, rowClass, renderAs, showHeaderAs } = props;
    const rows = dataSourceRow.items ?? [];
    const pageSize = props.pageSizeType === "dynamic" ? Number(props.dynamicPageSize?.value ?? 10) : props.pageSize;

    const currentPage =
        props.paging === "row" ? props.dataSourceRow.offset / pageSize : props.dataSourceColumn.offset / pageSize;
    const [loading, setLoading] = useState(true);

    const columnCount = dataSourceColumn.items?.length || 0;
    const [columnWidths, setColumnWidths] = useState(Array(columnCount).fill("1fr"));
    const [sortedData, setSortedData] = useState(rows);

    const handleSetColumnWidth = (index: number, width: number) => {
        const newWidths = [...columnWidths];
        newWidths[index] = `${width}px`; // Update the specific column width
        setColumnWidths(newWidths);
    };

    useEffect(() => {
        if (props.dataSourceCell.status === "available" && props.dataSourceCell.limit !== 0) {
            setLoading(false);
        }
    }, [props.dataSourceCell]);
    useEffect(() => {
        props.dataSourceRow.requestTotalCount(true);
        if (props.paging === "row") {
            if (props.pageSizeType === "dynamic") {
                props.dataSourceRow.setOffset(0);
                props.dataSourceRow.setLimit(pageSize);
            }
        }
    }, [pageSize]);

    useEffect(() => {
        if (props.paging === "row") {
            props.dataSourceRow.requestTotalCount(true);
            if (props.dataSourceRow.limit === Number.POSITIVE_INFINITY) {
                props.dataSourceRow.setLimit(pageSize);
            }
        }
        if (props.paging === "column") {
            props.dataSourceColumn.requestTotalCount(true);
            if (props.dataSourceColumn.limit === Number.POSITIVE_INFINITY) {
                props.dataSourceColumn.setLimit(pageSize);
            }
        }
    }, [props.dataSourceRow, props.dataSourceColumn, props.paging]);
    useEffect(() => {
        const length =
            props.paging === "row" ? props.dataSourceColumn.items?.length ?? 0 : props.dataSourceRow.items?.length ?? 0;
        const limit = pageSize * length;
        if (props.pageCell && props.dataSourceCell.limit !== limit) {
            props.dataSourceCell.setLimit(limit);
        }
    }, [props.dataSourceCell, props.dataSourceColumn, pageSize, props.pageCell, props.paging, props.dataSourceRow]);

    useEffect(() => {
        setColumnWidths(Array(columnCount).fill("1fr"));
    }, [columnCount]);

    const setPage = useCallback(
        (computePage: (prevPage: number) => number) => {
            const newPage = computePage(currentPage);
            if (props.paging === "row") {
                props.dataSourceRow.setOffset(newPage * pageSize);
            }
            if (props.paging === "column") {
                props.dataSourceColumn.setOffset(newPage * pageSize);
            }
            if (props.pageCell) {
                const columnCount = props.dataSourceColumn.items?.length ?? 0;
                props.dataSourceCell.setOffset(newPage * pageSize * columnCount);
                setLoading(true);
            }
        },
        [
            currentPage,
            props.dataSourceRow,
            props.paging,
            pageSize,
            props.dataSourceColumn,
            props.dataSourceCell,
            props.pageCell
        ]
    );

    let adjustedColumnCount = columnCount;
    if (showRowAs !== "none") {
        adjustedColumnCount += 1;
    }
    const pagination =
        props.paging === "row" ? (
            <Pagination
                canNextPage={props.dataSourceRow.hasMoreItems ?? false}
                canPreviousPage={currentPage !== 0}
                gotoPage={(page: number) => setPage && setPage(() => page)}
                nextPage={() => setPage && setPage(prev => prev + 1)}
                numberOfItems={props.dataSourceRow.totalCount}
                page={currentPage}
                pageSize={pageSize}
                previousPage={() => setPage && setPage(prev => prev - 1)}
            />
        ) : (
            <Pagination
                canNextPage={props.dataSourceColumn.hasMoreItems ?? false}
                canPreviousPage={currentPage !== 0}
                gotoPage={(page: number) => setPage && setPage(() => page)}
                nextPage={() => setPage && setPage(prev => prev + 1)}
                numberOfItems={props.dataSourceColumn.totalCount}
                page={currentPage}
                pageSize={pageSize}
                previousPage={() => setPage && setPage(prev => prev - 1)}
            />
        );

    return (
        <TableFrame
            {...props}
            columnCount={adjustedColumnCount}
            className={classNames(props.class, `mx-name-${props.name}`)}
            style={style}
            renderAs={renderAs}
            pagination={pagination}
            pagingPosition={props.pagingPosition}
            columnWidths={columnWidths}
            handleSetColumnWidth={handleSetColumnWidth}
        >
            {showHeaderAs !== "none" && (
                <Row key="header" renderAs={renderAs}>
                    {
                        <Headers
                            {...props}
                            columnWidths={columnWidths}
                            handleSetColumnWidth={handleSetColumnWidth}
                            resizable
                        />
                    }
                </Row>
            )}
            {sortedData.map((row, rowIndex) => (
                <Row className={rowClass?.get(row).value ?? ""} key={row.id} renderAs={renderAs}>
                    <Cells {...props} row={row} rowIndex={rowIndex} loading={loading} />
                </Row>
            ))}
            {rows.length === 0 && (
                <EmptyPlaceholder
                    showEmptyPlaceholder={props.showEmptyPlaceholder}
                    columnCount={adjustedColumnCount}
                    emptyPlaceholder={props.emptyPlaceholder}
                    renderAs={props.renderAs}
                />
            )}
        </TableFrame>
    );
}
