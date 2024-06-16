import { ObjectItem } from "mendix";
import { ReactElement } from "react";

export type ColumnId = string & { __columnIdTag: never };

/**
 * A generic column type for data grid.
 */
export interface GridColumn {
    columnId: ColumnId;
    columnIndex: number;
    renderCellContent: (item: ObjectItem) => ReactElement;
    isAvailable: boolean;

    // sorting
    canSort: boolean;
    toggleSort(): void;
}
